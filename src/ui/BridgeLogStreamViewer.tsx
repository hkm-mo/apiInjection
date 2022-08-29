import React, { useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps, ListOnScrollProps } from "react-window";
import { BridgeLogger, BridgeLogInfo } from "../BridgeLogger";

import "./BridgeLogStreamViewer.less";


interface BridgeLogStreamViewerProps<T> {
    logger: BridgeLogger<string>,
    onSelectedIndexChanged?: (index: number) => void
}

export function BridgeLogStreamViewer<T>(props: BridgeLogStreamViewerProps<T>) {
    const itemHeight = 20;
    const [logSummary, setLogSummary] = useState(props.logger.getSummary());
    const [rect, setRect] = useState<DOMRect | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    const [isBottom, setIsBottom] = useState<boolean>(true);

    let list: JSX.Element | null = null;

    props.logger.onUpdate = () => {
        setLogSummary(props.logger.getSummary());
    };

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
        setSelectedIndex(index);
    }

    function scrollHandler(props: ListOnScrollProps) {
        if (scrollRef && scrollRef.current) {
            const domRect = scrollRef.current.getBoundingClientRect();
            if (scrollRef.current.scrollHeight == props.scrollOffset + domRect.height) {
                setIsBottom(true);
            } else {
                setIsBottom(false);
            }
        }

    }

    const Row = SelectableRow(selectedIndex, handleSelectedIndexChanged);

    if (rect) {
        list = (
            <FixedSizeList
                className="logView-list" outerRef={scrollRef}
                height={rect.height} width={rect.width} itemSize={itemHeight} itemCount={logSummary.logs.length} itemData={logSummary.logs}
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

function SelectableRow(selectedIndex: number, setSelectedIndex: (index: number) => void) {
    return (props: ListChildComponentProps<BridgeLogInfo<string>[]>) => {
        const data = props.data[props.index];

        function clickHandler() {
            if (selectedIndex == props.index) {
                setSelectedIndex(-1);
            } else {
                setSelectedIndex(props.index);
            }
        }

        return (
            <div className={`logView-list-item ${selectedIndex == props.index ? "selected" : ""}`} style={props.style} onClick={clickHandler}>
                {data.request}
            </div>
        );
    }
}
