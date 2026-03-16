"use client";

import { useState } from "react";
import { useTheme } from "../theme-context";

interface Persona {
  name: string;
  shortName: string;
  color: string;
  lightBg: string;
  textColor: string;
  borderColor: string;
  darkLightBg: string;
  darkTextColor: string;
  darkBorderColor: string;
  role: string;
  companySize: string;
  industry: string;
  ageRange: string;
  platform?: string;
  psychographics: string[];
  painPoints: string[];
  contentPreferences: {
    wants: string;
    avoids: string;
    format: string;
    channels: string;
  };
  contentResonates: string[];
  desiredActions: string[];
  toneAdjustments: string[];
}

const personas: Persona[] = [
  {
    name: "Business Owner / Founder",
    shortName: "Business Owner",
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    darkLightBg: "bg-blue-500/10",
    darkTextColor: "text-blue-400",
    darkBorderColor: "border-blue-500/20",
    role: "CEO, Founder, Owner of SMB ($1M-$50M revenue)",
    companySize: "$1M-$50M revenue",
    industry: "B2B services, ecommerce, healthcare, legal, home services, SaaS",
    ageRange: "30-55",
    psychographics: [
      "Time-starved -- needs results, not education on process",
      "Has been burned by agencies before (overpromised, underdelivered)",
      "Understands marketing matters but doesn't want to become a marketer",
      "Cares about ROI above all -- \"what's this costing me and what am I getting?\"",
      "Makes decisions based on trust and track record",
    ],
    painPoints: [
      "I'm spending money on marketing but can't tell what's working",
      "My last agency just sent reports I couldn't understand",
      "I need more leads but I don't know where to start",
      "My website looks outdated and I'm losing credibility",
      "I don't have time to manage marketing on top of running my business",
    ],
    contentPreferences: {
      wants: "Clear results, case studies, proof, simple explanations",
      avoids: "Jargon, lengthy theory, anything that feels like a sales pitch",
      format: "Short-form, scannable, video, infographics",
      channels: "LinkedIn, email, Google search (when problem-aware)",
    },
    contentResonates: [
      "Before/after results with specific numbers",
      "\"Here's what we'd do in your first 90 days\" type content",
      "Myth-busting (\"Why your SEO agency is wasting your money\")",
      "Checklists and quick wins they can verify themselves",
      "Honest assessments (\"Not every business needs paid ads\")",
    ],
    desiredActions: [
      "Book a discovery call",
      "Download a relevant resource",
      "Share content with their team/partner",
    ],
    toneAdjustments: [
      "More conversational, less technical",
      "Lead with outcomes, explain process briefly",
      "Use analogies from business (not marketing)",
      "Respect their intelligence -- don't oversimplify, just declutter",
    ],
  },
  {
    name: "Marketing Director / Manager",
    shortName: "Marketing Director",
    color: "bg-purple-500",
    lightBg: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
    darkLightBg: "bg-purple-500/10",
    darkTextColor: "text-purple-400",
    darkBorderColor: "border-purple-500/20",
    role: "VP Marketing, Director of Marketing, Marketing Manager",
    companySize: "Mid-market ($10M-$500M revenue)",
    industry: "B2B, SaaS, healthcare, professional services, ecommerce",
    ageRange: "28-45",
    psychographics: [
      "Knows marketing well -- needs a partner, not a teacher",
      "Under pressure to show results to leadership",
      "Stretched thin -- wearing too many hats, needs to offload execution",
      "Evaluates agencies on expertise depth, not just deliverables",
      "Values transparency and strategic thinking over flashy pitches",
    ],
    painPoints: [
      "I need an agency that can execute at the level I strategize",
      "My team is too small to cover SEO, paid, social, and web",
      "I need to prove marketing's ROI to the C-suite every quarter",
      "We've outgrown our current agency -- they can't keep up",
      "I need a partner who understands our vertical, not just generic best practices",
    ],
    contentPreferences: {
      wants: "Advanced tactics, industry benchmarks, strategic frameworks, data",
      avoids: "Beginner-level content, vague promises, anything that wastes their time",
      format: "Long-form blog posts, detailed guides, webinars, case studies with methodology",
      channels: "LinkedIn, industry newsletters, Google search, marketing podcasts",
    },
    contentResonates: [
      "Deep-dive tactical content (GA4 migration guides, advanced bidding strategies)",
      "Benchmark data and industry reports",
      "\"How we did it\" breakdowns with methodology",
      "Strategic frameworks they can adapt",
      "Honest content about what works and what doesn't in specific verticals",
    ],
    desiredActions: [
      "Request a strategy audit",
      "Subscribe to newsletter for ongoing insights",
      "Share with their team as a resource",
      "Engage in LinkedIn conversation with MW team",
    ],
    toneAdjustments: [
      "Peer-to-peer -- they're experts too",
      "More technical detail is welcome",
      "Focus on methodology and strategy, not just outcomes",
      "Acknowledge the complexity of their role",
    ],
  },
  {
    name: "Ecommerce Brand / DTC Founder",
    shortName: "Ecommerce Brand",
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    darkLightBg: "bg-emerald-500/10",
    darkTextColor: "text-emerald-400",
    darkBorderColor: "border-emerald-500/20",
    role: "Founder, Head of Growth, Ecommerce Manager",
    companySize: "$500K-$20M annual revenue",
    industry: "Direct-to-consumer, Shopify, WooCommerce, BigCommerce",
    ageRange: "25-40",
    platform: "Shopify, WooCommerce, BigCommerce",
    psychographics: [
      "Growth-obsessed -- always looking for the next lever to pull",
      "Data-savvy but may lack deep marketing expertise",
      "Has tried DIY marketing and hit a ceiling",
      "Moves fast -- wants agile partners, not slow agency timelines",
      "Tracks ROAS, CAC, LTV religiously",
    ],
    painPoints: [
      "My ROAS is declining and I don't know how to fix it",
      "iOS privacy changes wrecked my Meta Ads targeting",
      "I'm getting traffic but conversion rate is terrible",
      "I can't compete with bigger brands on ad spend",
      "I need help with email/SMS but my list is a mess",
    ],
    contentPreferences: {
      wants: "Actionable tactics, platform-specific tips, growth hacks backed by data",
      avoids: "Generic advice, anything not tied to revenue",
      format: "Short tactical posts, video walkthroughs, carousels, threads",
      channels: "Instagram, X/Twitter, TikTok, LinkedIn, ecommerce communities",
    },
    contentResonates: [
      "Specific platform tactics (Shopify speed optimization, Meta Ads creative testing)",
      "Revenue-focused case studies with ROAS/CAC numbers",
      "\"We spent $X and made $Y\" transparent breakdowns",
      "Seasonal prep guides (Black Friday, back-to-school)",
      "Stack recommendations (apps, tools, integrations)",
    ],
    desiredActions: [
      "Book a free audit (site, ads, or email)",
      "Follow MW on social for ongoing tactical content",
      "Join a webinar or workshop",
    ],
    toneAdjustments: [
      "Fast-paced, punchy, no fluff",
      "Use ecommerce-specific metrics and language",
      "Visual content performs best",
      "Be specific about platforms and tools",
    ],
  },
];

export default function PersonasPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [expandedPersona, setExpandedPersona] = useState<string | null>(personas[0].name);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Audience Personas</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Target audience profiles for MarketWake content strategy</p>
      </div>

      <div className="space-y-6">
        {personas.map((persona) => {
          const isExpanded = expandedPersona === persona.name;
          return (
            <div
              key={persona.name}
              className={`rounded-xl border shadow-sm transition-all ${
                isExpanded
                  ? dark ? persona.darkBorderColor + " bg-[#111827]" : persona.borderColor + " bg-white"
                  : dark ? "border-[#1e293b] bg-[#111827]" : "border-slate-200 bg-white"
              }`}
            >
              {/* Header - always visible */}
              <button
                onClick={() => setExpandedPersona(isExpanded ? null : persona.name)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    dark ? persona.darkLightBg : persona.lightBg
                  }`}>
                    <svg className={`h-6 w-6 ${dark ? persona.darkTextColor : persona.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{persona.name}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        dark ? `${persona.darkLightBg} ${persona.darkTextColor}` : `${persona.lightBg} ${persona.textColor}`
                      }`}>
                        {persona.shortName}
                      </span>
                    </div>
                    <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{persona.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`hidden sm:flex items-center gap-6 text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    <span>Age: {persona.ageRange}</span>
                    <span>{persona.companySize}</span>
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
                      { label: "Role", value: persona.role },
                      { label: "Company Size", value: persona.companySize },
                      { label: "Industry", value: persona.industry },
                      { label: "Age Range", value: persona.ageRange },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-lg p-3 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                        <p className={`text-[10px] font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{item.label}</p>
                        <p className={`mt-1 text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Psychographics & Pain Points */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Psychographics</h4>
                      <div className="space-y-2">
                        {persona.psychographics.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${persona.color}`} />
                            <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Pain Points</h4>
                      <div className="space-y-2">
                        {persona.painPoints.map((item, i) => (
                          <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 ${
                            dark ? "bg-red-500/5" : "bg-red-50/50"
                          }`}>
                            <span className={`mt-0.5 text-xs ${dark ? "text-red-400" : "text-red-400"}`}>{i + 1}.</span>
                            <p className={`text-sm italic ${dark ? "text-slate-300" : "text-slate-600"}`}>"{item}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content Preferences */}
                  <div className="mt-6">
                    <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Preferences</h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        { label: "Wants", color: dark ? "text-emerald-400" : "text-emerald-600", value: persona.contentPreferences.wants },
                        { label: "Avoids", color: dark ? "text-red-400" : "text-red-500", value: persona.contentPreferences.avoids },
                        { label: "Format", color: dark ? "text-blue-400" : "text-blue-600", value: persona.contentPreferences.format },
                        { label: "Channels", color: dark ? "text-purple-400" : "text-purple-600", value: persona.contentPreferences.channels },
                      ].map((pref) => (
                        <div key={pref.label} className={`rounded-lg border p-3 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                          <p className={`text-[10px] font-semibold uppercase tracking-wider ${pref.color}`}>{pref.label}</p>
                          <p className={`mt-1 text-xs ${dark ? "text-slate-300" : "text-slate-600"}`}>{pref.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content That Resonates */}
                  <div className="mt-6">
                    <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Content That Resonates</h4>
                    <div className="space-y-2">
                      {persona.contentResonates.map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <svg className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? persona.darkTextColor : persona.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desired Actions & Tone */}
                  <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Desired Actions</h4>
                      <div className="space-y-2">
                        {persona.desiredActions.map((item, i) => (
                          <div key={i} className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                            dark ? persona.darkLightBg : persona.lightBg
                          }`}>
                            <svg className={`h-4 w-4 ${dark ? persona.darkTextColor : persona.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                            <p className={`text-sm font-medium ${dark ? persona.darkTextColor : persona.textColor}`}>{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className={`mb-3 text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Tone Adjustments</h4>
                      <div className="space-y-2">
                        {persona.toneAdjustments.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dark ? "bg-slate-600" : "bg-slate-300"}`} />
                            <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-600"}`}>{item}</p>
                          </div>
                        ))}
                      </div>
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
