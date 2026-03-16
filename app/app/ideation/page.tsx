"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../theme-context";
import { useClient, Topic } from "../client-context";

const pillarColors: Record<string, { bg: string; darkBg: string; text: string; darkText: string; border: string; darkBorder: string; dot: string }> = {
  Education: { bg: "bg-blue-50", darkBg: "bg-blue-500/10", text: "text-blue-700", darkText: "text-blue-400", border: "border-blue-200", darkBorder: "border-blue-500/30", dot: "bg-blue-500" },
  Authority: { bg: "bg-purple-50", darkBg: "bg-purple-500/10", text: "text-purple-700", darkText: "text-purple-400", border: "border-purple-200", darkBorder: "border-purple-500/30", dot: "bg-purple-500" },
  Awareness: { bg: "bg-amber-50", darkBg: "bg-amber-500/10", text: "text-amber-700", darkText: "text-amber-400", border: "border-amber-200", darkBorder: "border-amber-500/30", dot: "bg-amber-500" },
  Conversion: { bg: "bg-emerald-50", darkBg: "bg-emerald-500/10", text: "text-emerald-700", darkText: "text-emerald-400", border: "border-emerald-200", darkBorder: "border-emerald-500/30", dot: "bg-emerald-500" },
};

const pillarNames = ["Education", "Authority", "Awareness", "Conversion"];
const platformOptions = ["Blog", "LinkedIn", "Instagram", "X/Twitter", "Email", "Facebook", "Dev.to", "YouTube", "Google Business"];
const priorityOptions = ["Hot", "Medium", "Backlog"];

const trendingTopics = [
  "AI-Powered SEO: What's Actually Working in 2026",
  "The Death of Third-Party Cookies: Final Timeline",
  "Short-Form Video ROI: New Data from Meta & TikTok",
  "Google's March 2026 Core Update: Winners & Losers",
  "B2B LinkedIn Strategy: What Changed This Quarter",
];

export default function IdeationPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { activeClient } = useClient();

  const [topics, setTopics] = useState<Topic[]>(activeClient.topics);
  const [formTitle, setFormTitle] = useState("");
  const [formPillar, setFormPillar] = useState("Education");
  const [formPersona, setFormPersona] = useState(activeClient.icps[0]?.name || "");
  const [formPlatforms, setFormPlatforms] = useState<string[]>([]);
  const [formPriority, setFormPriority] = useState("Medium");
  const [formNotes, setFormNotes] = useState("");
  const [sparkInput, setSparkInput] = useState("");
  const [showAiMessage, setShowAiMessage] = useState(false);

  /* Reset topics when active client changes */
  useEffect(() => {
    setTopics(activeClient.topics);
    setFormPersona(activeClient.icps[0]?.name || "");
  }, [activeClient.id, activeClient.topics, activeClient.icps]);

  const personaOptions = activeClient.icps.map((icp) => icp.name);

  const togglePlatform = (p: string) => {
    setFormPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  };

  const addTopic = () => {
    if (!formTitle.trim()) return;
    const newTopic: Topic = {
      id: Date.now().toString(),
      title: formTitle.trim(),
      pillar: formPillar,
      persona: formPersona,
      platforms: formPlatforms.length > 0 ? formPlatforms : ["Blog"],
      priority: formPriority,
      notes: formNotes.trim(),
    };
    setTopics((prev) => [...prev, newTopic]);
    setFormTitle("");
    setFormPlatforms([]);
    setFormNotes("");
    setFormPriority("Medium");
  };

  const addTrendingTopic = (title: string) => {
    const newTopic: Topic = {
      id: Date.now().toString(),
      title,
      pillar: "Awareness",
      persona: activeClient.icps[0]?.name || "",
      platforms: ["Blog", "LinkedIn"],
      priority: "Medium",
      notes: "Added from trending topics.",
    };
    setTopics((prev) => [...prev, newTopic]);
  };

  const deleteTopic = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id));
  };

  const priorityDot = (p: string) => {
    if (p === "Hot") return "bg-red-500";
    if (p === "Medium") return "bg-amber-500";
    return "bg-slate-400";
  };

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 outline-none ${
    dark
      ? "bg-[#1a2234] border-[#1e293b] text-white placeholder-slate-500 focus:border-blue-500"
      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
  }`;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{activeClient.name} — Content Ideation</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Brainstorm content topics, organize by pillar, and spark new ideas</p>
      </div>

      {/* Add Topic Form */}
      <div className={`mb-8 rounded-xl border p-6 shadow-sm transition-colors duration-200 ${
        dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
      }`}>
        <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Quick Add Topic</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Title */}
          <div className="lg:col-span-2">
            <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Topic Title</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., How to Track Conversions in GA4"
              className={inputClass}
            />
          </div>

          {/* Persona */}
          <div>
            <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Target Persona</label>
            <select value={formPersona} onChange={(e) => setFormPersona(e.target.value)} className={inputClass}>
              {personaOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Pillar */}
          <div>
            <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Content Pillar</label>
            <div className="flex gap-2">
              {pillarNames.map((p) => {
                const c = pillarColors[p];
                const active = formPillar === p;
                return (
                  <button
                    key={p}
                    onClick={() => setFormPillar(p)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                      active
                        ? dark ? `${c.darkBg} ${c.darkText} border ${c.darkBorder}` : `${c.bg} ${c.text} border ${c.border}`
                        : dark ? "bg-[#1a2234] text-slate-400 border border-[#1e293b] hover:bg-[#1e293b]" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Priority</label>
            <div className="flex gap-2">
              {priorityOptions.map((p) => (
                <button
                  key={p}
                  onClick={() => setFormPriority(p)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                    formPriority === p
                      ? dark ? "bg-[#1e293b] text-white border border-slate-600" : "bg-slate-200 text-slate-800 border border-slate-300"
                      : dark ? "bg-[#1a2234] text-slate-400 border border-[#1e293b] hover:bg-[#1e293b]" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span className={`inline-block h-2 w-2 rounded-full ${priorityDot(p)}`} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Platforms */}
          <div className="lg:col-span-2">
            <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Platforms</label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((p) => {
                const active = formPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                        : dark ? "bg-[#1a2234] text-slate-400 border border-[#1e293b] hover:bg-[#1e293b]" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="lg:col-span-3">
            <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Notes</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              placeholder="Brief notes about the topic, angle, or key points to cover..."
              rows={2}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={addTopic}
            disabled={!formTitle.trim()}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Board
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mb-8">
        <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Topic Board</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pillarNames.map((pillar) => {
            const c = pillarColors[pillar];
            const pillarTopics = topics.filter((t) => t.pillar === pillar);
            return (
              <div key={pillar} className={`rounded-xl border transition-colors duration-200 ${
                dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
              }`}>
                {/* Column Header */}
                <div className={`flex items-center justify-between rounded-t-xl border-b px-4 py-3 ${
                  dark ? `${c.darkBg} border-[#1e293b]` : `${c.bg} border-slate-200`
                }`}>
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                    <h3 className={`text-sm font-semibold ${dark ? c.darkText : c.text}`}>{pillar}</h3>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    dark ? "bg-[#1a2234] text-slate-400" : "bg-white text-slate-500"
                  }`}>
                    {pillarTopics.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 p-3">
                  {pillarTopics.length === 0 && (
                    <p className={`py-6 text-center text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>No topics yet</p>
                  )}
                  {pillarTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className={`group rounded-lg border p-3 transition-colors duration-200 ${
                        dark ? "bg-[#0d1117] border-[#1e293b] hover:border-slate-600" : "bg-slate-50 border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-semibold leading-snug ${dark ? "text-white" : "text-slate-900"}`}>{topic.title}</h4>
                        <button
                          onClick={() => deleteTopic(topic.id)}
                          className={`shrink-0 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                            dark ? "text-slate-500 hover:text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-100 text-slate-600"
                        }`}>
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                          </svg>
                          {topic.persona}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className={`h-2 w-2 rounded-full ${priorityDot(topic.priority)}`} />
                          <span className={`text-[10px] font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>{topic.priority}</span>
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {topic.platforms.map((p) => (
                          <span key={p} className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            dark ? "bg-[#1a2234] text-slate-400" : "bg-slate-100 text-slate-500"
                          }`}>
                            {p}
                          </span>
                        ))}
                      </div>
                      {topic.notes && (
                        <p className={`mt-2 text-[11px] leading-relaxed line-clamp-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                          {topic.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Spark Ideas Section */}
      <div className="mb-8">
        <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Spark Ideas</h2>
        <div className={`rounded-xl border p-6 shadow-sm transition-colors duration-200 ${
          dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
        }`}>
          <label className={`mb-2 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
            Describe your client, product, or challenge
          </label>
          <textarea
            value={sparkInput}
            onChange={(e) => setSparkInput(e.target.value)}
            placeholder="e.g., We're a B2B SaaS company that helps restaurants manage online orders. We're struggling to differentiate from DoorDash and UberEats..."
            rows={3}
            className={inputClass}
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setShowAiMessage(true)}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Generate Ideas
            </button>
            {showAiMessage && (
              <div className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm ${
                dark ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-700"
              }`}>
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Connect AI to unlock idea generation. Configure your API key in settings.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div>
        <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Trending in Digital Marketing</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {trendingTopics.map((title) => {
            const alreadyAdded = topics.some((t) => t.title === title);
            return (
              <div
                key={title}
                className={`rounded-xl border p-4 shadow-sm transition-colors duration-200 ${
                  dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start gap-2 mb-3">
                  <svg className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? "text-amber-400" : "text-amber-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                  </svg>
                  <h3 className={`text-sm font-semibold leading-snug ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
                </div>
                <button
                  onClick={() => addTrendingTopic(title)}
                  disabled={alreadyAdded}
                  className={`w-full rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                    alreadyAdded
                      ? dark ? "bg-emerald-500/10 text-emerald-400 cursor-default" : "bg-emerald-50 text-emerald-600 cursor-default"
                      : dark ? "bg-[#1a2234] text-slate-300 border border-[#1e293b] hover:bg-[#1e293b]" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {alreadyAdded ? "Added" : "Add to Board"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
