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
import { useEffect, useMemo, useState } from "react";
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
  theme: "light",
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
        <main className="min-w-0 flex-1">
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
          <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
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
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 lg:block">
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
        <IconButton
          label={state.theme === "dark" ? "Light mode" : "Dark mode"}
          icon={state.theme === "dark" ? Sun : Moon}
          onClick={toggleTheme}
        />
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
    <div className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/35 dark:text-amber-100">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
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
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="h-72 w-full">{children}</div>
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
      className="group block rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-slate-950 p-2 text-white dark:bg-white dark:text-slate-950">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
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
        <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
      <svg viewBox="0 0 620 520" className="h-[460px] w-full min-w-[620px] sm:min-w-0" role="img">
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
      <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/10 bg-slate-900/90 p-3 text-sm backdrop-blur">
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
  return (
    <div className="space-y-6">
      <DomainHeader domain={domain} state={state} />
      {domain.id === "growing" && !state.acknowledgments.investing && (
        <InvestingAcknowledgment updateState={updateState} />
      )}
      <DomainSimulators domainId={domain.id} state={state} updateState={updateState} />
      <section className="grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          {domain.lessons.map((lessonItem) => (
            <LessonCard key={lessonItem.id} lesson={lessonItem} state={state} updateState={updateState} />
          ))}
        </div>
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-semibold">Connections highlighted</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              {domain.role.split(". ").map((line) => (
                <li key={line} className="flex gap-2">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: domain.accent }} />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          {companions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
        <div className="rounded-lg p-4" style={{ backgroundColor: domain.accentSoft }}>
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
    <section className="rounded-lg border border-blue-300 bg-blue-50 p-5 text-blue-950 dark:border-blue-700 dark:bg-blue-950/35 dark:text-blue-50">
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

function LessonCard({
  lesson,
  state,
  updateState,
}: {
  lesson: Lesson;
  state: AppState;
  updateState: (updater: (state: AppState) => AppState) => void;
}) {
  const completed = Boolean(state.progress[lesson.id]);
  const bookmarked = Boolean(state.bookmarks[lesson.id]);
  const domainId = lessonDomain(lesson.id);
  const accent = domainId === "connections" ? "#0f766e" : domainById[domainId].accent;
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {lesson.track && (
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {lesson.track}
            </p>
          )}
          <h3 className="mt-1 text-xl font-semibold tracking-tight">{lesson.title}</h3>
        </div>
        <div className="flex shrink-0 gap-2">
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
              "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition",
              completed
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
            )}
          >
            {completed ? <BadgeCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {completed ? "Complete" : "Mark complete"}
          </button>
        </div>
      </div>
      <div className="mt-4 rounded-lg border-l-4 bg-slate-50 p-4 dark:bg-slate-950" style={{ borderColor: accent }}>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          The point in two sentences
        </p>
        <p className="mt-2 font-medium">{lesson.summary[0]}</p>
        <p className="mt-1 text-slate-700 dark:text-slate-300">{lesson.summary[1]}</p>
      </div>
      <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">{lesson.body}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Mistakes people make
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {lesson.mistakes.map((mistake) => (
              <li key={mistake} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
          <h4 className="flex items-center gap-2 text-sm font-semibold">
            <Network className="h-4 w-4 text-teal-700 dark:text-teal-300" />
            Connections
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {lesson.connections.map((connection) => (
              <li key={connection} className="flex gap-2">
                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" style={{ color: accent }} />
                <span>{connection}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {lesson.simulators && lesson.simulators.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {lesson.simulators.map((simulator) => (
            <span
              key={simulator}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Calculator className="h-3.5 w-3.5" />
              {simulator}
            </span>
          ))}
        </div>
      )}
      {lesson.companions && lesson.companions.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {lesson.companions.map((id) => (
            <CompanionCard key={id} id={id} />
          ))}
        </div>
      )}
      <label className="mt-4 block">
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
          className="mt-2 min-h-24 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none focus:border-teal-600 dark:border-slate-800 dark:bg-slate-950"
        />
      </label>
    </article>
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
      <div className="mt-5 grid gap-5 xl:grid-cols-[22rem_1fr]">
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
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
      <div className="mt-5 grid gap-5 xl:grid-cols-[21rem_1fr]">
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
      <div className="rounded-lg border border-blue-200 bg-white p-5 dark:border-blue-900 dark:bg-slate-900">
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
        <div className="mt-5 grid gap-5 xl:grid-cols-[22rem_1fr]">
          <div className="space-y-4">
            <NumberInput label="Starting amount" currency={currency} value={initial} onChange={setInitial} />
            <NumberInput label="Monthly contribution" currency={currency} value={monthly} onChange={setMonthly} step={50} />
            <Slider label="Annual return assumption" value={rate} min={0} max={14} step={0.25} suffix="%" onChange={setRate} />
            <Slider label="Time horizon" value={years} min={5} max={50} suffix=" years" onChange={setYears} />
            <div className="rounded-lg bg-blue-50 p-4 text-blue-950 dark:bg-blue-950/40 dark:text-blue-50">
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
      <div className="grid gap-5 xl:grid-cols-2">
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
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Fee eroder</h3>
            <Slider label="High-fee scenario" value={feeHigh} min={0.2} max={2.5} step={0.05} suffix="%" onChange={setFeeHigh} />
          </div>
          <div className="mt-3 h-72">
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
      <div className="grid gap-5 xl:grid-cols-[24rem_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-sm font-semibold">Asset allocation explorer</h3>
          <div className="mt-4 space-y-4">
            <Slider label="Equities" value={equity} min={0} max={100} suffix="%" onChange={setEquity} />
            <Slider label="Bonds" value={bonds} min={0} max={100} suffix="%" onChange={setBonds} />
            <Slider label="Property" value={property} min={0} max={100} suffix="%" onChange={setProperty} />
            <Slider label="Cash" value={cash} min={0} max={100} suffix="%" onChange={setCash} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Metric label="Expected return" value={percent(allocation.expectedReturn)} hint="Long-run educational assumption." icon={Target} color="#2563eb" />
          <Metric label="Volatility" value={percent(allocation.volatility)} hint="Rough annual swing estimate." icon={Gauge} color="#ef4444" />
          <Metric label="Liquidity" value={percent(allocation.liquidity)} hint="How quickly it can become usable." icon={LockKeyhole} color="#0f766e" />
          <Metric label="Inflation defense" value={percent(allocation.inflationDefense)} hint="Approximate real-asset exposure." icon={ShieldAlert} color="#7c3aed" />
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
      <div className="mt-5 grid gap-5 xl:grid-cols-[22rem_1fr]">
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
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
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
    <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
      <div className="mt-5 grid gap-5 xl:grid-cols-[22rem_1fr]">
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
        <div className="grid gap-5 xl:grid-cols-2">
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
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
    <section className="rounded-lg border border-teal-300 bg-white p-5 shadow-glow dark:border-teal-900 dark:bg-slate-900">
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
      <div className="mt-5 grid gap-5 xl:grid-cols-[23rem_1fr]">
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
      <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
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
              className="block rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
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
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
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
                "rounded-lg p-4 text-sm leading-relaxed",
                message.role === "user"
                  ? "ml-8 bg-teal-700 text-white"
                  : "mr-8 bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100",
              )}
            >
              {message.content}
            </div>
          ))}
          {sending && (
            <div className="mr-8 rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-900">
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
              Send
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
      <aside className="ml-auto h-full w-full max-w-lg overflow-auto border-l border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-950">
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
            <div key={term} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
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
      <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-lg bg-white p-5 shadow-soft dark:bg-slate-950">
        <div className="flex items-start justify-between gap-3">
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
              <label className="mt-4 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-700 dark:bg-amber-950/35 dark:text-amber-100">
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
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
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
        <div className="mt-6 flex justify-between gap-3">
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
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex gap-4">
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
