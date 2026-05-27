import React from "react";
import { CreditCard, TrendingUp, Globe, Info } from "lucide-react";
import useSynthesizer from "../hooks/useSynthesizer";

interface EcomDashboardProps {
  records: any[];
}

const EcomDashboard = ({ records }: EcomDashboardProps) => {
  const { selectedRecordIndex, setSelectedRecordIndex } = useSynthesizer();

  const totalSales = records.reduce((acc, curr) => acc + (Number(curr.orderTotal) || Number(curr.subTotal) || 0), 0);
  const avgOrderValue = records.length > 0 ? totalSales / records.length : 0;
  const currencySym = records[0]?.currency === "EUR" ? "€" : "$";

  // Use local selection logic bridged with context's index
  const safeIndex = selectedRecordIndex !== null && selectedRecordIndex < records.length ? selectedRecordIndex : null;

  return (
    <section className="space-y-6" id="ecom-prototype-container">
      {/* Metric cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="E-commerce Business KPIs">
        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Gross Transaction Volume</span>
            <span className="text-2xl font-bold font-mono text-violet-400 mt-1 block">
              {currencySym}{totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Sum of {records.length} simulated receipts</span>
          </span>
          <span className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 block shrink-0">
            <CreditCard className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Average Revenue Per Ticket</span>
            <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
              {currencySym}{avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Calculated simulated mean</span>
          </span>
          <span className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 block shrink-0">
            <TrendingUp className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider font-mono block">Simulated Channels</span>
            <span className="font-bold text-slate-200 mt-1 text-sm flex gap-1 items-center flex-wrap block">
              <span className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[11px]">DE Local VAT (19%)</span>
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Tax structures compiled correctly</span>
          </span>
          <span className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 block shrink-0">
            <Globe className="w-5 h-5" aria-hidden="true" />
          </span>
        </article>
      </section>

      {/* Invoice roster splits */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Order Lists */}
        <section className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <header className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider font-mono">E-Commerce Invoice Hub</h5>
          </header>
          <ul className="divide-y divide-slate-800 max-h-[380px] overflow-y-auto" aria-label="Simulated sales invoices list">
            {records.map((order, idx) => {
              const isSelected = safeIndex === idx;
              const totalItemCount = Array.isArray(order.itemsPurchased) 
                ? order.itemsPurchased.reduce((sum: number, it: any) => sum + (it.quantityPaid || 1), 0)
                : 1;

              return (
                <li key={order.orderSequenceId || idx}>
                  <button
                    type="button"
                    onClick={() => setSelectedRecordIndex(idx)}
                    className={`w-full text-left p-3.5 hover:bg-slate-800/40 focus-visible:bg-slate-800/40 focus-visible:outline-hidden transition-all flex items-start justify-between gap-4 border-l-2 cursor-pointer ${
                      isSelected ? "bg-amber-500/5 border-l-amber-400" : "border-l-transparent"
                    }`}
                    aria-label={`View details of invoice ${order.orderSequenceId || idx} for buyer ${order.buyerName || "Generic client"}`}
                  >
                    <span className="block">
                      <span className="font-mono text-sm font-semibold text-slate-200 block">
                        {order.orderSequenceId || `ORDER-${1000 + idx}`}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5 block">
                        Buyer: {order.buyerName || "Generic client"} • {totalItemCount} item{totalItemCount > 1 ? "s" : ""}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-1 italic block">
                        {order.shippingAddress?.city || "Germany"}
                      </span>
                    </span>
                    <span className="text-right block">
                      <span className="font-mono font-bold text-slate-100 block">
                        {currencySym}{(order.orderTotal || 0).toFixed(2)}
                      </span>
                      {order.paymentDetails?.gatewayUsed && (
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-sm border border-slate-700 font-mono mt-1 inline-block">
                          {order.paymentDetails.gatewayUsed}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Active invoice view panel */}
        <aside className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col" aria-label="Invoice Details Node Panel">
          <header className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
            <h5 className="font-semibold text-indigo-400 text-xs uppercase tracking-wider font-mono">Invoice Node Inspector</h5>
            <Info className="w-4 h-4 text-slate-500" aria-hidden="true" />
          </header>

          <section className="p-4 flex-1 space-y-4 text-xs overflow-y-auto max-h-[380px]">
            {safeIndex === null ? (
              <section className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <span className="text-3xl" role="img" aria-label="Invoice document">🧾</span>
                <p className="mt-2 text-slate-400">Select an invoice on the left to view the fully synthesized transactional detail node.</p>
              </section>
            ) : (
              (() => {
                const ord = records[safeIndex];
                return (
                  <section className="space-y-4">
                    {/* Brand Header */}
                    <header className="border-b border-slate-800 pb-3 flex justify-between items-start">
                      <span className="block">
                        <span className="font-bold text-slate-200 font-mono text-sm block">STELLAR DE GmbH</span>
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">VAT-ID: DE202688789</span>
                      </span>
                      <span className="text-right font-mono text-[11px] block">
                        <span className="text-emerald-400 block font-bold">PAID</span>
                        <span className="text-slate-500 mt-0.5 block">{ord.orderSequenceId}</span>
                      </span>
                    </header>

                    {/* Customer block */}
                    <section className="space-y-1">
                      <span className="text-slate-500 uppercase tracking-widest font-mono text-[9px] block">Shipping Destination</span>
                      <span className="text-slate-200 font-medium mt-1 block">{ord.buyerName}</span>
                      {ord.shippingAddress && (
                        <address className="text-slate-400 leading-relaxed font-mono mt-0.5 not-italic block">
                          {ord.shippingAddress.streetAndNumber}<br />
                          {ord.shippingAddress.postalCode} {ord.shippingAddress.city}<br />
                          {ord.shippingAddress.state ? `${ord.shippingAddress.state}, ` : ""}{ord.shippingAddress.countryCode}
                        </address>
                      )}
                    </section>

                    {/* Items details nested list */}
                    <section className="space-y-2">
                      <span className="text-slate-500 uppercase tracking-widest font-mono text-[9px] mb-2 block">Order Items</span>
                      <ul className="space-y-2 border-y border-slate-800 py-2" aria-label="Items List">
                        {Array.isArray(ord.itemsPurchased) && ord.itemsPurchased.map((item: any, itemIdx: number) => (
                          <li key={itemIdx} className="flex justify-between items-start">
                            <span className="max-w-[70%] block">
                              <span className="text-slate-300 font-medium block">{item.title || "Consulting Package"}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">
                                Qty: {item.quantityPaid || 1} @ {currencySym}{(item.unitPrice || 0).toFixed(2)}
                              </span>
                            </span>
                            <span className="font-mono text-slate-200 font-semibold block">
                              {currencySym}{((item.quantityPaid || 1) * (item.unitPrice || 0)).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Totals math layout */}
                    <section className="space-y-1.5 font-mono text-[11px]">
                      {ord.subTotal && (
                        <span className="flex justify-between text-slate-400 block">
                          <span>Subtotal:</span>
                          <span>{currencySym}{Number(ord.subTotal).toFixed(2)}</span>
                        </span>
                      )}
                      {ord.taxRateAmount && (
                        <span className="flex justify-between text-slate-400 block">
                          <span>Computed 19% MwSt/VAT:</span>
                          <span>{currencySym}{Number(ord.taxRateAmount).toFixed(2)}</span>
                        </span>
                      )}
                      <span className="flex justify-between text-slate-100 font-bold text-sm border-t border-slate-800 pt-2 block">
                        <span>Total Paid:</span>
                        <span className="text-emerald-400">{currencySym}{Number(ord.orderTotal).toFixed(2)}</span>
                      </span>
                    </section>

                    {/* Payment method metadata */}
                    {ord.paymentDetails && (
                      <article className="bg-slate-900 border border-slate-800 p-2.5 rounded-md font-mono text-[10px] text-slate-400 space-y-1">
                        <span className="block">Gateway: {ord.paymentDetails.gatewayUsed || "Synthesized"}</span>
                        {ord.paymentDetails.cardBrand && (
                          <span className="mt-0.5 block">Card: {ord.paymentDetails.cardBrand} (last 4: {ord.paymentDetails.cardLast4 || "••••"})</span>
                        )}
                      </article>
                    )}
                  </section>
                );
              })()
            )}
          </section>
        </aside>
      </section>
    </section>
  );
};

export default EcomDashboard;
