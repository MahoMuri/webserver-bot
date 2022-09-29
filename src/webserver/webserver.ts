import { ChannelType, SnowflakeUtil, User } from "discord.js";
import express, { Express, Router } from "express";
import { Bot } from "../client";

export class WebServer {
    bot: Bot;

    webServer: Express;

    router: Router;

    constructor(bot: Bot) {
        this.bot = bot;
        this.webServer = express();
        this.router = Router();
    }

    preFlight() {
        this.webServer.use("/api", this.router);

        this.webServer.all("*", (req, res) => {
            res.sendStatus(404);
        });

        this.webServer.listen(this.bot.config.port, () => {
            this.bot.consola.success(
                `WebServer listening at port ${this.bot.config.port}`
            );
            this.handleRoutes();
        });

        return this;
    }

    private handleRoutes() {
        this.router.get("/users/:idOrUsername", async (req, res) => {
            const { idOrUsername } = req.params;
            const { channel } = req.query;

            let user: User;

            try {
                if (channel) {
                    const guildChannel = await this.bot.channels.fetch(
                        channel as string
                    );

                    if (guildChannel.type !== ChannelType.GuildText) {
                        res.status(400).send(
                            "Provided channel is not a text channel!"
                        );
                        return;
                    }

                    user = guildChannel.members.find(
                        (u) => u.id === idOrUsername
                    )?.user;

                    if (!user) {
                        user = guildChannel.members.find(
                            (u) => u.user.username === idOrUsername
                        )?.user;
                    }
                } else {
                    try {
                        SnowflakeUtil.deconstruct(idOrUsername);
                        user = await this.bot.users.fetch(idOrUsername);
                    } catch (error) {
                        user = this.bot.users.cache.find(
                            (u) => u.username === idOrUsername
                        );
                    }
                }

                if (!user) {
                    res.status(404).send(
                        "User not found or cached! Try adding a channel ID."
                    );
                    return;
                }
            } catch (error) {
                res.send(error.message);
                this.bot.consola.error(error);
            }

            res.send(user);
        });
    }
}
