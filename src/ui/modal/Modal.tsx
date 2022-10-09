import ReactDOM from "react-dom";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { CSSTransition } from 'react-transition-group';
import { useTopLayerPortal } from "../uiUtilities";

import "./Modal.less";

export interface ModelProps {
    show?: boolean,
    bodyClasses?: string[]
}

export function Modal(props: PropsWithChildren<ModelProps>) {
    const root = useTopLayerPortal();
    const nodeRef = useRef<HTMLDivElement>(null);

    return ReactDOM.createPortal((
        <CSSTransition nodeRef={nodeRef} in={props.show} timeout={300} classNames="modal-transition">
            <div className="modal-container" ref={nodeRef}>
                <div className="modal-mask" />
                <div className={"modal-body " + props.bodyClasses?.join(" ")}>{props.children}</div>
            </div>
        </CSSTransition>
    ), root);
}