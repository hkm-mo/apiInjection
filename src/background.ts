import browser from "webextension-polyfill";

function handleMessage(request: any, sender: browser.Runtime.MessageSender) {

    if (sender.url != browser.runtime.getURL("/devtools/panel/panel.html")) {
        return;
    }

    browser.tabs.executeScript(
        request.tabId,
        {
            code: request.script
        });

}

/**
Listen for messages from our devtools panel.
*/
browser.runtime.onMessage.addListener(handleMessage);