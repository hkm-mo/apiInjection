
import EventEmitter from "eventemitter3";
import browser, { Runtime } from "webextension-polyfill";

type MessageHandle<T> = (message: T, sender: Runtime.Port) => void;
interface ExtensionMessengerEventType<T> {
    message: MessageHandle<T>
}

interface ExtensionEnvelope<T> {
    id: string,
    distId?: string | number,
    tunnelId?: string
    payload: T
}

export class ExtensionMessenger<P = any, T extends ExtensionEnvelope<P> = ExtensionEnvelope<P>> {
    private _emitter = new EventEmitter<ExtensionMessengerEventType<T>>();
    private _ports: browser.Runtime.Port[] = [];
    private readonly _name: string;
    private readonly _messageHandler: MessageHandle<T>;

    constructor(name: string) {
        this._messageHandler = this.messageHandler.bind(this);
        this._name = name;

        if (browser.devtools.inspectedWindow?.tabId || !browser.tabs) {
            this.addPort(browser.runtime.connect({
                name
            }));
        } else {
            browser.runtime.onConnect.addListener(port => {
                if (port.name == this._name) {
                    this.addPort(port);
                }
            });
        }
    }

    private addPort(port: browser.Runtime.Port) {
        this._ports.push(port);

        port.onMessage.addListener(this._messageHandler);
        port.onDisconnect.addListener(port => {
            port.onMessage.removeListener(this._messageHandler);
            this._ports = this._ports.filter(i => i != port);
        });
    }

    private messageHandler(message: T, port: Runtime.Port) {
        this._emitter.emit("message", message, port);
    }

    sendMessage(message: T) {
        for (const port of this._ports) {
            if (message.distId && message.distId === port.sender?.tab?.id) {
                port.postMessage(message);
            } else {
                port.postMessage(message);
            }
        }
    }

    onMessage(handler: MessageHandle<T>) {
        this._emitter.addListener("message", handler);
    }

    offMessage(handler: MessageHandle<T>) {
        this._emitter.removeListener("message", handler);
    }
}

const messagers: { [name: string]: ExtensionMessenger } = {};

function messagerFactory(name: string) {
    if (!(name in messagers)) {
        messagers[name] = new ExtensionMessenger(name);
    }

    return messagers[name];
}

export const getContentMessager = messagerFactory.bind("ContentMessager");
export const getDevToolsMessager = messagerFactory.bind("DevToolsMessager");


