"use client";

import { useState } from "react";
import { useTheme } from "../theme-context";

interface ICP {
  id: string;
  name: string;
  role: string;
  companySize: string;
  industry: string;
  ageRange: string;
  painPoints: string;
  contentPreferences: string;
}

interface Client {
  id: string;
  name: string;
  website: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  notes: string;
  status: "Active" | "Onboarding" | "Paused";
  contentCount: number;
  brandPositioning: string;
  toneFormality: number;
  toneEmotion: number;
  toneHumor: number;
  toneTechnical: number;
  toneBoldness: number;
  onVoiceExamples: string;
  offVoiceExamples: string;
  icps: ICP[];
  pillarEducation: number;
  pillarAuthority: number;
  pillarAwareness: number;
  pillarConversion: number;
  activePlatforms: string[];
  blogPostsPerMonth: number;
  socialPostsPerWeek: number;
  emailsPerMonth: number;
  targetKeywords: string;
  competitorUrls: string;
}

const industryOptions = ["Healthcare", "SaaS/Tech", "Ecommerce", "Professional Services", "Home Services", "Legal", "Real Estate", "Food & Beverage", "Fitness/Wellness", "Education", "Digital Marketing Agency", "Other"];
const platformCheckboxes = ["Blog", "LinkedIn", "Instagram", "X/Twitter", "Facebook", "Email", "TikTok"];

const initialClients: Client[] = [
  {
    id: "1", name: "MarketWake", website: "https://marketwake.com", industry: "Digital Marketing Agency", contactName: "Internal Team", contactEmail: "team@marketwake.com", notes: "Internal brand content.", status: "Active", contentCount: 12,
    brandPositioning: "Atlanta's data-driven digital marketing agency that delivers measurable results, not vanity metrics.", toneFormality: 40, toneEmotion: 60, toneHumor: 50, toneTechnical: 70, toneBoldness: 75,
    onVoiceExamples: "We don't just run ads, we engineer growth systems. Here's how we drove 340% organic growth in 6 months for a B2B SaaS client.", offVoiceExamples: "In today's ever-evolving digital landscape... We leverage synergies to optimize holistic paradigm shifts.",
    icps: [
      { id: "1a", name: "SMB Owner", role: "CEO / Owner", companySize: "10-50 employees", industry: "Various", ageRange: "35-55", painPoints: "Wasting budget on agencies that don't deliver. Don't understand analytics. Need leads, not impressions.", contentPreferences: "Short blog posts, email tips, LinkedIn posts." },
      { id: "1b", name: "Marketing Director", role: "VP/Director of Marketing", companySize: "50-500 employees", industry: "B2B SaaS, Professional Services", ageRange: "30-45", painPoints: "Proving ROI to C-suite. Scaling content production. Keeping up with algorithm changes.", contentPreferences: "In-depth guides, benchmark reports, case studies." },
    ],
    pillarEducation: 40, pillarAuthority: 30, pillarAwareness: 20, pillarConversion: 10, activePlatforms: ["Blog", "LinkedIn", "Instagram", "X/Twitter", "Email"],
    blogPostsPerMonth: 4, socialPostsPerWeek: 5, emailsPerMonth: 2, targetKeywords: "digital marketing agency atlanta, SEO services, PPC management, content marketing strategy", competitorUrls: "https://example-competitor1.com\nhttps://example-competitor2.com",
  },
  {
    id: "2", name: "Peachtree Dental", website: "https://peachtreedental.com", industry: "Healthcare", contactName: "Dr. Sarah Chen", contactEmail: "sarah@peachtreedental.com", notes: "Family dental practice in Buckhead. Wants to increase new patient appointments.", status: "Active", contentCount: 6,
    brandPositioning: "Buckhead's friendliest family dental practice, combining modern technology with a warm, personal touch.", toneFormality: 30, toneEmotion: 70, toneHumor: 60, toneTechnical: 30, toneBoldness: 40,
    onVoiceExamples: "Your smile is our passion. Book your family's checkup today and see why Buckhead families trust us.", offVoiceExamples: "Utilize our state-of-the-art periodontal intervention methodologies.",
    icps: [
      { id: "2a", name: "Buckhead Parent", role: "Parent / Family Decision Maker", companySize: "N/A", industry: "N/A", ageRange: "30-50", painPoints: "Finding a dentist the whole family likes. Dental anxiety for kids. Insurance confusion.", contentPreferences: "Social media tips, short videos, email reminders." },
    ],
    pillarEducation: 50, pillarAuthority: 20, pillarAwareness: 20, pillarConversion: 10, activePlatforms: ["Blog", "Instagram", "Facebook", "Email"],
    blogPostsPerMonth: 2, socialPostsPerWeek: 3, emailsPerMonth: 1, targetKeywords: "dentist buckhead, family dentist atlanta, teeth whitening atlanta, pediatric dentist buckhead", competitorUrls: "https://example-dental-competitor.com",
  },
  {
    id: "3", name: "SouthStack SaaS", website: "https://southstack.io", industry: "SaaS/Tech", contactName: "Marcus Johnson", contactEmail: "marcus@southstack.io", notes: "B2B project management SaaS. Just signed, onboarding in progress.", status: "Onboarding", contentCount: 0,
    brandPositioning: "", toneFormality: 50, toneEmotion: 50, toneHumor: 50, toneTechnical: 50, toneBoldness: 50,
    onVoiceExamples: "", offVoiceExamples: "",
    icps: [],
    pillarEducation: 25, pillarAuthority: 25, pillarAwareness: 25, pillarConversion: 25, activePlatforms: [],
    blogPostsPerMonth: 0, socialPostsPerWeek: 0, emailsPerMonth: 0, targetKeywords: "", competitorUrls: "",
  },
];

const emptyWizardClient: Omit<Client, "id" | "contentCount"> = {
  name: "", website: "", industry: "SaaS/Tech", contactName: "", contactEmail: "", notes: "", status: "Onboarding",
  brandPositioning: "", toneFormality: 50, toneEmotion: 50, toneHumor: 50, toneTechnical: 50, toneBoldness: 50,
  onVoiceExamples: "", offVoiceExamples: "",
  icps: [],
  pillarEducation: 40, pillarAuthority: 30, pillarAwareness: 20, pillarConversion: 10, activePlatforms: [],
  blogPostsPerMonth: 2, socialPostsPerWeek: 3, emailsPerMonth: 1, targetKeywords: "", competitorUrls: "",
};

const statusColors: Record<string, { dark: string; light: string; dot: string }> = {
  Active: { dark: "bg-emerald-500/10 text-emerald-400", light: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  Onboarding: { dark: "bg-amber-500/10 text-amber-400", light: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  Paused: { dark: "bg-slate-500/10 text-slate-400", light: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

type View = "list" | "detail" | "wizard";
type DetailTab = "overview" | "voice" | "icp" | "content" | "settings";

const wizardSteps = ["Basic Info", "Brand Voice", "Target Audience", "Content Strategy", "Review"];

export default function ClientsPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [clients, setClients] = useState<Client[]>(initialClients);
  const [view, setView] = useState<View>("list");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardData, setWizardData] = useState<Omit<Client, "id" | "contentCount">>({ ...emptyWizardClient });
  const [wizardIcpDraft, setWizardIcpDraft] = useState<Omit<ICP, "id">>({ name: "", role: "", companySize: "", industry: "", ageRange: "", painPoints: "", contentPreferences: "" });
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null;

  const inputClass = `w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200 outline-none ${
    dark ? "bg-[#1a2234] border-[#1e293b] text-white placeholder-slate-500 focus:border-blue-500" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500"
  }`;

  const cardClass = `rounded-xl border shadow-sm transition-colors duration-200 ${
    dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"
  }`;

  const labelClass = `mb-1 block text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`;

  const updateWizard = (field: string, value: unknown) => {
    setWizardData((prev) => ({ ...prev, [field]: value }));
  };

  const addIcpToWizard = () => {
    if (!wizardIcpDraft.name.trim()) return;
    const newIcp: ICP = { ...wizardIcpDraft, id: Date.now().toString() };
    setWizardData((prev) => ({ ...prev, icps: [...prev.icps, newIcp] }));
    setWizardIcpDraft({ name: "", role: "", companySize: "", industry: "", ageRange: "", painPoints: "", contentPreferences: "" });
  };

  const removeIcpFromWizard = (id: string) => {
    setWizardData((prev) => ({ ...prev, icps: prev.icps.filter((i) => i.id !== id) }));
  };

  const canAdvanceStep = (): boolean => {
    if (wizardStep === 0) return wizardData.name.trim().length > 0;
    return true;
  };

  const saveClient = () => {
    if (editingClientId) {
      setClients((prev) => prev.map((c) => c.id === editingClientId ? { ...c, ...wizardData } : c));
      setEditingClientId(null);
    } else {
      const newClient: Client = { ...wizardData, id: Date.now().toString(), contentCount: 0 };
      setClients((prev) => [...prev, newClient]);
    }
    setView("list");
    setWizardStep(0);
    setWizardData({ ...emptyWizardClient });
  };

  const openWizard = () => {
    setEditingClientId(null);
    setWizardData({ ...emptyWizardClient });
    setWizardStep(0);
    setView("wizard");
  };

  const openEditWizard = (client: Client) => {
    setEditingClientId(client.id);
    const { id: _id, contentCount: _cc, ...rest } = client;
    setWizardData({ ...rest });
    setWizardStep(0);
    setView("wizard");
  };

  const openDetail = (id: string) => {
    setSelectedClientId(id);
    setDetailTab("overview");
    setView("detail");
  };

  // ---------- SLIDER COMPONENT ----------
  const ToneSlider = ({ label, leftLabel, rightLabel, value, field }: { label: string; leftLabel: string; rightLabel: string; value: number; field: string }) => (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <span className={`text-xs w-20 text-right ${dark ? "text-slate-500" : "text-slate-400"}`}>{leftLabel}</span>
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => updateWizard(field, parseInt(e.target.value))}
          className="flex-1 accent-blue-500"
        />
        <span className={`text-xs w-20 ${dark ? "text-slate-500" : "text-slate-400"}`}>{rightLabel}</span>
        <span className={`text-xs font-mono w-8 text-right ${dark ? "text-slate-300" : "text-slate-600"}`}>{value}</span>
      </div>
    </div>
  );

  // ---------- PILLAR SLIDER ----------
  const PillarSlider = ({ label, color, value, field }: { label: string; color: string; value: number; field: string }) => {
    const total = wizardData.pillarEducation + wizardData.pillarAuthority + wizardData.pillarAwareness + wizardData.pillarConversion;
    return (
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{label}</label>
          <span className={`text-xs font-mono ${dark ? "text-slate-300" : "text-slate-600"}`}>{value}%</span>
        </div>
        <div className="flex items-center gap-3">
          <input type="range" min={0} max={100} value={value} onChange={(e) => updateWizard(field, parseInt(e.target.value))} className={`flex-1 ${color}`} style={{ accentColor: color === "accent-blue-500" ? "#3b82f6" : color === "accent-purple-500" ? "#a855f7" : color === "accent-amber-500" ? "#f59e0b" : "#10b981" }} />
        </div>
        {field === "pillarConversion" && (
          <p className={`mt-2 text-xs ${total === 100 ? (dark ? "text-emerald-400" : "text-emerald-600") : (dark ? "text-amber-400" : "text-amber-600")}`}>
            Total: {total}% {total === 100 ? "(balanced)" : total > 100 ? "(over 100%)" : "(under 100%)"}
          </p>
        )}
      </div>
    );
  };

  // =============================================
  // LIST VIEW
  // =============================================
  if (view === "list") {
    return (
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>Client Management</h1>
            <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Manage your client roster, brand voices, and content strategies</p>
          </div>
          <button onClick={openWizard} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
            + Add New Client
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {clients.map((client) => {
            const sc = statusColors[client.status];
            return (
              <div key={client.id} className={cardClass + " p-6"}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{client.name}</h3>
                    <span className={`inline-block mt-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-100 text-slate-600"}`}>{client.industry}</span>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${dark ? sc.dark : sc.light}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                    {client.status}
                  </span>
                </div>
                <p className={`text-sm mb-1 truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{client.website}</p>
                <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>{client.contentCount} content pieces this month</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openDetail(client.id)} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors duration-200 ${
                    dark ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                    View Details
                  </button>
                  <button onClick={() => openEditWizard(client)} className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors duration-200 ${
                    dark ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b]" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                    Edit
                  </button>
                  {clients.length > 1 && (
                    <button onClick={() => setDeleteConfirmId(client.id)} className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors duration-200 ${
                      dark ? "border-red-500/20 text-red-400 hover:bg-red-500/10" : "border-red-200 text-red-600 hover:bg-red-50"
                    }`}>
                      Delete
                    </button>
                  )}
                </div>
                {deleteConfirmId === client.id && (
                  <div className={`mt-3 rounded-lg border p-3 ${dark ? "border-red-500/20 bg-red-500/5" : "border-red-200 bg-red-50"}`}>
                    <p className={`text-xs mb-2 ${dark ? "text-red-400" : "text-red-700"}`}>Are you sure? This cannot be undone.</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setClients((prev) => prev.filter((c) => c.id !== client.id));
                          setDeleteConfirmId(null);
                        }}
                        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          dark ? "border-[#1e293b] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        Cancel
                      </button>
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

  // =============================================
  // DETAIL VIEW
  // =============================================
  if (view === "detail" && selectedClient) {
    const tabs: { key: DetailTab; label: string }[] = [
      { key: "overview", label: "Overview" },
      { key: "voice", label: "Brand Voice" },
      { key: "icp", label: "ICP / Personas" },
      { key: "content", label: "Content" },
      { key: "settings", label: "Settings" },
    ];

    const sc = statusColors[selectedClient.status];

    return (
      <div className="p-8">
        {/* Back + Header */}
        <button onClick={() => setView("list")} className={`mb-4 flex items-center gap-1 text-sm font-medium transition-colors ${dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}`}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
          Back to Clients
        </button>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
              {selectedClient.name.charAt(0)}
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>{selectedClient.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{selectedClient.industry}</span>
                <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${dark ? sc.dark : sc.light}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />{selectedClient.status}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => openEditWizard(selectedClient)} className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">Edit Client</button>
        </div>

        {/* Tabs */}
        <div className={`mb-6 flex gap-1 border-b ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setDetailTab(tab.key)} className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
              detailTab === tab.key
                ? "border-blue-500 text-blue-500"
                : dark ? "border-transparent text-slate-400 hover:text-white" : "border-transparent text-slate-500 hover:text-slate-900"
            }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {detailTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className={cardClass + " p-6"}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Brand Voice Summary</h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>{selectedClient.brandPositioning || "No brand positioning set yet."}</p>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {[
                  { label: "Formality", value: selectedClient.toneFormality },
                  { label: "Emotion", value: selectedClient.toneEmotion },
                  { label: "Humor", value: selectedClient.toneHumor },
                  { label: "Technical", value: selectedClient.toneTechnical },
                  { label: "Boldness", value: selectedClient.toneBoldness },
                ].map((t) => (
                  <div key={t.label} className="text-center">
                    <div className={`text-xs mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{t.label}</div>
                    <div className={`text-sm font-bold ${dark ? "text-white" : "text-slate-900"}`}>{t.value}</div>
                    <div className={`mt-1 h-1.5 rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                      <div className="h-full rounded-full bg-blue-500" style={{ width: `${t.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={cardClass + " p-6"}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>ICP Summary</h3>
              {selectedClient.icps.length === 0 ? (
                <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No ICPs defined yet.</p>
              ) : (
                <div className="space-y-3">
                  {selectedClient.icps.map((icp) => (
                    <div key={icp.id} className={`rounded-lg border p-3 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                      <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{icp.name}</p>
                      <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{icp.role} | {icp.companySize} | {icp.ageRange}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={cardClass + " p-6"}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Key Services & Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {selectedClient.activePlatforms.length === 0 ? (
                  <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No platforms configured.</p>
                ) : selectedClient.activePlatforms.map((p) => (
                  <span key={p} className={`rounded-full px-3 py-1 text-xs font-medium ${dark ? "bg-[#1a2234] text-slate-300" : "bg-slate-100 text-slate-600"}`}>{p}</span>
                ))}
              </div>
            </div>
            <div className={cardClass + " p-6"}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Pillar Distribution</h3>
              <div className="space-y-2">
                {[
                  { label: "Education", value: selectedClient.pillarEducation, color: "bg-blue-500" },
                  { label: "Authority", value: selectedClient.pillarAuthority, color: "bg-purple-500" },
                  { label: "Awareness", value: selectedClient.pillarAwareness, color: "bg-amber-500" },
                  { label: "Conversion", value: selectedClient.pillarConversion, color: "bg-emerald-500" },
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{p.label}</span>
                      <span className={`text-xs font-mono ${dark ? "text-slate-300" : "text-slate-600"}`}>{p.value}%</span>
                    </div>
                    <div className={`h-2 rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                      <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {detailTab === "voice" && (
          <div className="space-y-6">
            <div className={cardClass + " p-6"}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Brand Positioning</h3>
              <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>{selectedClient.brandPositioning || "Not yet defined."}</p>
            </div>
            <div className={cardClass + " p-6"}>
              <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Tone Attributes</h3>
              <div className="space-y-3">
                {[
                  { label: "Formality", left: "Casual", right: "Formal", value: selectedClient.toneFormality },
                  { label: "Emotion", left: "Reserved", right: "Expressive", value: selectedClient.toneEmotion },
                  { label: "Humor", left: "Serious", right: "Playful", value: selectedClient.toneHumor },
                  { label: "Technical", left: "Simple", right: "Technical", value: selectedClient.toneTechnical },
                  { label: "Boldness", left: "Conservative", right: "Bold", value: selectedClient.toneBoldness },
                ].map((t) => (
                  <div key={t.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{t.label}</span>
                      <span className={`text-xs font-mono ${dark ? "text-slate-300" : "text-slate-600"}`}>{t.value}/100</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] w-20 text-right ${dark ? "text-slate-600" : "text-slate-400"}`}>{t.left}</span>
                      <div className={`flex-1 h-2 rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${t.value}%` }} />
                      </div>
                      <span className={`text-[10px] w-20 ${dark ? "text-slate-600" : "text-slate-400"}`}>{t.right}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className={cardClass + " p-6"}>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>On-Voice Examples</h3>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${dark ? "text-slate-300" : "text-slate-700"}`}>{selectedClient.onVoiceExamples || "No examples provided."}</p>
              </div>
              <div className={cardClass + " p-6"}>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Off-Voice Examples</h3>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${dark ? "text-slate-300" : "text-slate-700"}`}>{selectedClient.offVoiceExamples || "No examples provided."}</p>
              </div>
            </div>
          </div>
        )}

        {detailTab === "icp" && (
          <div>
            {selectedClient.icps.length === 0 ? (
              <div className={cardClass + " p-12 text-center"}>
                <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No ICPs defined for this client yet. Edit the client to add target personas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {selectedClient.icps.map((icp) => (
                  <div key={icp.id} className={cardClass + " p-6"}>
                    <h3 className={`text-lg font-bold mb-1 ${dark ? "text-white" : "text-slate-900"}`}>{icp.name}</h3>
                    <p className={`text-sm mb-4 ${dark ? "text-slate-400" : "text-slate-500"}`}>{icp.role}</p>
                    <div className="space-y-3">
                      {[
                        { label: "Company Size", value: icp.companySize },
                        { label: "Industry", value: icp.industry },
                        { label: "Age Range", value: icp.ageRange },
                      ].map((f) => f.value && (
                        <div key={f.label}>
                          <p className={`text-xs font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>{f.label}</p>
                          <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{f.value}</p>
                        </div>
                      ))}
                      {icp.painPoints && (
                        <div>
                          <p className={`text-xs font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>Pain Points</p>
                          <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>{icp.painPoints}</p>
                        </div>
                      )}
                      {icp.contentPreferences && (
                        <div>
                          <p className={`text-xs font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Preferences</p>
                          <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>{icp.contentPreferences}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailTab === "content" && (
          <div className={cardClass + " p-6"}>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Pieces</h3>
            {selectedClient.contentCount === 0 ? (
              <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No content created for this client yet.</p>
            ) : (
              <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-100"}`}>
                {Array.from({ length: Math.min(selectedClient.contentCount, 5) }).map((_, i) => (
                  <div key={i} className={`flex items-center gap-3 py-3 ${i === 0 ? "" : ""}`}>
                    <div className={`h-2 w-2 rounded-full ${["bg-blue-500", "bg-purple-500", "bg-amber-500", "bg-emerald-500"][i % 4]}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${dark ? "text-white" : "text-slate-900"}`}>Content piece #{i + 1} for {selectedClient.name}</p>
                      <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>March 2026</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>Published</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailTab === "settings" && (
          <div className={cardClass + " p-6"}>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${dark ? "text-slate-500" : "text-slate-400"}`}>Client Settings</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: "Client Name", value: selectedClient.name },
                { label: "Website", value: selectedClient.website },
                { label: "Industry", value: selectedClient.industry },
                { label: "Status", value: selectedClient.status },
                { label: "Contact Name", value: selectedClient.contactName },
                { label: "Contact Email", value: selectedClient.contactEmail },
              ].map((f) => (
                <div key={f.label}>
                  <p className={`text-xs font-medium mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{f.label}</p>
                  <p className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{f.value || "—"}</p>
                </div>
              ))}
              {selectedClient.notes && (
                <div className="md:col-span-2">
                  <p className={`text-xs font-medium mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Notes</p>
                  <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-700"}`}>{selectedClient.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =============================================
  // WIZARD VIEW
  // =============================================
  if (view === "wizard") {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto" style={{ backgroundColor: dark ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.5)" }}>
        <div className={`m-4 w-full max-w-3xl rounded-2xl border shadow-2xl transition-colors duration-200 ${
          dark ? "bg-[#0d1117] border-[#1e293b]" : "bg-white border-slate-200"
        }`}>
          {/* Wizard Header */}
          <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{editingClientId ? "Edit Client" : "Add New Client"}</h2>
              <button onClick={() => { setView("list"); setEditingClientId(null); }} className={`rounded-lg p-1 transition-colors ${dark ? "text-slate-400 hover:text-white hover:bg-[#1a2234]" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100"}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Progress Bar */}
            <div className="flex items-center gap-2">
              {wizardSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2 flex-1">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200 ${
                    i < wizardStep ? "bg-emerald-500 text-white" : i === wizardStep ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : dark ? "bg-[#1a2234] text-slate-500" : "bg-slate-100 text-slate-400"
                  }`}>
                    {i < wizardStep ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    ) : i + 1}
                  </div>
                  <span className={`hidden sm:block text-xs font-medium ${i === wizardStep ? (dark ? "text-white" : "text-slate-900") : dark ? "text-slate-500" : "text-slate-400"}`}>{step}</span>
                  {i < wizardSteps.length - 1 && <div className={`flex-1 h-px ${dark ? "bg-[#1e293b]" : "bg-slate-200"}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Wizard Body */}
          <div className="px-6 py-6">
            {/* Step 1: Basic Info */}
            {wizardStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Client Name *</label>
                  <input type="text" value={wizardData.name} onChange={(e) => updateWizard("name", e.target.value)} placeholder="e.g., Peachtree Dental" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Website URL</label>
                  <input type="text" value={wizardData.website} onChange={(e) => updateWizard("website", e.target.value)} placeholder="https://" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Industry</label>
                  <select value={wizardData.industry} onChange={(e) => updateWizard("industry", e.target.value)} className={inputClass}>
                    {industryOptions.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Contact Name</label>
                    <input type="text" value={wizardData.contactName} onChange={(e) => updateWizard("contactName", e.target.value)} placeholder="Full name" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Email</label>
                    <input type="email" value={wizardData.contactEmail} onChange={(e) => updateWizard("contactEmail", e.target.value)} placeholder="email@company.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Notes</label>
                  <textarea value={wizardData.notes} onChange={(e) => updateWizard("notes", e.target.value)} rows={3} placeholder="Any relevant context about the client..." className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 2: Brand Voice */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Brand Positioning Statement</label>
                  <textarea value={wizardData.brandPositioning} onChange={(e) => updateWizard("brandPositioning", e.target.value)} rows={3} placeholder="How does this brand position itself in the market?" className={inputClass} />
                </div>
                <div>
                  <p className={`text-sm font-medium mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>Tone Attributes</p>
                  <ToneSlider label="Formality" leftLabel="Casual" rightLabel="Formal" value={wizardData.toneFormality} field="toneFormality" />
                  <ToneSlider label="Emotion" leftLabel="Reserved" rightLabel="Expressive" value={wizardData.toneEmotion} field="toneEmotion" />
                  <ToneSlider label="Humor" leftLabel="Serious" rightLabel="Playful" value={wizardData.toneHumor} field="toneHumor" />
                  <ToneSlider label="Technical" leftLabel="Simple" rightLabel="Technical" value={wizardData.toneTechnical} field="toneTechnical" />
                  <ToneSlider label="Boldness" leftLabel="Conservative" rightLabel="Bold" value={wizardData.toneBoldness} field="toneBoldness" />
                </div>
                <div>
                  <label className={labelClass}>On-Voice Examples</label>
                  <textarea value={wizardData.onVoiceExamples} onChange={(e) => updateWizard("onVoiceExamples", e.target.value)} rows={3} placeholder="Paste examples of content that sounds like this brand" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Off-Voice Examples</label>
                  <textarea value={wizardData.offVoiceExamples} onChange={(e) => updateWizard("offVoiceExamples", e.target.value)} rows={3} placeholder="What should this brand NEVER sound like?" className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 3: Target Audience / ICP */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                {/* Existing ICPs */}
                {wizardData.icps.length > 0 && (
                  <div className="space-y-3 mb-4">
                    <p className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Added ICPs</p>
                    {wizardData.icps.map((icp) => (
                      <div key={icp.id} className={`flex items-start justify-between rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                        <div>
                          <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{icp.name}</p>
                          <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{icp.role} | {icp.companySize} | {icp.ageRange}</p>
                          {icp.painPoints && <p className={`mt-1 text-xs line-clamp-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>{icp.painPoints}</p>}
                        </div>
                        <button onClick={() => removeIcpFromWizard(icp.id)} className={`rounded p-1 transition-colors ${dark ? "text-slate-500 hover:text-red-400" : "text-slate-400 hover:text-red-500"}`}>
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add ICP Form */}
                <div className={`rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#111827]" : "border-slate-200 bg-white"}`}>
                  <p className={`text-sm font-medium mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>Add an ICP</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>ICP Name</label>
                      <input type="text" value={wizardIcpDraft.name} onChange={(e) => setWizardIcpDraft((p) => ({ ...p, name: e.target.value }))} placeholder="e.g., Small Business Owner" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Role / Title</label>
                      <input type="text" value={wizardIcpDraft.role} onChange={(e) => setWizardIcpDraft((p) => ({ ...p, role: e.target.value }))} placeholder="e.g., CEO" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Company Size</label>
                      <input type="text" value={wizardIcpDraft.companySize} onChange={(e) => setWizardIcpDraft((p) => ({ ...p, companySize: e.target.value }))} placeholder="e.g., 10-50 employees" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Industry</label>
                      <input type="text" value={wizardIcpDraft.industry} onChange={(e) => setWizardIcpDraft((p) => ({ ...p, industry: e.target.value }))} placeholder="e.g., Healthcare" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Age Range</label>
                      <input type="text" value={wizardIcpDraft.ageRange} onChange={(e) => setWizardIcpDraft((p) => ({ ...p, ageRange: e.target.value }))} placeholder="e.g., 30-50" className={inputClass} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className={labelClass}>Pain Points</label>
                    <textarea value={wizardIcpDraft.painPoints} onChange={(e) => setWizardIcpDraft((p) => ({ ...p, painPoints: e.target.value }))} rows={2} placeholder="What challenges does this persona face?" className={inputClass} />
                  </div>
                  <div className="mt-3">
                    <label className={labelClass}>Content Preferences</label>
                    <textarea value={wizardIcpDraft.contentPreferences} onChange={(e) => setWizardIcpDraft((p) => ({ ...p, contentPreferences: e.target.value }))} rows={2} placeholder="What types of content does this persona engage with?" className={inputClass} />
                  </div>
                  <button onClick={addIcpToWizard} disabled={!wizardIcpDraft.name.trim()} className={`mt-3 rounded-lg border px-4 py-2 text-xs font-medium transition-colors duration-200 ${
                    dark ? "border-[#1e293b] bg-[#1a2234] text-slate-300 hover:bg-[#1e293b] disabled:opacity-40" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                  }`}>
                    + Add Another ICP
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Content Strategy */}
            {wizardStep === 3 && (
              <div className="space-y-6">
                <div>
                  <p className={`text-sm font-medium mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>Content Pillar Distribution</p>
                  <PillarSlider label="Education" color="accent-blue-500" value={wizardData.pillarEducation} field="pillarEducation" />
                  <PillarSlider label="Authority" color="accent-purple-500" value={wizardData.pillarAuthority} field="pillarAuthority" />
                  <PillarSlider label="Awareness" color="accent-amber-500" value={wizardData.pillarAwareness} field="pillarAwareness" />
                  <PillarSlider label="Conversion" color="accent-emerald-500" value={wizardData.pillarConversion} field="pillarConversion" />
                </div>
                <div>
                  <p className={`text-sm font-medium mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>Active Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {platformCheckboxes.map((p) => {
                      const active = wizardData.activePlatforms.includes(p);
                      return (
                        <button key={p} onClick={() => updateWizard("activePlatforms", active ? wizardData.activePlatforms.filter((x) => x !== p) : [...wizardData.activePlatforms, p])}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${
                            active ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" : dark ? "bg-[#1a2234] text-slate-400 border border-[#1e293b] hover:bg-[#1e293b]" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
                          }`}>
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className={`text-sm font-medium mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>Content Cadence</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Blog Posts / Month</label>
                      <input type="number" min={0} value={wizardData.blogPostsPerMonth} onChange={(e) => updateWizard("blogPostsPerMonth", parseInt(e.target.value) || 0)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Social Posts / Week</label>
                      <input type="number" min={0} value={wizardData.socialPostsPerWeek} onChange={(e) => updateWizard("socialPostsPerWeek", parseInt(e.target.value) || 0)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Emails / Month</label>
                      <input type="number" min={0} value={wizardData.emailsPerMonth} onChange={(e) => updateWizard("emailsPerMonth", parseInt(e.target.value) || 0)} className={inputClass} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Target Keywords</label>
                  <textarea value={wizardData.targetKeywords} onChange={(e) => updateWizard("targetKeywords", e.target.value)} rows={3} placeholder="One keyword or phrase per line" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Competitor URLs</label>
                  <textarea value={wizardData.competitorUrls} onChange={(e) => updateWizard("competitorUrls", e.target.value)} rows={3} placeholder="One URL per line" className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {wizardStep === 4 && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className={`rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Basic Info</h4>
                    <button onClick={() => setWizardStep(0)} className="text-xs font-medium text-blue-500 hover:text-blue-400">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Name: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.name || "—"}</span></p>
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Website: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.website || "—"}</span></p>
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Industry: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.industry}</span></p>
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Contact: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.contactName || "—"}</span></p>
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Email: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.contactEmail || "—"}</span></p>
                  </div>
                  {wizardData.notes && <p className={`mt-2 text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>Notes: {wizardData.notes}</p>}
                </div>

                {/* Brand Voice */}
                <div className={`rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Brand Voice</h4>
                    <button onClick={() => setWizardStep(1)} className="text-xs font-medium text-blue-500 hover:text-blue-400">Edit</button>
                  </div>
                  <p className={`text-sm mb-2 ${dark ? "text-slate-300" : "text-slate-700"}`}>{wizardData.brandPositioning || "No positioning statement."}</p>
                  <div className="flex gap-4 text-xs">
                    <span className={dark ? "text-slate-500" : "text-slate-400"}>Formality: {wizardData.toneFormality}</span>
                    <span className={dark ? "text-slate-500" : "text-slate-400"}>Emotion: {wizardData.toneEmotion}</span>
                    <span className={dark ? "text-slate-500" : "text-slate-400"}>Humor: {wizardData.toneHumor}</span>
                    <span className={dark ? "text-slate-500" : "text-slate-400"}>Technical: {wizardData.toneTechnical}</span>
                    <span className={dark ? "text-slate-500" : "text-slate-400"}>Boldness: {wizardData.toneBoldness}</span>
                  </div>
                </div>

                {/* ICPs */}
                <div className={`rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Target Audience ({wizardData.icps.length} ICP{wizardData.icps.length !== 1 ? "s" : ""})</h4>
                    <button onClick={() => setWizardStep(2)} className="text-xs font-medium text-blue-500 hover:text-blue-400">Edit</button>
                  </div>
                  {wizardData.icps.length === 0 ? (
                    <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No ICPs added.</p>
                  ) : (
                    <div className="space-y-1">
                      {wizardData.icps.map((icp) => (
                        <p key={icp.id} className={`text-sm ${dark ? "text-slate-300" : "text-slate-700"}`}>{icp.name} — {icp.role} ({icp.companySize})</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Strategy */}
                <div className={`rounded-lg border p-4 ${dark ? "border-[#1e293b] bg-[#0d1117]" : "border-slate-100 bg-slate-50"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Content Strategy</h4>
                    <button onClick={() => setWizardStep(3)} className="text-xs font-medium text-blue-500 hover:text-blue-400">Edit</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Education: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.pillarEducation}%</span></p>
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Authority: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.pillarAuthority}%</span></p>
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Awareness: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.pillarAwareness}%</span></p>
                    <p className={dark ? "text-slate-400" : "text-slate-500"}>Conversion: <span className={dark ? "text-slate-200" : "text-slate-700"}>{wizardData.pillarConversion}%</span></p>
                  </div>
                  <p className={`mt-2 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    Platforms: {wizardData.activePlatforms.length > 0 ? wizardData.activePlatforms.join(", ") : "None selected"}
                  </p>
                  <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    Cadence: {wizardData.blogPostsPerMonth} blog/mo, {wizardData.socialPostsPerWeek} social/wk, {wizardData.emailsPerMonth} email/mo
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer */}
          <div className={`flex items-center justify-between border-t px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
            <button
              onClick={() => { if (wizardStep === 0) { setView("list"); setEditingClientId(null); } else setWizardStep((s) => s - 1); }}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                dark ? "border-[#1e293b] text-slate-300 hover:bg-[#1a2234]" : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {wizardStep === 0 ? "Cancel" : "Back"}
            </button>
            {wizardStep < 4 ? (
              <button
                onClick={() => setWizardStep((s) => s + 1)}
                disabled={!canAdvanceStep()}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={saveClient}
                className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                {editingClientId ? "Save Changes" : "Save Client"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
