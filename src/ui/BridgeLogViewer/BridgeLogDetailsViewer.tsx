import React from "react";
import { BridgeLogInfo } from "../../BridgeLogger";
import { JsonViewer } from "../jsonview/JsonViewer";

import "./BridgeLogDetailsViewer.less";


interface BridgeLogDetailsViewerProps {
    data: BridgeLogInfo | null
}
export function BridgeLogDetailsViewer(props: BridgeLogDetailsViewerProps) {


    if (props.data) {
        return (
            <div className="bridgeLogDetailsView">
                <details open>
                    <summary>Request</summary>
                    <div>
                        <JsonViewer key={props.data.id} data={props.data.request.payload} />
                    </div>
                </details>
                <details open>
                    <summary>Response</summary>
                    <div>
                        {
                            props.data.response?.payload ?
                                <JsonViewer key={props.data.id} data={props.data.response?.payload} defaultExpanded /> :
                                <p>Waiting for response</p>
                        }
                    </div>
                </details>
            </div>
        )
    } else {
        return (
            <div className="bridgeLogDetailsView noData">
                <p>Please select a log item.</p>
            </div>
        )
    }
}

