# MSAL.js 2.x and iFrame support

---

hidden iframe for token renewal with refresh tokens using acquireTokenSilent

The app in the iframe will need to use popups for interaction
Note, in chrome incognito with 3p cookies disabled, the app in the iframe will not have local or session storage available. msal v2 will fallback to in memory storage in this scenario.

system: {
    logger:
    loadFrameTimeout: 20000,
    windowHashTimeout: 20000,
    iframeHashTimeout: 20000
}

const isInIframe = window.parent !== window;

Make sure the page used as redirectUri is not invoking msal APIs or altering the hash on page load (you can use a blank page for silent and popup scenarios)

Unfortunately, due to the same-origin policy in the browser, we don't have a way to know why an iframe times out (we cannot programmatically inspect the contents of the iframe if it's on a different origin, such as login.microsoftonline.com).

---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/1247

This is intentional, as the sandboxing is to prevent the hidden iframe from navigating the top frame (but we still need to allow other scripts to execute in the iframe and need be able to access it programmatically via same-origin).

Typically, sandboxing is used to isolate 3rd-party websites for scenarios such as when they are used as widgets, for example. In our case, there are only two domains that will rendered inside the hidden iframe: your authority domain (e.g. login.microsoftonline.com) and your website itself. Because we trust both of these domains, were not worried about the iframed page being able to remove its sandbox (esp since the iframed page is only rendered for a brief moment before we parse the response from the url), as we simply want to prevent the iframed page from navigating the top frame.

So that message is definitely meaningful in most situations (i.e. where you are hosting a third-party site that you potentially don't trust by default), but not in our case.

---

MSAL v1 (which is used in MSAL Angular v1) implements the Implicit Flow, which uses iframes to acquire tokens. We are currently working on MSAL v2, which switches to the Auth Code Flow w/ PKCE. The Auth Code Flow uses fetch requests instead of iframes as the primary mechanism for acquiring tokens, however, there are still situation where iframes will be used. MSAL Angular will be updated to use MSAL v2 at some point in the future, although that work has not yet been planned.

---

SSO without login_hint: https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2083

---

multiple concurrent iframe issue https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2163

---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2200

Hi @kunalkankariya .

When the hidden iframe is loaded with the source as the authorization server's endpoint, login.microsoftonline.com, in our case, why isn't it able to access cookies that were set by the same domain earlier when third party cookies are blocked?

The iframe is trying to read cookies that were set by the same domain right?

Cookies can be read and set either in a first-party context, i.e. where the domain is loaded in the top frame or a pop up, or in a third-party context, i.e. inside of an iframe inside a different domain. Privacy protection features such as Safari ITP prevent those cookies from being shared (i.e. cookies set for a given domain in a first-party context are not available when that domain is used in a third-party context).

You may find our docs on handling Safari ITP, the MDN docs on HTTP Cookies, and the Webkit blog on Privacy helpful.

Which cookie is that specifically ( ESTSAUTHPERSISTENT,ESTSAUTH)? Is it a combination?

We use a few different cookies to track login state (such as the ones you list here).

@kunalkankariya
Author
kunalkankariya commented on Aug 27, 2020
Thanks @technical-boy

cookies set for a given domain in a first-party context are not available when that domain is used in a third-party context

The domain open inside the iframe (third party context) can set cookies right? Can these cookies be accessible by the same domain in first party context? (vice-versa of the point above)

@hectormmg
Member
hectormmg commented on Aug 27, 2020
@kunalkankariya no, cookie storage is segmented. This means third-party cookie access is blocked for both scenarios.

---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2401

I'm working on an application that will be embedded within an iframe in a partner application. I understood that redirect flows are not supported in iframe scenarios and so we've been developing a solution with cross-frame communication using ssoSilent using a username sent from the parent application.

By chance, I triggered a redirect_in_iframe error and saw the message:

Code flow is not supported inside an iframe. Please ensure you are using MSAL.js in a top frame of the window if using the redirect APIs, or use the popup APIs. (window.parent !== window) => true

This leads me to believe MSAL has some extra level of support for scenarios where both the parent and child frame are running MSAL v2, is that correct? are there any docs on this? any specific implementation requirements for the parent app? can the child app just use the redirect methods as if they're not in an iframe and have it work as expected?

At this time, the redirect APIs in msal-browser are not supported in iframed applications (popup and silent APIs are supported). This is a restriction from the Service where the login UX does not support rendering in an iframe. We are working on providing support for embedded application scenarios like this, however that work is currently in progress and hence there is no documentation available at this time.

We will share more in our roadmap soon.


---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2552

This is a known issue for browsers such as mobile Safari that have privacy features such as Intelligent Tracking Protection enabled. In MSAL.js v1, your application should invoke one of the interactive methods (acquireTokenPopup or acquireTokenRedirect) when acquireTokenSilent throws an InteractionRequiredAuthError to complete token acquisition.

Alternatively, you can upgrade to @azure/msal-browser, which does not use hidden iframes for silent token acquisition and thus is not susceptible to aforementioned privacy features in most scenarios.

---

iframe and logout redirect issue https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2563

---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2578

This error only happens when your app is loaded in iframe, the url contains a hash response from AAD, and the apps tries to invoke acquireTokenSilent (usually this error is thrown when the page used for the redirect URI calls acquireTokenSilent on page load). Can you please provide your configuration for MSAL?

---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/2726

Is the iframe-related errors you are getting a redirect_in_iframe error? If so, are you setting the displayInIframe flag for displayDialogAsync to true? Also note, in MSAL Browser 2.8.0 you can set system.allowRedirectInIframe to true to mitigate the redirect_in_iframe error.

--

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/3228

Msal@1.x uses hidden iframes to do silent token renewal which rely on 3rd party cookies. If these are disabled the only way to renew your token is to call an interactive method.

Version 2.x uses the Auth Code Flow with PKCE which utilizes a refresh token and a POST request instead of the hidden iframe so it does not use hidden iframes until the refresh token expires (24 hours).

You can read more about the limitations of 3rd party cookie blocking and how the Auth Code Flow mitigates this here and you'll find a migration guide from version 1 to version 2 here

https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-third-party-cookies-spas

---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/3284

You can register a "Front Channel Logout Url" on each of your app registrations you would like to be signed out. When one app calls logout, AAD will check which applications that user is signed in to and open an iframe to each corresponding front channel logout url. You'll need to ensure that url that you register calls the relevant logout APIs to clear local cache.

---

Blocking auth code requests in hidden iframes https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/src/app/ClientApplication.ts#L1079

---

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/3330

Thanks. Actually, I just realized that on the page I'm loading in the iframe, it is also loading MSAL js files and attempting auth in the iframe. Just caught this in my DEV environment.

Uncaught (in promise) BrowserAuthError: redirect_in_iframe: Code flow is not supported inside an iframe. Please ensure you are using MSAL.js in a top frame of the window if using the redirect APIs, or use the popup APIs. (window.parent !== window) => true

@jasonnutter
Member
jasonnutter commented on Apr 13
@bbarnwell Yep, pages that are loaded inside iframes cannot auth via redirects. Apps running in iframes can only silent and popup based requests.

-----

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/3365

For SPA type apps, RefreshTokens cannot be rolled out beyond their initial expiry. It means that an RT is only valid 24hrs from when the code is exchanged.
acquireTokenSilent if it detects an expired refreshToken will attempt to fetch an authorization code silently using an iframe
However as you called out, this will not work if third party cookies are blocked, as they block iframes too, and the only fallback today is to make an interactive request. This will also happen if the AAD session is invalid.
We are working on a solution to leverage storageAccessAPI which should allow end users to consent to allowing third party cookies inside of iframes. This solution is still in design phase and is not yet available in the library.