
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { getLocalId } from "./ui/uiUtilities";
import { BridgeLogger, BridgeLogInfo } from "./BridgeLogger";
import { BridgeLogViewer } from "./ui/BridgeLogViewer/BridgeLogViewer";


const testData = {
    abc: "aaaa",
    a11: 1243,
    bbb: null,
    array: [
        "a",
        "b",
        "c"
    ],
    objectA: {
        a: "111",
        b: "aaaa The React documentation explains how to use ReactDOM.createRoot, which is not a direct/drop-in replacement for ReactDOM.render. What the doc doesn't cover is the TypeScript way of using it. I know this solution is a bit overkill compared to others here that uses type assertion (as HTMLElement) on the DOM element, but it fully utilizes the benefit of strict typing (e.g. if someone accidentally removed the #root element in index.html)",
        c: {
            a: "33111",
            c: true,
            aaa: "assdf"
        }
    }
}

function LogItem(props: { content: string }) {
    return (
        <p>{props.content}</p>
    )
}

function App() {
    const [data, setData] = useState<any>(testData);

    const logger = new BridgeLogger();
    // for (let i = 0; i < 100000; i++) {
    //     const id = getLocalId().toString();
    //     logger.log({ id: id, request: "Test " + id, type: "info" });
    // }

    function keepUpdatingLog() {
        const id = getLocalId().toString();
        const data: BridgeLogInfo = { id: id, request: {
            action: "rpc",
            clientId: id,
            payload: "test"
        }, type: null };

        logger.log(data);
        setTimeout(() => {
            data.response = {
                clientId: id,
                payload: {
                    aabc: {},
                    test: 112 + Math.random(),
                    ...testData
                }
            };
        }, 1000);

        setTimeout(keepUpdatingLog, 500 + Math.round(Math.random() * 1000))
    }

    setTimeout(keepUpdatingLog, 500);

    function addNode() {
        setData({
            ...data,
            ["node" + getLocalId()]: testData
        });
    }
    return (
        <BridgeLogViewer logger={logger} />
    );
}

const rootElm = document.getElementById("app");
if (rootElm) {
    const root = ReactDOM.createRoot(rootElm);
    root.render(<App />);
}

document.getElementById("setButton")?.addEventListener("click", function () {
    const logView = document.getElementById("logView");
    if (logView) {
        logView.style.width = (200 + Math.round(Math.random() * 200)) + "px";
        //logView.style.height = (200+ Math.round(Math.random() * 200)) + "px";
    }
}, false);