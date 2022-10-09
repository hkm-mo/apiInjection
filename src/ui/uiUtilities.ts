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
        elm.style.setProperty('--portal-z-index', String(portalZIndex++));
        return elm;
    });

    useLayoutEffect(() => {
        document.body.appendChild(root);
        return () => root.remove();
    }, [root]);

    return root;
}
