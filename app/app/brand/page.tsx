"use client";

import { useState } from "react";
import { useTheme } from "../theme-context";

const voiceAttributes = [
  {
    positive: "Confident",
    negative: "arrogant",
    description: "We know our stuff and prove it with results. Back claims with data, not bravado.",
    example: "We increased organic traffic 340% in 6 months. Here's exactly how.",
  },
  {
    positive: "Direct",
    negative: "blunt",
    description: "Get to the point without being cold. Respect the reader's time while maintaining warmth.",
    example: "Most agencies guess. We measure, test, and iterate until the numbers tell the story.",
  },
  {
    positive: "Smart",
    negative: "academic",
    description: "Expertise without jargon overload. Make complex concepts accessible without dumbing them down.",
    example: "Your website isn't a brochure -- it's your hardest-working salesperson.",
  },
  {
    positive: "Energetic",
    negative: "hype-y",
    description: "Enthusiasm backed by substance. Show genuine excitement about results and possibilities.",
    example: "We turned a $15K/mo ad budget into $180K in qualified pipeline. That's the kind of math we love.",
  },
  {
    positive: "Approachable",
    negative: "casual",
    description: "Professional but human. Write like a smart colleague, not a textbook or a text message.",
    example: "Not every business needs paid ads. Here's how to know if you're one of them.",
  },
];

const onVoiceExamples = [
  "We increased organic traffic 340% in 6 months. Here's exactly how.",
  "Most agencies guess. We measure, test, and iterate until the numbers tell the story.",
  "Your website isn't a brochure -- it's your hardest-working salesperson.",
  "Not every business needs paid ads -- here's how to know.",
  "We turned a $15K/mo ad budget into $180K in qualified pipeline.",
];

const offVoiceExamples = [
  { text: "In today's ever-changing digital landscape...", reason: "Generic filler -- says nothing" },
  { text: "We leverage synergies to optimize your digital footprint", reason: "Jargon soup -- no one talks like this" },
  { text: "HUGE ANNOUNCEMENT!!!!", reason: "Hype without substance" },
  { text: "We're passionate about helping brands succeed", reason: "Empty claim -- show, don't tell" },
  { text: "In the ever-evolving world of digital marketing...", reason: "Filler opening -- lead with insight instead" },
];

const coreServices = [
  { name: "SEO & Content Marketing", details: "Technical SEO, content strategy, link building" },
  { name: "Paid Media (PPC/SEM)", details: "Google Ads, Meta Ads, LinkedIn Ads, programmatic" },
  { name: "Web Design & Development", details: "Custom WordPress, Shopify, performance optimization" },
  { name: "Social Media Marketing", details: "Strategy, content creation, community management" },
  { name: "Email Marketing", details: "Campaign strategy, automation, list management" },
  { name: "Analytics & Reporting", details: "GA4, dashboards, attribution modeling" },
  { name: "Creative Services", details: "Brand identity, graphic design, video production" },
];

const differentiators = [
  "Data-driven approach with transparent reporting",
  "Atlanta-based with national client roster",
  "Full-service under one roof (no outsourced piecework)",
  "Senior-level strategists on every account (not junior staff learning on your dime)",
  "Results-focused -- we tie everything back to revenue impact",
];

const writingRules = [
  { rule: "Lead with the insight", detail: "First sentence should hook or teach, never introduce" },
  { rule: "One idea per paragraph", detail: "Dense paragraphs lose readers" },
  { rule: "Use specific numbers", detail: '"340% increase" beats "significant growth"' },
  { rule: "Show, don't claim", detail: "Results and examples over adjectives" },
  { rule: "Active voice always", detail: '"We drove 50 leads" not "50 leads were generated"' },
  { rule: "No weasel words", detail: 'Cut "very", "really", "basically", "just", "actually"' },
  { rule: "Short sentences win", detail: "If a sentence has a comma, consider splitting it" },
];

const seoChecklist = [
  "Primary keyword in title, H1, first 100 words, and meta description",
  "Secondary keywords distributed naturally throughout",
  "Meta descriptions: 150-160 characters, include keyword and CTA",
  "Image alt text: Descriptive, include keyword where natural",
  "Internal linking: Minimum 2-3 links to other MW pages per blog post",
  "URL slugs: Short, keyword-rich, hyphenated",
  "Subheadings (H2/H3) every 200-300 words",
];

const formattingStandards = [
  { label: "Headlines", detail: "Benefit-driven or curiosity-driven. Front-load the keyword for SEO." },
  { label: "Subheadings", detail: "Use H2/H3 to break content every 200-300 words" },
  { label: "Paragraphs", detail: "2-4 sentences max" },
  { label: "Lists", detail: "Use bullets for 3+ related items" },
  { label: "Bold", detail: "Key takeaways and important terms" },
  { label: "Links", detail: "Internal links to MW services/blog; external to authoritative sources" },
];

type TabKey = "voice" | "services" | "writing" | "seo";

export default function BrandGuidelinesPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [activeTab, setActiveTab] = useState<TabKey>("voice");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "voice", label: "Brand Voice" },
    { key: "services", label: "Services & Differentiators" },
    { key: "writing", label: "Writing Rules" },
    { key: "seo", label: "SEO Requirements" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Brand Guidelines</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>MarketWake brand voice, editorial standards, and content requirements</p>
      </div>

      {/* Tabs */}
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

      {/* Voice Tab */}
      {activeTab === "voice" && (
        <div className="space-y-6">
          {/* Brand Identity */}
          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <h2 className={`text-lg font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}>MarketWake Brand Voice</h2>
            <p className={`text-sm mb-6 ${dark ? "text-slate-400" : "text-slate-500"}`}>
              Full-service digital marketing agency based in Atlanta, GA. We help businesses grow through strategic digital marketing.
            </p>
            <p className={`text-sm rounded-lg p-4 border ${
              dark ? "bg-blue-500/10 border-blue-500/20 text-blue-300" : "bg-blue-50 border-blue-100 text-slate-600"
            }`}>
              <span className={`font-semibold ${dark ? "text-blue-400" : "text-blue-700"}`}>Positioning:</span> We sit between boutique specialists (great at one thing) and big holding-company agencies (expensive, slow, impersonal). MarketWake offers enterprise-quality strategy with the speed and attention of a focused team.
            </p>
          </div>

          {/* Voice Attributes */}
          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Voice Attributes</h2>
            </div>
            <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-100"}`}>
              {voiceAttributes.map((attr) => (
                <div key={attr.positive} className="px-6 py-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                      dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                    }`}>
                      {attr.positive}
                    </span>
                    <span className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>not</span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      dark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600"
                    }`}>
                      {attr.negative}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${dark ? "text-slate-300" : "text-slate-600"}`}>{attr.description}</p>
                  <div className={`rounded-lg px-4 py-2.5 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                    <p className={`text-sm italic ${dark ? "text-slate-400" : "text-slate-500"}`}>"{attr.example}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Voice / Off-Voice */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className={`rounded-xl border shadow-sm ${dark ? "border-emerald-500/20 bg-[#111827]" : "border-emerald-200 bg-white"}`}>
              <div className={`border-b px-6 py-4 rounded-t-xl ${
                dark ? "border-emerald-500/20 bg-emerald-500/10" : "border-emerald-100 bg-emerald-50"
              }`}>
                <h2 className={`text-sm font-semibold ${dark ? "text-emerald-400" : "text-emerald-700"}`}>On-Voice Examples</h2>
              </div>
              <div className={`divide-y p-2 ${dark ? "divide-[#1e293b]" : "divide-slate-50"}`}>
                {onVoiceExamples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>"{ex}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl border shadow-sm ${dark ? "border-red-500/20 bg-[#111827]" : "border-red-200 bg-white"}`}>
              <div className={`border-b px-6 py-4 rounded-t-xl ${
                dark ? "border-red-500/20 bg-red-500/10" : "border-red-100 bg-red-50"
              }`}>
                <h2 className={`text-sm font-semibold ${dark ? "text-red-400" : "text-red-700"}`}>Off-Voice Examples (Never Do This)</h2>
              </div>
              <div className={`divide-y p-2 ${dark ? "divide-[#1e293b]" : "divide-slate-50"}`}>
                {offVoiceExamples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                      <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>"{ex.text}"</p>
                      <p className={`text-xs mt-0.5 ${dark ? "text-red-400" : "text-red-500"}`}>{ex.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Core Services</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {coreServices.map((svc, i) => (
                <div key={i} className={`rounded-lg border p-4 transition-colors ${
                  dark
                    ? "border-[#1e293b] hover:border-blue-500/30 hover:bg-blue-500/5"
                    : "border-slate-100 hover:border-blue-200 hover:bg-blue-50/30"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold ${
                      dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-100 text-blue-600"
                    }`}>
                      {i + 1}
                    </div>
                    <h3 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{svc.name}</h3>
                  </div>
                  <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{svc.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Key Differentiators</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {differentiators.map((diff, i) => (
                  <div key={i} className={`flex items-start gap-3 rounded-lg px-4 py-3 ${
                    dark ? "bg-[#1a2234]" : "bg-slate-50"
                  }`}>
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500 mt-0.5">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{diff}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Writing Rules Tab */}
      {activeTab === "writing" && (
        <div className="space-y-6">
          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Writing Rules</h2>
            </div>
            <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-100"}`}>
              {writingRules.map((item, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4">
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                    dark ? "bg-[#1a2234] text-slate-400" : "bg-slate-100 text-slate-500"
                  }`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{item.rule}</p>
                    <p className={`text-sm mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Formatting Standards</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {formattingStandards.map((item, i) => (
                  <div key={i} className={`rounded-lg border p-4 ${
                    dark ? "border-[#1e293b]" : "border-slate-100"
                  }`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${dark ? "text-blue-400" : "text-blue-600"}`}>{item.label}</p>
                    <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>SEO Requirements Checklist</h2>
              <p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Every piece of content should meet these SEO standards</p>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {seoChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border mt-0.5 ${
                      dark ? "border-slate-600" : "border-slate-300"
                    }`}>
                      <svg className={`h-3 w-3 ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Blog Post Structure</h2>
            </div>
            <div className="p-6">
              <div className="space-y-1">
                {[
                  { label: "Title (H1)", detail: "Keyword-optimized, benefit-driven" },
                  { label: "Meta Description", detail: "150-160 chars with keyword + CTA" },
                  { label: "Introduction", detail: "Hook + promise (2-3 sentences, keyword in first 100 words)" },
                  { label: "Body Sections (H2s)", detail: "Each section delivers on the promise" },
                  { label: "Subsections (H3s)", detail: "Data points, examples, or client results" },
                  { label: "Key Takeaway", detail: "What to remember" },
                  { label: "CTA", detail: "What to do next (contact MW, download resource, read related post)" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
                    dark ? "hover:bg-[#1a2234]" : "hover:bg-slate-50"
                  }`}>
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <span className={`text-sm font-medium ${dark ? "text-white" : "text-slate-900"}`}>{item.label}</span>
                      <span className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}> -- {item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
