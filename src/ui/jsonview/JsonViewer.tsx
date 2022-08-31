import React, { useState } from "react";
import "./JsonViewer.less";

interface JsonViewState {
    [key: string]: boolean
}

interface JsonViewerProps {
    data: any,
    defaultExpanded?: boolean
}
export const JsonViewer = React.memo(function JsonViewer(props: JsonViewerProps) {
    return (
        <div className="jsonViewer">
            <JsonViewerNodes parentName="" value={props.data} level={0} defaultExpanded={props.defaultExpanded ?? false} />
        </div>
    );
});




interface JsonViewerNodeProps {
    parentName: string,
    value: any,
    level: number,
    defaultExpanded: boolean
}

function JsonViewerNodes(props: JsonViewerNodeProps) {
    const nodes: JSX.Element[] = [];
    if (props.value && typeof props.value === "object") {
        for (const key in props.value) {
            const viewId = `node-${props.parentName}/${key}`
            console.log(viewId);
            nodes.push(
                <JsonViewerNodeView key={viewId} viewId={viewId} name={key} value={props.value[key]} level={props.level} defaultExpanded={props.defaultExpanded} />
            );
        }
    } else {
        nodes.push(<tr>
            <td colSpan={2}>
                <JsonValue value={props.value} />
            </td>
        </tr>);
    }
    return (
        <table cellPadding={0} cellSpacing={0}>
            <tbody>
                {nodes}
            </tbody>
        </table>
    );
}

interface JsonViewerNodeView {
    viewId: string,
    level: number,
    name: string | number,
    value: string | number | null | undefined,
    defaultExpanded: boolean
}

function JsonViewerNodeView(props: JsonViewerNodeView) {
    const [isOpened, setIsOpened] = useState(props.defaultExpanded);

    let arrowClass = "";
    let hasChildNode = false;
    let nextLevelContent: JSX.Element | null = null;

    if (props.value && typeof props.value === "object") {
        arrowClass = "arrow" + (isOpened ? " opend" : "");
        hasChildNode = true;
    }

    if (isOpened && hasChildNode) {
        nextLevelContent = (
            <tr>
                <td colSpan={2} className="jsonViewerNode-child">
                    <JsonViewerNodes parentName={props.viewId} value={props.value} level={props.level + 1} defaultExpanded={props.defaultExpanded} />
                </td>
            </tr>
        );
    }

    function toggleNode() {
        if (hasChildNode) {
            setIsOpened(!isOpened);
        }
    }

    return (
        <>
            <tr key={`${props.viewId}-node`} className={`jsonViewerNode jsonView-node-${props.level} ${isOpened ? "jsonViewerNode-opened" : ""}`}>
                <td className="jsonViewerNode-label" onClick={toggleNode}>
                    <span className={"jsonViewerNode-icon " + arrowClass}></span>
                    <span className="jsonViewerNode-labelText">
                        {props.name}
                    </span>
                </td>
                <td>
                    <JsonValue value={props.value} />
                </td>
            </tr>
            {nextLevelContent}
        </>
    );
}

interface JsonValueProps {
    value: any
}
function JsonValue(props: JsonValueProps) {
    let valueClass = "valueBox-" + typeof props.value;
    let displayValue: string;

    if (props.value === null) {
        valueClass = "valueBox-null";
        displayValue = "null";
    } else if (props.value === undefined) {
        valueClass = "valueBox-undefined";
        displayValue = "undefined";
    } else if (Array.isArray(props.value)) {
        valueClass = "valueBox-array";
        displayValue = props.value.length.toString();
    } else if (typeof props.value === "object") {
        displayValue = Object.keys(props.value).length.toString();
    } else {
        displayValue = String(props.value);
    }

    return (
        <span className={`jsonViewerNode-valueBox ${valueClass}`}>
            {displayValue}
        </span>
    )
}