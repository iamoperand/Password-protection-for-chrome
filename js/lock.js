document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('body').style.background = "url('../images/logo_lock.png') no-repeat center 300px";
    setTimeout(function () {
        verifyLogin();
    }, 100);
});