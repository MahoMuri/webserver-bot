import express, { Express } from "express";
import { Bot } from "../client";
import routes from "./routes";

export class WebServer {
    bot: Bot;

    webServer: Express;

    constructor(bot: Bot) {
        this.bot = bot;
        this.webServer = express();
    }

    preFlight() {
        this.webServer.use("/api", routes);

        this.webServer.all("*", (req, res) => {
            res.sendStatus(404);
        });

        this.webServer.listen(this.bot.config.port, () => {
            this.bot.consola.success(
                `WebServer listening at port ${this.bot.config.port}`
            );
        });

        return this;
    }
}
