import React, { useState } from "react";
import "./JsonViewer.less";

interface JsonViewerProps {
    data: any,
    defaultExpanded?: boolean | number,
    hideRoot?: boolean
}

interface JsonViewerNodeProps {
    parentName: string,
    value: any,
    level: number,
    defaultExpanded: number,
    showRoot?: boolean
}

interface JsonViewerNodeViewProps {
    viewId: string,
    level: number,
    name?: string | number,
    value: string | number | null | undefined,
    defaultExpanded: number
}

interface JsonValueProps {
    value: any
}


export const JsonViewer = React.memo(function JsonViewer(props: JsonViewerProps) {
    let defaultExpanded = typeof props.defaultExpanded === "number" ? props.defaultExpanded : 
        (props.defaultExpanded ? 64 : 0);
    return (
        <div className="jsonViewer">
            <JsonViewerNodes
                parentName=""
                value={props.data}
                level={0}
                defaultExpanded={defaultExpanded}
                showRoot={!props.hideRoot} />
        </div>
    );
});


function JsonViewerNodes(props: JsonViewerNodeProps) {
    const nodes: JSX.Element[] = [];
    if (props.showRoot) {
        const viewId = `node-${props.parentName}`;
        nodes.push(<JsonViewerNodeView 
            key={viewId} 
            viewId={viewId} 
            value={props.value} 
            level={props.level} 
            defaultExpanded={props.defaultExpanded} />);
    } else if (props.value && typeof props.value === "object") {
        for (const key in props.value) {
            const viewId = `node-${props.parentName}/${key}`;
            nodes.push(
                <JsonViewerNodeView 
                    key={viewId} 
                    viewId={viewId} 
                    name={key} 
                    value={props.value[key]} 
                    level={props.level} 
                    defaultExpanded={props.defaultExpanded} />
            );
        }
        if (!nodes.length) {
            nodes.push(
                <tr key={`node-${props.parentName}/`}>
                    <td colSpan={2}>
                        <span className={`jsonViewerNode-noChild ${Array.isArray(props.value) ? "array" : "object"}`}></span>
                    </td>
                </tr>
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


function JsonViewerNodeView(props: JsonViewerNodeViewProps) {
    const [isOpened, setIsOpened] = useState(props.level < props.defaultExpanded);

    let arrowClass = "";
    let hasChildNode = false;
    let nextLevelContent: JSX.Element | null = null;
    let nodeContent: JSX.Element;

    if (props.value && typeof props.value === "object") {
        arrowClass = "arrow" + (isOpened ? " opend" : "");
        hasChildNode = true;

        if (isOpened && hasChildNode) {
            nextLevelContent = (
                <tr>
                    <td colSpan={2} className="jsonViewerNode-child">
                        <JsonViewerNodes 
                            parentName={props.viewId} 
                            value={props.value} 
                            level={props.level + 1} 
                            defaultExpanded={props.defaultExpanded} />
                    </td>
                </tr>
            );
        }
    }


    function toggleNode() {
        if (hasChildNode) {
            setIsOpened(!isOpened);
        }
    }

    if (props.name !== undefined) {
        nodeContent = (
            <>
                <td className="jsonViewerNode-label">
                    <span className={"jsonViewerNode-icon " + arrowClass}></span>
                    <span className="jsonViewerNode-labelText">
                        {props.name}
                    </span>
                </td>
                <td>
                    <JsonValue value={props.value} />
                </td>
            </>
        );
    } else {
        nodeContent = (<td className="jsonViewerNode-label" colSpan={2}>
            {hasChildNode ? <span className={"jsonViewerNode-icon " + arrowClass}></span> : null}
            <JsonValue value={props.value} />
        </td>);
    }

    return (
        <>
            <tr key={`${props.viewId}-node`} className={`jsonViewerNode jsonView-node-${props.level} ${isOpened ? "jsonViewerNode-opened" : ""}`} onClick={toggleNode}>
                {nodeContent}
            </tr>
            {nextLevelContent}
        </>
    );
}


function JsonValue(props: JsonValueProps) {
    const objType = typeof props.value;
    let valueClass = "valueBox-" + objType;
    let displayValue: string;

    if (props.value === null) {
        valueClass = "valueBox-null";
        displayValue = "null";
    } else if (Array.isArray(props.value)) {
        valueClass = "valueBox-array";
        displayValue = props.value.length.toString();
    } else if (objType === "object") {
        displayValue = Object.keys(props.value).length.toString();
    } else if (objType === "string") {
        displayValue = JSON.stringify(props.value).slice(1, -1);
    } else {
        displayValue = String(props.value);
    }

    return (
        <span className={`jsonViewerNode-valueBox ${valueClass}`}>
            {displayValue}
        </span>
    )
}