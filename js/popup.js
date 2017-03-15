document.onclick = function (event) {
    if (event.srcElement.id == 'cancel') {
        window.close();
    }
    else if (event.srcElement.id == 'options') {
        openOptionsTab(true);
    }
    else if (event.srcElement.id == 'block') {
        if (!containsPassword()) {
            $("#legend_passBrow").notify(chrome.i18n.getMessage("msg_need_new_pass_i18n"), {
                position: "bottom center",
                className: "warn",
                arrowShow: false
            });
        }
        else {
            lockBrowser();
            window.close();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    $('#legend_passBrow').text(chrome.i18n.getMessage("leg_passBrow_i18n"));
    $('#signature_popup').html(chrome.i18n.getMessage("signature_popup_i18n").concat(localStorage["version"]));
    $('#options').text(chrome.i18n.getMessage("btn_options_i18n"));
    $('#block').text(chrome.i18n.getMessage("btn_block_i18n"));
    $('#cancel').text(chrome.i18n.getMessage("btn_cancel_i18n"));
});