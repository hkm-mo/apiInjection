
type PrimitiveValues = boolean | null | undefined | number | bigint | string;

interface Data {
    [key: string]: PrimitiveValues | PrimitiveValues[] | Data
}

export class DataCore {
    private _dataSegments: Record<string, DataCoreSegment> = {};
    constructor() {
    }

    getSegmentOrCreate(config: DataCoreSegmentConfig) {
        if (config.name in this._dataSegments) {
            return this._dataSegments[config.name];
        } else {
            return this._dataSegments[config.name] = new DataCoreSegment(config);
        }
    }
}

export interface DataCoreSegmentConfig {
    name: string;
    type: "persistent" | "volatile"
}

export class DataCoreSegment {
    private readonly data: Data = {}
    private readonly config: DataCoreSegmentConfig;
    constructor(config: DataCoreSegmentConfig) {
        this.config = Object.assign({}, config);
    }

    set(key: string, value: Data) {
        this.data[key] = value;
    }

    get(key: string) {
        return this.data[key];
    }

    delete(key: string) {
        if (key in this.data) {
            delete this.data[key];
            return true;
        }

        return false;
    }
}

