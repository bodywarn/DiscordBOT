import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Replies with the profile picture of the tagged user")
  .addUserOption(option => 
    option.setName('user')
      .setDescription('The user to get the profile picture of')
      .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  
  const user = interaction.options.getUser('user') || interaction.user;

  const isAnimated = user.avatar?.startsWith("a_"); 
  const avatarUrl = user.displayAvatarURL({
    format: isAnimated ? "gif" : "png", 
    size: 512,
  });
  
  return interaction.reply({
    content: `${user.username}'s profile picture:`,
    embeds: [{
      image: {
        url: avatarUrl,
      },
    }],
  });
}