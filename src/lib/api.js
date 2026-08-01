// -----------------------------------------------------------------
// Stub API layer. Every function here returns mock data on a
// timer so the app is fully clickable with no backend. Replace
// each implementation with a real fetch() to your backend as it's
// built — the function signatures are the contract the UI expects.
// -----------------------------------------------------------------
import { AGENCIES, MOCK_EXTRACTED } from "../data/mockData";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * OCR / document-AI extraction for expired license or vehicle
 * papers. `uri` is a local file URI from expo-image-picker.
 *
 * NOTE: generic OCR (e.g. plain Tesseract) is unlikely to be
 * reliable on Nigerian driver's license / vehicle particulars
 * layouts — they're not a standardized machine-readable format.
 * Realistic options: a hosted document-AI service with a custom
 * template, or a model fine-tuned on real (consented) samples of
 * these documents. Build in a manual-review/edit step regardless
 * — never auto-submit unreviewed OCR output to an agency.
 */
export async function extractDocument(serviceType, uri) {
  await delay(1500);
  return MOCK_EXTRACTED[serviceType];
}

/** Face enrollment — capture + store a biometric template. */
export async function enrollFace(uri) {
  await delay(1200);
  return { ok: true };
}

/** Face verification — compare a fresh capture to the enrolled template. */
export async function verifyFace(uri) {
  await delay(1200);
  return { match: true, confidence: 0.97 };
}

/** List verified partner agencies, optionally filtered by service/location. */
export async function listAgencies(serviceType) {
  await delay(400);
  return AGENCIES;
}

/** Submit a renewal request with documents + chosen agency. */
export async function submitRenewal(payload) {
  await delay(800);
  return { ok: true, reference: "PR-8842-LGA" };
}

/**
 * Paystack payment flow — split into two calls on purpose:
 *
 * 1. initializePayment() hits YOUR backend, which creates a
 *    pending order and returns a reference + amount in kobo. The
 *    client then hands that reference to the Paystack SDK
 *    (public key only — see app/renew/payment.js).
 * 2. verifyPayment() hits YOUR backend again after Paystack's
 *    client-side callback fires, and your backend calls Paystack's
 *    GET /transaction/verify/:reference with your SECRET key.
 *
 * Never trust the client-side onSuccess callback by itself — a
 * device can be tampered with, but the server-to-server verify
 * call can't be faked. Only mark the renewal as paid, and only
 * release escrow to an agency, after verifyPayment() confirms
 * status "success" server-side.
 *
 * "Escrow" here means your backend holds the charge in your
 * Paystack balance and only initiates a Paystack Transfer to the
 * agency's bank account once delivery is confirmed — Paystack
 * doesn't hold funds in escrow automatically. Transfers require
 * your business to complete Paystack's KYC and use your secret
 * key server-side; budget real backend work for this, not just
 * this mobile client.
 */
export async function initializePayment({ serviceType, form, agencyId, docs, total }) {
  await delay(600);
  return {
    reference: "PSK-" + Math.floor(Math.random() * 1e9),
    amountKobo: total * 100,
    email: form.email,
  };
}

export async function verifyPayment(reference) {
  await delay(900);
  // Mock: backend would call Paystack's verify endpoint here and
  // check response.data.status === "success" and
  // response.data.amount matches what you expect before trusting it.
  return { verified: true, reference, status: "success" };
}

/** Poll renewal status for the tracking screen. */
export async function getRenewalStatus(reference) {
  await delay(400);
  return {
    reference,
    steps: [
      { t: "Request submitted", done: true },
      { t: "Agency review", done: true },
      { t: "Submitted to FRSC", done: false, active: true },
      { t: "Card in production", done: false },
      { t: "Out for delivery", done: false },
    ],
  };
}

/**
 * Sends a message to live customer support. Mocked here with a
 * short delay; wire this up to a real provider when you're ready
 * — Intercom, Crisp, Zendesk Chat, and Tawk.to all have React
 * Native SDKs or a webview-embeddable widget that could replace
 * the mock chat UI in app/support/chat.js entirely, or you could
 * route this through your own backend to a human agent queue.
 */
export async function sendSupportMessage(text) {
  await delay(700);
  return { ok: true };
}
