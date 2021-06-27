window.onload = () => {
    // configuration parameters are located at authConfig.js
    msalConfig.system.allowRedirectInIframe = true;
    const myMSALObj = new msal.PublicClientApplication(msalConfig);
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get("sid");

    // Choose which account to logout from by passing a username.
    const logoutRequest = {
        sid: sid,
        onRedirectNavigate: () => {
            // Return false to stop navigation after local logout
            return false;
        }
    };

    myMSALObj.logoutRedirect(logoutRequest);
}