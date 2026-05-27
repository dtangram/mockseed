export interface SynthesizedField {
  name: string;
  type: string;
  description: string;
}

export interface SynthesizedData {
  success: boolean;
  explanation: string;
  fields: SynthesizedField[];
  localeInfo: {
    detectedLocale: string;
    localizationDetails: string;
  };
  data: any[];
}

export interface PresetSchema {
  id: string;
  name: string;
  description: string;
  type: "typescript" | "json";
  schemaText: string;
  suggestedLocale: string;
  suggestedInstruction?: string;
}

export const PRESET_SCHEMAS: PresetSchema[] = [
  {
    id: "saas-users",
    name: "SaaS Users & Subscriptions",
    description: "Multi-layered user records with account settings, subscription states, and login dates.",
    type: "typescript",
    suggestedLocale: "English (US)",
    suggestedInstruction: "All email addresses must belong to custom domains like 'cosmiccorp.net' or 'stellarapp.io'. Mix active and past_due status.",
    schemaText: `interface SaaSUser {
  id: string;          // UUID v4 format
  fullName: string;    // Real full name
  company: string;     // Corporate or startup name
  role: "Admin" | "Manager" | "Operator" | "Viewer";
  billingEmail: string;// Standard corporate email
  phone: string;       // Formatted cell number
  subscription: {
    plan: "Free" | "Starter" | "Professional" | "Enterprise";
    status: "active" | "canceled" | "past_due";
    priceMonthly: number; // Decimal in USD
    joinedAt: string;     // ISO Timestamp
    lastInvoicePaid: boolean;
  };
  preferences: {
    theme: "dark" | "light" | "system";
    notificationsEnabled: boolean;
  };
}`
  },
  {
    id: "ecom-orders",
    name: "E-Commerce Complex Orders",
    description: "Recursive order model featuring transactional calculations, invoice IDs, and physical delivery nodes.",
    type: "json",
    suggestedLocale: "German (DE)",
    suggestedInstruction: "Product names must contain typical European names. Calculate order VAT as 19% separately and state in Euros. Generate order sequence numbers from DE-2026-0001.",
    schemaText: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "ECommerceOrder",
  "type": "object",
  "properties": {
    "orderSequenceId": { "type": "string" },
    "customerId": { "type": "string", "format": "uuid" },
    "buyerName": { "type": "string" },
    "shippingAddress": {
      "type": "object",
      "properties": {
        "streetAndNumber": { "type": "string" },
        "postalCode": { "type": "string" },
        "city": { "type": "string" },
        "state": { "type": "string" },
        "countryCode": { "type": "string" }
      },
      "required": ["streetAndNumber", "postalCode", "city", "countryCode"]
    },
    "currency": { "type": "string", "enum": ["EUR"] },
    "itemsPurchased": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "productId": { "type": "string" },
          "title": { "type": "string" },
          "unitPrice": { "type": "number" },
          "quantityPaid": { "type": "integer", "minimum": 1 }
        },
        "required": ["title", "unitPrice", "quantityPaid"]
      }
    },
    "subTotal": { "type": "number" },
    "taxRateAmount": { "type": "number" },
    "orderTotal": { "type": "number" },
    "paymentDetails": {
      "type": "object",
      "properties": {
        "gatewayUsed": { "type": "string", "enum": ["Stripe", "PayPal", "SofortCredits"] },
        "cardBrand": { "type": "string" },
        "cardLast4": { "type": "string" }
      }
    }
  },
  "required": ["orderSequenceId", "buyerName", "shippingAddress", "currency", "itemsPurchased", "orderTotal"]
}`
  },
  {
    id: "medical-patients",
    name: "Hospital Patient Vitals log",
    description: "Healthcare metrics with blood markers, allergen triggers, emergency contacts, and heart vitals.",
    type: "typescript",
    suggestedLocale: "Japanese (JP)",
    suggestedInstruction: "All address, clinic and name assets should reflect Japanese Kanji alongside Romanized keys.",
    schemaText: `interface PatientRecord {
  patientRegistrationIndex: number; // Incremental from 3100
  fullNameKanji: string;           // Japanese Kanji representation
  fullNameRomanized: string;       // Romaji transliteration
  genderIdentity: "Male" | "Female" | "Non-Binary";
  bloodType: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dateOfBirth: string;             // YYYY-MM-DD
  allergiesTriggerList: string[];  // Common food or medicine triggers
  emergencyContact: {
    contactPerson: string;
    relationship: "Parent" | "Spouse" | "Sibling" | "Guardian";
    phone: string;                 // Tokyo/Japan local format
  };
  latestVitals: {
    bloodPressureSys: number;
    bloodPressureDia: number;
    restingHeartRateBpm: number;
    bodyTempCelsius: number;
  };
}`
  },
  {
    id: "iot-telemetry",
    name: "IoT Infrastructure Logs",
    description: "Sensor data, GPS positioning, solar panel battery readings, and log events.",
    type: "json",
    suggestedLocale: "English (US)",
    suggestedInstruction: "Coordinate fields must focus on geographically reasonable microgrids inside Colorado US region. Include timestamp sequencing.",
    schemaText: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DeviceTelemetryEvent",
  "type": "object",
  "properties": {
    "nodeIdentifier": { "type": "string" },
    "deploymentState": { "type": "string", "enum": ["operational", "maintenance_required", "offline_alert"] },
    "gridCoordinates": {
      "type": "object",
      "properties": {
        "latitude": { "type": "number" },
        "longitude": { "type": "number" },
        "altitudeMeters": { "type": "number" }
      },
      "required": ["latitude", "longitude"]
    },
    "sensorsReading": {
      "type": "object",
      "properties": {
        "ambientTemperatureFahrenheit": { "type": "number" },
        "hardwareCoreTempCelsius": { "type": "number" },
        "humidityRatePercentage": { "type": "number" },
        "batteryEfficiencyVolts": { "type": "number" }
      }
    },
    "recentAlertTriggers": {
      "type": "array",
      "items": { "type": "string" }
    }
  },
  "required": ["nodeIdentifier", "deploymentState", "gridCoordinates", "sensorsReading"]
}`
  }
];
