import React, { PropsWithChildren } from "react"
import { Modal } from "./Modal"

import "./Dialog.less";

interface DialogButton {
    id?: string,
    text: string,
    type?: "primary" | "default" | "link",
    onClick?: (index: number, button: DialogButton) => void
}

interface DialogButtonProps extends DialogButton {
    index: number,
    clickHandler: (index: number, button: DialogButton) => void
}

interface DialogProps {
    title?: string,
    buttons?: DialogButton[],
    show?: boolean,
    onButtonClicked?: (index: number, button: DialogButton) => void,
    onbackgroundClicked?: () => void
}




export function Dialog(props: PropsWithChildren<DialogProps>) {
    const btns: JSX.Element[] = [];

    const clickHandler = (index: number, button: DialogButton) => {
        if (typeof button.onClick === "function") {
            button.onClick(index, button);
        }

        if (typeof props.onButtonClicked === "function") {
            props.onButtonClicked(index, button);
        }
    };

    if (props.buttons) {
        for (let i = 0; i < props.buttons.length; i++) {
            const btn = props.buttons[i];

            btns.push(<DialogButton key={i} {...btn} index={i} clickHandler={clickHandler} />);
        }
    }
    return (
        <Modal show={Boolean(props.show)} bodyClasses={["dialog-container"]} onbackgroundClicked={props.onbackgroundClicked}>
            {props.title ? <h1>{props.title}</h1> : null}
            <div key="dialog-body" className="dialog-body">{props.children}</div>
            <div key="dialog-actions" className="dialog-actions">{btns}</div>
        </Modal>
    );
}

export function DialogButton(props: DialogButtonProps) {
    return (
        <button type="button" className={`dialog-button-${props.type ?? "default"}`} onClick={() => props.clickHandler(props.index, props)}>{props.text}</button>
    );
}