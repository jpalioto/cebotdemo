var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
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