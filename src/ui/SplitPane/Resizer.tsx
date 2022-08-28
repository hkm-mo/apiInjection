import React from "react";


export const RESIZER_DEFAULT_CLASSNAME = "splitPane-resizer";

interface ResizerProps {
    className: string,
    onClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    onDoubleClick?: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    onMouseDown: (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void,
    onTouchStart: (event: React.TouchEvent<HTMLSpanElement>) => void,
    onTouchEnd: (event: React.TouchEvent<HTMLSpanElement>) => void,
    split?: "vertical" | "horizontal",
    style?: React.CSSProperties,
    resizerClassName?: string,
}

export default function Resizer(props: ResizerProps) {
    const {
        className,
        onClick,
        onDoubleClick,
        onMouseDown,
        onTouchEnd,
        onTouchStart,
        resizerClassName,
        split,
        style,
    } = props;
    const classes = [resizerClassName || RESIZER_DEFAULT_CLASSNAME, split, className];

    return (
        <span
            role="presentation"
            className={classes.join(" ")}
            style={style}
            onMouseDown={event => onMouseDown(event)}
            onTouchStart={event => {
                event.preventDefault();
                onTouchStart(event);
            }}
            onTouchEnd={event => {
                event.preventDefault();
                onTouchEnd(event);
            }}
            onClick={event => {
                if (onClick) {
                    event.preventDefault();
                    onClick(event);
                }
            }}
            onDoubleClick={event => {
                if (onDoubleClick) {
                    event.preventDefault();
                    onDoubleClick(event);
                }
            }}
        />
    );

}

Resizer.defaultProps = {
    resizerClassName: RESIZER_DEFAULT_CLASSNAME,
};

