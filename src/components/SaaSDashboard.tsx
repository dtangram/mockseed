import React from "react";
import { TrendingUp, Users, Layers } from "lucide-react";

interface SaaSDashboardProps {
  records: any[];
}

const SaaSDashboard = ({ records }: SaaSDashboardProps) => {
  const totalRecords = records.length;
  const mrr = records.reduce((acc, curr) => {
    const sub = curr.subscription;
    if (sub && sub.status === "active") {
      return acc + (Number(sub.priceMonthly) || 0);
    }
    return acc;
  }, 0);

  const activeCount = records.filter(curr => curr.subscription?.status === "active").length;
  const activePct = totalRecords > 0 ? Math.round((activeCount / totalRecords) * 100) : 0;

  const planCounts = records.reduce((acc: any, curr) => {
    const plan = curr.subscription?.plan || "Free";
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="space-y-6" id="saas-prototype-container">
      {/* Metric widgets */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="SaaS Business Metrics">
        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Estimated MRR</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              ${mrr.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Based on {activeCount} active user plans</span>
          </span>
          <span className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 block shrink-0">
            <TrendingUp className="w-6 h-6" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Renewal Score</span>
            <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
              {activePct}%
            </span>
            <span className="text-xs text-slate-500 mt-1 block">{activeCount} of {totalRecords} subscriptions current</span>
          </span>
          <span className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 block shrink-0">
            <Users className="w-6 h-6" aria-hidden="true" />
          </span>
        </article>

        <article className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <span className="block">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">Plan Weights</span>
            <span className="flex gap-2 mt-2 flex-wrap">
              {Object.entries(planCounts).map(([plan, cnt]) => (
                <span key={plan} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {plan}: {cnt as number}
                </span>
              ))}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">Segment shares</span>
          </span>
          <span className="p-3 rounded-lg bg-slate-800/10 border border-slate-700/20 text-slate-400 block shrink-0">
            <Layers className="w-6 h-6" aria-hidden="true" />
          </span>
        </article>
      </section>

      {/* Directory Explorer list */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <header className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <h5 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" aria-hidden="true"></span>
            Live Sandbox Preview: SaaS User Directory
          </h5>
          <span className="text-xs text-indigo-400 font-mono bg-indigo-950 px-2 py-0.5 rounded-xs border border-indigo-900">
            Mock Active State
          </span>
        </header>

        <ul className="divide-y divide-slate-800 max-h-[460px] overflow-y-auto" aria-label="User registry list">
          {records.map((user, idx) => {
            const statusColor = 
              user.subscription?.status === "active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
              user.subscription?.status === "past_due" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
              "bg-slate-500/15 text-slate-400 border border-slate-600/30";

            const roleColor =
              user.role === "Admin" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
              user.role === "Manager" ? "bg-blue-500/10 text-blue-400 border border-purple-500/20" :
              "bg-slate-800 text-slate-400";

            return (
              <li key={user.id || idx} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <span className="space-y-1 block">
                  <span className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-sm">{user.fullName || "Unnamed record"}</span>
                    {user.role && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${roleColor}`}>
                        {user.role}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 block">
                    <span className="font-mono text-slate-500">{user.billingEmail || "no-email@test.com"}</span>
                    <span className="text-slate-600" aria-hidden="true">•</span>
                    <span>{user.company || "Independent"}</span>
                    {user.phone && (
                      <>
                        <span className="text-slate-600" aria-hidden="true">•</span>
                        <span className="font-mono text-slate-500">{user.phone}</span>
                      </>
                    )}
                  </span>
                </span>

                <span className="flex items-center gap-3 block">
                  <span className="text-right block">
                    {user.subscription && (
                      <>
                        <span className="text-[11px] font-semibold text-indigo-300 block">{user.subscription.plan} Plan</span>
                        <span className="text-xs text-slate-400 font-mono block">${user.subscription.priceMonthly}/mo</span>
                      </>
                    )}
                  </span>
                  {user.subscription?.status && (
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColor}`}>
                      {user.subscription.status}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
};

export default SaaSDashboard;
