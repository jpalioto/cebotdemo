var builder = require('botbuilder');
var restify = require('restify');

var connector = new builder.ChatConnector();
var bot  = new builder.UniversalBot(connector);

bot.dialog('/', [
    (s) => { builder.Prompts.text(s, "What's your name?"); },
    (s,r) => { 
        s.userData.name = r.response;
        builder.Prompts.choice(s, "Choice?", "A|B|C");
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