/**
 * @file Share Routes
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
var routes = require('express').Router();
//var postIdParamToPost = require('../services/posts/params/postidtopost');

//postIdParamToPost(routes);

routes.get('/:postId', (req, res, next) => {

    var html = '<html><head><title>Share the Envy</title>';

    // html += '<script type="text/javascript">';
    // html += 'setTimeout(function () { \n';
    // html += 'console.log(\'Go to AppStore\'); //window.location = "";\n';
    // html += '}, 5);\n';
    // html += 'window.location = \'envy://posts/' + req.post._id + '\';\n';
    // html += '</script>';
    html += '</head><body>';
    html += '<div style="width:150px;height:150px;margin:0 auto;outline:2px solid #000;">Envy Logo</div>\n';
    html += '<div style="text-align:center;"><h1>Share</h1>';
    html += '<p>' + req.post.description + '</p>';
    html += '<p>' + req.post.description + '</p>';
    html += '<p><a href="#" onclick="return false;" style="inline-block;background-color:#000;color:#fff;border-radius:10px;padding:10px;">Open AppStore</a></p>';
    html += '</div>\n';
    html += '</body></html>';
    res.send(html);

});

module.exports = routes