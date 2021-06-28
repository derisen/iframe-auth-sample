# Working with iframes

MSAL.js can be used with iframed applications under restricted conditions:

* You **cannot** iframe the Azure AD login UX itself, as the service will refuse to render it with the `X-FRAME OPTIONS DENY` error. This restriction is due to prevent [clickjacking attacks](https://owasp.org/www-community/attacks/Clickjacking).
    * Credential Entry
    * Consent
* You **cannot** use [redirect APIs](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis) in an iframed msal app; user interactions with the IdP must be handled via popups (see [below]())
* You can use [single-sign on](https://docs.microsoft.com/azure/active-directory/develop/msal-js-sso) between iframed and parent apps running on the same domain **and** on different domains **if** both apps are owned or managed (see [below]())

> :information_source: Azure AD B2C offers an [embedded sign-in experience](https://docs.microsoft.com/azure/active-directory-b2c/embedded-login) (public preview), which allows rendering a custom login UX in an iframe. For an implementation, see the sample: []()

## Browser restrictions

Because Azure AD session cookies within an iframe are considered [3rd party cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#third-party_cookies), certain browsers (for example **Safari** or **Chrome** in incognito mode with 3rd party cookies disabled) either block or clear these cookies. This will affect the single sign-on experience for iframed apps as they will not have access to IdP session cookies.

Additionally, when 3rd party cookies are disabled, the app in the iframe will not have access to local or session storage. MSAL.js will fallback to in-memory storage in this case (can store auth state in cookie then?).

[ITP]()

**Edge**, **IE11**?

## Single sign-on

iframed and parent apps on the same domain will have access to the same MSAL.js cache instance. If there are more than one cached account, you can bypass the account selection screen by providing []().

iframed and parent apps on different domains can make use of the [ssoSilent()]() API. You will need to pass an [account](), a [loginHint]() or a [sid]() as parameter. To do so, you can make use of the [postMessage](https://html.spec.whatwg.org/multipage/web-messaging.html#dom-window-postmessage-options-dev) API, or implement a custom [brokerage]() solution. When using [postMessage()] API, please ensure to follow [security considerations]().

```javascript
// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

const parentDomain = "http://localhost:3001";
let username = "";

window.addEventListener("message", (event) => {
    // check the origin of the data
    if (event.origin === parentDomain) {
        // Data sent with postMessage is stored in event.data:
        console.log("Received message: " + event.data);

        // check if username received
        if (username.length === 0) {

            // set username
            username = event.data;

            // attempt SSO
            myMSALObj.ssoSilent({
                loginHint: username
            }).then(handleResponse)
            .catch(error => {
                // handle error
            });
        }
    }
});
```

## Errors and exceptions

You should catch the errors if ssoSilent fails. In particular:

* `InteractionRequiredError`: will be thrown for consent, MFA, etc.
* `BrowserAuthError`: if no or empty login hint

```javascript
    myMSALObj.ssoSilent({
        loginHint: username
    }).then(handleResponse)
        .catch(error => {
            if (error instanceof msal.InteractionRequiredAuthError) {
                myMSALObj.loginPopup()
                    .then(handleResponse);
            } else if (error instanceof msal.BrowserAuthError) {
                myMSALObj.loginPopup()
                    .then(handleResponse);
            } else {
                console.log(error);
            }
        });
```

## User interaction

if you like to minimize communication with IdP that requires user interaction, or if you have issues with popups due to policy or etc, you may consider to:

* **Avoid interaction when users sign-in first time** [Granting admin consent](https://docs.microsoft.com/azure/active-directory/develop/v2-admin-consent) to a tenant will suppress consent screen for permissions required by your app.
* **Avoid interaction when calling an API that requires a permission requiring consent** [Pre-authorizing client apps]() will not require consent for permissions required by your web API

## Single sign-out

You can use MSAL.js to trigger sign-out from iframed apps. See [how to configure a front-channel logout uri](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/logout.md#front-channel-logout).