"use strict";

var fs = require('fs');
var path = require('path');
var _ = require('lodash');

const parSplitRE = /[\r\n]+[\s]*[\r\n]+/;
const endsAtParRE = /[\r\n]+[\s]*[\r\n]+$/;

var hose = {
    filePath: (filename) => {
        return path.resolve(__dirname, '../stories/', filename);
    },
    eachPar: (filename, parHandler, onComplete) => {
        const filePath = hose.filePath(filename);

        const stream = fs.createReadStream(filePath);
        
        let endsAtPar = true;
        let parFragment = '';
        stream.on('data', chunk => {
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
            
                pars = pars.map(text => _.trim(text));
            
                pars.forEach(parHandler);
            }
        );
        
        stream.on('end', onComplete);
    },
    endsAtPar: text => endsAtParRE.test(text)
};

module.exports = hose;
