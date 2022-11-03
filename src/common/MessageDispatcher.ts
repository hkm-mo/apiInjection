
export type MessageDispatcherMatchmaker<Request, Respond> = (respond: Respond, request: Request) => boolean;

interface PendingMessage<Request, Respond> {
    createTime: number,
    request: Request,
    resolve: (respond: Respond, request?: Request) => void,
    reject: (resean: any) => void,
}

export class MessageDispatcher<Request, Respond> {
    private pendingMessages: PendingMessage<Request, Respond>[] = [];
    private messageMatchmaker: MessageDispatcherMatchmaker<Request, Respond>;

    constructor(matchmaker: MessageDispatcherMatchmaker<Request, Respond>) {
        this.messageMatchmaker = matchmaker;
    }

    drop(request: Request) {
        return new Promise((resolve, reject) => {
            this.pendingMessages.push({
                createTime: (new Date()).getTime(),
                request: request,
                resolve,
                reject
            });
        });
    }

    dispatch(respond: Respond) {
        for (let i = 0; i < this.pendingMessages.length; i++) {
            const message = this.pendingMessages[i];
            
            if (this.messageMatchmaker(respond, message.request)) {
                message.resolve(respond, message.request);
                this.pendingMessages.splice(i, 1);
                return true;
            }
        }

        return false;
    }
}
