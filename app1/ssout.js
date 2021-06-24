window.onload = () => {
    // configuration parameters are located at authConfig.js
    msalConfig.system.allowRedirectInIframe = true;

    const myMSALObj = new msal.PublicClientApplication(msalConfig);

    const urlParams = new URLSearchParams(window.location.search);
    console.log('heeey')
    console.log(urlParams);
    const sid = urlParams.get("sid");
    console.log(sid)

    // Choose which account to logout from by passing a username.
    const logoutRequest = {
        sid: sid,
    };

    myMSALObj.logoutRedirect(logoutRequest);
}