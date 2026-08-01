# PlateRenew — Expo/React Native scaffold

Native port of the PlateRenew prototype: a Nigerian driver's-license and
vehicle-papers renewal app that acts as an agent between car owners and
verified license-processing agencies.

## What's here

- **Expo Router** file-based navigation (`app/`) — matches the current
  Expo standard, no separate navigation config to maintain
- Onboarding: welcome → face capture (real camera via `expo-camera`,
  with a graceful fallback if permission is denied) → PIN backup
- Tabs: Home, Renewals, Track, Profile (`app/(tabs)/`)
- Renewal wizard (`app/renew/`): license or vehicle details (with
  scan-to-autofill) → agency selection → documents → payment →
  confirmation
- Shared design tokens (`src/theme/tokens.js`) ported 1:1 from the
  web prototype so colors/type match exactly
- `src/lib/api.js` — every network call the UI needs, currently
  mocked with timers. Swap each function's internals for a real
  `fetch`/SDK call; the signatures are the contract already wired
  into every screen

## What's stubbed, not real

- **Face match / liveness**: `enrollFace` / `verifyFace` in
  `api.js` currently just resolve `true`. A real build needs an
  actual liveness-detection SDK (a static photo match alone is not
  sufficient anti-spoofing) — this is the single most important
  piece to get right before launch, given it's the fraud-prevention
  mechanism.
- **Document OCR**: `extractDocument` returns fixed mock values.
  Nigerian license/vehicle-particulars layouts aren't a
  standardized machine-readable format, so plain OCR is unlikely
  to be reliable — plan on a hosted document-AI service with a
  custom template, or a model fine-tuned on real (consented)
  samples. Always keep a manual review/edit step; never
  auto-submit unreviewed extraction output to an agency.
- **Payment**: wired to `react-native-paystack-webview` — the
  checkout sheet is real. But `initializePayment` and
  `verifyPayment` in `src/lib/api.js` are still mocked; in
  production those must call **your backend**, which holds the
  Paystack **secret** key and does:
  1. `POST /transaction/initialize` (or just generate your own
     reference) before the client opens checkout
  2. `GET /transaction/verify/:reference` after Paystack's
     client-side `onSuccess` fires — never trust the client
     callback alone, since a tampered device could fake it
  3. A **Paystack Transfer** to the agency's bank account once
     delivery is confirmed — this is what "escrow" actually means
     here, and it requires your business to complete Paystack's
     KYC and needs the secret key server-side. Paystack does not
     hold funds in escrow automatically.

  Copy `.env.example` to `.env` and set
  `EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY` to your Paystack public key
  (test key while developing, live key before launch — get both
  from the Paystack dashboard under Settings → API Keys &
  Webhooks). The public key is safe to ship in the app; the secret
  key is not — it never belongs in this repo.
- **Agency data**: `AGENCIES` in `src/data/mockData.js` is
  hardcoded. This becomes a real backend once you have actual
  partner agencies onboarded.

## Getting started

```bash
npm install
cp .env.example .env   # then add your Paystack public key
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) for the fastest way to
see it running on a real device.

## Building & publishing

This scaffold uses **EAS Build**, Expo's hosted build/signing
service — you don't need a local Xcode/Android Studio setup to
produce store-ready binaries.

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios       # or --platform android, or both
eas submit --platform ios      # after the build finishes
```

Before any of this will produce a submittable build, you need,
outside of this codebase:

- An **Apple Developer Program** account (~$99/year) for iOS
- A **Google Play Console** account (~$25 one-time) for Android
- App Store / Play Store listing assets (screenshots, privacy
  policy URL, data-safety declarations — biometric + payment data
  will draw real scrutiny in review)
- NDPR (Nigeria Data Protection Regulation) compliance review for
  the biometric enrollment and ID-document handling
- A real backend behind `src/lib/api.js`

None of the above can be automated away — they're account
ownership, legal, and review steps, not code.

## Folder structure

```
app/
  index.js              splash → routes to onboarding or dashboard
  onboarding/
    welcome.js
    face-capture.js
    pin-setup.js
  (tabs)/
    index.js            dashboard
    renewals.js
    track.js
    profile.js
  renew/                modal stack, one screen per wizard step
    license-details.js
    vehicle-details.js
    agency.js
    documents.js
    payment.js
    confirmation.js
src/
  theme/tokens.js        colors, fonts, radii — single source of truth
  components/            shared UI: buttons, fields, ExtractCard, etc.
  context/RenewalContext.js   wizard state (form, agency, docs)
  data/mockData.js        agencies + mock OCR extraction results
  lib/api.js               the full API surface, mocked for now
```
