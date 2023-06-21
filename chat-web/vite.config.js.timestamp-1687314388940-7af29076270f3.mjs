// vite.config.js
import { defineConfig } from "file:///D:/chat/chat-fe/chat-web/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/chat/chat-fe/chat-web/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import * as path2 from "path";
import AutoImport from "file:///D:/chat/chat-fe/chat-web/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/chat/chat-fe/chat-web/node_modules/unplugin-vue-components/dist/vite.mjs";
import { NaiveUiResolver } from "file:///D:/chat/chat-fe/chat-web/node_modules/unplugin-vue-components/dist/resolvers.mjs";
import { readFileSync } from "fs";
import vueJsx from "file:///D:/chat/chat-fe/chat-web/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";

// plugins/viteElectronPlugin.js
import esbuild from "file:///D:/chat/chat-fe/chat-web/node_modules/esbuild/lib/main.js";
import { spawn } from "child_process";
import electron from "file:///D:/chat/chat-fe/chat-web/node_modules/electron/index.js";

// common/config.ts
var electron_host = "localhost";
var server_host = "192.168.3.198";
var protocol = "http";
var isHttps = protocol === "https";
var baseURL = `${protocol}://${server_host}:3000`;
var baseSocketIOURL = `${protocol}://${server_host}:3001`;

// plugins/viteElectronPlugin.js
var viteElectronPlugin = () => {
  return {
    name: "vite-electron-plugin",
    configureServer(server) {
      esbuild.buildSync({
        entryPoints: ["./main/mainElectronEntry.ts"],
        bundle: true,
        platform: "node",
        outdir: "./dist",
        loader: { ".node": "file" },
        outExtension: { ".js": ".cjs" },
        external: ["electron", "robotjs"]
      });
      server.httpServer.once("listening", () => {
        let addressInfo = server.httpServer.address();
        let httpAddress = `${protocol}://${electron_host}:${addressInfo.port}`;
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
    let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame", "desktopCapturer"].join(",");
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
var httpsConfig = {
  key: readFileSync(path2.resolve(path2.join(__vite_injected_original_dirname, "/src/config/needIgnore/cert/key.pem"))),
  cert: readFileSync(path2.resolve(path2.join(__vite_injected_original_dirname, "/src/config/needIgnore/cert/cert.pem")))
};
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar"
          ]
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    }),
    optimizer(getReplacer()),
    viteElectronPlugin(),
    vueJsx({})
  ],
  server: {
    host: "0.0.0.0",
    https: isHttps ? httpsConfig : null
  },
  resolve: {
    alias: {
      "@": path2.resolve("./src"),
      "@capture": path2.resolve("./pages/capture/src"),
      "@video": path2.resolve("./pages/video/src")
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path2.resolve(__vite_injected_original_dirname, "index.html"),
        capture: path2.resolve(__vite_injected_original_dirname, "pages/capture/index.html"),
        video: path2.resolve(__vite_injected_original_dirname, "pages/video/index.html")
      },
      plugins: [buildPlugin()]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAicGx1Z2lucy92aXRlRWxlY3Ryb25QbHVnaW4uanMiLCAiY29tbW9uL2NvbmZpZy50cyIsICJwbHVnaW5zL0J1aWxkT2JqLmpzIiwgInBsdWdpbnMvYnVpbGRQbHVnaW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGNoYXRcXFxcY2hhdC1mZVxcXFxjaGF0LXdlYlxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY2hhdC9jaGF0LWZlL2NoYXQtd2ViL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHtkZWZpbmVDb25maWd9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXHJcbmltcG9ydCBDb21wb25lbnRzIGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGUnXHJcbmltcG9ydCB7TmFpdmVVaVJlc29sdmVyfSBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy9yZXNvbHZlcnMnXHJcblxyXG5pbXBvcnQge3JlYWRGaWxlU3luY30gZnJvbSAnZnMnO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCB7Z2V0UmVwbGFjZXIsIHZpdGVFbGVjdHJvblBsdWdpbn0gZnJvbSBcIi4vcGx1Z2lucy92aXRlRWxlY3Ryb25QbHVnaW4uanNcIjtcclxuaW1wb3J0IG9wdGltaXplciBmcm9tIFwidml0ZS1wbHVnaW4tb3B0aW1pemVyXCI7XHJcbmltcG9ydCB7YnVpbGRQbHVnaW59IGZyb20gXCIuL3BsdWdpbnMvYnVpbGRQbHVnaW4uanNcIjtcclxuaW1wb3J0IHtpc0h0dHBzfSBmcm9tICcuL2NvbW1vbi9jb25maWcudHMnXHJcbmNvbnN0IGh0dHBzQ29uZmlnID0ge1xyXG4gICAga2V5OiByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcvc3JjL2NvbmZpZy9uZWVkSWdub3JlL2NlcnQva2V5LnBlbScpKSksXHJcbiAgICBjZXJ0OiByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICcvc3JjL2NvbmZpZy9uZWVkSWdub3JlL2NlcnQvY2VydC5wZW0nKSkpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgdnVlKCksXHJcbiAgICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgICAgIGltcG9ydHM6IFsndnVlJyxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAnbmFpdmUtdWknOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd1c2VEaWFsb2cnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlTWVzc2FnZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICd1c2VOb3RpZmljYXRpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAndXNlTG9hZGluZ0JhcidcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KSxcclxuICAgICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICAgICAgcmVzb2x2ZXJzOiBbTmFpdmVVaVJlc29sdmVyKCldXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgb3B0aW1pemVyKGdldFJlcGxhY2VyKCkpLFxyXG4gICAgICAgIHZpdGVFbGVjdHJvblBsdWdpbigpLFxyXG4gICAgICAgIHZ1ZUpzeCh7fSksXHJcbiAgICBdLFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgICAgIGh0dHBzOiBpc0h0dHBzID8gaHR0cHNDb25maWcgOiBudWxsXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgICAgICdAJzogcGF0aC5yZXNvbHZlKCcuL3NyYycpLFxyXG4gICAgICAgICAgICAnQGNhcHR1cmUnOiBwYXRoLnJlc29sdmUoJy4vcGFnZXMvY2FwdHVyZS9zcmMnKSxcclxuICAgICAgICAgICAgJ0B2aWRlbyc6IHBhdGgucmVzb2x2ZSgnLi9wYWdlcy92aWRlby9zcmMnKSxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgICAgICAgICBtYWluOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxyXG4gICAgICAgICAgICAgICAgY2FwdHVyZTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3BhZ2VzL2NhcHR1cmUvaW5kZXguaHRtbCcpLFxyXG4gICAgICAgICAgICAgICAgdmlkZW86IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdwYWdlcy92aWRlby9pbmRleC5odG1sJylcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcGx1Z2luczogW2J1aWxkUGx1Z2luKCldLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2hhdFxcXFxjaGF0LWZlXFxcXGNoYXQtd2ViXFxcXHBsdWdpbnNcXFxcdml0ZUVsZWN0cm9uUGx1Z2luLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9jaGF0L2NoYXQtZmUvY2hhdC13ZWIvcGx1Z2lucy92aXRlRWxlY3Ryb25QbHVnaW4uanNcIjtpbXBvcnQgZXNidWlsZCBmcm9tICdlc2J1aWxkJ1xyXG5pbXBvcnQge3NwYXdufSBmcm9tICdjaGlsZF9wcm9jZXNzJ1xyXG5pbXBvcnQgZWxlY3Ryb24gZnJvbSAnZWxlY3Ryb24nXHJcbmltcG9ydCB7cHJvdG9jb2wsIGVsZWN0cm9uX2hvc3R9IGZyb20gJy4uL2NvbW1vbi9jb25maWcudHMnO1xyXG5cclxuZXhwb3J0IGxldCB2aXRlRWxlY3Ryb25QbHVnaW4gPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5hbWU6IFwidml0ZS1lbGVjdHJvbi1wbHVnaW5cIixcclxuICAgICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XHJcbiAgICAgICAgICAgIGVzYnVpbGQuYnVpbGRTeW5jKHtcclxuICAgICAgICAgICAgICAgIGVudHJ5UG9pbnRzOiBbXCIuL21haW4vbWFpbkVsZWN0cm9uRW50cnkudHNcIl0sXHJcbiAgICAgICAgICAgICAgICBidW5kbGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybTogXCJub2RlXCIsXHJcbiAgICAgICAgICAgICAgICBvdXRkaXI6IFwiLi9kaXN0XCIsXHJcbiAgICAgICAgICAgICAgICBsb2FkZXI6IHsnLm5vZGUnOiAnZmlsZSd9LFxyXG4gICAgICAgICAgICAgICAgb3V0RXh0ZW5zaW9uOiB7Jy5qcyc6ICcuY2pzJ30sXHJcbiAgICAgICAgICAgICAgICBleHRlcm5hbDogW1wiZWxlY3Ryb25cIiwncm9ib3RqcyddLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2VydmVyLmh0dHBTZXJ2ZXIub25jZShcImxpc3RlbmluZ1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWRkcmVzc0luZm8gPSBzZXJ2ZXIuaHR0cFNlcnZlci5hZGRyZXNzKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaHR0cEFkZHJlc3MgPSBgJHtwcm90b2NvbH06Ly8ke2VsZWN0cm9uX2hvc3R9OiR7YWRkcmVzc0luZm8ucG9ydH1gO1xyXG4gICAgICAgICAgICAgICAgbGV0IGVsZWN0cm9uUHJvY2VzcyA9IHNwYXduKGVsZWN0cm9uLnRvU3RyaW5nKCksIFtcIi4vZGlzdC9tYWluRWxlY3Ryb25FbnRyeS5janNcIiwgaHR0cEFkZHJlc3NdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3dkOiBwcm9jZXNzLmN3ZCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZGlvOiBcImluaGVyaXRcIixcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZWxlY3Ryb25Qcm9jZXNzLm9uKFwiY2xvc2VcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcnZlci5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZXhpdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGxldCBnZXRSZXBsYWNlciA9ICgpID0+IHtcclxuICAgIGxldCBleHRlcm5hbE1vZGVscyA9IFtcIm9zXCIsIFwiZnNcIiwgXCJwYXRoXCIsIFwiZXZlbnRzXCIsIFwiY2hpbGRfcHJvY2Vzc1wiLCBcImNyeXB0b1wiLCBcImh0dHBcIiwgXCJidWZmZXJcIiwgXCJ1cmxcIiwgXCJiZXR0ZXItc3FsaXRlM1wiLCBcImtuZXhcIl07XHJcbiAgICBsZXQgcmVzdWx0ID0ge307XHJcbiAgICBmb3IgKGxldCBpdGVtIG9mIGV4dGVybmFsTW9kZWxzKSB7XHJcbiAgICAgICAgcmVzdWx0W2l0ZW1dID0gKCkgPT4gKHtcclxuICAgICAgICAgICAgZmluZDogbmV3IFJlZ0V4cChgXiR7aXRlbX0kYCksXHJcbiAgICAgICAgICAgIGNvZGU6IGBjb25zdCAke2l0ZW19ID0gcmVxdWlyZSgnJHtpdGVtfScpO2V4cG9ydCB7ICR7aXRlbX0gYXMgZGVmYXVsdCB9YCxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlc3VsdFtcImVsZWN0cm9uXCJdID0gKCkgPT4ge1xyXG4gICAgICAgIGxldCBlbGVjdHJvbk1vZHVsZXMgPSBbXCJjbGlwYm9hcmRcIiwgXCJpcGNSZW5kZXJlclwiLCBcIm5hdGl2ZUltYWdlXCIsIFwic2hlbGxcIiwgXCJ3ZWJGcmFtZVwiLCBcImRlc2t0b3BDYXB0dXJlclwiXS5qb2luKFwiLFwiKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmaW5kOiBuZXcgUmVnRXhwKGBeZWxlY3Ryb24kYCksXHJcbiAgICAgICAgICAgIGNvZGU6IGBjb25zdCB7JHtlbGVjdHJvbk1vZHVsZXN9fSA9IHJlcXVpcmUoJ2VsZWN0cm9uJyk7ZXhwb3J0IHske2VsZWN0cm9uTW9kdWxlc319YCxcclxuICAgICAgICB9O1xyXG4gICAgfTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxcY29tbW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxcY29tbW9uXFxcXGNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovY2hhdC9jaGF0LWZlL2NoYXQtd2ViL2NvbW1vbi9jb25maWcudHNcIjtleHBvcnQgY29uc3QgZWxlY3Ryb25faG9zdCA9ICdsb2NhbGhvc3QnXHJcblxyXG5leHBvcnQgY29uc3Qgc2VydmVyX2hvc3QgPSAnMTkyLjE2OC4zLjE5OCdcclxuXHJcbi8vIGVsZWN0cm9uXHU2NzJDXHU2NzNBXHU2NjJGXHU1NDI2XHU1RjAwXHU1NDJGaHR0cHNcclxuZXhwb3J0IGNvbnN0IHByb3RvY29sOiBzdHJpbmcgPSAnaHR0cCdcclxuZXhwb3J0IGNvbnN0IGlzSHR0cHM6IGJvb2xlYW4gPSBwcm90b2NvbCA9PT0gJ2h0dHBzJ1xyXG5cclxuXHJcbi8vIFx1NjcwRFx1NTJBMVx1N0FFRlx1NjYyRlx1NTQyNlx1NUYwMFx1NTQyRmh0dHBzXHJcbmV4cG9ydCBjb25zdCBiYXNlVVJMID0gYCR7cHJvdG9jb2x9Oi8vJHtzZXJ2ZXJfaG9zdH06MzAwMGBcclxuXHJcbi8vIFx1NEZFMVx1NEVFNFx1NjcwRFx1NTJBMVx1NTY2OFx1NzY4NFx1NTczMFx1NTc0MFxyXG5leHBvcnQgY29uc3QgYmFzZVNvY2tldElPVVJMID0gYCR7cHJvdG9jb2x9Oi8vJHtzZXJ2ZXJfaG9zdH06MzAwMWBcclxuXHJcbi8vIFx1NjYyRlx1NTQyNlx1NUYwMFx1NTQyRnNlc3Npb25cdTk2OTRcdTc5QkJcclxuZXhwb3J0IGNvbnN0IG9wZW5TZXNzaW9uSXNvbGF0aW9uID0gZmFsc2U7IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2hhdFxcXFxjaGF0LWZlXFxcXGNoYXQtd2ViXFxcXHBsdWdpbnNcXFxcQnVpbGRPYmouanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NoYXQvY2hhdC1mZS9jaGF0LXdlYi9wbHVnaW5zL0J1aWxkT2JqLmpzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xyXG5pbXBvcnQgZXNidWlsZCBmcm9tIFwiZXNidWlsZFwiO1xyXG5pbXBvcnQgZWxlY3Ryb25CdWlsZGVyIGZyb20gJ2VsZWN0cm9uLWJ1aWxkZXInXHJcbmV4cG9ydCBjbGFzcyBCdWlsZE9iaiB7XHJcbiAgICAvL1x1N0YxNlx1OEJEMVx1NEUzQlx1OEZEQlx1N0EwQlx1NEVFM1x1NzgwMVxyXG4gICAgYnVpbGRNYWluKCkge1xyXG4gICAgICAgIGVzYnVpbGQuYnVpbGRTeW5jKHtcclxuICAgICAgICAgICAgZW50cnlQb2ludHM6IFtcIi4vbWFpbi9tYWluRWxlY3Ryb25FbnRyeS50c1wiXSxcclxuICAgICAgICAgICAgYnVuZGxlOiB0cnVlLFxyXG4gICAgICAgICAgICBwbGF0Zm9ybTogXCJub2RlXCIsXHJcbiAgICAgICAgICAgIG91dGZpbGU6IFwiLi9kaXN0L21haW5FbGVjdHJvbkVudHJ5LmNqc1wiLFxyXG4gICAgICAgICAgICBleHRlcm5hbDogW1wiZWxlY3Ryb25cIl0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvL1x1NEUzQVx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTFDNlx1NTkwN3BhY2thZ2UuanNvblxyXG4gICAgcHJlcGFyZVBhY2thZ2VKc29uKCkge1xyXG4gICAgICAgIGxldCBwa2dKc29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcInBhY2thZ2UuanNvblwiKTtcclxuICAgICAgICBsZXQgbG9jYWxQa2dKc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGtnSnNvblBhdGgsIFwidXRmLThcIikpO1xyXG4gICAgICAgIGxldCBlbGVjdHJvbkNvbmZpZyA9IGxvY2FsUGtnSnNvbi5kZXZEZXBlbmRlbmNpZXMuZWxlY3Ryb24ucmVwbGFjZShcIl5cIiwgXCJcIik7XHJcbiAgICAgICAgbG9jYWxQa2dKc29uLm1haW4gPSBcIm1haW5FbGVjdHJvbkVudHJ5LmpzXCI7XHJcbiAgICAgICAgZGVsZXRlIGxvY2FsUGtnSnNvbi5zY3JpcHRzO1xyXG4gICAgICAgIGRlbGV0ZSBsb2NhbFBrZ0pzb24uZGV2RGVwZW5kZW5jaWVzO1xyXG4gICAgICAgIGxvY2FsUGtnSnNvbi5kZXZEZXBlbmRlbmNpZXMgPSB7IGVsZWN0cm9uOiBlbGVjdHJvbkNvbmZpZyB9O1xyXG4gICAgICAgIGxldCB0YXJKc29uUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcImRpc3RcIiwgXCJwYWNrYWdlLmpzb25cIik7XHJcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyh0YXJKc29uUGF0aCwgSlNPTi5zdHJpbmdpZnkobG9jYWxQa2dKc29uKSk7XHJcbiAgICAgICAgZnMubWtkaXJTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcImRpc3Qvbm9kZV9tb2R1bGVzXCIpKTtcclxuICAgIH1cclxuICAgIC8vXHU0RjdGXHU3NTI4ZWxlY3Ryb24tYnVpbGRlclx1NTIzNlx1NjIxMFx1NUI4OVx1ODhDNVx1NTMwNVxyXG4gICAgYnVpbGRJbnN0YWxsZXIoKSB7XHJcbiAgICAgICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgZGlyZWN0b3JpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcInJlbGVhc2VcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgXCJkaXN0XCIpLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZpbGVzOiBbXCIqKlwiXSxcclxuICAgICAgICAgICAgICAgIGV4dGVuZHM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBwcm9kdWN0TmFtZTogXCJKdWVKaW5cIixcclxuICAgICAgICAgICAgICAgIGFwcElkOiBcImNvbS5qdWVqaW4uZGVza3RvcFwiLFxyXG4gICAgICAgICAgICAgICAgYXNhcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG5zaXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBvbmVDbGljazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBwZXJNYWNoaW5lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFsbG93VG9DaGFuZ2VJbnN0YWxsYXRpb25EaXJlY3Rvcnk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZURlc2t0b3BTaG9ydGN1dDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVTdGFydE1lbnVTaG9ydGN1dDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzaG9ydGN1dE5hbWU6IFwianVlamluRGVza3RvcFwiLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHB1Ymxpc2g6IFt7IHByb3ZpZGVyOiBcImdlbmVyaWNcIiwgdXJsOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NTUwMC9cIiB9XSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvamVjdDogcHJvY2Vzcy5jd2QoKSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBlbGVjdHJvbkJ1aWxkZXIuYnVpbGQob3B0aW9ucyk7XHJcbiAgICB9XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGF0XFxcXGNoYXQtZmVcXFxcY2hhdC13ZWJcXFxccGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2hhdFxcXFxjaGF0LWZlXFxcXGNoYXQtd2ViXFxcXHBsdWdpbnNcXFxcYnVpbGRQbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2NoYXQvY2hhdC1mZS9jaGF0LXdlYi9wbHVnaW5zL2J1aWxkUGx1Z2luLmpzXCI7aW1wb3J0IHtCdWlsZE9ian0gZnJvbSBcIi4vQnVpbGRPYmouanNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBidWlsZFBsdWdpbiA9ICgpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmFtZTogXCJidWlsZC1wbHVnaW5cIixcclxuICAgICAgICBjbG9zZUJ1bmRsZTogKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgYnVpbGRPYmogPSBuZXcgQnVpbGRPYmooKTtcclxuICAgICAgICAgICAgYnVpbGRPYmouYnVpbGRNYWluKCk7XHJcbiAgICAgICAgICAgIGJ1aWxkT2JqLnByZXBhcmVQYWNrYWdlSnNvbigpO1xyXG4gICAgICAgICAgICBidWlsZE9iai5idWlsZEluc3RhbGxlcigpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUSxTQUFRLG9CQUFtQjtBQUM3UixPQUFPLFNBQVM7QUFDaEIsWUFBWUEsV0FBVTtBQUN0QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFRLHVCQUFzQjtBQUU5QixTQUFRLG9CQUFtQjtBQUMzQixPQUFPLFlBQVk7OztBQ1J1UixPQUFPLGFBQWE7QUFDOVQsU0FBUSxhQUFZO0FBQ3BCLE9BQU8sY0FBYzs7O0FDRmlRLElBQU0sZ0JBQWdCO0FBRXJTLElBQU0sY0FBYztBQUdwQixJQUFNLFdBQW1CO0FBQ3pCLElBQU0sVUFBbUIsYUFBYTtBQUl0QyxJQUFNLFVBQVUsR0FBRyxjQUFjO0FBR2pDLElBQU0sa0JBQWtCLEdBQUcsY0FBYzs7O0FEUnpDLElBQUkscUJBQXFCLE1BQU07QUFDbEMsU0FBTztBQUFBLElBQ0gsTUFBTTtBQUFBLElBQ04sZ0JBQWdCLFFBQVE7QUFD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
