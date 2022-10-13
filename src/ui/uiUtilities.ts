import { useEffect, useLayoutEffect, useState } from "react";

let localIdSeed = 0;
export function getLocalId() {
    return localIdSeed++;
}


let portalZIndex = 1000;
export function useTopLayerPortal() {
    const [root,] = useState(() => {
        const elm = document.createElement('div');
        elm.className = "portalRoot";
        return elm;
    });

    if (root) {
        root.style.setProperty('--portal-z-index', String(portalZIndex++));
    }

    useLayoutEffect(() => {
        document.body.appendChild(root);
        return () => root.remove();
    }, [root]);

    return root;
}
