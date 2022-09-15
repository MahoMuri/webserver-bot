import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { Bot } from "../client";

interface Run {
    (bot: Bot, interaction: ChatInputCommandInteraction);
}

export interface Command {
    name: string;
    data:
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    category: string;
    description: string;
    run: Run;
}
