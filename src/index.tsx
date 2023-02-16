
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { getLocalId } from "./ui/uiUtilities";
import { BridgeLogger, BridgeLogInfo } from "./BridgeLogger";
import { BridgeLogViewer } from "./ui/BridgeLogViewer/BridgeLogViewer";
import { JsonViewer } from "./ui/jsonview/JsonViewer";
import { Dialog } from "./ui/modal/Dialog";


const testData = {
    xxx: undefined,
    abc: "aaaa",
    a11: 1243,
    bbb: null,
    array: [
        "{\"a\":1,\"b\":2,\"c\":3}",
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
    const [isShowDialog, setIsShowDialog] = useState<boolean>(false);

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


    function dialogClicked() {
        console.log("clicked")
        setIsShowDialog(false);
    }
    return (
        <>
            <button type="button" onClick={()=> setIsShowDialog(true)}>Show Dialog</button>
            <Dialog title="Test test 11" buttons={[{text:"Cancel", type:"link"}, {text:"Close"}, {text:"OK", type:"primary"}]} show={isShowDialog} onButtonClicked={dialogClicked}>
                <div>
                    123456
                </div>
            </Dialog>
            <div style={{border: "1px solid #ccc", margin: "10px 0"}}>
                <JsonViewer data={testData} hideRoot defaultExpanded/>
            </div>
            <div style={{border: "1px solid #ccc", margin: "10px 0"}}>
                <JsonViewer data={{}} />
            </div>

            <div style={{border: "1px solid #ccc", margin: "10px 0"}}>
                <JsonViewer data={[{}, testData, "aaa", 12345, []]} defaultExpanded={2} />
            </div>

            <div style={{border: "1px solid #ccc", margin: "10px 0"}}>
                <JsonViewer data={"te\nsta"} />
            </div>
        </>
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