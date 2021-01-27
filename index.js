const Discord = require("discord.js");
const config = require("./config.json");
const respuestas = require("./respuestas.json");

const client = new Discord.Client();

const prefix = "!";

client.on('ready', () => {
    client.user.setActivity('el himno de mi Españita', {type: 'LISTENING'});
    console.log('El bot ha arrancado correctamente');
});

client.on('message', (message) => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
  
    const command = message.content.slice(prefix.length);
    
    if (command === "responde") {
        let randomIndex = Math.floor(Math.random() * respuestas.RESPUESTAS.length);
        let respuesta = respuestas.RESPUESTAS[randomIndex];
        message.reply(respuesta);
    }
 
});

client.on('voiceStateUpdate', (oldUserChannel, newUserChannel) => {

    // Comprobar que ha llegado
    if (newUserChannel.channel !== null && oldUserChannel.channel === null) {

        if (newUserChannel.member.user.username) {
            return; // Era un bot
        }

        console.log("Ha llegado a un nuevo canal: " + newUserChannel.member.nickname);
        // Comprobar que no se haya cambiado el estado
        if(oldUserChannel.selfDeaf === newUserChannel.selfDeaf 
            && oldUserChannel.selfMute === newUserChannel.selfMute) {

                newUserChannel.channel.join().then(connection => {
                    const dispatcher = connection.play('./audio.mp3');
                    dispatcher.on("finish", () => {
                        newUserChannel.channel.leave();
                    });
                }).catch(err => {
                    newUserChannel.channel.leave();
                    console.log(err)
                });

        } 

    }
});

client.login(config.BOT_TOKEN);


