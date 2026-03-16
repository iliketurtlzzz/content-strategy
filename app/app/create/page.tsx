"use client";

import { useState, useEffect } from "react";
import { useTheme } from "../theme-context";
import { useClient, Topic } from "../client-context";

/* ═══════════════════════════════════════════════════════════
   Shared Constants
   ═══════════════════════════════════════════════════════════ */

const pillarColors: Record<string, { bg: string; darkBg: string; text: string; darkText: string; border: string; darkBorder: string; dot: string; color: string; ring: string; lightBg: string; darkLightBg: string }> = {
  Education:  { bg: "bg-blue-50",    darkBg: "bg-blue-500/10",    text: "text-blue-700",    darkText: "text-blue-400",    border: "border-blue-200",    darkBorder: "border-blue-500/30",    dot: "bg-blue-500",    color: "bg-blue-500",    ring: "ring-blue-500",    lightBg: "bg-blue-50",    darkLightBg: "bg-blue-500/10" },
  Authority:  { bg: "bg-purple-50",  darkBg: "bg-purple-500/10",  text: "text-purple-700",  darkText: "text-purple-400",  border: "border-purple-200",  darkBorder: "border-purple-500/30",  dot: "bg-purple-500",  color: "bg-purple-500",  ring: "ring-purple-500",  lightBg: "bg-purple-50",  darkLightBg: "bg-purple-500/10" },
  Awareness:  { bg: "bg-amber-50",   darkBg: "bg-amber-500/10",   text: "text-amber-700",   darkText: "text-amber-400",   border: "border-amber-200",   darkBorder: "border-amber-500/30",   dot: "bg-amber-500",   color: "bg-amber-500",   ring: "ring-amber-500",   lightBg: "bg-amber-50",   darkLightBg: "bg-amber-500/10" },
  Conversion: { bg: "bg-emerald-50", darkBg: "bg-emerald-500/10", text: "text-emerald-700", darkText: "text-emerald-400", border: "border-emerald-200", darkBorder: "border-emerald-500/30", dot: "bg-emerald-500", color: "bg-emerald-500", ring: "ring-emerald-500", lightBg: "bg-emerald-50", darkLightBg: "bg-emerald-500/10" },
};

const pillarNames = ["Education", "Authority", "Awareness", "Conversion"];

const contentTypes = [
  "Blog Post", "LinkedIn Post", "Instagram Post", "Twitter/X Thread", "Email", "Case Study",
];

const tones = ["Confident & Direct", "Educational & Helpful", "Bold & Provocative", "Data-Driven & Analytical", "Conversational & Approachable"];

const platformOptions = ["Blog", "LinkedIn", "Instagram", "X/Twitter", "Email", "Facebook", "Dev.to", "YouTube", "Google Business"];
const priorityOptions = ["Hot", "Medium", "Backlog"];

const trendingTopics = [
  "AI-Powered SEO: What's Actually Working in 2026",
  "The Death of Third-Party Cookies: Final Timeline",
  "Short-Form Video ROI: New Data from Meta & TikTok",
  "Google's March 2026 Core Update: Winners & Losers",
  "B2B LinkedIn Strategy: What Changed This Quarter",
];

/* Brief constants */
const intentOptions = ["Informational", "Commercial", "Transactional", "Navigational"];
const formatOptions = ["Blog Post", "Landing Page", "Pillar Page", "How-To Guide", "Listicle", "Case Study"];
const videoTypes = ["Short-form Reel/TikTok", "YouTube Tutorial", "YouTube Thought Leadership", "Webinar", "Client Testimonial"];

/* ═══════════════════════════════════════════════════════════
   Brief type definitions
   ═══════════════════════════════════════════════════════════ */

interface SavedBrief {
  id: string;
  type: "seo" | "video" | "social";
  title: string;
  createdAt: string;
  data: Record<string, string>;
}

interface SavedContent {
  id: string;
  contentType: string;
  pillar: string;
  persona: string;
  title: string;
  keywords: string;
  tone: string;
  body: string;
  createdAt: string;
}

/* ═══════════════════════════════════════════════════════════
   Tab: Ideation
   ═══════════════════════════════════════════════════════════ */

function IdeationTab({ dark }: { dark: boolean }) {
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
    <div>
      {/* Add Topic Form */}
      <div className={`mb-8 rounded-xl border p-6 shadow-sm transition-colors duration-200 ${
        dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
      }`}>
        <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Quick Add Topic</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          <div>
            <label className={`mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>Target Persona</label>
            <select value={formPersona} onChange={(e) => setFormPersona(e.target.value)} className={inputClass}>
              {personaOptions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
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

      {/* Spark Ideas */}
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

/* ═══════════════════════════════════════════════════════════
   Tab: Brief Generator
   ═══════════════════════════════════════════════════════════ */

function BriefGeneratorTab({ dark }: { dark: boolean }) {
  const { activeClient } = useClient();

  const [briefType, setBriefType] = useState<"seo" | "video" | "social">("seo");
  const [savedBriefs, setSavedBriefs] = useState<SavedBrief[]>([]);

  /* SEO Brief state */
  const [seoKeyword, setSeoKeyword] = useState("");
  const [seoIntent, setSeoIntent] = useState("");
  const [seoPersona, setSeoPersona] = useState("");
  const [seoFormat, setSeoFormat] = useState("");
  const [seoBriefGenerated, setSeoBriefGenerated] = useState(false);

  /* Video Brief state */
  const [videoTitle, setVideoTitle] = useState("");
  const [videoType, setVideoType] = useState("");
  const [videoTargetPlatform, setVideoTargetPlatform] = useState("");
  const [videoPersona, setVideoPersona] = useState("");
  const [videoKeyMessage, setVideoKeyMessage] = useState("");
  const [videoTalkingPoints, setVideoTalkingPoints] = useState("");
  const [videoCTA, setVideoCTA] = useState("");
  const [videoBriefGenerated, setVideoBriefGenerated] = useState(false);

  /* Social Brief state */
  const [socialPlatform, setSocialPlatform] = useState("");
  const [socialPillar, setSocialPillar] = useState("");
  const [socialPersona, setSocialPersona] = useState("");
  const [socialTopic, setSocialTopic] = useState("");
  const [socialKeyMessage, setSocialKeyMessage] = useState("");
  const [socialRefUrl, setSocialRefUrl] = useState("");
  const [socialBriefGenerated, setSocialBriefGenerated] = useState(false);

  const personaNames = activeClient.icps.map((icp) => icp.name);

  const inputClass = `w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
  }`;

  const selectClass = inputClass;

  const saveBrief = (type: "seo" | "video" | "social", title: string, data: Record<string, string>) => {
    const brief: SavedBrief = {
      id: Date.now().toString(),
      type,
      title,
      createdAt: new Date().toLocaleString(),
      data,
    };
    setSavedBriefs((prev) => [brief, ...prev]);
  };

  const briefTypeButtons: { key: "seo" | "video" | "social"; label: string; desc: string }[] = [
    { key: "seo", label: "SEO/AEO Brief", desc: "Search-optimized content brief" },
    { key: "video", label: "Video Brief", desc: "Video script & production brief" },
    { key: "social", label: "Social Post Brief", desc: "Platform-specific social content" },
  ];

  return (
    <div>
      {/* Brief Type Selector */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {briefTypeButtons.map((bt) => (
          <button
            key={bt.key}
            onClick={() => setBriefType(bt.key)}
            className={`relative overflow-hidden rounded-xl border p-4 text-left transition-all ${
              briefType === bt.key
                ? "border-transparent ring-2 ring-blue-500"
                : dark ? "border-[#1e293b] hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Gradient accent for selected */}
            <div className={`absolute inset-x-0 top-0 h-1 ${
              briefType === bt.key
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                : "bg-transparent"
            }`} />
            <div className={`${
              briefType === bt.key
                ? dark ? "bg-[#111827]" : "bg-white"
                : dark ? "bg-[#111827]" : "bg-white"
            }`}>
              <p className={`text-sm font-semibold ${
                briefType === bt.key
                  ? dark ? "text-white" : "text-slate-900"
                  : dark ? "text-slate-300" : "text-slate-700"
              }`}>{bt.label}</p>
              <p className={`mt-0.5 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{bt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* SEO/AEO Brief */}
      {briefType === "seo" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>SEO/AEO Brief Generator</h2>
            <div className="space-y-4">
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Primary Keyword</label>
                <input type="text" value={seoKeyword} onChange={(e) => setSeoKeyword(e.target.value)} placeholder="e.g., SEO agency Atlanta" className={inputClass} />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Search Intent</label>
                <div className="grid grid-cols-2 gap-2">
                  {intentOptions.map((opt) => (
                    <button key={opt} onClick={() => setSeoIntent(opt)} className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      seoIntent === opt
                        ? dark ? "border-blue-500 bg-blue-500/10 text-blue-400 ring-1 ring-blue-500" : "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                        : dark ? "border-[#2d3748] text-slate-400 hover:bg-[#1a2234]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Target Persona</label>
                <select value={seoPersona} onChange={(e) => setSeoPersona(e.target.value)} className={selectClass}>
                  <option value="">Select persona...</option>
                  {personaNames.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Content Format</label>
                <select value={seoFormat} onChange={(e) => setSeoFormat(e.target.value)} className={selectClass}>
                  <option value="">Select format...</option>
                  {formatOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <button
                onClick={() => setSeoBriefGenerated(true)}
                disabled={!seoKeyword || !seoIntent || !seoPersona || !seoFormat}
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  seoKeyword && seoIntent && seoPersona && seoFormat
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                    : dark ? "bg-[#1a2234] text-slate-500 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Generate SEO Brief
              </button>
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Generated Brief</h2>
            </div>
            {!seoBriefGenerated ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Fill in the form and click Generate</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-blue-400" : "text-blue-600"}`}>Primary Keyword</p>
                  <p className={`mt-1 text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{seoKeyword}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Intent", value: seoIntent },
                    { label: "Persona", value: seoPersona },
                    { label: "Format", value: seoFormat },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg p-3 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.label}</p>
                      <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Suggested Title</p>
                  <p className={`text-sm font-medium rounded-lg px-4 py-3 ${dark ? "text-white bg-[#1a2234]" : "text-slate-900 bg-slate-50"}`}>
                    {seoIntent === "Informational" && `What to Know About ${seoKeyword}: A Complete Guide`}
                    {seoIntent === "Commercial" && `Best ${seoKeyword} Services: How to Choose the Right Partner`}
                    {seoIntent === "Transactional" && `${seoKeyword} -- Get Results That Impact Your Bottom Line`}
                    {seoIntent === "Navigational" && `${seoKeyword} -- Expert Services from MarketWake`}
                  </p>
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Suggested Outline</p>
                  <div className="space-y-2">
                    {[
                      "H1: [Title with primary keyword]",
                      `H2: What Is ${seoKeyword}? (Definition + Context)`,
                      `H2: Why ${seoKeyword} Matters for ${seoPersona}s`,
                      `H2: How MarketWake Approaches ${seoKeyword}`,
                      "H2: Real Results: Client Case Study",
                      "H2: Common Mistakes to Avoid",
                      `H2: Getting Started with ${seoKeyword}`,
                      "H2: Key Takeaways",
                      "CTA: Book a free strategy session",
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                        <span className={`text-xs w-5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{i + 1}.</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>SEO Checklist</p>
                  <div className="space-y-1.5">
                    {[
                      `Include "${seoKeyword}" in title, H1, first 100 words`,
                      "Meta description: 150-160 chars with keyword + CTA",
                      "URL: /blog/" + seoKeyword.toLowerCase().replace(/\s+/g, "-"),
                      "Word count: 1,500-2,500 words",
                      "Internal links: 2-3 to relevant MW service pages",
                      "Image alt text with keyword variations",
                    ].map((item, i) => (
                      <div key={i} className={`flex items-start gap-2 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => saveBrief("seo", seoKeyword, { keyword: seoKeyword, intent: seoIntent, persona: seoPersona, format: seoFormat })}
                    className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Save Brief
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Brief */}
      {briefType === "video" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Video Brief Generator</h2>
            <div className="space-y-4">
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Video Title</label>
                <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="e.g., 5 SEO Mistakes Killing Your Traffic" className={inputClass} />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Video Type</label>
                <select value={videoType} onChange={(e) => setVideoType(e.target.value)} className={selectClass}>
                  <option value="">Select video type...</option>
                  {videoTypes.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Target Platform</label>
                <select value={videoTargetPlatform} onChange={(e) => setVideoTargetPlatform(e.target.value)} className={selectClass}>
                  <option value="">Select platform...</option>
                  {["TikTok", "Instagram Reels", "YouTube", "LinkedIn", "Facebook", "Webinar Platform"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Target Persona</label>
                <select value={videoPersona} onChange={(e) => setVideoPersona(e.target.value)} className={selectClass}>
                  <option value="">Select persona...</option>
                  {personaNames.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Key Message</label>
                <input type="text" value={videoKeyMessage} onChange={(e) => setVideoKeyMessage(e.target.value)} placeholder="The one thing viewers should remember" className={inputClass} />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Talking Points</label>
                <textarea value={videoTalkingPoints} onChange={(e) => setVideoTalkingPoints(e.target.value)} placeholder="Key points to cover (one per line)" rows={3} className={inputClass} />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Call to Action</label>
                <input type="text" value={videoCTA} onChange={(e) => setVideoCTA(e.target.value)} placeholder="e.g., Book a free strategy call" className={inputClass} />
              </div>
              <button
                onClick={() => setVideoBriefGenerated(true)}
                disabled={!videoTitle || !videoType || !videoPersona}
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  videoTitle && videoType && videoPersona
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                    : dark ? "bg-[#1a2234] text-slate-500 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Generate Video Brief
              </button>
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Generated Video Brief</h2>
            </div>
            {!videoBriefGenerated ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Fill in the form and click Generate</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-purple-400" : "text-purple-600"}`}>Video Title</p>
                  <p className={`mt-1 text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{videoTitle}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Type", value: videoType },
                    { label: "Platform", value: videoTargetPlatform || "Not set" },
                    { label: "Persona", value: videoPersona },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg p-3 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.label}</p>
                      <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Estimated Duration */}
                <div className={`rounded-lg p-3 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Estimated Duration</p>
                  <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
                    {videoType === "Short-form Reel/TikTok" && "15-60 seconds"}
                    {videoType === "YouTube Tutorial" && "8-15 minutes"}
                    {videoType === "YouTube Thought Leadership" && "5-10 minutes"}
                    {videoType === "Webinar" && "30-60 minutes"}
                    {videoType === "Client Testimonial" && "2-5 minutes"}
                  </p>
                </div>

                {/* Script Outline */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Script Outline</p>
                  <div className="space-y-3">
                    <div className={`rounded-lg p-3 border-l-2 border-blue-500 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                      <p className={`text-xs font-semibold ${dark ? "text-blue-400" : "text-blue-600"}`}>Hook (0:00 - 0:05)</p>
                      <p className={`mt-1 text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>
                        Open with a provocative question or bold statement about {videoKeyMessage || videoTitle}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 border-l-2 border-purple-500 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                      <p className={`text-xs font-semibold ${dark ? "text-purple-400" : "text-purple-600"}`}>Body</p>
                      <div className={`mt-1 text-sm space-y-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                        {videoTalkingPoints ? videoTalkingPoints.split("\n").filter(Boolean).map((tp, i) => (
                          <p key={i} className="flex items-start gap-2">
                            <span className={`text-xs font-medium shrink-0 mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{i + 1}.</span>
                            {tp}
                          </p>
                        )) : (
                          <p className={`${dark ? "text-slate-500" : "text-slate-400"}`}>Add talking points to generate body outline</p>
                        )}
                      </div>
                    </div>
                    <div className={`rounded-lg p-3 border-l-2 border-emerald-500 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                      <p className={`text-xs font-semibold ${dark ? "text-emerald-400" : "text-emerald-600"}`}>CTA</p>
                      <p className={`mt-1 text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>
                        {videoCTA || "Define a call to action"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shot List Suggestions */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Shot List Suggestions</p>
                  <div className="space-y-1.5">
                    {[
                      `Opening: ${videoType === "Short-form Reel/TikTok" ? "Face-to-camera, dynamic movement" : "Professional setup, branded background"}`,
                      `B-Roll: Screen recordings, ${videoTargetPlatform || "platform"} interface demos`,
                      "Transition: Quick cuts or branded motion graphics",
                      `Talking Head: ${videoType === "Client Testimonial" ? "Natural setting, relaxed framing" : "Eye-level, rule of thirds"}`,
                      `End Card: CTA overlay with ${activeClient.name} branding`,
                    ].map((shot, i) => (
                      <div key={i} className={`flex items-start gap-2 text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        {shot}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hook Variants */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Hook Variants</p>
                  <div className="space-y-2">
                    {[
                      `"Most ${videoPersona || "people"} get this wrong about ${videoTitle.toLowerCase()}..."`,
                      `"Here's what nobody tells you about ${videoKeyMessage || videoTitle.toLowerCase()}."`,
                      `"Stop scrolling if you care about ${videoKeyMessage || "your results"}."`,
                    ].map((hook, i) => (
                      <div key={i} className={`rounded-lg p-3 text-sm italic ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                        <span className={`not-italic text-xs font-semibold mr-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>Hook {i + 1}:</span>
                        {hook}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveBrief("video", videoTitle, { title: videoTitle, type: videoType, platform: videoTargetPlatform, persona: videoPersona })}
                    className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Save Brief
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Social Post Brief */}
      {briefType === "social" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Social Post Brief Generator</h2>
            <div className="space-y-4">
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Platform</label>
                <select value={socialPlatform} onChange={(e) => setSocialPlatform(e.target.value)} className={selectClass}>
                  <option value="">Select platform...</option>
                  {activeClient.customPlatforms.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Content Pillar</label>
                <div className="grid grid-cols-2 gap-2">
                  {pillarNames.map((p) => {
                    const c = pillarColors[p];
                    return (
                      <button key={p} onClick={() => setSocialPillar(p)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        socialPillar === p
                          ? dark ? `${c.darkBg} ${c.darkText} border-current ring-1 ${c.ring}` : `${c.lightBg} ${c.text} border-current ring-1 ${c.ring}`
                          : dark ? "border-[#2d3748] text-slate-400 hover:bg-[#1a2234]" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}>
                        <div className={`h-2.5 w-2.5 rounded-full ${c.dot}`} />
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Target Persona</label>
                <select value={socialPersona} onChange={(e) => setSocialPersona(e.target.value)} className={selectClass}>
                  <option value="">Select persona...</option>
                  {personaNames.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Topic / Angle</label>
                <input type="text" value={socialTopic} onChange={(e) => setSocialTopic(e.target.value)} placeholder="e.g., Why most agencies underreport on actual ROI" className={inputClass} />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Key Message</label>
                <input type="text" value={socialKeyMessage} onChange={(e) => setSocialKeyMessage(e.target.value)} placeholder="The one takeaway for your audience" className={inputClass} />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Reference URL (optional)</label>
                <input type="text" value={socialRefUrl} onChange={(e) => setSocialRefUrl(e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
              <button
                onClick={() => setSocialBriefGenerated(true)}
                disabled={!socialPlatform || !socialPillar || !socialPersona || !socialTopic}
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  socialPlatform && socialPillar && socialPersona && socialTopic
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                    : dark ? "bg-[#1a2234] text-slate-500 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Generate Social Brief
              </button>
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Generated Social Brief</h2>
            </div>
            {!socialBriefGenerated ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Fill in the form and click Generate</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Platform", value: socialPlatform },
                    { label: "Pillar", value: socialPillar },
                    { label: "Persona", value: socialPersona },
                    { label: "Topic", value: socialTopic },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-lg p-3 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                      <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.label}</p>
                      <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Hook Variants */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Hook Variants</p>
                  <div className="space-y-2">
                    {[
                      `${socialPlatform === "LinkedIn" ? "I've been thinking about" : "Hot take:"} ${socialTopic.toLowerCase()}. Here's what most people get wrong.`,
                      `${socialKeyMessage || socialTopic}. ${socialPlatform === "X/Twitter" ? "A thread" : "Let me explain"} ${String.fromCodePoint(0x2193)}`,
                      `Stop doing this with your ${socialPillar.toLowerCase()} content. ${socialTopic}.`,
                    ].map((hook, i) => (
                      <div key={i} className={`rounded-lg p-3 text-sm ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                        <span className={`text-xs font-semibold mr-2 ${dark ? "text-blue-400" : "text-blue-600"}`}>Hook {i + 1}:</span>
                        {hook}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Post Copy */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Full Post Copy</p>
                  <div className={`rounded-lg p-4 text-sm leading-relaxed ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                    <p className="font-semibold mb-2">{socialKeyMessage || socialTopic}</p>
                    <p className="mb-2">
                      {socialPillar === "Education" && `Here's what every ${socialPersona} needs to know about ${socialTopic.toLowerCase()}:`}
                      {socialPillar === "Authority" && `We've helped dozens of clients navigate ${socialTopic.toLowerCase()}. Here's our take:`}
                      {socialPillar === "Awareness" && `${socialTopic} is changing fast. Here's what we're seeing:`}
                      {socialPillar === "Conversion" && `Ready to transform your approach to ${socialTopic.toLowerCase()}? Here's how:`}
                    </p>
                    <p className="mb-2">
                      The biggest mistake we see? Treating {socialPillar.toLowerCase()} content as an afterthought.
                      {socialPersona && ` As a ${socialPersona}, you need content that drives real results.`}
                    </p>
                    <p>{socialKeyMessage ? `Bottom line: ${socialKeyMessage}.` : `Bottom line: ${socialTopic} matters more than you think.`}</p>
                    {socialRefUrl && <p className="mt-2 text-blue-400">Read more: {socialRefUrl}</p>}
                  </div>
                </div>

                {/* Hashtag Suggestions */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Hashtag Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      `#${socialPillar.replace(/\s/g, "")}`,
                      `#${socialPlatform.replace(/[\s/]/g, "")}Marketing`,
                      "#ContentStrategy",
                      "#DigitalMarketing",
                      `#${activeClient.name.replace(/\s/g, "")}`,
                      "#MarketingTips",
                    ].map((tag, i) => (
                      <span key={i} className={`rounded-full px-3 py-1 text-xs font-medium ${
                        dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual Concept */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Visual Concept</p>
                  <div className={`rounded-lg p-4 text-sm ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                    <p>
                      {socialPlatform === "Instagram" && `Carousel post: Slide 1 = bold hook statement. Slides 2-5 = key points about "${socialTopic}". Final slide = CTA with ${activeClient.name} branding. Use brand colors with clean typography.`}
                      {socialPlatform === "LinkedIn" && `Text post with an optional image. If using an image: branded quote card or data visualization related to "${socialTopic}". Clean, professional design.`}
                      {socialPlatform === "X/Twitter" && `Thread format. Lead image: bold statement graphic. Use ${activeClient.name} brand colors. Keep images simple and text-heavy.`}
                      {socialPlatform === "TikTok" && `Short-form video: Face-to-camera delivery. On-screen text overlays for key stats. Use trending audio if relevant. Dynamic, engaging cuts.`}
                      {socialPlatform === "Facebook" && `Image or short video. Community-focused visual showing real results or behind-the-scenes of "${socialTopic}". Warm, approachable feel.`}
                      {!["Instagram", "LinkedIn", "X/Twitter", "TikTok", "Facebook"].includes(socialPlatform) && `Branded visual with bold headline about "${socialTopic}". Use ${activeClient.name} brand colors and clean layout. Include key data point or quote.`}
                    </p>
                  </div>
                </div>

                {/* Best Posting Time */}
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Best Posting Time</p>
                  <div className={`rounded-lg p-4 text-sm ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-50 text-slate-700"}`}>
                    {socialPlatform === "LinkedIn" && "Tuesday-Thursday, 7:30-8:30 AM or 12:00-1:00 PM EST. B2B audiences are most active during commute and lunch hours."}
                    {socialPlatform === "Instagram" && "Monday-Friday, 11:00 AM-1:00 PM or 7:00-9:00 PM EST. Weekday lunch breaks and evening wind-down perform best."}
                    {socialPlatform === "X/Twitter" && "Monday-Friday, 8:00-10:00 AM EST. Early morning catches the news-scroll crowd."}
                    {socialPlatform === "TikTok" && "Tuesday-Thursday, 10:00 AM-12:00 PM or 7:00-9:00 PM EST. Lunchtime and evening perform best for engagement."}
                    {socialPlatform === "Facebook" && "Wednesday-Friday, 1:00-4:00 PM EST. Mid-afternoon engagement peaks on Facebook."}
                    {!["LinkedIn", "Instagram", "X/Twitter", "TikTok", "Facebook"].includes(socialPlatform) && "Test different time slots. Generally, weekday mornings (8-10 AM) and lunch hours (12-1 PM) in your audience's timezone perform well."}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => saveBrief("social", `${socialPlatform}: ${socialTopic}`, { platform: socialPlatform, pillar: socialPillar, persona: socialPersona, topic: socialTopic })}
                    className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  >
                    Save Brief
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Briefs */}
      {savedBriefs.length > 0 && (
        <div className="mt-8">
          <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Saved Briefs</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {savedBriefs.map((brief) => (
              <div key={brief.id} className={`rounded-xl border p-4 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    brief.type === "seo"
                      ? dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                      : brief.type === "video"
                        ? dark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-600"
                        : dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {brief.type}
                  </span>
                  <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{brief.createdAt}</span>
                </div>
                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{brief.title}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(brief.data).map(([key, val]) => (
                    <span key={key} className={`rounded px-1.5 py-0.5 text-[10px] ${dark ? "bg-[#1a2234] text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                      {key}: {val}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Tab: Content Creator
   ═══════════════════════════════════════════════════════════ */

function ContentCreatorTab({ dark }: { dark: boolean }) {
  const { activeClient } = useClient();

  const personas = activeClient.icps.map((icp) => ({
    name: icp.name,
    desc: icp.role,
  }));

  const [contentType, setContentType] = useState("");
  const [selectedPillar, setSelectedPillar] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [tone, setTone] = useState("");
  const [body, setBody] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);

  const pillarInfo = selectedPillar ? pillarColors[selectedPillar] : undefined;

  const saveDraft = () => {
    if (!title.trim() && !body.trim()) return;
    const draft: SavedContent = {
      id: Date.now().toString(),
      contentType,
      pillar: selectedPillar,
      persona: selectedPersona,
      title,
      keywords,
      tone,
      body,
      createdAt: new Date().toLocaleString(),
    };
    setSavedContent((prev) => [draft, ...prev]);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
        <div className="col-span-3 space-y-6">
          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Details</h2>
            <div className="space-y-5">
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="">Select content type...</option>
                  {contentTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Content Pillar</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {pillarNames.map((pillar) => {
                    const p = pillarColors[pillar];
                    return (
                      <button
                        key={pillar}
                        onClick={() => setSelectedPillar(pillar)}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                          selectedPillar === pillar
                            ? dark
                              ? `${p.darkLightBg} ${p.darkText} border-current ring-1 ${p.ring}`
                              : `${p.lightBg} ${p.text} border-current ring-1 ${p.ring}`
                            : dark
                              ? "border-[#2d3748] text-slate-400 hover:bg-[#1a2234]"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`h-3 w-3 rounded-full ${p.color}`} />
                        {pillar}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Target Persona</label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {personas.map((persona) => (
                    <button
                      key={persona.name}
                      onClick={() => setSelectedPersona(persona.name)}
                      className={`rounded-lg border px-3 py-2.5 text-left transition-all ${
                        selectedPersona === persona.name
                          ? dark
                            ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500"
                            : "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                          : dark
                            ? "border-[#2d3748] hover:bg-[#1a2234]"
                            : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <p className={`text-sm font-medium ${
                        selectedPersona === persona.name
                          ? dark ? "text-blue-400" : "text-blue-700"
                          : dark ? "text-slate-300" : "text-slate-700"
                      }`}>
                        {persona.name}
                      </p>
                      <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{persona.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Topic / Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Why Your SEO Agency Might Be Wasting Your Budget"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Target Keywords</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., SEO agency Atlanta, SEO services, digital marketing agency"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
                <p className={`mt-1 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>Separate keywords with commas</p>
              </div>
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="">Select tone...</option>
                  {tones.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Body</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={saveDraft}
                  disabled={!title.trim() && !body.trim()}
                  className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium transition-colors ${
                    title.trim() || body.trim()
                      ? dark ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      : dark ? "border-[#2d3748] text-slate-600 cursor-not-allowed" : "border-slate-200 text-slate-300 cursor-not-allowed"
                  }`}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  Save Draft
                </button>
                <button
                  onClick={() => setShowAiPanel(true)}
                  className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                  Generate with AI
                </button>
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              placeholder={`Write your content here, or click 'Generate with AI' to get started...\n\nTips for ${activeClient.name} content:\n- Lead with the insight, not an introduction\n- Use specific numbers and results\n- Keep paragraphs to 2-4 sentences\n- Active voice always\n- Include a clear CTA`}
              className={`w-full rounded-lg border px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono ${
                dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            />
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div className="sticky top-8 space-y-6">
            <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
              <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Preview</h2>
              </div>
              <div className="p-6">
                {!contentType && !title && !body ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className={`h-12 w-12 ${dark ? "text-slate-700" : "text-slate-200"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <p className={`mt-3 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Start filling in the form to see a preview</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {contentType && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600"
                        }`}>{contentType}</span>
                      )}
                      {selectedPillar && pillarInfo && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          dark ? `${pillarInfo.darkLightBg} ${pillarInfo.darkText}` : `${pillarInfo.lightBg} ${pillarInfo.text}`
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${pillarInfo.color}`} />
                          {selectedPillar}
                        </span>
                      )}
                      {selectedPersona && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600"
                        }`}>{selectedPersona}</span>
                      )}
                      {tone && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600"
                        }`}>{tone}</span>
                      )}
                    </div>
                    {title && <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>}
                    {keywords && (
                      <div className="flex flex-wrap gap-1">
                        {keywords.split(",").map((kw, i) => (
                          <span key={i} className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${
                            dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                          }`}>{kw.trim()}</span>
                        ))}
                      </div>
                    )}
                    {body && (
                      <div className={`max-w-none text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>
                        {body.split("\n").map((line, i) => (
                          <p key={i} className={line.trim() === "" ? "h-3" : "mb-2"}>{line}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
              <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Quick Reference</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className={`rounded-lg p-3 ${dark ? "bg-blue-500/10" : "bg-blue-50"}`}>
                  <p className={`text-xs font-semibold ${dark ? "text-blue-400" : "text-blue-700"}`}>{activeClient.name} Voice</p>
                  <p className={`mt-1 text-[11px] ${dark ? "text-blue-300" : "text-blue-600"}`}>
                    {activeClient.toneAttributes.map((a) => a.positive).join(", ")}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>Writing Rules</p>
                  <ul className={`space-y-1 text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {[
                      "Lead with the insight -- hook or teach first",
                      "Use specific numbers over vague claims",
                      "Active voice always -- no passive constructions",
                      "Cut filler: very, really, basically, just",
                      "Every paragraph must earn its place",
                    ].map((rule, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Content */}
      {savedContent.length > 0 && (
        <div className="mt-8">
          <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Saved Content</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {savedContent.map((draft) => (
              <div key={draft.id} className={`rounded-xl border p-4 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {draft.contentType && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600"}`}>
                      {draft.contentType}
                    </span>
                  )}
                  {draft.pillar && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      dark ? `${pillarColors[draft.pillar]?.darkBg || ""} ${pillarColors[draft.pillar]?.darkText || "text-slate-400"}` : `${pillarColors[draft.pillar]?.bg || ""} ${pillarColors[draft.pillar]?.text || "text-slate-600"}`
                    }`}>
                      {draft.pillar}
                    </span>
                  )}
                  <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{draft.createdAt}</span>
                </div>
                <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{draft.title || "Untitled Draft"}</p>
                {draft.body && (
                  <p className={`mt-1 text-xs line-clamp-2 ${dark ? "text-slate-400" : "text-slate-500"}`}>{draft.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Panel Modal */}
      {showAiPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl p-8 shadow-2xl ${dark ? "bg-[#111827] border border-[#1e293b]" : "bg-white"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>AI Content Generation</h3>
                <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Powered by {activeClient.name} Content Strategy AI</p>
              </div>
            </div>
            <div className={`rounded-xl p-6 mb-6 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <p className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>AI generation is not yet connected</p>
              </div>
              <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                When connected, this feature will use your selected content type, pillar, persona, and keywords
                to generate on-brand {activeClient.name} content following our editorial guidelines.
              </p>
              <div className="mt-4 space-y-2">
                <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-500"}`}>What it will do:</p>
                <ul className={`space-y-1.5 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  {[
                    "Generate content aligned to brand voice",
                    "Optimize for target persona and pillar",
                    "Include SEO-optimized structure",
                    `Follow ${activeClient.name} editorial standards`,
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAiPanel(false)}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                  dark ? "border-[#2d3748] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Close
              </button>
              <button
                disabled
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium cursor-not-allowed ${
                  dark ? "bg-[#1a2234] text-slate-500" : "bg-slate-200 text-slate-400"
                }`}
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main Page: 3-Tab Workspace
   ═══════════════════════════════════════════════════════════ */

type CreateTab = "ideation" | "brief" | "creator";

export default function CreateContentPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { activeClient } = useClient();

  const [activeTab, setActiveTab] = useState<CreateTab>("ideation");

  const tabs: { key: CreateTab; label: string }[] = [
    { key: "ideation", label: "Ideation" },
    { key: "brief", label: "Brief Generator" },
    { key: "creator", label: "Content Creator" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Create Content for {activeClient.name}</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Ideate, brief, and build strategy-aligned content for any channel</p>
      </div>

      {/* Tab Bar */}
      <div className={`mb-6 flex gap-1 rounded-lg p-1 w-fit ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? dark ? "bg-[#111827] text-white shadow-sm" : "bg-white text-slate-900 shadow-sm"
                : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "ideation" && <IdeationTab dark={dark} />}
      {activeTab === "brief" && <BriefGeneratorTab dark={dark} />}
      {activeTab === "creator" && <ContentCreatorTab dark={dark} />}
    </div>
  );
}
