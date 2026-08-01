import React, { createContext, useContext, useState, useMemo } from "react";

const RenewalContext = createContext(null);

const initialForm = {
  fullName: "",
  licenseNo: "",
  state: "",
  licenseClass: "",
  address: "",
  email: "",
  ownerName: "",
  plateNo: "",
  vehicleMake: "",
  chassisNo: "",
  paperTypes: ["vehicle_licence", "roadworthiness", "insurance"],
};

export function RenewalProvider({ children }) {
  const [serviceType, setServiceType] = useState("license"); // "license" | "vehicle"
  const [form, setForm] = useState(initialForm);
  const [agencyId, setAgencyId] = useState(null);
  const [docs, setDocs] = useState({});
  const [activeReference, setActiveReference] = useState(null);

  const resetWizard = (type) => {
    setServiceType(type);
    setForm(initialForm);
    setAgencyId(null);
    setDocs({});
  };

  const value = useMemo(
    () => ({
      serviceType,
      setServiceType,
      form,
      setForm,
      agencyId,
      setAgencyId,
      docs,
      setDocs,
      activeReference,
      setActiveReference,
      resetWizard,
    }),
    [serviceType, form, agencyId, docs, activeReference]
  );

  return <RenewalContext.Provider value={value}>{children}</RenewalContext.Provider>;
}

export function useRenewal() {
  const ctx = useContext(RenewalContext);
  if (!ctx) throw new Error("useRenewal must be used within a RenewalProvider");
  return ctx;
}
