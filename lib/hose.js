"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Tokenizer = require('sentence-tokenizer');
var tokenizer = new Tokenizer('Chuck');

const parSplitRE = /[\r\n]+[\s]*[\r\n]+/;
const endsAtParRE = /[\r\n]+[\s]*[\r\n]+$/;

var hose = {
    filePath: (filename) => {
        return path.resolve(__dirname, '../stories/', filename);
    },
    eachPar: (filename, onPar, onComplete) => {
        const filePath = hose.filePath(filename);

        const stream = fs.createReadStream(filePath);

        let endsAtPar = true;
        let parFragment = '';
        stream.on('data', chunk => {
            try {
                let text = chunk.toString();
                let pars = text.split(parSplitRE);

                // reassemble split paragraph. Almost all paragraphs will be split.

                if (!endsAtPar) {
                    let firstPar = parFragment + pars.shift();
                    pars.unshift(firstPar);
                    parFragment = '';
                }

                endsAtPar = hose.endsAtPar(_.last(pars));
                if (endsAtPar) {
                    parFragment = pars.pop();
                }

                pars.map(text => _.trim(text)).forEach(onPar);
            } catch(err) {
                console.log('error in hose/eachPar: ',err);
            }
            }
        );
        
        stream.on('error', err => console.log('stream error: ', err));

        stream.on('end', () => {
            if (parFragment) {
                onPar(_.trim(parFragment));
            }
            onComplete();
        });
    },

    eachSentence: (filename, onSentence, onComplete) => {
        hose.eachPar(filename, (par) => {
            tokenizer.setEntry(par);
            tokenizer.getSentences().forEach(onSentence);
        }, onComplete);
    },
    
    endsAtPar: text => endsAtParRE.test(text)
};

module.exports = hose;
