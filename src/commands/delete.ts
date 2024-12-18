import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Permissions, TextChannel } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("delete")
  .setDescription("Deletes the specified number of messages in the current channel.")
  .addIntegerOption(option =>
    option.setName("amount")
      .setDescription("Number of messages to delete (up to 50).")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(50)
  )
  .setDefaultMemberPermissions(Permissions.FLAGS.ADMINISTRATOR);

export async function execute(interaction: CommandInteraction) {

  if (!(interaction.channel instanceof TextChannel)) {
    return interaction.reply({
      content: "This command can only be used in text channels.",
      ephemeral: true,
    });
  }

  if (
    !interaction.guild?.me?.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)
  ) {
    return interaction.reply({
      content: "I don't have permission to manage messages in this channel.",
      ephemeral: true,
    });
  }

  const amount = interaction.options.getInteger("amount");

  if (!amount || amount < 1 || amount > 50) {
    return interaction.reply({
      content: "Please specify a valid number of messages to delete (1-50).",
      ephemeral: true,
    });
  }

  try {
    const messages = await interaction.channel.messages.fetch({ limit: amount });

    const messagesToDelete = messages.filter((message) => {
      return message.createdTimestamp > Date.now() - 14 * 24 * 60 * 60 * 1000;
    });

    if (messagesToDelete.size === 0) {
      return interaction.reply({
        content: "No messages can be deleted because they are older than 14 days.",
        ephemeral: true,
      });
    }

    // Bulk delete messages
    await interaction.channel.bulkDelete(messagesToDelete, true);

    return interaction.reply({
      content: `Successfully deleted the last ${messagesToDelete.size} messages!`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error deleting messages:", error);
    return interaction.reply({
      content: "An error occurred while trying to delete messages. Please try again later.",
      ephemeral: true,
    });
  }
}
