import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, TextChannel, CategoryChannel, GuildMember } from "discord.js";
import { createTicket } from "../firebase";

export const data = new SlashCommandBuilder()
    .setName("bug")
    .setDescription("Create a new bug ticket")
    .addStringOption((option) =>
        option
            .setName("description")
            .setDescription("Describe the bug")
            .setRequired(true)
    );

export async function execute(interaction: CommandInteraction, client: Client) {
    if (!interaction?.guild || !interaction.channelId) {
        return;
    }

    const guild = interaction.guild;
    const user = interaction.user;
    const problemDescription = interaction.options.getString("description")!;

    const developerRoleId = '1313434439950405632'; 
    const developerRole = guild.roles.cache.get(developerRoleId);
    if (!developerRole) {
        return interaction.reply({
            content: "The specified role with that ID was not found.",
            ephemeral: true,
        });
    }

    const category = guild.channels.cache.find((c) => c.name === "Tickets" && c.type === "GUILD_CATEGORY");
    if (!category) {
        return interaction.reply({
            content: "No 'Tickets' category found. Please create it first.",
            ephemeral: true,
        });
    }

    const ticketChannel = await guild.channels.create(`ticket-${Date.now()}`, {
        type: "GUILD_TEXT",
        parent: category.id, 
        permissionOverwrites: [
            {
                id: guild.id,
                deny: ["VIEW_CHANNEL"], 
            },
            {
                id: developerRole.id,
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            },
            {
                id: user.id, 
                allow: ["VIEW_CHANNEL", "SEND_MESSAGES"],
            },
        ],
    });

    ticketChannel.send(`**Developer is on the way**: <@&${developerRoleId}>\n**User:** <@${user.id}>\n**Problem:** ${problemDescription}`);

    await createTicket(ticketChannel.id, problemDescription);

    return interaction.reply({
        content: `Your ticket has been created: ${ticketChannel.toString()}`,
        ephemeral: true,
    });
}
