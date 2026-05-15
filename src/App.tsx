import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Bot,
  Brain,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Home,
  Info,
  Lightbulb,
  LockKeyhole,
  Menu,
  MessageCircle,
  Moon,
  Network,
  NotebookPen,
  Play,
  RefreshCw,
  Save,
  Send,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  companionApps,
  connectionLessons,
  domains,
  educationDisclaimer,
  glossary,
  investingDisclaimer,
  mentorSuggestions,
  sectionNav,
} from "./data";
import type { CompanionId, Domain, DomainId, Lesson, SectionId } from "./data";
import {
  allocationProfile,
  assetBehaviourSeries,
  behaviourGapSeries,
  clamp,
  compoundSeries,
  debtSeries,
  feeSeries,
  formatMoney,
  futureValue,
  inflationSeries,
  lifestyleSeries,
  machineScore,
  percent,
  simulateMachine,
} from "./finance";
import type { CurrencyCode, MachineInputs, MachinePoint } from "./finance";

const STORAGE_KEY = "complete-financial-education:v1";
const SHARED_PROFILE_KEY = "founder-suite:personal-profile:v1";
const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const ANTHROPIC_ENDPOINT = "https://api.anthropic.com/v1/messages";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type Profile = {
  name: string;
  country: string;
  currency: CurrencyCode;
  monthlyIncome: number;
  monthlyExpenses: number;
  emergencyReserve: number;
  investableAssets: number;
  businessValue: number;
  debtBalance: number;
  riskComfort: number;
  primaryGoal: string;
};

type Plan = {
  incomeEngines: string;
  keepingPlan: string;
  growthApproach: string;
  investmentPolicy: string;
  protectionChecklist: string;
  understandingNotes: string;
  connectionsMap: string;
  openQuestions: string;
  nextActions: string;
};

type SavedScenario = {
  id: string;
  name: string;
  createdAt: string;
  inputs: MachineInputs;
  summary: string;
};

type AppState = {
  version: 1;
  theme: "light" | "dark";
  acknowledgments: {
    education: boolean;
    investing: boolean;
  };
  profile: Profile;
  assessment: Record<DomainId, number>;
  progress: Record<string, boolean>;
  notes: Record<string, string>;
  bookmarks: Record<string, boolean>;
  plan: Plan;
  scenarios: SavedScenario[];
  mentor: {
    apiKey: string;
    messages: ChatMessage[];
  };
};

const domainById = Object.fromEntries(domains.map((domain) => [domain.id, domain])) as Record<DomainId, Domain>;

const defaultProfile: Profile = {
  name: "Founder",
  country: "United Kingdom",
  currency: "GBP",
  monthlyIncome: 9000,
  monthlyExpenses: 5200,
  emergencyReserve: 18000,
  investableAssets: 25000,
  businessValue: 150000,
  debtBalance: 12000,
  riskComfort: 55,
  primaryGoal: "Build durable wealth while growing a resilient business.",
};

const defaultPlan: Plan = {
  incomeEngines:
    "Current engine: active founder/operator income. Planned engines: productized business income, diversified portfolio income, and optional property or other assets only when understood.",
  keepingPlan:
    "Track monthly personal cash flow, protect a minimum emergency reserve, and pre-commit a share of every income increase to savings or investing before lifestyle expands.",
  growthApproach:
    "Learn investing from principles: compounding, diversification, low costs, asset allocation, behaviour, tax wrappers, and risk. No specific products are chosen inside this app.",
  investmentPolicy:
    "I will invest according to written rules, avoid product picking from hype, keep costs visible, diversify outside my business concentration, and consult qualified professionals before real decisions.",
  protectionChecklist:
    "Check emergency reserve, income concentration, insurance needs, legal structures, debt risk, fraud exposure, and whether the portfolio counterbalances the business.",
  understandingNotes:
    "Inflation is the baseline enemy. Interest rates are the price of money. Debt can be a tool or a trap. Cycles are normal, so resilience matters before stress arrives.",
  connectionsMap:
    "Earned income becomes retained surplus. Surplus becomes invested capital. Capital becomes a second income engine. Protection preserves the loop. Understanding improves every decision.",
  openQuestions:
    "Ask a qualified adviser/accountant about tax wrappers, pension strategy, insurance coverage, business structure, liquidity event planning, and jurisdiction-specific rules.",
  nextActions:
    "Complete the self-assessment, run the Machine Simulator with current numbers, write a first investment policy statement, and book professional review questions.",
};

const createDefaultState = (): AppState => ({
  version: 1,
  theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  acknowledgments: {
    education: false,
    investing: false,
  },
  profile: defaultProfile,
  assessment: {
    making: 72,
    keeping: 45,
    growing: 25,
    protecting: 35,
    understanding: 38,
  },
  progress: {},
  notes: {},
  bookmarks: {},
  plan: defaultPlan,
  scenarios: [],
  mentor: {
    apiKey: "",
    messages: [],
  },
});

const loadState = (): AppState => {
  const base = createDefaultState();
  try {
    const sharedProfileRaw = localStorage.getItem(SHARED_PROFILE_KEY);
    const sharedProfile = sharedProfileRaw ? (JSON.parse(sharedProfileRaw) as Partial<Profile>) : {};
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...base, profile: { ...base.profile, ...sharedProfile } };
    }
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...base,
      ...parsed,
      acknowledgments: { ...base.acknowledgments, ...parsed.acknowledgments },
      profile: { ...base.profile, ...sharedProfile, ...parsed.profile },
      assessment: { ...base.assessment, ...parsed.assessment },
      progress: parsed.progress ?? {},
      notes: parsed.notes ?? {},
      bookmarks: parsed.bookmarks ?? {},
      plan: { ...base.plan, ...parsed.plan },
      scenarios: parsed.scenarios ?? [],
      mentor: { ...base.mentor, ...parsed.mentor },
    };
  } catch {
    return base;
  }
};

const allLessons = [...domains.flatMap((domain) => domain.lessons), ...connectionLessons];

const lessonDomain = (lessonId: string): DomainId | "connections" => {
  const found = domains.find((domain) => domain.lessons.some((lessonItem) => lessonItem.id === lessonId));
  return found?.id ?? "connections";
};

const getDomainProgress = (state: AppState, domain: Domain) => {
  const completed = domain.lessons.filter((lessonItem) => state.progress[lessonItem.id]).length;
  return Math.round((completed / Math.max(1, domain.lessons.length)) * 100);
};

function groupByTrack(lessons: Lesson[]): Array<{ track: string | null; lessons: Lesson[] }> {
  const groups: Array<{ track: string | null; lessons: Lesson[] }> = [];
  let currentTrack: string | undefined;
  for (const lesson of lessons) {
    const track = lesson.track ?? null;
    if (currentTrack === undefined || track !== (groups[groups.length - 1]?.track ?? null)) {
      groups.push({ track, lessons: [] });
      currentTrack = track ?? undefined;
    }
    groups[groups.length - 1].lessons.push(lesson);
  }
  return groups;
}

const getMachineCompleteness = (state: AppState) => {
  const values = domains.map((domain) => getDomainProgress(state, domain));
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const weakest = Math.min(...values);
  return Math.round(average * 0.65 + weakest * 0.35);
};

const weakestDomain = (state: AppState) => {
  return domains.reduce((weakest, domain) =>
    state.assessment[domain.id] < state.assessment[weakest.id] ? domain : weakest,
  );
};

const mentorSystemPrompt = (profile: Profile, plan: Plan) => `
You are a financial education mentor helping the user build a strong, durable foundation across five domains of financial literacy: Making money, Keeping money, Growing money, Protecting money, and Understanding money.

Your defining characteristic: you think across domains, never in isolation. If the user asks an investing question, you consider their tax situation, their emergency reserves, and their business concentration. If they ask about their business, you consider their personal financial resilience and their portfolio. You always show the connections.

The user is an experienced software engineer and founder with 10+ years of business experience. They have strong business-building instincts and are now completing their broader financial education. They have separate tools for deep business analysis, tax, and customer skills. You can reference these but focus on integration and the domains they're newer to: investing, protection, and economic literacy.

Principles:
- Teach durable principles, not time-bound facts or specific product picks.
- Never recommend specific investments, funds, or financial products.
- Always distinguish education from advice. For real decisions, point to qualified professionals.
- Be direct and honest about risk, uncertainty, and what you do not know.
- Show the connections between domains in every relevant answer.
- Empower independent navigation rather than dependence.
- Be honest that wealth-building rewards patience, discipline, and time over cleverness.

Current profile context:
Name: ${profile.name}
Country: ${profile.country}
Monthly income: ${profile.monthlyIncome}
Monthly expenses: ${profile.monthlyExpenses}
Emergency reserve: ${profile.emergencyReserve}
Investable assets: ${profile.investableAssets}
Business value estimate: ${profile.businessValue}
Debt balance: ${profile.debtBalance}
Primary goal: ${profile.primaryGoal}

Current plan notes:
${Object.entries(plan)
  .map(([key, value]) => `${key}: ${value}`)
  .join("\n")}

Reminder: this is education, not financial advice.
`;

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [section, setSection] = useState<SectionId>("hub");
  const [mentorOpen, setMentorOpen] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    localStorage.setItem(SHARED_PROFILE_KEY, JSON.stringify(state.profile));
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state]);

  const updateState = (updater: (current: AppState) => AppState) => setState((current) => updater(current));
  const activeDomain = section !== "hub" && section !== "connections" && section !== "plan" ? domainById[section] : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex min-h-screen">
        <SideNav
          state={state}
          section={section}
          setSection={(nextSection) => {
            setSection(nextSection);
            setMobileNavOpen(false);
          }}
          mobileOpen={mobileNavOpen}
          closeMobile={() => setMobileNavOpen(false)}
        />
        <main className="min-w-0 flex-1 lg:pl-72">
          <TopBar
            state={state}
            section={section}
            activeDomain={activeDomain}
            openMentor={() => setMentorOpen(true)}
            openGlossary={() => setGlossaryOpen(true)}
            toggleTheme={() =>
              updateState((current) => ({
                ...current,
                theme: current.theme === "dark" ? "light" : "dark",
              }))
            }
            openMobileNav={() => setMobileNavOpen(true)}
          />
          <div className="mx-auto w-full max-w-7xl px-3 pb-16 pt-3 sm:px-6 sm:pt-4 lg:px-8">
            <Disclaimer />
            {section === "hub" && (
              <Hub
                state={state}
                updateState={updateState}
                setSection={setSection}
                openMentor={() => setMentorOpen(true)}
              />
            )}
            {activeDomain && <DomainPage domain={activeDomain} state={state} updateState={updateState} />}
            {section === "connections" && (
              <ConnectionsPage state={state} updateState={updateState} setSection={setSection} />
            )}
            {section === "plan" && <PlanPage state={state} updateState={updateState} />}
          </div>
        </main>
      </div>
      {mentorOpen && <MentorDrawer state={state} updateState={updateState} close={() => setMentorOpen(false)} />}
      {glossaryOpen && <GlossaryDrawer close={() => setGlossaryOpen(false)} />}
      {!state.acknowledgments.education && (
        <Onboarding
          state={state}
          updateState={updateState}
          setSection={(nextSection) => {
            setSection(nextSection);
            setMobileNavOpen(false);
          }}
        />
      )}
    </div>
  );
}

function SideNav({
  state,
  section,
  setSection,
  mobileOpen,
  closeMobile,
}: {
  state: AppState;
  section: SectionId;
  setSection: (section: SectionId) => void;
  mobileOpen: boolean;
  closeMobile: () => void;
}) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 shrink-0 border-r border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 lg:block">
        <NavContent state={state} section={section} setSection={setSection} />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden" onClick={closeMobile}>
          <aside
            className="h-full w-80 max-w-[86vw] border-r border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex justify-end">
              <IconButton label="Close menu" icon={X} onClick={closeMobile} />
            </div>
            <NavContent state={state} section={section} setSection={setSection} />
          </aside>
        </div>
      )}
    </>
  );
}

function NavContent({
  state,
  section,
  setSection,
}: {
  state: AppState;
  section: SectionId;
  setSection: (section: SectionId) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-700 text-white">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Capstone</p>
            <h1 className="text-base font-semibold leading-tight">The Complete Financial Education</h1>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Machine completeness</span>
            <span>{getMachineCompleteness(state)}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-teal-700 transition-all"
              style={{ width: `${getMachineCompleteness(state)}%` }}
            />
          </div>
        </div>
      </div>
      <nav className="space-y-1">
        {sectionNav.map((item) => {
          const Icon = item.icon;
          const isDomain = domains.some((domain) => domain.id === item.id);
          const progress = isDomain ? getDomainProgress(state, domainById[item.id as DomainId]) : undefined;
          const active = section === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition",
                active
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="min-w-0 flex-1">{item.label}</span>
              {progress !== undefined && <span className="text-xs opacity-70">{progress}%</span>}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-lg border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-medium">Suggested next domain</p>
        <p className="mt-1 text-slate-600 dark:text-slate-300">
          Your current self-assessment points to{" "}
          <button
            type="button"
            className="font-semibold text-teal-700 underline underline-offset-4 dark:text-teal-300"
            onClick={() => setSection(weakestDomain(state).id)}
          >
            {weakestDomain(state).title}
          </button>
          .
        </p>
      </div>
    </div>
  );
}

function TopBar({
  state,
  section,
  activeDomain,
  openMentor,
  openGlossary,
  toggleTheme,
  openMobileNav,
}: {
  state: AppState;
  section: SectionId;
  activeDomain: Domain | null;
  openMentor: () => void;
  openGlossary: () => void;
  toggleTheme: () => void;
  openMobileNav: () => void;
}) {
  const label =
    section === "hub"
      ? "Hub"
      : section === "connections"
        ? "The Connections"
        : section === "plan"
          ? "Your Financial Plan"
          : activeDomain?.title ?? "Financial Education";
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <IconButton label="Open menu" icon={Menu} onClick={openMobileNav} className="lg:hidden" />
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Five domains, one machine
          </p>
          <h2 className="truncate text-lg font-semibold">{label}</h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Pill icon={Target} label={`${getMachineCompleteness(state)}% complete`} />
          <Pill icon={Gauge} label={`${state.profile.riskComfort}/100 risk comfort`} />
        </div>
        <IconButton label="Glossary" icon={BookOpen} onClick={openGlossary} />
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {state.theme === "dark" ? (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          ) : (
            <Moon className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">{state.theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        <button
          type="button"
          onClick={openMentor}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
        >
          <Bot className="h-4 w-4" />
          <span className="hidden sm:inline">AI Mentor</span>
        </button>
      </div>
    </header>
  );
}

function Disclaimer() {
  return (
    <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/35 dark:text-amber-100 sm:p-4">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
        <div>
          <p className="font-semibold">This is education, not advice.</p>
          <p className="mt-1 leading-relaxed">{educationDisclaimer}</p>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  className,
  disabled = false,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Pill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  icon: Icon,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  icon: Icon,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  currency,
  min = 0,
  max,
  step = 100,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  currency?: CurrencyCode;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <div className="mt-1 flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
        {currency && <span className="mr-2 text-sm text-slate-500">{currency}</span>}
        <input
          type="number"
          value={Math.round(value)}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="min-w-0 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </label>
  );
}

function Metric({
  label,
  value,
  hint,
  icon: Icon,
  color = "#0f766e",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  color?: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 break-words text-xl font-semibold tracking-tight sm:text-2xl">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-lg p-2 text-white" style={{ backgroundColor: color }}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      {hint && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hint}</p>}
    </div>
  );
}

function ChartBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="no-scrollbar overflow-x-auto">
        <div className="h-64 min-w-[280px] sm:h-72">{children}</div>
      </div>
    </div>
  );
}

function CompanionCard({ id }: { id: CompanionId }) {
  const app = companionApps[id];
  const Icon = app.icon;
  return (
    <a
      href={app.url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-lg border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-4"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-950 p-2 text-white dark:bg-white dark:text-slate-950">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
              Companion app
            </span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-teal-600" />
          </div>
          <p className="mt-1 font-semibold">{app.name}</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{app.description}</p>
        </div>
      </div>
    </a>
  );
}

function Hub({
  state,
  updateState,
  setSection,
  openMentor,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
  setSection: (section: SectionId) => void;
  openMentor: () => void;
}) {
  const weak = weakestDomain(state);
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                The hub of the wheel
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Five domains, one financial machine.
              </h2>
              <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                Click any node to enter a domain. Hover a link to preview the connection that turns separate
                subjects into one operating system.
              </p>
            </div>
            <PrimaryButton icon={Bot} onClick={openMentor}>
              Ask the mentor
            </PrimaryButton>
          </div>
          <DomainMap state={state} setSection={setSection} />
        </div>
        <div className="space-y-4">
          <Metric
            label="Machine completeness"
            value={`${getMachineCompleteness(state)}%`}
            hint="This combines average progress with the weakest domain, because one absent part makes the machine weaker."
            icon={Gauge}
            color="#0f766e"
          />
          <Metric
            label="Suggested start"
            value={weak.shortTitle}
            hint={`Your self-assessment currently scores ${weak.title} lowest. Start there, or jump anywhere.`}
            icon={Target}
            color={weak.accent}
          />
          <HubProfile state={state} updateState={updateState} />
        </div>
      </section>
      <ProgressAcrossMachine state={state} setSection={setSection} />
      <section className="grid gap-4 lg:grid-cols-4">
        {(Object.keys(companionApps) as CompanionId[]).map((id) => (
          <CompanionCard key={id} id={id} />
        ))}
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Living plan
            </p>
            <h3 className="mt-2 text-xl font-semibold">The app builds your plan as you learn.</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Simulators, notes, saved scenarios, and lesson reflections feed a document you can export and take
              to a qualified adviser for pressure-testing.
            </p>
          </div>
          <PrimaryButton icon={FileText} onClick={() => setSection("plan")}>
            Open financial plan
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}

function DomainMap({ state, setSection }: { state: AppState; setSection: (section: SectionId) => void }) {
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  const nodes = useMemo(
    () => [
      { id: "making" as DomainId, x: 310, y: 78 },
      { id: "keeping" as DomainId, x: 510, y: 208 },
      { id: "growing" as DomainId, x: 430, y: 430 },
      { id: "protecting" as DomainId, x: 190, y: 430 },
      { id: "understanding" as DomainId, x: 110, y: 208 },
    ],
    [],
  );
  const nodeLookup = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const links: Array<{ from: DomainId; to: DomainId; label: string; color: string }> = [
    { from: "making", to: "keeping", label: "income survives the leaks", color: "#0f766e" },
    { from: "keeping", to: "growing", label: "surplus becomes capital", color: "#b45309" },
    { from: "growing", to: "protecting", label: "diversification bridges growth and safety", color: "#2563eb" },
    { from: "protecting", to: "making", label: "resilience lets you take bold risks", color: "#7c3aed" },
    { from: "understanding", to: "making", label: "cycles shape opportunity", color: "#c026d3" },
    { from: "understanding", to: "keeping", label: "inflation changes real spending power", color: "#c026d3" },
    { from: "understanding", to: "growing", label: "rates and inflation frame returns", color: "#c026d3" },
    { from: "understanding", to: "protecting", label: "context reveals hidden fragility", color: "#c026d3" },
    { from: "making", to: "growing", label: "income becomes invested capital", color: "#0f766e" },
  ];
  const line = d3.line<[number, number]>().curve(d3.curveCatmullRom.alpha(0.45));

  return (
    <div className="relative mt-4 overflow-hidden rounded-lg bg-slate-950 p-2 text-white shadow-glow">
      <div className="no-scrollbar overflow-x-auto">
        <svg viewBox="0 0 620 520" className="h-[320px] w-full min-w-0" role="img">
        <defs>
          <radialGradient id="machineGlow">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="310" cy="260" r="210" fill="url(#machineGlow)" />
        <circle cx="310" cy="260" r="82" fill="#0f172a" stroke="#334155" strokeWidth="1" />
        <text x="310" y="252" textAnchor="middle" className="fill-white text-[18px] font-semibold">
          One machine
        </text>
        <text x="310" y="278" textAnchor="middle" className="fill-slate-300 text-[12px]">
          not five silos
        </text>
        {links.map((linkItem, index) => {
          const from = nodeLookup[linkItem.from];
          const to = nodeLookup[linkItem.to];
          const mid: [number, number] = [(from.x + to.x) / 2, (from.y + to.y) / 2];
          const path =
            line([
              [from.x, from.y],
              [310 + (mid[0] - 310) * 0.25, 260 + (mid[1] - 260) * 0.25],
              [to.x, to.y],
            ]) ?? "";
          return (
            <g
              key={`${linkItem.from}-${linkItem.to}-${index}`}
              onMouseEnter={() => setHoverLink(linkItem.label)}
              onMouseLeave={() => setHoverLink(null)}
            >
              <path
                d={path}
                fill="none"
                stroke={linkItem.color}
                strokeWidth={hoverLink === linkItem.label ? 4 : 2.4}
                strokeOpacity={hoverLink === linkItem.label ? 0.95 : 0.5}
                className="domain-link"
              />
              <circle cx={mid[0]} cy={mid[1]} r="4" fill={linkItem.color} opacity="0.9" />
            </g>
          );
        })}
        {nodes.map((node) => {
          const domain = domainById[node.id];
          const progress = getDomainProgress(state, domain);
          const Icon = domain.icon;
          return (
            <g
              key={node.id}
              className="cursor-pointer"
              onClick={() => setSection(node.id)}
              tabIndex={0}
              role="button"
              aria-label={`Open ${domain.title}`}
            >
              <circle cx={node.x} cy={node.y} r="58" fill={domain.accent} opacity="0.2" />
              <circle cx={node.x} cy={node.y} r="46" fill="#f8fafc" stroke={domain.accent} strokeWidth="3" />
              <foreignObject x={node.x - 12} y={node.y - 27} width="24" height="24">
                <Icon className="h-6 w-6" style={{ color: domain.accent }} />
              </foreignObject>
              <text x={node.x} y={node.y + 14} textAnchor="middle" className="fill-slate-950 text-[13px] font-bold">
                {domain.shortTitle}
              </text>
              <text x={node.x} y={node.y + 32} textAnchor="middle" className="fill-slate-500 text-[11px]">
                {progress}% learned
              </text>
            </g>
          );
        })}
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 rounded-b-lg border-t border-white/10 bg-slate-900/90 p-2 text-xs backdrop-blur">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
          <p>{hoverLink ?? "Hover a connection to see the relationship. Click a domain to enter its lessons."}</p>
        </div>
      </div>
    </div>
  );
}

function HubProfile({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const surplus = state.profile.monthlyIncome - state.profile.monthlyExpenses;
  const reserveMonths = state.profile.monthlyExpenses
    ? state.profile.emergencyReserve / state.profile.monthlyExpenses
    : 0;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Show me with my numbers</h3>
        <Sparkles className="h-4 w-4 text-teal-700 dark:text-teal-300" />
      </div>
      <div className="mt-4 grid gap-3">
        <NumberInput
          label="Monthly income"
          currency={state.profile.currency}
          value={state.profile.monthlyIncome}
          onChange={(value) =>
            updateState((current) => ({ ...current, profile: { ...current.profile, monthlyIncome: value } }))
          }
        />
        <NumberInput
          label="Monthly expenses"
          currency={state.profile.currency}
          value={state.profile.monthlyExpenses}
          onChange={(value) =>
            updateState((current) => ({ ...current, profile: { ...current.profile, monthlyExpenses: value } }))
          }
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Monthly surplus</p>
          <p className="font-semibold">{formatMoney(surplus, state.profile.currency)}</p>
        </div>
        <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
          <p className="text-slate-500 dark:text-slate-400">Reserve months</p>
          <p className="font-semibold">{reserveMonths.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
}

function ProgressAcrossMachine({
  state,
  setSection,
}: {
  state: AppState;
  setSection: (section: SectionId) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Progress across the machine
          </p>
          <h3 className="mt-2 text-xl font-semibold">Strong in one domain, absent in another, still fragile.</h3>
        </div>
        <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300">
          The completeness score penalizes imbalance because the domains work together. A brilliant income engine
          still needs keeping, growth, protection, and context.
        </p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-5">
        {domains.map((domain) => {
          const progress = getDomainProgress(state, domain);
          const self = state.assessment[domain.id];
          const Icon = domain.icon;
          return (
            <button
              key={domain.id}
              type="button"
              onClick={() => setSection(domain.id)}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-lg p-2 text-white" style={{ backgroundColor: domain.accent }}>
                  <Icon className="h-4 w-4" />
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-3 font-semibold">{domain.shortTitle}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Self-assessed {self}/100</p>
              <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full" style={{ width: `${progress}%`, backgroundColor: domain.accent }} />
              </div>
              <p className="mt-2 text-xs font-semibold">{progress}% lesson progress</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function DomainPage({
  domain,
  state,
  updateState,
}: {
  domain: Domain;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const companions = Array.from(new Set(domain.lessons.flatMap((lessonItem) => lessonItem.companions ?? [])));
  const lessonGroups =
    domain.id === "growing"
      ? groupByTrack(domain.lessons)
      : [{ track: null, lessons: domain.lessons }];

  return (
    <div className="space-y-6">
      <DomainHeader domain={domain} state={state} />
      {domain.id === "growing" && !state.acknowledgments.investing && (
        <InvestingAcknowledgment updateState={updateState} />
      )}
      <DomainSimulators domainId={domain.id} state={state} updateState={updateState} />
      <section className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-8">
          {lessonGroups.map(({ track, lessons: groupLessons }) => (
            <div key={track ?? "all"} className="space-y-4">
              {track && (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{ backgroundColor: domain.accentSoft, color: domain.accent }}
                  >
                    {track}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
              )}
              {groupLessons.map((lessonItem) => (
                <LessonCard key={lessonItem.id} lesson={lessonItem} state={state} updateState={updateState} />
              ))}
            </div>
          ))}
        </div>
        <aside className="space-y-4 xl:sticky xl:top-[5.5rem] xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold">Domain role</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{domain.role}</p>
          </div>
          {companions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Companion apps
              </h3>
              {companions.map((id) => (
                <CompanionCard key={id} id={id} />
              ))}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function DomainHeader({ domain, state }: { domain: Domain; state: AppState }) {
  const Icon = domain.icon;
  const progress = getDomainProgress(state, domain);
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg p-3 text-white" style={{ backgroundColor: domain.accent }}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Domain
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">{domain.title}</h2>
            </div>
          </div>
          <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-300">{domain.description}</p>
          <p className="mt-3 max-w-3xl text-sm text-slate-500 dark:text-slate-400">{domain.role}</p>
        </div>
        <div className="rounded-lg p-3 sm:p-4" style={{ backgroundColor: domain.accentSoft }}>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Domain progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-white/70 dark:bg-slate-950/50">
            <div className="h-3 rounded-full" style={{ width: `${progress}%`, backgroundColor: domain.accent }} />
          </div>
          <p className="mt-3 text-sm">
            {domain.lessons.filter((lessonItem) => state.progress[lessonItem.id]).length} of {domain.lessons.length}{" "}
            lessons complete
          </p>
        </div>
      </div>
    </section>
  );
}

function InvestingAcknowledgment({
  updateState,
}: {
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const [checked, setChecked] = useState(false);
  return (
    <section className="rounded-lg border border-blue-300 bg-blue-50 p-4 text-blue-950 dark:border-blue-700 dark:bg-blue-950/35 dark:text-blue-50 sm:p-5">
      <div className="flex gap-3">
        <ShieldAlert className="mt-1 h-5 w-5 shrink-0" />
        <div>
          <h3 className="font-semibold">Investing-specific acknowledgment</h3>
          <p className="mt-2 text-sm leading-relaxed">{investingDisclaimer}</p>
          <label className="mt-4 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>
              I understand this section teaches principles only, that past performance does not predict future
              returns, and that all investing risks loss.
            </span>
          </label>
          <div className="mt-4">
            <PrimaryButton
              icon={Check}
              disabled={!checked}
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  acknowledgments: { ...current.acknowledgments, investing: true },
                }))
              }
            >
              Acknowledge investing risk
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

function BodyText({ text }: { text: string }) {
  return (
    <>
      {text
        .split("\n\n")
        .filter(Boolean)
        .map((para, i) => (
          <p key={i} className="text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            {para}
          </p>
        ))}
    </>
  );
}

function LessonSection({
  icon: Icon,
  label,
  children,
  accent,
  variant = "default",
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  accent?: string;
  variant?: "default" | "example" | "highlight";
}) {
  return (
    <div
      className={cn(
        "mt-6 rounded-xl p-4 sm:p-5",
        variant === "example" && "bg-blue-50 dark:bg-blue-950/25",
        variant === "highlight" && "bg-amber-50 dark:bg-amber-950/25",
        variant === "default" && "bg-slate-100 dark:bg-slate-900",
      )}
    >
      <h4 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
        {label}
      </h4>
      <div className="max-w-2xl space-y-2">{children}</div>
    </div>
  );
}

// ── Money Flow Diagrams ──────────────────────────────────────────────────────

type FlowChartId =
  | "wealth-loop"
  | "compound-mechanism"
  | "cash-flow-split"
  | "debt-fork"
  | "five-domains"
  | "inflation-erodes"
  | "risk-spectrum";

function FlowBox({
  label,
  sub,
  x,
  y,
  w = 110,
  h = 36,
  fill = "#0f172a",
  textColor = "#fff",
  radius = 8,
}: {
  label: string;
  sub?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill?: string;
  textColor?: string;
  radius?: number;
}) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={radius} fill={fill} opacity={0.92} />
      <text x={x} y={sub ? y - 4 : y + 4.5} textAnchor="middle" fontSize={sub ? 10 : 11} fontWeight="600" fill={textColor}>
        {label}
      </text>
      {sub && (
        <text x={x} y={y + 9} textAnchor="middle" fontSize={8.5} fill={textColor} opacity={0.75}>
          {sub}
        </text>
      )}
    </g>
  );
}

function FlowArrow({
  x1, y1, x2, y2, color = "#64748b", label,
}: {
  x1: number; y1: number; x2: number; y2: number; color?: string; label?: string;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return (
    <g>
      <defs>
        <marker id={`ah-${x1}-${x2}`} markerWidth="8" markerHeight="8" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color}
        strokeWidth={1.8}
        markerEnd={`url(#ah-${x1}-${x2})`}
      />
      {label && (
        <text x={mx} y={my - 5} textAnchor="middle" fontSize={8} fill={color} fontStyle="italic">
          {label}
        </text>
      )}
    </g>
  );
}

function WealthLoopChart() {
  const teal = "#0f766e";
  const blue = "#2563eb";
  const amber = "#b45309";
  const purple = "#7c3aed";
  const slate = "#475569";
  return (
    <svg viewBox="0 0 520 240" className="w-full" role="img" aria-label="The wealth loop diagram">
      <FlowBox label="Earned Income" sub="salary, business" x={80} y={50} w={120} fill={teal} />
      <FlowArrow x1={142} y1={50} x2={198} y2={50} color={teal} label="minus tax &amp; spending" />
      <FlowBox label="Surplus" sub="what you keep" x={260} y={50} w={100} fill={amber} />
      <FlowArrow x1={312} y1={50} x2={368} y2={50} color={amber} label="invested" />
      <FlowBox label="Capital" sub="your second engine" x={440} y={50} w={120} fill={blue} />
      <FlowArrow x1={440} y1={69} x2={440} y2={131} color={blue} label="grows at" />
      <FlowBox label="Returns" sub="dividends + growth" x={440} y={155} w={120} fill={blue} />
      <FlowArrow x1={378} y1={155} x2={322} y2={155} color={blue} label="re-invested" />
      <FlowBox label="Compound Growth" sub="returns on returns" x={260} y={155} w={120} fill={purple} />
      <FlowArrow x1={198} y1={155} x2={132} y2={155} color={purple} label="over time →" />
      <FlowBox label="Financial Freedom" sub="income from assets" x={80} y={155} w={130} fill={purple} />
      <path d="M 80 137 Q 80 95 80 69" stroke={slate} strokeWidth={1.5} fill="none" strokeDasharray="5 3"
        markerEnd="url(#loop-ah)" />
      <defs>
        <marker id="loop-ah" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={slate} />
        </marker>
      </defs>
      <text x={52} y={108} fontSize={7.5} fill={slate} fontStyle="italic">reinvest</text>
      <rect x={195} y={90} width={130} height={24} rx={12} fill="#f8fafc" stroke="#e2e8f0" strokeWidth={1} />
      <text x={260} y={106} textAnchor="middle" fontSize={9} fill="#7c3aed" fontWeight="600">🛡 Protection keeps loop intact</text>
    </svg>
  );
}

function CompoundMechanismChart() {
  const blue = "#2563eb";
  const teal = "#0f766e";
  const purple = "#7c3aed";
  const boxes = [
    { label: "£10,000", sub: "Year 0", y: 50, fill: teal },
    { label: "£10,800", sub: "Year 1 (+£800)", y: 110, fill: blue },
    { label: "£11,664", sub: "Year 2 (+£864)", y: 170, fill: blue },
    { label: "£21,589", sub: "Year 10", y: 230, fill: purple },
    { label: "£46,610", sub: "Year 20", y: 290, fill: purple },
    { label: "£100,627", sub: "Year 30 🚀", y: 350, fill: "#c026d3" },
  ];
  return (
    <svg viewBox="0 0 320 400" className="w-full max-h-[340px]" role="img" aria-label="Compound growth mechanism">
      <text x={14} y={200} textAnchor="middle" fontSize={8} fill="#64748b" transform="rotate(-90 14 200)">
        Balance at 8% / year
      </text>
      {boxes.map((b, i) => (
        <g key={i}>
          <FlowBox label={b.label} sub={b.sub} x={190} y={b.y} w={140} h={38} fill={b.fill} />
          {i < boxes.length - 1 && (
            <FlowArrow
              x1={190} y1={b.y + 19}
              x2={190} y2={boxes[i + 1].y - 19}
              color="#94a3b8"
              label={i === 2 ? "⋯ accelerating ⋯" : undefined}
            />
          )}
          <rect
            x={28} y={b.y - 12}
            width={Math.min(120, (b.sub.includes("30") ? 120 : b.sub.includes("20") ? 80 : b.sub.includes("10") ? 45 : b.sub.includes("2") ? 24 : b.sub.includes("1") ? 22 : 18))}
            height={24} rx={4}
            fill={b.fill} opacity={0.25}
          />
        </g>
      ))}
      <text x={190} y={390} textAnchor="middle" fontSize={9} fill="#64748b">Rule of 72: 72÷8 = 9 years to double</text>
    </svg>
  );
}

function CashFlowSplitChart() {
  const amber = "#b45309";
  const teal = "#0f766e";
  const slate = "#475569";
  const red = "#ef4444";
  return (
    <svg viewBox="0 0 540 220" className="w-full" role="img" aria-label="Personal cash flow split">
      <FlowBox label="Monthly Income" sub="£9,000 example" x={90} y={110} w={130} fill={teal} />
      <FlowArrow x1={157} y1={110} x2={210} y2={110} color={teal} />
      <circle cx={230} cy={110} r={10} fill={amber} />
      <text x={230} y={114} textAnchor="middle" fontSize={10} fontWeight="bold" fill="#fff">÷</text>
      <line x1={230} y1={100} x2={230} y2={55} stroke={red} strokeWidth={1.8} />
      <FlowArrow x1={230} y1={55} x2={345} y2={55} color={red} />
      <FlowBox label="Tax &amp; NI" sub="~£2,200" x={430} y={55} w={120} fill={red} />
      <FlowArrow x1={240} y1={110} x2={345} y2={110} color={amber} />
      <FlowBox label="Essential Costs" sub="rent, food, bills" x={430} y={110} w={120} fill={amber} />
      <line x1={230} y1={120} x2={230} y2={165} stroke={teal} strokeWidth={1.8} />
      <FlowArrow x1={230} y1={165} x2={345} y2={165} color={teal} />
      <FlowBox label="Surplus" sub="~£1,800" x={430} y={165} w={120} fill={teal} />
      <text x={480} y={192} textAnchor="middle" fontSize={8} fill={teal} fontStyle="italic">→ emergency reserve</text>
      <text x={480} y={203} textAnchor="middle" fontSize={8} fill="#2563eb" fontStyle="italic">→ invest (pay yourself first)</text>
      <text x={480} y={214} textAnchor="middle" fontSize={8} fill={slate} fontStyle="italic">→ flexible lifestyle</text>
      <text x={230} y={10} textAnchor="middle" fontSize={10} fontWeight="700" fill="#0f172a">
        Where does £1 of income go?
      </text>
    </svg>
  );
}

function DebtForkChart() {
  const teal = "#0f766e";
  const red = "#ef4444";
  const slate = "#475569";
  return (
    <svg viewBox="0 0 500 280" className="w-full" role="img" aria-label="Debt: tool or trap">
      <FlowBox label="Borrow £100k" sub="at 5% interest" x={130} y={140} w={140} fill={slate} />
      <line x1={202} y1={140} x2={260} y2={140} stroke={slate} strokeWidth={1.8} />
      <circle cx={260} cy={140} r={8} fill={slate} />
      <line x1={260} y1={132} x2={260} y2={70} stroke={teal} strokeWidth={1.8} />
      <FlowArrow x1={260} y1={70} x2={315} y2={70} color={teal} />
      <FlowBox label="Productive Asset" sub="earns 12%/yr" x={400} y={70} w={130} fill={teal} />
      <text x={400} y={96} textAnchor="middle" fontSize={8.5} fill={teal}>Net gain: +£7,000/yr</text>
      <text x={400} y={107} textAnchor="middle" fontSize={8.5} fill={teal}>(12% return – 5% cost)</text>
      <line x1={260} y1={148} x2={260} y2={210} stroke={red} strokeWidth={1.8} />
      <FlowArrow x1={260} y1={210} x2={315} y2={210} color={red} />
      <FlowBox label="Consumption" sub="holiday, car, goods" x={400} y={210} w={130} fill={red} />
      <text x={400} y={236} textAnchor="middle" fontSize={8.5} fill={red}>Net cost: –£5,000/yr</text>
      <text x={400} y={247} textAnchor="middle" fontSize={8.5} fill={red}>(0% return – 5% cost)</text>
      <text x={270} y={60} fontSize={9} fill={teal} fontWeight="700">TOOL ✓</text>
      <text x={270} y={225} fontSize={9} fill={red} fontWeight="700">TRAP ✗</text>
      <rect x={20} y={115} width={100} height={50} rx={8} fill="#fef3c7" stroke="#f59e0b" strokeWidth={1.2} />
      <text x={70} y={134} textAnchor="middle" fontSize={8} fill="#92400e" fontWeight="600">Leverage</text>
      <text x={70} y={146} textAnchor="middle" fontSize={7.5} fill="#92400e">amplifies both</text>
      <text x={70} y={157} textAnchor="middle" fontSize={7.5} fill="#92400e">gains AND losses</text>
    </svg>
  );
}

function FiveDomainsFlowChart() {
  const colors = {
    making: "#0f766e",
    keeping: "#b45309",
    growing: "#2563eb",
    protecting: "#7c3aed",
    understanding: "#c026d3",
  };
  return (
    <svg viewBox="0 0 540 220" className="w-full" role="img" aria-label="The five-domain money machine">
      <rect x={10} y={8} width={520} height={28} rx={8} fill={colors.understanding} opacity={0.15} stroke={colors.understanding} strokeWidth={1} strokeDasharray="4 3" />
      <text x={270} y={27} textAnchor="middle" fontSize={10} fontWeight="700" fill={colors.understanding}>
        5. Understanding — the context layer (inflation, rates, cycles, debt) informs every decision
      </text>
      <FlowBox label="1. Making" sub="income engines" x={80} y={120} w={110} fill={colors.making} />
      <FlowArrow x1={137} y1={120} x2={183} y2={120} color="#94a3b8" label="surplus" />
      <FlowBox label="2. Keeping" sub="cash flow, tax" x={240} y={120} w={110} fill={colors.keeping} />
      <FlowArrow x1={297} y1={120} x2={343} y2={120} color="#94a3b8" label="capital" />
      <FlowBox label="3. Growing" sub="investing, compounding" x={400} y={120} w={120} fill={colors.growing} />
      <path d="M 80 139 Q 240 190 400 139" stroke={colors.protecting} strokeWidth={1.8} fill="none" strokeDasharray="5 3" />
      <text x={240} y={185} textAnchor="middle" fontSize={9} fill={colors.protecting} fontWeight="600">
        4. Protecting — stops shocks from breaking the loop
      </text>
      <path d="M 460 103 Q 460 60 240 60 Q 80 60 80 103" stroke="#94a3b8" strokeWidth={1.5} fill="none" strokeDasharray="4 3"
        markerEnd="url(#ret-ah)" />
      <defs>
        <marker id="ret-ah" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill="#94a3b8" />
        </marker>
      </defs>
      <text x={270} y={55} textAnchor="middle" fontSize={8} fill="#94a3b8" fontStyle="italic">investment income re-enters as earned income</text>
    </svg>
  );
}

function InflationErodesChart() {
  const purple = "#c026d3";
  const slate = "#475569";
  return (
    <svg viewBox="0 0 520 200" className="w-full" role="img" aria-label="Inflation mechanism">
      <FlowBox label="↑ Money Supply" sub="central bank policy" x={70} y={50} w={120} fill={slate} />
      <FlowArrow x1={132} y1={50} x2={188} y2={50} color={slate} />
      <FlowBox label="More £ chasing" sub="same goods" x={260} y={50} w={120} fill={purple} />
      <FlowArrow x1={322} y1={50} x2={378} y2={50} color={purple} />
      <FlowBox label="↑ Prices" sub="CPI rises" x={440} y={50} w={100} fill={purple} />
      <FlowArrow x1={440} y1={69} x2={440} y2={111} color={purple} label="means" />
      <FlowBox label="£ Buys Less" sub="purchasing power ↓" x={440} y={135} w={120} fill="#dc2626" />
      <FlowArrow x1={378} y1={135} x2={322} y2={135} color="#dc2626" label="hurts" />
      <FlowBox label="Idle Cash" sub="loses real value" x={240} y={135} w={110} fill="#fee2e2" textColor="#991b1b" />
      <FlowArrow x1={178} y1={135} x2={132} y2={135} color="#0f766e" label="forces" />
      <FlowBox label="Invest in Real Assets" sub="equities, property" x={70} y={135} w={130} fill="#0f766e" />
      <rect x={155} y={165} width={210} height={28} rx={6} fill="#fdf4ff" stroke={purple} strokeWidth={1} />
      <text x={260} y={181} textAnchor="middle" fontSize={9} fill={purple} fontWeight="600">
        Rule of 72: at 4% inflation, £100k halves in 18 years
      </text>
    </svg>
  );
}

function RiskSpectrumChart() {
  const items = [
    { label: "Cash / Gilts", risk: 8, ret: 12, color: "#64748b" },
    { label: "Corp Bonds", risk: 22, ret: 28, color: "#0f766e" },
    { label: "Property", risk: 40, ret: 44, color: "#b45309" },
    { label: "Global Equities", risk: 62, ret: 66, color: "#2563eb" },
    { label: "Small-cap / EM", risk: 78, ret: 80, color: "#7c3aed" },
    { label: "Private Assets", risk: 88, ret: 88, color: "#c026d3" },
  ];
  return (
    <svg viewBox="0 0 520 200" className="w-full" role="img" aria-label="Risk and return spectrum">
      <line x1={40} x2={500} y1={160} y2={160} stroke="#e2e8f0" strokeWidth={1.5} />
      <line x1={40} x2={40} y1={20} y2={160} stroke="#e2e8f0" strokeWidth={1.5} />
      <text x={270} y={185} textAnchor="middle" fontSize={9} fill="#94a3b8">← lower risk / lower expected return · higher risk / higher expected return →</text>
      <text x={18} y={95} textAnchor="middle" fontSize={9} fill="#94a3b8" transform="rotate(-90 18 95)">Expected Return</text>
      <line x1={50} y1={155} x2={490} y2={30} stroke="#e2e8f0" strokeWidth={1} strokeDasharray="4 4" />
      {items.map((item) => {
        const cx = 50 + (item.risk / 100) * 440;
        const cy = 155 - (item.ret / 100) * 125;
        return (
          <g key={item.label}>
            <circle cx={cx} cy={cy} r={6} fill={item.color} opacity={0.9} />
            <text x={cx} y={cy - 10} textAnchor="middle" fontSize={8} fill={item.color} fontWeight="600">
              {item.label}
            </text>
          </g>
        );
      })}
      <rect x={420} y={130} width={75} height={24} rx={6} fill="#fef2f2" stroke="#ef4444" strokeWidth={1} />
      <text x={458} y={146} textAnchor="middle" fontSize={8} fill="#ef4444" fontWeight="700">High return +</text>
      <rect x={420} y={154} width={75} height={14} rx={3} fill="#fef2f2" />
      <text x={458} y={164} textAnchor="middle" fontSize={7.5} fill="#ef4444">low risk = 🚨 scam</text>
    </svg>
  );
}

function MoneyFlowChart({ id, accent }: { id: FlowChartId; accent: string }) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
      <h4 className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        <Network className="h-3.5 w-3.5" style={{ color: accent }} />
        Money flow diagram
      </h4>
      {id === "wealth-loop" && <WealthLoopChart />}
      {id === "compound-mechanism" && <CompoundMechanismChart />}
      {id === "cash-flow-split" && <CashFlowSplitChart />}
      {id === "debt-fork" && <DebtForkChart />}
      {id === "five-domains" && <FiveDomainsFlowChart />}
      {id === "inflation-erodes" && <InflationErodesChart />}
      {id === "risk-spectrum" && <RiskSpectrumChart />}
    </div>
  );
}

function LessonCard({
  lesson,
  state,
  updateState,
}: {
  lesson: Lesson;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const completed = Boolean(state.progress[lesson.id]);
  const bookmarked = Boolean(state.bookmarks[lesson.id]);
  const domainId = lessonDomain(lesson.id);
  const accent = domainId === "connections" ? "#0f766e" : domainById[domainId].accent;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && cardRef.current) {
      setTimeout(() => {
        const top = cardRef.current!.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top, behavior: "smooth" });
      }, 80);
    }
  };

  return (
    <article
      ref={cardRef}
      className="overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Always-visible header */}
      <div className="p-4 sm:p-5">
        {lesson.track && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {lesson.track}
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">{lesson.title}</h3>
          <div className="flex shrink-0 items-center gap-1.5">
            <IconButton
              label={bookmarked ? "Remove bookmark" : "Bookmark lesson"}
              icon={bookmarked ? BookmarkCheck : Bookmark}
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  bookmarks: { ...current.bookmarks, [lesson.id]: !bookmarked },
                }))
              }
            />
            <button
              type="button"
              onClick={() =>
                updateState((current) => ({
                  ...current,
                  progress: { ...current.progress, [lesson.id]: !completed },
                }))
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                completed
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
              )}
            >
              {completed ? <BadgeCheck className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
              {completed ? "Done" : "Mark done"}
            </button>
          </div>
        </div>

        {/* First summary sentence - always visible */}
        <p className="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">{lesson.summary[0]}</p>

        {/* Metadata pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {lesson.simulators && lesson.simulators.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Calculator className="h-3 w-3" />
              {lesson.simulators.length} simulator{lesson.simulators.length !== 1 ? "s" : ""}
            </span>
          )}
          {lesson.companions && lesson.companions.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <ExternalLink className="h-3 w-3" />
              {lesson.companions.map((id) => companionApps[id].name.split(" ")[0]).join(", ")}
            </span>
          )}
          {lesson.glossaryTerms && lesson.glossaryTerms.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <BookOpen className="h-3 w-3" />
              {lesson.glossaryTerms.length} term{lesson.glossaryTerms.length !== 1 ? "s" : ""}
            </span>
          )}
          {completed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <BadgeCheck className="h-3 w-3" />
              Complete
            </span>
          )}
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={handleToggle}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span className="flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5" />
            {open ? "Collapse lesson" : "Open lesson"}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")} />
        </button>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Full summary box */}
            <div
              className="rounded-xl border-l-4 bg-white p-4 shadow-sm dark:bg-slate-900 sm:p-5"
              style={{ borderColor: accent }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                The point in two sentences
              </p>
              <p className="mt-2.5 font-medium text-slate-900 dark:text-slate-100">{lesson.summary[0]}</p>
              <p className="mt-1.5 text-slate-600 dark:text-slate-300">{lesson.summary[1]}</p>
            </div>

            {/* Body text */}
            <div className="mt-6 max-w-2xl space-y-3">
              {lesson.body
                .split("\n\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-[15px] leading-7 text-slate-700 dark:text-slate-300">
                    {para}
                  </p>
                ))}
            </div>

            {lesson.flowChartId && (
              <MoneyFlowChart id={lesson.flowChartId as FlowChartId} accent={accent} />
            )}

            {/* Anatomy sections */}
            {lesson.intuition && (
              <LessonSection icon={Lightbulb} label="Why this concept exists" accent={accent}>
                <BodyText text={lesson.intuition} />
              </LessonSection>
            )}
            {lesson.mechanism && (
              <LessonSection icon={SlidersHorizontal} label="How it actually works" accent={accent}>
                <BodyText text={lesson.mechanism} />
              </LessonSection>
            )}
            {lesson.workedExample && (
              <LessonSection icon={Calculator} label="Worked example — with real numbers" accent={accent} variant="example">
                <BodyText text={lesson.workedExample} />
              </LessonSection>
            )}
            {lesson.deeperPrinciple && (
              <LessonSection icon={Sparkles} label="The deeper principle" accent={accent} variant="highlight">
                <BodyText text={lesson.deeperPrinciple} />
              </LessonSection>
            )}
            {lesson.nuance && (
              <LessonSection icon={AlertTriangle} label="Where the simple version breaks down" accent={accent}>
                <BodyText text={lesson.nuance} />
              </LessonSection>
            )}
            {lesson.expertInsight && (
              <LessonSection icon={Brain} label="What experts know that beginners miss" accent={accent} variant="highlight">
                <BodyText text={lesson.expertInsight} />
              </LessonSection>
            )}

            {/* Questions to ask — prominent panel */}
            {lesson.questionsToAsk && lesson.questionsToAsk.length > 0 && (
              <div
                className="mt-6 rounded-xl p-5"
                style={{ backgroundColor: `${accent}14`, border: `1.5px solid ${accent}35` }}
              >
                <h4 className="flex items-center gap-2 font-semibold" style={{ color: accent }}>
                  <MessageCircle className="h-4 w-4" />
                  Questions this equips you to ask
                </h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Take these to a financial adviser, accountant, or relevant expert.
                </p>
                <ol className="mt-4 space-y-3">
                  {lesson.questionsToAsk.map((q, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: accent }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{q}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {lesson.goDeeper && (
              <LessonSection icon={ExternalLink} label="Go deeper" accent={accent}>
                <BodyText text={lesson.goDeeper} />
              </LessonSection>
            )}

            {/* deepDive sections for lessons that have them */}
            {lesson.deepDive && !lesson.intuition && (
              <div className="mt-6 space-y-4">
                <DeepSection
                  title="Why this concept exists"
                  icon={Lightbulb}
                  paragraphs={lesson.deepDive.why}
                  accent={accent}
                />
                <DeepSection
                  title="How it actually works"
                  icon={SlidersHorizontal}
                  paragraphs={lesson.deepDive.mechanism}
                  accent={accent}
                />
                <DeepSection
                  title="Worked example with real numbers"
                  icon={Calculator}
                  paragraphs={lesson.deepDive.example}
                  accent={accent}
                />
                <DeepSection
                  title="The why behind the why"
                  icon={Brain}
                  paragraphs={lesson.deepDive.principle}
                  accent={accent}
                />
                <DeepSection
                  title="Where the simple version breaks down"
                  icon={ShieldAlert}
                  paragraphs={lesson.deepDive.nuance}
                  accent={accent}
                />
                <DeepSection
                  title="What experts know that beginners miss"
                  icon={BadgeCheck}
                  paragraphs={lesson.deepDive.expert}
                  accent={accent}
                />
                <DeepBulletSection
                  title="Questions this equips you to ask"
                  icon={MessageCircle}
                  items={lesson.deepDive.questions}
                  accent={accent}
                />
                <DeepBulletSection
                  title="How this connects"
                  icon={Network}
                  items={lesson.deepDive.web}
                  accent={accent}
                />
                <DeepBulletSection
                  title="Go deeper"
                  icon={BookOpen}
                  items={lesson.deepDive.goDeeper}
                  accent={accent}
                />
              </div>
            )}

            {/* Mistakes + Connections */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Mistakes people make
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {lesson.mistakes.map((mistake) => (
                    <li key={mistake} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-900">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <Network className="h-4 w-4" style={{ color: accent }} />
                  How this connects
                </h4>
                <ul className="mt-3 space-y-2.5">
                  {lesson.connections.map((connection) => (
                    <li key={connection} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
                      {connection}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Simulators */}
            {lesson.simulators && lesson.simulators.length > 0 && (
              <div className="mt-4">
                <LessonSimulatorWorkbench lesson={lesson} state={state} updateState={updateState} />
              </div>
            )}

            {/* Companions */}
            {lesson.companions && lesson.companions.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {lesson.companions.map((id) => (
                  <CompanionCard key={id} id={id} />
                ))}
              </div>
            )}

            {/* Notes */}
            <label className="mt-6 block">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <NotebookPen className="h-4 w-4" />
                Notes for your plan
              </span>
              <textarea
                value={state.notes[lesson.id] ?? ""}
                onChange={(event) =>
                  updateState((current) => ({
                    ...current,
                    notes: { ...current.notes, [lesson.id]: event.target.value },
                  }))
                }
                placeholder="Write the principle in your own words, a number to revisit, or a question for a professional."
                className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-600 dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          </div>
        </div>
      )}
    </article>
  );
}

function DeepSection({
  title,
  icon: Icon,
  paragraphs,
  accent,
}: {
  title: string;
  icon: LucideIcon;
  paragraphs: string[];
  accent: string;
}) {
  return (
    <section className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950 sm:p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4" style={{ color: accent }} />
        {title}
      </h4>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function DeepBulletSection({
  title,
  icon: Icon,
  items,
  accent,
}: {
  title: string;
  icon: LucideIcon;
  items: string[];
  accent: string;
}) {
  return (
    <section className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950 sm:p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="h-4 w-4" style={{ color: accent }} />
        {title}
      </h4>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MistakesPanel({ mistakes }: { mistakes: string[] }) {
  return (
    <section className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950 sm:p-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        Mistakes people make
      </h4>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {mistakes.map((mistake) => (
          <li key={mistake} className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
            <span>{mistake}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function LessonSimulatorWorkbench({
  lesson,
  state,
  updateState,
}: {
  lesson: Lesson;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const simulatorNames = lesson.simulators ?? [];
  const simulatorDomain = lessonDomain(lesson.id);
  const [active, setActive] = useState(simulatorNames[0] ?? "");
  const accent = simulatorDomain === "connections" ? "#0f766e" : domainById[simulatorDomain].accent;

  useEffect(() => {
    if (!simulatorNames.includes(active)) {
      setActive(simulatorNames[0] ?? "");
    }
  }, [active, simulatorNames]);

  if (simulatorNames.length === 0) return null;

  return (
    <section className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>
            Interactive simulator
          </p>
          <h4 className="mt-1 text-lg font-semibold">Try it with numbers</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            This is not a label. Move the controls and watch the model redraw so the lesson becomes visible.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {simulatorNames.map((simulator) => (
            <button
              key={simulator}
              type="button"
              onClick={() => setActive(simulator)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                active === simulator
                  ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
              )}
            >
              <Calculator className="h-3.5 w-3.5" />
              {simulator}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <InlineSimulator name={active} state={state} updateState={updateState} />
      </div>
    </section>
  );
}

function InlineSimulator({
  name,
  state,
  updateState,
}: {
  name: string;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  if (name === "Compound growth simulator") return <CompoundGrowthInline state={state} updateState={updateState} />;
  if (name === "Fee eroder") return <FeeEroderInline state={state} />;
  if (name === "Asset allocation explorer") return <AssetAllocationInline state={state} />;
  if (name === "Asset class behaviour simulator") return <AssetBehaviourInline />;
  if (name === "Behaviour gap simulator") return <BehaviourGapInline state={state} />;
  if (name === "Portfolio vs. business balance tool") return <FounderBalanceTool state={state} updateState={updateState} />;
  if (name === "Machine Simulator") return <MachineSimulator state={state} updateState={updateState} />;
  if (name === "Personal cash flow simulator") return <CashFlowInline state={state} updateState={updateState} />;
  if (name === "Lifestyle inflation visualizer") return <LifestyleInflationInline state={state} />;
  if (name === "Emergency reserve calculator") return <EmergencyReserveInline state={state} updateState={updateState} />;
  if (name === "Inflation eroder") return <InflationInline state={state} />;
  if (name === "Interest rate ripple") return <InterestRateRippleInline />;
  if (name === "Good debt vs. bad debt simulator") return <DebtInline state={state} />;
  if (name === "Economic cycle visualizer") return <EconomicCycleInline />;
  if (name === "Fragility test") return <FragilityInline state={state} />;
  if (name === "Resilience builder") return <FragilityInline state={state} />;
  if (name === "Ruin simulator") return <RuinInline state={state} />;
  if (name === "Scam pattern recognizer") return <ScamInline />;
  if (name === "Income engines simulator") return <IncomeEnginesInline state={state} updateState={updateState} />;
  if (name === "Active vs. passive spectrum tool") return <ActivePassiveInline />;
  return <SimulatorFallback name={name} />;
}

function SimulatorFallback({ name }: { name: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
      {name} is connected to the domain simulator above. This panel is ready for a dedicated model.
    </div>
  );
}

function CompoundGrowthInline({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [initial, setInitial] = useState(state.profile.investableAssets);
  const [monthly, setMonthly] = useState(Math.max(100, state.profile.monthlyIncome - state.profile.monthlyExpenses));
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);
  const data = compoundSeries(initial, monthly, rate / 100, years, 10);
  const finalPoint = data[data.length - 1];

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Starting amount" currency={currency} value={initial} onChange={setInitial} />
        <NumberInput label="Monthly contribution" currency={currency} value={monthly} onChange={setMonthly} step={50} />
        <Slider label="Annual return" value={rate} min={0} max={14} step={0.25} suffix="%" onChange={setRate} />
        <Slider label="Time horizon" value={years} min={5} max={50} suffix=" years" onChange={setYears} />
        <Metric
          label="Projected balance"
          value={formatMoney(finalPoint.balance, currency, true)}
          hint={`${formatMoney(finalPoint.growth, currency, true)} comes from growth on growth.`}
          icon={Sparkles}
          color="#2563eb"
        />
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              profile: { ...current.profile, investableAssets: initial },
              plan: {
                ...current.plan,
                growthApproach: `Compound growth scenario: ${formatMoney(initial, currency)} starting capital, ${formatMoney(
                  monthly,
                  currency,
                )}/month, ${rate}% annual return assumption, ${years} years. Projected balance: ${formatMoney(
                  finalPoint.balance,
                  currency,
                )}.`,
              },
            }))
          }
        >
          Save to plan
        </SecondaryButton>
      </div>
      <ChartBox title="Compound curve: contributions vs growth">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <Area type="monotone" dataKey="contributions" stackId="1" stroke="#0f766e" fill="#0f766e" fillOpacity={0.45} name="Contributions" />
            <Area type="monotone" dataKey="growth" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.55} name="Growth" />
            <Line type="monotone" dataKey="earlyStartBalance" stroke="#c026d3" strokeWidth={2} dot={false} name="Started 10 years earlier" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function FeeEroderInline({ state }: { state: AppState }) {
  const currency = state.profile.currency;
  const [initial, setInitial] = useState(state.profile.investableAssets);
  const [monthly, setMonthly] = useState(Math.max(100, state.profile.monthlyIncome - state.profile.monthlyExpenses));
  const [feeHigh, setFeeHigh] = useState(1.25);
  const data = feeSeries(initial, monthly, 0.07, 0.15 / 100, feeHigh / 100, 30);
  const last = data[data.length - 1];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Starting amount" currency={currency} value={initial} onChange={setInitial} />
        <NumberInput label="Monthly contribution" currency={currency} value={monthly} onChange={setMonthly} step={50} />
        <Slider label="High-fee scenario" value={feeHigh} min={0.2} max={2.5} step={0.05} suffix="%" onChange={setFeeHigh} />
        <Metric label="30-year fee drag" value={formatMoney(last.feeDrag, currency, true)} icon={AlertTriangle} color="#ef4444" />
      </div>
      <ChartBox title="Same portfolio, different annual costs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <Line dataKey="lowCost" stroke="#0f766e" strokeWidth={3} dot={false} name="0.15% annual cost" />
            <Line dataKey="highCost" stroke="#ef4444" strokeWidth={3} dot={false} name={`${feeHigh}% annual cost`} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function AssetAllocationInline({ state }: { state: AppState }) {
  const [equity, setEquity] = useState(70);
  const [bonds, setBonds] = useState(15);
  const [property, setProperty] = useState(10);
  const [cash, setCash] = useState(5);
  const allocation = allocationProfile(equity, bonds, property, cash);
  const total = equity + bonds + property + cash || 1;
  const data = [
    { asset: "Equity", value: (equity / total) * 100 },
    { asset: "Bonds", value: (bonds / total) * 100 },
    { asset: "Property", value: (property / total) * 100 },
    { asset: "Cash", value: (cash / total) * 100 },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <Slider label="Equities" value={equity} min={0} max={100} suffix="%" onChange={setEquity} />
        <Slider label="Bonds" value={bonds} min={0} max={100} suffix="%" onChange={setBonds} />
        <Slider label="Property" value={property} min={0} max={100} suffix="%" onChange={setProperty} />
        <Slider label="Cash" value={cash} min={0} max={100} suffix="%" onChange={setCash} />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Metric label="Volatility" value={percent(allocation.volatility)} icon={Gauge} color="#ef4444" />
          <Metric label="Liquidity" value={percent(allocation.liquidity)} icon={LockKeyhole} color="#0f766e" />
          <Metric label="Inflation defense" value={percent(allocation.inflationDefense)} icon={ShieldAlert} color="#7c3aed" />
        </div>
        <ChartBox title={`Allocation mix, normalized from sliders (${state.profile.currency})`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="asset" />
              <YAxis unit="%" />
              <RechartsTooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
    </div>
  );
}

function AssetBehaviourInline() {
  const data = assetBehaviourSeries(30);
  return (
    <ChartBox title="Asset classes through repeated shocks">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Line dataKey="equities" stroke="#2563eb" strokeWidth={2} dot={false} />
          <Line dataKey="bonds" stroke="#0f766e" strokeWidth={2} dot={false} />
          <Line dataKey="property" stroke="#b45309" strokeWidth={2} dot={false} />
          <Line dataKey="cash" stroke="#64748b" strokeWidth={2} dot={false} />
          {[4, 11, 18, 25].map((year) => (
            <ReferenceLine key={year} x={year} stroke="#ef4444" strokeDasharray="4 4" />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

function BehaviourGapInline({ state }: { state: AppState }) {
  const currency = state.profile.currency;
  const [monthly, setMonthly] = useState(Math.max(100, state.profile.monthlyIncome - state.profile.monthlyExpenses));
  const data = behaviourGapSeries(state.profile.investableAssets, monthly, 0.07, 30);
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Monthly contribution" currency={currency} value={monthly} onChange={setMonthly} step={50} />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          The return assumptions are deliberately stylized. The point is to show how behaviour changes the outcome even with the same starting plan.
        </p>
      </div>
      <ChartBox title="Investor behaviour changes the result">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <Line dataKey="stayed" stroke="#0f766e" strokeWidth={3} dot={false} name="Stayed invested" />
            <Line dataKey="panicSold" stroke="#ef4444" strokeWidth={3} dot={false} name="Panic sold" />
            <Line dataKey="chased" stroke="#b45309" strokeWidth={3} dot={false} name="Chased performance" />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function CashFlowInline({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [income, setIncome] = useState(state.profile.monthlyIncome);
  const [expenses, setExpenses] = useState(state.profile.monthlyExpenses);
  const [savingShare, setSavingShare] = useState(50);
  const surplus = Math.max(0, income - expenses);
  const investedMonthly = surplus * (savingShare / 100);
  const projected = futureValue(0, investedMonthly, 0.06, 25);
  const data = [
    { bucket: "Expenses", value: expenses },
    { bucket: "Saved/invested", value: investedMonthly },
    { bucket: "Flexible surplus", value: surplus - investedMonthly },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Monthly income" currency={currency} value={income} onChange={setIncome} />
        <NumberInput label="Monthly expenses" currency={currency} value={expenses} onChange={setExpenses} />
        <Slider label="Surplus saved/invested" value={savingShare} min={0} max={100} suffix="%" onChange={setSavingShare} />
        <Metric label="25-year value" value={formatMoney(projected, currency, true)} icon={Sparkles} color="#0f766e" />
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              profile: { ...current.profile, monthlyIncome: income, monthlyExpenses: expenses },
            }))
          }
        >
          Save profile numbers
        </SecondaryButton>
      </div>
      <ChartBox title="Monthly cash flow allocation">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="bucket" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Bar dataKey="value" fill="#b45309" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function LifestyleInflationInline({ state }: { state: AppState }) {
  const currency = state.profile.currency;
  const [capture, setCapture] = useState(80);
  const [growth, setGrowth] = useState(5);
  const data = lifestyleSeries(state.profile.monthlyIncome * 12, state.profile.monthlyExpenses * 12, growth / 100, capture / 100, 0.06, 30);
  const last = data[data.length - 1];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <Slider label="Annual income growth" value={growth} min={0} max={15} suffix="%" onChange={setGrowth} />
        <Slider label="Lifestyle captures raises" value={capture} min={0} max={100} suffix="%" onChange={setCapture} />
        <Metric label="30-year gap" value={formatMoney(last.gap, currency, true)} icon={AlertTriangle} color="#b45309" />
      </div>
      <ChartBox title="Lifestyle capture vs investing the difference">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <Line type="monotone" dataKey="lockedPortfolio" stroke="#0f766e" strokeWidth={3} name="Lifestyle held steadier" dot={false} />
            <Line type="monotone" dataKey="inflatedPortfolio" stroke="#b45309" strokeWidth={3} name="Lifestyle rises with income" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function EmergencyReserveInline({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [expenses, setExpenses] = useState(state.profile.monthlyExpenses);
  const [months, setMonths] = useState(6);
  const target = expenses * months;
  const current = state.profile.emergencyReserve;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4 md:col-span-1">
        <NumberInput label="Monthly essential expenses" currency={currency} value={expenses} onChange={setExpenses} />
        <Slider label="Reserve target" value={months} min={1} max={18} suffix=" months" onChange={setMonths} />
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((currentState) => ({
              ...currentState,
              profile: { ...currentState.profile, monthlyExpenses: expenses },
            }))
          }
        >
          Save expenses
        </SecondaryButton>
      </div>
      <Metric label="Current reserve" value={formatMoney(current, currency)} icon={LockKeyhole} color="#7c3aed" />
      <Metric label="Target reserve" value={formatMoney(target, currency)} hint={`${months} months of expenses`} icon={ShieldAlert} color="#0f766e" />
    </div>
  );
}

function InflationInline({ state }: { state: AppState }) {
  const currency = state.profile.currency;
  const [amount, setAmount] = useState(100000);
  const [inflation, setInflation] = useState(3);
  const data = inflationSeries(amount, inflation / 100, 30);
  const last = data[data.length - 1];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Cash amount" currency={currency} value={amount} onChange={setAmount} />
        <Slider label="Inflation rate" value={inflation} min={0} max={12} step={0.25} suffix="%" onChange={setInflation} />
        <Metric label="30-year purchasing power" value={formatMoney(last.purchasingPower, currency)} icon={AlertTriangle} color="#c026d3" />
      </div>
      <ChartBox title="Inflation erodes purchasing power">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <Area dataKey="nominal" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} name="Nominal amount" />
            <Area dataKey="purchasingPower" stroke="#c026d3" fill="#c026d3" fillOpacity={0.5} name="Real purchasing power" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function InterestRateRippleInline() {
  const [rate, setRate] = useState(5);
  const ripple = [
    { area: "Savings", impact: rate * 11 },
    { area: "Mortgages", impact: rate * 16 },
    { area: "Business", impact: 100 - rate * 10 },
    { area: "Asset prices", impact: 100 - rate * 12 },
    { area: "Currency", impact: 45 + rate * 6 },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <Slider label="Central bank rate" value={rate} min={0} max={12} step={0.25} suffix="%" onChange={setRate} />
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Higher rates reward savers and lenders, but they pressure borrowers, valuations, and investment appetite.
        </p>
      </div>
      <ChartBox title="Rate ripple through the system">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ripple} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 120]} />
            <YAxis dataKey="area" type="category" width={90} />
            <RechartsTooltip />
            <Bar dataKey="impact" fill="#c026d3" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function DebtInline({ state }: { state: AppState }) {
  const currency = state.profile.currency;
  const [borrowed, setBorrowed] = useState(50000);
  const [rate, setRate] = useState(6);
  const data = debtSeries(borrowed, rate / 100, 0.08, 0.18, 15);
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Borrowed amount" currency={currency} value={borrowed} onChange={setBorrowed} />
        <Slider label="Interest rate" value={rate} min={0} max={16} step={0.25} suffix="%" onChange={setRate} />
      </div>
      <ChartBox title="Same debt, different use">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <Line dataKey="productiveNet" stroke="#0f766e" strokeWidth={3} dot={false} name="Productive asset" />
            <Line dataKey="consumptionNet" stroke="#ef4444" strokeWidth={3} dot={false} name="Depreciating purchase" />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function EconomicCycleInline() {
  const cyclePhases = [
    { phase: "Expansion", jobs: 78, assets: 72, rates: 44, opportunity: 62 },
    { phase: "Peak", jobs: 86, assets: 88, rates: 70, opportunity: 35 },
    { phase: "Slowdown", jobs: 56, assets: 48, rates: 64, opportunity: 58 },
    { phase: "Recession", jobs: 30, assets: 28, rates: 35, opportunity: 82 },
    { phase: "Recovery", jobs: 52, assets: 58, rates: 30, opportunity: 76 },
  ];
  return (
    <ChartBox title="Cycle phases and what tends to move">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cyclePhases}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="phase" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="jobs" fill="#0f766e" />
          <Bar dataKey="assets" fill="#2563eb" />
          <Bar dataKey="rates" fill="#b45309" />
          <Bar dataKey="opportunity" fill="#c026d3" />
        </BarChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

function FragilityInline({ state }: { state: AppState }) {
  const [reserveMonths, setReserveMonths] = useState(
    state.profile.monthlyExpenses ? Math.round(state.profile.emergencyReserve / state.profile.monthlyExpenses) : 3,
  );
  const [incomeSources, setIncomeSources] = useState(1);
  const [insurance, setInsurance] = useState(35);
  const [diversification, setDiversification] = useState(30);
  const fragility = clamp(100 - reserveMonths * 5 - incomeSources * 8 - insurance * 0.2 - diversification * 0.27, 0, 100);
  const data = [
    { lever: "Reserves", score: reserveMonths * 5 },
    { lever: "Income sources", score: incomeSources * 8 },
    { lever: "Insurance", score: insurance * 0.2 },
    { lever: "Diversification", score: diversification * 0.27 },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <Slider label="Reserve months" value={reserveMonths} min={0} max={18} suffix=" months" onChange={setReserveMonths} />
        <Slider label="Income sources" value={incomeSources} min={1} max={6} onChange={setIncomeSources} />
        <Slider label="Insurance readiness" value={insurance} min={0} max={100} suffix="/100" onChange={setInsurance} />
        <Slider label="Diversification" value={diversification} min={0} max={100} suffix="/100" onChange={setDiversification} />
        <Metric label="Fragility score" value={`${Math.round(fragility)}/100`} hint="Lower is better." icon={ShieldAlert} color="#7c3aed" />
      </div>
      <ChartBox title="Shock absorbers you can add">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="lever" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="score" fill="#7c3aed" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function RuinInline({ state }: { state: AppState }) {
  const currency = state.profile.currency;
  const [shock, setShock] = useState(state.profile.monthlyExpenses * 10);
  const [protection, setProtection] = useState(45);
  const absorbed = shock * (protection / 100) + state.profile.emergencyReserve;
  const data = Array.from({ length: 16 }, (_, year) => {
    const base = futureValue(state.profile.investableAssets, Math.max(0, state.profile.monthlyIncome - state.profile.monthlyExpenses), 0.06, year);
    return {
      year,
      unprotected: year >= 6 ? Math.max(0, base - shock) : base,
      protected: year >= 6 ? Math.max(0, base - Math.max(0, shock - absorbed)) : base,
    };
  });
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Catastrophic shock" currency={currency} value={shock} onChange={setShock} />
        <Slider label="Protection level" value={protection} min={0} max={100} suffix="/100" onChange={setProtection} />
      </div>
      <ChartBox title="One large loss can break the curve">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <ReferenceLine x={6} stroke="#ef4444" strokeDasharray="4 4" label="Shock" />
            <Line dataKey="unprotected" stroke="#ef4444" strokeWidth={3} dot={false} name="Unprotected" />
            <Line dataKey="protected" stroke="#7c3aed" strokeWidth={3} dot={false} name="Protected" />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function ScamInline() {
  const [choice, setChoice] = useState("");
  const scenarios = [
    "Guaranteed 18% monthly returns if you join before Friday.",
    "A low-cost diversified fund describing broad market exposure and risks.",
    "A private deal you can only access through a friend who will not share documents.",
  ];
  const feedback =
    choice === scenarios[0]
      ? "Correct: high guaranteed returns plus urgency is a severe warning sign."
      : choice === scenarios[2]
        ? "Correct: exclusivity, social pressure, and poor documentation are warning signs."
        : choice
          ? "This one is less suspicious because it states broad exposure and risk, though due diligence still matters."
          : "Pick a scenario to see the pattern.";
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <h5 className="text-sm font-semibold">Pick the scenario that deserves the strongest pause.</h5>
      <div className="mt-3 grid gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            type="button"
            onClick={() => setChoice(scenario)}
            className={cn(
              "rounded-lg border p-3 text-left text-sm transition",
              choice === scenario
                ? "border-violet-600 bg-violet-50 dark:bg-violet-950/35"
                : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800",
            )}
          >
            {scenario}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-violet-700 dark:text-violet-300">{feedback}</p>
    </div>
  );
}

function IncomeEnginesInline({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [employment, setEmployment] = useState(state.profile.monthlyIncome * 12 * 0.65);
  const [business, setBusiness] = useState(state.profile.monthlyIncome * 12 * 0.3);
  const [investment, setInvestment] = useState(state.profile.monthlyIncome * 12 * 0.05);
  const [futureInvestment, setFutureInvestment] = useState(35);
  const annualTotal = employment + business + investment;
  const data = [
    { source: "Employment", now: employment, future: employment * 0.72 },
    { source: "Business", now: business, future: business * 1.35 },
    { source: "Investment", now: investment, future: annualTotal * (futureInvestment / 100) },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <NumberInput label="Employment income per year" currency={currency} value={employment} onChange={setEmployment} />
        <NumberInput label="Business income per year" currency={currency} value={business} onChange={setBusiness} />
        <NumberInput label="Investment income per year" currency={currency} value={investment} onChange={setInvestment} />
        <Slider label="Future investment-income share" min={0} max={70} value={futureInvestment} onChange={setFutureInvestment} suffix="%" />
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              plan: {
                ...current.plan,
                incomeEngines: `Current annual mix: employment ${formatMoney(employment, currency)}, business ${formatMoney(
                  business,
                  currency,
                )}, investment income ${formatMoney(investment, currency)}.`,
              },
            }))
          }
        >
          Save to plan
        </SecondaryButton>
      </div>
      <ChartBox title="Income engines now vs future">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
            <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
            <Legend />
            <Bar dataKey="now" fill="#0f766e" name="Now" radius={[4, 4, 0, 0]} />
            <Bar dataKey="future" fill="#2563eb" name="Potential future" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
}

function ActivePassiveInline() {
  const [capital, setCapital] = useState(25);
  const [systems, setSystems] = useState(45);
  const [time, setTime] = useState(70);
  const points = [
    { label: "Salary", x: 18, y: 72 },
    { label: "Consulting", x: 34, y: 58 },
    { label: "Agency", x: 48, y: 45 },
    { label: "Product", x: systems, y: 100 - systems },
    { label: "Equity", x: 76, y: 28 },
    { label: "Portfolio", x: 65 + capital * 0.3, y: 42 - capital * 0.22 },
    { label: "Your current mix", x: (capital + systems) / 2, y: time },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <Slider label="Capital doing work" value={capital} min={0} max={100} suffix="/100" onChange={setCapital} />
        <Slider label="Systems doing work" value={systems} min={0} max={100} suffix="/100" onChange={setSystems} />
        <Slider label="Founder time required" value={time} min={0} max={100} suffix="/100" onChange={setTime} />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
        <h5 className="text-sm font-semibold">Active vs passive is a spectrum</h5>
        <svg viewBox="0 0 100 86" className="mt-4 h-72 w-full">
          <line x1="10" x2="92" y1="74" y2="74" stroke="#94a3b8" />
          <line x1="10" x2="10" y1="12" y2="74" stroke="#94a3b8" />
          <text x="12" y="84" className="fill-slate-500 text-[4px]">
            active effort
          </text>
          <text x="70" y="84" className="fill-slate-500 text-[4px]">
            systems/capital
          </text>
          {points.map((point) => (
            <g key={point.label}>
              <circle cx={clamp(point.x, 12, 90)} cy={clamp(point.y, 14, 72)} r={point.label === "Your current mix" ? 4 : 3} fill={point.label === "Your current mix" ? "#c026d3" : "#0f766e"} />
              <text x={clamp(point.x, 12, 86) + 4} y={clamp(point.y, 14, 72) + 1.5} className="fill-slate-700 text-[4px] dark:fill-slate-200">
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function DomainSimulators({
  domainId,
  state,
  updateState,
}: {
  domainId: DomainId;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  if (domainId === "making") return <MakingSimulators state={state} updateState={updateState} />;
  if (domainId === "keeping") return <KeepingSimulators state={state} updateState={updateState} />;
  if (domainId === "growing") return <GrowingSimulators state={state} updateState={updateState} />;
  if (domainId === "protecting") return <ProtectingSimulators state={state} updateState={updateState} />;
  return <UnderstandingSimulators state={state} updateState={updateState} />;
}

function MakingSimulators({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const [employment, setEmployment] = useState(state.profile.monthlyIncome * 12 * 0.65);
  const [business, setBusiness] = useState(state.profile.monthlyIncome * 12 * 0.3);
  const [investment, setInvestment] = useState(state.profile.monthlyIncome * 12 * 0.05);
  const [futureInvestment, setFutureInvestment] = useState(35);
  const currency = state.profile.currency;
  const annualTotal = employment + business + investment;
  const futureData = [
    { source: "Employment", now: employment, future: employment * 0.72 },
    { source: "Business", now: business, future: business * 1.35 },
    { source: "Investment", now: investment, future: annualTotal * (futureInvestment / 100) },
  ];
  const spectrum = [
    { label: "Salary", x: 18, y: 72 },
    { label: "Consulting", x: 34, y: 58 },
    { label: "Agency", x: 48, y: 45 },
    { label: "Product", x: 65, y: 32 },
    { label: "Equity", x: 76, y: 28 },
    { label: "Portfolio", x: 86, y: 20 },
  ];
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
            Interactive model
          </p>
          <h3 className="mt-2 text-xl font-semibold">Income engines simulator</h3>
          <p className="mt-1 text-slate-600 dark:text-slate-300">
            Model the mix now, then watch how the machine changes as capital becomes a larger engine.
          </p>
        </div>
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              plan: {
                ...current.plan,
                incomeEngines: `Current annual mix: employment ${formatMoney(
                  employment,
                  currency,
                )}, business ${formatMoney(business, currency)}, investment income ${formatMoney(
                  investment,
                  currency,
                )}. Desired future: investment income around ${futureInvestment}% of current annual income.`,
              },
            }))
          }
        >
          Save to plan
        </SecondaryButton>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-4">
          <NumberInput label="Employment income per year" currency={currency} value={employment} onChange={setEmployment} />
          <NumberInput label="Business income per year" currency={currency} value={business} onChange={setBusiness} />
          <NumberInput label="Investment income per year" currency={currency} value={investment} onChange={setInvestment} />
          <Slider
            label="Future investment-income share"
            min={0}
            max={70}
            value={futureInvestment}
            onChange={setFutureInvestment}
            suffix="%"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <ChartBox title="Income mix now vs. future">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={futureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Legend />
                <Bar dataKey="now" fill="#0f766e" name="Now" radius={[4, 4, 0, 0]} />
                <Bar dataKey="future" fill="#2563eb" name="Potential future" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
            <h4 className="text-sm font-semibold">Active vs. passive spectrum</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Passive is a spectrum. The better question is how much effort, control, and fragility each engine needs.
            </p>
            <svg viewBox="0 0 100 86" className="mt-4 h-64 w-full">
              <line x1="10" x2="92" y1="74" y2="74" stroke="#94a3b8" />
              <line x1="10" x2="10" y1="12" y2="74" stroke="#94a3b8" />
              <text x="12" y="84" className="fill-slate-500 text-[4px]">
                active effort
              </text>
              <text x="70" y="84" className="fill-slate-500 text-[4px]">
                systems/capital
              </text>
              <text x="2" y="16" className="fill-slate-500 text-[4px]" transform="rotate(-90 2 16)">
                scalability
              </text>
              {spectrum.map((point) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r="3.2" fill="#0f766e" />
                  <text x={point.x + 4} y={point.y + 1.5} className="fill-slate-700 text-[4px] dark:fill-slate-200">
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function KeepingSimulators({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [income, setIncome] = useState(state.profile.monthlyIncome);
  const [expenses, setExpenses] = useState(state.profile.monthlyExpenses);
  const [savingsRate, setSavingsRate] = useState(20);
  const [incomeGrowth, setIncomeGrowth] = useState(5);
  const [lifestyleCapture, setLifestyleCapture] = useState(80);
  const [reserveMonths, setReserveMonths] = useState(6);
  const surplus = Math.max(0, income - expenses);
  const targetReserve = expenses * reserveMonths;
  const compoundSurplus = futureValue(0, surplus * (savingsRate / 100), 0.06, 25);
  const lifestyleData = lifestyleSeries(income * 12, expenses * 12, incomeGrowth / 100, lifestyleCapture / 100, 0.06, 30);
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">
            Interactive models
          </p>
          <h3 className="mt-2 text-xl font-semibold">Keeping money: cash flow, lifestyle, reserve</h3>
        </div>
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              profile: {
                ...current.profile,
                monthlyIncome: income,
                monthlyExpenses: expenses,
                emergencyReserve: current.profile.emergencyReserve,
              },
              plan: {
                ...current.plan,
                keepingPlan: `Monthly surplus is ${formatMoney(
                  surplus,
                  currency,
                )}. Emergency reserve target is ${reserveMonths} months, or ${formatMoney(
                  targetReserve,
                  currency,
                )}. Pre-committed investing/saving rate from surplus: ${savingsRate}%.`,
              },
            }))
          }
        >
          Save to plan
        </SecondaryButton>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[21rem_1fr]">
        <div className="space-y-4">
          <NumberInput label="Monthly income" currency={currency} value={income} onChange={setIncome} />
          <NumberInput label="Monthly expenses" currency={currency} value={expenses} onChange={setExpenses} />
          <Slider label="Surplus saved/invested" value={savingsRate} min={0} max={100} suffix="%" onChange={setSavingsRate} />
          <Slider label="Annual income growth" value={incomeGrowth} min={0} max={15} suffix="%" onChange={setIncomeGrowth} />
          <Slider
            label="Lifestyle captures each raise"
            value={lifestyleCapture}
            min={0}
            max={100}
            suffix="%"
            onChange={setLifestyleCapture}
          />
          <Slider label="Reserve target" value={reserveMonths} min={1} max={18} suffix=" months" onChange={setReserveMonths} />
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Metric label="Monthly surplus" value={formatMoney(surplus, currency)} icon={CircleDollarSign} color="#b45309" />
            <Metric
              label="Reserve target"
              value={formatMoney(targetReserve, currency)}
              hint={`${reserveMonths} months of expenses`}
              icon={ShieldAlert}
              color="#7c3aed"
            />
            <Metric
              label="25-year value of surplus"
              value={formatMoney(compoundSurplus, currency, true)}
              hint="Assumes 6% annual return, educational projection only."
              icon={CircleDollarSign}
              color="#2563eb"
            />
          </div>
          <ChartBox title="Lifestyle inflation visualizer">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lifestyleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Legend />
                <Line type="monotone" dataKey="lockedPortfolio" stroke="#0f766e" strokeWidth={3} name="Lifestyle held steadier" dot={false} />
                <Line type="monotone" dataKey="inflatedPortfolio" stroke="#b45309" strokeWidth={3} name="Lifestyle rises with income" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>
      </div>
    </section>
  );
}

function GrowingSimulators({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [initial, setInitial] = useState(state.profile.investableAssets);
  const [monthly, setMonthly] = useState(Math.max(250, state.profile.monthlyIncome - state.profile.monthlyExpenses));
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);
  const [feeHigh, setFeeHigh] = useState(1.25);
  const [equity, setEquity] = useState(70);
  const [bonds, setBonds] = useState(15);
  const [property, setProperty] = useState(10);
  const [cash, setCash] = useState(5);
  const compoundData = compoundSeries(initial, monthly, rate / 100, years, 10);
  const feeData = feeSeries(initial, monthly, rate / 100, 0.15 / 100, feeHigh / 100, years);
  const allocation = allocationProfile(equity, bonds, property, cash);
  const behaviourData = behaviourGapSeries(initial, monthly, rate / 100, years);
  const assetData = assetBehaviourSeries(30);
  const finalPoint = compoundData[compoundData.length - 1];
  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-900 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700 dark:text-blue-300">
              Centerpiece simulator
            </p>
            <h3 className="mt-2 text-xl font-semibold">Compound growth simulator</h3>
            <p className="mt-1 text-slate-600 dark:text-slate-300">
              Move every variable and watch why time, consistency, costs, and behaviour matter so much.
            </p>
          </div>
          <SecondaryButton
            icon={Save}
            onClick={() =>
              updateState((current) => ({
                ...current,
                profile: { ...current.profile, investableAssets: initial },
                plan: {
                  ...current.plan,
                  growthApproach: `Compound simulator: ${formatMoney(initial, currency)} starting capital, ${formatMoney(
                    monthly,
                    currency,
                  )}/month, ${rate}% assumed annual return, ${years} years. Educational projected balance: ${formatMoney(
                    finalPoint.balance,
                    currency,
                  )}.`,
                },
              }))
            }
          >
            Save to plan
          </SecondaryButton>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[22rem_1fr]">
          <div className="space-y-4">
            <NumberInput label="Starting amount" currency={currency} value={initial} onChange={setInitial} />
            <NumberInput label="Monthly contribution" currency={currency} value={monthly} onChange={setMonthly} step={50} />
            <Slider label="Annual return assumption" value={rate} min={0} max={14} step={0.25} suffix="%" onChange={setRate} />
            <Slider label="Time horizon" value={years} min={5} max={50} suffix=" years" onChange={setYears} />
            <div className="rounded-lg bg-blue-50 p-3 text-blue-950 dark:bg-blue-950/40 dark:text-blue-50 sm:p-4">
              <p className="text-sm font-semibold">Formula shown</p>
              <p className="mt-1 text-sm">
                FV = starting amount x (1+r)^n + monthly contribution x (((1+r)^n - 1) / r), where r is monthly
                return and n is months.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Metric label="Projected balance" value={formatMoney(finalPoint.balance, currency, true)} icon={Sparkles} color="#2563eb" />
              <Metric label="Contributions" value={formatMoney(finalPoint.contributions, currency, true)} icon={Save} color="#0f766e" />
              <Metric label="Growth" value={formatMoney(finalPoint.growth, currency, true)} icon={Brain} color="#7c3aed" />
            </div>
            <ChartBox title="The curve bends late">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={compoundData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                  <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                  <Legend />
                  <Area type="monotone" dataKey="contributions" stackId="1" stroke="#0f766e" fill="#0f766e" fillOpacity={0.45} name="Contributions" />
                  <Area type="monotone" dataKey="growth" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.55} name="Growth on growth" />
                  <Line type="monotone" dataKey="earlyStartBalance" stroke="#c026d3" strokeWidth={2} dot={false} name="Started 10 years earlier" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartBox title="Asset class behaviour: scary drops are part of the ride">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={assetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line dataKey="equities" stroke="#2563eb" strokeWidth={2} dot={false} />
              <Line dataKey="bonds" stroke="#0f766e" strokeWidth={2} dot={false} />
              <Line dataKey="property" stroke="#b45309" strokeWidth={2} dot={false} />
              <Line dataKey="cash" stroke="#64748b" strokeWidth={2} dot={false} />
              {[4, 11, 18, 25].map((year) => (
                <ReferenceLine key={year} x={year} stroke="#ef4444" strokeDasharray="4 4" />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold">Fee eroder</h3>
            <Slider label="High-fee scenario" value={feeHigh} min={0.2} max={2.5} step={0.05} suffix="%" onChange={setFeeHigh} />
          </div>
          <div className="no-scrollbar mt-3 overflow-x-auto">
          <div className="h-64 min-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Legend />
                <Line dataKey="lowCost" stroke="#0f766e" strokeWidth={3} dot={false} name="0.15% annual cost" />
                <Line dataKey="highCost" stroke="#ef4444" strokeWidth={3} dot={false} name={`${feeHigh}% annual cost`} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[24rem_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold">Asset allocation explorer</h3>
          <div className="mt-4 space-y-4">
            <Slider label="Equities" value={equity} min={0} max={100} suffix="%" onChange={setEquity} />
            <Slider label="Bonds" value={bonds} min={0} max={100} suffix="%" onChange={setBonds} />
            <Slider label="Property" value={property} min={0} max={100} suffix="%" onChange={setProperty} />
            <Slider label="Cash" value={cash} min={0} max={100} suffix="%" onChange={setCash} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Metric label="Expected return" value={percent(allocation.expectedReturn)} hint="Long-run educational assumption." icon={Target} color="#2563eb" />
          <Metric label="Volatility" value={percent(allocation.volatility)} hint="Rough annual swing estimate." icon={Gauge} color="#ef4444" />
          <Metric label="Liquidity" value={percent(allocation.liquidity)} hint="How quickly it can become usable." icon={LockKeyhole} color="#0f766e" />
          <Metric label="Inflation defense" value={percent(allocation.inflationDefense)} hint="Approximate real-asset exposure." icon={ShieldAlert} color="#7c3aed" />
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <ChartBox title="Behaviour gap: stayed invested vs. panic vs. chasing">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={behaviourData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
              <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
              <Legend />
              <Line dataKey="stayed" stroke="#0f766e" strokeWidth={3} dot={false} name="Stayed invested" />
              <Line dataKey="panicSold" stroke="#ef4444" strokeWidth={3} dot={false} name="Panic sold" />
              <Line dataKey="chased" stroke="#b45309" strokeWidth={3} dot={false} name="Chased performance" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
        <FounderBalanceTool state={state} updateState={updateState} />
      </div>
    </section>
  );
}

function FounderBalanceTool({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [businessValue, setBusinessValue] = useState(state.profile.businessValue);
  const [portfolioValue, setPortfolioValue] = useState(state.profile.investableAssets);
  const [liquidityNeed, setLiquidityNeed] = useState(state.profile.monthlyExpenses * 12);
  const total = businessValue + portfolioValue || 1;
  const businessShare = businessValue / total;
  const resilience = clamp((portfolioValue / Math.max(1, liquidityNeed)) * 40 + (1 - businessShare) * 60, 0, 100);
  const data = [
    { name: "Business", value: businessValue },
    { name: "Portfolio", value: portfolioValue },
  ];
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Portfolio vs. business balance</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            The portfolio counterbalances the founder's concentrated, illiquid business asset.
          </p>
        </div>
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              profile: { ...current.profile, businessValue, investableAssets: portfolioValue },
              plan: {
                ...current.plan,
                connectionsMap: `Business value estimate ${formatMoney(
                  businessValue,
                  currency,
                )}; outside portfolio ${formatMoney(portfolioValue, currency)}. Business share of these assets: ${Math.round(
                  businessShare * 100,
                )}%. Portfolio should deliberately counterbalance business concentration.`,
              },
            }))
          }
        >
          Save
        </SecondaryButton>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <NumberInput label="Business value estimate" currency={currency} value={businessValue} onChange={setBusinessValue} />
          <NumberInput label="Outside portfolio" currency={currency} value={portfolioValue} onChange={setPortfolioValue} />
          <NumberInput label="Liquidity need" currency={currency} value={liquidityNeed} onChange={setLiquidityNeed} />
          <Metric
            label="Resilience score"
            value={`${Math.round(resilience)}/100`}
            hint="Higher when less wealth is trapped in one asset and liquidity covers needs."
            icon={ShieldAlert}
            color="#7c3aed"
          />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
              <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
              <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ProtectingSimulators({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [reserve, setReserve] = useState(state.profile.emergencyReserve);
  const [incomeSources, setIncomeSources] = useState(1);
  const [insurance, setInsurance] = useState(35);
  const [diversification, setDiversification] = useState(30);
  const [shock, setShock] = useState(state.profile.monthlyExpenses * 10);
  const [scamChoice, setScamChoice] = useState("");
  const fragility = clamp(
    100 -
      (reserve / Math.max(1, state.profile.monthlyExpenses * 6)) * 25 -
      incomeSources * 8 -
      insurance * 0.2 -
      diversification * 0.27,
    0,
    100,
  );
  const absorbed = shock * ((insurance + diversification) / 220) + reserve;
  const ruinData = Array.from({ length: 16 }, (_, year) => {
    const base = futureValue(state.profile.investableAssets, Math.max(0, state.profile.monthlyIncome - state.profile.monthlyExpenses), 0.06, year);
    const unprotected = year >= 6 ? Math.max(0, base - shock) : base;
    const protectedValue = year >= 6 ? Math.max(0, base - Math.max(0, shock - absorbed)) : base;
    return { year, unprotected, protected: protectedValue };
  });
  const scamWarnings = [
    "Guaranteed 18% monthly returns if you join before Friday.",
    "A low-cost diversified fund describing broad market exposure and risks.",
    "A private deal you can only access through a friend who will not share documents.",
  ];
  const scamFeedback =
    scamChoice === scamWarnings[0]
      ? "Correct: high guaranteed returns plus urgency is a severe warning sign."
      : scamChoice === scamWarnings[2]
        ? "Correct: exclusivity, social pressure, and poor documentation are warning signs."
        : scamChoice
          ? "This one is less suspicious because it states broad exposure and risk, though due diligence still matters."
          : "";
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">
            Interactive models
          </p>
          <h3 className="mt-2 text-xl font-semibold">Fragility test and resilience builder</h3>
        </div>
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              profile: { ...current.profile, emergencyReserve: reserve },
              plan: {
                ...current.plan,
                protectionChecklist: `Fragility score: ${Math.round(
                  fragility,
                )}/100. Reserve: ${formatMoney(reserve, currency)}. Income sources: ${incomeSources}. Insurance confidence: ${insurance}/100. Diversification confidence: ${diversification}/100.`,
              },
            }))
          }
        >
          Save to plan
        </SecondaryButton>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-4">
          <NumberInput label="Liquid reserve" currency={currency} value={reserve} onChange={setReserve} />
          <Slider label="Income sources" value={incomeSources} min={1} max={6} onChange={setIncomeSources} />
          <Slider label="Insurance readiness" value={insurance} min={0} max={100} suffix="/100" onChange={setInsurance} />
          <Slider label="Diversification readiness" value={diversification} min={0} max={100} suffix="/100" onChange={setDiversification} />
          <NumberInput label="Catastrophic shock" currency={currency} value={shock} onChange={setShock} />
          <Metric
            label="Fragility score"
            value={`${Math.round(fragility)}/100`}
            hint="Lower is better. Single points of failure push this upward."
            icon={ShieldAlert}
            color="#7c3aed"
          />
        </div>
        <div className="space-y-4">
          <ChartBox title="Ruin simulator: shock at year 6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ruinData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Legend />
                <ReferenceLine x={6} stroke="#ef4444" strokeDasharray="4 4" label="Shock" />
                <Line dataKey="unprotected" stroke="#ef4444" strokeWidth={3} dot={false} name="Unprotected" />
                <Line dataKey="protected" stroke="#7c3aed" strokeWidth={3} dot={false} name="Protected" />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 sm:p-4">
            <h4 className="text-sm font-semibold">Scam pattern recognizer</h4>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Pick the scenario that deserves the strongest pause.
            </p>
            <div className="mt-3 grid gap-2">
              {scamWarnings.map((warning) => (
                <button
                  key={warning}
                  type="button"
                  onClick={() => setScamChoice(warning)}
                  className={cn(
                    "rounded-lg border p-3 text-left text-sm transition",
                    scamChoice === warning
                      ? "border-violet-600 bg-violet-50 dark:bg-violet-950/35"
                      : "border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
                  )}
                >
                  {warning}
                </button>
              ))}
            </div>
            {scamFeedback && <p className="mt-3 text-sm font-medium text-violet-700 dark:text-violet-300">{scamFeedback}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function UnderstandingSimulators({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [amount, setAmount] = useState(100000);
  const [inflation, setInflation] = useState(3);
  const [rate, setRate] = useState(5);
  const [borrowed, setBorrowed] = useState(50000);
  const inflationData = inflationSeries(amount, inflation / 100, 30);
  const debtData = debtSeries(borrowed, rate / 100, 0.08, 0.18, 15);
  const finalPower = inflationData[inflationData.length - 1].purchasingPower;
  const cyclePhases = [
    { phase: "Expansion", jobs: 78, assets: 72, rates: 44, opportunity: 62 },
    { phase: "Peak", jobs: 86, assets: 88, rates: 70, opportunity: 35 },
    { phase: "Slowdown", jobs: 56, assets: 48, rates: 64, opportunity: 58 },
    { phase: "Recession", jobs: 30, assets: 28, rates: 35, opportunity: 82 },
    { phase: "Recovery", jobs: 52, assets: 58, rates: 30, opportunity: 76 },
  ];
  const ripple = [
    { area: "Savings", impact: rate * 11 },
    { area: "Mortgages", impact: rate * 16 },
    { area: "Business", impact: 100 - rate * 10 },
    { area: "Asset prices", impact: 100 - rate * 12 },
    { area: "Currency", impact: 45 + rate * 6 },
  ];
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-700 dark:text-fuchsia-300">
            Interactive models
          </p>
          <h3 className="mt-2 text-xl font-semibold">The system around your decisions</h3>
        </div>
        <SecondaryButton
          icon={Save}
          onClick={() =>
            updateState((current) => ({
              ...current,
              plan: {
                ...current.plan,
                understandingNotes: `At ${inflation}% inflation, ${formatMoney(amount, currency)} has about ${formatMoney(
                  finalPower,
                  currency,
                )} of purchasing power after 30 years. Interest-rate scenario tested at ${rate}%.`,
              },
            }))
          }
        >
          Save to plan
        </SecondaryButton>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-4">
          <NumberInput label="Cash amount" currency={currency} value={amount} onChange={setAmount} />
          <Slider label="Inflation rate" value={inflation} min={0} max={12} step={0.25} suffix="%" onChange={setInflation} />
          <Slider label="Central bank rate" value={rate} min={0} max={12} step={0.25} suffix="%" onChange={setRate} />
          <NumberInput label="Debt example" currency={currency} value={borrowed} onChange={setBorrowed} />
          <Metric
            label="30-year purchasing power"
            value={formatMoney(finalPower, currency)}
            hint="Same nominal cash, lower real value."
            icon={AlertTriangle}
            color="#c026d3"
          />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <ChartBox title="Inflation eroder">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inflationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Legend />
                <Area dataKey="nominal" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.2} name="Nominal amount" />
                <Area dataKey="purchasingPower" stroke="#c026d3" fill="#c026d3" fillOpacity={0.5} name="Real purchasing power" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartBox>
          <ChartBox title="Interest rate ripple">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ripple} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 120]} />
                <YAxis dataKey="area" type="category" width={90} />
                <RechartsTooltip />
                <Bar dataKey="impact" fill="#c026d3" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
          <ChartBox title="Good debt vs. bad debt">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={debtData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Legend />
                <Line dataKey="productiveNet" stroke="#0f766e" strokeWidth={3} dot={false} name="Debt used for productive asset" />
                <Line dataKey="consumptionNet" stroke="#ef4444" strokeWidth={3} dot={false} name="Debt used for depreciating purchase" />
              </LineChart>
            </ResponsiveContainer>
          </ChartBox>
          <ChartBox title="Economic cycle visualizer">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cyclePhases}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#0f766e" />
                <Bar dataKey="assets" fill="#2563eb" />
                <Bar dataKey="rates" fill="#b45309" />
                <Bar dataKey="opportunity" fill="#c026d3" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>
      </div>
    </section>
  );
}

function ConnectionsPage({
  state,
  updateState,
  setSection,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
  setSection: (section: SectionId) => void;
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
              Integrative section
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">The Connections</h2>
            <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
              This is the app's special job: make the relationship between domains explicit, then let you manipulate
              the whole machine with your own numbers.
            </p>
          </div>
          <SecondaryButton icon={Home} onClick={() => setSection("hub")}>
            Back to hub
          </SecondaryButton>
        </div>
      </section>
      <MachineSimulator state={state} updateState={updateState} />
      <section className="space-y-4">
        {connectionLessons.map((lessonItem) => (
          <LessonCard key={lessonItem.id} lesson={lessonItem} state={state} updateState={updateState} />
        ))}
      </section>
    </div>
  );
}

function defaultMachineInputs(profile: Profile): MachineInputs {
  return {
    annualIncome: profile.monthlyIncome * 12,
    taxRate: 0.28,
    savingsRate: clamp((profile.monthlyIncome - profile.monthlyExpenses) / Math.max(1, profile.monthlyIncome), 0, 0.75),
    annualReturn: 0.065,
    annualFees: 0.004,
    inflationRate: 0.03,
    businessValue: profile.businessValue,
    businessGrowth: 0.06,
    emergencyReserve: profile.emergencyReserve,
    monthlyExpenses: profile.monthlyExpenses,
    protectionLevel: 45,
    debtBalance: profile.debtBalance,
    debtRate: 0.065,
    shockYear: 10,
    shockCost: profile.monthlyExpenses * 9,
    years: 30,
  };
}

function MachineSimulator({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const currency = state.profile.currency;
  const [inputs, setInputs] = useState<MachineInputs>(() => defaultMachineInputs(state.profile));
  const data = useMemo(() => simulateMachine(inputs), [inputs]);
  const finalPoint = data[data.length - 1];
  const score = machineScore(finalPoint, inputs);
  const updateInput = <K extends keyof MachineInputs>(key: K, value: MachineInputs[K]) => {
    setInputs((current) => ({ ...current, [key]: value }));
  };
  return (
    <section className="rounded-lg border border-teal-300 bg-white p-4 shadow-glow dark:border-teal-900 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
            Centerpiece of the app
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">The Machine Simulator</h3>
          <p className="mt-1 max-w-3xl text-slate-600 dark:text-slate-300">
            Adjust income, keeping rate, investing return, costs, protection, debt, inflation, and business value.
            The chart shows how all five domains interact across decades.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <SecondaryButton icon={RefreshCw} onClick={() => setInputs(defaultMachineInputs(state.profile))}>
            Reset
          </SecondaryButton>
          <PrimaryButton
            icon={Save}
            onClick={() => {
              const scenario: SavedScenario = {
                id: crypto.randomUUID(),
                name: `Machine scenario ${state.scenarios.length + 1}`,
                createdAt: new Date().toISOString(),
                inputs,
                summary: `30-year projected real net worth ${formatMoney(
                  finalPoint.realNetWorth,
                  currency,
                )}; resilience score ${score}/100.`,
              };
              updateState((current) => ({
                ...current,
                scenarios: [scenario, ...current.scenarios].slice(0, 12),
                plan: {
                  ...current.plan,
                  connectionsMap: `Latest machine scenario: annual income ${formatMoney(
                    inputs.annualIncome,
                    currency,
                  )}, savings rate ${Math.round(inputs.savingsRate * 100)}%, return assumption ${Math.round(
                    inputs.annualReturn * 100,
                  )}%, protection ${inputs.protectionLevel}/100. 30-year real net worth: ${formatMoney(
                    finalPoint.realNetWorth,
                    currency,
                  )}.`,
                },
              }));
            }}
          >
            Save scenario
          </PrimaryButton>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[23rem_1fr]">
        <div className="space-y-4">
          <NumberInput
            label="Annual income"
            currency={currency}
            value={inputs.annualIncome}
            onChange={(value) => updateInput("annualIncome", value)}
          />
          <Slider
            label="Tax drag"
            value={Math.round(inputs.taxRate * 100)}
            min={0}
            max={60}
            suffix="%"
            onChange={(value) => updateInput("taxRate", value / 100)}
          />
          <Slider
            label="Savings/investing rate"
            value={Math.round(inputs.savingsRate * 100)}
            min={0}
            max={70}
            suffix="%"
            onChange={(value) => updateInput("savingsRate", value / 100)}
          />
          <Slider
            label="Investment return"
            value={Number((inputs.annualReturn * 100).toFixed(1))}
            min={0}
            max={12}
            step={0.25}
            suffix="%"
            onChange={(value) => updateInput("annualReturn", value / 100)}
          />
          <Slider
            label="Annual fees/costs"
            value={Number((inputs.annualFees * 100).toFixed(2))}
            min={0}
            max={2.5}
            step={0.05}
            suffix="%"
            onChange={(value) => updateInput("annualFees", value / 100)}
          />
          <Slider
            label="Protection level"
            value={inputs.protectionLevel}
            min={0}
            max={100}
            suffix="/100"
            onChange={(value) => updateInput("protectionLevel", value)}
          />
          <NumberInput
            label="Business value"
            currency={currency}
            value={inputs.businessValue}
            onChange={(value) => updateInput("businessValue", value)}
          />
          <NumberInput
            label="Shock cost"
            currency={currency}
            value={inputs.shockCost}
            onChange={(value) => updateInput("shockCost", value)}
          />
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="30-year nominal net worth" value={formatMoney(finalPoint.nominalNetWorth, currency, true)} icon={Sparkles} color="#0f766e" />
            <Metric label="30-year real net worth" value={formatMoney(finalPoint.realNetWorth, currency, true)} icon={Target} color="#2563eb" />
            <Metric label="Resilience score" value={`${score}/100`} icon={ShieldAlert} color="#7c3aed" />
            <Metric label="Shock year" value={`Year ${inputs.shockYear}`} hint={`${formatMoney(inputs.shockCost, currency)} before protection`} icon={AlertTriangle} color="#b45309" />
          </div>
          <ChartBox title="Whole-machine projection">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value: number) => formatMoney(value, currency, true)} />
                <RechartsTooltip formatter={(value: number) => formatMoney(value, currency)} />
                <Legend />
                <ReferenceLine x={inputs.shockYear} stroke="#ef4444" strokeDasharray="4 4" label="Shock" />
                <Area dataKey="portfolio" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.5} name="Portfolio" />
                <Area dataKey="business" stackId="1" stroke="#0f766e" fill="#0f766e" fillOpacity={0.45} name="Business" />
                <Area dataKey="debt" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} name="Debt drag" />
                <Line dataKey="realNetWorth" stroke="#c026d3" strokeWidth={3} dot={false} name="Real net worth" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartBox>
          <div className="grid gap-4 md:grid-cols-5">
            <MachineDomainImpact label="Making" value={inputs.annualIncome / 200000} color="#0f766e" />
            <MachineDomainImpact label="Keeping" value={inputs.savingsRate / 0.4} color="#b45309" />
            <MachineDomainImpact label="Growing" value={(inputs.annualReturn - inputs.annualFees) / 0.09} color="#2563eb" />
            <MachineDomainImpact label="Protecting" value={inputs.protectionLevel / 100} color="#7c3aed" />
            <MachineDomainImpact label="Understanding" value={1 - inputs.inflationRate / 0.1} color="#c026d3" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MachineDomainImpact({ label, value, color }: { label: string; value: number; color: string }) {
  const score = Math.round(clamp(value, 0, 1) * 100);
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span>{label}</span>
        <span>{score}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-2 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function PlanPage({
  state,
  updateState,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const markdown = buildPlanMarkdown(state);
  const updatePlan = (key: keyof Plan, value: string) => {
    updateState((current) => ({ ...current, plan: { ...current.plan, [key]: value } }));
  };
  return (
    <div className="space-y-6">
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
              Your living document
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Your Financial Plan</h2>
            <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
              This is your plan, in your words. The app helped you build it, but you own it. Take it to a qualified
              adviser to pressure-test it and arrive informed, not dependent.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton icon={Download} onClick={() => downloadMarkdown(markdown)}>
              Export Markdown
            </SecondaryButton>
            <PrimaryButton icon={FileText} onClick={() => printPlan(markdown)}>
              Export PDF
            </PrimaryButton>
          </div>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Metric label="Completed lessons" value={`${Object.values(state.progress).filter(Boolean).length}/${allLessons.length}`} icon={Check} color="#0f766e" />
        <Metric label="Saved scenarios" value={`${state.scenarios.length}`} icon={Save} color="#2563eb" />
        <Metric label="Bookmarked lessons" value={`${Object.values(state.bookmarks).filter(Boolean).length}`} icon={BookmarkCheck} color="#7c3aed" />
      </section>
      <section className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {(Object.keys(state.plan) as Array<keyof Plan>).map((key) => (
            <label
              key={key}
              className="block rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4"
            >
              <span className="text-sm font-semibold">{planLabel(key)}</span>
              <textarea
                value={state.plan[key]}
                onChange={(event) => updatePlan(key, event.target.value)}
                className="mt-3 min-h-28 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-teal-600 dark:border-slate-800 dark:bg-slate-950"
              />
            </label>
          ))}
        </div>
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
            <h3 className="font-semibold">Current state</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <PlanRow label="Monthly income" value={formatMoney(state.profile.monthlyIncome, state.profile.currency)} />
              <PlanRow label="Monthly expenses" value={formatMoney(state.profile.monthlyExpenses, state.profile.currency)} />
              <PlanRow label="Emergency reserve" value={formatMoney(state.profile.emergencyReserve, state.profile.currency)} />
              <PlanRow label="Investable assets" value={formatMoney(state.profile.investableAssets, state.profile.currency)} />
              <PlanRow label="Business value" value={formatMoney(state.profile.businessValue, state.profile.currency)} />
              <PlanRow label="Debt balance" value={formatMoney(state.profile.debtBalance, state.profile.currency)} />
            </dl>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
            <h3 className="font-semibold">Saved machine scenarios</h3>
            <div className="mt-3 space-y-3">
              {state.scenarios.length === 0 && (
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Save a scenario from The Machine Simulator to keep it here.
                </p>
              )}
              {state.scenarios.map((scenario) => (
                <div key={scenario.id} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
                  <p className="font-semibold">{scenario.name}</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">{scenario.summary}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
            <h3 className="font-semibold">Notes gathered from lessons</h3>
            <div className="mt-3 max-h-80 space-y-3 overflow-auto pr-1">
              {Object.entries(state.notes)
                .filter(([, note]) => note.trim())
                .map(([lessonId, note]) => (
                  <div key={lessonId} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
                    <p className="font-semibold">{allLessons.find((lessonItem) => lessonItem.id === lessonId)?.title ?? lessonId}</p>
                    <p className="mt-1 text-slate-600 dark:text-slate-300">{note}</p>
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function planLabel(key: keyof Plan) {
  const labels: Record<keyof Plan, string> = {
    incomeEngines: "Your income engines",
    keepingPlan: "Your keeping plan",
    growthApproach: "Your growth approach",
    investmentPolicy: "Your investment policy statement",
    protectionChecklist: "Your protection checklist",
    understandingNotes: "Your understanding notes",
    connectionsMap: "Your connections map",
    openQuestions: "Your open questions",
    nextActions: "Your next actions",
  };
  return labels[key];
}

function PlanRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-800">
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function buildPlanMarkdown(state: AppState) {
  const profile = state.profile;
  const progressLines = domains
    .map((domain) => `- ${domain.title}: ${getDomainProgress(state, domain)}% lesson progress, ${state.assessment[domain.id]}/100 self-assessment`)
    .join("\n");
  const planLines = (Object.keys(state.plan) as Array<keyof Plan>)
    .map((key) => `## ${planLabel(key)}\n\n${state.plan[key]}`)
    .join("\n\n");
  const scenarioLines =
    state.scenarios.length === 0
      ? "No saved scenarios yet."
      : state.scenarios.map((scenario) => `- ${scenario.name}: ${scenario.summary}`).join("\n");
  const noteLines =
    Object.entries(state.notes)
      .filter(([, note]) => note.trim())
      .map(([lessonId, note]) => `- ${allLessons.find((lessonItem) => lessonItem.id === lessonId)?.title ?? lessonId}: ${note}`)
      .join("\n") || "No lesson notes yet.";
  return `# The Complete Financial Education - Personal Financial Plan

Educational disclaimer: ${educationDisclaimer}

Generated: ${new Date().toLocaleString()}

## Current State

- Name: ${profile.name}
- Country: ${profile.country}
- Monthly income: ${formatMoney(profile.monthlyIncome, profile.currency)}
- Monthly expenses: ${formatMoney(profile.monthlyExpenses, profile.currency)}
- Emergency reserve: ${formatMoney(profile.emergencyReserve, profile.currency)}
- Investable assets: ${formatMoney(profile.investableAssets, profile.currency)}
- Business value estimate: ${formatMoney(profile.businessValue, profile.currency)}
- Debt balance: ${formatMoney(profile.debtBalance, profile.currency)}
- Primary goal: ${profile.primaryGoal}

## Domain Progress

${progressLines}

${planLines}

## Saved Scenarios

${scenarioLines}

## Lesson Notes

${noteLines}
`;
}

function downloadMarkdown(markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "complete-financial-education-plan.md";
  anchor.click();
  URL.revokeObjectURL(url);
}

function printPlan(markdown: string) {
  const html = markdown
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br />");
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(`<!doctype html><html><head><title>Financial Plan</title><style>
    body{font-family:Inter,Arial,sans-serif;line-height:1.55;color:#0f172a;padding:40px;max-width:900px;margin:0 auto}
    h1{font-size:30px} h2{font-size:20px;margin-top:28px;border-top:1px solid #e2e8f0;padding-top:18px}
    p,li{font-size:13px} li{margin:4px 0}
  </style></head><body><p>${html}</p><script>window.print()</script></body></html>`);
  win.document.close();
}

function MentorDrawer({
  state,
  updateState,
  close,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
  close: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const send = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    setDraft("");
    const userMessage: ChatMessage = { role: "user", content: trimmed };
    updateState((current) => ({ ...current, mentor: { ...current.mentor, messages: [...current.mentor.messages, userMessage] } }));
    if (!state.mentor.apiKey.trim()) {
      const fallback: ChatMessage = {
        role: "assistant",
        content:
          "Add your Anthropic API key to use Claude Sonnet 4 here. Educational frame while you do: ask the question across all five domains - how does this affect making, keeping, growing, protecting, and understanding money? For real decisions, take the output to a qualified professional.",
      };
      updateState((current) => ({ ...current, mentor: { ...current.mentor, messages: [...current.mentor.messages, fallback] } }));
      return;
    }
    setSending(true);
    try {
      const messages = [...state.mentor.messages, userMessage].slice(-12).map((message) => ({
        role: message.role,
        content: message.content,
      }));
      const response = await fetch(ANTHROPIC_ENDPOINT, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": state.mentor.apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 900,
          system: mentorSystemPrompt(state.profile, state.plan),
          messages,
        }),
      });
      if (!response.ok) {
        throw new Error(`Claude API returned ${response.status}`);
      }
      const json = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
      const text =
        json.content
          ?.map((block) => (block.type === "text" ? block.text ?? "" : ""))
          .join("\n")
          .trim() || "I could not read a text response from the mentor.";
      updateState((current) => ({
        ...current,
        mentor: { ...current.mentor, messages: [...current.mentor.messages, { role: "assistant", content: text }] },
      }));
    } catch (error) {
      updateState((current) => ({
        ...current,
        mentor: {
          ...current.mentor,
          messages: [
            ...current.mentor.messages,
            {
              role: "assistant",
              content: `I could not reach the Claude API from the browser. Check the key, network, and browser API access. Error: ${
                error instanceof Error ? error.message : "unknown"
              }`,
            },
          ],
        },
      }));
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50">
      <aside className="ml-auto flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
                Claude Sonnet 4 mentor
              </p>
              <h2 className="text-xl font-semibold">AI Mentor</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Thinks across making, keeping, growing, protecting, and understanding. Educational only.
              </p>
            </div>
            <IconButton label="Close mentor" icon={X} onClick={close} />
          </div>
          <label className="mt-4 block">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              Anthropic API key, stored locally in this browser
            </span>
            <input
              type="password"
              value={state.mentor.apiKey}
              onChange={(event) =>
                updateState((current) => ({
                  ...current,
                  mentor: { ...current.mentor, apiKey: event.target.value },
                }))
              }
              placeholder="sk-ant-..."
              className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-slate-800 dark:bg-slate-900"
            />
          </label>
        </div>
        <div className="no-scrollbar flex-1 space-y-4 overflow-auto p-4">
          {state.mentor.messages.length === 0 && (
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-900">
                <p className="font-semibold">Suggested prompts</p>
                <div className="mt-3 grid gap-2">
                  {mentorSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      className="rounded-lg border border-slate-200 bg-white p-3 text-left text-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {state.mentor.messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "rounded-lg p-3 text-sm leading-relaxed sm:p-4",
                message.role === "user"
                  ? "ml-3 bg-teal-700 text-white sm:ml-8"
                  : "mr-3 bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 sm:mr-8",
              )}
            >
              {message.content}
            </div>
          ))}
          {sending && (
            <div className="mr-3 rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-900 sm:mr-8 sm:p-4">
              Claude is connecting the domains...
            </div>
          )}
        </div>
        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void send(draft);
                }
              }}
              placeholder="Ask across the five domains..."
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-slate-800 dark:bg-slate-900"
            />
            <PrimaryButton icon={Send} onClick={() => void send(draft)} disabled={sending}>
              <span className="hidden sm:inline">Send</span>
            </PrimaryButton>
          </div>
        </div>
      </aside>
    </div>
  );
}

function GlossaryDrawer({ close }: { close: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/50">
      <aside className="ml-auto h-full w-full max-w-lg overflow-auto border-l border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
              Glossary
            </p>
            <h2 className="text-xl font-semibold">Terms across the machine</h2>
          </div>
          <IconButton label="Close glossary" icon={X} onClick={close} />
        </div>
        <div className="mt-5 space-y-3">
          {Object.entries(glossary).map(([term, definition]) => (
            <div key={term} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
              <p className="font-semibold">{term}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{definition}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function Onboarding({
  state,
  updateState,
  setSection,
}: {
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
  setSection: (section: SectionId) => void;
}) {
  const [step, setStep] = useState(0);
  const [ack, setAck] = useState(false);
  const [assessment, setAssessment] = useState(state.assessment);
  const [profile, setProfile] = useState(state.profile);
  const suggested = domains.reduce((weakest, domain) => (assessment[domain.id] < assessment[weakest.id] ? domain : weakest));
  const finish = () => {
    updateState((current) => ({
      ...current,
      acknowledgments: { ...current.acknowledgments, education: true },
      assessment,
      profile,
    }));
    setSection(suggested.id);
  };
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-4 shadow-soft dark:bg-slate-950 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-300">
              First launch
            </p>
            <h2 className="mt-1 text-2xl font-semibold">The Complete Financial Education</h2>
          </div>
          <Pill icon={Play} label={`Step ${step + 1} of 6`} />
        </div>
        <div className="mt-5">
          {step === 0 && (
            <OnboardingPanel
              icon={Network}
              title="Welcome to the capstone."
              body="This app goes broad where your other tools go deep. It teaches the five domains of financial literacy and, more importantly, shows how they connect into one machine."
            />
          )}
          {step === 1 && (
            <div>
              <OnboardingPanel
                icon={Brain}
                title="The five domains overview"
                body="Making creates the raw material. Keeping converts income into surplus. Growing multiplies capital. Protecting stops shocks from breaking the machine. Understanding gives context to every decision."
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-5">
                {domains.map((domain) => {
                  const Icon = domain.icon;
                  return (
                    <div key={domain.id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
                      <Icon className="h-5 w-5" style={{ color: domain.accent }} />
                      <p className="mt-2 text-sm font-semibold">{domain.shortTitle}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{domain.role.split(".")[0]}.</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <OnboardingPanel icon={AlertTriangle} title="Education, not advice." body={educationDisclaimer} />
              <label className="mt-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/35 dark:text-amber-100 sm:p-4">
                <input type="checkbox" checked={ack} onChange={(event) => setAck(event.target.checked)} className="mt-1 h-4 w-4" />
                <span>
                  I understand this app is educational, does not know my full situation, and does not replace a
                  qualified financial adviser, accountant, or tax specialist.
                </span>
              </label>
            </div>
          )}
          {step === 3 && (
            <div>
              <OnboardingPanel
                icon={Gauge}
                title="Where are you now?"
                body="Rate your current confidence in each domain. This is not a grade. It helps the app show where the machine is weakest."
              />
              <div className="mt-5 grid gap-4">
                {domains.map((domain) => (
                  <Slider
                    key={domain.id}
                    label={domain.title}
                    value={assessment[domain.id]}
                    min={0}
                    max={100}
                    suffix="/100"
                    onChange={(value) => setAssessment((current) => ({ ...current, [domain.id]: value }))}
                  />
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <OnboardingPanel
                icon={ClipboardList}
                title="Personal profile"
                body="These numbers power the simulations. They stay in LocalStorage and can be changed later from the Hub and simulators."
              />
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Name</span>
                  <input
                    value={profile.name}
                    onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-slate-800 dark:bg-slate-900"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Currency</span>
                  <select
                    value={profile.currency}
                    onChange={(event) =>
                      setProfile((current) => ({ ...current, currency: event.target.value as CurrencyCode }))
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 dark:border-slate-800 dark:bg-slate-900"
                  >
                    {(["GBP", "USD", "EUR", "NGN", "CAD", "AUD"] satisfies CurrencyCode[]).map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </label>
                <NumberInput label="Monthly income" currency={profile.currency} value={profile.monthlyIncome} onChange={(value) => setProfile((current) => ({ ...current, monthlyIncome: value }))} />
                <NumberInput label="Monthly expenses" currency={profile.currency} value={profile.monthlyExpenses} onChange={(value) => setProfile((current) => ({ ...current, monthlyExpenses: value }))} />
                <NumberInput label="Emergency reserve" currency={profile.currency} value={profile.emergencyReserve} onChange={(value) => setProfile((current) => ({ ...current, emergencyReserve: value }))} />
                <NumberInput label="Investable assets" currency={profile.currency} value={profile.investableAssets} onChange={(value) => setProfile((current) => ({ ...current, investableAssets: value }))} />
                <NumberInput label="Business value estimate" currency={profile.currency} value={profile.businessValue} onChange={(value) => setProfile((current) => ({ ...current, businessValue: value }))} />
                <NumberInput label="Debt balance" currency={profile.currency} value={profile.debtBalance} onChange={(value) => setProfile((current) => ({ ...current, debtBalance: value }))} />
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <OnboardingPanel
                icon={Target}
                title={`Suggested start: ${suggested.title}`}
                body={`Based on your self-assessment, ${suggested.title} is currently the weakest part of the machine. The app will start there, but every section remains open and non-linear.`}
              />
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:p-4">
                <p className="font-semibold">Your machine snapshot</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-5">
                  {domains.map((domain) => (
                    <div key={domain.id}>
                      <div className="flex items-center justify-between text-xs">
                        <span>{domain.shortTitle}</span>
                        <span>{assessment[domain.id]}</span>
                      </div>
                      <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${assessment[domain.id]}%`, backgroundColor: domain.accent }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 [&>button]:w-full sm:flex sm:justify-between sm:[&>button]:w-auto">
          <SecondaryButton icon={ArrowRight} disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}>
            Back
          </SecondaryButton>
          {step < 5 ? (
            <PrimaryButton
              icon={ArrowRight}
              disabled={step === 2 && !ack}
              onClick={() => setStep((current) => Math.min(5, current + 1))}
            >
              Continue
            </PrimaryButton>
          ) : (
            <PrimaryButton icon={Check} onClick={finish}>
              Enter the app
            </PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

function OnboardingPanel({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-teal-700 text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{body}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
