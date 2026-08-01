// Placeholder data. Replace with real API calls once the backend
// (agency directory, pricing, live turnaround times) exists —
// see src/lib/api.js for where those calls should live.

export const AGENCIES = [
  {
    id: "a1",
    name: "Lekki FRSC Express Desk",
    area: "Lekki Phase 1, Lagos",
    rating: 4.8,
    turnaround: "5–7 working days",
    fee: 32500,
    verified: true,
  },
  {
    id: "a2",
    name: "Ikeja Motor Licensing Partner",
    area: "Ikeja, Lagos",
    rating: 4.6,
    turnaround: "7–10 working days",
    fee: 29000,
    verified: true,
  },
  {
    id: "a3",
    name: "VI Rapid Renewal Hub",
    area: "Victoria Island, Lagos",
    rating: 4.9,
    turnaround: "4–6 working days",
    fee: 36000,
    verified: true,
  },
];

export const STEP_LABELS = {
  license: ["License Details", "Choose Agency", "Documents", "Payment", "Confirmation"],
  vehicle: ["Vehicle Details", "Choose Agency", "Documents", "Payment", "Confirmation"],
};

export const VEHICLE_PAPER_TYPES = [
  { key: "vehicle_licence", label: "Vehicle Licence", sub: "Motor Vehicle Licence", doc: "Expired Vehicle Licence (Motor Vehicle Licence)" },
  { key: "roadworthiness", label: "Roadworthiness", sub: "Roadworthiness Certificate", doc: "Expired Roadworthiness Certificate" },
  { key: "insurance", label: "Insurance", sub: "Motor Insurance Certificate", doc: "Current/expiring Motor Insurance Certificate" },
];

export const DOC_LISTS = {
  license: [
    "Old driver's license (front & back)",
    "Valid means of ID (NIN slip / passport)",
    "Passport photograph",
    "Proof of address",
  ],
  vehicleBase: ["Proof of vehicle ownership (C of O / purchase receipt)", "Proof of address"],
};

/** Builds the vehicle document checklist from the paper types the
 *  user selected on the vehicle-details step (see paperTypes on
 *  the renewal form) — only ask for uploads that are relevant. */
export function vehicleDocItems(paperTypes = []) {
  return [
    ...DOC_LISTS.vehicleBase,
    ...VEHICLE_PAPER_TYPES.filter((pt) => paperTypes.includes(pt.key)).map((pt) => pt.doc),
  ];
}

// Mock OCR result — swap for a real document-AI/OCR call in
// src/lib/api.js::extractDocument(). See that file for notes on
// why generic OCR likely isn't enough for Nigerian license/vehicle
// document layouts.
export const MOCK_EXTRACTED = {
  license: {
    fullName: "Adaeze Okonkwo",
    licenseNo: "AAB012345678",
    state: "Lagos",
    licenseClass: "B (Private vehicle)",
  },
  vehicle: {
    ownerName: "Adaeze Okonkwo",
    plateNo: "LND 442 XA",
    vehicleMake: "Toyota Camry 2018",
    chassisNo: "JT2BF22K1W0123456",
  },
};

export const GOVT_FEE = 12500;

// Mock expiry tracker — swap for a real call once the backend
// knows each user's actual document expiry dates. The dashboard
// always surfaces whichever of these is closest to expiring.
export const EXPIRY_ITEMS = [
  { key: "license", label: "driver's license", daysLeft: 41, serviceType: "license" },
  { key: "vehicle_licence", label: "vehicle licence", daysLeft: 63, serviceType: "vehicle" },
  { key: "roadworthiness", label: "roadworthiness certificate", daysLeft: 18, serviceType: "vehicle" },
  { key: "insurance", label: "motor insurance", daysLeft: 90, serviceType: "vehicle" },
];
