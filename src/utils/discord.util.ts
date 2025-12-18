import { Client, GatewayIntentBits, EmbedBuilder, TextChannel } from "discord.js";

const guildId = process.env.DISCORD_SERVER_ID || "";
const channelId = process.env.DISCORD_CHANNEL_ID || "";

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds] 
});

client.login(process.env.DISCORD_BOT_TOKEN);

export const postToDiscord = async (
    { message }:
    { message: string}
) => {
    try {
        if (!client.isReady()) {
            await new Promise((resolve) => client.once("ready", resolve));
        }

        const guild = await client.guilds.fetch(guildId);
        if (!guild) throw new Error("Bot is not in the specified server.");

        const channel = await guild.channels.fetch(channelId);

        if (channel instanceof TextChannel) {
            await channel.send(message);
            return "Message sent successfully";
        } else {
            throw new Error("Target is not a text channel.");
        }
    } catch (error) {
        console.error("Discord Posting Error:", error);
    }
};