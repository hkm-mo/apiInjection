import React, { useState } from "react";
import { BridgeLogger } from "../../BridgeLogger";
import { BridgeLogDetailsViewer } from "./BridgeLogDetailsViewer";
import { BridgeLogStreamViewer } from "./BridgeLogStreamViewer";
import SplitPane from "../SplitPane/SplitPane";

interface BridgeLogViewerProps {
    logger: BridgeLogger,
}

export function BridgeLogViewer(props: BridgeLogViewerProps) {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [logSummary, setLogSummary] = useState(props.logger.getSummary());

    props.logger.onUpdate = () => {
        setLogSummary(props.logger.getSummary());
    };

    return (
        <div>
            <div className="toolbar">

            </div>
            <SplitPane split="vertical" minSize={200} maxSize={400} defaultSize={200}>
                <BridgeLogStreamViewer log={logSummary} selectedIndex={selectedIndex} onSelectedIndexChanged={setSelectedIndex}></BridgeLogStreamViewer>
                <BridgeLogDetailsViewer data={logSummary.logs[selectedIndex]} />
            </SplitPane>
        </div>
    );
}

