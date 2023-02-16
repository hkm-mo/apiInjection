import ReactDOM from "react-dom";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { useTopLayerPortal } from "../uiUtilities";

import "./Modal.less";

export interface ModelProps {
    show?: boolean,
    bodyClasses?: string[],
    containerRef?: React.RefObject<HTMLDivElement>,
    bodyRef?: React.RefObject<HTMLDivElement>,
    containerClasses?: string[],
    bodyStyle?: React.CSSProperties,
    transition?: boolean,
    onbackgroundClicked?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export function Modal(props: PropsWithChildren<ModelProps>) {
    const root = useTopLayerPortal();
    const containerRef = props.containerRef ?? useRef<HTMLDivElement>(null);

    function maskClickHandler(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (props.onbackgroundClicked)
            props.onbackgroundClicked(event);
    }

    const hasTransition = !(typeof props.transition === "boolean" && !props.transition);
    const containerClasses = null;

    const content = (
        <div className={"modal-container " + props.containerClasses?.join(" ") || ""} style={!hasTransition && !props.show ? undefined : {display: "block"}} ref={containerRef}>
            <div className="modal-mask" onClick={maskClickHandler} onContextMenu={maskClickHandler} />
            <div className={"modal-body " + props.bodyClasses?.join(" ") || ""} style={props.bodyStyle} ref={props.bodyRef}>{props.children}</div>
        </div>
    );

    return ReactDOM.createPortal(
        hasTransition ? 
            (
                <CSSTransition nodeRef={containerRef} in={props.show} timeout={300} classNames="modal-transition">
                    {content}
                </CSSTransition>
            ) : content,
        root);
}