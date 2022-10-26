import EventEmitter from "eventemitter3";
import Browser from "webextension-polyfill";

type PrimitiveValues = boolean | null | undefined | number | bigint | string;

interface Data {
    [key: string]: any // PrimitiveValues | PrimitiveValues[] | Data | Data[]
}

interface DataCorePersistentSegmentConfig {
    name: string,
    type: "persistent"
}

interface DataCoreVolatileSegmentConfig {
    name: string,
    type: "volatile",
    scopeId?: number,
}

interface DataCoreEventType {
    segmentUpdated: (segmentName: string, tabId: number, value: any) => void,
    segmentDeleted: (segmentName: string, tabId: number) => void,
}

type DataCoreEventEmitter<T extends EventEmitter.EventNames<DataCoreEventType> = EventEmitter.EventNames<DataCoreEventType>> = (
    event: T,
    ...args: EventEmitter.EventArgs<DataCoreEventType, T>
) => boolean;

export type DataCoreSegmentConfig = DataCorePersistentSegmentConfig | DataCoreVolatileSegmentConfig;

export class DataCore {
    private _dataSegments: Record<string, Record<string, DataCoreSegment>> = {};
    private _eventEmitter = new EventEmitter<DataCoreEventType>();

    constructor() {
    }

    async getSegmentOrCreate(config: DataCoreSegmentConfig) {
        let opNode = this.getSegmentsNode(config);

        if (config.name in opNode) {
            return opNode[config.name];
        } else {
            const segment = new DataCoreSegment(config, this._eventEmitter.emit);
            return opNode[config.name] = await segment.init();
        }
    }

    deleteSegment(config: DataCoreSegmentConfig) {
        console.log(this.getSegmentsNodeName(config))
        let opSegments = this.getSegmentsNode(config);

        if (config.name in opSegments) {
            delete opSegments[config.name]
        }
    }

    deleteScope(scopeId: number) {
        delete this._dataSegments[`volatile${scopeId}`];
    }

    private getSegmentsNodeName(config: DataCoreSegmentConfig) {
        return `${config.type}${(config as DataCoreVolatileSegmentConfig).scopeId ?? ""}`;
    }

    private getSegmentsNode(nodeName: string | DataCoreSegmentConfig) {
        if (typeof nodeName == "object") {
            nodeName = this.getSegmentsNodeName(nodeName);
        }

        if (!this._dataSegments[nodeName])
            this._dataSegments[nodeName] = {};

        return this._dataSegments[nodeName];
    }

    public addListener<K extends keyof DataCoreEventType>(event: K, handler: EventEmitter.EventListener<DataCoreEventType, K>) {
        this._eventEmitter.addListener(event, handler);
    }

    public removeListener<K extends keyof DataCoreEventType>(event: K, handler: EventEmitter.EventListener<DataCoreEventType, K>) {
        this._eventEmitter.removeListener(event, handler);
    }
}


export class DataCoreSegment<T extends Data = Data> {
    private data: T = {} as any;
    private readonly config: DataCoreSegmentConfig;
    private readonly _emitter: DataCoreEventEmitter;

    public get dataType() {
        return this.config.type;
    }

    constructor(config: DataCoreSegmentConfig, emitter: DataCoreEventEmitter) {
        this.config = Object.assign({}, config);
        this._emitter = emitter;
    }

    async init() {
        const dataStr = await Browser.storage.local.get("_DCS" + this.config.name);
        if (dataStr) {
            this.data = dataStr as any;
        }

        return this;
    }

    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }

    set<K extends keyof T>(key: K, value: T[K]) {
        this.data[key] = value;

        Browser.storage.local.set({
            ["_DCS" + this.config.name]: this.data
        });
    }

    delete(key: string) {
        if (key in this.data) {
            delete this.data[key];

            Browser.storage.local.set({
                ["_DCS" + this.config.name]: this.data
            });
            return true;
        }

        return false;
    }

    removeSegment() {
        Browser.storage.local.remove("_DCS" + this.config.name);
    }
}

