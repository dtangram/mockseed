import React from "react";
import { HeartPulse, AlertCircle, Globe } from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";

interface PatientDashboardProps {
  records: any[];
}

const PatientDashboard = ({ records }: PatientDashboardProps) => {
  const { selectedRecordIndex, setSelectedRecordIndex } = useSynthesizer();

  const alertPatients = records.filter(p => {
    const v = p.latestVitals;
    if (!v) return false;
    return (v.bodyTempCelsius > 37.5) || (v.bloodPressureSys > 130) || (v.restingHeartRateBpm > 100);
  });

  const safeIndex = selectedRecordIndex !== null && selectedRecordIndex < records.length ? selectedRecordIndex : 0;
  const activePatient = records[safeIndex] || null;

  const HeartsBeatIcon = () => (
    <span className="relative flex h-2.5 w-2.5 ml-1">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
    </span>
  );

  return (
    <section className="space-y-6" id="patient-prototype-container">
      {/* Metric columns */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Clinical Metrics Summary">
        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Current Patient Admittance</span>
            <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
              {records.length} patients
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Telemetry stream synchronized</span>
          </span>
          <span className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 animate-pulse block shrink-0">
            <HeartPulse className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Active Vital Warning Alerts</span>
            <span className={`text-2xl font-bold font-mono mt-1 ${alertPatients.length > 0 ? "text-amber-500" : "text-slate-400"} block`}>
              {alertPatients.length} nodes
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Temp &gt; 37.5°C or High Blood Pressure</span>
          </span>
          <span className={`p-3 rounded-lg border block shrink-0 ${alertPatients.length > 0 ? "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-bounce" : "bg-slate-800/10 border-slate-700/20 text-slate-500"}`}>
            <AlertCircle className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Geographic Locale Code</span>
            <span className="text-lg font-bold font-mono text-slate-200 mt-1 flex items-center gap-1.5 block">
              🇯🇵 Japanese (JP)
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Kanji &amp; Romaji indexes applied</span>
          </span>
          <span className="p-3 rounded-lg bg-slate-800 text-slate-400 block shrink-0">
            <Globe className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>
      </section>

      {/* Patient roster layout split screen */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* List of Patients */}
        <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <header className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">Simulated Clinical Roster</h5>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              Auto-assigned Patient numbers
            </span>
          </header>
          <ul className="divide-y divide-slate-800 max-h-[380px] overflow-y-auto" aria-label="Simulated patients directory">
            {records.map((patient, idx) => {
              const patId = patient.patientRegistrationIndex || (3100 + idx);
              const isSelected = activePatient === patient;
              const hrs = patient.latestVitals?.restingHeartRateBpm || 72;
              const temp = patient.latestVitals?.bodyTempCelsius || 36.6;

              // Detect abnormal state
              const hasAilment = temp > 37.5 || hrs > 100;

              return (
                <li key={patId}>
                  <button
                    type="button"
                    onClick={() => setSelectedRecordIndex(idx)}
                    className={`w-full text-left p-3.5 hover:bg-slate-800/40 focus-visible:bg-slate-800/40 focus-visible:outline-hidden transition-all flex items-center justify-between gap-4 border-l-2 cursor-pointer ${
                      isSelected ? "bg-cyan-500/5 border-l-cyan-400" : "border-l-transparent"
                    }`}
                    aria-label={`View clinical vitals for patient ${patient.fullNameKanji || patId}`}
                  >
                    <span className="block">
                      <span className="flex items-center gap-2 block">
                        <span className="font-bold text-slate-200 text-xs font-mono">#{patId}</span>
                        <span className="font-semibold text-slate-100 text-sm">
                          {patient.fullNameKanji || patient.fullNameRomanized}
                        </span>
                        {patient.fullNameRomanized && patient.fullNameKanji && (
                          <span className="text-[10px] text-slate-500 font-mono">({patient.fullNameRomanized})</span>
                        )}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 flex flex-wrap gap-2 items-center block">
                        <span className="font-mono bg-slate-800 text-slate-300 px-1 py-0.2 rounded-xs">{patient.bloodType || "O+"}</span>
                        <span aria-hidden="true">•</span>
                        <span>DOB: {patient.dateOfBirth || "N/A"}</span>
                      </span>
                    </span>

                    <span className="flex items-center gap-2 block">
                      <span className="text-right block">
                        <span className="text-xs font-mono font-bold block text-slate-200">{temp}°C</span>
                        <span className="text-[10px] font-mono text-slate-500 block">{hrs} BPM</span>
                      </span>
                      {hasAilment && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping block"></span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Detailed Patient metrics */}
        <section className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <header className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">Patient Vitals Diagnostics</h5>
            <span className="text-[10px] text-indigo-400 font-mono">
              Real-Time Simulated Watchpad
            </span>
          </header>

          <section className="p-4 space-y-4">
            {activePatient ? (
              <article className="space-y-4 text-xs font-mono">
                {/* Headline badge */}
                <header className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center">
                  <span className="block">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Inpatient record</span>
                    <h4 className="text-base font-bold text-slate-100 mt-0.5">{activePatient.fullNameKanji}</h4>
                    <p className="text-[11px] text-slate-500">Transliterated: {activePatient.fullNameRomanized || "N/A"}</p>
                  </span>
                  <span className="text-right block">
                    <span className="text-xs bg-slate-800 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-sm inline-block">
                      Blood Type: {activePatient.bloodType || "O+"}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">Gender: {activePatient.genderIdentity || "N/A"}</span>
                  </span>
                </header>

                {/* Vitals breakdown */}
                <section className="space-y-3">
                  <span className="text-slate-500 uppercase tracking-widest text-[9px] block">Physiological Metric Node Stream</span>

                  <section className="grid grid-cols-2 gap-3">
                    {/* Blood pressure */}
                    <article className="border border-slate-800 bg-slate-900/50 rounded p-3">
                      <span className="text-slate-400 text-[10px] block">Blood Pressure (Sys/Dia)</span>
                      <span className="text-lg font-bold text-slate-200 mt-1 font-mono block">
                        {activePatient.latestVitals?.bloodPressureSys || 120}/{activePatient.latestVitals?.bloodPressureDia || 80}
                      </span>
                      <span className="text-[9px] text-slate-500 block">mmHg (Target: &lt;130 / &lt;85)</span>
                    </article>

                    {/* Heart Pulse */}
                    <article className="border border-slate-800 bg-slate-900/50 rounded p-3">
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 block">
                        Heart Pulse Rate <HeartsBeatIcon />
                      </span>
                      <span className="text-lg font-bold text-slate-200 mt-1 font-mono text-cyan-400 block">
                        {activePatient.latestVitals?.restingHeartRateBpm || 72} <span className="text-xs text-slate-400 font-normal">BPM</span>
                      </span>
                      <span className="text-[9px] text-slate-500 block">Resting (Target: 60 - 100)</span>
                    </article>

                    {/* Temperature */}
                    <article className="border border-slate-800 bg-slate-900/50 rounded p-3">
                      <span className="text-slate-400 text-[10px] block">Body Temperature</span>
                      <span className={`text-lg font-bold mt-1 font-mono block ${activePatient.latestVitals?.bodyTempCelsius > 37.5 ? "text-amber-400" : "text-emerald-400"}`}>
                        {activePatient.latestVitals?.bodyTempCelsius || 36.6}°C
                      </span>
                      <span className="text-[9px] text-slate-500 block">Target Core Mean: 36.0 - 37.2°C</span>
                    </article>

                    {/* Emergency Contacts */}
                    <article className="border border-slate-800 bg-slate-900/50 rounded p-3">
                      <span className="text-slate-400 text-[10px] block">Allergens Trigger List</span>
                      <span className="mt-1 font-mono flex flex-wrap gap-1 block">
                        {Array.isArray(activePatient.allergiesTriggerList) && activePatient.allergiesTriggerList.length > 0 ? (
                          activePatient.allergiesTriggerList.map((item: string, i: number) => (
                            <span key={i} className="bg-slate-800 text-slate-300 text-[9px] px-1.5 py-0.2 rounded-sm border border-slate-700 inline-block">
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-[10px] block">None Simulated</span>
                        )}
                      </span>
                    </article>
                  </section>
                </section>

                {/* Immediate Emergency contact node */}
                {activePatient.emergencyContact && (
                  <article className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-500 uppercase tracking-widest text-[9px] mb-1.5 block">Registered Emergency Contact</span>
                    <span className="flex justify-between text-xs text-slate-300 border-none bg-transparent block">
                      <span className="block">
                        <strong className="text-slate-100 font-bold">{activePatient.emergencyContact.contactPerson}</strong>{" "}
                        <span className="text-slate-500">({activePatient.emergencyContact.relationship})</span>
                      </span>
                      <span className="text-cyan-400 font-mono select-all font-semibold block">
                        {activePatient.emergencyContact.phone}
                      </span>
                    </span>
                  </article>
                )}
              </article>
            ) : (
              <section className="text-center text-slate-500 py-12">No patient loaded successfully.</section>
            )}
          </section>
        </section>
      </section>
    </section>
  );
};

export default PatientDashboard;
