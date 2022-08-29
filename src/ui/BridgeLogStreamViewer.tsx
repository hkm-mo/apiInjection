import React, { useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps, ListOnScrollProps } from "react-window";
import { BridgeLogger, BridgeLogInfo, BridgeLogSummary } from "../BridgeLogger";

import "./BridgeLogStreamViewer.less";


interface BridgeLogStreamViewerProps {
    log: BridgeLogSummary,
    selectedIndex?: number,
    onSelectedIndexChanged?: (index: number) => void
}

export function BridgeLogStreamViewer(props: BridgeLogStreamViewerProps) {
    const itemHeight = 20;
    const [rect, setRect] = useState<DOMRect | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isBottom, setIsBottom] = useState<boolean>(true);

    let list: JSX.Element | null = null;

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setRect(entry.contentRect);
            }
        });

        if (containerRef.current) {
            const domRect = containerRef.current.getBoundingClientRect();
            if (rect?.width != domRect.width || rect?.height != domRect.height) {
                setRect(domRect);
            } else {
                resizeObserver.observe(containerRef.current);
            }
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [containerRef.current]);

    useEffect(() => {
        if (scrollRef && scrollRef.current && isBottom) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    });

    function handleSelectedIndexChanged(index: number) {
        if (props.onSelectedIndexChanged) {
            props.onSelectedIndexChanged(props.selectedIndex === index ? -1 : index);
        }
    }

    function scrollHandler(props: ListOnScrollProps) {
        if (scrollRef && scrollRef.current) {
            if (scrollRef.current.scrollHeight === props.scrollOffset + scrollRef.current.clientHeight) {
                setIsBottom(true);
            } else {
                setIsBottom(false);
            }
        }

    }

    const Row = SelectableRow(props.selectedIndex, handleSelectedIndexChanged);
    const logs = props.log.logs;

    if (rect) {
        list = (
            <FixedSizeList
                className="logView-list" outerRef={scrollRef}
                height={rect.height} width={rect.width} itemSize={itemHeight} itemCount={logs.length} itemData={logs}
                itemKey={getItemId}
                onScroll={scrollHandler}>
                {Row}
            </FixedSizeList>
        );
    }
    return (
        <div className="logView" ref={containerRef}>
            {list}
        </div>
    );
}

function SelectableRow(selectedIndex: number | undefined, setSelectedIndex: (index: number) => void) {
    return (props: ListChildComponentProps<BridgeLogInfo[]>) => {
        const data = props.data[props.index];

        return (
            <div className={`logView-list-item ${selectedIndex == props.index ? "selected" : ""}`} style={props.style} onClick={setSelectedIndex.bind(null, props.index)}>
                {data.request.action}
            </div>
        );
    }
}


function getItemId(index: number, data: BridgeLogInfo[]) {
    return data[index].id;
}