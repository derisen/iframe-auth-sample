# iframe usage scenarios

3p cookies disabled, the app in the iframe will not have local or session storage available. msal v2 will fallback to in memory storage in this scenario (use postMessage API?)

single sign on upon click (activate interaction?)

single sign on upon parent sign-in (need refresh and wait for frame to load)

loading an owned portal (different domain)

Best to do

- use popus for interaction (add blank page for returnUri)
- if you have issues with popups due to policy or etc, and cannot use redirect experience because of
    - pre-consent
    consent required for user to accept permissions
    consent required for additional scopes
    admin consent to scopes
    pre-authorized apps to call an api

ss-out?
    out when parent out
    out when children out



supporting ie and edge
supporting safari (and chrome in private mode 3rd p cookies disabled)
