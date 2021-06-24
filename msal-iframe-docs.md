# iframe usage scenarios

* both iframed apps must be owned?

* You can run an msal secured app in an iframe
* You can use sso with embedded applications running on different domains (3rd party content)
    * if both owned
    * if parent owned
    * if frame owned (url query params)
    * or all of this is pointless and use postMessage API
* You can single-sign out with parent via front-channel logout uri
* You cannot use redirect experience in an iframed msal app, user interactions with IdP must be handled via popups (see also #)

Azure AD login UX cannot be iframed, as it will refuse to render x-frame options deny.

sandboxing

why redirect cant be used

This is a restriction from the Service where the login UX does not support rendering in an iframe.

prompt

make sure to load frame after

Always specify an exact target origin, not *, when you use postMessage to send data to other windows.

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

supporting ie and edge
    set cookies ?
supporting safari (and chrome in private mode 3rd p cookies disabled)
    make sure to pre-consent and pre-authorize
