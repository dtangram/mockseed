import React from "react";
import { Cpu, Flame, Settings } from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";

interface IoTTelemetryDashboardProps {
  records: any[];
}

const IoTTelemetryDashboard = ({ records }: IoTTelemetryDashboardProps) => {
  const { selectedRecordIndex, setSelectedRecordIndex } = useSynthesizer();

  const safeIndex = selectedRecordIndex !== null && selectedRecordIndex < records.length ? selectedRecordIndex : 0;
  const activeNode = records[safeIndex] || null;

  return (
    <section className="space-y-6" id="iot-prototype-container">
      {/* Metric counts */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Microgrid stats overview">
        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Telemetry Node Stream</span>
            <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
              {records.length} nodes
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Simulated Colorado smart grid</span>
          </span>
          <span className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 block shrink-0">
            <Cpu className="w-5 h-5 animate-pulse" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Alerting State Triggers</span>
            <span className="text-2xl font-bold font-mono text-rose-400 mt-1 block">
              {records.filter(r => r.deploymentState !== "operational").length} active
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Maintenance required / Offline</span>
          </span>
          <span className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 block shrink-0">
            <Flame className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Average Battery Output</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {(records.reduce((acc, curr) => acc + (curr.sensorsReading?.batteryEfficiencyVolts || 12), 0) / records.length).toFixed(1)} V
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Nominal performance tracker</span>
          </span>
          <span className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 block shrink-0">
            <Settings className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>
      </section>

      {/* Microgrid Coordinate Map sandbox with table sidebar */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Schematic Geo Map Grid */}
        <section className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-hidden">
          <header className="space-y-1 mb-3">
            <span className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 block">Smart microgrid geo map (Colorado area)</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono block">
                Scale: Micro-degrees
              </span>
            </span>
            <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
              Coordinates plotted dynamically from simulated longitude/latitude indices. Click nodes to query.
            </p>
          </header>

          {/* Geographical Schematic Canvas */}
          <section className="h-68 bg-slate-950 rounded-lg relative overflow-hidden border border-slate-800 flex items-center justify-center" aria-label="Geographical coordinate plotter grid">
            {/* Fake coordinate grid lines */}
            <span className="absolute inset-0 bg-radial-grid opacity-15" aria-hidden="true"></span>
            
            {/* Compass metadata layout */}
            <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-600 block">CO-GRID LAT [37.0°N - 41.0°N] • LON [102.0°W - 109.0°W]</span>

            {records.map((node, i) => {
              const isSelected = activeNode === node;
              const lat = node.gridCoordinates?.latitude || 39.0;
              const lon = node.gridCoordinates?.longitude || -105.5;

              // Simple scaling [102, 109] and [37, 41]
              const xPercent = Math.min(Math.max(((Math.abs(lon) - 102) / 7) * 100, 5), 90);
              const yPercent = Math.min(Math.max(((41 - lat) / 4) * 100, 5), 90);

              // State colors
              const markerColor = 
                node.deploymentState === "operational" ? "bg-emerald-500" :
                node.deploymentState === "maintenance_required" ? "bg-amber-500" :
                "bg-rose-500";

              return (
                <button
                  type="button"
                  key={node.nodeIdentifier || i}
                  onClick={() => setSelectedRecordIndex(i)}
                  style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
                  className={`absolute w-3.5 h-3.5 rounded-full ${markerColor} transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer ${
                    isSelected ? "ring-4 ring-indigo-400 scale-125 shadow-lg" : "hover:scale-110"
                  }`}
                  title={node.nodeIdentifier}
                  aria-label={`View sensors readings for node ${node.nodeIdentifier}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 block"></span>
                </button>
              );
            })}
          </section>

          <footer className="mt-4 flex gap-4 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Operational</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Maintenance</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Alert Off-Grid</span>
          </footer>
        </section>

        {/* Node detailed sensor readout */}
        <aside className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden" aria-label="Simulated Node Readout">
          <header className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center text-slate-200">
            <h5 className="font-semibold text-xs uppercase tracking-wider font-mono">Node Realtime diagnostics</h5>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block" aria-hidden="true"></span>
          </header>

          <section className="p-4 space-y-4 font-mono text-xs">
            {activeNode ? (
              <article className="space-y-4">
                <header className="space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Unit Identifier</span>
                  <span className="font-bold text-slate-200 block text-sm">{activeNode.nodeIdentifier || "Unknown Node"}</span>
                  <span className="text-slate-400 text-[10px] block mt-1">Current State: <b className="uppercase">{activeNode.deploymentState}</b></span>
                </header>

                {/* Geolocation */}
                <section className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                  <span className="text-slate-500 font-bold text-[9px] uppercase block">Plotted Grid Coordinates</span>
                  <span className="text-slate-300 block">Lat: {activeNode.gridCoordinates?.latitude?.toFixed(5) || "N/A"}</span>
                  <span className="text-slate-300 font-mono block">Lon: {activeNode.gridCoordinates?.longitude?.toFixed(5) || "N/A"}</span>
                  {activeNode.gridCoordinates?.altitudeMeters && (
                    <span className="text-slate-400 text-[10px] block">Altitude: {activeNode.gridCoordinates.altitudeMeters} meters</span>
                  )}
                </section>

                {/* Readings */}
                {activeNode.sensorsReading && (
                  <section className="space-y-2">
                    <span className="text-slate-500 font-bold text-[9px] uppercase block">Telemetry Transducer Readings</span>
                    
                    <ul className="grid grid-cols-2 gap-2 text-[11px] text-slate-300" aria-label="Transducer Readings">
                      {activeNode.sensorsReading.ambientTemperatureFahrenheit !== undefined && (
                        <li className="bg-slate-900/40 border border-slate-800/80 p-2 rounded block">
                          <span className="text-[9px] text-slate-500 block">Ambient Temp</span>
                          <span className="font-bold text-slate-200 text-sm block">{activeNode.sensorsReading.ambientTemperatureFahrenheit.toFixed(1)}°F</span>
                        </li>
                      )}
                      {activeNode.sensorsReading.hardwareCoreTempCelsius !== undefined && (
                        <li className="bg-slate-900/40 border border-slate-800/80 p-2 rounded block">
                          <span className="text-[9px] text-slate-500 block">Core CPU Temp</span>
                          <span className="font-bold text-slate-200 text-sm block">{activeNode.sensorsReading.hardwareCoreTempCelsius.toFixed(1)}°C</span>
                        </li>
                      )}
                      {activeNode.sensorsReading.humidityRatePercentage !== undefined && (
                        <li className="bg-slate-900/40 border border-slate-800/80 p-2 rounded block">
                          <span className="text-[9px] text-slate-500 block">Humidity Rating</span>
                          <span className="font-bold text-slate-200 text-sm block">{activeNode.sensorsReading.humidityRatePercentage}%</span>
                        </li>
                      )}
                      {activeNode.sensorsReading.batteryEfficiencyVolts !== undefined && (
                        <li className="bg-slate-900/40 border border-slate-800/80 p-2 rounded block">
                          <span className="text-[9px] text-slate-500 block">Battery Voltage</span>
                          <span className="font-bold text-emerald-400 text-sm block">{activeNode.sensorsReading.batteryEfficiencyVolts.toFixed(2)} Volts</span>
                        </li>
                      )}
                    </ul>
                  </section>
                )}

                {/* Dynamic Alert tracker log */}
                <section>
                  <span className="text-slate-500 font-bold text-[9px] uppercase block mb-1">Recent Alarm Logs</span>
                  <ul className="space-y-1" aria-label="Alarms history log">
                    {Array.isArray(activeNode.recentAlertTriggers) && activeNode.recentAlertTriggers.length > 0 ? (
                      activeNode.recentAlertTriggers.map((alert: string, idx: number) => (
                        <li key={idx} className="p-1 px-2 border border-rose-900/30 bg-rose-950/20 text-rose-300 rounded text-[10px] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 block shrink-0" aria-hidden="true"></span>
                          {alert}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 text-[10px] italic list-none">No active alarms logged. Node nominal.</li>
                    )}
                  </ul>
                </section>
              </article>
            ) : (
              <section className="text-center py-8 text-slate-500">Select any telemetry coordinate marker.</section>
            )}
          </section>
        </aside>
      </section>
    </section>
  );
};

export default IoTTelemetryDashboard;
