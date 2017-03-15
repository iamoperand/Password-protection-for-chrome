function verifyLogin() {
    login(prompt(chrome.i18n.getMessage("enter_password_i18n"), ""));
    chrome.windows.getAll(function (windows) {
        for (var i = 0; i < windows.length; i++) {
            chrome.tabs.query({
                windowId: windows[i].id
            }, function (tabs) {
                for (var j = 0; j < tabs.length; j++) {
                    var url = chrome.runtime.id + '/html/lock.html';
                    if (tabs[j].url.toString().indexOf(url) != -1) {
                        chrome.tabs.remove(tabs[j].id);
                    }
                }
            });
        }
    });
}


function lockBrowserInit() {
    if (containsPassword()) {
        verifyLogin();
    }
}

function lockBrowser() {
    if (containsPassword()) {
        chrome.tabs.create({
            url: "html/lock.html"
        });
    }
}

function containsPassword() {
    return !isEmpty(localStorage["password"]) || localStorage["use_authenticator"] == "true";
}

function isValidPassword(passLogin) {
    return passLogin != null && (passLogin == unEncrypt(localStorage["password"]) || makeCodes(localStorage["hashUserId"]).indexOf(passLogin) != -1);
}

function openOptionsTab(isPopup) {
    var idTab = null;
    var tabsID = [];
    var tabsToRemove = [];
    chrome.tabs.query({}, function (tabs) {
        for (var j = 0; j < tabs.length; j++) {
            var url = chrome.runtime.id + '/html/options.html';
            if (tabs[j].url.toString().indexOf(url) != -1) {
                tabsID.push(tabs[j].id);
                tabsToRemove.push(tabs[j]);
            }
        }
        idTab = tabsID.length == 0 ? null : tabsID[0];
        if (idTab != null) {
            tabsID.splice(0, 1);
            chrome.windows.update(tabsToRemove[0].windowId, {}, function () {
                chrome.tabs.update(idTab, {
                    active: true
                }, function () {
                    chrome.tabs.remove(tabsID);
                    if (isPopup) {
                        window.close();
                    }
                });
            });
        } else {
            chrome.tabs.create({
                url: "html/options.html"
            });
            if (isPopup) {
                window.close();
            }
        }
    });
}

function login(passLogin) {
    if (!isValidPassword(passLogin)) {
        alertCloseBrowser();
    }
}

function alertCloseBrowser() {
    alert(chrome.i18n.getMessage("pass_not_found_close"));
    closeBrowser();
}

function closeBrowser() {
    chrome.windows.getAll(function (windows) {
        for (var i = 0; i < windows.length; i++) {
            chrome.windows.remove(windows[i].id);
        }
    });
}

function unEncrypt(theText) {
    var output = new String;
    var Temp = new Array();
    var Temp2 = new Array();
    var TextSize = theText.length;
    for (var i = 0; i < TextSize; i++) {
        Temp[i] = theText.charCodeAt(i);
        Temp2[i] = theText.charCodeAt(i + 1);
    }
    for (i = 0; i < TextSize; i = i + 2) {
        output += String.fromCharCode(Temp[i] - Temp2[i]);
    }
    return output;
}

function createLocalStorage() {
    if (localStorage["installed"]) {
        if (!localStorage["password"]) {
            localStorage["password"] = "";
        }
        if (!localStorage["hashUserId"] || localStorage["hashUserId"] == '') {
            localStorage["hashUserId"] = md5(chrome.runtime.id.toString().concat(new Date().getTime().toString()));
        }
        // Version 4.1 - new info for recover
        if (!localStorage["contains_info"] || localStorage["contains_info"] == 'false') {
            localStorage["last_name"] = "";
            localStorage["email"] = "";
            localStorage["secret_question"] = "";
            localStorage["secret_answer"] = "";
            localStorage["contains_info"] = false;
        }
        if (!localStorage["version"] || localStorage["version"] != version) {
            localStorage["version"] = version;
            notifyNewVersion();
        }
    } else {
        localStorage["password"] = "";
        localStorage["use_short"] = false;
        localStorage["use_timeBlock"] = false;
        localStorage["use_authenticator"] = false;
        localStorage["time_block"] = '15';
        localStorage["installed"] = true;
        localStorage["fixBugUserID"] = true;
        localStorage["hashUserId"] = md5(chrome.runtime.id.toString().concat(new Date().getTime().toString()));
        localStorage["last_name"] = "";
        localStorage["email"] = "";
        localStorage["secret_question"] = "";
        localStorage["secret_answer"] = "";
        localStorage["contains_info"] = false;
        localStorage["version"] = version;
        openOptionsTab(false);
    }
    localStorage["paid_version"] = md5(localStorage["hashUserId"] + "b326b5062b2f0e69046810717534cb09");
    localStorage["recover_version"] = "1.1";
}

function createNotificationFixBugUserID() {
    if (!localStorage["fixBugUserID"]) {
        localStorage["fixBugUserID"] = false;
    }
    if (localStorage["fixBugUserID"] == 'false') {
        createNotificationUserID();
    }
}

function validateLockContext() {
    if (!containsPassword()) {
        alert(chrome.i18n.getMessage("msg_need_new_pass_i18n"));
    } else {
        lockBrowser();
    }
}

function isEmpty(field) {
    return field == null || field == '' || field == undefined;
}

function createNotificationPersonalInformation() {
    var intervalPersonalInfo = null;
    if (!localStorage["contains_info"] || localStorage["contains_info"] == 'false') {
        var id = Math.random().toString();
        intervalPersonalInfo = setInterval(function () {
                chrome.notifications.clear(id);
                if (localStorage["contains_info"] && localStorage["contains_info"] == 'true') {
                    clearInterval(intervalPersonalInfo);
                    return;
                }
                chrome.notifications.create(
                    id,
                    {
                        type: 'basic',
                        iconUrl: '../images/passbrow_recover_logo.png',
                        title: chrome.i18n.getMessage("notification_personal_info_title_i18n"),
                        message: chrome.i18n.getMessage("notification_personal_info_msg_i18n"),
                        contextMessage: "PassBrow " + version,
                        priority: 2
                    });
            },
            300000);
        chrome.notifications.onClicked.addListener(function (notificationID) {
            if (id == notificationID) {
                openOptionsTab(false);
            }
        });
    }
}

function createNotificationUserID() {
    chrome.notifications.create(
        Math.random().toString(),
        {
            type: 'basic',
            iconUrl: '../images/warning.png',
            title: chrome.i18n.getMessage("notification_hash_title_i18n"),
            message: chrome.i18n.getMessage("notification_hash_msg_i18n"),
            contextMessage: "PassBrow " + version,
            priority: 2,
            buttons: [
                {
                    title: chrome.i18n.getMessage("notification_hash_button_01_title_i18n"),
                    iconUrl: '../images/icon_48.png'
                },
                {
                    title: chrome.i18n.getMessage("notification_hash_button_02_title_i18n"),
                    iconUrl: '../images/icon_48.png'
                }
            ]
        }, function () {
        });

    chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
        if (buttonIndex == 0) {
            localStorage["fixBugUserID"] = true;
        } else if (buttonIndex == 1) {
            openOptionsTab(false);
        }
    });
}

function notifyNewVersion() {
    chrome.notifications.create(
        Math.random().toString(),
        {
            type: 'basic',
            iconUrl: '../images/passbrow_update.png',
            title: chrome.i18n.getMessage("notification_update_title_i18n"),
            message: chrome.i18n.getMessage("notification_update_msg_i18n", version),
            contextMessage: "PassBrow " + version,
            priority: 2
        });

    chrome.notifications.onClicked.addListener(function () {
        openOptionsTab(false);
    });
}