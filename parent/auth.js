// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

const iframeDomain = "http://localhost:3002";
const iframeDiv = "iframe-div"
let username = "";

/**
 * A promise handler needs to be registered for handling the
 * response returned from redirect flow. For more information, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis
 */
myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch((error) => {
        console.error(error);
    });

function signIn() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {

    // Choose which account to logout from by passing an account object
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username),
        postLogoutRedirectUri: "/",
    };

    myMSALObj.logoutRedirect(logoutRequest);
}

function handleResponse(response) {

    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

    if (response !== null) {
        username = response.account.username;
        welcomeUser(username);

        loadFrame(iframeDomain, iframeDiv)
            .then((iframe) => {
                setTimeout(() => {
                    iframe.contentWindow.postMessage(username, iframeDomain);
                }, 3000);
            });
    } else {
        selectAccount();
    }
}

function selectAccount() {

    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = myMSALObj.getAllAccounts();

    if (!currentAccounts) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].username;
        welcomeUser(username);

        loadFrame(iframeDomain, iframeDiv)
            .then((iframe) => {
                setTimeout(() => {
                    iframe.contentWindow.postMessage(username, iframeDomain);
                }, 3000);
            });
    }
}

function createIframe(appenDiv) {
    const authFrame = document.createElement("iframe");

    authFrame.setAttribute("height", 200)
    authFrame.setAttribute("width", 600)
    authFrame.setAttribute("border", 1)
    document.getElementById(appenDiv).appendChild(authFrame);

    return authFrame;
}

function loadFrame(urlNavigate, appenDiv) {
    return new Promise((resolve, reject) => {
        const frameHandle = createIframe(appenDiv);

        setTimeout(() => {
            if (!frameHandle) {
                reject("Unable to load iframe");
                return;
            }

            frameHandle.src = urlNavigate;
            resolve(frameHandle);
        }, myMSALObj.config.system.navigateFrameWait)
    });
}