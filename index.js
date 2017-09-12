/* This bot is a quick example of how to send an image to Cognitive Services Vision API*/

var builder = require('botbuilder');
var restify = require('restify');
var _ = require('lodash');
var rp = require('request-promise').defaults({encoding:null});

var connector = new builder.ChatConnector();
var bot  = new builder.UniversalBot(connector);

// Simple dialog ... say "hi" and then upload an image.
bot.dialog('/', [
    (s) => { builder.Prompts.attachment(s, "Which image?"); },
    (s,r) => { 
        _.forEach( s.message.attachments,
            (i) => { 
                getImageBytes(i.contentUrl).then( (v) => s.send(v) );
            }
        );
    },
    (s,r) => {
        s.send(r.response.entity);
    }
]);

// Create a REST endpoint for testing the bot
var server = restify.createServer();
server.listen(3978, function() {
    console.log('test bot endpont at http://localhost:3978/api/messages');
});
server.post('/api/messages', connector.listen());

// Here we get the image bytes and process the image to be set to Cognitive Services
var getImageBytes = function( imageUrl )
{
    return rp(imageUrl).then(
        (img) => { return processImage(img); }
    );
}

var processImage = function( body )
{
    var options = {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': '<<your subscription key here>>',  // put your subscription key here
            'Content-Type' : 'application/octet-stream',
            'processData' : 'false'
        },
        // You may need to change this URL depending on your datacenter
        uri: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/describe?maxCandidates=1',
        body: body
    };

    return rp(options)
        .then(function (res) {

            console.log(res.toString());
            return res.toString();
        })
        .catch(function (err) {
            // POST failed... 

            throw err;
        });
};
