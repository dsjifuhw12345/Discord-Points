const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const pointsFile = "./points.json";

if (!fs.existsSync(pointsFile)) {
    fs.writeFileSync(pointsFile, JSON.stringify({}));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("top")
        .setDescription("To see the top 10 in the points."),
    async execute(client, interaction) {
        let pointsData = JSON.parse(fs.readFileSync(pointsFile, "utf8"));

        const sortedPoints = Object.keys(pointsData)
            .map(userId => ({ userId, points: pointsData[userId] }))
            .sort((a, b) => b.points - a.points);  

        const top10 = sortedPoints.slice(0, 10);

        const embed = new EmbedBuilder()
            .setTitle("أعلى 10 أشخاص بالنقاط")
            .setTimestamp();

        top10.forEach((entry, index) => {
            const user = client.users.cache.get(entry.userId);
            const rankText = index === 0 ? `👑 ${user.username}` : user.username;
            embed.addFields({
                name: `#${index + 1} ${rankText}`,
                value: `$${entry.points}`,
                inline: true
            });
        });

        return interaction.reply({
            embeds: [embed]
        });
    }
};
