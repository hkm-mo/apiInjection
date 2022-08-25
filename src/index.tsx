
import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { JsonViewer } from "./ui/jsonview/JsonViewer";
import { Logger, LogViewer } from "./ui/LogViewer";
import { getLocalId } from "./ui/uiUtilities";


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

function LogItem(props: {content: string}) {
    return (
        <p>{props.content}</p>
    )
}

function App() {
    const [data, setData] = useState<any>(testData);

    const logger = new Logger<any>();
    for (let i = 0; i < 1000; i++) {
        logger.log({id: getLocalId().toString(), content: "Test " + getLocalId().toString(), type: "info"});
    }

    function addNode() {
        setData({
            ...data,
            ["node"+getLocalId()]: testData
        });
    }
    return (
        <div>
            <button type="button" onClick={addNode}>Add Node</button>
            <JsonViewer data={data} />
            <div id="logView" style={{height: "200px", width: "400px"}}>
                <LogViewer logger={logger}></LogViewer>
            </div>
        </div>
    )
}

const rootElm = document.getElementById("app");
if (rootElm) {
    const root = ReactDOM.createRoot(rootElm);
    root.render(<App />);
}

document.getElementById("setButton")?.addEventListener("click", function() {
    const logView = document.getElementById("logView");
    if (logView) {
        logView.style.width = (200+ Math.round(Math.random() * 200)) + "px";
        //logView.style.height = (200+ Math.round(Math.random() * 200)) + "px";
    }
}, false);