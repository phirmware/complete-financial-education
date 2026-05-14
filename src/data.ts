import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ExternalLink,
  FlameKindling,
  Landmark,
  LockKeyhole,
  Network,
  PieChart,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { buildDeepDive, expandMistakes, type LessonDeepDive } from "./deepContent";

export type DomainId = "making" | "keeping" | "growing" | "protecting" | "understanding";
export type SectionId = "hub" | DomainId | "connections" | "plan";
export type CompanionId = "business" | "customer" | "voice" | "tax";

export type Lesson = {
  id: string;
  track?: string;
  title: string;
  summary: [string, string];
  body: string;
  deepDive?: LessonDeepDive;
  mistakes: string[];
  connections: string[];
  companions?: CompanionId[];
  simulators?: string[];
  glossaryTerms?: string[];
};

export type Domain = {
  id: DomainId;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  accent: string;
  accentSoft: string;
  description: string;
  role: string;
  lessons: Lesson[];
  primarySimulators: string[];
};

export type ConnectionLesson = Omit<Lesson, "companions"> & {
  companions?: CompanionId[];
};

export const companionApps: Record<
  CompanionId,
  {
    name: string;
    url: string;
    description: string;
    icon: LucideIcon;
  }
> = {
  business: {
    name: "Business Reality Check",
    url: "https://business-analyst-tan.vercel.app/",
    description: "Deep business model analysis, unit economics, and stress testing.",
    icon: BriefcaseBusiness,
  },
  customer: {
    name: "Customer Conversations Dojo",
    url: "https://customer-aquisition-simulator.vercel.app/",
    description: "Practice customer validation and acquisition conversations.",
    icon: Sparkles,
  },
  voice: {
    name: "Voice & Presence",
    url: "https://story-telling-simulator.vercel.app/",
    description: "Speaking, storytelling, and compelling communication practice.",
    icon: FlameKindling,
  },
  tax: {
    name: "Tax & Structures Lab",
    url: "https://tax-structures-lab.vercel.app/",
    description: "Tax efficiency, business structures, and strategy depth.",
    icon: Landmark,
  },
};

export const educationDisclaimer =
  "This is education, not advice. This app teaches principles to help you understand money and ask better questions. It does not know your full situation and cannot tell you what to do. Investment carries risk, including loss of capital. Tax and financial rules vary by country and change over time. Before making real financial decisions, consult appropriately qualified professionals — a financial adviser, accountant, or tax specialist. The goal here is to make you a more informed, more confident navigator — not to replace professional guidance.";

export const investingDisclaimer =
  "Investing involves risk, including loss of capital. Past performance does not predict future returns. This app teaches principles such as diversification, costs, time horizon, and behaviour; it does not recommend specific investments, funds, products, or market timing decisions.";

const lesson = (lessonData: Lesson): Lesson => ({
  ...lessonData,
  deepDive: buildDeepDive(lessonData),
  mistakes: expandMistakes(lessonData.id, lessonData.mistakes),
});

export const domains: Domain[] = [
  {
    id: "making",
    title: "Making Money",
    shortTitle: "Making",
    icon: Banknote,
    accent: "#0f766e",
    accentSoft: "rgba(15, 118, 110, 0.12)",
    description:
      "Income engines, business leverage, and the difference between earning well and becoming wealthy.",
    role: "The raw material. Making money creates the flow that every other domain either keeps, grows, protects, or interprets.",
    primarySimulators: ["Income engines simulator", "Active vs. passive spectrum tool"],
    lessons: [
      lesson({
        id: "making-1",
        title: "1.1 — The engines of income",
        summary: [
          "Income comes from engines: employment, self-employment, business ownership, and invested capital.",
          "Wealthy people usually build several engines, so one weak month or one client does not control the whole machine.",
        ],
        body:
          "Think of income as a set of engines with different fuel, effort, risk, and scalability. Employment can be stable but capped, self-employment can pay more but still depends on you, business ownership creates leverage through systems and people, and investment income is capital working while you sleep.",
        mistakes: [
          "Treating a salary as the whole financial plan.",
          "Calling income passive before the asset, system, or team genuinely does the work.",
          "Adding a new engine without understanding its operating risk.",
        ],
        connections: [
          "Keeping turns income into surplus.",
          "Growing turns surplus into capital.",
          "Protecting reduces dependence on any single engine.",
        ],
        companions: ["business", "customer"],
        simulators: ["Income engines simulator", "Active vs. passive spectrum tool"],
        glossaryTerms: ["Active income", "Passive income", "Equity"],
      }),
      lesson({
        id: "making-2",
        title: "1.2 — Why earning alone doesn't create wealth",
        summary: [
          "High income and wealth are related, but they are not the same thing.",
          "If every pound that comes in leaks out through tax, spending, bad debt, or avoidable loss, the machine never builds capital.",
        ],
        body:
          "A high earner can be financially fragile when fixed costs, status spending, and debt rise with income. Wealth appears when earning is converted into retained capital, then that capital is put to work and protected from ruin.",
        mistakes: [
          "Assuming a bigger income will automatically fix weak habits.",
          "Letting fixed lifestyle costs grow faster than durable assets.",
          "Tracking revenue or salary while ignoring net worth and resilience.",
        ],
        connections: [
          "Keeping is the conversion layer between income and wealth.",
          "Understanding inflation shows why idle income must become productive capital.",
        ],
        companions: ["business"],
      }),
      lesson({
        id: "making-3",
        title: "1.3 — Your business as a financial asset",
        summary: [
          "A founder's business is not only an income source; it is an asset with value, risk, and liquidity limits.",
          "Because it is concentrated and hard to sell quickly, the rest of the financial machine should deliberately counterbalance it.",
        ],
        body:
          "A business can be the user's highest-return asset, but it is often tied to a single market, team, offer, and owner. That makes it powerful and fragile at the same time, so the personal portfolio should usually provide diversification, liquidity, and emotional room.",
        mistakes: [
          "Counting business value as spendable wealth.",
          "Investing personal money into assets that duplicate the business's risks.",
          "Ignoring the owner's dependence on the same asset for salary, identity, and net worth.",
        ],
        connections: [
          "Protecting asks what happens if the business stalls.",
          "Growing asks how outside investments can balance the business.",
        ],
        companions: ["business", "tax"],
        simulators: ["Portfolio vs. business balance tool"],
        glossaryTerms: ["Liquidity", "Concentration risk"],
      }),
      lesson({
        id: "making-4",
        title: "1.4 — Income ceilings and leverage",
        summary: [
          "Time-for-money work has a ceiling because your hours are finite.",
          "Leverage comes from people, products, code, distribution, capital, and ownership.",
        ],
        body:
          "The founder's job is to move from personally doing value creation to designing engines that create value repeatedly. Hiring, productization, automation, equity, and capital each break the hourly ceiling in a different way.",
        mistakes: [
          "Scaling effort instead of systems.",
          "Confusing busyness with leverage.",
          "Taking on leverage before the core economics work.",
        ],
        connections: [
          "Business leverage feeds more capital into Growing.",
          "Communication improves leverage because better stories attract customers, talent, and capital.",
        ],
        companions: ["business", "customer", "voice"],
        glossaryTerms: ["Leverage", "Unit economics"],
      }),
      lesson({
        id: "making-5",
        title: "1.5 — Scaling income responsibly",
        summary: [
          "Rising income becomes wealth only when lifestyle does not rise in lockstep.",
          "The founder's move is to bank part of every raise, win, and profitable month before comfort quietly absorbs it.",
        ],
        body:
          "Responsible scaling means deciding in advance how new income is split between life quality, reserves, investment, tax planning, and business reinvestment. This makes growth feel rewarding without letting lifestyle inflation eat the entire gain.",
        mistakes: [
          "Letting new recurring expenses arrive before new assets.",
          "Treating every income jump as permanent.",
          "Reinvesting everything into the business while personal resilience stays thin.",
        ],
        connections: [
          "Keeping sets the savings rate.",
          "Protecting decides how much of a win becomes buffer.",
          "Growing compounds the portion you do not consume.",
        ],
        simulators: ["Lifestyle inflation visualizer"],
      }),
    ],
  },
  {
    id: "keeping",
    title: "Keeping Money",
    shortTitle: "Keeping",
    icon: WalletCards,
    accent: "#b45309",
    accentSoft: "rgba(180, 83, 9, 0.12)",
    description:
      "Cash flow, spending discipline, reserves, tax awareness, and the habits that turn income into capital.",
    role: "The conversion layer. Keeping money decides how much of what you make survives long enough to become wealth.",
    primarySimulators: [
      "Personal cash flow simulator",
      "Lifestyle inflation visualizer",
      "Emergency reserve calculator",
    ],
    lessons: [
      lesson({
        id: "keeping-1",
        title: "2.1 — The gap between earning and keeping",
        summary: [
          "The wealth gap is often not income; it is the leak between income and retained capital.",
          "Tax, lifestyle inflation, bad debt, avoidable costs, and uninsured shocks all sit in that gap.",
        ],
        body:
          "Keeping money is not miserly. It is the skill of making sure your income has somewhere productive to go before the world finds a way to spend it for you.",
        mistakes: [
          "Looking only at gross income.",
          "Ignoring irregular costs until they become debt.",
          "Treating tax and protection as afterthoughts.",
        ],
        connections: [
          "Making creates the inflow.",
          "Growing depends on the surplus.",
          "Protecting stops large leaks from becoming resets.",
        ],
      }),
      lesson({
        id: "keeping-2",
        title: "2.2 — Personal cash flow mastery",
        summary: [
          "Your personal life has a cash flow statement, whether you write it down or not.",
          "Paying yourself first means saving and investing are planned costs, not whatever happens to remain.",
        ],
        body:
          "The essential equation is simple: income minus expenses equals surplus. The profound part is giving that surplus a job before emotion, convenience, and lifestyle drift make the decision for you.",
        mistakes: [
          "Using bank balance as the only tracking system.",
          "Saving only at the end of the month.",
          "Optimizing tiny costs while ignoring the big structural numbers.",
        ],
        connections: [
          "The surplus funds emergency reserves and investing.",
          "Understanding debt changes how you judge cash flow quality.",
        ],
        simulators: ["Personal cash flow simulator"],
      }),
      lesson({
        id: "keeping-3",
        title: "2.3 — Lifestyle inflation — the silent killer",
        summary: [
          "Lifestyle inflation is what happens when spending expands to occupy every new income level.",
          "The cleanest wealth move is to enjoy some progress while banking a deliberate share of every increase.",
        ],
        body:
          "A founder can earn dramatically more and still feel no freer if obligations rise alongside income. Locking in parts of your lifestyle gives your future self room to own assets, absorb shocks, and choose better work.",
        mistakes: [
          "Turning temporary wins into permanent fixed costs.",
          "Using peer comparison as the spending benchmark.",
          "Assuming future income will always be higher.",
        ],
        connections: [
          "Growing shows the opportunity cost of each lifestyle step.",
          "Protecting improves when fixed costs are lower.",
        ],
        simulators: ["Lifestyle inflation visualizer"],
      }),
      lesson({
        id: "keeping-4",
        title: "2.4 — The emergency reserve",
        summary: [
          "A liquid reserve is the foundation that keeps a surprise from becoming a forced bad decision.",
          "It exists so you do not sell investments, borrow expensively, or accept desperate terms at exactly the wrong moment.",
        ],
        body:
          "The right reserve depends on fixed costs, income stability, dependents, and business volatility. It is usually held somewhere boring, accessible, and low risk because its job is not high return; its job is time and optionality.",
        mistakes: [
          "Investing the emergency reserve in volatile assets.",
          "Sizing the reserve by income instead of expenses and fragility.",
          "Calling credit cards an emergency fund.",
        ],
        connections: [
          "Protecting treats reserves as shock absorbers.",
          "Growing works better when you are not forced to sell in downturns.",
        ],
        simulators: ["Emergency reserve calculator"],
        glossaryTerms: ["Liquidity"],
      }),
      lesson({
        id: "keeping-5",
        title: "2.5 — Good costs vs. bad costs",
        summary: [
          "Not all spending deserves the same treatment.",
          "Good costs build capability, health, durable joy, or assets; bad costs quietly disappear without strengthening the machine.",
        ],
        body:
          "A useful spending system is not joyless frugality. It is a way to ask whether a cost improves your life or financial engine enough to justify the capital and future flexibility it consumes.",
        mistakes: [
          "Cutting capability-building costs while tolerating status costs.",
          "Treating every business-adjacent expense as an investment.",
          "Optimizing spending without checking whether the goal still matters.",
        ],
        connections: [
          "Making improves when you spend on capability.",
          "Understanding opportunity cost improves spending choices.",
        ],
      }),
      lesson({
        id: "keeping-6",
        title: "2.6 — Tax as a keeping skill",
        summary: [
          "Tax is one of the biggest differences between money earned and money kept.",
          "The principle is not loophole-chasing; it is structuring income, timing, and wrappers intelligently within the rules.",
        ],
        body:
          "Tax rules change and vary by country, so this app stays at the principle layer. The deeper work belongs in the companion Tax & Structures Lab and with qualified professionals who know the user's jurisdiction and full situation.",
        mistakes: [
          "Making financial decisions solely to reduce tax.",
          "Ignoring tax until after the income event.",
          "Copying strategies from another country, business, or life stage.",
        ],
        connections: [
          "Making, Growing, and Protecting all have tax layers.",
          "Your Financial Plan should include questions for an accountant or tax specialist.",
        ],
        companions: ["tax"],
        glossaryTerms: ["Tax wrapper", "BADR"],
      }),
      lesson({
        id: "keeping-7",
        title: "2.7 — Protecting against catastrophic loss",
        summary: [
          "Some losses are too large to solve with budgeting.",
          "Insurance, structures, reserves, and caution exist so one event does not erase years of disciplined keeping.",
        ],
        body:
          "The correct question is not whether insurance feels exciting. It is whether a specific low-probability, high-severity event could permanently damage your financial life and whether transferring that risk is worth the cost.",
        mistakes: [
          "Insuring small annoyances while leaving ruin risks uncovered.",
          "Buying insurance without understanding the risk being transferred.",
          "Assuming business structures protect personal life automatically.",
        ],
        connections: [
          "Protecting provides the risk-management framework.",
          "Understanding debt and liability clarifies what could go wrong.",
        ],
      }),
    ],
  },
  {
    id: "growing",
    title: "Growing Money",
    shortTitle: "Growing",
    icon: ChartNoAxesCombined,
    accent: "#2563eb",
    accentSoft: "rgba(37, 99, 235, 0.12)",
    description:
      "Investing principles, compounding, asset classes, diversification, fees, allocation, behaviour, and the founder's portfolio problem.",
    role: "The multiplier. Growing money turns retained capital into a second engine of wealth.",
    primarySimulators: [
      "Compound growth simulator",
      "Asset class behaviour simulator",
      "Fee eroder",
      "Asset allocation explorer",
      "Behaviour gap simulator",
      "Portfolio vs. business balance tool",
    ],
    lessons: [
      lesson({
        id: "growing-3a-1",
        track: "Track 3A — Foundations of Growth",
        title: "3A.1 — Why investing exists",
        summary: [
          "Saving keeps money available; investing puts money at risk so it can grow faster than inflation.",
          "The reason to invest is not excitement — it is that idle money quietly loses purchasing power over long horizons.",
        ],
        body:
          "Investing is the process of owning productive or scarce assets whose value or income can rise over time. The trade is uncertainty today for a better chance of preserving and growing future purchasing power.",
        mistakes: [
          "Treating cash as risk-free over decades.",
          "Investing before reserves and high-interest debt are handled.",
          "Thinking investing is only for market experts.",
        ],
        connections: [
          "Keeping creates investable surplus.",
          "Understanding inflation explains why saving alone is incomplete.",
        ],
        simulators: ["Inflation eroder", "Compound growth simulator"],
      }),
      lesson({
        id: "growing-3a-2",
        track: "Track 3A — Foundations of Growth",
        title: "3A.2 — Compound growth — the most important concept",
        summary: [
          "Compounding means returns begin earning returns of their own.",
          "Time matters so much because the curve starts quietly, then bends upward in a way human intuition underestimates.",
        ],
        body:
          "The hard part of compounding is psychological. Early years can look unimpressive, but the later years often contain most of the result because the base has become much larger.",
        mistakes: [
          "Waiting to start until the amount feels impressive.",
          "Interrupting the curve repeatedly.",
          "Underestimating how fees and taxes also compound against you.",
        ],
        connections: [
          "Making starts the contributions.",
          "Keeping keeps contributions consistent.",
          "Protecting keeps you from breaking the curve during shocks.",
        ],
        simulators: ["Compound growth simulator"],
        glossaryTerms: ["Compound growth"],
      }),
      lesson({
        id: "growing-3a-3",
        track: "Track 3A — Foundations of Growth",
        title: "3A.3 — Risk and return are linked",
        summary: [
          "There is no durable high return without some real risk.",
          "A promise of high return, low risk, and urgency should make you more suspicious, not more excited.",
        ],
        body:
          "Risk is the price paid for the possibility of higher return. It can mean volatility, permanent loss, illiquidity, leverage, fraud, inflation, or concentration, so the first job is naming which risk you are actually taking.",
        mistakes: [
          "Using one word, risk, for many different dangers.",
          "Ignoring downside because a return looks attractive.",
          "Believing complexity makes an investment safer.",
        ],
        connections: [
          "Protecting is about choosing which risks to accept, transfer, reduce, or avoid.",
          "Understanding cycles clarifies why returns are not smooth.",
        ],
        simulators: ["Asset class behaviour simulator"],
      }),
      lesson({
        id: "growing-3a-4",
        track: "Track 3A — Foundations of Growth",
        title: "3A.4 — Volatility vs. permanent loss",
        summary: [
          "A falling market price is volatility; a destroyed asset, scam, forced sale, or bankrupt company can be permanent loss.",
          "Time horizon determines whether volatility is noise you can survive or danger you cannot afford.",
        ],
        body:
          "Volatility feels like loss because account values move on a screen. The practical question is whether your plan, cash reserves, and asset quality allow you to stay invested long enough for volatility to remain temporary.",
        mistakes: [
          "Selling long-term assets because of short-term fear.",
          "Calling every decline a bargain.",
          "Taking volatility risk with money needed soon.",
        ],
        connections: [
          "Keeping provides liquidity so volatility does not force sales.",
          "Behaviour determines whether temporary drops become actual losses.",
        ],
        simulators: ["Asset class behaviour simulator", "Behaviour gap simulator"],
      }),
      lesson({
        id: "growing-3a-5",
        track: "Track 3A — Foundations of Growth",
        title: "3A.5 — Inflation as the baseline enemy",
        summary: [
          "Inflation is the hurdle every long-term plan must clear.",
          "Cash can be safe in nominal pounds while becoming weaker in real purchasing power.",
        ],
        body:
          "Inflation turns time into a cost for idle money. It does not mean cash is bad; it means cash has a role, and that role is liquidity and stability, not long-term growth.",
        mistakes: [
          "Holding all wealth in cash because price volatility feels scary.",
          "Ignoring real returns after inflation.",
          "Using short-term inflation headlines as an investment strategy.",
        ],
        connections: [
          "Understanding explains inflation's causes.",
          "Asset allocation balances growth needs against cash needs.",
        ],
        simulators: ["Inflation eroder"],
      }),
      lesson({
        id: "growing-3b-1",
        track: "Track 3B — The Asset Classes",
        title: "3B.1 — Equities (stocks)",
        summary: [
          "A share is ownership in a business, not a magic ticker symbol.",
          "Equities can reward long-term ownership of productive companies, but they can be brutally volatile in the short term.",
        ],
        body:
          "Owning one company concentrates judgement, luck, and risk. Owning a broad market spreads that exposure across many companies, sectors, countries, and management teams.",
        mistakes: [
          "Buying a stock because the product is familiar.",
          "Confusing a good company with a good price.",
          "Putting serious money into individual names without a process.",
        ],
        connections: [
          "Business analysis helps understand what an equity represents.",
          "Diversification decides how much single-company risk to take.",
        ],
        companions: ["business"],
        glossaryTerms: ["Equity", "Index fund", "ETF"],
      }),
      lesson({
        id: "growing-3b-2",
        track: "Track 3B — The Asset Classes",
        title: "3B.2 — Bonds and fixed income",
        summary: [
          "Bonds are lending money in exchange for promised payments.",
          "They usually aim to add income and stability, but they still carry interest-rate, inflation, and credit risk.",
        ],
        body:
          "Fixed income can dampen portfolio swings and match future spending needs. The trade is usually lower expected return than equities and sensitivity to interest rates.",
        mistakes: [
          "Assuming bonds cannot lose value.",
          "Ignoring inflation after fixed payments.",
          "Taking hidden credit risk to chase yield.",
        ],
        connections: [
          "Understanding interest rates explains bond prices.",
          "Protecting uses bonds as one possible stabilizer.",
        ],
        glossaryTerms: ["Bond", "Yield"],
      }),
      lesson({
        id: "growing-3b-3",
        track: "Track 3B — The Asset Classes",
        title: "3B.3 — Property",
        summary: [
          "Property can be tangible, income-producing, and leverageable.",
          "It can also be illiquid, concentrated, expensive to maintain, and operationally demanding.",
        ],
        body:
          "Property is one asset class, not a religion. Direct ownership, real estate investment trusts, and business-related property all have different risk, effort, tax, and liquidity profiles.",
        mistakes: [
          "Ignoring transaction costs and maintenance.",
          "Treating leverage as free upside.",
          "Letting familiarity substitute for diversification.",
        ],
        connections: [
          "Debt can amplify property outcomes in both directions.",
          "Tax and structures often matter deeply for property.",
        ],
        companions: ["tax", "business"],
        glossaryTerms: ["REIT", "Leverage", "Liquidity"],
      }),
      lesson({
        id: "growing-3b-4",
        track: "Track 3B — The Asset Classes",
        title: "3B.4 — Cash and cash equivalents",
        summary: [
          "Cash is not nothing; it is liquidity, safety, and optionality.",
          "Its weakness is that inflation can erode what it buys over long horizons.",
        ],
        body:
          "Cash is useful when the money has a job soon: emergencies, taxes, planned purchases, or dry powder for opportunities. It becomes risky when it is asked to do the job of long-term growth.",
        mistakes: [
          "Holding too little cash and becoming fragile.",
          "Holding too much cash and falling behind inflation.",
          "Confusing liquidity with wealth-building.",
        ],
        connections: [
          "Emergency reserves live here.",
          "Inflation sets the cost of overholding cash.",
        ],
      }),
      lesson({
        id: "growing-3b-5",
        track: "Track 3B — The Asset Classes",
        title: "3B.5 — Other assets briefly",
        summary: [
          "Commodities, private assets, alternatives, and newer assets can have a place, but complexity is not sophistication.",
          "The durable rule is simple: do not put meaningful money into what you cannot explain plainly.",
        ],
        body:
          "Other assets may diversify, speculate, hedge, or entertain. The app's job is not to ban them; it is to make sure they do not sneak into the core plan without clear purpose, sizing, and risk awareness.",
        mistakes: [
          "Mistaking novelty for edge.",
          "Using social proof as due diligence.",
          "Putting core wealth into assets with unclear liquidity and valuation.",
        ],
        connections: [
          "Scam recognition protects against hype.",
          "Asset allocation decides whether an asset belongs in the core or satellite bucket.",
        ],
      }),
      lesson({
        id: "growing-3c-1",
        track: "Track 3C — How to Actually Invest",
        title: "3C.1 — Index investing vs. active investing",
        summary: [
          "Index investing owns a broad market cheaply instead of trying to pick the winners.",
          "For non-professionals, a low-cost diversified default often beats expensive cleverness after fees and behaviour mistakes.",
        ],
        body:
          "Active investing can work for some, but the hurdle is high: skill, process, cost discipline, tax awareness, and temperament. Indexing accepts that the market is hard to beat and focuses on controllable factors.",
        mistakes: [
          "Assuming effort guarantees outperformance.",
          "Ignoring fees, taxes, and turnover.",
          "Calling short-term luck skill.",
        ],
        connections: [
          "Fees compound against active returns.",
          "Behaviour matters because simple plans are easier to stick with.",
        ],
        glossaryTerms: ["Index fund", "ETF", "Active management"],
      }),
      lesson({
        id: "growing-3c-2",
        track: "Track 3C — How to Actually Invest",
        title: "3C.2 — Diversification — not putting all eggs in one basket",
        summary: [
          "Diversification spreads risk across assets, companies, sectors, geographies, and currencies.",
          "It is powerful because it can reduce avoidable concentration risk without giving up the whole growth engine.",
        ],
        body:
          "Diversification will never make every investment feel exciting. Its job is to make sure no single judgement, event, client, country, or asset can decide your entire financial future.",
        mistakes: [
          "Owning many assets that all depend on the same risk.",
          "Confusing diversification with diworsification.",
          "Ignoring the business as part of total concentration.",
        ],
        connections: [
          "Protecting uses diversification as shock control.",
          "The founder portfolio should counterbalance business concentration.",
        ],
        simulators: ["Asset allocation explorer", "Portfolio vs. business balance tool"],
        glossaryTerms: ["Diversification", "Concentration risk"],
      }),
      lesson({
        id: "growing-3c-3",
        track: "Track 3C — How to Actually Invest",
        title: "3C.3 — Fees and costs — the silent return-killer",
        summary: [
          "A small annual fee can become a large lifetime cost because it compounds every year.",
          "Low cost is one of the few investment variables you can control before the future happens.",
        ],
        body:
          "A 1% fee sounds tiny until it is charged on a growing balance for decades. The visible cost is the fee; the hidden cost is the return that fee would have earned if it had stayed invested.",
        mistakes: [
          "Looking at fees in one-year isolation.",
          "Paying high fees without clear value.",
          "Ignoring platform, fund, advice, tax, and trading costs together.",
        ],
        connections: [
          "Tax drag behaves like another cost.",
          "Compounding magnifies both returns and frictions.",
        ],
        simulators: ["Fee eroder"],
      }),
      lesson({
        id: "growing-3c-4",
        track: "Track 3C — How to Actually Invest",
        title: "3C.4 — Asset allocation — the big decision",
        summary: [
          "Asset allocation is the mix of growth, stability, liquidity, and risk in the portfolio.",
          "It usually matters more than the exact product names inside each bucket.",
        ],
        body:
          "Allocation should reflect time horizon, goals, reserves, income stability, business concentration, and emotional tolerance. The right mix is one you can survive in a bad market and still respect in a good one.",
        mistakes: [
          "Choosing allocation by vibes or recent performance.",
          "Taking long-term risk with short-term money.",
          "Forgetting that the business is already a risky asset.",
        ],
        connections: [
          "Understanding cycles helps set expectations.",
          "Protecting asks whether the allocation can survive shocks.",
        ],
        simulators: ["Asset allocation explorer"],
      }),
      lesson({
        id: "growing-3c-5",
        track: "Track 3C — How to Actually Invest",
        title: "3C.5 — Tax wrappers supercharge investing",
        summary: [
          "Tax-efficient accounts can dramatically change long-term outcomes.",
          "The principle is to place growth in structures where the rules let more of the return stay yours.",
        ],
        body:
          "Country-specific wrappers such as ISAs, pensions, and other accounts vary by jurisdiction and change over time. This app explains the principle, then points to the Tax & Structures Lab and qualified professionals for exact implementation.",
        mistakes: [
          "Ignoring wrappers until the portfolio is large.",
          "Choosing investments before understanding account structure.",
          "Letting tax rules override suitability and risk.",
        ],
        connections: [
          "Tax touches Making, Keeping, Growing, and Protecting.",
          "Your plan should list wrapper questions for an adviser or accountant.",
        ],
        companions: ["tax"],
        glossaryTerms: ["ISA", "Pension", "Tax wrapper"],
      }),
      lesson({
        id: "growing-3c-6",
        track: "Track 3C — How to Actually Invest",
        title: "3C.6 — The behaviour problem",
        summary: [
          "The biggest threat to many portfolios is not the market; it is the investor's reaction to the market.",
          "Panic selling, chasing winners, overconfidence, and constant tinkering can turn a decent plan into a poor result.",
        ],
        body:
          "A boring plan that you can actually follow often beats an impressive plan that collapses under stress. Behaviour is why automation, written rules, and pre-decided actions matter.",
        mistakes: [
          "Changing strategy after every headline.",
          "Buying what just went up because it feels safe.",
          "Selling after declines without revisiting the original horizon.",
        ],
        connections: [
          "Protecting reduces panic by lowering fragility.",
          "Your investment policy statement turns principles into rules.",
        ],
        simulators: ["Behaviour gap simulator"],
      }),
      lesson({
        id: "growing-3c-7",
        track: "Track 3C — How to Actually Invest",
        title: "3C.7 — Pound-cost averaging and consistency",
        summary: [
          "Regular investing removes some emotion because the contribution happens in good markets and bad.",
          "It does not guarantee profit, but it helps the investor behave consistently when timing is unknowable.",
        ],
        body:
          "Pound-cost averaging is less about proving the mathematically perfect entry point and more about building a repeatable habit. It turns investing from a dramatic decision into part of the cash flow machine.",
        mistakes: [
          "Using consistency as an excuse to ignore unsuitable risk.",
          "Stopping contributions after downturns.",
          "Waiting forever for the perfect entry point.",
        ],
        connections: [
          "Cash flow mastery funds consistency.",
          "Behaviour improves when investing is automated.",
        ],
        glossaryTerms: ["Pound-cost averaging"],
      }),
      lesson({
        id: "growing-3d-1",
        track: "Track 3D — The Founder's Specific Situation",
        title: "3D.1 — Your business is already a concentrated bet",
        summary: [
          "A founder is usually already taking a large, illiquid, concentrated risk through the business.",
          "That means the personal portfolio often needs to be diversified, liquid, and boring on purpose.",
        ],
        body:
          "The portfolio does not need to copy the business's personality. Its job may be to make the founder's total life less fragile so the business can take smart risks without the whole household balance sheet depending on one outcome.",
        mistakes: [
          "Chasing more concentrated bets outside the business.",
          "Forgetting that salary and net worth may rely on the same company.",
          "Treating boring diversification as lack of ambition.",
        ],
        connections: [
          "Making and Growing are partners, not rivals.",
          "Protecting creates room for brave business decisions.",
        ],
        companions: ["business"],
        simulators: ["Portfolio vs. business balance tool"],
      }),
      lesson({
        id: "growing-3d-2",
        track: "Track 3D — The Founder's Specific Situation",
        title: "3D.2 — Liquidity and the founder",
        summary: [
          "Founders need liquid assets because business stress often arrives when credit, customers, and confidence are also tight.",
          "Liquidity buys time, calm, and negotiating power.",
        ],
        body:
          "Liquidity is not wasted ambition. It can be the difference between taking predatory terms, selling at the wrong time, or surviving long enough for the business to recover.",
        mistakes: [
          "Keeping every spare pound inside the company.",
          "Assuming investors or banks will be available during stress.",
          "Holding reserves in assets that fall with the business cycle.",
        ],
        connections: [
          "Emergency reserves are a keeping and protection tool.",
          "Understanding cycles explains why liquidity matters most when it is hardest to raise.",
        ],
      }),
      lesson({
        id: "growing-3d-3",
        track: "Track 3D — The Founder's Specific Situation",
        title: "3D.3 — What to do with a liquidity event",
        summary: [
          "A windfall is not just a bigger bank balance; it is a behaviour, tax, protection, and identity test.",
          "The first move is usually to slow down, protect, understand tax, and create rules before making irreversible decisions.",
        ],
        body:
          "Liquidity events can turn concentrated business value into flexible capital. The danger is moving from one concentrated risk into another without a plan, professional advice, or emotional decompression.",
        mistakes: [
          "Rushing into products or deals after the event.",
          "Ignoring tax timing and structure.",
          "Changing lifestyle before deciding the capital's long-term job.",
        ],
        connections: [
          "Tax planning should begin before the event where possible.",
          "Your Financial Plan becomes the decision filter.",
        ],
        companions: ["tax", "business"],
      }),
      lesson({
        id: "growing-3d-4",
        track: "Track 3D — The Founder's Specific Situation",
        title: "3D.4 — Reinvesting in your business vs. diversifying",
        summary: [
          "Reinvesting in the business can be rational when returns are high and risks are understood.",
          "It becomes dangerous when confidence, control, and familiarity hide total-life concentration.",
        ],
        body:
          "The founder's capital allocation question is not business versus portfolio. It is how much risk belongs in the business engine and how much should be moved into a different engine with different risks.",
        mistakes: [
          "Assuming the business always has the highest risk-adjusted return.",
          "Ignoring personal resilience while funding growth.",
          "Treating diversification as disloyalty to the business.",
        ],
        connections: [
          "Machine Simulator shows how allocation choices affect the whole life.",
          "Business Reality Check can stress-test reinvestment assumptions.",
        ],
        companions: ["business"],
        simulators: ["Machine Simulator", "Portfolio vs. business balance tool"],
      }),
    ],
  },
  {
    id: "protecting",
    title: "Protecting Money",
    shortTitle: "Protecting",
    icon: ShieldCheck,
    accent: "#7c3aed",
    accentSoft: "rgba(124, 58, 237, 0.12)",
    description:
      "Resilience, diversification, insurance, legal structures, scam awareness, and the discipline of avoiding ruin.",
    role: "The shock absorber. Protecting money makes sure one bad event does not undo the other four domains.",
    primarySimulators: [
      "Fragility test",
      "Resilience builder",
      "Ruin simulator",
      "Scam pattern recognizer",
    ],
    lessons: [
      lesson({
        id: "protecting-1",
        title: "4.1 — Fragility vs. resilience",
        summary: [
          "A fragile financial life has single points of failure.",
          "A resilient one can absorb shocks without selling the future at a discount.",
        ],
        body:
          "The goal is not to avoid all risk. The goal is to remove the risks that can break the machine while keeping the risks that are deliberate, sized, and potentially rewarding.",
        mistakes: [
          "Judging strength only by income.",
          "Ignoring dependence on one client, asset, currency, or person.",
          "Taking growth risk before basic buffers exist.",
        ],
        connections: [
          "Making needs redundant income over time.",
          "Keeping and Growing both fail when shocks force bad decisions.",
        ],
        simulators: ["Fragility test", "Resilience builder"],
      }),
      lesson({
        id: "protecting-2",
        title: "4.2 — Diversification as protection",
        summary: [
          "Diversification is not only a growth idea; it is protection against being wrong or unlucky in one place.",
          "Concentration can build wealth fast, but it can also destroy it fast.",
        ],
        body:
          "Diversification can apply to income sources, customers, asset classes, geographies, currencies, and counterparties. The right question is what would hurt everything at once.",
        mistakes: [
          "Counting many similar assets as diversified.",
          "Ignoring business concentration outside the portfolio.",
          "Chasing maximum upside with no survival plan.",
        ],
        connections: [
          "Growing uses diversification to improve risk-adjusted outcomes.",
          "Understanding cycles reveals hidden correlation.",
        ],
        simulators: ["Asset allocation explorer"],
      }),
      lesson({
        id: "protecting-3",
        title: "4.3 — Insurance — managing catastrophic risk",
        summary: [
          "Insurance is for risks that are unlikely but financially severe.",
          "You insure what could seriously damage the machine and self-insure what you can comfortably absorb.",
        ],
        body:
          "The principle is risk transfer. Insurance should be evaluated by the event, probability, severity, exclusions, cost, and whether your current reserves could handle it.",
        mistakes: [
          "Buying policies without reading exclusions.",
          "Over-insuring small costs and under-insuring ruin risks.",
          "Treating insurance as advice rather than a question for qualified professionals.",
        ],
        connections: [
          "Keeping determines what you can self-insure.",
          "Your plan should include professional questions about coverage.",
        ],
      }),
      lesson({
        id: "protecting-4",
        title: "4.4 — Legal structures as protection",
        summary: [
          "Legal structures can separate risks when used properly.",
          "Limited liability, contracts, and ringfencing are protection tools as well as tax and operational tools.",
        ],
        body:
          "The details are jurisdiction-specific, so this lesson stays at the principle layer. The companion Tax & Structures Lab is where the deeper structure work belongs.",
        mistakes: [
          "Assuming a company structure solves every liability.",
          "Mixing personal and business finances casually.",
          "Using structures without professional maintenance and documentation.",
        ],
        connections: [
          "Tax and protection are often the same conversation with different lenses.",
          "Business growth increases the need for risk boundaries.",
        ],
        companions: ["tax"],
      }),
      lesson({
        id: "protecting-5",
        title: "4.5 — The emergency reserve revisited",
        summary: [
          "The reserve is a protection device, not just a keeping habit.",
          "Its real value appears when it prevents a temporary shock from becoming a permanent setback.",
        ],
        body:
          "A reserve protects the investment curve, the business negotiation, the household, and the founder's decision quality. Its size should rise when income is volatile, dependents rely on you, or business concentration is high.",
        mistakes: [
          "Sizing reserves once and never revisiting them.",
          "Investing reserves for extra yield.",
          "Ignoring business-specific reserve needs.",
        ],
        connections: [
          "Keeping calculates the target.",
          "Growing benefits when reserves stop forced selling.",
        ],
        simulators: ["Emergency reserve calculator"],
      }),
      lesson({
        id: "protecting-6",
        title: "4.6 — Avoiding catastrophic mistakes",
        summary: [
          "Many small financial mistakes are recoverable; one ruin event may not be.",
          "Avoiding irreversible damage matters more than squeezing out the last bit of return.",
        ],
        body:
          "Ruin risk often hides in leverage, guarantees, fraud, concentration, legal exposure, and permanent lifestyle obligations. The founder's edge is not bravado; it is taking risks that are survivable.",
        mistakes: [
          "Using debt without a downside plan.",
          "Guaranteeing obligations casually.",
          "Betting the whole machine on one deal.",
        ],
        connections: [
          "Resilience enables aggression.",
          "Debt can be a tool or a trap depending on structure and survivability.",
        ],
        simulators: ["Ruin simulator"],
      }),
      lesson({
        id: "protecting-7",
        title: "4.7 — Scams, frauds, and \"too good to be true\"",
        summary: [
          "Scams often sell certainty, urgency, exclusivity, and social proof.",
          "If you cannot understand and explain the risk, the answer is no until you can.",
        ],
        body:
          "Wealth-builders get targeted because they have ambition and capital. A durable defense is to slow down, verify independently, reject pressure, and be especially cautious when the offer flatters your identity.",
        mistakes: [
          "Letting urgency override due diligence.",
          "Trusting returns that are both high and smooth.",
          "Confusing a referral with verification.",
        ],
        connections: [
          "Understanding markets helps separate uncertainty from fraud.",
          "Protecting the machine includes protecting your attention and judgement.",
        ],
        simulators: ["Scam pattern recognizer"],
      }),
    ],
  },
  {
    id: "understanding",
    title: "Understanding Money",
    shortTitle: "Understanding",
    icon: PieChart,
    accent: "#c026d3",
    accentSoft: "rgba(192, 38, 211, 0.12)",
    description:
      "Inflation, interest rates, debt, cycles, markets, credit, and the system every decision lives inside.",
    role: "The context layer. Understanding money gives every other domain better judgement.",
    primarySimulators: [
      "Inflation eroder",
      "Interest rate ripple",
      "Good debt vs. bad debt simulator",
      "Economic cycle visualizer",
    ],
    lessons: [
      lesson({
        id: "understanding-1",
        title: "5.1 — What money actually is",
        summary: [
          "Money is a store of value, medium of exchange, and unit of account.",
          "Modern money is also shaped by banks, credit, central banks, trust, and policy.",
        ],
        body:
          "The useful practical insight is that money is not a fixed natural object. Its supply, cost, and credibility move, which is why inflation, interest rates, and credit conditions matter to every financial plan.",
        mistakes: [
          "Thinking money is only cash in a bank account.",
          "Ignoring how credit creation affects the economy.",
          "Treating monetary policy as irrelevant background noise.",
        ],
        connections: [
          "Inflation affects Keeping and Growing.",
          "Interest rates affect debt, markets, property, and business conditions.",
        ],
      }),
      lesson({
        id: "understanding-2",
        title: "5.2 — Inflation — why money loses value",
        summary: [
          "Inflation means the same nominal money buys less over time.",
          "It is the quiet baseline that saving, investing, wages, and business pricing all have to beat.",
        ],
        body:
          "Inflation can come from demand, supply shocks, currency weakness, policy, expectations, and many other forces. The durable lesson is to think in real purchasing power, not just nominal numbers.",
        mistakes: [
          "Mistaking a larger number for a richer outcome.",
          "Ignoring inflation in long-term cash decisions.",
          "Reacting to inflation with extreme bets instead of a plan.",
        ],
        connections: [
          "Growing exists partly because inflation taxes idle money.",
          "Making must price work and products with cost changes in mind.",
        ],
        simulators: ["Inflation eroder"],
      }),
      lesson({
        id: "understanding-3",
        title: "5.3 — Interest rates — the price of money",
        summary: [
          "Interest rates are the price of borrowing and the reward for lending.",
          "When rates move, they ripple through savings, mortgages, business investment, asset prices, and sentiment.",
        ],
        body:
          "Central banks influence rates to manage inflation and economic conditions. You do not need to predict every move, but you should understand why rate regimes change the environment around your decisions.",
        mistakes: [
          "Assuming low-rate strategies work in high-rate environments.",
          "Ignoring refinance risk.",
          "Looking at investment returns without comparing the risk-free alternative.",
        ],
        connections: [
          "Debt, property, bonds, and business valuations all respond to rates.",
          "Cycles often turn when money becomes easier or harder.",
        ],
        simulators: ["Interest rate ripple"],
      }),
      lesson({
        id: "understanding-4",
        title: "5.4 — Debt — tool or trap",
        summary: [
          "Debt is neither automatically good nor automatically bad.",
          "It builds wealth when used deliberately against productive assets and destroys wealth when it funds depreciating consumption without a repayment engine.",
        ],
        body:
          "The important questions are what the borrowed money buys, what cash flow repays it, what happens if rates rise or income falls, and whether the downside is survivable.",
        mistakes: [
          "Using debt because monthly payments feel affordable.",
          "Ignoring rate, term, collateral, and recourse.",
          "Calling all leverage sophisticated.",
        ],
        connections: [
          "Property and business use debt differently from consumer spending.",
          "Protecting asks whether debt can create ruin risk.",
        ],
        simulators: ["Good debt vs. bad debt simulator"],
        glossaryTerms: ["Leverage"],
      }),
      lesson({
        id: "understanding-5",
        title: "5.5 — Economic cycles",
        summary: [
          "Booms and busts are normal parts of economic life.",
          "Understanding cycles helps you avoid panic in downturns and overconfidence in booms.",
        ],
        body:
          "Cycles affect jobs, funding, customer demand, rates, asset prices, and opportunities. Being counter-cyclical often means building resilience before stress and staying able to act when others cannot.",
        mistakes: [
          "Extrapolating good times forever.",
          "Treating downturns as the end of the world.",
          "Keeping no liquidity for opportunity.",
        ],
        connections: [
          "Making and customer acquisition are cycle-sensitive.",
          "Growing requires behaviour discipline through cycles.",
        ],
        companions: ["business", "customer"],
        simulators: ["Economic cycle visualizer"],
      }),
      lesson({
        id: "understanding-6",
        title: "5.6 — Markets and asset prices",
        summary: [
          "Asset prices move because fundamentals, expectations, liquidity, rates, and emotion all interact.",
          "Markets are not pure casinos, but they are not perfectly rational day to day either.",
        ],
        body:
          "Short-term market movement is hard to predict because expectations update constantly. Longer-term results are more connected to earnings, cash flows, productivity, valuation, and inflation.",
        mistakes: [
          "Confusing a market story with a forecast.",
          "Assuming every price move has one clean explanation.",
          "Letting news cycles become portfolio policy.",
        ],
        connections: [
          "Behaviour protects you from overreacting to price noise.",
          "Asset allocation recognizes uncertainty instead of pretending it away.",
        ],
      }),
      lesson({
        id: "understanding-7",
        title: "5.7 — Credit and your relationship with the financial system",
        summary: [
          "Credit is how the financial system estimates whether you can be trusted with borrowed money.",
          "A strong credit profile can create flexibility, but borrowing capacity is not the same as wisdom.",
        ],
        body:
          "Credit scores, income stability, debt-to-income ratios, collateral, payment history, and documentation all shape how lenders see you. The practical move is to be legible and reliable without becoming overleveraged.",
        mistakes: [
          "Maximizing credit instead of resilience.",
          "Ignoring documentation until financing is needed.",
          "Treating borrowing capacity as permission.",
        ],
        connections: [
          "Making and Keeping affect creditworthiness.",
          "Protecting keeps debt from becoming fragility.",
        ],
      }),
      lesson({
        id: "understanding-8",
        title: "5.8 — Taxes and government in the economy",
        summary: [
          "Government taxes, spending, and policy shape the environment where money moves.",
          "For the individual, the durable skill is understanding incentives without pretending rules are permanent.",
        ],
        body:
          "Tax policy affects business structure, household cash flow, investment account choice, property, inheritance, and exits. The specifics belong with current local rules and professionals; the principle is that tax is a layer across the machine.",
        mistakes: [
          "Building a plan around one fragile tax assumption.",
          "Ignoring policy risk.",
          "Using tax avoidance language where compliance and advice are required.",
        ],
        connections: [
          "Tax touches Making, Keeping, Growing, and Protecting.",
          "The Tax & Structures Lab handles the deep work.",
        ],
        companions: ["tax"],
      }),
    ],
  },
];

export const connectionLessons: ConnectionLesson[] = [
  lesson({
    id: "connections-1",
    title: "6.1 — The full machine",
    summary: [
      "Money is made, kept, grown, protected, and interpreted inside an economic system.",
      "Remove any domain and the machine runs poorly, even if another part looks impressive.",
    ],
    body:
      "The full machine is the point of the app. Earned income becomes retained surplus, surplus becomes capital, capital becomes a second engine, protection keeps shocks from breaking the loop, and understanding improves decisions at every step.",
    mistakes: [
      "Overbuilding the domain you already like.",
      "Solving investment questions before basic cash flow and risk questions.",
      "Ignoring the context layer until a crisis arrives.",
    ],
    connections: ["All five domains are one system."],
    simulators: ["Machine Simulator"],
  }),
  lesson({
    id: "connections-2",
    title: "6.2 — Income → Capital → Income (the wealth loop)",
    summary: [
      "The central wealth loop is earned income becoming saved capital becoming invested capital becoming investment income.",
      "Over time, the second engine can reduce dependence on the first.",
    ],
    body:
      "The loop is simple enough to remember and difficult enough to live. The machine gets powerful when each cycle sends more capital forward and less energy is lost to spending drift, tax drag, fees, panic, and ruin events.",
    mistakes: [
      "Skipping the capital stage.",
      "Interrupting investment income before it compounds.",
      "Mistaking income growth alone for the loop.",
    ],
    connections: ["Making feeds Keeping; Keeping feeds Growing; Protecting preserves the loop."],
  }),
  lesson({
    id: "connections-3",
    title: "6.3 — Your business and your portfolio are partners",
    summary: [
      "The business is the concentrated, high-effort, illiquid engine.",
      "The portfolio should often be the diversified, low-effort, liquid counterweight.",
    ],
    body:
      "A founder does not need every asset to be entrepreneurial. The portfolio can provide the calm base that lets the business engine take bold but survivable risks.",
    mistakes: [
      "Making the portfolio as concentrated as the business.",
      "Counting business value as if it were liquid.",
      "Underfunding personal resilience while chasing business upside.",
    ],
    connections: ["Making, Growing, and Protecting meet in the founder balance sheet."],
    companions: ["business"],
    simulators: ["Portfolio vs. business balance tool"],
  }),
  lesson({
    id: "connections-4",
    title: "6.4 — Tax touches everything",
    summary: [
      "Tax is not a separate room; it is wiring through the whole machine.",
      "It affects structures, salary and dividends, savings accounts, investment wrappers, exits, gifts, property, and protection.",
    ],
    body:
      "The principle is to think about tax early enough that structure and timing are still available choices. The specifics are professional territory because jurisdiction, income type, and personal facts matter.",
    mistakes: [
      "Thinking about tax only after a transaction.",
      "Optimizing tax while worsening risk or liquidity.",
      "Using generic internet advice for specific legal choices.",
    ],
    connections: ["Tax shapes Making, Keeping, Growing, and Protecting."],
    companions: ["tax"],
  }),
  lesson({
    id: "connections-5",
    title: "6.5 — Time is the multiplier across all domains",
    summary: [
      "Time multiplies compound growth, business skill, tax planning windows, pension growth, gifting timelines, reputation, and customer learning.",
      "Impatience is expensive because many financial advantages only become obvious after years.",
    ],
    body:
      "Time is the one asset everyone underuses while searching for cleverness. The earlier the machine is built, the more the user can let rules, habits, and compounding do work in the background.",
    mistakes: [
      "Waiting for perfect clarity before starting small good habits.",
      "Breaking long-term rules because the first few years feel slow.",
      "Leaving time-sensitive tax or structure planning until late.",
    ],
    connections: ["Every domain rewards long horizons differently."],
  }),
  lesson({
    id: "connections-6",
    title: "6.6 — Resilience enables aggression",
    summary: [
      "Protection is not the opposite of ambition.",
      "Reserves, diversification, insurance, and lower fragility can give a founder permission to take bold business risks without betting the household.",
    ],
    body:
      "The protected founder can say no to bad terms, survive a slow quarter, invest through a downturn, and make hard strategic choices from strength. Resilience is the launchpad for aggression that does not become recklessness.",
    mistakes: [
      "Equating caution with weakness.",
      "Taking brave risks with fragile foundations.",
      "Failing to separate business downside from personal ruin.",
    ],
    connections: ["Protecting strengthens Making and Growing."],
  }),
  lesson({
    id: "connections-7",
    title: "6.7 — The sequencing of a financial life",
    summary: [
      "The domains have a rough order, but the order is not rigid.",
      "Make before you can keep, keep before you can grow, understand throughout, and protect more as there is more to lose.",
    ],
    body:
      "Early stages emphasize income and habits. Middle stages emphasize investment systems and risk control. Later stages emphasize tax, legacy, resilience, and decision quality. The right next move depends on the weakest part of the current machine.",
    mistakes: [
      "Following someone else's stage.",
      "Buying advanced strategies before the base is stable.",
      "Ignoring protection until after assets are exposed.",
    ],
    connections: ["The Hub's weakest-domain indicator is a sequencing guide."],
  }),
  lesson({
    id: "connections-8",
    title: "6.8 — Where the user is now",
    summary: [
      "The useful curriculum is the one that meets the user's actual machine.",
      "Mapping current strengths and gaps turns broad financial education into a focused next step.",
    ],
    body:
      "The self-assessment is not a grade. It is a diagnostic: where is the machine strong, where is it absent, where is it fragile, and which small move would improve the whole system fastest?",
    mistakes: [
      "Mistaking confidence for coverage.",
      "Avoiding the weakest domain because it feels unfamiliar.",
      "Trying to fix all domains in one weekend.",
    ],
    connections: ["Your Financial Plan translates the map into actions."],
    simulators: ["Machine Simulator"],
  }),
];

export const glossary: Record<string, string> = {
  "Active income": "Money earned through direct effort, such as salary, consulting, or client delivery.",
  "Passive income":
    "Income that requires less ongoing labour after the asset or system exists. It is usually a spectrum, not magic money.",
  Equity: "Ownership in an asset or company after debts and obligations are considered.",
  "Unit economics":
    "The revenue, cost, and profit characteristics of one customer, product, unit, or transaction.",
  Leverage:
    "Using something beyond your own hours or capital to amplify outcomes, including people, code, debt, distribution, or equity.",
  Liquidity: "How quickly and reliably an asset can become spendable money without a large loss.",
  "Concentration risk": "The risk of too much wealth, income, or exposure depending on one thing.",
  "Tax wrapper":
    "A legally defined account or structure that changes how income, growth, or withdrawals are taxed.",
  BADR: "Business Asset Disposal Relief, a UK tax relief with qualification rules that can change and require professional advice.",
  "Compound growth": "Growth where returns themselves begin earning returns.",
  "Index fund": "A fund designed to track a broad market or index rather than pick individual winners.",
  ETF: "Exchange-Traded Fund; a fund that trades on an exchange, often used for low-cost diversified exposure.",
  Bond: "A loan to a government or company, usually with promised interest and repayment terms.",
  Yield: "Income return from an investment, often expressed as a percentage.",
  REIT: "Real Estate Investment Trust; a pooled vehicle for owning property-related assets.",
  "Active management": "An approach that tries to beat a benchmark through selection, timing, or strategy.",
  Diversification: "Spreading exposure so one event or judgement does not dominate the outcome.",
  ISA: "Individual Savings Account, a UK tax-efficient wrapper subject to current rules and allowances.",
  Pension:
    "A retirement-focused account or arrangement with tax rules, access restrictions, and jurisdiction-specific details.",
  "Pound-cost averaging":
    "Investing a fixed amount regularly over time rather than trying to pick a perfect entry point.",
};

export const mentorSuggestions = [
  "How do my five domains connect for my specific situation?",
  "I have surplus income each month — walk me through my options across the domains",
  "My wealth is all in my business — what does that mean for everything else?",
  "Where is my financial machine weakest right now?",
  "Explain compound growth like I really need to get it",
  "What's the difference between being a high earner and being wealthy?",
  "How should I think about a windfall or liquidity event?",
  "What should I be asking a financial adviser?",
];

export const sectionNav: Array<{
  id: SectionId;
  label: string;
  icon: LucideIcon;
}> = [
  { id: "hub", label: "Hub", icon: Network },
  { id: "making", label: "Making", icon: Banknote },
  { id: "keeping", label: "Keeping", icon: WalletCards },
  { id: "growing", label: "Growing", icon: ChartNoAxesCombined },
  { id: "protecting", label: "Protecting", icon: ShieldCheck },
  { id: "understanding", label: "Understanding", icon: PieChart },
  { id: "connections", label: "Connections", icon: Network },
  { id: "plan", label: "Plan", icon: LockKeyhole },
];

export const externalLinkIcon = ExternalLink;
