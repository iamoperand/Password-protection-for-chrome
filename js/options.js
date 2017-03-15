const CHAR_HIDDEN = "********";
const BTN_EXIT = "exit";
const BTN_SAVE_CONFIGS = "save_configs";
const MODAL_PASSWORD_EDIT_INFO = "modal_password_edit";
const MODAL_PASSWORD_SAVE = "modal_password_save";
const MODAL_PASSWORD_DELETE = "modal_password_delete";
var spinner = null;

var Releases = {};
Releases.loadReleases = function () {
    function load(json) {
        var html = "";
        $.each(json.releases_notes, function (index, release) {
            html += "<b>" + release.version + " - (" + release.date + ")</b>";
            html += "<span class='help-block'>";
            html += "<ul>";
            html = Releases.eachChanges(release.changes, html);
            html += "</ul>";
            html += "</span>";
            if (json.releases_notes.length > (index + 1)) {
                html += "<hr>";
            }
        });
        $("#releases_notes").append(html);
    }

    function loadDefault() {
        $.getJSON("../releases/en.json")
            .done(function (json) {
                load(json);
            })
            .fail(function (jqxhr, textStatus, error) {
                showMessageError("JSON - Releases Notes not found!");
            });
    }

    var uiLanguage = chrome.i18n.getUILanguage().substr(0, 2);
    if (uiLanguage) {
        var path = "../releases/"+ uiLanguage + ".json";
        $.getJSON(path)
            .done(function (json) {
                load(json);
            })
            .fail(function (jqxhr, textStatus, error) {
                loadDefault();
            });
    } else {
        loadDefault();
    }
}

Releases.eachChanges = function (changes, html) {
    $.each(changes, function (index1, change) {
        if (typeof change != 'object') {
            html += "<li>" + change + "</li>";
        }
        if (change.changes) {
            html += "<ul>";
            html = Releases.eachChanges(change.changes, html);
            html += "</ul>";
        }
    });
    return html;
}

$(window).load(function () {
    configMenuSelected();
    validatePermission();
});

document.addEventListener('DOMContentLoaded', init);

function init() {
    addCopyright();
    addTextTitle();
    addLabel();
    addTips();
    addEvent();
    setValuesSaved();
    autorizeAppAuthenticator();
    createSpinner();
    Releases.loadReleases();
    $("#last_name").focus();
}

function addCopyright() {
    $('#signature_options').html(chrome.i18n.getMessage("signature_options_i18n").concat(localStorage["version"]));
}

function addTextTitle() {
    showHashAppAuthenticatorOut();
    $('title').html(chrome.i18n.getMessage("title_options_i18n"));
    $('#subTitle').html(chrome.i18n.getMessage("subTitle_i18n"));
    $('#options_password').html(chrome.i18n.getMessage("legend_newPass_i18n"));
    $('#options_block').html(chrome.i18n.getMessage("legend_options_right_i18n"));
    $('#options_authenticator').html(chrome.i18n.getMessage("legend_options_authenticator_i18n"));
    $('#options_info').html(chrome.i18n.getMessage("legend_personal_information_i18n"));
    $("#options_recover").html(chrome.i18n.getMessage("legend_passbrow_recover_i18n"));
    $("#lbl_title_modal_releases").html(chrome.i18n.getMessage("legend_releases_i18n"));
    $("#codeHash").prop("title", chrome.i18n.getMessage("tip_authenticator_i18n"));
    $('#title_img_download_authenticator').prop("title", chrome.i18n.getMessage("title_img_download_authenticator_i18n"));
    $('#div_hash').hide();
}

function addLabel() {
    //Label
    $('#lbl_pass').text(chrome.i18n.getMessage("lbl_password_i18n"));
    $('#lbl_passConfirm').text(chrome.i18n.getMessage("lbl_password_confirm_i18n"));
    $('#lbl_autoBlock').append(chrome.i18n.getMessage("lbl_autoBlock_i18n"));
    $('#lbl_autoBlock_sec').text(chrome.i18n.getMessage("lbl_autoBlock_sec_i18n"));
    $('#lbl_shortcut').append(chrome.i18n.getMessage("lbl_shortcut_i18n"));
    $('#lbl_authenticator_chk').append(chrome.i18n.getMessage("lbl_authenticator_chk_i18n"));
    $('#lbl_authenticator_download_tip').text(chrome.i18n.getMessage("lbl_authenticator_download_tip_i18n"));
    $('#lbl_authenticator_download').html(chrome.i18n.getMessage("lbl_authenticator_download_i18n"));
    $('#lbl_donative').text(chrome.i18n.getMessage("lbl_donative_i18n"));
    $('#lbl_email').text(chrome.i18n.getMessage("lbl_email_i18n"));
    $('#lbl_last_name').text(chrome.i18n.getMessage("lbl_last_name_i18n"));
    $('#lbl_secret_question').text(chrome.i18n.getMessage("lbl_secret_question_i18n"));
    $('#lbl_secret_answer').text(chrome.i18n.getMessage("lbl_secret_answer_i18n"));
    $('#lbl_title_modal').text(chrome.i18n.getMessage("btn_confirm_i18n"));
    $('#lbl_saving_file_information').text(chrome.i18n.getMessage("lbl_saving_file_information_i18n"));
    $('#info_passbrow_recover').text(chrome.i18n.getMessage("info_passbrow_recover_i18n"));
    $('#info_download_apps').text(chrome.i18n.getMessage("info_download_apps_i18n"));
    $('#lbl_password_modal_login').text(chrome.i18n.getMessage("lbl_password_i18n"));
    $('#lbl_password_modal_login_options').text(chrome.i18n.getMessage("lbl_password_i18n"));

    //Menu
    $('#menu_info_personal').text(chrome.i18n.getMessage("legend_personal_information_i18n"));
    $('#menu_new_password').text(chrome.i18n.getMessage("legend_newPass_i18n"));
    $('#menu_configs').text(chrome.i18n.getMessage("legend_options_right_i18n"));
    $('#menu_passbrow_authenticador').text(chrome.i18n.getMessage("legend_options_authenticator_i18n"));
    $('#menu_passbrow_recover').text(chrome.i18n.getMessage("legend_passbrow_recover_i18n"));
    $('#menu_releases').text(chrome.i18n.getMessage("legend_releases_i18n"));

    //Button
    $('#deletePass').text(chrome.i18n.getMessage("btn_delete_i18n"));
    $('#submit_newPass').text(chrome.i18n.getMessage("btn_save_i18n"));
    $('#submit_right').text(chrome.i18n.getMessage("btn_save_i18n"));
    $('#btn_exit').text(chrome.i18n.getMessage("btn_exit_i18n"));
    $('.btn_yes').text(chrome.i18n.getMessage("btn_yes_i18n"));
    $('.btn_no').text(chrome.i18n.getMessage("btn_no_i18n"));
    $('.btn_confirm').text(chrome.i18n.getMessage("btn_confirm_i18n"));
    $('#btn_save_file_information').text(chrome.i18n.getMessage("btn_save_file_information_i18n"));
    $('#btn_download_macosx').text(chrome.i18n.getMessage("btn_download_i18n"));
    $('#btn_download_linux').text(chrome.i18n.getMessage("btn_download_i18n"));
    $('#btn_download_windows').text(chrome.i18n.getMessage("btn_download_i18n"));
    $('.btn_cancel').text(chrome.i18n.getMessage("btn_cancel_i18n"));
    $('.btn_ok').text(chrome.i18n.getMessage("btn_ok_i18n"));

    //Option
    $('#secret_question_color').html(chrome.i18n.getMessage("secret_question_color_i18n"));
    $('#secret_question_singer').html(chrome.i18n.getMessage("secret_question_singer_i18n"));
    $('#secret_question_friend').html(chrome.i18n.getMessage("secret_question_friend_i18n"));
    $('#secret_question_teacher').html(chrome.i18n.getMessage("secret_question_teacher_i18n"));
    $('#secret_question_dog').html(chrome.i18n.getMessage("secret_question_dog_i18n"));
}

function addTips() {
    $('#pass').prop("placeholder", chrome.i18n.getMessage("tip_required_field_i18n"));
    $('#passConfirm').prop("placeholder", chrome.i18n.getMessage("tip_required_field_i18n"));
    $('#tip_shortcut_ps').text(chrome.i18n.getMessage("tip_shortcut_ps_i18n"));
    $('#tip_authenticator').text(chrome.i18n.getMessage("tip_authenticator_i18n"));
    $('#email').prop("placeholder", chrome.i18n.getMessage("tip_email_i18n"));
    $('#last_name').prop("placeholder", chrome.i18n.getMessage("tip_last_name_i18n"));
    $('#secret_question_default').text(chrome.i18n.getMessage("tip_secret_question_i18n"));
    $('#secret_answer').prop("placeholder", chrome.i18n.getMessage("tip_secret_answer_i18n"));
}

function addEvent() {
    $('#chk_shortcut').click(disableShortcut);
    $('#chk_autoBlock').click(disableCountBlock);
    $('#chk_authenticator').click(saveUseAppAuthenticator);
    $('#codeHash').on('mouseout', showHashAppAuthenticatorOut);
    $('#codeHash').on('mouseover', showHashAppAuthenticatorOver);
    $('#submit_newPass').click(onSavePassword);
    $('#submit_right').click(onSaveConfigs);
    $('#submit_personal_information').click(doActionButtonInfo);
    $('#deletePass').click(onDeletePassword);
    $('#modal_confirm_btn_yes').click(confirmedModal);
    $('#btn_save_file_information').click(saveFile);
    $('#btn_exit').click(exit);
    $('#modal_password_btn_ok').click(successPasswordModal);
    $('#modal_password_options_btn_ok').click(passwordOptionsConfirmed);
    $('#modal_password_options_btn_cancel').click(passwordOptionsCanceled);
    $('#menu_releases').click(showReleases);
    $('#btn_download_macosx').click(downloadMacOSX);
    $('#btn_download_linux').click(downloadLinux);
    $('#btn_download_windows').click(downloadWindows);
    $('#modal_login').on('shown.bs.modal', onModalLoginShow);
    $('#modal_login').on('hidden.bs.modal', onModalLoginHide);
    $('#password_modal_login_options').keypress(function (event) {
        keypressModalLogin(event, '#modal_password_options_btn_ok')
    });
    $('#password_modal_login').keypress(function (event) {
        keypressModalLogin(event, '#modal_password_btn_ok')
    });
}

function downloadMacOSX() {
    window.open("https://sourceforge.net/projects/passbrow-recover/files/v1.1/MacOSX/");
}

function downloadLinux() {
    window.open("https://sourceforge.net/projects/passbrow-recover/files/v1.1/Linux/");
}

function downloadWindows() {
    window.open("https://sourceforge.net/projects/passbrow-recover/files/v1.1/Windows/");
}

function onModalLoginShow() {
    $('#password_modal_login').focus();
}

function onModalLoginHide() {
    $('#password_modal_login').val('');
}

function keypressModalLogin(event, btn) {
    if (event.which == 13) {
        event.preventDefault();
        $(btn).click();
    }
}

function showReleases() {
    $('#modal_releases').modal('show');
}

function setValuesSaved() {
    setPersonalInfoMode(localStorage["contains_info"] == 'true');
    setPasswordMode(containsPassword());
    $('#chk_autoBlock').prop('checked', localStorage["use_timeBlock"] == "true");
    $('#autoBlockCount').val(localStorage["time_block"]);
    $('#chk_shortcut').prop('checked', localStorage["use_short"] == "true");
    $('#chk_authenticator').prop('checked', localStorage["use_authenticator"] == "true");
    disableCountBlockOnload();
}

function configMenuSelected() {
    var menu = $('#menu-passbrow .nav li');
    var sectionPositions = $('.scroll-menu').map(function () {
        return $(this).position().top - 70;
    });
    $(document).on('scroll', function () {
        var scroll = $(document).scrollTop();
        var currentElement;
        $(sectionPositions).each(function (i) {
            if (scroll > this) {
                currentElement = menu[i];
            }
        });
        currentElement && addClass(currentElement);
    });
    menu.on('click', function () {
        addClass(this);
    });
}

function addClass(el) {
    $("li.active").removeClass('active');
    $(el).addClass('active');
};

function validatePermission() {
    if (containsPassword()) {
        $('#modal_login_options').on('shown.bs.modal', function () {
            $('#password_modal_login_options').focus();
        });
        $('#modal_login_options').on('hidden.bs.modal', function () {
            $('#password_modal_login_options').val('');
            $("#last_name").focus();
        })
        $('#lbl_title_modal_login_options').text(chrome.i18n.getMessage("enter_password_i18n"));
        $('#modal_login_options').modal('show');
    }
}

function saveFile() {
    saveFileInformation(chrome.i18n.getMessage("saved_file_success_i18n"));
}

function passwordOptionsConfirmed() {
    var passLogin = $('#password_modal_login_options').val();

    if (isEmpty(passLogin)) {
        $("#password_modal_login_options").notify(chrome.i18n.getMessage("tip_required_field_i18n"), {
            position: "right middle",
            className: "error"
        });
        return;
    }

    if (isValidPassword(passLogin)) {
        $('#modal_login_options').modal('hide');
    } else {
        $(".modal-header").notify(chrome.i18n.getMessage("pass_different_i18n"), {
            position: "bottom center",
            className: "error",
            arrowShow: false
        });
    }
}

function passwordOptionsCanceled() {
    window.close();
}

function exit() {
    $('#modal_confirm').on('shown.bs.modal', function () {
        $('#modal_confirm_btn_yes').focus();
    });
    $('#lbl_modal_confirm_body').text(chrome.i18n.getMessage("exit_question_i18n"));
    $("#modal_confirm_btn_yes").prop("name", BTN_EXIT);
    $('#modal_confirm').modal('show');
}

function showHashAppAuthenticatorOver() {
    $('#codeHash').val(localStorage["hashUserId"]);
    $('#codeHash').select();
}

function showHashAppAuthenticatorOut() {
    $('#codeHash').val(chrome.i18n.getMessage("hint_input_hash_authenticator_i18n"));
}

function saveUseAppAuthenticator() {
    var isChecked = $("#chk_authenticator").is(":checked");
    localStorage["use_authenticator"] = isChecked;

    autorizeAppAuthenticator();

    if (isChecked) {
        saveFileHash();
    }
}

function confirmedModal() {
    if ($('#modal_confirm_btn_yes').prop("name") == BTN_EXIT) {
        window.close();
    } else if ($('#modal_confirm_btn_yes').prop("name") == BTN_SAVE_CONFIGS) {
        saveConfigs();
    }
}

function saveFileInformation(msg) {
    $('#modal_saving_file_information').off();
    $('#modal_saving_file_information').on('shown.bs.modal', function () {
        var linkDownloadFileInfo = document.createElement('a');
        linkDownloadFileInfo.download = "information.passbrow";
        linkDownloadFileInfo.href = "data:text/plain;charset=utf-8," + localStorage["hashUserId"] + EncryptFileAES();
        $("#modal_saving_file_information").modal("hide");
        linkDownloadFileInfo.click();
        showMessageSuccess(msg);
    })
    $("#modal_saving_file_information").modal("show");
}

function saveFileHash() {
    var a = document.createElement('a');
    a.download = "hash.txt";
    a.href = "data:text/plain;charset=utf-8," + localStorage["hashUserId"];
    a.click();
}

function autorizeAppAuthenticator() {
    if ($("#chk_authenticator").is(":checked") == true) {
        $('#div_hash').show();
        addQRCode();
    } else {
        showHashAppAuthenticatorOut();
        $('#div_hash').hide();
    }
}

function addQRCode() {
    if ($('#QR_code_hash_img') != null) {
        $('#QR_code_hash_img').remove();
    }
    var image = document.createElement("img");
    var srcHash = "https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=passBrowApp://" + localStorage["hashUserId"];
    image.src = srcHash;
    image.setAttribute('id', 'QR_code_hash_img');
    image.setAttribute("style", "padding-top:15px");
    document.querySelector('span#QR_code_hash_span').appendChild(image);
}

function onSaveConfigs() {
    $('#lbl_modal_confirm_body').text(chrome.i18n.getMessage("confirm_saveOpAlt_i18n"));
    $("#modal_confirm_btn_yes").prop("name", BTN_SAVE_CONFIGS);
    $('#modal_confirm').modal('show');
}

function saveConfigs() {
    $('#modal_confirm').modal('hide');
    localStorage["use_timeBlock"] = $('input#chk_autoBlock').is(":checked");
    localStorage["use_short"] = $('input#chk_shortcut').is(":checked");
    localStorage["time_block"] = $("input#autoBlockCount").val();
    showMessageSuccess(chrome.i18n.getMessage("saveOpAlt_sucess_i18n"));
}

function doActionButtonInfo() {
    if ($('#submit_personal_information').text() == chrome.i18n.getMessage("btn_edit_i18n")) {
        editPersonalInformation();
    } else {
        savePersonalInformation();
    }
}

function successPasswordModal() {

    if (validatePasswordModal()) {
        $('#modal_login').modal('hide');
        var name = $('#modal_password_btn_ok').prop('name');
        switch (name) {
            case MODAL_PASSWORD_SAVE:
                setPasswordMode(false);
                break;
            case MODAL_PASSWORD_EDIT_INFO:
                setPersonalInfoMode(false);
                break;
            case MODAL_PASSWORD_DELETE:
                deletePasswordConfirmed();
                break;
            default:
                break;
        }
    }

}

function savePersonalInformation() {
    if (!validatePersonalInformation()) {
        return;
    }
    localStorage["last_name"] = $('#last_name').val();
    localStorage["email"] = $('input#email').val();
    localStorage["secret_question"] = $('#secret_question').find(":selected").val();
    localStorage["secret_answer"] = $('#secret_answer').val();
    localStorage["contains_info"] = true;
    setPersonalInfoMode(true);
    saveFileInformation(chrome.i18n.getMessage("saveOpAlt_sucess_i18n"));
}

function setPasswordMode(disable) {
    $('#pass').prop("disabled", disable);
    $('#passConfirm').prop("disabled", disable);
    $('#deletePass').prop("disabled", !disable);

    if (disable) {
        $('#pass').val(CHAR_HIDDEN);
        $('#passConfirm').val(CHAR_HIDDEN);
        $('#submit_newPass').text(chrome.i18n.getMessage("btn_edit_i18n"));
    } else {
        $('#pass').val('');
        $('#passConfirm').val('');
        $('#submit_newPass').text(chrome.i18n.getMessage("btn_save_i18n"));
        $("#pass").focus();
    }
}

function setPersonalInfoMode(disable) {
    $('#last_name').prop("disabled", disable);
    $('#email').prop("disabled", disable);
    $('#secret_question').prop("disabled", disable);
    $('#secret_answer').prop("disabled", disable);
    $('#btn_save_file_information').prop("disabled", !disable);

    if (disable == true) {
        $('#last_name').val(CHAR_HIDDEN);
        $('#email').val(CHAR_HIDDEN);
        $('#secret_question').val(CHAR_HIDDEN);
        $('#secret_answer').val(CHAR_HIDDEN);
        $('#submit_personal_information').text(chrome.i18n.getMessage("btn_edit_i18n"));
    } else {
        $('#last_name').val(localStorage["last_name"]);
        $('#email').val(localStorage["email"]);
        $('#secret_question').val(localStorage["secret_question"]);
        $('#secret_answer').val(localStorage["secret_answer"]);
        $('#submit_personal_information').text(chrome.i18n.getMessage("btn_save_i18n"));
        $("#last_name").focus();
    }
}

function disableShortcut() {
    if (!containsPassword()) {
        $('#chk_shortcut').prop("checked", false);
        $("#chk_shortcut").notify(chrome.i18n.getMessage("msg_need_new_pass_i18n"), {
            position: "left middle",
            className: "warn"
        });
    }
}

function disableCountBlockOnload() {
    $("#autoBlockCount").prop('disabled', !$('#chk_autoBlock').is(":checked"));
}

function disableCountBlock() {
    if (!containsPassword()) {
        $('#chk_autoBlock').prop("checked", false);
        $("#autoBlockCount").prop("disabled", true);
        $("#chk_autoBlock").notify(chrome.i18n.getMessage("msg_need_new_pass_i18n"), {
            position: "left middle",
            className: "warn"
        });
    }
    else {
        disableCountBlockOnload();
    }
}

function createVarsChangeBlockAndShortcut() {
    localStorage["password"] = "";
    localStorage["use_timeBlock"] = false;
    localStorage["use_short"] = false;
}

function savePassword() {
    localStorage["password"] = Encrypt($("#pass").val().trim());
    setPasswordMode(true);
    saveFileInformation(chrome.i18n.getMessage("pass_saved_i18n"));
}

function onSavePassword() {
    if ($('#submit_newPass').text() == chrome.i18n.getMessage("btn_edit_i18n")) {
        $('#lbl_title_modal_login').text(chrome.i18n.getMessage("enter_password_i18n"));
        $('#modal_password_btn_ok').prop("name", MODAL_PASSWORD_SAVE);
        $('#modal_login').modal('show');
    } else if (validateCreate()) {
        savePassword();
    }
}

function editPersonalInformation() {
    if (containsPassword()) {
        $('#lbl_title_modal_login').text(chrome.i18n.getMessage("enter_password_i18n"));
        $('#modal_password_btn_ok').prop("name", MODAL_PASSWORD_EDIT_INFO);
        $('#modal_login').modal('show');
    } else {
        setPersonalInfoMode(false);
    }
}

function onDeletePassword() {
    $('#lbl_title_modal_login').text(chrome.i18n.getMessage("title_modal_delete_i18n"));
    $('#modal_password_btn_ok').prop("name", MODAL_PASSWORD_DELETE);
    $('#modal_login').modal('show');
}

function deletePasswordConfirmed() {
    createVarsChangeBlockAndShortcut();
    $("#pass").val('');
    $("#passConfirm").val('');
    setValuesSaved();
    showMessageSuccess(chrome.i18n.getMessage("del_pass_success_i18n"));
}

function validatePasswordModal() {
    var pass = $("#password_modal_login").val();

    if (isEmpty(pass)) {
        $("#password_modal_login").notify(chrome.i18n.getMessage("tip_required_field_i18n"), {
            position: "right middle",
            className: "error"
        });
        return false;
    }
    if (!isValidPassword(pass)) {
        $(".modal-header").notify(chrome.i18n.getMessage("pass_different_i18n"), {
            position: "bottom center",
            className: "error",
            arrowShow: false
        });
        return false;
    }
    return true;
}

function validateCreate() {
    var pass = $("#pass").val(),
        passConfirm = $("#passConfirm").val(),
        validate = true;

    if (checkLength(pass, 3, 16)) {
        $("#pass").notify(chrome.i18n.getMessage("pass_size_i18n"), {
            position: "right middle",
            className: "error"
        });
        validate = false;
    }
    else if (checkRegexp(pass, /^([0-9a-zA-Z])+$/)) {
        $("#pass").notify(chrome.i18n.getMessage("pass_invalid_i18n"), {
            position: "right middle",
            className: "error"
        });
        validate = false;
    }

    if (checkLength(passConfirm, 3, 16)) {
        $("#passConfirm").notify(chrome.i18n.getMessage("pass_size_i18n"), {
            position: "right middle",
            className: "error"
        });
        validate = false;
    }
    else if (checkRegexp(passConfirm, /^([0-9a-zA-Z])+$/)) {
        $("#passConfirm").notify(chrome.i18n.getMessage("pass_invalid_i18n"), {
            position: "right middle",
            className: "error"
        });
        validate = false;
    }

    if (validate && pass != passConfirm) {
        showMessageError(chrome.i18n.getMessage("pass_different_save_i18n"));
        validate = false;
    }
    return validate;
}

function checkRegexp(obj, regexp) {
    return !(regexp.test(obj));
}

function checkLength(obj, min, max) {
    return obj.length > max || obj.length < min;
}

function Encrypt(theText) {
    var output = new String;
    var Temp = new Array();
    var Temp2 = new Array();
    var TextSize = theText.length;
    for (var i = 0; i < TextSize; i++) {
        var rnd = Math.round(Math.random() * 122) + 68;
        Temp[i] = theText.charCodeAt(i) + rnd;
        Temp2[i] = rnd;
    }
    for (i = 0; i < TextSize; i++) {
        output += String.fromCharCode(Temp[i], Temp2[i]);
    }
    return output;
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

function EncryptFileAES() {
    var iv = "00000000000000000000000000000000";
    var salt = "00000000000000000000000000000000";
    var keySize = 128;
    var iterationCount = 10000;
    var aesUtil = new AesUtil(keySize, iterationCount);
    var localstorageObj = JSON.parse(JSON.stringify(localStorage));
    if (localstorageObj.password) {
        localstorageObj.password = unEncrypt(localstorageObj.password);
    }
    var encrypt = aesUtil.encrypt(salt, iv, localStorage["hashUserId"], JSON.stringify(localstorageObj));
    return encrypt;
}


function validatePersonalInformation() {
    var last_name = $("#last_name").val(),
        email = $("#email").val(),
        secret_question = $('#secret_question').find(":selected").val(),
        secret_answer = $("#secret_answer").val(),
        validate = true;

    if (isEmpty(secret_answer)) {
        $("#secret_answer").notify(chrome.i18n.getMessage("tip_required_field_i18n"), {
            position: "right middle",
            className: "error"
        });
        $("#secret_answer").focus();
        validate = false;
    }
    if (isEmpty(secret_question)) {
        $("#secret_question").notify(chrome.i18n.getMessage("tip_required_field_i18n"), {
            position: "right middle",
            className: "error"
        });
        $("#secret_question").focus();
        validate = false;
    }
    if (isEmpty(email)) {
        $("#email").notify(chrome.i18n.getMessage("tip_required_field_i18n"), {
            position: "right middle",
            className: "error"
        });
        $("#email").focus();
        validate = false;
    } else if (email.indexOf("@") == -1 || email.split("@").length < 2
        || email.split("@")[1].indexOf(".") == -1) {
        $("#email").notify(chrome.i18n.getMessage("msg_validate_email_invalid"), {
            position: "right middle",
            className: "error"
        });
        $("#email").focus();
        validate = false;
    }
    if (isEmpty(last_name)) {
        $("#last_name").notify(chrome.i18n.getMessage("tip_required_field_i18n"), {
            position: "right middle",
            className: "error"
        });
        $("#last_name").focus();
        validate = false
    }
    return validate;
}

function showMessageSuccess(msg) {
    $(".container-fluid").notify(msg, {
        position: "bottom center",
        className: "success",
        arrowShow: false
    });
}

function showMessageError(msg) {
    $(".container-fluid").notify(msg, {
        position: "bottom center",
        className: "error",
        arrowShow: false
    });
}

function createSpinner() {
    var opts = {
        lines: 13, length: 20, width: 10, radius: 30, corners: 1, rotate: 0,
        direction: 1, color: '#000', speed: 1, trail: 60, shadow: false, hwaccel: false,
        className: 'spinner', zIndex: 2e9, top: 'auto', left: 'auto', scale: 0.5
    };
    var target = $('#saving_spinner_center')[0];
    spinner = new Spinner(opts).spin(target);
}