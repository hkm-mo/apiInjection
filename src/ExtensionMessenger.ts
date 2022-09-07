
import EventEmitter from "eventemitter3";
import browser from "webextension-polyfill";

interface ExtensionMessengerEventType {
    message: (message: any, sender: browser.Runtime.MessageSender) => void
}

export class ExtensionMessenger {
    private _emitter = new EventEmitter<ExtensionMessengerEventType>();

    constructor() {
        browser.runtime.onMessage.addListener((message, sender) => {
            this._emitter.emit("message", message, sender);
        });
    }

    sendMessage(message: any) {
        if (browser.tabs) { // background
            browser.tabs.query({}).then(tabs => {
                tabs.forEach(tab => {
                    if (tab.id && (tab.url && /^(http|ws)/.test(tab.url)))
                        browser.tabs.sendMessage(tab.id, message)
                            .catch((e) => console.warn(e));;
                });
            });
        } else { // client
            browser.runtime.sendMessage(message)
                .catch((e) => console.warn(e));;
        }
    }

    onMessage(handler: ExtensionMessengerEventType["message"]) {
        this._emitter.addListener("message", handler);
    }

    offMessage(handler: ExtensionMessengerEventType["message"]) {
        this._emitter.removeListener("message", handler);
    }

}
