import React, { useEffect, useRef, useState } from "react";
import { FixedSizeList, ListChildComponentProps, ListOnScrollProps } from "react-window";

import "./LogViewer.less";

interface LogInfo<T> {
    id: string,
    type: "info" | "error",
    content: T,
}

export class Logger<T> {
    private logs: LogInfo<T>[] = [];
    private maxSize: number = 0;

    public onUpdate: (() => void) | null = null;

    constructor(maxSize?: number) {
        this.maxSize = maxSize ?? 0;
    }

    public getLogs() {
        return this.logs;
    }

    public log(data: LogInfo<T>) {
        if (this.maxSize && this.maxSize < this.log.length) {
            this.logs.shift();
        }
        this.logs.push(data);

        if (this.onUpdate)
            setTimeout(this.onUpdate, 0);
    }

    public clearLog() {
        this.logs = [];
    }
}

interface LogViewProps<T> {
    logger: Logger<string>,
}
export function LogViewer<T>(props: LogViewProps<T>) {
    const itemHeight = 20;
    const logs = props.logger.getLogs();
    const [rect, setRect] = useState<DOMRect | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
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

    const Row = SelectableRow(selectedIndex, setSelectedIndex);

    if (rect) {
        list = (
            <FixedSizeList
                className="logView-list" outerRef={scrollRef}
                height={rect.height} width={rect.width} itemSize={itemHeight} itemCount={logs.length} itemData={logs}
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

function SelectableRow(selectedIndex: number, setSelectedIndex: React.Dispatch<React.SetStateAction<number>>) {
    return (props: ListChildComponentProps<LogInfo<string>[]>) => {
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
                {data.content}
            </div>
        );
    }
}
