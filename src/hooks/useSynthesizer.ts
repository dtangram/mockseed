import { useContext } from "react";
import { SynthesizerContext } from "../context/SynthesizerContext";

const useSynthesizer = () => {
  const context = useContext(SynthesizerContext);
  if (!context) {
    throw new Error("useSynthesizer must be used within a SynthesizerProvider");
  }
  return context;
};

export default useSynthesizer;
