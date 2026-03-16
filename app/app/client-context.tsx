"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

/* ───────────────────────────── Shared interfaces ───────────────────────────── */

export interface ICP {
  id: string;
  name: string;
  role: string;
  companySize: string;
  industry: string;
  ageRange: string;
  painPoints: string[];
  contentPreferences: string;
}

export interface ContentItem {
  id: string;
  title: string;
  pillar: string;
  platform: string;
  status: string;
  date: string;
  time?: string;
}

export interface CalendarItem {
  day: number;
  title: string;
  pillar: string;
  platform: string;
  status: string;
  time?: string;
}

export interface Topic {
  id: string;
  title: string;
  pillar: string;
  persona: string;
  platforms: string[];
  priority: string;
  notes: string;
}

export interface FullClient {
  id: string;
  name: string;
  industry: string;
  website: string;
  status: "Active" | "Onboarding" | "Paused";
  color: string;
  initials: string;
  // Brand Voice
  brandPositioning: string;
  toneAttributes: { positive: string; negative: string; description: string; example: string }[];
  onVoiceExamples: string[];
  offVoiceExamples: { text: string; reason: string }[];
  // Services / Differentiators
  services: { name: string; details: string }[];
  differentiators: string[];
  // Personas / ICPs
  icps: ICP[];
  // Content Pillars (percentage targets)
  pillarEducation: number;
  pillarAuthority: number;
  pillarAwareness: number;
  pillarConversion: number;
  // Cadence
  cadence: { platform: string; target: string; current: number; max: number; icon: string }[];
  // Content
  recentContent: ContentItem[];
  calendarItems: Record<number, CalendarItem[]>;
  // Ideation
  topics: Topic[];
}

/* ────────────────────── Legacy alias kept for layout.tsx ────────────────────── */
export type ClientProfile = FullClient;

/* ───────────────────────────── Default clients ───────────────────────────── */

const defaultClients: FullClient[] = [
  /* ──────── MarketWake ──────── */
  {
    id: "marketwake",
    name: "MarketWake",
    industry: "Digital Marketing Agency",
    website: "marketwake.com",
    status: "Active",
    color: "from-blue-500 to-purple-600",
    initials: "MW",

    brandPositioning:
      "We sit between boutique specialists (great at one thing) and big holding-company agencies (expensive, slow, impersonal). MarketWake offers enterprise-quality strategy with the speed and attention of a focused team.",

    toneAttributes: [
      { positive: "Confident", negative: "arrogant", description: "We know our stuff and prove it with results. Back claims with data, not bravado.", example: "We increased organic traffic 340% in 6 months. Here's exactly how." },
      { positive: "Direct", negative: "blunt", description: "Get to the point without being cold. Respect the reader's time while maintaining warmth.", example: "Most agencies guess. We measure, test, and iterate until the numbers tell the story." },
      { positive: "Smart", negative: "academic", description: "Expertise without jargon overload. Make complex concepts accessible without dumbing them down.", example: "Your website isn't a brochure -- it's your hardest-working salesperson." },
      { positive: "Energetic", negative: "hype-y", description: "Enthusiasm backed by substance. Show genuine excitement about results and possibilities.", example: "We turned a $15K/mo ad budget into $180K in qualified pipeline. That's the kind of math we love." },
      { positive: "Approachable", negative: "casual", description: "Professional but human. Write like a smart colleague, not a textbook or a text message.", example: "Not every business needs paid ads. Here's how to know if you're one of them." },
    ],

    onVoiceExamples: [
      "We increased organic traffic 340% in 6 months. Here's exactly how.",
      "Most agencies guess. We measure, test, and iterate until the numbers tell the story.",
      "Your website isn't a brochure -- it's your hardest-working salesperson.",
      "Not every business needs paid ads -- here's how to know.",
      "We turned a $15K/mo ad budget into $180K in qualified pipeline.",
    ],

    offVoiceExamples: [
      { text: "In today's ever-changing digital landscape...", reason: "Generic filler -- says nothing" },
      { text: "We leverage synergies to optimize your digital footprint", reason: "Jargon soup -- no one talks like this" },
      { text: "HUGE ANNOUNCEMENT!!!!", reason: "Hype without substance" },
      { text: "We're passionate about helping brands succeed", reason: "Empty claim -- show, don't tell" },
      { text: "In the ever-evolving world of digital marketing...", reason: "Filler opening -- lead with insight instead" },
    ],

    services: [
      { name: "SEO & Content Marketing", details: "Technical SEO, content strategy, link building" },
      { name: "Paid Media (PPC/SEM)", details: "Google Ads, Meta Ads, LinkedIn Ads, programmatic" },
      { name: "Web Design & Development", details: "Custom WordPress, Shopify, performance optimization" },
      { name: "Social Media Marketing", details: "Strategy, content creation, community management" },
      { name: "Email Marketing", details: "Campaign strategy, automation, list management" },
      { name: "Analytics & Reporting", details: "GA4, dashboards, attribution modeling" },
      { name: "Creative Services", details: "Brand identity, graphic design, video production" },
    ],

    differentiators: [
      "Data-driven approach with transparent reporting",
      "Atlanta-based with national client roster",
      "Full-service under one roof (no outsourced piecework)",
      "Senior-level strategists on every account (not junior staff learning on your dime)",
      "Results-focused -- we tie everything back to revenue impact",
    ],

    icps: [
      {
        id: "mw-icp-1",
        name: "Business Owner / Founder",
        role: "CEO, Founder, Owner of SMB ($1M-$50M revenue)",
        companySize: "$1M-$50M revenue",
        industry: "B2B services, ecommerce, healthcare, legal, home services, SaaS",
        ageRange: "30-55",
        painPoints: [
          "I'm spending money on marketing but can't tell what's working",
          "My last agency just sent reports I couldn't understand",
          "I need more leads but I don't know where to start",
          "My website looks outdated and I'm losing credibility",
          "I don't have time to manage marketing on top of running my business",
        ],
        contentPreferences: "Clear results, case studies, proof, simple explanations",
      },
      {
        id: "mw-icp-2",
        name: "Marketing Director / Manager",
        role: "VP Marketing, Director of Marketing, Marketing Manager",
        companySize: "Mid-market ($10M-$500M revenue)",
        industry: "B2B, SaaS, healthcare, professional services, ecommerce",
        ageRange: "28-45",
        painPoints: [
          "I need an agency that can execute at the level I strategize",
          "My team is too small to cover SEO, paid, social, and web",
          "I need to prove marketing's ROI to the C-suite every quarter",
          "We've outgrown our current agency -- they can't keep up",
          "I need a partner who understands our vertical, not just generic best practices",
        ],
        contentPreferences: "Advanced tactics, industry benchmarks, strategic frameworks, data",
      },
      {
        id: "mw-icp-3",
        name: "Ecommerce Brand / DTC Founder",
        role: "Founder, Head of Growth, Ecommerce Manager",
        companySize: "$500K-$20M annual revenue",
        industry: "Direct-to-consumer, Shopify, WooCommerce, BigCommerce",
        ageRange: "25-40",
        painPoints: [
          "My ROAS is declining and I don't know how to fix it",
          "iOS privacy changes wrecked my Meta Ads targeting",
          "I'm getting traffic but conversion rate is terrible",
          "I can't compete with bigger brands on ad spend",
          "I need help with email/SMS but my list is a mess",
        ],
        contentPreferences: "Actionable tactics, platform-specific tips, growth hacks backed by data",
      },
    ],

    pillarEducation: 40,
    pillarAuthority: 30,
    pillarAwareness: 20,
    pillarConversion: 10,

    cadence: [
      { platform: "Blog", target: "2-4/mo", current: 2, max: 4, icon: "B" },
      { platform: "LinkedIn", target: "3-5/wk", current: 4, max: 5, icon: "in" },
      { platform: "Instagram", target: "3-4/wk", current: 3, max: 4, icon: "IG" },
      { platform: "X / Twitter", target: "Daily", current: 5, max: 7, icon: "X" },
      { platform: "Email", target: "1-2/mo", current: 1, max: 2, icon: "E" },
    ],

    recentContent: [
      { id: "mw-rc-1", title: "Why Your SEO Agency Might Be Wasting Your Budget", pillar: "Education", platform: "Blog", status: "Published", date: "Mar 14" },
      { id: "mw-rc-2", title: "Q1 Paid Media Benchmarks for B2B SaaS", pillar: "Authority", platform: "LinkedIn", status: "Published", date: "Mar 13" },
      { id: "mw-rc-3", title: "5 GA4 Reports Every Marketer Needs This Week", pillar: "Education", platform: "Blog", status: "In Review", date: "Mar 12" },
      { id: "mw-rc-4", title: "Behind the Scenes: How We Drove 340% Organic Growth", pillar: "Authority", platform: "Instagram", status: "Scheduled", date: "Mar 17" },
      { id: "mw-rc-5", title: "Atlanta Tech Scene: Digital Marketing Trends for 2026", pillar: "Awareness", platform: "LinkedIn", status: "Draft", date: "Mar 18" },
      { id: "mw-rc-6", title: "Free SEO Audit: Is Your Site Leaving Money on the Table?", pillar: "Conversion", platform: "Email", status: "Scheduled", date: "Mar 20" },
    ],

    calendarItems: {
      2: [{ day: 2, title: "Weekly SEO Tip: Internal Linking Strategy", pillar: "Education", platform: "LinkedIn", status: "Published", time: "9:00 AM" }],
      3: [{ day: 3, title: "Carousel: 5 Signs Your Website Needs a Refresh", pillar: "Awareness", platform: "Instagram", status: "Published", time: "12:00 PM" }],
      4: [
        { day: 4, title: "How We Increased Ecommerce Revenue 280% with Email", pillar: "Authority", platform: "Blog", status: "Published", time: "10:00 AM" },
        { day: 4, title: "Thread: Email marketing myths debunked", pillar: "Education", platform: "X/Twitter", status: "Published", time: "2:00 PM" },
      ],
      5: [{ day: 5, title: "GA4 Transition: What Changed and Why It Matters", pillar: "Education", platform: "LinkedIn", status: "Published", time: "9:00 AM" }],
      6: [{ day: 6, title: "Client Spotlight: B2B SaaS Lead Gen Results", pillar: "Authority", platform: "Instagram", status: "Published", time: "11:00 AM" }],
      9: [
        { day: 9, title: "Blog: Why Your SEO Agency Might Be Wasting Your Budget", pillar: "Education", platform: "Blog", status: "Published", time: "10:00 AM" },
        { day: 9, title: "LinkedIn Poll: Biggest marketing challenge in 2026?", pillar: "Awareness", platform: "LinkedIn", status: "Published", time: "1:00 PM" },
      ],
      10: [{ day: 10, title: "Reel: 60-Second Paid Media Tip", pillar: "Education", platform: "Instagram", status: "Published", time: "12:00 PM" }],
      11: [{ day: 11, title: "Q1 Paid Media Benchmarks for B2B SaaS", pillar: "Authority", platform: "LinkedIn", status: "Published", time: "9:00 AM" }],
      12: [{ day: 12, title: "5 GA4 Reports Every Marketer Needs", pillar: "Education", platform: "Blog", status: "In Review", time: "10:00 AM" }],
      13: [{ day: 13, title: "Carousel: MarketWake Team at Atlanta Tech Week", pillar: "Awareness", platform: "Instagram", status: "Published", time: "3:00 PM" }],
      14: [{ day: 14, title: "Newsletter: March Digital Marketing Roundup", pillar: "Education", platform: "Email", status: "Published", time: "8:00 AM" }],
      16: [
        { day: 16, title: "How to Build a Content Calendar That Actually Works", pillar: "Education", platform: "LinkedIn", status: "Published", time: "9:00 AM" },
        { day: 16, title: "Thread: Unpopular SEO opinions for 2026", pillar: "Awareness", platform: "X/Twitter", status: "Published", time: "11:00 AM" },
      ],
      17: [{ day: 17, title: "Behind the Scenes: How We Drove 340% Organic Growth", pillar: "Authority", platform: "Instagram", status: "Scheduled", time: "12:00 PM" }],
      18: [
        { day: 18, title: "Atlanta Tech Scene: Digital Marketing Trends", pillar: "Awareness", platform: "LinkedIn", status: "Draft", time: "9:00 AM" },
        { day: 18, title: "Blog: The Real Cost of Bad Website Performance", pillar: "Education", platform: "Blog", status: "Draft", time: "10:00 AM" },
      ],
      19: [{ day: 19, title: "Carousel: SEO Checklist for New Websites", pillar: "Education", platform: "Instagram", status: "Scheduled", time: "12:00 PM" }],
      20: [
        { day: 20, title: "Free SEO Audit: Is Your Site Leaving Money on the Table?", pillar: "Conversion", platform: "Email", status: "Scheduled", time: "8:00 AM" },
        { day: 20, title: "Case Study: Healthcare Client PPC Results", pillar: "Authority", platform: "LinkedIn", status: "Scheduled", time: "10:00 AM" },
      ],
      23: [
        { day: 23, title: "Blog: Shopify vs WooCommerce in 2026", pillar: "Education", platform: "Blog", status: "Draft", time: "10:00 AM" },
        { day: 23, title: "Quick Tip: Meta Ads Creative Testing Framework", pillar: "Education", platform: "LinkedIn", status: "Scheduled", time: "9:00 AM" },
      ],
      24: [{ day: 24, title: "Reel: Before/After Website Redesign", pillar: "Authority", platform: "Instagram", status: "Draft", time: "1:00 PM" }],
      25: [{ day: 25, title: "Thread: What we learned spending $500K on Google Ads", pillar: "Authority", platform: "X/Twitter", status: "Draft", time: "11:00 AM" }],
      26: [
        { day: 26, title: "Webinar Promo: Mastering GA4 for Marketers", pillar: "Conversion", platform: "LinkedIn", status: "Draft", time: "9:00 AM" },
        { day: 26, title: "Webinar Promo: Mastering GA4 for Marketers", pillar: "Conversion", platform: "Instagram", status: "Draft", time: "12:00 PM" },
      ],
      27: [{ day: 27, title: "Newsletter: End of Q1 Wrap-Up + Resources", pillar: "Education", platform: "Email", status: "Draft", time: "8:00 AM" }],
      30: [
        { day: 30, title: "Q1 Results Recap: What Worked Across Channels", pillar: "Authority", platform: "Blog", status: "Draft", time: "10:00 AM" },
        { day: 30, title: "Book a Q2 Strategy Session - Limited Spots", pillar: "Conversion", platform: "LinkedIn", status: "Draft", time: "9:00 AM" },
      ],
      31: [{ day: 31, title: "Carousel: Top Performing Content This Quarter", pillar: "Awareness", platform: "Instagram", status: "Draft", time: "12:00 PM" }],
    },

    topics: [
      { id: "mw-t-1", title: "Beginner's Guide to GA4 Event Tracking", pillar: "Education", persona: "Marketing Director / Manager", platforms: ["Blog", "LinkedIn"], priority: "Hot", notes: "Step-by-step walkthrough for setting up custom events. Include screenshots and video embed." },
      { id: "mw-t-2", title: "SEO vs PPC: Where to Invest First", pillar: "Education", persona: "Business Owner / Founder", platforms: ["Blog", "Email"], priority: "Medium", notes: "Compare ROI timelines and budget considerations for SMBs." },
      { id: "mw-t-3", title: "Email Automation Playbook for SMBs", pillar: "Education", persona: "Business Owner / Founder", platforms: ["Blog", "Email", "LinkedIn"], priority: "Backlog", notes: "Cover welcome sequences, abandoned cart, and re-engagement flows." },
      { id: "mw-t-4", title: "Case Study: 340% Organic Growth in 6 Months", pillar: "Authority", persona: "Business Owner / Founder", platforms: ["Blog", "LinkedIn", "Instagram"], priority: "Hot", notes: "Feature the B2B SaaS client. Include before/after data and strategy breakdown." },
      { id: "mw-t-5", title: "Q1 2026 Digital Marketing Benchmark Report", pillar: "Authority", persona: "Marketing Director / Manager", platforms: ["Blog", "LinkedIn", "Email"], priority: "Medium", notes: "Aggregate industry data with MarketWake commentary and recommendations." },
      { id: "mw-t-6", title: "Hot Take: Why Most Marketing Agencies Are Lying to You", pillar: "Awareness", persona: "Business Owner / Founder", platforms: ["LinkedIn", "X/Twitter", "Instagram"], priority: "Hot", notes: "Provocative angle on vanity metrics and fake reporting. Bold but backed by data." },
      { id: "mw-t-7", title: "Atlanta Tech Week Recap & Insights", pillar: "Awareness", persona: "Marketing Director / Manager", platforms: ["Blog", "LinkedIn", "Instagram"], priority: "Medium", notes: "Cover key takeaways, networking highlights, and MarketWake presence." },
      { id: "mw-t-8", title: "Free SEO Audit Landing Page Copy", pillar: "Conversion", persona: "Business Owner / Founder", platforms: ["Blog", "Email"], priority: "Hot", notes: "High-converting landing page with clear CTA. A/B test headline options." },
      { id: "mw-t-9", title: "Q2 Strategy Session Promotion", pillar: "Conversion", persona: "Business Owner / Founder", platforms: ["Email", "LinkedIn", "Instagram"], priority: "Medium", notes: "Promote free 30-min strategy sessions. Urgency-driven copy with limited spots." },
    ],
  },

  /* ──────── Peachtree Dental ──────── */
  {
    id: "peachtree-dental",
    name: "Peachtree Dental",
    industry: "Healthcare / Dental",
    website: "peachtreedental.com",
    status: "Active",
    color: "from-emerald-500 to-teal-600",
    initials: "PD",

    brandPositioning:
      "Peachtree Dental is the neighborhood dental practice that combines modern technology with a genuinely caring, family-friendly atmosphere. We make dental visits comfortable, transparent, and even enjoyable.",

    toneAttributes: [
      { positive: "Warm", negative: "saccharine", description: "Genuine warmth and empathy without being over-the-top sweet. Patients should feel cared for.", example: "We know nobody loves going to the dentist -- so we made it easy to love coming to ours." },
      { positive: "Reassuring", negative: "dismissive", description: "Acknowledge patient concerns and address them with facts and kindness.", example: "Nervous about your first visit? Here's exactly what to expect, step by step." },
      { positive: "Professional", negative: "clinical", description: "Show expertise without cold medical jargon. Make dental care feel accessible.", example: "Dr. Patel uses digital X-rays that reduce radiation by 80% -- and show you results in seconds." },
      { positive: "Friendly", negative: "unprofessional", description: "Conversational but still trustworthy. Like talking to a friend who happens to be a great dentist.", example: "Your smile is our favorite thing to work on. Let's keep it healthy together." },
    ],

    onVoiceExamples: [
      "We know nobody loves going to the dentist -- so we made it easy to love coming to ours.",
      "Nervous about your first visit? Here's exactly what to expect, step by step.",
      "Dr. Patel uses digital X-rays that reduce radiation by 80% -- and show you results in seconds.",
      "Your smile is our favorite thing to work on. Let's keep it healthy together.",
      "Same-day crowns mean one visit, not three. Your time matters to us.",
    ],

    offVoiceExamples: [
      { text: "We provide comprehensive oral healthcare solutions...", reason: "Too clinical and corporate" },
      { text: "Don't neglect your teeth or you'll regret it!", reason: "Fear-based -- we reassure, not scare" },
      { text: "Our state-of-the-art facility leverages cutting-edge technology...", reason: "Jargon-heavy -- keep it human" },
      { text: "FLASH SALE: 50% OFF CLEANINGS!!!", reason: "Dental care isn't a clearance event" },
      { text: "We are passionate about teeth", reason: "Odd and generic -- show care through actions" },
    ],

    services: [
      { name: "General Dentistry", details: "Cleanings, exams, fillings, preventive care" },
      { name: "Cosmetic Dentistry", details: "Whitening, veneers, bonding, smile makeovers" },
      { name: "Restorative Care", details: "Crowns, bridges, implants, dentures" },
      { name: "Pediatric Dentistry", details: "Kid-friendly exams, sealants, fluoride treatments" },
      { name: "Orthodontics", details: "Invisalign, traditional braces, retainers" },
      { name: "Emergency Dental", details: "Same-day appointments for urgent dental issues" },
    ],

    differentiators: [
      "Family-friendly practice welcoming patients of all ages",
      "Same-day crowns and emergency appointments available",
      "In-house financing and insurance coordination",
      "Sedation options for anxious patients",
      "Bilingual staff (English/Spanish)",
      "Modern, spa-like office environment",
    ],

    icps: [
      {
        id: "pd-icp-1",
        name: "New Patient (Family Decision-Maker)",
        role: "Parent, homeowner, primary healthcare decision-maker",
        companySize: "Household income $75K-$200K",
        industry: "Residential / Family",
        ageRange: "30-50",
        painPoints: [
          "I just moved to the area and need a dentist for my whole family",
          "My kids are scared of the dentist and I need somewhere gentle",
          "I haven't been to the dentist in years and I'm embarrassed",
          "Insurance is confusing -- I don't know what's covered",
          "I can never find appointments that work with my schedule",
        ],
        contentPreferences: "Reassuring content, patient testimonials, practical info about insurance and scheduling",
      },
      {
        id: "pd-icp-2",
        name: "Cosmetic Patient",
        role: "Professional seeking smile improvement",
        companySize: "Individual / Professional",
        industry: "Various professional fields",
        ageRange: "25-45",
        painPoints: [
          "I'm self-conscious about my smile in professional settings",
          "I want whiter teeth but I'm worried about sensitivity",
          "Invisalign sounds great but I don't know if I'm a candidate",
          "I've seen bad cosmetic work and I'm afraid of looking fake",
          "I don't know what cosmetic options are realistic for my budget",
        ],
        contentPreferences: "Before/after photos, procedure explainers, cost transparency, patient stories",
      },
      {
        id: "pd-icp-3",
        name: "Office Manager / Referral Partner",
        role: "Dental office manager, referring physician, insurance coordinator",
        companySize: "Healthcare practice",
        industry: "Healthcare / Dental",
        ageRange: "28-55",
        painPoints: [
          "I need a reliable specialist to refer my patients to",
          "Coordinating insurance between offices is a headache",
          "I want to partner with practices that communicate well",
          "Finding a dentist who treats anxious patients well is hard",
          "I need after-hours or emergency options for my patients",
        ],
        contentPreferences: "Professional credentials, referral process details, practice capabilities",
      },
    ],

    pillarEducation: 50,
    pillarAuthority: 25,
    pillarAwareness: 15,
    pillarConversion: 10,

    cadence: [
      { platform: "Blog", target: "2-3/mo", current: 2, max: 3, icon: "B" },
      { platform: "Instagram", target: "3-4/wk", current: 3, max: 4, icon: "IG" },
      { platform: "Facebook", target: "3-5/wk", current: 4, max: 5, icon: "FB" },
      { platform: "Google Business", target: "2-3/wk", current: 2, max: 3, icon: "G" },
      { platform: "Email", target: "2/mo", current: 1, max: 2, icon: "E" },
    ],

    recentContent: [
      { id: "pd-rc-1", title: "5 Signs Your Child Is Ready for Their First Dental Visit", pillar: "Education", platform: "Blog", status: "Published", date: "Mar 14" },
      { id: "pd-rc-2", title: "Patient Spotlight: Sarah's Invisalign Journey", pillar: "Authority", platform: "Instagram", status: "Published", date: "Mar 13" },
      { id: "pd-rc-3", title: "Spring Cleaning for Your Smile: Seasonal Dental Tips", pillar: "Education", platform: "Facebook", status: "Published", date: "Mar 11" },
      { id: "pd-rc-4", title: "Why We Invested in Same-Day Crown Technology", pillar: "Authority", platform: "Blog", status: "In Review", date: "Mar 15" },
      { id: "pd-rc-5", title: "March New Patient Special: Free Whitening with Exam", pillar: "Conversion", platform: "Email", status: "Scheduled", date: "Mar 17" },
      { id: "pd-rc-6", title: "Meet Dr. Patel: Our New Pediatric Specialist", pillar: "Awareness", platform: "Instagram", status: "Draft", date: "Mar 19" },
    ],

    calendarItems: {
      1: [{ day: 1, title: "Monthly Dental Tip: Flossing Techniques That Actually Work", pillar: "Education", platform: "Blog", status: "Published", time: "9:00 AM" }],
      3: [{ day: 3, title: "Patient Testimonial: The Johnsons' Family Experience", pillar: "Authority", platform: "Instagram", status: "Published", time: "12:00 PM" }],
      4: [
        { day: 4, title: "Did You Know? Sugar-Free Gum Can Help Prevent Cavities", pillar: "Education", platform: "Facebook", status: "Published", time: "10:00 AM" },
        { day: 4, title: "Google Review Response + New 5-Star Review Share", pillar: "Authority", platform: "Google Business", status: "Published", time: "2:00 PM" },
      ],
      6: [{ day: 6, title: "Friday Fun: Our Team's Favorite Healthy Snacks", pillar: "Awareness", platform: "Instagram", status: "Published", time: "11:00 AM" }],
      8: [{ day: 8, title: "Blog: What to Expect at Your First Peachtree Dental Visit", pillar: "Education", platform: "Blog", status: "Published", time: "10:00 AM" }],
      10: [
        { day: 10, title: "Before & After: Smile Makeover with Veneers", pillar: "Authority", platform: "Instagram", status: "Published", time: "12:00 PM" },
        { day: 10, title: "Myth-Busting: Does Whitening Damage Your Enamel?", pillar: "Education", platform: "Facebook", status: "Published", time: "3:00 PM" },
      ],
      11: [{ day: 11, title: "Spring Break Dental Checklist for Families", pillar: "Education", platform: "Email", status: "Published", time: "8:00 AM" }],
      13: [{ day: 13, title: "Patient Spotlight: Sarah's Invisalign Journey", pillar: "Authority", platform: "Instagram", status: "Published", time: "12:00 PM" }],
      14: [{ day: 14, title: "5 Signs Your Child Is Ready for Their First Dental Visit", pillar: "Education", platform: "Blog", status: "Published", time: "10:00 AM" }],
      16: [
        { day: 16, title: "National Dentist's Day: Meet Our Team", pillar: "Awareness", platform: "Instagram", status: "Published", time: "10:00 AM" },
        { day: 16, title: "National Dentist's Day: Meet Our Team", pillar: "Awareness", platform: "Facebook", status: "Published", time: "10:00 AM" },
      ],
      17: [{ day: 17, title: "March New Patient Special: Free Whitening with Exam", pillar: "Conversion", platform: "Email", status: "Scheduled", time: "8:00 AM" }],
      19: [{ day: 19, title: "Meet Dr. Patel: Our New Pediatric Specialist", pillar: "Awareness", platform: "Instagram", status: "Draft", time: "12:00 PM" }],
      20: [{ day: 20, title: "Blog: Why We Invested in Same-Day Crown Technology", pillar: "Authority", platform: "Blog", status: "In Review", time: "10:00 AM" }],
      22: [{ day: 22, title: "Toothbrush Replacement Reminder Post", pillar: "Education", platform: "Facebook", status: "Scheduled", time: "9:00 AM" }],
      24: [
        { day: 24, title: "Invisalign Q&A: Your Top 10 Questions Answered", pillar: "Education", platform: "Blog", status: "Draft", time: "10:00 AM" },
        { day: 24, title: "Google Business Update: Spring Hours", pillar: "Awareness", platform: "Google Business", status: "Draft", time: "2:00 PM" },
      ],
      26: [{ day: 26, title: "Patient Appreciation Week Announcement", pillar: "Conversion", platform: "Instagram", status: "Draft", time: "12:00 PM" }],
      27: [{ day: 27, title: "Newsletter: April Dental Health Month Preview", pillar: "Education", platform: "Email", status: "Draft", time: "8:00 AM" }],
      30: [
        { day: 30, title: "Refer a Friend: Get $50 Off Your Next Visit", pillar: "Conversion", platform: "Facebook", status: "Draft", time: "10:00 AM" },
        { day: 30, title: "Blog: How Sedation Dentistry Makes Visits Stress-Free", pillar: "Education", platform: "Blog", status: "Draft", time: "10:00 AM" },
      ],
    },

    topics: [
      { id: "pd-t-1", title: "Complete Guide to Dental Insurance: What's Actually Covered", pillar: "Education", persona: "New Patient (Family Decision-Maker)", platforms: ["Blog", "Facebook"], priority: "Hot", notes: "Break down common insurance plans, co-pays, and what to ask before your visit." },
      { id: "pd-t-2", title: "Invisalign vs. Traditional Braces: Which Is Right for You?", pillar: "Education", persona: "Cosmetic Patient", platforms: ["Blog", "Instagram"], priority: "Hot", notes: "Side-by-side comparison with cost, timeline, and candidate criteria." },
      { id: "pd-t-3", title: "How to Help Your Anxious Child (or Adult!) Feel Comfortable at the Dentist", pillar: "Education", persona: "New Patient (Family Decision-Maker)", platforms: ["Blog", "Facebook", "Email"], priority: "Medium", notes: "Tips from our pediatric team. Include photos of kid-friendly areas." },
      { id: "pd-t-4", title: "Before & After Gallery: Real Peachtree Dental Smile Transformations", pillar: "Authority", persona: "Cosmetic Patient", platforms: ["Instagram", "Blog"], priority: "Hot", notes: "Get patient consent for 5-6 transformations. Include procedure details." },
      { id: "pd-t-5", title: "Why Dr. Patel Chose Pediatric Dentistry: A Personal Story", pillar: "Authority", persona: "New Patient (Family Decision-Maker)", platforms: ["Blog", "Instagram", "Facebook"], priority: "Medium", notes: "Humanize the practice. Interview format with photos." },
      { id: "pd-t-6", title: "Peachtree Dental in the Community: Charity Smile Event Recap", pillar: "Awareness", persona: "New Patient (Family Decision-Maker)", platforms: ["Instagram", "Facebook"], priority: "Medium", notes: "Recap of free dental day event. Photos and impact numbers." },
      { id: "pd-t-7", title: "Summer Smile Special: Whitening Package for Grads", pillar: "Conversion", persona: "Cosmetic Patient", platforms: ["Instagram", "Email", "Facebook"], priority: "Hot", notes: "Target college grads and young professionals. Limited-time offer." },
      { id: "pd-t-8", title: "Dental Emergencies: What to Do Before You Get to Our Office", pillar: "Education", persona: "New Patient (Family Decision-Maker)", platforms: ["Blog", "Google Business"], priority: "Medium", notes: "Practical first-aid tips for knocked-out teeth, severe pain, etc." },
    ],
  },

  /* ──────── SouthStack SaaS ──────── */
  {
    id: "southstack-saas",
    name: "SouthStack SaaS",
    industry: "B2B SaaS",
    website: "southstack.io",
    status: "Onboarding",
    color: "from-amber-500 to-orange-600",
    initials: "SS",

    brandPositioning:
      "SouthStack is the developer-first infrastructure platform that makes deploying, monitoring, and scaling cloud-native applications effortless. We cut through DevOps complexity so engineering teams can ship faster.",

    toneAttributes: [
      { positive: "Technical", negative: "gatekeeping", description: "Show deep technical understanding while remaining accessible to adjacent roles (PMs, CTOs).", example: "Our Kubernetes operator handles rolling deployments with zero-downtime -- no YAML wrestling required." },
      { positive: "Developer-friendly", negative: "condescending", description: "Write for smart engineers. Respect their intelligence and time.", example: "One CLI command. That's all it takes to go from local to production." },
      { positive: "Transparent", negative: "evasive", description: "Be honest about limitations, pricing, and trade-offs. Developers hate spin.", example: "We're not the cheapest option -- but we'll save your team 20+ hours per week on infrastructure." },
      { positive: "Innovative", negative: "buzzwordy", description: "Highlight genuine innovation without resorting to empty tech buzzwords.", example: "We built our own scheduling engine because Kubernetes defaults weren't good enough for real-time workloads." },
    ],

    onVoiceExamples: [
      "Our Kubernetes operator handles rolling deployments with zero-downtime -- no YAML wrestling required.",
      "One CLI command. That's all it takes to go from local to production.",
      "We're not the cheapest option -- but we'll save your team 20+ hours per week on infrastructure.",
      "We built our own scheduling engine because Kubernetes defaults weren't good enough.",
      "Your deploy pipeline shouldn't be the bottleneck. We made sure it isn't.",
    ],

    offVoiceExamples: [
      { text: "SouthStack leverages cutting-edge AI-powered cloud synergies...", reason: "Buzzword bingo -- developers will tune out instantly" },
      { text: "Simply migrate your entire infrastructure to our platform!", reason: "Nothing about migration is simple -- be honest" },
      { text: "We're disrupting the DevOps space!!!", reason: "Overhyped -- show, don't claim" },
      { text: "Our revolutionary platform paradigm shifts your workflow", reason: "Meaningless jargon -- say what it actually does" },
      { text: "Even non-technical users can deploy in minutes!", reason: "We're a developer tool -- own it" },
    ],

    services: [
      { name: "Container Orchestration", details: "Managed Kubernetes, auto-scaling, service mesh" },
      { name: "CI/CD Pipeline", details: "GitOps workflows, automated testing, staged rollouts" },
      { name: "Observability Suite", details: "Metrics, logs, traces, custom dashboards, alerting" },
      { name: "Infrastructure as Code", details: "Terraform modules, Pulumi support, drift detection" },
      { name: "Developer Portal", details: "Service catalog, internal docs, onboarding automation" },
      { name: "Security & Compliance", details: "SOC 2 Type II, RBAC, secrets management, audit logs" },
    ],

    differentiators: [
      "Developer-first UX -- CLI, API, and dashboard all first-class",
      "Built-in observability from day one (not bolted on)",
      "Flat, transparent pricing -- no surprise egress fees",
      "90-second deploy from git push to production",
      "Open-source core with enterprise support options",
      "SOC 2 Type II certified with zero-trust security model",
    ],

    icps: [
      {
        id: "ss-icp-1",
        name: "CTO / VP Engineering",
        role: "CTO, VP of Engineering, Head of Platform",
        companySize: "50-500 employees, Series A to C",
        industry: "SaaS, fintech, healthtech, developer tools",
        ageRange: "32-50",
        painPoints: [
          "We're spending too much engineering time on infrastructure instead of product",
          "Our current setup can't scale with our growth trajectory",
          "I need to reduce cloud costs without sacrificing reliability",
          "Hiring DevOps engineers is expensive and competitive",
          "We need SOC 2 compliance but don't have a dedicated security team",
        ],
        contentPreferences: "ROI analysis, architecture comparisons, case studies with metrics, migration guides",
      },
      {
        id: "ss-icp-2",
        name: "DevOps / Platform Engineer",
        role: "Senior DevOps Engineer, Platform Engineer, SRE",
        companySize: "Engineering teams of 10-100",
        industry: "SaaS, cloud-native companies",
        ageRange: "25-40",
        painPoints: [
          "I'm the only DevOps person and I'm drowning in toil",
          "Our Kubernetes setup is a mess of custom scripts and workarounds",
          "Debugging production issues takes hours because observability is fragmented",
          "I want to implement GitOps but our pipeline is too tangled",
          "Every team wants their own setup and I can't standardize anything",
        ],
        contentPreferences: "Technical tutorials, code examples, architecture deep-dives, comparison benchmarks",
      },
      {
        id: "ss-icp-3",
        name: "Engineering Manager",
        role: "Engineering Manager, Tech Lead, Director of Engineering",
        companySize: "Engineering teams of 20-200",
        industry: "Growth-stage SaaS",
        ageRange: "30-45",
        painPoints: [
          "My team wastes sprint points on deployment issues every cycle",
          "Developer onboarding takes too long because our infra is undocumented",
          "I can't get accurate cost-per-service data for planning",
          "Incident response is chaotic because we lack proper runbooks",
          "I need my team shipping features, not fighting infrastructure",
        ],
        contentPreferences: "Team productivity data, workflow comparisons, ROI calculators, best-practice guides",
      },
    ],

    pillarEducation: 35,
    pillarAuthority: 35,
    pillarAwareness: 15,
    pillarConversion: 15,

    cadence: [
      { platform: "Blog", target: "3-4/mo", current: 3, max: 4, icon: "B" },
      { platform: "LinkedIn", target: "3-5/wk", current: 3, max: 5, icon: "in" },
      { platform: "X / Twitter", target: "Daily", current: 6, max: 7, icon: "X" },
      { platform: "Dev.to", target: "2/mo", current: 1, max: 2, icon: "D" },
      { platform: "YouTube", target: "2/mo", current: 1, max: 2, icon: "YT" },
      { platform: "Email", target: "1/wk", current: 3, max: 4, icon: "E" },
    ],

    recentContent: [
      { id: "ss-rc-1", title: "Zero-Downtime Deployments: How SouthStack Handles Rolling Updates", pillar: "Education", platform: "Blog", status: "Published", date: "Mar 14" },
      { id: "ss-rc-2", title: "Why We Open-Sourced Our Kubernetes Operator", pillar: "Authority", platform: "Blog", status: "Published", date: "Mar 12" },
      { id: "ss-rc-3", title: "SouthStack vs. Heroku vs. Render: Honest Comparison", pillar: "Authority", platform: "Dev.to", status: "Published", date: "Mar 10" },
      { id: "ss-rc-4", title: "How Finch AI Cut Deploy Time from 45 min to 90 Seconds", pillar: "Authority", platform: "Blog", status: "In Review", date: "Mar 15" },
      { id: "ss-rc-5", title: "v2.4 Release: Native Terraform Support Is Here", pillar: "Awareness", platform: "X / Twitter", status: "Published", date: "Mar 13" },
      { id: "ss-rc-6", title: "Free Migration Assessment: Is SouthStack Right for Your Stack?", pillar: "Conversion", platform: "Email", status: "Scheduled", date: "Mar 18" },
    ],

    calendarItems: {
      1: [{ day: 1, title: "Thread: 5 Kubernetes anti-patterns we see every week", pillar: "Education", platform: "X/Twitter", status: "Published", time: "10:00 AM" }],
      3: [
        { day: 3, title: "Blog: Zero-Downtime Deployments with SouthStack", pillar: "Education", platform: "Blog", status: "Published", time: "10:00 AM" },
        { day: 3, title: "LinkedIn: Announcing our SOC 2 Type II certification", pillar: "Authority", platform: "LinkedIn", status: "Published", time: "9:00 AM" },
      ],
      5: [{ day: 5, title: "Dev.to: Getting Started with SouthStack CLI in 5 Minutes", pillar: "Education", platform: "Dev.to", status: "Published", time: "10:00 AM" }],
      6: [{ day: 6, title: "Thread: Why we built our own scheduler (and what we learned)", pillar: "Authority", platform: "X/Twitter", status: "Published", time: "11:00 AM" }],
      8: [{ day: 8, title: "YouTube: SouthStack Platform Demo -- From Git Push to Production", pillar: "Education", platform: "YouTube", status: "Published", time: "2:00 PM" }],
      10: [
        { day: 10, title: "Blog: SouthStack vs Heroku vs Render: Honest Comparison", pillar: "Authority", platform: "Blog", status: "Published", time: "10:00 AM" },
        { day: 10, title: "LinkedIn: How we reduced cloud spend 40% for Series B startups", pillar: "Authority", platform: "LinkedIn", status: "Published", time: "9:00 AM" },
      ],
      12: [{ day: 12, title: "Blog: Why We Open-Sourced Our Kubernetes Operator", pillar: "Authority", platform: "Blog", status: "Published", time: "10:00 AM" }],
      13: [{ day: 13, title: "Thread: v2.4 Release -- Native Terraform Support Is Here", pillar: "Awareness", platform: "X/Twitter", status: "Published", time: "10:00 AM" }],
      14: [{ day: 14, title: "Newsletter: March Platform Updates + Community Highlights", pillar: "Education", platform: "Email", status: "Published", time: "8:00 AM" }],
      16: [
        { day: 16, title: "Blog: How Finch AI Cut Deploy Time from 45 min to 90 Seconds", pillar: "Authority", platform: "Blog", status: "In Review", time: "10:00 AM" },
        { day: 16, title: "LinkedIn: Hiring -- Senior Platform Engineer (Remote)", pillar: "Awareness", platform: "LinkedIn", status: "Published", time: "9:00 AM" },
      ],
      18: [{ day: 18, title: "Free Migration Assessment: Is SouthStack Right for Your Stack?", pillar: "Conversion", platform: "Email", status: "Scheduled", time: "8:00 AM" }],
      19: [{ day: 19, title: "Dev.to: Building Internal Developer Portals with SouthStack", pillar: "Education", platform: "Dev.to", status: "Draft", time: "10:00 AM" }],
      20: [
        { day: 20, title: "YouTube: Live Coding -- Deploying a Next.js App on SouthStack", pillar: "Education", platform: "YouTube", status: "Scheduled", time: "3:00 PM" },
        { day: 20, title: "Thread: The real cost of 'free' PaaS tiers", pillar: "Awareness", platform: "X/Twitter", status: "Scheduled", time: "11:00 AM" },
      ],
      23: [
        { day: 23, title: "Blog: GitOps Best Practices for Growing Engineering Teams", pillar: "Education", platform: "Blog", status: "Draft", time: "10:00 AM" },
        { day: 23, title: "LinkedIn: Customer story -- How Bloom Health scaled to 10M users", pillar: "Authority", platform: "LinkedIn", status: "Draft", time: "9:00 AM" },
      ],
      25: [{ day: 25, title: "Thread: 10 CLI tricks every SouthStack user should know", pillar: "Education", platform: "X/Twitter", status: "Draft", time: "10:00 AM" }],
      26: [{ day: 26, title: "Webinar: From Monolith to Microservices -- A Live Migration", pillar: "Conversion", platform: "LinkedIn", status: "Draft", time: "9:00 AM" }],
      27: [{ day: 27, title: "Newsletter: Platform Roadmap Q2 Preview", pillar: "Awareness", platform: "Email", status: "Draft", time: "8:00 AM" }],
      30: [
        { day: 30, title: "Blog: Observability 101: Metrics, Logs, and Traces Explained", pillar: "Education", platform: "Blog", status: "Draft", time: "10:00 AM" },
        { day: 30, title: "Start Your Free 14-Day Trial -- No Credit Card Required", pillar: "Conversion", platform: "Email", status: "Draft", time: "8:00 AM" },
      ],
      31: [{ day: 31, title: "LinkedIn: Q1 Platform Reliability Report -- 99.99% uptime", pillar: "Authority", platform: "LinkedIn", status: "Draft", time: "9:00 AM" }],
    },

    topics: [
      { id: "ss-t-1", title: "The True Cost of DIY Kubernetes: A CFO-Friendly Breakdown", pillar: "Education", persona: "CTO / VP Engineering", platforms: ["Blog", "LinkedIn"], priority: "Hot", notes: "Build an ROI calculator. Compare engineer-hours vs SouthStack pricing." },
      { id: "ss-t-2", title: "GitOps for Teams That Don't Have a DevOps Team", pillar: "Education", persona: "Engineering Manager", platforms: ["Blog", "Dev.to"], priority: "Hot", notes: "Step-by-step GitOps setup for small teams. Include sample repo structure." },
      { id: "ss-t-3", title: "How Finch AI Went from 45-Minute Deploys to 90 Seconds", pillar: "Authority", persona: "CTO / VP Engineering", platforms: ["Blog", "LinkedIn", "Email"], priority: "Hot", notes: "Full case study with metrics. Get quotes from Finch AI CTO." },
      { id: "ss-t-4", title: "SouthStack vs. Heroku vs. Railway: 2026 Platform Comparison", pillar: "Authority", persona: "DevOps / Platform Engineer", platforms: ["Blog", "Dev.to", "X/Twitter"], priority: "Medium", notes: "Honest comparison with benchmarks. Include pricing tables and feature matrix." },
      { id: "ss-t-5", title: "Building an Internal Developer Portal from Scratch", pillar: "Education", persona: "DevOps / Platform Engineer", platforms: ["Blog", "YouTube"], priority: "Medium", notes: "Tutorial with code examples. Show SouthStack's developer portal features." },
      { id: "ss-t-6", title: "Why We Open-Sourced Our Core (And What It Means for You)", pillar: "Awareness", persona: "DevOps / Platform Engineer", platforms: ["Blog", "X/Twitter", "LinkedIn"], priority: "Medium", notes: "Thought leadership on open-source business models. Link to GitHub repo." },
      { id: "ss-t-7", title: "Webinar: Migrating from Heroku to SouthStack -- Live Demo", pillar: "Conversion", persona: "CTO / VP Engineering", platforms: ["LinkedIn", "Email", "YouTube"], priority: "Hot", notes: "Live migration demo with Q&A. Target Heroku users affected by pricing changes." },
      { id: "ss-t-8", title: "Observability Deep-Dive: Building Custom Dashboards in SouthStack", pillar: "Education", persona: "DevOps / Platform Engineer", platforms: ["Blog", "YouTube", "Dev.to"], priority: "Medium", notes: "Hands-on tutorial with sample queries and dashboard configs." },
    ],
  },
];

/* ───────────────────────────── Context type ───────────────────────────── */

interface ClientContextType {
  clients: FullClient[];
  activeClient: FullClient;
  setActiveClientId: (id: string) => void;
  addClient: (client: FullClient) => void;
  updateClient: (id: string, partial: Partial<FullClient>) => void;
}

const ClientContext = createContext<ClientContextType>({
  clients: defaultClients,
  activeClient: defaultClients[0],
  setActiveClientId: () => {},
  addClient: () => {},
  updateClient: () => {},
});

/* ───────────────────────────── Provider ───────────────────────────── */

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<FullClient[]>(defaultClients);
  const [activeClientId, setActiveClientId] = useState("marketwake");
  const [mounted, setMounted] = useState(false);

  /* Hydrate from localStorage on first mount */
  useEffect(() => {
    const storedClients = localStorage.getItem("mw-clients");
    if (storedClients) {
      try {
        setClients(JSON.parse(storedClients));
      } catch {
        /* ignore bad JSON */
      }
    }
    const storedActive = localStorage.getItem("mw-active-client");
    if (storedActive) {
      setActiveClientId(storedActive);
    }
    setMounted(true);
  }, []);

  /* Persist clients */
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mw-clients", JSON.stringify(clients));
    }
  }, [clients, mounted]);

  /* Persist active client id */
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mw-active-client", activeClientId);
    }
  }, [activeClientId, mounted]);

  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0];

  const addClient = (client: FullClient) => {
    setClients((prev) => [...prev, client]);
  };

  const updateClient = (id: string, partial: Partial<FullClient>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    );
  };

  if (!mounted) return null;

  return (
    <ClientContext.Provider
      value={{ clients, activeClient, setActiveClientId, addClient, updateClient }}
    >
      {children}
    </ClientContext.Provider>
  );
}

/* ───────────────────────────── Hook ───────────────────────────── */

export function useClient() {
  return useContext(ClientContext);
}
