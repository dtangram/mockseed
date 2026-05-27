import { SynthesizedField } from "./SynthesizedField";

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
