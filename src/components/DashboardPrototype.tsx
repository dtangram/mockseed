import React from "react";
import { Database } from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";
import SaaSDashboard from "./SaaSDashboard";
import EcomDashboard from "./EcomDashboard";
import PatientDashboard from "./PatientDashboard";
import IoTTelemetryDashboard from "./IoTTelemetryDashboard";
import DynamicGenericDashboard from "./DynamicGenericDashboard";

const DashboardPrototype = () => {
  const { synthesizedResult, selectedPresetId, dataHeadersKeys } = useSynthesizer();

  if (!synthesizedResult || !synthesizedResult.data || !synthesizedResult.data.length) {
    return (
      <section className="flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-dashed border-slate-800" id="prototype-empty-state">
        <Database className="w-12 h-12 mb-4 text-indigo-400 animate-pulse" aria-hidden="true" />
        <h4 className="text-lg font-medium text-slate-200">No mock dataset compiled yet</h4>
        <p className="mt-2 text-sm max-w-sm font-sans">
          Write or pick a schema on the left, then click <strong>Synthesize Mock Dataset</strong>. The AI will populate an instant interactive front-end prototype here!
        </p>
      </section>
    );
  }

  // 1. SaaS Dashboard Prototype renderer
  if (selectedPresetId === "saas-users" || (dataHeadersKeys.includes("billingEmail") && dataHeadersKeys.includes("subscription"))) {
    return <SaaSDashboard records={synthesizedResult.data} />;
  }

  // 2. Ecommerce Dashboard Prototype renderer
  if (selectedPresetId === "ecom-orders" || (dataHeadersKeys.includes("itemsPurchased") && (dataHeadersKeys.includes("orderTotal") || dataHeadersKeys.includes("shippingAddress")))) {
    return <EcomDashboard records={synthesizedResult.data} />;
  }

  // 3. Healthcare Patient Dashboard Prototype renderer
  if (selectedPresetId === "medical-patients" || (dataHeadersKeys.includes("fullNameKanji") || dataHeadersKeys.includes("latestVitals"))) {
    return <PatientDashboard records={synthesizedResult.data} />;
  }

  // 4. IoT Telemetry Dashboard renderer
  if (selectedPresetId === "iot-telemetry" || (dataHeadersKeys.includes("nodeIdentifier") && dataHeadersKeys.includes("gridCoordinates"))) {
    return <IoTTelemetryDashboard records={synthesizedResult.data} />;
  }

  // 5. Fallback Bento-style generic interactive renderer
  return <DynamicGenericDashboard records={synthesizedResult.data} />;
};

export default DashboardPrototype;
