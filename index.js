var builder = require('botbuilder');
var restify = require('restify');
var _ = require('lodash');
var rp = require('request-promise').defaults({encoding:null});

var connector = new builder.ChatConnector();
var bot  = new builder.UniversalBot(connector);

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

var server = restify.createServer();
server.listen(3978, function() {
    console.log('test bot endpont at http://localhost:3978/api/messages');
});
server.post('/api/messages', connector.listen());

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
            'Ocp-Apim-Subscription-Key': '522f876ee2a34f62aa4e2e4e76ab46fe',
            'Content-Type' : 'application/octet-stream',
            'processData' : 'false'
        },
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
