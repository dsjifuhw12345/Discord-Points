const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { CommandPermissions } = require("../config.js")
const fs = require("fs");
const pointsFile = "./points.json";

if (!fs.existsSync(pointsFile)) {
    fs.writeFileSync(pointsFile, JSON.stringify({}));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-point")
        .setDescription("Add points to a member.")
        .addUserOption(option => option.setName("user").setDescription("The user to give points to.").setRequired(true))
        .addStringOption(option => option.setName("amount").setDescription("The amount of points to give.").setRequired(true)),

    async execute(client, interaction) {
        if (!interaction.member.roles.cache.some(role => CommandPermissions.includes(role.id))) {
    return interaction.reply({ content: "**:x: You don't have permission to use this command.**", ephemeral: true });
}

        const user = interaction.options.getUser("user");
        const amount = parseInt(interaction.options.getString("amount"));

        if (isNaN(amount) || amount <= 0) {
            return interaction.reply({ content: "Please provide a valid amount of points.", ephemeral: true });
        }

        let pointsData = JSON.parse(fs.readFileSync(pointsFile, "utf8"));

        if (!pointsData[user.id]) {
            pointsData[user.id] = 0;
        }

        pointsData[user.id] += amount;

        fs.writeFileSync(pointsFile, JSON.stringify(pointsData, null, 2));
        
        const embed = new EmbedBuilder()
        .setAuthor({
name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ format: 'png' })
})
        .setTitle("تم الإضافة بنجاح")
        .setDescription(`**بواسطة**
${interaction.user}
**اضاف**
$${amount}
**المستلم**
${user}
**الرصيد الحالي للمستلم**
${pointsData[user.id]}`)
        .setThumbnail(user.displayAvatarURL({ format: 'png' }))

        .setTimestamp()

        return interaction.reply({
            embeds: [embed] 
        });
    }
};