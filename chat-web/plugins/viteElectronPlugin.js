import esbuild from 'esbuild'
import {spawn} from 'child_process'
import electron from 'electron'
export let viteElectronPlugin = () => {
    return {
        name: "vite-electron-plugin",
        configureServer(server) {
            esbuild.buildSync({
                entryPoints: ["./main/mainElectronEntry.ts"],
                bundle: true,
                platform: "node",
                outfile: "./dist/mainElectronEntry.cjs",
                external: ["electron"],
            });
            server.httpServer.once("listening", () => {
                let addressInfo = server.httpServer.address();
                let httpAddress = `https://localhost:${addressInfo.port}`;
                let electronProcess = spawn(electron.toString(), ["./dist/mainElectronEntry.cjs", httpAddress], {
                    cwd: process.cwd(),
                    stdio: "inherit",
                });
                electronProcess.on("close", () => {
                    server.close();
                    process.exit();
                });
            });
        },
    };
};

export let getReplacer = () => {
    let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    let result = {};
    for (let item of externalModels) {
        result[item] = () => ({
            find: new RegExp(`^${item}$`),
            code: `const ${item} = require('${item}');export { ${item} as default }`,
        });
    }
    result["electron"] = () => {
        let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
        return {
            find: new RegExp(`^electron$`),
            code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
        };
    };
    return result;
};