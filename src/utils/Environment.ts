import { readFileSync } from "fs";
import { resolve } from "path";
import { Config } from "../interfaces/Config";

export function getEnvironmentConfiguration() {
    const { NODE_ENV: mode } = process.env;

    const configFile = resolve(__dirname, "..", "..", "config", `${mode}.json`);

    let cfg: Config;

    try {
        cfg = JSON.parse(
            readFileSync(configFile, { encoding: "utf-8" })
        ) as Config;
        cfg.token = process.env[cfg.token];
        cfg.mode = mode;
    } catch (error) {
        console.error(error);
        cfg = {} as Config;
    }

    return cfg;
}
