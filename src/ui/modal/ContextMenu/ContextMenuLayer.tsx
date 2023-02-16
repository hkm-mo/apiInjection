import React, { useLayoutEffect, useRef, useState } from "react";
import { Modal } from "../Modal";
import ContextMenuProvider, { ContextMenuItem, ContextMenuSheetInnerProps } from "./ContextMenuProvider";

import "./ContextMenuLayer.less";
import { ContextMenuSheet } from "./ContextMenuSheet";

interface ContextMenuLayerProps {
    contextMenuProvider: ContextMenuProvider
}

export default function ContextMenuLayer(props: ContextMenuLayerProps) {
    const items: JSX.Element[] = [];
    const [innerProps, setInnerProps] = useState<ContextMenuSheetInnerProps>({} as ContextMenuSheetInnerProps);
    const bodySheetRef = useRef<HTMLDivElement>(null);
    props.contextMenuProvider.setInnerProps = setInnerProps;

    function dismiss() {
        setInnerProps({
            ...innerProps,
            items: null
        });
    }

    function bgClicked(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.preventDefault();
        event.stopPropagation();
        dismiss();
    }

    function clickHandlerFactory(item: ContextMenuItem) {
        return () => {
            dismiss();
            item.onClick();
        }
    }

    let sheet;
    if (innerProps.items) {
        sheet = <ContextMenuSheet items={innerProps.items} parentRef={bodySheetRef} clickHandlerFactory={clickHandlerFactory} />
    }

    useLayoutEffect(() => {
        console.log("menu", bodySheetRef.current?.getBoundingClientRect());
    });


    return (
        <Modal
            show={Boolean(innerProps.items)}
            bodyClasses={["ctxMenu-layer"]}
            containerClasses={["ctxMenu-layer-container"]}
            onbackgroundClicked={bgClicked}
            bodyStyle={{ top: innerProps.y, left: innerProps.x }}
            bodyRef={bodySheetRef}
            transition={false}>
            { sheet }
        </Modal>
    );
}