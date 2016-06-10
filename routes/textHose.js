var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

function forUrl(text) {
    return encodeURIComponent(text);
}

function fromUrl(text) {
    return decodeURIComponent(text)
}

/* GET parsed story */
router.get('/par/:story', function(req, res, next) {
    res.render('textHose/par', { title: fromUrl(req.params.story) });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    fs.readdir(path.resolve(__dirname, '../stories'), function(err, stories) {
        res.render('textHose/index', { stories: stories, forUrl: forUrl });
    });
});

module.exports = router;
