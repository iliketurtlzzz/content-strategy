"use client";

import { useState } from "react";
import { useTheme } from "../theme-context";
import { useClient } from "../client-context";

const contentTypes = [
  "Blog Post",
  "LinkedIn Post",
  "Instagram Post",
  "Twitter/X Thread",
  "Email",
  "Case Study",
];

const pillars = [
  { name: "Education", color: "bg-blue-500", ring: "ring-blue-500", lightBg: "bg-blue-50", text: "text-blue-700", darkLightBg: "bg-blue-500/10", darkText: "text-blue-400" },
  { name: "Authority", color: "bg-purple-500", ring: "ring-purple-500", lightBg: "bg-purple-50", text: "text-purple-700", darkLightBg: "bg-purple-500/10", darkText: "text-purple-400" },
  { name: "Awareness", color: "bg-amber-500", ring: "ring-amber-500", lightBg: "bg-amber-50", text: "text-amber-700", darkLightBg: "bg-amber-500/10", darkText: "text-amber-400" },
  { name: "Conversion", color: "bg-emerald-500", ring: "ring-emerald-500", lightBg: "bg-emerald-50", text: "text-emerald-700", darkLightBg: "bg-emerald-500/10", darkText: "text-emerald-400" },
];

const tones = ["Confident & Direct", "Educational & Helpful", "Bold & Provocative", "Data-Driven & Analytical", "Conversational & Approachable"];

export default function CreateContentPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
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

  const pillarInfo = pillars.find((p) => p.name === selectedPillar);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Create Content for {activeClient.name}</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Build strategy-aligned content for any channel</p>
      </div>

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
                  {pillars.map((pillar) => (
                    <button
                      key={pillar.name}
                      onClick={() => setSelectedPillar(pillar.name)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                        selectedPillar === pillar.name
                          ? dark
                            ? `${pillar.darkLightBg} ${pillar.darkText} border-current ring-1 ${pillar.ring}`
                            : `${pillar.lightBg} ${pillar.text} border-current ring-1 ${pillar.ring}`
                          : dark
                            ? "border-[#2d3748] text-slate-400 hover:bg-[#1a2234]"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className={`h-3 w-3 rounded-full ${pillar.color}`} />
                      {pillar.name}
                    </button>
                  ))}
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
                        }`}>
                          {contentType}
                        </span>
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
                        }`}>
                          {selectedPersona}
                        </span>
                      )}
                      {tone && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600"
                        }`}>
                          {tone}
                        </span>
                      )}
                    </div>

                    {title && (
                      <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{title}</h3>
                    )}

                    {keywords && (
                      <div className="flex flex-wrap gap-1">
                        {keywords.split(",").map((kw, i) => (
                          <span key={i} className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium ${
                            dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                          }`}>
                            {kw.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {body && (
                      <div className={`max-w-none text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>
                        {body.split("\n").map((line, i) => (
                          <p key={i} className={line.trim() === "" ? "h-3" : "mb-2"}>
                            {line}
                          </p>
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
                    <li className="flex items-start gap-1.5">
                      <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />
                      Lead with the insight -- hook or teach first
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />
                      Use specific numbers over vague claims
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />
                      Active voice always -- no passive constructions
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />
                      Cut filler: very, really, basically, just
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className={`mt-1 h-1 w-1 shrink-0 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />
                      Every paragraph must earn its place
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Generate content aligned to brand voice
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Optimize for target persona and pillar
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Include SEO-optimized structure
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Follow {activeClient.name} editorial standards
                  </li>
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
