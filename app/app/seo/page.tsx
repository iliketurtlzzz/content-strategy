"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../theme-context";
import { analyzeContent } from "../lib/analyzer";
import { parseText, parseHTML } from "../lib/parsers";

const intentOptions = ["Informational", "Commercial", "Transactional", "Navigational"];
const personaOptions = ["Business Owner", "Marketing Director", "Ecommerce Brand"];
const formatOptions = ["Blog Post", "Landing Page", "Pillar Page", "How-To Guide", "Listicle", "Case Study"];

const auditChecklist = [
  // Traditional SEO (indices 0-2)
  { category: "Technical SEO", items: [
    "Page loads in under 3 seconds",
    "Mobile-friendly (passes Google Mobile-Friendly Test)",
    "HTTPS enabled across all pages",
    "XML sitemap submitted to Google Search Console",
    "Robots.txt properly configured",
    "No broken links (404 errors)",
    "Canonical tags set correctly",
    "Structured data / schema markup implemented",
    "JSON-LD Article or BlogPosting schema on content pages",
    "FAQ schema for Q&A sections",
    "Open Graph tags complete (og:title, og:description, og:type, og:image)",
  ]},
  { category: "On-Page SEO", items: [
    "Primary keyword in title tag",
    "Primary keyword in H1",
    "Primary keyword in first 100 words",
    "Meta description includes keyword and CTA (150-160 chars)",
    "URL is short, keyword-rich, and hyphenated",
    "H2/H3 subheadings every 200-300 words",
    "Image alt text is descriptive with keywords where natural",
    "Internal links: 2-3 minimum to other MW pages",
    "External links to authoritative sources",
    "Content is 1,000+ words for competitive keywords",
  ]},
  { category: "Content Quality", items: [
    "Addresses user search intent directly",
    "Provides unique value not found in competing content",
    "Includes specific data points or examples",
    "Active voice throughout",
    "No filler language or jargon soup",
    "Clear CTA at the end",
    "Formatted for scannability (bullets, bold, short paragraphs)",
  ]},
  // AEO / LLM Citation Readiness (indices 3-8)
  { category: "AEO: Front-Loading (Ski Ramp)", items: [
    "Key definitions and conclusions appear in first 30% of content",
    "Topic defined in the first 1-2 paragraphs",
    "No long narrative intros or throat-clearing openers",
    "Most entity-rich, definitive content placed up front",
    "Conclusion/key takeaway stated early, not buried at bottom",
  ]},
  { category: "AEO: Definitive Language", items: [
    "Uses direct, factual \"X is...\" and \"X refers to...\" patterns",
    "No hedging words: might, perhaps, could be, arguably",
    "No filler phrases: \"it goes without saying\", \"as we all know\"",
    "No hype language: amazing, revolutionary, game-changing, groundbreaking",
    "No vague openers: \"In today's fast-paced world...\", \"In this day and age...\"",
  ]},
  { category: "AEO: Question + Answer Structure", items: [
    "50%+ of H2 headings framed as questions",
    "Direct answer in first sentence after each question heading",
    "Key entities mirrored between heading and answer paragraph",
    "Questions match real user queries (What is X? How does X work?)",
  ]},
  { category: "AEO: Entity Richness", items: [
    "Named specific tools, brands, and frameworks (not \"many tools\")",
    "Includes statistics and data points with sources",
    "References specific people, companies, or industry terms",
    "Entity density above 15% (proper nouns, stats, branded terms)",
    "Replaces \"best practices\" with named, concrete examples",
  ]},
  { category: "AEO: Balanced Sentiment", items: [
    "Analyst tone: fact + interpretation (not purely objective or emotional)",
    "Includes balanced perspective: \"however\", \"on the other hand\"",
    "Presents trade-offs and comparisons, not just praise",
    "No excessive promotional or hype language",
    "Subjectivity score balanced (~0.47 target)",
  ]},
  { category: "AEO: Business-Grade Writing", items: [
    "Flesch-Kincaid grade level around 16 (business-grade, not academic)",
    "Average sentence length 12-22 words",
    "Clear subject-verb-object sentence structures",
    "Paragraphs between 30-80 words with substantive content",
    "Uses bullet points and numbered lists for key information",
  ]},
];

const onPageReference = [
  { element: "Title Tag", best: "50-60 characters. Primary keyword front-loaded. Benefit-driven.", example: "SEO Agency Atlanta | Data-Driven Results | MarketWake" },
  { element: "Meta Description", best: "150-160 characters. Keyword + CTA. Compelling summary.", example: "MarketWake delivers measurable SEO results for Atlanta businesses. See how we grew organic traffic 340% in 6 months. Get a free audit." },
  { element: "H1 Tag", best: "One per page. Contains primary keyword. Clear topic signal.", example: "How to Choose an SEO Agency That Actually Delivers Results" },
  { element: "URL Structure", best: "Short, lowercase, hyphenated. Contains primary keyword.", example: "/blog/choose-seo-agency-that-delivers" },
  { element: "Image Alt Text", best: "Descriptive. Include keyword naturally. Under 125 characters.", example: "MarketWake SEO dashboard showing 340% organic traffic increase" },
  { element: "Internal Links", best: "2-3 minimum per page. Descriptive anchor text. Link to relevant service/blog pages.", example: "Learn more about our SEO services or read our guide to technical SEO." },
];

// ─── Stop Slop Types ───

interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  findings: string[];
}

interface Highlight {
  type: 'positive' | 'warning' | 'critical';
  message: string;
}

interface InlineAnnotation {
  text: string;
  startIndex: number;
  endIndex: number;
  type: 'critical' | 'warning' | 'suggestion';
  category: string;
  issue: string;
  fix: string;
}

interface AnalysisResult {
  overallScore: number;
  categories: CategoryScore[];
  highlights: Highlight[];
  summary: string;
  annotations: InlineAnnotation[];
}

interface GradeRecord {
  id: string;
  fileName: string;
  score: number;
  date: string;
  result: AnalysisResult;
  source: 'document' | 'url';
  url?: string;
  documentText?: string;
}

// ─── Stop Slop Helpers ───

function getScoreColor(score: number, dark: boolean): string {
  if (score >= 80) return dark ? '#22c55e' : '#16a34a';
  if (score >= 60) return '#3b82f6';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
}

function getScoreHex(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#3b82f6';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

function getCategoryBarColor(score: number, max: number): string {
  const pct = (score / max) * 100;
  return getScoreHex(pct);
}

function getAnnotationColor(type: string): { bg: string; border: string; text: string } {
  switch (type) {
    case 'critical':
      return { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#ef4444' };
    case 'warning':
      return { bg: 'rgba(234, 179, 8, 0.15)', border: '#eab308', text: '#eab308' };
    default:
      return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#3b82f6' };
  }
}

// ─── Educational content for each category ───

const CATEGORY_EDUCATION: Record<string, { whatWeLookFor: string; whyItMatters: string; goodExample: string; badExample: string; tips: string[] }> = {
  'Front-Loading (Ski Ramp)': {
    whatWeLookFor: 'We check if your main topic, key definitions, and conclusions appear in the first 20-30% of your content. LLMs heavily weight the top of the page when deciding what to cite.',
    whyItMatters: '44.2% of all LLM citations come from the first 30% of a page. This pattern (called the "Ski Ramp") is stable across 1.2M verified citations. If your key points are buried at the bottom, LLMs will likely never cite them.',
    goodExample: 'Programmatic SEO is the process of using automation to create large volumes of search-optimized pages. It combines data sources, templates, and keyword research to generate pages at scale.',
    badExample: 'In today\'s ever-evolving digital landscape, businesses are constantly looking for new ways to grow their online presence. One approach that has gained significant traction is...',
    tips: [
      'Define your topic in the first 1-2 paragraphs',
      'State your conclusion or key takeaway early, not at the end',
      'Eliminate long narrative intros and throat-clearing',
      'Put your most entity-rich, definitive content up front',
    ],
  },
  'Definitive Language': {
    whatWeLookFor: 'We scan for direct, factual statements that clearly define concepts. We also flag vague filler phrases and hype language that weaken citation potential.',
    whyItMatters: 'Definitive statements are nearly 2x more likely to be cited by LLMs (36.2% vs 20.2%). LLMs reward direct relationships between concepts because they need clear, extractable facts.',
    goodExample: 'Programmatic SEO is the process of using templates and databases to generate search-optimized pages at scale. It is used by companies like Zillow, TripAdvisor, and Yelp.',
    badExample: 'In today\'s fast-paced world, many businesses are starting to think about maybe exploring what some experts might call a more automated approach to SEO.',
    tips: [
      'Use "X is..." and "X refers to..." patterns',
      'Remove hedging words: "might", "perhaps", "could be", "arguably"',
      'Cut filler phrases like "it goes without saying" or "as we all know"',
      'Replace promotional hype with measured, specific claims',
    ],
  },
  'Question + Answer Structure': {
    whatWeLookFor: 'We check if your headings (especially H2s) are framed as questions, and whether the paragraph immediately following each question heading provides a direct answer.',
    whyItMatters: 'Content with questions is 2x more likely to be cited (18.5% vs 9.5%). 78% of cited questions come from headings. LLMs treat headers like prompts and the following paragraph like the answer.',
    goodExample: 'H2: What Is Programmatic SEO?\nProgrammatic SEO is the practice of generating large numbers of search-optimized web pages using automation, templates, and structured data.',
    badExample: 'H2: Programmatic SEO\nLet\'s dive into this topic and explore what makes it so interesting for marketers today. There are many facets to consider...',
    tips: [
      'Structure H2s as real user queries: "What is X?", "How does X work?"',
      'Immediately answer in the first sentence after the heading',
      'Mirror key entities between the heading and the answer paragraph',
      'Aim for 50%+ of your headings to be question-based',
    ],
  },
  'Entity Richness': {
    whatWeLookFor: 'We measure entity density - the ratio of named entities (brands, tools, frameworks, statistics, proper nouns) to total words. We check for variety across entity types.',
    whyItMatters: 'Cited text has an average entity density of 20.6%, compared to just 5-8% in normal English text. Specific brands, tools, frameworks, and named concepts dramatically increase citation likelihood. Generic advice gets ignored.',
    goodExample: 'Google Search Console, Ahrefs, and Screaming Frog are the three primary tools used in technical SEO audits. According to a 2024 Semrush study, 68% of enterprise sites use at least two of these tools.',
    badExample: 'There are many tools available for doing SEO audits. Using the right tools can help you find issues and improve your site\'s performance in search results.',
    tips: [
      'Name specific tools, brands, and frameworks instead of saying "many tools"',
      'Include statistics and data points with sources',
      'Reference specific people, companies, or industry terms',
      'Replace "best practices" with named, concrete examples',
    ],
  },
  'Balanced Sentiment': {
    whatWeLookFor: 'We measure subjectivity score (target: ~0.47) and scan for hype/promotional language. We also check for balanced perspective with contrasting viewpoints.',
    whyItMatters: 'LLMs prefer an analyst tone: not purely objective, not overly emotional. The ideal is fact + interpretation. Cited text has a balanced subjectivity score around 0.47. Promotional or hype-heavy content gets deprioritized.',
    goodExample: 'React is the most widely-adopted frontend framework, used by 40% of developers according to the 2024 Stack Overflow survey. However, Svelte and Vue offer smaller bundle sizes, which can benefit performance-critical applications.',
    badExample: 'React is the most AMAZING, revolutionary, game-changing framework ever created! It will absolutely skyrocket your development speed and blow your mind!',
    tips: [
      'Combine facts with applied insight (analyst tone)',
      'Remove hype words: "amazing", "revolutionary", "game-changing"',
      'Include balanced perspective: "however", "on the other hand"',
      'Present trade-offs and comparisons, not just praise',
    ],
  },
  'Business-Grade Writing': {
    whatWeLookFor: 'We measure Flesch-Kincaid grade level (target: ~16), average sentence length, paragraph structure, and use of structured lists.',
    whyItMatters: 'Cited text has a Flesch-Kincaid grade of ~16 (business-grade), while non-cited text averages 19.1 (too academic). Clear subject-verb-object structures win. 53% of citations come from mid-paragraph, so paragraphs need substance.',
    goodExample: 'Technical SEO audits should cover three areas: crawlability, indexation, and page speed. Crawlability issues prevent search engines from discovering your content. Use Screaming Frog to identify broken links, redirect chains, and orphan pages.',
    badExample: 'The multifaceted and complex nature of technical search engine optimization necessitates a comprehensive, holistic, and systematically-structured approach to the identification, analysis, and remediation of various technical impediments.',
    tips: [
      'Aim for 12-22 words per sentence (moderate length)',
      'Use clear subject-verb-object sentence structures',
      'Keep paragraphs between 30-80 words with substantive content',
      'Use bullet points and numbered lists for key information',
    ],
  },
  'Technical SEO & Schema': {
    whatWeLookFor: 'We check for JSON-LD schema markup, meta description length (120-160 chars), canonical URL, Open Graph tags, and page title presence.',
    whyItMatters: 'Schema markup helps LLMs classify and trust your content. FAQ, HowTo, and Article schema types are especially valuable. Meta descriptions and OG tags provide additional context for content understanding.',
    goodExample: 'A page with Article schema, FAQ schema for common questions, a 150-character meta description, canonical URL, and complete Open Graph tags (og:title, og:description, og:type, og:image).',
    badExample: 'A page with no structured data, no meta description, missing canonical URL, and no Open Graph tags.',
    tips: [
      'Add JSON-LD Article or BlogPosting schema to every content page',
      'Add FAQ schema for question-answer sections',
      'Write meta descriptions between 120-160 characters',
      'Set canonical URLs and complete Open Graph tags',
    ],
  },
};

// ─── Score Circle (Stop Slop) ───

function SSScoreCircle({ score, size = 180, dark }: { score: number; size?: number; dark: boolean }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const hex = getScoreHex(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={dark ? '#1e293b' : '#e2e8f0'} strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={hex} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: dark ? `drop-shadow(0 0 8px ${hex}40)` : 'none' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold" style={{ color: hex }}>{score}</span>
        <span className="text-sm font-medium mt-1" style={{ color: dark ? '#94a3b8' : '#64748b' }}>{getScoreLabel(score)}</span>
      </div>
    </div>
  );
}

// ─── Mini Score (Stop Slop) ───

function SSMiniScore({ score, size = 44, dark }: { score: number; size?: number; dark: boolean }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const hex = getScoreHex(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={dark ? '#1e293b' : '#e2e8f0'} strokeWidth="3" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={hex} strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <span className="absolute text-xs font-bold" style={{ color: hex }}>{score}</span>
    </div>
  );
}

// ─── Back Button (Stop Slop) ───

function SSBackButton({ onClick, label, dark }: { onClick: () => void; label: string; dark: boolean }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 flex items-center gap-2 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
      style={{
        background: dark ? '#1a2234' : '#f1f5f9',
        color: dark ? '#94a3b8' : '#64748b',
        border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      {label}
    </button>
  );
}

// ─── Recommendations View (Stop Slop) ───

function SSRecommendationsView({
  result,
  documentText,
  onBack,
  filterCategory,
  dark,
}: {
  result: AnalysisResult;
  documentText: string;
  onBack: () => void;
  filterCategory?: string;
  dark: boolean;
}) {
  const [expandedAnnotation, setExpandedAnnotation] = useState<number | null>(null);

  const annotations = filterCategory
    ? result.annotations.filter((a) => a.category === filterCategory)
    : result.annotations;

  const renderAnnotatedDoc = () => {
    if (!documentText || annotations.length === 0) {
      return (
        <div className="p-6 text-center" style={{ color: dark ? '#475569' : '#94a3b8' }}>
          {annotations.length === 0
            ? 'No specific inline issues found for this category.'
            : 'No document text available.'}
        </div>
      );
    }

    const paragraphs = documentText.split(/\n\n+/).filter((p) => p.trim().length > 0);
    if (paragraphs.length === 0) {
      const lines = documentText.split(/\n/).filter((l) => l.trim().length > 0);
      return renderParagraphsWithAnnotations(lines);
    }
    return renderParagraphsWithAnnotations(paragraphs);
  };

  const renderParagraphsWithAnnotations = (paragraphs: string[]) => {
    let runningIndex = 0;

    return paragraphs.map((para, pIdx) => {
      const paraStart = documentText.indexOf(para, runningIndex);
      const paraEnd = paraStart + para.length;
      runningIndex = paraEnd;

      const paraAnnotations = annotations.filter(
        (a) => a.startIndex < paraEnd && a.endIndex > paraStart
      );

      if (paraAnnotations.length === 0) {
        return (
          <p key={pIdx} className="mb-4 text-sm leading-relaxed" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
            {para}
          </p>
        );
      }

      const elements: React.ReactNode[] = [];
      let cursor = 0;

      for (const ann of paraAnnotations) {
        const relStart = Math.max(0, ann.startIndex - paraStart);
        const relEnd = Math.min(para.length, ann.endIndex - paraStart);

        if (relStart > cursor) {
          elements.push(
            <span key={`t-${cursor}`} style={{ color: dark ? '#94a3b8' : '#64748b' }}>
              {para.substring(cursor, relStart)}
            </span>
          );
        }

        const annIdx = annotations.indexOf(ann);
        const colors = getAnnotationColor(ann.type);
        const isExpanded = expandedAnnotation === annIdx;

        elements.push(
          <span key={`a-${annIdx}`} className="relative inline">
            <span
              onClick={() => setExpandedAnnotation(isExpanded ? null : annIdx)}
              className="cursor-pointer rounded px-0.5"
              style={{
                background: colors.bg,
                borderBottom: `2px solid ${colors.border}`,
              }}
            >
              {para.substring(relStart, relEnd)}
            </span>
            {isExpanded && (
              <span
                className="block mt-2 mb-3 p-4 rounded-lg text-sm"
                style={{
                  background: dark ? '#111827' : '#ffffff',
                  border: `1px solid ${colors.border}`,
                }}
              >
                <span className="flex items-center gap-2 mb-2">
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: colors.border }}
                  />
                  <span className="font-semibold text-xs uppercase" style={{ color: colors.text }}>
                    {ann.type === 'critical' ? 'Fix Required' : ann.type === 'warning' ? 'Warning' : 'Suggestion'}
                  </span>
                  <span className="text-xs" style={{ color: dark ? '#475569' : '#94a3b8' }}>
                    {ann.category}
                  </span>
                </span>
                <span className="block mb-2" style={{ color: dark ? '#ffffff' : '#0f172a' }}>
                  {ann.issue}
                </span>
                <span className="block p-3 rounded" style={{ background: dark ? '#1a2234' : '#f1f5f9' }}>
                  <span className="text-xs font-semibold block mb-1" style={{ color: '#22c55e' }}>
                    How to fix:
                  </span>
                  <span style={{ color: dark ? '#ffffff' : '#0f172a' }}>{ann.fix}</span>
                </span>
              </span>
            )}
          </span>
        );

        cursor = relEnd;
      }

      if (cursor < para.length) {
        elements.push(
          <span key={`t-end`} style={{ color: dark ? '#94a3b8' : '#64748b' }}>
            {para.substring(cursor)}
          </span>
        );
      }

      return (
        <p key={pIdx} className="mb-4 text-sm leading-relaxed">
          {elements}
        </p>
      );
    });
  };

  const criticalCount = annotations.filter((a) => a.type === 'critical').length;
  const warningCount = annotations.filter((a) => a.type === 'warning').length;
  const suggestionCount = annotations.filter((a) => a.type === 'suggestion').length;

  return (
    <div>
      <SSBackButton onClick={onBack} label={filterCategory ? 'Back to Category' : 'Back to Results'} dark={dark} />

      <div className="rounded-xl p-6 mb-6" style={{ background: dark ? '#111827' : '#ffffff', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}` }}>
        <h2 className="text-xl font-bold mb-2" style={{ color: dark ? '#ffffff' : '#0f172a' }}>
          {filterCategory ? `${filterCategory} - In Your Document` : 'Document Recommendations'}
        </h2>
        <p className="text-sm mb-4" style={{ color: dark ? '#94a3b8' : '#64748b' }}>
          Click any highlighted text to see the issue and how to fix it.
        </p>
        <div className="flex gap-4 text-xs">
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ef4444' }} />
              <span style={{ color: dark ? '#ffffff' : '#0f172a' }}>{criticalCount} critical</span>
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#eab308' }} />
              <span style={{ color: dark ? '#ffffff' : '#0f172a' }}>{warningCount} warning{warningCount > 1 ? 's' : ''}</span>
            </span>
          )}
          {suggestionCount > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#3b82f6' }} />
              <span style={{ color: dark ? '#ffffff' : '#0f172a' }}>{suggestionCount} suggestion{suggestionCount > 1 ? 's' : ''}</span>
            </span>
          )}
          {annotations.length === 0 && (
            <span style={{ color: '#22c55e' }}>No issues found</span>
          )}
        </div>
      </div>

      {/* Annotation list (quick jump) */}
      {annotations.length > 0 && (
        <div className="rounded-xl p-4 mb-6" style={{ background: dark ? '#111827' : '#ffffff', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}` }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: dark ? '#ffffff' : '#0f172a' }}>All Issues</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {annotations.map((ann, i) => {
              const colors = getAnnotationColor(ann.type);
              return (
                <button
                  key={i}
                  onClick={() => setExpandedAnnotation(expandedAnnotation === i ? null : i)}
                  className="w-full text-left p-3 rounded-lg flex items-start gap-3 text-sm transition-colors"
                  style={{
                    background: expandedAnnotation === i ? colors.bg : (dark ? '#1a2234' : '#f1f5f9'),
                    border: expandedAnnotation === i ? `1px solid ${colors.border}` : '1px solid transparent',
                  }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: colors.border }} />
                  <span className="flex-1 min-w-0">
                    <span className="block font-medium truncate" style={{ color: dark ? '#ffffff' : '#0f172a' }}>
                      &quot;{ann.text}&quot;
                    </span>
                    <span className="block text-xs mt-0.5" style={{ color: dark ? '#475569' : '#94a3b8' }}>
                      {ann.issue.substring(0, 80)}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Annotated document */}
      <div className="rounded-xl p-6" style={{ background: dark ? '#111827' : '#ffffff', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}` }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: dark ? '#475569' : '#94a3b8' }}>
          YOUR DOCUMENT
        </h3>
        <div className="prose-sm">{renderAnnotatedDoc()}</div>
      </div>
    </div>
  );
}

// ─── Category Detail View (Stop Slop) ───

function SSCategoryDetail({
  category,
  annotations,
  documentText,
  onBack,
  onViewInDoc,
  dark,
}: {
  category: CategoryScore;
  annotations: InlineAnnotation[];
  documentText: string;
  onBack: () => void;
  onViewInDoc: () => void;
  dark: boolean;
}) {
  const pct = Math.round((category.score / category.maxScore) * 100);
  const categoryAnnotations = annotations.filter((a) => a.category === category.name);
  const education = CATEGORY_EDUCATION[category.name];

  return (
    <div>
      <SSBackButton onClick={onBack} label="Back to Results" dark={dark} />

      <div className="rounded-xl p-8" style={{ background: dark ? '#111827' : '#ffffff', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}` }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{category.name}</h2>
            <p style={{ color: dark ? '#94a3b8' : '#64748b' }} className="mt-1">{category.description}</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold" style={{ color: getScoreHex(pct) }}>{category.score}</span>
            <span style={{ color: dark ? '#475569' : '#94a3b8' }} className="text-lg">/{category.maxScore}</span>
          </div>
        </div>

        <div className="mb-8 rounded-full overflow-hidden" style={{ height: '12px', background: dark ? '#1e293b' : '#e2e8f0' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: getCategoryBarColor(category.score, category.maxScore) }} />
        </div>

        {/* Educational section */}
        {education && (
          <div className="mb-8 p-5 rounded-xl" style={{ background: dark ? '#1a2234' : '#f1f5f9', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}` }}>
            <h3 className="text-sm font-bold uppercase mb-3" style={{ color: '#3b82f6' }}>What We Look For</h3>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{education.whatWeLookFor}</p>

            <h4 className="text-sm font-bold uppercase mb-2" style={{ color: '#3b82f6' }}>Why It Matters</h4>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{education.whyItMatters}</p>

            <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#22c55e' }}>Good Example</p>
                <p className="text-xs italic leading-relaxed" style={{ color: dark ? '#94a3b8' : '#64748b' }}>&quot;{education.goodExample}&quot;</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <p className="text-xs font-bold mb-1" style={{ color: '#ef4444' }}>Bad Example</p>
                <p className="text-xs italic leading-relaxed" style={{ color: dark ? '#94a3b8' : '#64748b' }}>&quot;{education.badExample}&quot;</p>
              </div>
            </div>

            <h4 className="text-sm font-bold uppercase mt-4 mb-2" style={{ color: '#3b82f6' }}>Tips</h4>
            <ul className="space-y-1.5">
              {education.tips.map((tip, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span style={{ color: '#3b82f6' }}>&#8226;</span>
                  <span style={{ color: dark ? '#ffffff' : '#0f172a' }}>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Findings */}
        <h3 className="text-lg font-semibold mb-4" style={{ color: dark ? '#ffffff' : '#0f172a' }}>Your Results</h3>
        <div className="space-y-3 mb-8">
          {category.findings.map((finding, i) => {
            const isPositive = /\b(good|strong|excellent|clean|avoids|balanced|contains|uses)\b/i.test(finding);
            const isNegative = /\b(no |low|only|limited|excessive|too |eliminate|remove|very low|missing)\b/i.test(finding);

            return (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: dark ? '#1a2234' : '#f1f5f9' }}>
                <span className="mt-0.5 flex-shrink-0">
                  {isPositive ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  ) : isNegative ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                  )}
                </span>
                <span className="text-sm leading-relaxed" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{finding}</span>
              </div>
            );
          })}
        </div>

        {/* Specific quotes from the document */}
        {categoryAnnotations.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mb-4" style={{ color: dark ? '#ffffff' : '#0f172a' }}>Found in Your Document</h3>
            <div className="space-y-4 mb-6">
              {categoryAnnotations.map((ann, i) => {
                const colors = getAnnotationColor(ann.type);
                return (
                  <div key={i} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${colors.border}` }}>
                    <div className="p-4" style={{ background: colors.bg }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: colors.border }} />
                        <span className="text-xs font-semibold uppercase" style={{ color: colors.text }}>
                          {ann.type}
                        </span>
                      </div>
                      <p className="text-sm italic" style={{ color: dark ? '#ffffff' : '#0f172a' }}>
                        &quot;{ann.text}&quot;
                      </p>
                    </div>
                    <div className="p-4" style={{ background: dark ? '#111827' : '#ffffff' }}>
                      <p className="text-sm mb-3" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{ann.issue}</p>
                      <div className="p-3 rounded" style={{ background: dark ? '#1a2234' : '#f1f5f9' }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: '#22c55e' }}>How to fix:</p>
                        <p className="text-sm" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{ann.fix}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {documentText && (
              <button
                onClick={onViewInDoc}
                className="w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors text-white"
                style={{ background: '#3b82f6' }}
              >
                View All Issues in Document
              </button>
            )}
          </>
        )}

        {categoryAnnotations.length === 0 && documentText && (
          <div className="text-center p-6 rounded-lg" style={{ background: dark ? '#1a2234' : '#f1f5f9' }}>
            <p className="text-sm" style={{ color: dark ? '#475569' : '#94a3b8' }}>
              No specific inline issues found for this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Results View (Stop Slop) ───

function SSResultsView({
  result,
  fileName,
  documentText,
  onBack,
  onRegrade,
  dark,
}: {
  result: AnalysisResult;
  fileName: string;
  documentText: string;
  onBack: () => void;
  onRegrade: () => void;
  dark: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryScore | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recFilterCategory, setRecFilterCategory] = useState<string | undefined>(undefined);

  if (showRecommendations) {
    return (
      <SSRecommendationsView
        result={result}
        documentText={documentText}
        filterCategory={recFilterCategory}
        dark={dark}
        onBack={() => {
          if (recFilterCategory) {
            setRecFilterCategory(undefined);
            setShowRecommendations(false);
          } else {
            setShowRecommendations(false);
          }
        }}
      />
    );
  }

  if (selectedCategory) {
    return (
      <SSCategoryDetail
        category={selectedCategory}
        annotations={result.annotations || []}
        documentText={documentText}
        onBack={() => setSelectedCategory(null)}
        onViewInDoc={() => {
          setRecFilterCategory(selectedCategory.name);
          setShowRecommendations(true);
        }}
        dark={dark}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium rounded-lg px-4 py-2 transition-colors"
          style={{
            background: dark ? '#1a2234' : '#f1f5f9',
            color: dark ? '#94a3b8' : '#64748b',
            border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Back
        </button>
        <button
          onClick={onRegrade}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ background: '#3b82f6' }}
        >
          Re-Grade Updated Copy
        </button>
      </div>

      {/* Score header */}
      <div className="rounded-xl p-8 text-center mb-8" style={{ background: dark ? '#111827' : '#ffffff', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}` }}>
        <p style={{ color: dark ? '#94a3b8' : '#64748b' }} className="mb-2 text-sm">{fileName}</p>
        <SSScoreCircle score={result.overallScore} dark={dark} />
        <p style={{ color: dark ? '#94a3b8' : '#64748b' }} className="mt-4 max-w-xl mx-auto text-sm leading-relaxed">{result.summary}</p>
      </div>

      {/* See Recommendations button */}
      {documentText && result.annotations && result.annotations.length > 0 && (
        <button
          onClick={() => {
            setRecFilterCategory(undefined);
            setShowRecommendations(true);
          }}
          className="w-full mb-8 p-4 rounded-xl flex items-center justify-between group"
          style={{
            background: dark ? '#111827' : '#ffffff',
            border: '1px solid #3b82f6',
          }}
        >
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <div className="text-left">
              <p className="font-semibold text-sm" style={{ color: dark ? '#ffffff' : '#0f172a' }}>See Recommendations in Document</p>
              <p className="text-xs" style={{ color: dark ? '#475569' : '#94a3b8' }}>
                {result.annotations.length} issues highlighted directly in your copy
              </p>
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Highlights */}
      {result.highlights.length > 0 && (
        <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {result.highlights.map((h, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex items-start gap-3"
              style={{
                background: dark ? '#111827' : '#ffffff',
                border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
                borderLeftWidth: '3px',
                borderLeftColor: h.type === 'positive' ? '#22c55e' : h.type === 'warning' ? '#eab308' : '#ef4444',
              }}
            >
              <span className="text-sm" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{h.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Category scores */}
      <h3 className="text-lg font-semibold mb-4" style={{ color: dark ? '#ffffff' : '#0f172a' }}>Score Breakdown</h3>
      <div className="space-y-3">
        {result.categories.map((cat) => {
          const pct = Math.round((cat.score / cat.maxScore) * 100);
          const catAnnotations = (result.annotations || []).filter((a) => a.category === cat.name);
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat)}
              className="rounded-xl p-5 w-full text-left flex items-center gap-5 group transition-colors"
              style={{
                background: dark ? '#111827' : '#ffffff',
                border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
              }}
            >
              <SSMiniScore score={pct} dark={dark} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{cat.name}</span>
                  <span className="flex items-center gap-2">
                    {catAnnotations.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                        {catAnnotations.length} issue{catAnnotations.length > 1 ? 's' : ''}
                      </span>
                    )}
                    <span style={{ color: dark ? '#475569' : '#94a3b8' }} className="text-sm">{cat.score}/{cat.maxScore}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: dark ? '#1e293b' : '#e2e8f0' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: getCategoryBarColor(cat.score, cat.maxScore) }} />
                </div>
                <p style={{ color: dark ? '#475569' : '#94a3b8' }} className="text-xs mt-2 truncate">{cat.description}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dark ? '#475569' : '#94a3b8'} strokeWidth="2" className="flex-shrink-0 group-hover:translate-x-1 transition-transform"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── History Item (Stop Slop) ───

function SSHistoryItem({
  record,
  onOpen,
  onDelete,
  onRename,
  dark,
}: {
  record: GradeRecord;
  onOpen: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
  dark: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(record.fileName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = editName.trim();
    if (trimmed) onRename(trimmed);
    setEditing(false);
  };

  return (
    <div
      className="flex items-center gap-4 rounded-xl p-4 transition-colors"
      style={{
        background: dark ? '#111827' : '#ffffff',
        border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`,
      }}
    >
      <button className="flex-1 flex items-center gap-4 text-left" onClick={onOpen}>
        <SSMiniScore score={record.score} dark={dark} />
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
              onClick={(e) => e.stopPropagation()}
              className="w-full text-sm font-medium px-2 py-1 rounded"
              style={{ background: dark ? '#1a2234' : '#f1f5f9', border: '1px solid #3b82f6', color: dark ? '#ffffff' : '#0f172a', outline: 'none' }}
            />
          ) : (
            <p className="font-medium text-sm truncate" style={{ color: dark ? '#ffffff' : '#0f172a' }}>{record.fileName}</p>
          )}
          <p style={{ color: dark ? '#475569' : '#94a3b8' }} className="text-xs">{record.date} &middot; {record.source === 'url' ? 'URL' : 'Document'}</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={dark ? '#475569' : '#94a3b8'} strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setEditName(record.fileName); setEditing(true); }}
        className="flex-shrink-0 p-1 rounded hover:bg-blue-500/10"
        title="Rename"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? '#475569' : '#94a3b8'} strokeWidth="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex-shrink-0 p-1 rounded hover:bg-red-500/10" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={dark ? '#475569' : '#94a3b8'} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
    </div>
  );
}

// ─── Stop Slop Tab ───

function StopSlopTab({ dark }: { dark: boolean }) {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [view, setView] = useState<'home' | 'results'>('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [url, setUrl] = useState('');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentDocText, setCurrentDocText] = useState('');
  const [history, setHistory] = useState<GradeRecord[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('mw-stopslop-history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mw-stopslop-history', JSON.stringify(history));
  }, [history]);

  const saveToHistory = useCallback(
    (result: AnalysisResult, fileName: string, source: 'document' | 'url', docText: string, urlValue?: string) => {
      const record: GradeRecord = {
        id: Date.now().toString(),
        fileName,
        score: result.overallScore,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        result,
        source,
        url: urlValue,
        documentText: docText,
      };
      setHistory((prev) => [record, ...prev]);
    },
    []
  );

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError('');
    try {
      const text = await file.text();
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const parsed = (ext === 'html' || ext === 'htm') ? parseHTML(text) : parseText(text, file.name);
      if (!parsed.text || parsed.text.trim().length === 0) {
        setError('Could not extract text from the file');
        return;
      }
      const result = analyzeContent(parsed);
      setCurrentResult(result);
      setCurrentFileName(file.name);
      setCurrentDocText(parsed.text);
      saveToHistory(result, file.name, 'document', parsed.text);
      setView('results');
    } catch {
      setError('Failed to analyze the file.');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlAnalyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url.trim())}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const html = await res.text();
      const parsed = parseHTML(html);
      if (!parsed.text || parsed.text.trim().length === 0) {
        setError('Could not extract text from the URL');
        return;
      }
      const result = analyzeContent(parsed);
      setCurrentResult(result);
      setCurrentFileName(url.trim());
      setCurrentDocText(parsed.text);
      saveToHistory(result, url.trim(), 'url', parsed.text, url.trim());
      setView('results');
    } catch {
      setError('Could not fetch that URL. Try uploading the page content as an HTML file instead.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); const file = e.dataTransfer.files[0]; if (file) handleFileUpload(file); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file); };

  const openHistoryItem = (record: GradeRecord) => {
    setCurrentResult(record.result);
    setCurrentFileName(record.fileName);
    setCurrentDocText(record.documentText || '');
    setView('results');
  };

  const deleteHistoryItem = (id: string) => { setHistory((prev) => prev.filter((r) => r.id !== id)); };
  const clearHistory = () => { setHistory([]); };
  const renameHistoryItem = (id: string, newName: string) => {
    setHistory((prev) => prev.map((r) => r.id === id ? { ...r, fileName: newName } : r));
  };

  // Results view
  if (view === 'results' && currentResult) {
    return (
      <div>
        <SSResultsView
          result={currentResult}
          fileName={currentFileName}
          documentText={currentDocText}
          onBack={() => setView('home')}
          onRegrade={() => { setView('home'); setCurrentResult(null); }}
          dark={dark}
        />
      </div>
    );
  }

  // Home view
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-4xl font-black tracking-tighter mb-2" style={{ color: dark ? '#ffffff' : '#0f172a' }}>STOPSLOP</h2>
        <p style={{ color: dark ? '#94a3b8' : '#64748b' }} className="text-sm max-w-md mx-auto">
          Grade your content for LLM citation readiness. Audit copy before it goes live.
        </p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 p-1 rounded-lg mx-auto w-fit" style={{ background: dark ? '#1a2234' : '#f1f5f9' }}>
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors`}
          style={{
            background: tab === 'upload' ? (dark ? '#111827' : '#ffffff') : 'transparent',
            color: tab === 'upload' ? (dark ? '#ffffff' : '#0f172a') : (dark ? '#94a3b8' : '#64748b'),
            boxShadow: tab === 'upload' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}
          onClick={() => setTab('upload')}
        >
          Upload Document
        </button>
        <button
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors`}
          style={{
            background: tab === 'url' ? (dark ? '#111827' : '#ffffff') : 'transparent',
            color: tab === 'url' ? (dark ? '#ffffff' : '#0f172a') : (dark ? '#94a3b8' : '#64748b'),
            boxShadow: tab === 'url' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}
          onClick={() => setTab('url')}
        >
          Analyze URL
        </button>
      </div>

      {tab === 'upload' ? (
        <div
          className={`rounded-xl p-12 text-center cursor-pointer transition-all ${dragging ? 'scale-[1.02]' : ''}`}
          style={{
            background: dark ? '#111827' : '#ffffff',
            border: `2px dashed ${dragging ? '#3b82f6' : (dark ? '#1e293b' : '#e2e8f0')}`,
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" accept=".docx,.doc,.html,.htm,.txt,.md" onChange={handleFileSelect} className="hidden" />
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={dark ? '#475569' : '#94a3b8'} strokeWidth="1.5" className="mx-auto mb-4">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="font-semibold mb-1" style={{ color: dark ? '#ffffff' : '#0f172a' }}>
            {loading ? 'Analyzing...' : 'Drop your file here or click to upload'}
          </p>
          <p style={{ color: dark ? '#475569' : '#94a3b8' }} className="text-sm">Supports .docx, .html, .txt, .md</p>
        </div>
      ) : (
        <div className="rounded-xl p-6" style={{ background: dark ? '#111827' : '#ffffff', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}` }}>
          <label className="block text-sm font-medium mb-2" style={{ color: dark ? '#94a3b8' : '#64748b' }}>Page URL</label>
          <div className="flex gap-3">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/your-page"
              className="flex-1 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: dark ? '#1a2234' : '#f1f5f9', border: `1px solid ${dark ? '#1e293b' : '#e2e8f0'}`, color: dark ? '#ffffff' : '#0f172a' }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUrlAnalyze(); }}
            />
            <button
              onClick={handleUrlAnalyze}
              disabled={loading || !url.trim()}
              className="rounded-lg px-6 py-3 text-sm font-medium text-white transition-colors whitespace-nowrap"
              style={{
                background: loading || !url.trim() ? (dark ? '#1a2234' : '#e2e8f0') : '#3b82f6',
                color: loading || !url.trim() ? (dark ? '#475569' : '#94a3b8') : '#ffffff',
                cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          <p style={{ color: dark ? '#475569' : '#94a3b8' }} className="text-xs mt-2">Also checks schema markup, meta tags, and Open Graph data</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg text-sm" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: dark ? '#1e293b' : '#e2e8f0', borderTopColor: '#3b82f6' }} />
          <p style={{ color: dark ? '#94a3b8' : '#64748b' }} className="mt-3 text-sm">Analyzing content against LLM citation criteria...</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: dark ? '#ffffff' : '#0f172a' }}>Past Grades</h3>
            <button onClick={clearHistory} className="text-xs" style={{ color: dark ? '#475569' : '#94a3b8' }}>Clear All</button>
          </div>
          <div className="space-y-2">
            {history.map((record) => (
              <SSHistoryItem
                key={record.id}
                record={record}
                onOpen={() => openHistoryItem(record)}
                onDelete={() => deleteHistoryItem(record.id)}
                onRename={(name) => renameHistoryItem(record.id, name)}
                dark={dark}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-center pt-8">
        <p style={{ color: dark ? '#475569' : '#94a3b8' }} className="text-xs">Grading criteria based on analysis of 1.2M verified ChatGPT citations</p>
      </div>
    </div>
  );
}

// ─── Main Page Export ───

export default function SEOToolsPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [keyword, setKeyword] = useState("");
  const [intent, setIntent] = useState("");
  const [persona, setPersona] = useState("");
  const [format, setFormat] = useState("");
  const [briefGenerated, setBriefGenerated] = useState(false);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const totalItems = auditChecklist.reduce((sum, cat) => sum + cat.items.length, 0);
  const seoCategories = auditChecklist.slice(0, 3);
  const aeoCategories = auditChecklist.slice(3);
  const seoChecked = seoCategories.reduce((sum, cat) => sum + cat.items.filter((item) => checkedItems[item]).length, 0);
  const seoTotal = seoCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const aeoChecked = aeoCategories.reduce((sum, cat) => sum + cat.items.filter((item) => checkedItems[item]).length, 0);
  const aeoTotal = aeoCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  const [activeTab, setActiveTab] = useState<"brief" | "audit" | "reference" | "grader">("brief");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dark ? "text-white" : "text-slate-900"}`}>SEO / AEO Tools</h1>
        <p className={`mt-1 text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Generate SEO briefs, run audits, grade content for LLM citation readiness (AEO), and reference on-page best practices</p>
      </div>

      {/* Tabs */}
      <div className={`mb-6 flex gap-1 rounded-lg p-1 w-fit ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
        {[
          { key: "brief" as const, label: "SEO Brief Generator" },
          { key: "audit" as const, label: "SEO Audit Checklist" },
          { key: "reference" as const, label: "On-Page Reference" },
          { key: "grader" as const, label: "Stop Slop" },
        ].map((tab) => (
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

      {/* Brief Generator Tab */}
      {activeTab === "brief" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>SEO Brief Generator</h2>

            <div className="space-y-4">
              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Primary Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., SEO agency Atlanta"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                />
              </div>

              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Search Intent</label>
                <div className="grid grid-cols-2 gap-2">
                  {intentOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIntent(opt)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                        intent === opt
                          ? dark
                            ? "border-blue-500 bg-blue-500/10 text-blue-400 ring-1 ring-blue-500"
                            : "border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500"
                          : dark
                            ? "border-[#2d3748] text-slate-400 hover:bg-[#1a2234]"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Target Persona</label>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="">Select persona...</option>
                  {personaOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`mb-1.5 block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>Content Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    dark ? "bg-[#1a2234] border-[#2d3748] text-white" : "bg-white border-slate-200 text-slate-900"
                  }`}
                >
                  <option value="">Select format...</option>
                  {formatOptions.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setBriefGenerated(true)}
                disabled={!keyword || !intent || !persona || !format}
                className={`w-full rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  keyword && intent && persona && format
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90"
                    : dark ? "bg-[#1a2234] text-slate-500 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Generate SEO Brief
              </button>
            </div>
          </div>

          {/* Generated Brief */}
          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>Generated Brief</h2>
            </div>
            {!briefGenerated ? (
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
                  <p className={`mt-1 text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}>{keyword}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Intent", value: intent },
                    { label: "Persona", value: persona },
                    { label: "Format", value: format },
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
                    {intent === "Informational" && `What to Know About ${keyword}: A Complete Guide`}
                    {intent === "Commercial" && `Best ${keyword} Services: How to Choose the Right Partner`}
                    {intent === "Transactional" && `${keyword} -- Get Results That Impact Your Bottom Line`}
                    {intent === "Navigational" && `${keyword} -- Expert Services from MarketWake`}
                  </p>
                </div>

                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Suggested Outline</p>
                  <div className="space-y-2">
                    {[
                      "H1: [Title with primary keyword]",
                      `H2: What Is ${keyword}? (Definition + Context)`,
                      `H2: Why ${keyword} Matters for ${persona}s`,
                      `H2: How MarketWake Approaches ${keyword}`,
                      "H2: Real Results: Client Case Study",
                      "H2: Common Mistakes to Avoid",
                      `H2: Getting Started with ${keyword}`,
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
                      `Include "${keyword}" in title, H1, first 100 words`,
                      "Meta description: 150-160 chars with keyword + CTA",
                      "URL: /blog/" + keyword.toLowerCase().replace(/\s+/g, "-"),
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

                <div className={`rounded-lg p-4 border ${
                  dark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-100"
                }`}>
                  <p className={`text-xs font-semibold mb-1 ${dark ? "text-blue-400" : "text-blue-700"}`}>Persona Note</p>
                  <p className={`text-sm ${dark ? "text-blue-300" : "text-blue-600"}`}>
                    {persona === "Business Owner" && "Keep language conversational. Lead with outcomes and ROI. Avoid marketing jargon."}
                    {persona === "Marketing Director" && "Use peer-level language. Include methodology and frameworks. More technical depth welcome."}
                    {persona === "Ecommerce Brand" && "Be specific about platforms and metrics (ROAS, CAC, LTV). Fast-paced, tactical, data-heavy."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Checklist Tab */}
      {activeTab === "audit" && (
        <div className="space-y-6">
          {/* Progress */}
          <div className={`rounded-xl border p-6 shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>Audit Progress</h2>
              <span className={`text-sm font-medium ${dark ? "text-slate-400" : "text-slate-500"}`}>{totalChecked} / {totalItems} completed</span>
            </div>
            <div className={`h-3 overflow-hidden rounded-full ${dark ? "bg-[#1a2234]" : "bg-slate-100"}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${totalItems > 0 ? (totalChecked / totalItems) * 100 : 0}%` }}
              />
            </div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700"}`}>SEO</span>
                <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{seoChecked} / {seoTotal}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${dark ? "bg-purple-500/10 text-purple-400" : "bg-purple-50 text-purple-700"}`}>AEO</span>
                <span className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{aeoChecked} / {aeoTotal}</span>
              </div>
            </div>
            {totalChecked === totalItems && totalItems > 0 && (
              <p className="mt-2 text-sm font-medium text-emerald-500">All checks passed. Content is SEO + AEO ready.</p>
            )}
          </div>

          {/* Traditional SEO Section Header */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${dark ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>Traditional SEO</span>
            <div className={`flex-1 h-px ${dark ? "bg-[#1e293b]" : "bg-slate-200"}`} />
          </div>

          {seoCategories.map((category) => (
            <div key={category.category} className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
              <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{category.category}</h2>
                  <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    {category.items.filter((item) => checkedItems[item]).length} / {category.items.length}
                  </span>
                </div>
              </div>
              <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-50"}`}>
                {category.items.map((item) => (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-center gap-3 px-6 py-3.5 transition-colors ${
                      dark ? "hover:bg-[#1a2234]" : "hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item]}
                      onChange={() => toggleCheck(item)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                    />
                    <span className={`text-sm ${
                      checkedItems[item]
                        ? dark ? "text-slate-500 line-through" : "text-slate-400 line-through"
                        : dark ? "text-slate-300" : "text-slate-700"
                    }`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* AEO Section Header */}
          <div className="flex items-center gap-3 mt-4">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${dark ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-purple-50 text-purple-700 border border-purple-200"}`}>AEO / LLM Citation Readiness</span>
            <div className={`flex-1 h-px ${dark ? "bg-[#1e293b]" : "bg-slate-200"}`} />
          </div>

          {aeoCategories.map((category) => (
            <div key={category.category} className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
              <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>{category.category}</h2>
                  <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    {category.items.filter((item) => checkedItems[item]).length} / {category.items.length}
                  </span>
                </div>
              </div>
              <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-50"}`}>
                {category.items.map((item) => (
                  <label
                    key={item}
                    className={`flex cursor-pointer items-center gap-3 px-6 py-3.5 transition-colors ${
                      dark ? "hover:bg-[#1a2234]" : "hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item]}
                      onChange={() => toggleCheck(item)}
                      className="h-4 w-4 rounded border-slate-300 text-purple-500 focus:ring-purple-500"
                    />
                    <span className={`text-sm ${
                      checkedItems[item]
                        ? dark ? "text-slate-500 line-through" : "text-slate-400 line-through"
                        : dark ? "text-slate-300" : "text-slate-700"
                    }`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* On-Page Reference Tab */}
      {activeTab === "reference" && (
        <div className="space-y-6">
          <div className={`rounded-xl border shadow-sm ${dark ? "bg-[#111827] border-[#1e293b]" : "bg-white border-slate-200"}`}>
            <div className={`border-b px-6 py-4 ${dark ? "border-[#1e293b]" : "border-slate-100"}`}>
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>On-Page SEO Reference</h2>
              <p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Quick reference for optimizing individual pages</p>
            </div>
            <div className={`divide-y ${dark ? "divide-[#1e293b]" : "divide-slate-100"}`}>
              {onPageReference.map((item) => (
                <div key={item.element} className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-700"
                    }`}>
                      {item.element}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${dark ? "text-slate-300" : "text-slate-600"}`}>{item.best}</p>
                  <div className={`rounded-lg px-4 py-2.5 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
                    <p className={`text-xs mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Example:</p>
                    <p className={`text-sm font-mono ${dark ? "text-slate-300" : "text-slate-600"}`}>{item.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reference Card */}
          <div className={`rounded-xl border p-6 ${
            dark ? "border-blue-500/20 bg-blue-500/5" : "border-blue-200 bg-blue-50"
          }`}>
            <h3 className={`text-sm font-bold mb-4 ${dark ? "text-blue-300" : "text-blue-900"}`}>MarketWake SEO Content Standards</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className={`text-xs font-semibold mb-2 ${dark ? "text-blue-400" : "text-blue-700"}`}>Always Include:</p>
                <ul className="space-y-1.5">
                  {[
                    "Primary keyword in title, H1, first 100 words",
                    "Meta description with keyword + CTA",
                    "2-3 internal links to MW pages",
                    "Descriptive image alt text",
                    "Subheadings every 200-300 words",
                    "Clear CTA at the end",
                  ].map((item, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${dark ? "text-blue-200" : "text-blue-800"}`}>
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={`text-xs font-semibold mb-2 ${dark ? "text-blue-400" : "text-blue-700"}`}>Never Do:</p>
                <ul className="space-y-1.5">
                  {[
                    "Keyword stuff (unnatural repetition)",
                    "Duplicate title tags across pages",
                    "Leave images without alt text",
                    "Publish thin content (under 500 words for blog posts)",
                    "Use generic meta descriptions",
                    "Ignore mobile formatting",
                  ].map((item, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${dark ? "text-blue-200" : "text-blue-800"}`}>
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stop Slop Tab */}
      {activeTab === "grader" && <StopSlopTab dark={dark} />}
    </div>
  );
}
