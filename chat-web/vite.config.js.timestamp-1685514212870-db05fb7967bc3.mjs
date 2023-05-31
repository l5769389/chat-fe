// vite.config.js
import { defineConfig } from "file:///D:/chat/chat-fe/chat-web/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/chat/chat-fe/chat-web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import * as path2 from "path";
import AutoImport from "file:///D:/chat/chat-fe/chat-web/node_modules/unplugin-auto-import/dist/vite.js";
import { readFileSync } from "fs";
import vueJsx from "file:///D:/chat/chat-fe/chat-web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";

// plugins/viteElectronPlugin.js
import esbuild from "file:///D:/chat/chat-fe/chat-web/node_modules/esbuild/lib/main.js";
import { spawn } from "child_process";
import electron from "file:///D:/chat/chat-fe/chat-web/node_modules/electron/index.js";
var viteElectronPlugin = () => {
  return {
    name: "vite-electron-plugin",
    configureServer(server) {
      esbuild.buildSync({
        entryPoints: ["./main/mainElectronEntry.ts"],
        bundle: true,
        platform: "node",
        outfile: "./dist/mainElectronEntry.cjs",
        external: ["electron"]
      });
      server.httpServer.once("listening", () => {
        let addressInfo = server.httpServer.address();
        let httpAddress = `https://localhost:${addressInfo.port}`;
        let electronProcess = spawn(electron.toString(), ["./dist/mainElectronEntry.cjs", httpAddress], {
          cwd: process.cwd(),
          stdio: "inherit"
        });
        electronProcess.on("close", () => {
          server.close();
          process.exit();
        });
      });
    }
  };
};
var getReplacer = () => {
  let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
  let result = {};
  for (let item of externalModels) {
    result[item] = () => ({
      find: new RegExp(`^${item}$`),
      code: `const ${item} = require('${item}');export { ${item} as default }`
    });
  }
  result["electron"] = () => {
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
    return {
      find: new RegExp(`^electron$`),
      code: `const {${electronModules}} = require('electron');export {${electronModules}}`
    };
  };
  return result;
};

// vite.config.js
import optimizer from "file:///D:/chat/chat-fe/chat-web/node_modules/vite-plugin-optimizer/index.mjs";

// plugins/BuildObj.js
import path from "path";
import fs from "fs";
import esbuild2 from "file:///D:/chat/chat-fe/chat-web/node_modules/esbuild/lib/main.js";
import electronBuilder from "file:///D:/chat/chat-fe/chat-web/node_modules/electron-builder/out/index.js";
var BuildObj = class {
  //编译主进程代码
  buildMain() {
    esbuild2.buildSync({
      entryPoints: ["./main/mainElectronEntry.ts"],
      bundle: true,
      platform: "node",
      outfile: "./dist/mainElectronEntry.cjs",
      external: ["electron"]
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
          app: path.join(process.cwd(), "dist")
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
          shortcutName: "juejinDesktop"
        },
        publish: [{ provider: "generic", url: "http://localhost:5500/" }]
      },
      project: process.cwd()
    };
    return electronBuilder.build(options);
  }
};

// plugins/buildPlugin.js
var buildPlugin = () => {
  return {
    name: "build-plugin",
    closeBundle: () => {
      let buildObj = new BuildObj();
      buildObj.buildMain();
      buildObj.preparePackageJson();
      buildObj.buildInstaller();
    }
  };
};

// vite.config.js
var __vite_injected_original_dirname = "D:\\chat\\chat-fe\\chat-web";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue"]
    }),
    optimizer(getReplacer()),
    viteElectronPlugin(),
    vueJsx({})
  ],
  server: {
    host: "0.0.0.0",
    https: {
      key: readFileSync(path2.resolve(path2.join(__vite_injected_original_dirname, "/src/config/needIgnore/cert/localhost-key.pem"))),
      cert: readFileSync(path2.resolve(path2.join(__vite_injected_original_dirname, "/src/config/needIgnore/cert/localhost.pem")))
    }
  },
  resolve: {
    alias: {
      "@": path2.resolve("./src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path2.resolve(__vite_injected_original_dirname, "index.html"),
        capture: path2.resolve(__vite_injected_original_dirname, "pages/capture/index.html")
      },
      plugins: [buildPlugin()]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicGx1Z2lucy92aXRlRWxlY3Ryb25QbHVnaW4uanMiLCAicGx1Z2lucy9CdWlsZE9iai5qcyIsICJwbHVnaW5zL2J1aWxkUGx1Z2luLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcY2hhdFxcXFxjaGF0LWZlXFxcXGNoYXQtd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NoYXQvY2hhdC1mZS9jaGF0LXdlYi92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCB7cmVhZEZpbGVTeW5jfSBmcm9tICdmcyc7XHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IHtnZXRSZXBsYWNlciwgdml0ZUVsZWN0cm9uUGx1Z2lufSBmcm9tIFwiLi9wbHVnaW5zL3ZpdGVFbGVjdHJvblBsdWdpbi5qc1wiO1xyXG5pbXBvcnQgb3B0aW1pemVyIGZyb20gXCJ2aXRlLXBsdWdpbi1vcHRpbWl6ZXJcIjtcclxuaW1wb3J0IHtidWlsZFBsdWdpbn0gZnJvbSBcIi4vcGx1Z2lucy9idWlsZFBsdWdpbi5qc1wiO1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgIGltcG9ydHM6IFsndnVlJ11cclxuICAgIH0pLFxyXG4gICAgb3B0aW1pemVyKGdldFJlcGxhY2VyKCkpLFxyXG4gICAgdml0ZUVsZWN0cm9uUGx1Z2luKCksXHJcbiAgICB2dWVKc3goe30pLFxyXG4gIF0sXHJcbiAgc2VydmVyOntcclxuICAgIGhvc3Q6JzAuMC4wLjAnLFxyXG4gICAgaHR0cHM6IHtcclxuICAgICAga2V5OiByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsJy9zcmMvY29uZmlnL25lZWRJZ25vcmUvY2VydC9sb2NhbGhvc3Qta2V5LnBlbScpKSksXHJcbiAgICAgIGNlcnQ6IHJlYWRGaWxlU3luYyhwYXRoLnJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwnL3NyYy9jb25maWcvbmVlZElnbm9yZS9jZXJ0L2xvY2FsaG9zdC5wZW0nKSkpXHJcbiAgICB9XHJcbiAgfSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZSgnLi9zcmMnKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYnVpbGQ6e1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBpbnB1dDoge1xyXG4gICAgICAgIG1haW46cGF0aC5yZXNvbHZlKF9fZGlybmFtZSwnaW5kZXguaHRtbCcpLFxyXG4gICAgICAgIGNhcHR1cmU6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsJ3BhZ2VzL2NhcHR1cmUvaW5kZXguaHRtbCcpXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsdWdpbnM6IFtidWlsZFBsdWdpbigpXSxcclxuICAgIH0sXHJcbiAgfVxyXG59KVxyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGNoYXRcXFxcY2hhdC1mZVxcXFxjaGF0LXdlYlxcXFxwbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxccGx1Z2luc1xcXFx2aXRlRWxlY3Ryb25QbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NoYXQvY2hhdC1mZS9jaGF0LXdlYi9wbHVnaW5zL3ZpdGVFbGVjdHJvblBsdWdpbi5qc1wiO2ltcG9ydCBlc2J1aWxkIGZyb20gJ2VzYnVpbGQnXHJcbmltcG9ydCB7c3Bhd259IGZyb20gJ2NoaWxkX3Byb2Nlc3MnXHJcbmltcG9ydCBlbGVjdHJvbiBmcm9tICdlbGVjdHJvbidcclxuZXhwb3J0IGxldCB2aXRlRWxlY3Ryb25QbHVnaW4gPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWU6IFwidml0ZS1lbGVjdHJvbi1wbHVnaW5cIixcclxuICAgICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XHJcbiAgICAgICAgICAgIGVzYnVpbGQuYnVpbGRTeW5jKHtcclxuICAgICAgICAgICAgICAgIGVudHJ5UG9pbnRzOiBbXCIuL21haW4vbWFpbkVsZWN0cm9uRW50cnkudHNcIl0sXHJcbiAgICAgICAgICAgICAgICBidW5kbGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybTogXCJub2RlXCIsXHJcbiAgICAgICAgICAgICAgICBvdXRmaWxlOiBcIi4vZGlzdC9tYWluRWxlY3Ryb25FbnRyeS5janNcIixcclxuICAgICAgICAgICAgICAgIGV4dGVybmFsOiBbXCJlbGVjdHJvblwiXSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHNlcnZlci5odHRwU2VydmVyLm9uY2UoXCJsaXN0ZW5pbmdcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFkZHJlc3NJbmZvID0gc2VydmVyLmh0dHBTZXJ2ZXIuYWRkcmVzcygpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGh0dHBBZGRyZXNzID0gYGh0dHBzOi8vbG9jYWxob3N0OiR7YWRkcmVzc0luZm8ucG9ydH1gO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVsZWN0cm9uUHJvY2VzcyA9IHNwYXduKGVsZWN0cm9uLnRvU3RyaW5nKCksIFtcIi4vZGlzdC9tYWluRWxlY3Ryb25FbnRyeS5janNcIiwgaHR0cEFkZHJlc3NdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZGlvOiBcImluaGVyaXRcIixcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZWxlY3Ryb25Qcm9jZXNzLm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGxldCBnZXRSZXBsYWNlciA9ICgpID0+IHtcclxuICAgIGxldCBleHRlcm5hbE1vZGVscyA9IFtcIm9zXCIsIFwiZnNcIiwgXCJwYXRoXCIsIFwiZXZlbnRzXCIsIFwiY2hpbGRfcHJvY2Vzc1wiLCBcImNyeXB0b1wiLCBcImh0dHBcIiwgXCJidWZmZXJcIiwgXCJ1cmxcIiwgXCJiZXR0ZXItc3FsaXRlM1wiLCBcImtuZXhcIl07XHJcbiAgICBsZXQgcmVzdWx0ID0ge307XHJcbiAgICBmb3IgKGxldCBpdGVtIG9mIGV4dGVybmFsTW9kZWxzKSB7XHJcbiAgICAgICAgcmVzdWx0W2l0ZW1dID0gKCkgPT4gKHtcclxuICAgICAgICAgICAgZmluZDogbmV3IFJlZ0V4cChgXiR7aXRlbX0kYCksXHJcbiAgICAgICAgICAgIGNvZGU6IGBjb25zdCAke2l0ZW19ID0gcmVxdWlyZSgnJHtpdGVtfScpO2V4cG9ydCB7ICR7aXRlbX0gYXMgZGVmYXVsdCB9YCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlc3VsdFtcImVsZWN0cm9uXCJdID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBlbGVjdHJvbk1vZHVsZXMgPSBbXCJjbGlwYm9hcmRcIiwgXCJpcGNSZW5kZXJlclwiLCBcIm5hdGl2ZUltYWdlXCIsIFwic2hlbGxcIiwgXCJ3ZWJGcmFtZVwiXS5qb2luKFwiLFwiKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmaW5kOiBuZXcgUmVnRXhwKGBeZWxlY3Ryb24kYCksXHJcbiAgICAgICAgICAgIGNvZGU6IGBjb25zdCB7JHtlbGVjdHJvbk1vZHVsZXN9fSA9IHJlcXVpcmUoJ2VsZWN0cm9uJyk7ZXhwb3J0IHske2VsZWN0cm9uTW9kdWxlc319YCxcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2hhdFxcXFxjaGF0LWZlXFxcXGNoYXQtd2ViXFxcXHBsdWdpbnNcXFxcQnVpbGRPYmouanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NoYXQvY2hhdC1mZS9jaGF0LXdlYi9wbHVnaW5zL0J1aWxkT2JqLmpzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgZXNidWlsZCBmcm9tIFwiZXNidWlsZFwiO1xyXG5pbXBvcnQgZWxlY3Ryb25CdWlsZGVyIGZyb20gJ2VsZWN0cm9uLWJ1aWxkZXInXHJcbmV4cG9ydCBjbGFzcyBCdWlsZE9iaiB7XHJcbiAgICAvL1x1N0YxNlx1OEJEMVx1NEUzQlx1OEZEQlx1N0EwQlx1NEVFM1x1NzgwMVxyXG4gICAgYnVpbGRNYWluKCkge1xyXG4gICAgICAgIGVzYnVpbGQuYnVpbGRTeW5jKHtcclxuICAgICAgICAgICAgZW50cnlQb2ludHM6IFtcIi4vbWFpbi9tYWluRWxlY3Ryb25FbnRyeS50c1wiXSxcclxuICAgICAgICAgICAgYnVuZGxlOiB0cnVlLFxyXG4gICAgICAgICAgICBwbGF0Zm9ybTogXCJub2RlXCIsXHJcbiAgICAgICAgICAgIG91dGZpbGU6IFwiLi9kaXN0L21haW5FbGVjdHJvbkVudHJ5LmNqc1wiLFxyXG4gICAgICAgICAgICBleHRlcm5hbDogW1wiZWxlY3Ryb25cIl0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvL1x1NEUzQVx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTFDNlx1NTkwN3BhY2thZ2UuanNvblxyXG4gICAgcHJlcGFyZVBhY2thZ2VKc29uKCkge1xyXG4gICAgICAgIGxldCBwa2dKc29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcInBhY2thZ2UuanNvblwiKTtcclxuICAgICAgICBsZXQgbG9jYWxQa2dKc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGtnSnNvblBhdGgsIFwidXRmLThcIikpO1xyXG4gICAgICAgIGxldCBlbGVjdHJvbkNvbmZpZyA9IGxvY2FsUGtnSnNvbi5kZXZEZXBlbmRlbmNpZXMuZWxlY3Ryb24ucmVwbGFjZShcIl5cIiwgXCJcIik7XHJcbiAgICAgICAgbG9jYWxQa2dKc29uLm1haW4gPSBcIm1haW5FbGVjdHJvbkVudHJ5LmpzXCI7XHJcbiAgICAgICAgZGVsZXRlIGxvY2FsUGtnSnNvbi5zY3JpcHRzO1xyXG4gICAgICAgIGRlbGV0ZSBsb2NhbFBrZ0pzb24uZGV2RGVwZW5kZW5jaWVzO1xyXG4gICAgICAgIGxvY2FsUGtnSnNvbi5kZXZEZXBlbmRlbmNpZXMgPSB7IGVsZWN0cm9uOiBlbGVjdHJvbkNvbmZpZyB9O1xyXG4gICAgICAgIGxldCB0YXJKc29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcImRpc3RcIiwgXCJwYWNrYWdlLmpzb25cIik7XHJcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyh0YXJKc29uUGF0aCwgSlNPTi5zdHJpbmdpZnkobG9jYWxQa2dKc29uKSk7XHJcbiAgICAgICAgZnMubWtkaXJTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcImRpc3Qvbm9kZV9tb2R1bGVzXCIpKTtcclxuICAgIH1cclxuICAgIC8vXHU0RjdGXHU3NTI4ZWxlY3Ryb24tYnVpbGRlclx1NTIzNlx1NjIxMFx1NUI4OVx1ODhDNVx1NTMwNVxyXG4gICAgYnVpbGRJbnN0YWxsZXIoKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0b3JpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcInJlbGVhc2VcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJkaXN0XCIpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZpbGVzOiBbXCIqKlwiXSxcclxuICAgICAgICAgICAgICAgIGV4dGVuZHM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogXCJKdWVKaW5cIixcclxuICAgICAgICAgICAgICAgIGFwcElkOiBcImNvbS5qdWVqaW4uZGVza3RvcFwiLFxyXG4gICAgICAgICAgICAgICAgYXNhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5zaXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvbmVDbGljazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwZXJNYWNoaW5lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsbG93VG9DaGFuZ2VJbnN0YWxsYXRpb25EaXJlY3Rvcnk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURlc2t0b3BTaG9ydGN1dDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVTdGFydE1lbnVTaG9ydGN1dDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzaG9ydGN1dE5hbWU6IFwianVlamluRGVza3RvcFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHB1Ymxpc2g6IFt7IHByb3ZpZGVyOiBcImdlbmVyaWNcIiwgdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTUwMC9cIiB9XSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvamVjdDogcHJvY2Vzcy5jd2QoKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBlbGVjdHJvbkJ1aWxkZXIuYnVpbGQob3B0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2hhdFxcXFxjaGF0LWZlXFxcXGNoYXQtd2ViXFxcXHBsdWdpbnNcXFxcYnVpbGRQbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NoYXQvY2hhdC1mZS9jaGF0LXdlYi9wbHVnaW5zL2J1aWxkUGx1Z2luLmpzXCI7aW1wb3J0IHtCdWlsZE9ian0gZnJvbSBcIi4vQnVpbGRPYmouanNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBidWlsZFBsdWdpbiA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogXCJidWlsZC1wbHVnaW5cIixcclxuICAgICAgICBjbG9zZUJ1bmRsZTogKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRPYmogPSBuZXcgQnVpbGRPYmooKTtcclxuICAgICAgICAgICAgYnVpbGRPYmouYnVpbGRNYWluKCk7XHJcbiAgICAgICAgICAgIGJ1aWxkT2JqLnByZXBhcmVQYWNrYWdlSnNvbigpO1xyXG4gICAgICAgICAgICBidWlsZE9iai5idWlsZEluc3RhbGxlcigpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUSxTQUFTLG9CQUFvQjtBQUMvUixPQUFPLFNBQVM7QUFDaEIsWUFBWUEsV0FBVTtBQUN0QixPQUFPLGdCQUFnQjtBQUN2QixTQUFRLG9CQUFtQjtBQUMzQixPQUFPLFlBQVk7OztBQ0x1UixPQUFPLGFBQWE7QUFDOVQsU0FBUSxhQUFZO0FBQ3BCLE9BQU8sY0FBYztBQUNkLElBQUkscUJBQXFCLE1BQU07QUFDbEMsU0FBTztBQUFBLElBQ0gsTUFBTTtBQUFBLElBQ04sZ0JBQWdCLFFBQVE7QUFDcEIsY0FBUSxVQUFVO0FBQUEsUUFDZCxhQUFhLENBQUMsNkJBQTZCO0FBQUEsUUFDM0MsUUFBUTtBQUFBLFFBQ1IsVUFBVTtBQUFBLFFBQ1YsU0FBUztBQUFBLFFBQ1QsVUFBVSxDQUFDLFVBQVU7QUFBQSxNQUN6QixDQUFDO0FBQ0QsYUFBTyxXQUFXLEtBQUssYUFBYSxNQUFNO0FBQ3RDLFlBQUksY0FBYyxPQUFPLFdBQVcsUUFBUTtBQUM1QyxZQUFJLGNBQWMscUJBQXFCLFlBQVk7QUFDbkQsWUFBSSxrQkFBa0IsTUFBTSxTQUFTLFNBQVMsR0FBRyxDQUFDLGdDQUFnQyxXQUFXLEdBQUc7QUFBQSxVQUM1RixLQUFLLFFBQVEsSUFBSTtBQUFBLFVBQ2pCLE9BQU87QUFBQSxRQUNYLENBQUM7QUFDRCx3QkFBZ0IsR0FBRyxTQUFTLE1BQU07QUFDOUIsaUJBQU8sTUFB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
