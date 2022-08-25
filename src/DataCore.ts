
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

export type DataCoreSegmentConfig = DataCorePersistentSegmentConfig | DataCoreVolatileSegmentConfig;

export class DataCore {
    private _dataSegments: Record<string, Record<string, DataCoreSegment>> = {};
    constructor() {
    }

    getSegmentOrCreate(config: DataCoreSegmentConfig) {
        let opNode = this.getSegmentsNode(config);

        if (config.name in opNode) {
            return opNode[config.name];
        } else {
            return opNode[config.name] = new DataCoreSegment(config);
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
}


export class DataCoreSegment<T extends Data = Data> {
    private readonly data: T = { } as any;
    private readonly config: DataCoreSegmentConfig;

    public get dataType() {
        return this.config.type;
    }

    constructor(config: DataCoreSegmentConfig) {
        this.config = Object.assign({}, config);
    }

    get<K extends keyof T>(key: K): T[K] {
        return this.data[key];
    }
    
    set<K extends keyof T>(key: K, value: T[K]) {
        this.data[key] = value;
    }

    delete(key: string) {
        if (key in this.data) {
            delete this.data[key];
            return true;
        }

        return false;
    }
}

