import browser from "webextension-polyfill";

const scriptToAttach = "document.body.innerHTML = 'Hi from the devtools';";
document.getElementById("button_message")?.addEventListener("click", () => {
    browser.runtime.sendMessage({
        tabId: browser.devtools.inspectedWindow.tabId,
        script: scriptToAttach
    });
});