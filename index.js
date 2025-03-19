require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const sqlite3 = require("sqlite3").verbose();

const PREFIX = "!annive"; // 🔧 Modifier ici pour changer la commande principale

const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// 📂 Connexion à la base de données SQLite
const db = new sqlite3.Database("./data/birthdays.db", (err) => {
  if (err) console.error("Erreur SQLite :", err);
  else {
    console.log("📂 Base de données connectée !");
    db.run(
      "CREATE TABLE IF NOT EXISTS birthdays (user_id TEXT PRIMARY KEY, username TEXT, birthday TEXT)"
    );
    db.run(
        "CREATE TABLE IF NOT EXISTS servers (server_id TEXT PRIMARY KEY, server_name TEXT, birthday_channel TEXT)"
    );
  }
});

client.once("ready", () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
});

client.on("guildCreate", (guild) => {
    db.run(
        "INSERT OR REPLACE INTO servers (server_id, server_name) VALUES (?, ?)",
      [guild.id, guild.name],
      (err) => {
        if (err) {
          console.error("❌ Erreur SQLite :", err);
        } else {
          console.log(`✅ Serveur enregistré : ${guild.name} (${guild.id})`);
        }
      }
    );
});

// 🎂 Commandes d'anniversaire
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");
  const command = args[0].toLowerCase();

    if (command === PREFIX) {
        if (args[1] === "add") {
        let birthday;
        let user;

        const filteredArgs = args.filter(arg => arg.trim() !== "");

        if (message.mentions.users.size > 0) {
            user = message.mentions.users.first();
            birthday = filteredArgs[3];
        } else {
            user = message.author;
            birthday = filteredArgs[2];
        }

        console.log(message.mentions);
        const dateRegex = /^\d{2}\/\d{2}$/;
        if (!birthday || !dateRegex.test(birthday)) {
            
            return message.reply("⚠️ Format incorrect ! Utilisez `JJ/MM` (ex: `15/08`).");
        }

        db.run(
            "INSERT OR REPLACE INTO birthdays (user_id, username, birthday) VALUES (?, ?, ?)",
            [user.id, user.username, birthday],
            (err) => {
            if (err) {
                console.error("Erreur SQLite :", err);
                return message.reply("❌ Erreur lors de l'enregistrement.");
            }
            message.reply(`🎂 Anniversaire enregistré pour **${user.username}** le **${birthday}** !`);
            }
        );
        }

        // 📌 Voir les anniversaires du jour
        else if (args[1] === "today") {
        const today = new Date();
        const todayStr = today.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
        });

        db.all("SELECT username FROM birthdays WHERE birthday = ?", [todayStr], (err, rows) => {
            if (err) {
            console.error("Erreur SQLite :", err);
            return message.reply("❌ Erreur lors de la récupération.");
            }

            if (rows.length > 0) {
            const names = rows.map((row) => `🎉 **${row.username}**`).join("\n");
            message.channel.send(`🎂 **Anniversaires du jour** :\n${names}`);
            } else {
                badIconArray = ["😅", "🥲", "🥹", "❌", "☹️", "⚠️"];
                message.channel.send(badIconArray[getRandomInt(badIconArray.length)] +" Aucun anniversaire aujourd’hui.");
            }
        });
        }

        // 📌 Voir les prochains anniversaires
        else if (args[1] === "list") {
        db.all("SELECT username, birthday FROM birthdays ORDER BY birthday ASC", [], (err, rows) => {
            if (err) {
            console.error("Erreur SQLite :", err);
            return message.reply("❌ Erreur lors de la récupération.");
            }

            if (rows.length > 0) {
            const upcomingBirthdays = rows
                .map((row) => `🎂 **${row.username}** - ${row.birthday}`)
                .join("\n");
            message.channel.send(`📅 **Prochains anniversaires** :\n${upcomingBirthdays}`);
            } else {
            message.channel.send("📭 Aucun anniversaire enregistré.");
            }
        });
        }

        else if (args[1] === "setchannel") {
            if (!message.member.permissions.has("ADMINISTRATOR")) {
                return message.reply("❌ Vous devez être administrateur pour exécuter cette commande !");
            }

            let channelId;

            // message.channel.id
            
            if (message.mentions.channels.size > 0) {
                channelId = message.mentions.channels.first().id;
            } else {
                channelId = message.channel.id; // Si aucun canal mentionné, utiliser celui où la commande a été envoyée
            }

            console.log(channelId);
        
            db.run(
            "INSERT OR REPLACE INTO servers (server_id, birthday_channel) VALUES (?, ?)",
            [message.guild.id, channelId],
            (err) => {
                if (err) {
                console.error("Erreur SQLite :", err);
                return message.reply("❌ Une erreur est survenue.");
                }
                message.reply(`✅ Les annonces d'anniversaires seront désormais envoyées dans <#${channelId}>.`);
            }
            );
        }

        else if (args[1] === "servers") {
            const ownerId = "1028389273407328296"; // Remplacez par votre ID Discord
          
            if (message.author.id !== ownerId) {
              return message.reply("❌ Vous n'avez pas la permission d'exécuter cette commande.");
            }
          
            db.all("SELECT server_name, server_id, birthday_channel FROM servers", [], (err, rows) => {
              if (err) {
                console.error("Erreur SQLite :", err);
                return message.reply("❌ Erreur lors de la récupération des serveurs.");
              }
          
              if (rows.length === 0) {
                return message.reply("📭 Aucun serveur enregistré.");
              }
          
              const serverList = rows
                .map(
                  (row, index) =>
                    `**${index + 1}. ${row.server_name}** (${row.server_id})\n📢 Canal : ${
                      row.birthday_channel ? `<#${row.birthday_channel}>` : "Non défini"
                    }`
                )
                .join("\n\n");
          
              message.author.send(`📋 **Liste des serveurs où le bot est présent :**\n\n${serverList}`)
                .then(() => message.reply("📩 Liste envoyée en message privé."))
                .catch(() => message.reply("❌ Impossible d'envoyer la liste en MP."));
            });
        }
          

        // 📌 Aide sur la commande
        else {
            message.reply(
                `❌ Commande invalide. Utilisez :\n` +
                `\`${PREFIX} add <JJ/MM>\` (pour vous)\n` +
                `\`${PREFIX} add @utilisateur <JJ/MM>\` (pour un autre)\n` +
                `\`${PREFIX} today \` (voir les anniversaires du jour)\n` +
                `\`${PREFIX} list \` (voir la liste des prochains anniversaires)\n` +
                `\`${PREFIX} setchannel \`(définir le channel actuel comme channel des annonces)\n` +
                `\`${PREFIX} setchannel #channel \`(définir le channel #channel comme channel des annonces)\n`
            );
        }
    } 
});

// 🔑 Connexion au bot
client.login(process.env.TOKEN);
