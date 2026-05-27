import React from "react";
import { SynthesizerProvider } from "./context/SynthesizerContext";
import MainSynthesizerWorkspace from "./components/MainSynthesizerWorkspace";

export default function App() {
  return (
    <SynthesizerProvider>
      <MainSynthesizerWorkspace />
    </SynthesizerProvider>
  );
}

