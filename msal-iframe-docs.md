# iframe usage scenarios

MSAL.js can be used with iframed applications under restricted conditions.

* You **cannot** iframe the Azure AD login UX itself, as the service will refuse to render it and your app will receive an `X-FRAME OPTIONS DENY` error. This restriction is due to prevent [clickjacking attacks](https://owasp.org/www-community/attacks/Clickjacking).
* You **cannot** use [redirect APIs](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/initialization.md#redirect-apis) in an iframed msal app; user interactions with the IdP must be handled via popups (see [below]())
* You can use [single-sign on](https://docs.microsoft.com/azure/active-directory/develop/msal-js-sso) between iframed and parent msal apps running on the same domain
* You can use [single-sign on](https://docs.microsoft.com/azure/active-directory/develop/msal-js-sso) between iframed and parent msal apps running on different domains if both apps are owned or managed (see [below]())

> :information_source: Azure AD B2C offers an [embedded sign-in experience](https://docs.microsoft.com/azure/active-directory-b2c/embedded-login) (public preview), which allows rendering custom login UX in an iframe. See the sample.

## Browser restrictions

Because Azure AD session cookies within an iframe are considered [3rd party cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#third-party_cookies), certain browsers (for example Safari or Chrome in incognito mode with 3rd party cookies disabled) either block or clear these cookies. This will affect single sign-out experience for iframed apps as they will not have access to IdP session cookies.

Additionally, when 3rd party cookies are disabled, the app in the iframe will not have access to local or session storage. MSAL.js will fallback to in-memory storage in this case (can store auth state in cookie then?).

## Single sign-on

iframed and parent apps on the same domain will have access to the same MSAL.js cache. If there are more than one account, you can bypass the account selection screen

iframed and parent apps on different domains will need to exchange an account, a loginHint or a sid. You can make use of [postMessage]() API in this case. Make sure to always specify an exact target origin.

## Errors and exceptions

You should catch the errors if ssoSilent fails

* interactionRequiredError: will be thrown for consent, MFA, etc.
* BrowserAuthError: if no or empty login hint

## User interaction

if you like to minimize communication with IdP that requires user interaction, or if you have issues with popups due to policy or etc, you may consider to:

* avoid interaction when users sign-in first time (Admin consent to permissions for tenant)
* avoid interaction when an API called requiring a scope that was not previously consented in parent (Pre-authorize client apps to call APIs)

## Single sign-out

See how to configure front-channel logout uri

## Supporting IE and Edge

transition between trusted zones clear the cache. Set store auth state in cookies to true

## Supporting Safari

set cookie policy?
