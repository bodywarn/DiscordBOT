import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Role } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("role")
  .setDescription("Assign a role to a user")
  .addUserOption(option =>
    option.setName("user")
      .setDescription("The user to assign the role to")
      .setRequired(true))
  .addRoleOption(option =>
    option.setName("role")
      .setDescription("The role to assign")
      .setRequired(true));

export async function execute(interaction: CommandInteraction) {

  const memberPermissions = (interaction.member as GuildMember).permissions;


  if (!memberPermissions.has("ADMINISTRATOR")) {
    return interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });
  }

  const user = interaction.options.getUser("user");
  const role = interaction.options.getRole("role");

  if (!user || !role) {
    return interaction.reply({
      content: "Invalid user or role.",
      ephemeral: true,
    });
  }


  if (!(role instanceof Role)) {
    try {
     
      const guildRole = await interaction.guild?.roles.fetch(role.id);
      if (!guildRole) {
        return interaction.reply({
          content: "The specified role does not exist in this guild.",
          ephemeral: true,
        });
      }


      const member = interaction.guild?.members.cache.get(user.id);
      if (!member) {
        return interaction.reply({
          content: "User is not in the guild.",
          ephemeral: true,
        });
      }


      await member.roles.add(guildRole);
      return interaction.reply({
        content: `${user.tag} has been assigned the ${guildRole.name} role.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "An error occurred while assigning the role.",
        ephemeral: true,
      });
    }
  } else {
    try {

      const member = interaction.guild?.members.cache.get(user.id);
      if (!member) {
        return interaction.reply({
          content: "User is not in the guild.",
          ephemeral: true,
        });
      }


      await member.roles.add(role);
      return interaction.reply({
        content: `${user.tag} has been assigned the ${role.name} role.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "An error occurred while assigning the role.",
        ephemeral: true,
      });
    }
  }
}