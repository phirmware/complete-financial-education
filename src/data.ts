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
  // Anatomy sections
  intuition?: string;
  mechanism?: string;
  workedExample?: string;
  deeperPrinciple?: string;
  nuance?: string;
  expertInsight?: string;
  questionsToAsk?: string[];
  goDeeper?: string;
  mistakes: string[];
  connections: string[];
  companions?: CompanionId[];
  simulators?: string[];
  glossaryTerms?: string[];
  flowChartId?: string;
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
        flowChartId: "cash-flow-split",
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
        intuition: `Before any mechanics, consider what problem compounding solves. You earn money. You want it to grow. But if growth is simple — 8% on the original amount every year — then £10,000 grows by a flat £800 every year. That's arithmetic. The insight that created modern investing is that the £800 earned in year one can itself earn 8% in year two. Then the £864 earns 8% in year three. The base keeps expanding — the original capital isn't doing all the work anymore, previous returns are doing work too.\n\nCompound growth is what happens when returns are not paid out or spent, but instead folded back into the base and allowed to grow again. Every period's return becomes next period's principal. This is the whole game.`,
        mechanism: `Start with £10,000 at 8% per year, no additional contributions:\n\nEnd of Year 1: £10,000 × 1.08 = £10,800\nEnd of Year 2: £10,800 × 1.08 = £11,664 (not £11,600 — the extra £64 came from last year's gain growing)\nEnd of Year 3: £11,664 × 1.08 = £12,597\nEnd of Year 10: £21,589\nEnd of Year 20: £46,610\nEnd of Year 30: £100,627\n\nThe same £10,000 at 8% for 30 years becomes over £100,000. The first decade adds £11,589. The last decade alone adds £54,017. This is the curve that's flat-then-steep — and why human intuition almost always underestimates it.\n\nThe Rule of 72 is a useful shortcut: divide 72 by the interest rate to find approximate doubling time. At 6%, money doubles every 12 years. At 8%, every 9 years. At 4%, every 18 years. This makes rate and time differences immediately legible.`,
        workedExample: `Two people, both aiming to retire at 65.\n\nAlex starts investing at 25. She puts in £300/month for 40 years at 7% per year. She contributes £144,000 in total.\n\nBen starts at 35. He puts in £600/month for 30 years at the same 7%. He contributes £216,000 in total — 50% more actual money than Alex.\n\nAt 65:\n— Alex's portfolio: approximately £803,000\n— Ben's portfolio: approximately £681,000\n\nAlex contributed less money but ends up with more, because she had ten extra years of compounding working. Those first ten years — where the amounts looked unimpressive — ended up creating more eventual wealth than the extra £72,000 Ben contributed.\n\nThe principle is stark: time beats contribution rate. Starting early beats starting big.`,
        deeperPrinciple: `The underlying principle is that small recurring percentages applied to a growing base become enormous over long periods. This principle appears identically in everything that compounds:\n\n— A 1.5% annual fund fee on a £500,000 portfolio over 20 years costs approximately £230,000 in lost compound growth — roughly half the portfolio's potential.\n— Inflation at 4% halves purchasing power in 18 years (Rule of 72: 72 ÷ 4 = 18).\n— A savings rate increase of just 5% of income, invested consistently for 30 years, creates wealth that feels wildly disproportionate to the small change.\n\nThe same mechanism grows your portfolio and destroys it through fees, debt interest, and inflation. There is one mathematical engine — it runs for you or against you depending on direction.`,
        nuance: `Compound growth has real limits and conditions the simple story skips:\n\n— Sequence of returns risk: the order of returns matters, not just the average. If you retire into a bad market and must withdraw while assets are falling, you permanently destroy the compounding engine. A 30-year average return of 7% does not protect you if the first 5 years of retirement are -20%.\n\n— Taxes interrupt compounding. Tax on dividends, capital gains, and withdrawals all reduce the effective compound rate. Tax wrappers exist precisely to preserve more of the compounding by deferring or eliminating that drag.\n\n— Real vs nominal: 8% compound growth in a 4% inflation environment is only 4% in real (purchasing power) terms. Always check what the return buys, not just what it is numerically.\n\n— The rule breaks down at extremes. At very high or variable rates, the Rule of 72 loses accuracy. It's an intuition tool, not a calculator.`,
        expertInsight: `Most people focus on return rate when they should focus on uninterrupted time. A 7% return running undisturbed for 30 years does far more than a 10% return that gets interrupted every few years by panic selling, debt emergencies, or spending the gains.\n\nFinancial planners think differently from how most savers think. They focus on "not breaking the curve" — avoiding the forced sales, the lifestyle drains, the expensive divorces, the debt emergencies that pull money out of the compounding engine. The mathematics of compounding is not complex. The discipline to leave the machine running through a 30% market drop is where most of the value is lost or preserved.`,
        questionsToAsk: [
          "What is the compound annualised growth rate (CAGR) of this portfolio or fund over the recommended time horizon, after all fees?",
          "How does the sequence of returns affect my plan — what happens to my projected outcome if markets fall significantly in the first five years after I retire?",
          "How much of my projected final portfolio value comes from my contributions versus compound growth, at your recommended asset allocation?",
          "What is the after-tax, after-inflation expected compound return of what you're recommending for my specific tax situation?",
        ],
        goDeeper: `The Psychology of Money by Morgan Housel — particularly the chapter 'The Seduction of Pessimism' — explains why humans systematically underestimate long-term compounding. It is the most readable account of why this concept is hard to feel even when you understand it intellectually.\n\nThe Compound Effect by Darren Hardy applies the same mathematics to habits and skills — useful for seeing the pattern outside pure finance.\n\nFor the mathematical core, any finance textbook's "Time Value of Money" section covers the formulas. But the intuition matters more than the formula — the goal is to feel the curve in your gut, not to derive it.`,
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
        flowChartId: "compound-mechanism",
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
        intuition: `Why does the relationship between risk and return exist at all? Because no rational investor would take risk without compensation. If a safe government bond yields 4.5%, why would anyone buy a risky stock that might lose 30% in a bad year — unless there was a meaningful chance of earning more than 4.5% over time?\n\nThe risk premium is the additional return investors demand for bearing uncertainty. If high-return assets were also low-risk, everyone would pile in, bidding up prices until the expected return fell. The market continuously adjusts until risk and expected return are roughly in line. This is not a law of physics — it's a consequence of how rational actors behave. Which means: any investment offering high expected return with low risk should immediately raise the question of what risk is being hidden or mispriced.`,
        mechanism: `Risk in investing is not one thing — it's several distinct dangers that get compressed under one label:\n\n— Volatility risk: the price goes up and down, sometimes dramatically. This is real but temporary if the underlying asset has value and you have time.\n— Permanent loss risk: the company goes bankrupt, the fraud is exposed, the asset becomes worthless. This is different from volatility — it does not recover.\n— Liquidity risk: you cannot get your money out when you need it without a large discount.\n— Inflation risk: your investment "grows" nominally but loses purchasing power.\n— Concentration risk: too much exposure to one outcome.\n— Leverage risk: borrowed money amplifies losses as well as gains.\n\nThe skilled investor's job is not to minimise all risk — that would just mean holding cash and losing to inflation. It's to take the risks that are compensated (volatility over long horizons, equity risk) and avoid the uncompensated risks (permanent loss, leverage blowing up, fraud).`,
        workedExample: `Consider three investments:\n\n1. UK Government bond (gilt): approximately 4.5% per year, very low default risk, price fluctuates with interest rates.\n2. Global stock market index: approximately 7–9% historical average return per year, but with years of -30% to -50% possible.\n3. An unlisted start-up: potential return of 10x in 5 years, or 100% loss. Illiquid — you cannot sell.\n\nNone of these is "better." Each represents a different risk/return trade-off:\n— The gilt is right for capital you need in 2 years.\n— The index is right for capital with a 15+ year horizon where volatility is survivable.\n— The start-up is appropriate only if you understand the sector deeply and can afford to lose everything in that position.\n\nThe mistake is not taking too much risk or too little — it's taking the wrong kind of risk for your time horizon and situation.`,
        deeperPrinciple: `The deeper principle is the asymmetry of outcomes. Avoiding a 50% loss is mathematically more valuable than capturing a 50% gain. If you have £100,000 and lose 50%, you have £50,000. To get back to £100,000, you now need a 100% gain — double the loss percentage.\n\nThis asymmetry explains why professional investors care so much about "not losing" and why Warren Buffett's rule 1 is "don't lose money." It's not caution for its own sake — it's because loss requires disproportionate recovery. Protecting capital is mathematically more efficient than trying to gain extra return.`,
        nuance: `The relationship between risk and return is a long-run tendency, not a rule that holds in every time period. In any given year, markets can go up while risk increases, or go down while risk decreases. Over short windows, risk and return decouple.\n\nAlso: volatility is not the only measure of risk, and arguably not the most important one. For a long-term investor, volatility is just noise. The real risk is permanent loss — whether through fraud, bankruptcy, forced sale at the wrong time, or leverage blowing up. Optimising for low volatility at the expense of accepting higher permanent-loss risk (e.g., holding lots of individual stocks to "reduce volatility" because you pick stable ones) can make your situation worse, not better.`,
        expertInsight: `The non-obvious insight professionals have is that "high Sharpe ratio" (good return per unit of risk) strategies often contain hidden risks that don't show up in normal conditions. A strategy that returns 12% every year for 9 years but loses 80% in year 10 looks amazing in the spreadsheet until year 10. Many financial catastrophes had excellent risk-adjusted returns right up until they didn't.\n\nExperts are suspicious of smooth returns. Real risk looks bumpy. Smooth returns in a genuinely risky asset class usually mean risk is being hidden, mismeasured, or taken on credit — and the bill arrives later.`,
        questionsToAsk: [
          "What specific risks am I taking with this investment, and which of those risks are compensated versus uncompensated?",
          "What is the worst realistic outcome for this investment, and is that loss permanently damaging or temporarily uncomfortable for my situation?",
          "How does this investment's expected return compare to a government bond right now — and what is the risk premium I am earning?",
          "Has this strategy or fund ever experienced a severe drawdown — and if so, how long did it take to recover?",
        ],
        goDeeper: `Against the Gods: The Remarkable Story of Risk by Peter Bernstein is the most compelling account of how humans learned to think about risk over centuries. The Most Important Thing by Howard Marks (specifically the chapters on risk) is essential for serious investors. For a tighter read: any of Howard Marks's investor memos from Oaktree, available free online, cover risk with unusual depth.`,
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
        flowChartId: "risk-spectrum",
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
        intuition: `Why does this choice exist? Because investing in markets looked, for a long time, like a competition of skill — pick the right stocks, time the market, hire smart managers. Then researchers started measuring what actually happened. The data showed something uncomfortable: the majority of professional fund managers, over long periods, underperform the market average after fees. Not because they're unintelligent — the opposite. The market they're trying to beat is made up of people exactly as smart as them, using the same information.\n\nIndex investing is the response to that data. If you can't reliably beat the market, own the market cheaply. Capture the whole economy's growth instead of trying to identify which part of it will grow fastest.`,
        mechanism: `An index is simply a list: the 500 largest US companies, or all publicly traded UK stocks, or the global equity market. An index fund mechanically owns a proportional slice of everything on the list, and rebalances when the list changes. There is no manager trying to pick winners.\n\nWhy do most active managers underperform after fees? Several structural reasons:\n\n1. Zero-sum before costs: every active manager who outperforms has another active manager who underperformed. The market return is the average before costs. After costs (fees, trading costs, taxes from turnover), the average active manager must underperform by approximately the amount of those costs.\n\n2. The information problem: markets aggregate the views of millions of participants. For a manager to beat the market, they need information or insight others don't have — which is both legally constrained (insider trading laws) and operationally rare.\n\n3. Survivorship bias: the funds that failed or merged aren't in the "long-term active performance" data. The data looks better than it is because only surviving funds are counted.\n\nIndex funds win on cost (typically 0.05–0.2% per year versus 0.5–1.5%+ for active), tax efficiency (less turnover means fewer taxable events), and consistency (you get the market return reliably).`,
        workedExample: `£50,000 invested for 30 years at 7% market return:\n\n— Active fund at 1.2% annual fee → effective return 5.8% → final value: approximately £283,000\n— Index fund at 0.15% annual fee → effective return 6.85% → final value: approximately £375,000\n\nThe difference is £92,000 — almost double the original investment — paid not in visible fees but in foregone compound growth. The 1.05% fee difference becomes enormous because it compounds every year on a growing base.\n\nThis is before accounting for tax drag from the higher turnover in active funds, which widens the gap further.`,
        deeperPrinciple: `Controllable factors compound too. You cannot control market returns. You can control costs, taxes, and your own behaviour. Index investing optimises the things you control — it's a strategy of accepting uncertainty about returns while eliminating the certain drag of high costs and manager underperformance.\n\nThis principle transfers: whenever you face a decision under uncertainty, focus on the variables you can control (costs, time horizon, diversification, behaviour) rather than trying to predict the unpredictable (which fund manager will be lucky, which stock will outperform).`,
        nuance: `Active management is not always wrong or always right — it depends on the market and the manager:\n\n— In less efficient markets (small-cap stocks, private markets, emerging markets), information is less uniformly distributed and skilled active managers have had more success.\n— Index investing in a concentrated index (like UK large-cap) means you're exposed to whatever that index happens to hold a lot of. If 20% of the index is in three companies, you hold that concentration.\n— Not all index funds are equal. Factors like how the index is constructed, rebalancing frequency, lending securities, and tracking error all affect the return.\n— For founders with specific sector knowledge — someone who genuinely understands the SaaS business model better than the average investor — selective concentration in what they deeply understand may be defensible. But this is the rare exception, not the rule.`,
        expertInsight: `The uncomfortable truth professionals know is that most investors who try active management end up doing worse than the index not because the active funds necessarily underperform — though many do — but because the investors in those funds buy high and sell low. They chase past performance, sell during downturns, and switch managers at exactly the wrong time.\n\nA boring index fund owned for 30 years, left alone through crashes, typically beats a better-performing active fund whose owners panic sell every time the market drops 20%. The strategy is less than half the outcome. The behaviour around the strategy is the other half.`,
        questionsToAsk: [
          "What is the total cost of ownership for this fund — including management fee, OCF (ongoing charges figure), platform fee, and any trading costs?",
          "What is this fund's long-run performance versus its benchmark, net of fees, over 10 and 20 years? How does that compare to a simple index fund in the same category?",
          "Is this an actively managed fund or index/passive? If active, what is the manager's edge — what specifically gives them a structural advantage over other professional investors in this market?",
          "What is the tax efficiency of this fund? What is its historical turnover rate?",
        ],
        goDeeper: `A Random Walk Down Wall Street by Burton Malkiel makes the empirical case with decades of data. The Little Book of Common Sense Investing by John Bogle (founder of Vanguard) is the definitive argument for index investing from the person who created it. SPIVA (S&P Indices Versus Active) publishes annual data on how active managers perform versus benchmarks globally — freely available online and updated regularly.`,
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
        intuition: `Why does diversification work? Because different assets don't move in perfect lockstep. When one company reports bad earnings and its stock falls 20%, other companies are unaffected (or even benefit if customers switch to them). When UK property has a bad decade, global equities might have a good one. When interest rates rise and bonds fall, cash becomes more attractive.\n\nThe insight — called the "free lunch" by economist Harry Markowitz — is that combining assets that don't move together can reduce the overall volatility of a portfolio without proportionally reducing its expected return. You give up some upside in each individual asset but you reduce the swings of the total. This is mechanically real, not just intuition.`,
        mechanism: `The mechanism works through correlation. Correlation measures how much two assets move together, from +1 (perfect lockstep) to -1 (perfect opposites) to 0 (completely independent).\n\nIf you own two assets with correlation of +1, combining them does nothing — they rise and fall together. If you own two assets with correlation of 0 (uncorrelated), combining them in a portfolio reduces the portfolio's volatility below the average volatility of the two assets. You get the average return but less than the average risk.\n\nIn practice, few assets are truly uncorrelated — in a severe crisis, correlations tend to rise towards +1 as investors sell everything for cash. But under normal conditions, diversification across asset classes (equities, bonds, property, cash), geographies, sectors, and currencies does meaningfully reduce concentration risk.`,
        workedExample: `Imagine two assets, each with 15% annual volatility (standard deviation of returns):\n\n— If they're perfectly correlated (+1): combined volatility = 15%. No benefit.\n— If they're uncorrelated (0): combined volatility ≈ 10.6%. Portfolio swing is 30% smaller than either individual holding.\n— If they're negatively correlated (-0.5): combined volatility ≈ 8.7%. Even less swing.\n\nFor a real example: a UK equity/bond split has historically shown lower combined volatility than either asset alone in most market environments, because they tend to move in opposite directions when economic conditions change. In 2022, both fell together — which is the exception covered in the nuance section.`,
        deeperPrinciple: `Diversification is a statement about epistemic humility. You are not confident enough in any single outcome to bet your financial life on it. You don't know which company, sector, or country will perform best over the next 20 years. Neither does anyone else.\n\nThis principle applies beyond portfolios: diversifying your income sources, your customer base, your skill set, your supply chain — all reduce the damage from being wrong in any one place. The founder who derives 90% of revenue from one customer is not undiversified because they lack imagination; they're undiversified because the business is young or highly concentrated. Recognising that is the first step to addressing it.`,
        nuance: `Diversification has important limits:\n\n— Systematic risk (market-wide risk) cannot be diversified away. In a global financial crisis, most equity markets fall together. Diversification within equities doesn't protect against a global equity crash.\n— Over-diversification is possible. Owning 500 individual stocks doesn't add much beyond owning an index fund, but adds costs and complexity. At some point, more holdings stop reducing risk and start reducing concentration in your best ideas.\n— Correlation is not stable. Assets that seem uncorrelated in normal markets can become correlated in a crisis — "risk-off" events where investors sell everything. 2022 was unusual because equities and bonds both fell, which broke one of the classic diversification assumptions.\n— For founders, the biggest concentration risk is usually the business — which is both the income source and a large part of net worth. The portfolio should deliberately counterbalance that, not mirror it.`,
        expertInsight: `The sophisticated version of diversification is factor diversification, not just asset class diversification. Sophisticated portfolios look at whether they have exposure to multiple risk factors — value, growth, size, geography, duration — not just whether they hold multiple names. Two "diversified" equity funds can have 80% factor overlap, providing almost no real diversification.\n\nFor most non-professionals, the practical insight is simpler: global index funds provide genuine diversification across thousands of companies and dozens of countries. Trying to hand-pick a diverse set of individual stocks almost always results in less diversification than appears on the surface because sector and country tilts tend to dominate individual stock selection.`,
        questionsToAsk: [
          "How correlated are the assets in this portfolio in a normal market — and how does that correlation change in a severe downturn?",
          "When I account for my business, what does my true total net worth look like? What sector, geography, and risk factor is it most exposed to?",
          "Is this portfolio genuinely diversified across uncorrelated risks, or is it diversified in name only (e.g., 20 stocks that all move with the same sector)?",
          "What risk cannot be diversified away with this portfolio, and how much of that risk am I currently taking?",
        ],
        goDeeper: `A Random Walk Down Wall Street by Burton Malkiel covers portfolio diversification with the underlying evidence. The Intelligent Asset Allocator by William Bernstein is shorter and more practical. For the mathematical underpinning, Harry Markowitz's original 1952 paper "Portfolio Selection" is readable and short — the insight that earned him the Nobel Prize in Economics.`,
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
        intuition: `There is a documented gap between what investment returns are and what investors actually earn. Funds can report a 10-year return of 9% per year, but the average investor in those same funds might have earned 4–6% because of when they bought and sold. They bought after the fund had a great run (paying high prices). They sold during the crash (at low prices). They switched to the hot fund of the year (which then reverted to the mean).\n\nThis gap — between fund returns and investor returns — is called the behaviour gap. It's not a small rounding error. Studies by Dalbar and others suggest it has historically accounted for several percentage points per year over long periods. That's a larger drag than fees, which everyone talks about. But behaviour is invisible, which is why it gets less attention than it deserves.`,
        mechanism: `The specific psychological mechanisms that drive the behaviour gap:\n\n— Loss aversion: humans feel losses approximately twice as powerfully as equivalent gains. A 20% drop feels twice as bad as a 20% gain feels good, which creates pressure to sell at exactly the wrong time.\n— Recency bias: we overweight what just happened. After a crash, investors expect more crashes. After a bull run, they expect more gains. Both expectations are poorly calibrated.\n— Action bias: doing something feels better than doing nothing, especially under stress. Tinkering, switching, adding new positions, reacting to news — all create the illusion of control.\n— Overconfidence: investors consistently overestimate their ability to pick winners and time the market, especially after a run of luck.\n— Social proof: if everyone around you is buying cryptocurrency, it takes significant conviction to stay in a boring diversified index fund.\n\nNone of these are stupidity. They are features of how human brains evolved — useful in other contexts, dangerous in long-term investing.`,
        workedExample: `The S&P 500 averaged approximately 9.5% per year from 2000 to 2020. Dalbar research found the average equity fund investor earned approximately 5.4% per year over the same period — a gap of over 4 percentage points per year caused entirely by buying and selling at the wrong times.\n\nOn £200,000 over 20 years:\n— 9.5% (staying fully invested): £1,282,000\n— 5.4% (average investor behaviour): £574,000\n\nThe £708,000 difference is the behaviour gap. It exceeds what most people will save in a lifetime. It wasn't caused by fees, fraud, or bad markets — it was caused entirely by investor behaviour.`,
        deeperPrinciple: `The deeper principle is that automated systems beat willpower. Willpower depletes under stress. Market crashes are stressful by definition. Relying on willpower at the worst possible moment — when everything is falling and everyone is panicking — is asking the most of yourself when you have the least.\n\nThe professional solution is to move decisions out of the moment of stress and into calm, pre-committed rules:\n— Automatic monthly investments that run regardless of market conditions\n— A written Investment Policy Statement that defines your rules in advance\n— A personal rule: "no portfolio changes during a market drop of more than X%"\n— A specific waiting period (48–72 hours) before acting on any impulse to sell\n\nThe goal is to make the right behaviour the path of least resistance, not the result of heroic self-control.`,
        nuance: `Intelligence does not protect against the behaviour gap and can worsen it. Smart people can construct more compelling narratives for why this time is different, why selling now is the rational thing to do, why they've identified a real pattern in market data. The intelligence that makes someone good at building businesses can become a liability in investing, where action and cleverness are usually the enemy of returns.\n\nAlso: behaviour problems are not uniform across investor types. Very long time horizons help because you can genuinely ignore short-term noise. Retirement savers at 30 have a different problem than someone who needs their capital in 5 years. The behaviour gap is most damaging for people who have long-term capital but act as if it's short-term.`,
        expertInsight: `Financial planners know that their most valuable service is often not picking investments — it's stopping clients from making expensive mistakes. Preventing a client from selling their entire portfolio in March 2020 was worth more than any fund selection decision made in the same year.\n\nThe data-backed way to improve behaviour is friction and pre-commitment, not better information. Investors who switch to direct debit investing (automatic, not a decision each month) do better than those who make manual contributions. Investors who have a written policy they've agreed to do better than those who trust their in-the-moment judgement.`,
        questionsToAsk: [
          "Do you have a written Investment Policy Statement for me? What are the rules it contains, and under what conditions would you recommend I deviate from them?",
          "What is the documented investor return (not fund return) for the funds or strategy you're recommending, and how does that compare to the stated performance?",
          "How do you plan to handle a situation where I want to sell everything during a market crash? What is your process for those conversations?",
          "How often do you recommend changes to portfolios like mine, and what triggers a change recommendation — performance, circumstances, or market views?",
        ],
        goDeeper: `The Behaviour Gap by Carl Richards is the clearest visual and written account of this problem. Thinking, Fast and Slow by Daniel Kahneman — particularly Part III on overconfidence — explains the psychological mechanisms in depth. Your Money and Your Brain by Jason Zweig applies the same research specifically to investor psychology.`,
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
        intuition: `Inflation is often taught as "prices going up." That's accurate but misleading — it obscures what's actually happening. Inflation is money losing purchasing power. The same pound buys less. Your nominal bank balance might stay at £100,000, but in five years that £100,000 might buy only what £82,000 buys today (at 4% inflation). The number hasn't changed; the number's meaning has.\n\nThe important thing to understand is that moderate inflation is not an accident — it is policy. Central banks (the Bank of England, the ECB, the Federal Reserve) target around 2% inflation annually because mild inflation encourages spending and investment over hoarding, supports debt sustainability, and provides room to cut rates when needed. You are not trying to protect against a malfunction in the system. You are navigating a designed feature of it.`,
        mechanism: `Inflation's transmission mechanism — how it actually works — involves several interacting forces:\n\n1. Money supply: when more money chases the same goods, each unit of money buys less. Central banks and commercial banks influence how much money exists through interest rates and lending.\n\n2. Demand-pull: when the economy is hot (low unemployment, high consumer confidence), people spend more, businesses raise prices. Demand pulls prices up.\n\n3. Cost-push: when the cost of inputs rises (energy, labour, raw materials), businesses raise prices to protect margins. Supply shocks cause cost-push inflation — as in 2022 when energy prices surged after Russia's invasion of Ukraine.\n\n4. Expectations: if businesses and workers expect 5% inflation, they'll build that into wage negotiations and pricing decisions, which causes 5% inflation. Expectations become self-fulfilling, which is why central banks work hard to anchor them near 2%.\n\nFor practical purposes: you don't need to diagnose which type of inflation is happening. You need to know that inflation reduces the real value of cash and fixed assets over time, and that the real return on any investment is the nominal return minus inflation.`,
        workedExample: `£50,000 sitting in a current account at 0% interest, in an economy with 4% inflation:\n\nEnd of Year 1: still £50,000 in your account. But its purchasing power is now worth £48,077 in today's prices.\nEnd of Year 5: still £50,000. Purchasing power: £41,096 (today's equivalent).\nEnd of Year 10: still £50,000. Purchasing power: £33,778 (today's equivalent).\nEnd of Year 20: still £50,000. Purchasing power: £22,819 (today's equivalent).\n\nAt 4% inflation over 20 years, £50,000 of cash loses more than half its real value. The number on the screen never changes. The meaning of that number quietly halves.\n\nNow compare: £50,000 in an asset growing at 7% nominal per year. Real return = 7% - 4% = 3%. After 20 years: approximately £90,000 in today's purchasing power. The £40,000 difference is the cost of holding cash versus investing.`,
        deeperPrinciple: `Inflation functions as a hidden tax on two things: cash balances and fixed-income obligations. If you owe £200,000 on a fixed-rate mortgage at 3% and inflation runs at 5%, the real cost of that debt is falling each year — you're repaying with pounds worth less than the pounds you borrowed. The wealthy use this deliberately: borrowing at fixed rates and holding productive assets that rise with inflation.\n\nThis is why the same inflation that punishes savers rewards certain borrowers. Understanding which side of the inflation equation you're on in each asset class is a core financial literacy question.`,
        nuance: `Not everything inflates equally. UK average inflation masks enormous variation: energy and food can spike while clothing gets cheaper; property in certain cities inflates at multiples of national CPI; technology deflates. The "inflation rate" you read about is an average of a basket of goods that may not match your spending at all.\n\nAlso: hyperinflation is categorically different from moderate inflation. The psychology and behaviour appropriate for 2–6% inflation (invest in real assets, keep less cash) is not the same as for 50%+ inflation, which requires different thinking entirely. Most of what you read about inflation in mainstream financial education is written for moderate-inflation environments.`,
        expertInsight: `Financial professionals think about inflation differently from how it's reported in the news. They focus on real yield — the return after inflation — not the nominal number. A savings account at 5% interest in a 4% inflation environment has a 1% real yield. A bond at 4% in a 2% inflation environment has a 2% real yield. The nominal numbers look backwards but the real numbers tell the truth.\n\nThe professional also thinks about inflation-sensitive versus inflation-resistant assets: cash and long-duration bonds lose to inflation; equities (over the long run), property, index-linked bonds (gilts), and real assets tend to preserve purchasing power better. The exact relationship is time-period dependent — there is no perfect inflation hedge — but the general direction of travel matters.`,
        questionsToAsk: [
          "What is the real (after-inflation) expected return of what you're recommending, and how does that assumption about inflation compare to current conditions?",
          "How much of my portfolio is in assets that lose real value to inflation (cash, fixed-rate bonds) versus assets that tend to preserve or grow real value?",
          "If inflation runs at 4–5% for the next decade, what does that do to my plan's projections — and what adjustments would you suggest?",
          "My mortgage is at a fixed rate — can you explain how that interacts with inflation on the liabilities side of my balance sheet?",
        ],
        goDeeper: `Inflation: What It Is, Why It's Bad, and How to Fix It by Steve Forbes and Elizabeth Ames covers the political and economic dimensions. The Price of Time by Edward Chancellor is excellent on the relationship between interest rates and inflation historically. For a short, practical framing: Tim Harford's work at the Financial Times on real-world inflation measurement is consistently illuminating.`,
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
        flowChartId: "inflation-erodes",
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
        intuition: `Why does the tool-or-trap distinction exist? Because debt is leverage — it amplifies outcomes in both directions. Borrow £200,000 to buy a £250,000 property with £50,000 of your own money. If the property rises 20% (to £300,000), you've made £50,000 on a £50,000 investment — a 100% return. If the property falls 20% (to £200,000), you've lost your entire £50,000 — a 100% loss — while still owing the bank £200,000.\n\nDebt is not inherently good or bad. It is a multiplier. The question is what it's multiplying: something that produces income or grows in value (productive asset), or something that depreciates or is consumed (spending)? A business loan to buy equipment that earns more than the interest is a tool. A personal loan for a holiday is a trap. Most real-world debt is somewhere on the spectrum between these poles, which is why the thinking matters.`,
        mechanism: `The mechanics of how debt creates value or destroys it:\n\nFor productive debt:\n— You borrow £100,000 at 5% annual interest (£5,000/year cost)\n— You deploy it into a business or investment that earns 12% (£12,000/year)\n— Net gain: £7,000/year on borrowed money. The spread — return on asset minus cost of debt — is your profit.\n— If asset value rises too, you have both income and capital gain from the leveraged investment.\n\nFor consumptive debt:\n— You borrow £20,000 at 18% credit card interest (£3,600/year cost)\n— The consumption (car, holiday, electronics) produces no income and the asset depreciates to zero\n— You pay the £3,600/year plus principal repayment — there is no income or capital gain to offset it\n— Over 3 years of carrying this debt: you've paid £10,800 in interest alone for consumption that no longer exists\n\nThe pivot: "good debt" turns bad when the spread collapses. If interest rates rise, the cost of debt increases. If the asset loses value or produces less income, the return falls. If income drops and debt is fixed, you're forced to repay from savings or other assets. Every debt has a scenario under which it becomes destructive.`,
        workedExample: `Two founders, each with £50,000 to invest:\n\nFounder A takes a £200,000 buy-to-let mortgage at 4.5% interest on a £250,000 property (80% LTV). Rental yield: 5.5% of property value = £13,750/year. Mortgage interest: 4.5% × £200,000 = £9,000/year. Net income before tax and costs: £4,750/year. Return on the £50,000 equity: 9.5%.\n\nBut if interest rates rise to 7%: mortgage interest = £14,000/year. Net income becomes -£250/year — the property is now loss-making. The 80% LTV leaves little cushion if property prices fall.\n\nFounder B keeps the £50,000 in a diversified portfolio and carries no debt. Lower potential return, but no leverage risk and full flexibility.\n\nNeither choice is obviously right — they represent different risk profiles, time horizons, and operational preferences. The point is that the leverage in Founder A's position doesn't just amplify returns; it changes what happens under stress.`,
        deeperPrinciple: `Debt is a claim on your future income or assets. Taking on debt is a statement of confidence about your future: that the income will arrive on time to service it, that the asset won't lose value, that rates won't spike unbearably. The more of that confidence that's warranted — through a stable, diversified income stream and resilient assets — the more sensible debt becomes. The less of it is warranted, the more dangerous.\n\nThis is why highly indebted people and businesses are fragile in downturns: the debt payments are fixed, but income is variable. When income falls (which it does in every recession, for many businesses and individuals), fixed debt obligations cause acute stress or default. Resilience and leverage are in permanent tension.`,
        nuance: `The good debt / bad debt distinction has important limits:\n\n— Debt on a "good" asset can still be too much debt. Even a mortgage on an income-producing property can become disastrous at 95% LTV with a variable rate if rates spike.\n— "Bad" debt is sometimes the least-bad option. If a medical emergency costs £15,000 and the only option is credit card debt or bankrupting your business, the credit card might be right even at 18%.\n— The interest rate environment changes the calculation completely. Debt at 2% is a different decision from debt at 7%. Strategies built in the zero-rate era (2009–2022) may not work in the higher-rate environment that followed.\n— Guarantees and recourse matter. A personal guarantee on a business loan means the "ring-fence" between your business and personal assets is partially broken. Many founders don't fully understand what they've personally guaranteed.`,
        expertInsight: `What financial professionals know is that the debt problems that destroy people are almost never the ones they could see coming — a mortgage that looks affordable in a stress test. They're the ones that compounded: too much property debt plus a concentrated business plus no emergency reserve plus a rate spike. The individual debts looked manageable; the combined picture was catastrophic.\n\nThe practical professional habit is to look at total debt across all entities — personal, business, property — as a proportion of net worth and as a proportion of annual free cash flow. Not individual loans, but the whole picture. Most people don't do this. They manage each debt in isolation.`,
        questionsToAsk: [
          "Across my personal, business, and property accounts — what is my total debt as a proportion of my net worth, and how does that compare to a sensible benchmark for my risk profile?",
          "For each debt I hold, what are the rate terms — fixed or variable? What happens to my cash flow if variable rates rise by 2%, 3%, 5%?",
          "What personal guarantees have I given on business debt, and what is my actual personal exposure if the business struggles?",
          "Am I holding assets that are debt-financed while also carrying high-interest personal debt? Is there an arbitrage to close?",
        ],
        goDeeper: `Debt: The First 5,000 Years by David Graeber is a fascinating anthropological history of debt and what it does to societies. For practical application: any good personal finance book with a chapter on debt management. William Ackman's Yale speech on debt and leverage is available freely online and is direct and practical.`,
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
        flowChartId: "debt-fork",
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
    flowChartId: "five-domains",
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
    flowChartId: "wealth-loop",
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
