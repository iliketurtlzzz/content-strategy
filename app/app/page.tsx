"use client";

import Link from "next/link";
import { useTheme } from "./theme-context";

const pillars = [
  { name: "Education", target: 40, current: 38, color: "bg-blue-500", textColor: "text-blue-600", lightBg: "bg-blue-50", darkTextColor: "text-blue-400", darkLightBg: "bg-blue-500/10" },
  { name: "Authority", target: 30, current: 28, color: "bg-purple-500", textColor: "text-purple-600", lightBg: "bg-purple-50", darkTextColor: "text-purple-400", darkLightBg: "bg-purple-500/10" },
  { name: "Awareness", target: 20, current: 22, color: "bg-amber-500", textColor: "text-amber-600", lightBg: "bg-amber-50", darkTextColor: "text-amber-400", darkLightBg: "bg-amber-500/10" },
  { name: "Conversion", target: 10, current: 12, color: "bg-emerald-500", textColor: "text-emerald-600", lightBg: "bg-emerald-50", darkTextColor: "text-emerald-400", darkLightBg: "bg-emerald-500/10" },
];

const cadenceTargets = [
  { platform: "Blog", target: "2-4/mo", current: 2, max: 4, icon: "B" },
  { platform: "LinkedIn", target: "3-5/wk", current: 4, max: 5, icon: "in" },
  { platform: "Instagram", target: "3-4/wk", current: 3, max: 4, icon: "IG" },
  { platform: "X / Twitter", target: "Daily", current: 5, max: 7, icon: "X" },
  { platform: "Email", target: "1-2/mo", current: 1, max: 2, icon: "E" },
];

const recentContent = [
  { title: "Why Your SEO Agency Might Be Wasting Your Budget", pillar: "Education", platform: "Blog", status: "Published", date: "Mar 14", pillarColor: "bg-blue-500" },
  { title: "Q1 Paid Media Benchmarks for B2B SaaS", pillar: "Authority", platform: "LinkedIn", status: "Published", date: "Mar 13", pillarColor: "bg-purple-500" },
  { title: "5 GA4 Reports Every Marketer Needs This Week", pillar: "Education", platform: "Blog", status: "In Review", date: "Mar 12", pillarColor: "bg-blue-500" },
  { title: "Behind the Scenes: How We Drove 340% Organic Growth", pillar: "Authority", platform: "Instagram", status: "Scheduled", date: "Mar 17", pillarColor: "bg-purple-500" },
  { title: "Atlanta Tech Scene: Digital Marketing Trends for 2026", pillar: "Awareness", platform: "LinkedIn", status: "Draft", date: "Mar 18", pillarColor: "bg-amber-500" },
  { title: "Free SEO Audit: Is Your Site Leaving Money on the Table?", pillar: "Conversion", platform: "Email", status: "Scheduled", date: "Mar 20", pillarColor: "bg-emerald-500" },
];

const statusColorsDark: Record<string, string> = {
  Published: "bg-emerald-500/10 text-emerald-400",
  "In Review": "bg-yellow-500/10 text-yellow-400",
  Scheduled: "bg-blue-500/10 text-blue-400",
  Draft: "bg-slate-500/10 text-slate-400",
};

const statusColorsLight: Record<string, string> = {
  Published: "bg-emerald-100 text-emerald-700",
  "In Review": "bg-yellow-100 text-yellow-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Draft: "bg-slate-100 text-slate-600",
};

export default function Dashboard() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const statusColors = dark ? statusColorsDark : statusColorsLight;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Content Strategy Dashboard</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>March 2026 overview -- MarketWake content performance and planning</p>
      </div>

      {/* Content Pillar Distribution */}
      <div className="mb-8">
        <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Pillar Distribution</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <div key={pillar.name} className={`rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow ${
              dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
            }`}>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  dark ? `${pillar.darkLightBg} ${pillar.darkTextColor}` : `${pillar.lightBg} ${pillar.textColor}`
                }`}>
                  {pillar.name}
                </span>
                <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>Target: {pillar.target}%</span>
              </div>
              <div className="mt-3">
                <div className="flex items-end gap-2">
                  <span className={`text-3xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{pillar.current}%</span>
                  <span className={`mb-1 text-xs font-medium ${pillar.current >= pillar.target ? "text-emerald-500" : "text-amber-500"}`}>
                    {pillar.current >= pillar.target ? "On target" : `${pillar.target - pillar.current}% below`}
                  </span>
                </div>
              </div>
              <div className={`mt-3 h-2 overflow-hidden rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                <div
                  className={`h-full rounded-full ${pillar.color} transition-all`}
                  style={{ width: `${(pillar.current / pillar.target) * 100}%`, maxWidth: "100%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Cadence + Quick Actions row */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cadence Targets */}
        <div className={`col-span-2 rounded-xl border p-6 shadow-sm ${
          dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
        }`}>
          <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Cadence -- March 2026</h2>
          <div className="space-y-4">
            {cadenceTargets.map((item) => (
              <div key={item.platform} className="flex items-center gap-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                  dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-100 text-slate-600"
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>{item.platform}</span>
                    <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.current}/{item.max} ({item.target})</span>
                  </div>
                  <div className={`mt-1.5 h-2 overflow-hidden rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${(item.current / item.max) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`rounded-xl border p-6 shadow-sm ${
          dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
        }`}>
          <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/create"
              className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create New Content
            </Link>
            <Link
              href="/calendar"
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                dark
                  ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              View Calendar
            </Link>
            <Link
              href="/seo"
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                dark
                  ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              SEO Brief Generator
            </Link>
            <Link
              href="/brand"
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                dark
                  ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Brand Guidelines
            </Link>
            <Link
              href="/personas"
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                dark
                  ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b]"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Audience Personas
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Content */}
      <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
        <div className={`flex items-center justify-between border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Recent Content</h2>
          <Link href="/calendar" className="text-xs font-medium text-blue-500 hover:text-blue-400">
            View all
          </Link>
        </div>
        <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-100"}`}>
          {recentContent.map((item, i) => (
            <div key={i} className={`flex items-center gap-4 px-6 py-4 transition-colors ${
              dark ? "hover:bg-[#1a2234]" : "hover:bg-slate-50"
            }`}>
              <div className={`h-2 w-2 rounded-full ${item.pillarColor}`} />
              <div className="flex-1 min-w-0">
                <p className={`truncate text-sm font-medium ${dark ? "text-white" : "text-slate-900"}`}>{item.title}</p>
                <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.pillar} / {item.platform}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[item.status]}`}>
                {item.status}
              </span>
              <span className={`text-xs w-14 text-right ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
