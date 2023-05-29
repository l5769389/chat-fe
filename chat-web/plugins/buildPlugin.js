import {BuildObj} from "./BuildObj.js";

export const buildPlugin = () => {
    return {
        name: "build-plugin",
        closeBundle: () => {
            let buildObj = new BuildObj();
            buildObj.buildMain();
            buildObj.preparePackageJson();
            buildObj.buildInstaller();
            console.log(buildObj)
        },
    };
}