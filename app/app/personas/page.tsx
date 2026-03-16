"use client";

import { useState } from "react";
import { useTheme } from "../theme-context";
import { useClient, ICP } from "../client-context";

/* Color rotation for persona cards */
const cardColorSets = [
  {
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    darkLightBg: "bg-blue-500/10",
    darkTextColor: "text-blue-400",
    darkBorderColor: "border-blue-500/20",
  },
  {
    color: "bg-purple-500",
    lightBg: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    darkLightBg: "bg-purple-500/10",
    darkTextColor: "text-purple-400",
    darkBorderColor: "border-purple-500/20",
  },
  {
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    darkLightBg: "bg-emerald-500/10",
    darkTextColor: "text-emerald-400",
    darkBorderColor: "border-emerald-500/20",
  },
  {
    color: "bg-amber-500",
    lightBg: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    darkLightBg: "bg-amber-500/10",
    darkTextColor: "text-amber-400",
    darkBorderColor: "border-amber-500/20",
  },
  {
    color: "bg-rose-500",
    lightBg: "bg-rose-50",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    darkLightBg: "bg-rose-500/10",
    darkTextColor: "text-rose-400",
    darkBorderColor: "border-rose-500/20",
  },
];

function getColors(index: number) {
  return cardColorSets[index % cardColorSets.length];
}

export default function PersonasPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { activeClient } = useClient();

  const [expandedPersona, setExpandedPersona] = useState<string | null>(
    activeClient.icps.length > 0 ? activeClient.icps[0].id : null,
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{activeClient.name} Audience Personas</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Target audience profiles for {activeClient.name} content strategy</p>
      </div>

      <div className="space-y-6">
        {activeClient.icps.map((icp, idx) => {
          const cs = getColors(idx);
          const isExpanded = expandedPersona === icp.id;
          return (
            <div
              key={icp.id}
              className={`rounded-xl border shadow-sm transition-all ${
                isExpanded
                  ? dark ? cs.darkBorderColor + " bg-[#111827]" : cs.borderColor + " bg-white"
                  : dark ? "border-[#1e293b] bg-[#111827]" : "border-slate-200 bg-white"
              }`}
            >
              {/* Header - always visible */}
              <button
                onClick={() => setExpandedPersona(isExpanded ? null : icp.id)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    dark ? cs.darkLightBg : cs.lightBg
                  }`}>
                    <svg className={`h-6 w-6 ${dark ? cs.darkTextColor : cs.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{icp.name}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        dark ? `${cs.darkLightBg} ${cs.darkTextColor}` : `${cs.lightBg} ${cs.textColor}`
                      }`}>
                        {icp.name.split(" ")[0]}
                      </span>
                    </div>
                    <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{icp.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`hidden sm:flex items-center gap-6 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    <span>Age: {icp.ageRange}</span>
                    <span>{icp.companySize}</span>
                  </div>
                  <svg
                    className={`h-5 w-5 transition-transform ${isExpanded ? "rotate-180" : ""} ${dark ? "text-slate-500" : "text-slate-400"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className={`border-t px-6 pb-6 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                  {/* Demographics Row */}
                  <div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-4">
                    {[
                      { label: "Role", value: icp.role },
                      { label: "Company Size", value: icp.companySize },
                      { label: "Industry", value: icp.industry },
                      { label: "Age Range", value: icp.ageRange },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-lg p-3 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.label}</p>
                        <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pain Points */}
                  <div className="mb-6">
                    <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Pain Points</h4>
                    <div className="space-y-2">
                      {icp.painPoints.map((item, i) => (
                        <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${
                          dark ? "bg-red-500/5" : "bg-red-50/50"
                        }`}>
                          <span className={`mt-0.5 text-xs ${dark ? "text-red-400" : "text-red-400"}`}>{i + 1}.</span>
                          <p className={`text-sm italic ${dark ? "text-slate-300" : "text-slate-600"}`}>"{item}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Preferences */}
                  <div>
                    <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Preferences</h4>
                    <div className={`rounded-lg border p-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                      <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>{icp.contentPreferences}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
