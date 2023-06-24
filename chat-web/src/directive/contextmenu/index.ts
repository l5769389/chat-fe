import Contextmenu from "./Contextmenu.vue";
import {createApp} from "vue";

const events: string[] = ['contextmenu', 'click']


function contextmenu(menuType,position, chatId,onTop) {
    const app = createApp(Contextmenu, {position, chatId, menuType,onTop})
    const div = document.createElement('div')
    app.mount(div)
    const hide = e => {
        console.log(e.type)
        app.unmount()
        events.forEach(item => {
            document.removeEventListener(item, hide)
        })
    }
    setTimeout(() => {
        events.forEach(item => {
            document.addEventListener(item, hide)
        })
    })
}

export default contextmenu;
