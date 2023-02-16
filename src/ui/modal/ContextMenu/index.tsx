import React, { PropsWithChildren, useEffect, useRef } from "react";
import ContextMenuLayer from "./ContextMenuLayer";
import ContextMenuProvider, { ContextMenuItem } from "./ContextMenuProvider";

export { ContextMenuItem }
export type useContextMenuFunc = typeof ContextMenuProvider.prototype.useContextMenu;
export type useRootContextMenuFunc = typeof ContextMenuProvider.prototype.useRootContextMenu;
export type ContextMenu = ReturnType<typeof createContextMenu>;

export function createContextMenu() {
    const provider = new ContextMenuProvider();
    return {
        useContextMenu: provider.useContextMenuFunc,
        useRootContextMenu: provider.useRootContextMenuFunc,
        ContextMenu: (props: PropsWithChildren) => {
            const divRef = useRef<HTMLDivElement>(null);
            useEffect(() => {
                console.log(jsxElm);
                if (divRef.current?.parentElement) {
                    provider.attatch(divRef.current.parentElement);
                }
                return () => provider.detach();
            }, [provider]);

            const jsxElm = (
                <React.Fragment>
                    {props.children}
                    <div style={{ display: "none" }} ref={divRef} />
                    <ContextMenuLayer contextMenuProvider={provider} />
                </React.Fragment>
            );

            return jsxElm;
        }
    };
}