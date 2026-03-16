"use client";

import { useState } from "react";
import { useTheme } from "../theme-context";
import { useClient, CalendarItem } from "../client-context";

const pillarColorsLight: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Education: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500", border: "border-blue-200" },
  Authority: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-500", border: "border-purple-200" },
  Awareness: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500", border: "border-amber-200" },
  Conversion: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
};

const pillarColorsDark: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  Education: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-500", border: "border-blue-500/20" },
  Authority: { bg: "bg-purple-500/10", text: "text-purple-400", dot: "bg-purple-500", border: "border-purple-500/20" },
  Awareness: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-500", border: "border-amber-500/20" },
  Conversion: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-500", border: "border-emerald-500/20" },
};

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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const pillarColors = dark ? pillarColorsDark : pillarColorsLight;
  const statusColors = dark ? statusColorsDark : statusColorsLight;
  const { activeClient } = useClient();

  const calendarData = activeClient.calendarItems;

  /* Derive unique platform list from active client's calendar */
  const platformSet = new Set<string>();
  Object.values(calendarData).forEach((items) => items.forEach((item) => platformSet.add(item.platform)));
  const platforms = ["All", ...Array.from(platformSet).sort()];

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [platformFilter, setPlatformFilter] = useState("All");

  const year = 2026;
  const month = 2; // March (0-indexed)
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = 16;

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const filteredData: Record<number, CalendarItem[]> = {};
  Object.entries(calendarData).forEach(([day, items]) => {
    const filtered = platformFilter === "All" ? items : items.filter((item) => item.platform === platformFilter);
    if (filtered.length > 0) {
      filteredData[parseInt(day)] = filtered;
    }
  });

  const selectedItems = selectedDay ? filteredData[selectedDay] || [] : [];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{activeClient.name} — Content Calendar</h1>
          <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>March 2026 -- Plan and track content across all channels</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Pillar Legend */}
          <div className="flex items-center gap-3">
            {Object.entries(pillarColors).map(([name, colors]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
                <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="mb-6 flex items-center gap-2">
        <span className={`text-xs font-medium uppercase tracking-wider mr-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Filter:</span>
        {platforms.map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              platformFilter === p
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                : dark
                  ? "bg-[#1a2234] text-slate-400 border border-[#2d3748] hover:bg-[#1e293b]"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar Grid */}
        <div className={`col-span-2 rounded-xl border shadow-sm ${
          dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
        }`}>
          {/* Day Headers */}
          <div className={`grid grid-cols-7 border-b ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
            {dayNames.map((day) => (
              <div key={day} className={`py-3 text-center text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before the 1st */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className={`min-h-[100px] border-b border-r p-2 ${
                dark ? "border-[#1e293b]/50 bg-[#0d1117]" : "border-slate-50 bg-slate-25"
              }`} />
            ))}

            {/* Actual days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const items = filteredData[day] || [];
              const isToday = day === today;
              const isSelected = day === selectedDay;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  className={`min-h-[100px] border-b border-r p-2 cursor-pointer transition-colors ${
                    dark
                      ? `border-[#1e293b]/50 ${isSelected ? "bg-blue-500/10" : isToday ? "bg-[#1a2234]" : "hover:bg-[#1a2234]/50"}`
                      : `border-slate-50 ${isSelected ? "bg-blue-50" : isToday ? "bg-slate-50" : "hover:bg-slate-50/50"}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                        isToday
                          ? "bg-blue-500 text-white"
                          : dark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {day}
                    </span>
                    {items.length > 0 && (
                      <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{items.length}</span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {items.slice(0, 2).map((item, idx) => {
                      const colors = pillarColors[item.pillar] || pillarColors.Education;
                      return (
                        <div
                          key={idx}
                          className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
                        >
                          {item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title}
                        </div>
                      );
                    })}
                    {items.length > 2 && (
                      <div className={`text-[10px] px-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>+{items.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Detail Panel */}
        <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
          <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
            <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
              {selectedDay ? `March ${selectedDay}, 2026` : "Select a day"}
            </h2>
            {selectedDay && (
              <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} planned
              </p>
            )}
          </div>

          {!selectedDay ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Click a day to view planned content</p>
            </div>
          ) : selectedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No content planned for this day</p>
              <a href="/create" className="mt-2 text-xs font-medium text-blue-500 hover:text-blue-400">
                Create content
              </a>
            </div>
          ) : (
            <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-50"}`}>
              {selectedItems.map((item, idx) => {
                const colors = pillarColors[item.pillar] || pillarColors.Education;
                return (
                  <div key={idx} className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${dark ? "text-white" : "text-slate-900"}`}>{item.title}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${colors.bg} ${colors.text}`}>
                            {item.pillar}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600"
                          }`}>
                            {item.platform}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColors[item.status] || ""}`}>
                            {item.status}
                          </span>
                        </div>
                        {item.time && (
                          <p className={`mt-1.5 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.time}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
