const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const pointsFile = "./points.json";

if (!fs.existsSync(pointsFile)) {
    fs.writeFileSync(pointsFile, JSON.stringify({}));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("points")
        .setDescription("To see your points.")
    .addUserOption(option => option.setName("user").setDescription("The user to see their points.").setRequired(false)),
    async execute(client, interaction) {
        const user = interaction.options.getUser("user") || interaction.user;

        let pointsData = JSON.parse(fs.readFileSync(pointsFile, "utf8"));

        const userPoints = pointsData[user.id] || 0;
        
        const embed = new EmbedBuilder()
        .setAuthor({
name: user.username,
iconURL: user.displayAvatarURL({ format: 'png' })
})
        .setDescription(`**الرصيد الحالي لـ ${user.username}**
${userPoints}`)
.setThumbnail(user.displayAvatarURL({ format: 'png' }))
.setTimestamp()

        return interaction.reply({
            embeds: [embed]
        });
    }
};