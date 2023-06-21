import Contextmenu from "./Contextmenu.vue";
import {createApp} from "vue";

function contextmenu(menu: any[],position) {
    const app = createApp(Contextmenu, {menu: menu,position})
    const div = document.createElement('div')
    app.mount(div)
}

export default contextmenu;