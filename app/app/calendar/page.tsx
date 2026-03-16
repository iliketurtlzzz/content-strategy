"use client";

import { useState, useMemo } from "react";
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

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const PILLAR_OPTIONS = ["Education", "Authority", "Awareness", "Conversion"];
const STATUS_OPTIONS = ["Draft", "Scheduled", "In Review", "Published"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function dateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function generateId(): string {
  return `cal-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function CalendarPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const pillarColors = dark ? pillarColorsDark : pillarColorsLight;
  const statusColors = dark ? statusColorsDark : statusColorsLight;
  const { activeClient, updateClient } = useClient();

  const calendarData = activeClient.calendarItems;

  // Month/year navigation state — default to current month
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState("All");

  // Add content form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formPillar, setFormPillar] = useState("Education");
  const [formPlatform, setFormPlatform] = useState("");
  const [formStatus, setFormStatus] = useState("Draft");
  const [formTime, setFormTime] = useState("");

  // Move item state
  const [movingItemId, setMovingItemId] = useState<string | null>(null);
  const [moveDate, setMoveDate] = useState("");

  // Manage filters modal
  const [showManageFilters, setShowManageFilters] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState("");

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate());

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Build platform filter list from customPlatforms
  const platforms = useMemo(() => ["All", ...activeClient.customPlatforms], [activeClient.customPlatforms]);

  // Filter calendar data for the current month
  const filteredData: Record<string, CalendarItem[]> = useMemo(() => {
    const result: Record<string, CalendarItem[]> = {};
    Object.entries(calendarData).forEach(([key, items]) => {
      const filtered = platformFilter === "All" ? items : items.filter((item) => item.platform === platformFilter);
      if (filtered.length > 0) {
        result[key] = filtered;
      }
    });
    return result;
  }, [calendarData, platformFilter]);

  const selectedItems = selectedDateKey ? filteredData[selectedDateKey] || [] : [];

  // Determine the selected day number for display
  const selectedDayNum = selectedDateKey ? parseInt(selectedDateKey.split("-")[2], 10) : null;

  // Navigation
  const canGoPrev = viewYear > 2026 || (viewYear === 2026 && viewMonth > 0);
  const canGoNext = viewYear < 2026 || (viewYear === 2026 && viewMonth < 11);

  const goPrev = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDateKey(null);
    setShowAddForm(false);
    setMovingItemId(null);
  };

  const goNext = () => {
    if (!canGoNext) return;
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDateKey(null);
    setShowAddForm(false);
    setMovingItemId(null);
  };

  const goToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDateKey(null);
    setShowAddForm(false);
    setMovingItemId(null);
  };

  // Add content
  const handleAddContent = () => {
    if (!formTitle.trim() || !selectedDateKey) return;
    const newItem: CalendarItem = {
      id: generateId(),
      title: formTitle.trim(),
      pillar: formPillar,
      platform: formPlatform || activeClient.customPlatforms[0] || "Blog",
      status: formStatus,
      time: formTime.trim() || undefined,
    };
    const existing = calendarData[selectedDateKey] || [];
    updateClient(activeClient.id, {
      calendarItems: {
        ...calendarData,
        [selectedDateKey]: [...existing, newItem],
      },
    });
    setFormTitle("");
    setFormPillar("Education");
    setFormPlatform("");
    setFormStatus("Draft");
    setFormTime("");
    setShowAddForm(false);
  };

  // Delete content
  const handleDeleteItem = (itemId: string) => {
    if (!selectedDateKey) return;
    const existing = calendarData[selectedDateKey] || [];
    const updated = existing.filter((item) => item.id !== itemId);
    const newCalendarItems = { ...calendarData };
    if (updated.length === 0) {
      delete newCalendarItems[selectedDateKey];
    } else {
      newCalendarItems[selectedDateKey] = updated;
    }
    updateClient(activeClient.id, { calendarItems: newCalendarItems });
  };

  // Move content
  const handleMoveItem = (itemId: string) => {
    if (!selectedDateKey || !moveDate) return;
    // Validate moveDate format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(moveDate)) return;
    const sourceItems = calendarData[selectedDateKey] || [];
    const itemToMove = sourceItems.find((item) => item.id === itemId);
    if (!itemToMove) return;

    const newCalendarItems = { ...calendarData };
    // Remove from source
    const updatedSource = sourceItems.filter((item) => item.id !== itemId);
    if (updatedSource.length === 0) {
      delete newCalendarItems[selectedDateKey];
    } else {
      newCalendarItems[selectedDateKey] = updatedSource;
    }
    // Add to target
    const targetItems = newCalendarItems[moveDate] || [];
    newCalendarItems[moveDate] = [...targetItems, itemToMove];

    updateClient(activeClient.id, { calendarItems: newCalendarItems });
    setMovingItemId(null);
    setMoveDate("");
  };

  // Manage filters
  const handleAddPlatform = () => {
    const name = newPlatformName.trim();
    if (!name || activeClient.customPlatforms.includes(name)) return;
    updateClient(activeClient.id, {
      customPlatforms: [...activeClient.customPlatforms, name],
    });
    setNewPlatformName("");
  };

  const handleRemovePlatform = (platform: string) => {
    updateClient(activeClient.id, {
      customPlatforms: activeClient.customPlatforms.filter((p) => p !== platform),
    });
    if (platformFilter === platform) {
      setPlatformFilter("All");
    }
  };

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 outline-none ${
    dark ? "bg-[#1a2234] border-[#2d3748] text-white placeholder-slate-500 focus:border-blue-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
  }`;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{activeClient.name} — Content Calendar</h1>
          <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Plan and track content across all channels</p>
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

      {/* Month Navigation */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            !canGoPrev
              ? "opacity-40 cursor-not-allowed"
              : dark ? "border-[#2d3748] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <h2 className={`text-lg font-semibold min-w-[180px] text-center ${dark ? "text-white" : "text-slate-900"}`}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </h2>
        <button
          onClick={goNext}
          disabled={!canGoNext}
          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
            !canGoNext
              ? "opacity-40 cursor-not-allowed"
              : dark ? "border-[#2d3748] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        </button>
        <button
          onClick={goToday}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
            dark ? "border-[#2d3748] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Today
        </button>
      </div>

      {/* Platform Filter */}
      <div className="mb-6 flex items-center gap-2 flex-wrap">
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
        <button
          onClick={() => setShowManageFilters(true)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            dark ? "bg-[#1a2234] text-slate-400 border border-dashed border-[#2d3748] hover:bg-[#1e293b]" : "bg-white text-slate-500 border border-dashed border-slate-300 hover:bg-slate-50"
          }`}
        >
          Manage Filters
        </button>
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
              const dk = dateKey(viewYear, viewMonth, day);
              const items = filteredData[dk] || [];
              const isToday = dk === todayKey;
              const isSelected = dk === selectedDateKey;

              return (
                <div
                  key={day}
                  onClick={() => {
                    setSelectedDateKey(dk === selectedDateKey ? null : dk);
                    setShowAddForm(false);
                    setMovingItemId(null);
                  }}
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
                    {items.slice(0, 2).map((item) => {
                      const colors = pillarColors[item.pillar] || pillarColors.Education;
                      return (
                        <div
                          key={item.id}
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
              {selectedDateKey && selectedDayNum ? `${MONTH_NAMES[viewMonth]} ${selectedDayNum}, ${viewYear}` : "Select a day"}
            </h2>
            {selectedDateKey && (
              <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {selectedItems.length} {selectedItems.length === 1 ? "item" : "items"} planned
              </p>
            )}
          </div>

          {!selectedDateKey ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Click a day to view planned content</p>
            </div>
          ) : (
            <div>
              {/* Items list */}
              {selectedItems.length === 0 && !showAddForm && (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                  <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No content planned for this day</p>
                </div>
              )}

              {selectedItems.length > 0 && (
                <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-50"}`}>
                  {selectedItems.map((item) => {
                    const colors = pillarColors[item.pillar] || pillarColors.Education;
                    return (
                      <div key={item.id} className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${colors.dot}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-sm font-medium ${dark ? "text-white" : "text-slate-900"}`}>{item.title}</p>
                              <div className="flex items-center gap-1 shrink-0">
                                {/* Move button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMovingItemId(movingItemId === item.id ? null : item.id);
                                    setMoveDate("");
                                  }}
                                  title="Move to another date"
                                  className={`rounded p-1 transition-colors ${dark ? "text-slate-500 hover:text-blue-400 hover:bg-blue-500/10" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`}
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                  </svg>
                                </button>
                                {/* Delete button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteItem(item.id);
                                  }}
                                  title="Delete"
                                  className={`rounded p-1 transition-colors ${dark ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-red-600 hover:bg-red-50"}`}
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
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

                            {/* Move date picker */}
                            {movingItemId === item.id && (
                              <div className={`mt-3 rounded-lg border p-3 ${dark ? "border-[#2d3748] bg-[#0d1117]" : "border-slate-200 bg-slate-50"}`}>
                                <p className={`text-xs font-medium mb-2 ${dark ? "text-slate-400" : "text-slate-600"}`}>Move to date:</p>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="date"
                                    value={moveDate}
                                    onChange={(e) => setMoveDate(e.target.value)}
                                    min="2026-01-01"
                                    max="2026-12-31"
                                    className={`flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none ${
                                      dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                                    }`}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveItem(item.id);
                                    }}
                                    disabled={!moveDate}
                                    className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                  >
                                    Move
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setMovingItemId(null);
                                      setMoveDate("");
                                    }}
                                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                                      dark ? "border-[#2d3748] text-slate-400 hover:bg-[#1a2234]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Content Button / Form */}
              <div className={`border-t px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                {!showAddForm ? (
                  <button
                    onClick={() => {
                      setShowAddForm(true);
                      setFormPlatform(activeClient.customPlatforms[0] || "");
                    }}
                    className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  >
                    + Add Content
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Add Content</p>

                    {/* Title */}
                    <div>
                      <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Title *</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Content title..."
                        className={inputClass}
                      />
                    </div>

                    {/* Pillar */}
                    <div>
                      <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Pillar</label>
                      <div className="flex gap-2">
                        {PILLAR_OPTIONS.map((p) => (
                          <button
                            key={p}
                            onClick={() => setFormPillar(p)}
                            className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                              formPillar === p
                                ? `${pillarColors[p].bg} ${pillarColors[p].text} border ${pillarColors[p].border}`
                                : dark ? "bg-[#1a2234] text-slate-400 border border-[#2d3748]" : "bg-slate-50 text-slate-500 border border-slate-200"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Platform */}
                    <div>
                      <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Platform</label>
                      <select
                        value={formPlatform}
                        onChange={(e) => setFormPlatform(e.target.value)}
                        className={inputClass}
                      >
                        {activeClient.customPlatforms.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                        className={inputClass}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Time */}
                    <div>
                      <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Time (optional)</label>
                      <input
                        type="text"
                        value={formTime}
                        onChange={(e) => setFormTime(e.target.value)}
                        placeholder="e.g. 9:00 AM"
                        className={inputClass}
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleAddContent}
                        disabled={!formTitle.trim()}
                        className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          dark ? "border-[#2d3748] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manage Filters Modal */}
      {showManageFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: dark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)" }}>
          <div className={`w-full max-w-md rounded-xl border shadow-2xl ${dark ? "bg-[#0d1117] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`flex items-center justify-between border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
              <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Manage Platforms</h3>
              <button
                onClick={() => setShowManageFilters(false)}
                className={`rounded p-1 transition-colors ${dark ? "text-slate-400 hover:text-white hover:bg-[#1a2234]" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4">
              {/* Current platforms */}
              <div className="flex flex-wrap gap-2 mb-4">
                {activeClient.customPlatforms.map((p) => (
                  <span
                    key={p}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      dark ? "bg-[#1a2234] text-slate-300 border border-[#2d3748]" : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {p}
                    <button
                      onClick={() => handleRemovePlatform(p)}
                      className={`rounded-full transition-colors ${dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                ))}
              </div>
              {/* Add new platform */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlatformName}
                  onChange={(e) => setNewPlatformName(e.target.value)}
                  placeholder="New platform name..."
                  className={`flex-1 ${inputClass}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddPlatform();
                  }}
                />
                <button
                  onClick={handleAddPlatform}
                  disabled={!newPlatformName.trim()}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
            <div className={`border-t px-6 py-3 flex justify-end ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
              <button
                onClick={() => setShowManageFilters(false)}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
