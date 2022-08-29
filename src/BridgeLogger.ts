
export interface BridgeLogInfo<T> {
    id: string,
    type: "info" | "error",
    request: T,
    response?: any,
}

class BridgeLogSummary<T> {
    private _logs: BridgeLogInfo<T>[];
    private _updateTime: number;

    get logs() {
        return this._logs;
    }

    get updateTime() {
        return this._updateTime;
    }

    constructor(logs: BridgeLogInfo<T>[]) {
        this._logs = logs;
        this._updateTime = new Date().getTime();
    }
}

export class BridgeLogger<T> {
    private incompleteData: BridgeLogInfo<T>[] = [];
    private summary: BridgeLogSummary<T> = new BridgeLogSummary([]);
    private maxSize: number = 0;

    public onUpdate: (() => void) | null = null;

    constructor(maxSize?: number) {
        this.maxSize = maxSize ?? 0;
    }

    public getSummary() {
        return this.summary;
    }

    public log(data: BridgeLogInfo<T>) {
        const logs = this.summary.logs;

        if (this.maxSize && this.maxSize < this.log.length) {
            logs.shift();
        }

        logs.push(data);
        this.summary = new BridgeLogSummary(logs);

        if (!data.response) {
            this.incompleteData.push(data);
        }

        if (this.onUpdate) {
            setTimeout(this.onUpdate, 0);
        }

    }

    public update(data: BridgeLogInfo<T>) {
        if (!data || !data.response)
            return;

        const i = this.incompleteData.findIndex(i => i.id == data.id);

        if (i != -1) {
            const incompleteData = this.incompleteData.splice(i, 1)[0];
            incompleteData.type = data.type;
            incompleteData.response = data.response;

            this.summary = new BridgeLogSummary(this.summary.logs);
            if (this.onUpdate) {
                setTimeout(this.onUpdate, 0);
            }
        }

    }

    public clearLog() {
        this.summary = new BridgeLogSummary([]);
    }
}