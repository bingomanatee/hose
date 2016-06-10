"use strict";

var tap = require('tap');
var hose = require('../lib/hose');
var path = require('path');

var ROOT = path.dirname(__dirname);
console.log('root: ', ROOT);

tap.test('hose', function (hoseTest) {

    hoseTest.test('filepath', testFilepath => {

        testFilepath.equal(hose.filePath('myfile.txt'), ROOT + '/stories/myfile.txt');

        testFilepath.end();
    });

    hoseTest.test('endsAtPar', testEnds => {
        testEnds.notOk(hose.endsAtPar("I end with a single new line.\n"));
        testEnds.ok(hose.endsAtPar("I end with a two new lines.\n\n"));
        testEnds.notOk(hose.endsAtPar("I do not have any new line."));
        testEnds.end();
    });

    hoseTest.test('eachPar', testEachPar => {
        const pars = [];

        // test a passthrough that simply echoes paragraphs into pars.
        hose.eachPar('test/the-saga-of-foo-and-bar.txt', par => 
            pars.push(par), () => {
            console.log(pars);
            testEachPar.same(pars,  [ 'Foo liked grapes.',
                "Bar did not like grapes.\nWhich is why Foo did not like Bar.",
                'Foo ate bar.' ]);
            testEachPar.end();
        });
    });



    hoseTest.end();
});
