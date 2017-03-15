version = "5.3.2";
createLocalStorage();
createNotificationFixBugUserID();
lockBrowserInit();
addShortcut();
addContext();
setInterval(addAutoBlock, 1000);
msgIncognito();
addEvents();
createNotificationPersonalInformation();

function addEvents() {
    chrome.windows.onCreated.addListener(function () {
        lockBrowserInit();
    });
}

function addContext() {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        title: chrome.i18n.getMessage("context_block_i18n"),
        onclick: function () {
            validateLockContext();
        }
    });
}

function addShortcut() {
    chrome.commands.onCommand.addListener(function (command) {
        if (command == 'block_browser' && localStorage["use_short"] == 'true') {
            lockBrowser();
        }
    });
}

function msgIncognito() {
    chrome.extension.isAllowedIncognitoAccess(function (isAllowedAccess) {
        if (isAllowedAccess) return;
        alert(chrome.i18n.getMessage("msg_allow_incognito_i18n"));
        var idTab = null;
        chrome.tabs.getAllInWindow(function (tabs) {
            for (var j = 0; j < tabs.length; j++) {
                if (tabs[j].url.toString().indexOf('chrome://extensions') != -1) {
                    idTab = tabs[j].id;
                    break;
                }
            }
            if (idTab != null) {
                chrome.tabs.update(idTab, {
                    url: 'chrome://extensions/?id=' + chrome.runtime.id,
                    active: true
                });
            } else {
                chrome.tabs.create({
                    url: 'chrome://extensions/?id=' + chrome.runtime.id
                });
            }
        });
    });
}