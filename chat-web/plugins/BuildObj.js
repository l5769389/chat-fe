import path from "path";
import fs from "fs";
import esbuild from "esbuild";
import electronBuilder from 'electron-builder'
export class BuildObj {
    //编译主进程代码
    buildMain() {
        esbuild.buildSync({
            entryPoints: ["./src/mainElectronEntry.cjs"],
            bundle: true,
            platform: "node",
            minify: true,
            outfile: "./dist/mainElectronEntry.js",
            external: ["electron"],
        });
    }
    //为生产环境准备package.json
    preparePackageJson() {
        let pkgJsonPath = path.join(process.cwd(), "package.json");
        let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
        let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
        localPkgJson.main = "mainElectronEntry.js";
        delete localPkgJson.scripts;
        delete localPkgJson.devDependencies;
        localPkgJson.devDependencies = { electron: electronConfig };
        let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
        fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
        fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
    }
    //使用electron-builder制成安装包
    buildInstaller() {
        let options = {
            config: {
                directories: {
                    output: path.join(process.cwd(), "release"),
                    app: path.join(process.cwd(), "dist"),
                },
                files: ["**"],
                extends: null,
                productName: "JueJin",
                appId: "com.juejin.desktop",
                asar: true,
                nsis: {
                    oneClick: true,
                    perMachine: true,
                    allowToChangeInstallationDirectory: false,
                    createDesktopShortcut: true,
                    createStartMenuShortcut: true,
                    shortcutName: "juejinDesktop",
                },
                publish: [{ provider: "generic", url: "http://localhost:5500/" }],
            },
            project: process.cwd(),
        };
        return electronBuilder.build(options);
    }
}
