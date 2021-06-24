# iframe usage scenarios

## Quick notes

* You can run an msal app in an iframe
* You can use [single-sign on]() between iframed and parent msal apps running on different domains
* You cannot use [redirect experience]() in an iframed msal app, user interactions with IdP must be handled via popups (see also #)

Azure AD login UX cannot be iframed, as the service will refuse to render the UX and you'll receive an `X-FRAME OPTIONS DENY` error if it attempts to do so. This restriction is due to prevent [clickjacking]() attacks.

> :information_source: Azure AD B2C offers embedded sign-in experience (public preview). See a sample.


Always specify an exact target origin, not * wildcards, when you use [postMessage]() API to send data to other windows.

## Errors and exceptions

* catch interactionRequiredError
* catch authError

3p cookies disabled, the app in the iframe will not have local or session storage available. msal v2 will fallback to in memory storage in this scenario (is this because of how msal sandboxes?) (use postMessage API?)

Cookies can be read and set either in a first-party context, i.e. where the domain is loaded in the top frame or a pop up, or in a third-party context, i.e. inside of an iframe inside a different domain. Privacy protection features such as Safari ITP prevent those cookies from being shared (i.e. cookies set for a given domain in a first-party context are not available when that domain is used in a third-party context).


Best to do

- if you have issues with popups due to policy or etc, and cannot use redirect experience because of
    - pre-consent
    consent required for user to accept permissions
    consent required for additional scopes
    admin consent to scopes
    pre-authorized apps to call an api

ss-out?
    out when parent out
    out when children out?
?

supporting ie and edge
    set cookies ?
supporting safari (and chrome in private mode 3rd p cookies disabled)
    make sure to pre-consent and pre-authorize
