import React, { useLayoutEffect } from "react";
import { ContextMenuItem } from "./ContextMenuProvider";

import "./ContextMenuSheet.less";


interface ContextMenuSheetProps {
    parentRef: React.RefObject<HTMLDivElement>,
    items: ContextMenuItem[],
    clickHandlerFactory: (item: ContextMenuItem) => (()=>void),
}

export function ContextMenuSheet(props: ContextMenuSheetProps) {
    const items: JSX.Element[] = [];

    if (props.items && props.items.length) {
        for (const item of props.items) {
            items.push(
                <div key={item.id} className={`ctxMenu-item ${item.type}`} onClick={props.clickHandlerFactory(item)}>{item.label}</div>
            );
        }
    }

    useLayoutEffect(() => {
        console.log("menu", props.parentRef.current?.getBoundingClientRect());
    });

    return (
        <div className="ctxMenu-sheet">
            {items}
        </div>
    );
}

