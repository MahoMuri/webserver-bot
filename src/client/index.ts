import { Client, Collection, IntentsBitField } from "discord.js";
import consola, { Consola } from "consola";
import { table, getBorderCharacters } from "table";
import path from "path";
import { readdirSync } from "fs";

import { Command } from "../interfaces/Command";
import { Event } from "../interfaces/Event";
import { getEnvironmentConfiguration } from "../utils/Environment";
import { Colors } from "../interfaces/Colors";
import { WebServer } from "../webserver/webserver";

export class Bot extends Client {
    categories = readdirSync(path.join(__dirname, "..", "commands"));

    commands: Collection<string, Command> = new Collection();

    events: Collection<string, Event> = new Collection();

    config = getEnvironmentConfiguration();

    consola: Consola;

    webServer: WebServer;

    colors = Colors;

    // Constructor for intents
    constructor() {
        super({
            allowedMentions: {
                parse: ["users", "roles"],
            },
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
            ],
        });
    }

    async init() {
        await this.login(this.config.token);
        consola.wrapConsole();
        this.consola = consola.withScope(`@${this.user.username}｜`);

        this.webServer = new WebServer(this).preFlight();

        // Command registry
        const cmdTable = [];
        const commandsPath = path.join(__dirname, "..", "commands");
        this.categories.forEach((dir) => {
            const commands = readdirSync(`${commandsPath}/${dir}`).filter(
                (file) => file.endsWith(".ts")
            );

            commands.forEach((file) => {
                try {
                    const {
                        command,
                    } = require(`${commandsPath}/${dir}/${file}`);
                    this.commands.set(command.name, command);
                    cmdTable.push([file, "Loaded"]);
                } catch (error) {
                    cmdTable.push([file, `${error.message}`]);
                }
            });
        });

        // Event registry
        const eventTable = [];
        const eventsPath = path.join(__dirname, "..", "events");
        readdirSync(eventsPath).forEach((file) => {
            try {
                const { event } = require(`${eventsPath}/${file}`);
                this.events.set(event.name, event);
                this.on(event.name, event.run.bind(null, this));

                eventTable.push([file, "Loaded"]);
            } catch (error) {
                eventTable.push([file, `${error.message}`]);
            }
        });
        this.consola.log(
            `${table(cmdTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Commands",
                },
            })}${table(eventTable, {
                border: getBorderCharacters("norc"),
                header: {
                    alignment: "center",
                    content: "Events",
                },
            })}`
        );
    }
}
