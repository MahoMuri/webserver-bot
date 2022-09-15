import { Interaction } from "discord.js";
import { Event } from "../interfaces/Event";

export const event: Event = {
    name: "interactionCreate",
    run: async (bot, interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const command = bot.commands.get(interaction.commandName);

        if (command) {
            await interaction.deferReply();
            command.run(bot, interaction);
        }
    },
};
