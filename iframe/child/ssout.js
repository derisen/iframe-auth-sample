window.onload = () => {
    // need to allow redirect in iframe for front-channel logout to work
    msalConfig.system.allowRedirectInIframe = true;

    const myMSALObj = new msal.PublicClientApplication(msalConfig);

    // session id for the user
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get("sid");

    // Choose which account to logout from by passing a sid.
    const logoutRequest = {
        sid: sid,
        onRedirectNavigate: () => {
            // Return false to stop navigation after local logout
            return false;
        }
    };

    myMSALObj.logoutRedirect(logoutRequest);
}