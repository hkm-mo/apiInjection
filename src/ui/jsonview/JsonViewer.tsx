import React, { useState } from "react";
import "./JsonViewer.less";

interface JsonViewState {
    [key: string]: boolean
}

interface JsonViewerProps {
    data: any
}
export function JsonViewer(props: JsonViewerProps) {
    const viewState: JsonViewState = {};

    return (
        <div className="jsonViewer">
            <table cellPadding={0} cellSpacing={0}>
                <thead>
                    <tr>
                        <td></td>
                        <td style={{ width: "100%" }}></td>
                    </tr>
                </thead>
                <tbody>
                    <JsonViewerNodes parentName="" data={props.data} level={0} jsonViewState={viewState} />
                </tbody>
            </table>
        </div>
    );

}


interface JsonViewerNodeProps {
    parentName: string,
    data: any,
    level: number,
    jsonViewState: JsonViewState
}

function JsonViewerNodes(props: JsonViewerNodeProps) {
    const nodes: JSX.Element[] = [];
    if (Array.isArray(props.data) || typeof props.data === "object") {
        for (const key in props.data) {
            const viewId = `${props.parentName}/${key}`
            nodes.push(
                <JsonViewerNodeView key={viewId} viewId={viewId} name={key} value={props.data[key]} level={props.level} jsonViewState={props.jsonViewState} />
            );
        }
    } else {
        nodes.push(<JsonViewerNodeView key={props.parentName} viewId={props.parentName} name="" value={props.data} level={props.level} jsonViewState={props.jsonViewState} />);
    }
    return (
        <>
            {nodes}
        </>
    );
}

interface JsonViewerNodeView {
    viewId: string,
    level: number,
    name: string | number,
    value: string | number | null | undefined,
    jsonViewState: JsonViewState
}

function JsonViewerNodeView(props: JsonViewerNodeView) {
    const [isOpened, setIsOpened] = useState(Boolean(props.jsonViewState[props.viewId]));
    console.log(props.viewId, props.jsonViewState[props.viewId]);

    const paddingInlineStart = props.level * 16;
    let arrowClass = "";
    let valueClass = "valueBox-" + typeof props.value;
    let displayValue: string;
    let hasNextLevel = false;
    let nextLevelContent: JSX.Element | null = null;

    if (props.value === null) {
        valueClass = "valueBox-null";
        displayValue = "null";
    } else if (props.value === undefined) {
        valueClass = "valueBox-undefined";
        displayValue = "undefined";
    } else if (Array.isArray(props.value)) {
        valueClass = "valueBox-array";
        displayValue = isOpened ? "" : props.value.length.toString();
        arrowClass = "arrow" + (isOpened ? " opend" : "");
        hasNextLevel = true;
    } else if (typeof props.value === "object") {
        displayValue = isOpened ? "" : "...";
        arrowClass = "arrow" + (isOpened ? " opend" : "");
        hasNextLevel = true;
    } else {
        displayValue = String(props.value);
    }

    if (isOpened && hasNextLevel) {
        nextLevelContent = <JsonViewerNodes parentName={props.viewId} data={props.value} level={props.level + 1} jsonViewState={props.jsonViewState} />
    }

    function toggleNode() {
        if (hasNextLevel){
            props.jsonViewState[props.viewId] = !isOpened;
            setIsOpened(props.jsonViewState[props.viewId]);
        }
    }

    return (
        <>
            <tr key={`${props.viewId}-node`} className={`jsonViewerNode jsonView-node-${props.level} ${isOpened ? "jsonViewerNode-opened" : ""}`}>
                <td className="jsonViewerNode-label" style={{ paddingInlineStart: `${paddingInlineStart}px` }} onClick={toggleNode}>
                    <span className={"jsonViewerNode-icon " + arrowClass}></span>
                    <span className="jsonViewerNode-labelText">
                        {props.name}
                    </span>
                </td>
                <td>
                    <span className={`jsonViewerNode-valueBox ${valueClass}`}>
                        {displayValue}
                    </span>
                </td>
            </tr>
            {nextLevelContent}
        </>
    );
}