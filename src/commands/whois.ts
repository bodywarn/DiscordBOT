import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import fetch from "node-fetch";

export const data = new SlashCommandBuilder()
  .setName("whois")
  .setDescription("Get Roblox user information")
  .addStringOption(option =>
    option.setName("username")
      .setDescription("Enter the Roblox username")
      .setRequired(true)
  );

export async function execute(interaction: CommandInteraction) {
  const username = interaction.options.getString("username");

  if (!username) {
    return interaction.reply("Please provide a valid Roblox username.");
  }

  try {
    const response = await fetch(`https://users.roblox.com/v1/usernames/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usernames: [username]
      })
    });

    if (!response.ok) {
      return interaction.reply("Error: Unable to fetch user data from Roblox.");
    }

    const data = await response.json();

    if (data.errorMessage) {
      return interaction.reply(`Error: ${data.errorMessage}`);
    }

    const robloxUser = data.data[0];
    if (!robloxUser) {
      return interaction.reply(`Could not find a user with the username "${username}"`);
    }

    const robloxUsername = robloxUser.name;
    const robloxUserId = robloxUser.id;
    const robloxAvatar = `https://www.roblox.com/headshot-thumbnail/image?userId=${robloxUserId}&width=420&height=420&format=png`;

    return interaction.reply({
      content: `**Username:** ${robloxUsername}\n**User ID:** ${robloxUserId}\n**Avatar:** ${robloxAvatar}`,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return interaction.reply("There was an error retrieving the Roblox user data.");
  }
}