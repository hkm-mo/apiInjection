
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { JsonViewer } from "./ui/jsonview/JsonViewer";
import { BridgeLogStreamViewer } from "./ui/BridgeLogStreamViewer";
import SplitPane from "./ui/SplitPane/SplitPane";
import { getLocalId } from "./ui/uiUtilities";
import { BridgeLogger, BridgeLogInfo } from "./BridgeLogger";


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

    const logger = new BridgeLogger<any>();
    // for (let i = 0; i < 100000; i++) {
    //     const id = getLocalId().toString();
    //     logger.log({ id: id, request: "Test " + id, type: "info" });
    // }

    function keepUpdatingLog() {
        const id = getLocalId().toString();
        const data: BridgeLogInfo<any> = { id: id, request: "Test " + id, type: "info" }
        logger.log(data);
        setTimeout(() => {
            data.response = {
                isSuccess: true,
                data: {
                    test: 1
                }
            };
        }, 5000);
        setTimeout(keepUpdatingLog, 500 + Math.round(Math.random() * 1000))
    }

    setTimeout(keepUpdatingLog, 5000);

    function addNode() {
        setData({
            ...data,
            ["node" + getLocalId()]: testData
        });
    }
    return (
        <SplitPane split="vertical" minSize={200} maxSize={400} defaultSize={200}>
            <div id="logView" style={{ height: "100%", width: "100%" }}>
                <BridgeLogStreamViewer logger={logger}></BridgeLogStreamViewer>
            </div>
            <div>
                <JsonViewer data={data} />
            </div>
        </SplitPane>
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