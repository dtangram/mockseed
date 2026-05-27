import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import MainWorkspace from "./MainWorkspace";

const MainSynthesizerWorkspace = () => {
  return (
    <section className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between" id="applet-viewport">
      {/* Visual background patterns */}
      <span className="absolute top-0 left-0 w-full h-[600px] bg-radial-gradient from-indigo-950/20 via-sky-950/5 to-transparent pointer-events-none block" aria-hidden="true"></span>

      {/* Primary Header */}
      <Header />

      {/* Main Workspace extracted component */}
      <MainWorkspace />

      {/* Applet level Footer */}
      <Footer />
    </section>
  );
};

export default MainSynthesizerWorkspace;
