import browser from "webextension-polyfill";

function handleShown() {
    console.log("panel is being shown");
}

function handleHidden() {
    console.log("panel is being hidden");
}

browser.devtools.panels.create("My Panel",
    "",
    "devtools/devtools-panel.html"
).then((newPanel) => {
    newPanel.onShown.addListener(handleShown);
    newPanel.onHidden.addListener(handleHidden);
});