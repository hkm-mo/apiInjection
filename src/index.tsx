
import React from "react";
import ReactDOM from "react-dom/client";
import { JsonViewer } from "./ui/jsonview/JsonViewer";


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

const rootElm = document.getElementById("app");
if (rootElm) {
    const root = ReactDOM.createRoot(rootElm);
    root.render(<JsonViewer data={testData} />);
}
