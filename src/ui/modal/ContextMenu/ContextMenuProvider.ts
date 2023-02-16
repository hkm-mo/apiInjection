import React, { useEffect, useRef } from "react";

export interface ContextMenuItem {
    id: string,
    label: string,
    type?: "default" | "spilter",
    onClick: () => void,
    disabled?: boolean,
    children?: ContextMenuItem[]
}

export interface ContextMenuSheetInnerProps {
    items: ContextMenuItem[] | null,
    x: number,
    y: number
}

export type ContextMenuInit = ContextMenuItem[] | (() => ContextMenuItem[]);
type ContextMenuInitGroup = (ContextMenuItem | (() => ContextMenuItem[]))[]

export default class ContextMenuProvider {
    private menus = new Map<React.RefObject<HTMLElement> | symbol, ContextMenuInitGroup>();
    private menusCached = new WeakMap<HTMLElement, ContextMenuInitGroup>();
    private attatchedNode: HTMLElement | null = null;
    private rootSymbol = Symbol("root");
    private readonly clickHandler: (event: MouseEvent) => void;
    public setInnerProps: React.Dispatch<React.SetStateAction<ContextMenuSheetInnerProps>> | null = null;

    public get useContextMenuFunc() {
        return this.useContextMenu.bind(this);
    }

    public get useRootContextMenuFunc() {
        return this.useRootContextMenu.bind(this);
    }

    constructor() {
        this.clickHandler = this._clickHandler.bind(this);
    }

    private _clickHandler(event: MouseEvent) {
        let elm: HTMLElement | null = event.target as HTMLElement;
        const menuItems: ContextMenuItem[] = [];
        while (elm && elm != this.attatchedNode?.parentElement) {
            const menuInit = this.menusCached.get(elm);
            this.evalMenuInitGroup(menuInit, menuItems);
            elm = elm.parentElement;
        }

        this.evalMenuInitGroup(this.menus.get(this.rootSymbol), menuItems);

        if (this.setInnerProps) {
            this.setInnerProps({
                x: event.clientX,
                y: event.clientY,
                items: menuItems
            });
        }

        if (menuItems.length) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    attatch(node: HTMLElement) {
        this.attatchedNode = node;
        node.addEventListener("contextmenu", this.clickHandler);
    }

    detach() {
        this.attatchedNode?.removeEventListener("contextmenu", this.clickHandler);
    }

    useRootContextMenu(menu: ContextMenuInit) {
        this.setContextMenu(this.rootSymbol, menu);
    }

    useContextMenu<T extends HTMLElement>(menu: ContextMenuInit, ref?: React.RefObject<T>) {
        if (typeof ref === "undefined")
            ref = useRef<T>(null);

        useEffect(() => {
            if (ref && ref.current) {
                this.setContextMenu(ref, menu);
            }

            return (() => {
                if (ref) {
                    this.menus.delete(ref);
                }
            });
        }, [menu, ref]);



        return ref;
    }

    private setContextMenu(key: React.RefObject<HTMLElement> | symbol, menu: ContextMenuInit) {
        let rootCtx = this.menus.get(key) || [];

        if (typeof menu === "function") {
            rootCtx.push(menu);
        } else {
            rootCtx.push(...menu);
        }

        if (typeof key === "object" && key.current) {
            this.menusCached.set(key.current, rootCtx);
            console.log("Add to cached", key.current, rootCtx);
        }
        this.menus.set(key, rootCtx);
    }

    private evalMenuInitGroup(group: ContextMenuInitGroup | undefined | null, menuItems: ContextMenuItem[]) {
        if (group) {
            for (const init of group) {
                if (typeof init === "function") {
                    menuItems.push(...init());
                } else {
                    menuItems.push(init);
                }
            }
        }
    }
}