export type LessonDeepDive = {
  why: string[];
  mechanism: string[];
  example: string[];
  principle: string[];
  nuance: string[];
  expert: string[];
  questions: string[];
  web: string[];
  goDeeper: string[];
};

type LessonSeed = {
  id: string;
  title: string;
  body: string;
  connections: string[];
};

type DeepProfile = {
  why?: string | string[];
  mechanism: string | string[];
  example: string | string[];
  principle?: string | string[];
  nuance?: string | string[];
  expert: string | string[];
  questions: string[];
  goDeeper: string[];
};

const toArray = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const cleanTitle = (title: string) => title.replace(/^\d[A-Z]?\.\d\s+—\s+|^\d\.\d\s+—\s+|^\d[A-Z]?\.\d\s+-\s+|^\d\.\d\s+-\s+/, "");

const domainFor = (id: string) => {
  if (id.startsWith("making")) return "making";
  if (id.startsWith("keeping")) return "keeping";
  if (id.startsWith("growing")) return "growing";
  if (id.startsWith("protecting")) return "protecting";
  if (id.startsWith("understanding")) return "understanding";
  return "connections";
};

const domainPrinciple: Record<string, string> = {
  making:
    "The transferable principle is conversion. Income is not wealth by itself; it is an input that must be converted into retained capital, capability, optionality, and assets that can work without your constant labour.",
  keeping:
    "The transferable principle is leakage control. Any financial machine can be understood by watching where value leaks out, then deciding which leaks are necessary, which are avoidable, and which are actually investments in future capacity.",
  growing:
    "The transferable principle is compounding under uncertainty. Returns, fees, tax drag, inflation, behaviour, and time all multiply; the serious investor learns which variables can be controlled and which must be endured.",
  protecting:
    "The transferable principle is survival before optimization. A plan that survives a bad year, a lawsuit, a health event, or a market fall is more valuable than a fragile plan that only works in spreadsheets.",
  understanding:
    "The transferable principle is real terms over nominal stories. Money decisions happen inside a system of inflation, rates, credit, incentives, and cycles, so the visible number is never the whole meaning.",
  connections:
    "The transferable principle is systems thinking. A good financial decision is rarely good in one domain only; it changes cash flow, risk, tax, liquidity, behaviour, and future options at the same time.",
};

const domainNuance: Record<string, string> = {
  making:
    "The simple version breaks down when people rank income engines only by size. A smaller engine can be more valuable if it is durable, less dependent on you, lower risk, or strategically useful. A larger engine can be dangerous if it raises fixed costs or concentrates risk.",
  keeping:
    "The simple version breaks down when keeping money becomes joyless cost-cutting. The goal is not to minimize spending; it is to spend deliberately, keep enough surplus, and avoid commitments that remove future choice.",
  growing:
    "The simple version breaks down when averages are treated as promises. A 7% long-term return does not arrive as 7% every year, and the path matters because real humans need liquidity, confidence, and time to stay invested.",
  protecting:
    "The simple version breaks down when protection becomes fear. You cannot insure, diversify, or reserve away every risk. The work is to identify ruin risks, reduce unnecessary fragility, and still leave room for intelligent risk-taking.",
  understanding:
    "The simple version breaks down when a single explanation is forced onto a complex system. Inflation, rates, debt, and markets usually have several causes working together, and good judgement means holding more than one driver in mind.",
  connections:
    "The simple version breaks down when the machine is treated as a strict checklist. The order changes by life stage, country, business risk, family obligations, and time horizon; the system view helps you adapt the sequence without losing the logic.",
};

const professionalLanguage: Record<string, string> = {
  making: "business adviser, accountant, or financial planner",
  keeping: "financial planner, accountant, or money coach",
  growing: "regulated financial adviser or investment professional",
  protecting: "insurance broker, solicitor, accountant, or financial planner",
  understanding: "financial adviser, lender, economist-minded adviser, or accountant",
  connections: "financial adviser, accountant, solicitor, or business adviser",
};

const profiles: Record<string, DeepProfile> = {
  "making-1": {
    mechanism:
      "An income engine converts an input into cash flow. Employment converts time and skill into salary; self-employment converts skill and client demand into fees; a business converts systems, people, capital, and distribution into profit; investments convert saved capital into income or growth. The more engines you have, the less one failure controls your life, but each engine also brings its own maintenance cost and risk.",
    example:
      "Suppose a UK founder earns £72,000 from consulting, £24,000 from a small product, and £4,000 from portfolio income. Total income is £100,000, but 72% still depends on direct work. If product income grows to £45,000 and portfolio income to £12,000 while consulting falls to £55,000, total income rises to £112,000 and direct-work dependence falls below half. The lesson is not just bigger income; it is a more resilient mix.",
    expert:
      "Experts look at income quality, not just income quantity. They ask how predictable it is, whether it depends on one customer or one person, what capital is required, what tax treatment applies, and whether the engine still works when the founder is tired or absent.",
    questions: [
      "Which of my income sources depends directly on my hours, and which could keep producing if I stepped away for a month?",
      "What is the tax and risk profile of each engine, not just the headline income?",
      "Which new engine would reduce fragility rather than simply add complexity?",
    ],
    goDeeper: [
      "Use Business Reality Check to stress-test the economics of any business income engine.",
      "Research earned income, trading income, dividends, interest, rent, and capital gains as different income types.",
      "Read The Millionaire Next Door for the distinction between high income and durable wealth-building behaviour.",
    ],
  },
  "making-2": {
    mechanism:
      "Wealth is built from the portion of income that survives tax, spending, debt service, and avoidable loss. The mechanism is a funnel: gross income enters at the top, then deductions, lifestyle, interest, emergencies, and bad decisions narrow it. The amount that reaches the bottom becomes reserves, investments, or business capital.",
    example:
      "Two people earn £120,000. One keeps fixed lifestyle costs at £4,500 per month and invests £2,000 per month. The other spends £7,000 per month, carries £800 of debt payments, and invests nothing. After 10 years at a 6% return, the first has roughly £327,000 before tax and fees; the second may have a prestigious lifestyle but little capital.",
    expert:
      "Professionals distinguish income statement strength from balance sheet strength. A high earner with no liquidity, high fixed costs, and no assets is still fragile; a lower earner with consistent surplus and low debt can be more financially powerful over time.",
    questions: [
      "What percentage of my gross income actually becomes retained capital each year?",
      "Are my fixed costs low enough that a bad quarter would not force bad decisions?",
      "Which leak is most worth fixing first: tax structure, spending, debt, or protection?",
    ],
    goDeeper: [
      "Study personal cash flow statements and net worth statements side by side.",
      "Read The Psychology of Money for behavioural examples of income not becoming wealth.",
      "Review one year of bank transactions and classify each pound as living, capability, protection, debt, or capital.",
    ],
  },
  "making-3": {
    mechanism:
      "A business has asset characteristics: it may produce cash flow, have resale value, need reinvestment, carry liabilities, and be difficult to sell quickly. For a founder, salary, dividends, identity, future upside, and net worth may all depend on the same company. That creates concentration risk even when the business is excellent.",
    example:
      "Imagine your business is worth £300,000 and your outside portfolio is £30,000. On paper, business value is 91% of these assets. If a market change halves business value, your total falls from £330,000 to £180,000. If instead you had built a £150,000 outside portfolio, the same business shock leaves £300,000. Diversification did not make the business safer; it made your life less dependent on one asset.",
    expert:
      "Experts adjust the personal portfolio for the founder's business exposure. If the business is illiquid, cyclical, UK-heavy, and high risk, they often want the outside portfolio to be liquid, diversified, global, and boring.",
    questions: [
      "How should my personal portfolio compensate for the concentration and illiquidity of my business?",
      "What part of the business value is realistic, sellable value rather than optimistic owner value?",
      "What protection or liquidity should exist outside the company before I reinvest more into it?",
    ],
    goDeeper: [
      "Use Business Reality Check to examine valuation drivers and downside cases.",
      "Research key person risk, customer concentration, and owner dependence.",
      "Ask an accountant how salary, dividends, retained profit, and company assets affect your personal picture.",
    ],
  },
  "making-4": {
    mechanism:
      "Leverage means one unit of your effort can produce more than one unit of output. Hiring uses other people's time, products use repeatable code or inventory, media uses distribution, capital uses money, and equity uses ownership. Each form of leverage has a control system: incentives, quality, cash flow, and downside risk.",
    example:
      "If you bill £100 per hour and can sell 120 hours per month, the ceiling is £12,000 before costs. If you productize a service at £500 per customer and serve 80 customers with software and support, revenue is £40,000. The question becomes margin, churn, support load, and acquisition cost, not just your available hours.",
    expert:
      "Experts know leverage changes the bottleneck. A solo operator's bottleneck is time; an agency's may be hiring and quality; a software product's may be distribution; an investment portfolio's may be capital and patience.",
    questions: [
      "Which bottleneck is leverage supposed to remove in my business?",
      "What new risk or fixed cost does this leverage introduce?",
      "Do my unit economics still work after hiring, software, advertising, or financing costs?",
    ],
    goDeeper: [
      "Use Customer Conversations Dojo before scaling an offer with paid acquisition.",
      "Use Voice & Presence to sharpen the story that attracts customers, talent, and capital.",
      "Research operating leverage and contribution margin.",
    ],
  },
  "making-5": {
    mechanism:
      "Responsible income scaling pre-decides where each new pound goes. Without a rule, new income is absorbed by lifestyle, tax surprises, business reinvestment, and convenience. A simple split might assign 40% of each raise to investing, 20% to reserves, 20% to tax or debt planning, and 20% to lifestyle.",
    example:
      "A founder's monthly income rises from £8,000 to £11,000. If the full £3,000 increase becomes rent, car, travel, subscriptions, and restaurants, financial freedom does not improve. If £1,800 is automatically moved to reserves and investments and £1,200 improves life, the founder enjoys progress while adding £21,600 a year to the machine.",
    expert:
      "Experts focus on fixed commitments. A higher lifestyle is less dangerous when it is flexible; it is more dangerous when it becomes rent, debt, payroll, or long contracts that cannot quickly be reduced.",
    questions: [
      "What rule will govern the next increase in my income before it arrives?",
      "Which lifestyle upgrades are flexible, and which create permanent monthly obligations?",
      "How much of every new pound should go to tax, reserves, investing, business reinvestment, and enjoyment?",
    ],
    goDeeper: [
      "Research lifestyle inflation and savings-rate targeting.",
      "Build a one-page income allocation rule for raises, bonuses, and profitable months.",
      "Read I Will Teach You To Be Rich for automated money-flow systems, then adapt the ideas to founder income volatility.",
    ],
  },
  "keeping-1": {
    mechanism:
      "The earning-to-keeping gap is the difference between money generated and money retained. It widens through tax, lifestyle inflation, interest, unplanned costs, under-insurance, and poor timing. The discipline is to identify the biggest leak, then decide whether it is necessary, reducible, insurable, or worth professional advice.",
    example:
      "A £10,000 invoice is not £10,000 of wealth. After 25% tax provision, £2,000 of operating costs, £1,500 of lifestyle spending, and £700 of debt payments, only £3,300 may remain. If the founder has no system, that £3,300 may also disappear into vague spending. Keeping is the act of making the retained amount visible and purposeful.",
    expert:
      "Professionals separate controllable leaks from structural leaks. Tax may be partly structural, but timing and wrappers matter. Spending may be emotional, but fixed commitments are mathematical. Debt may be useful, but high-interest debt is usually a priority leak.",
    questions: [
      "Where is my largest leak between gross income and retained capital?",
      "Which leaks require professional structuring, and which require behaviour or automation?",
      "How much should I reserve for tax before I treat money as mine?",
    ],
    goDeeper: [
      "Build a monthly personal profit and loss statement.",
      "Use Tax & Structures Lab for tax-specific leakage and structure questions.",
      "Research sinking funds for irregular expenses.",
    ],
  },
  "keeping-2": {
    mechanism:
      "Personal cash flow works like business cash flow: inflows arrive, fixed costs leave, variable costs fluctuate, and surplus either becomes capital or disappears. Paying yourself first changes the order. Instead of saving what is left after spending, you move the intended surplus first and force the rest of the month to fit the remaining budget.",
    example:
      "Monthly income is £9,000 and core expenses are £5,200. The visible surplus is £3,800. If £2,000 moves automatically on payday into reserves or investments, the spending account only has £7,000 to work with. Over a year, that creates £24,000 of capital before returns; over 20 years at 6%, £2,000 per month can grow to roughly £924,000 before tax and fees.",
    expert:
      "Experts look for cash flow volatility, not just average surplus. A founder who averages £9,000 per month but receives it unevenly may need larger reserves and separate tax buckets than an employee with the same annual income.",
    questions: [
      "What is my true monthly surplus after irregular costs and tax provisions?",
      "Should my automated saving be a fixed amount, a percentage, or both?",
      "How large should my cash buffer be given that founder income is uneven?",
    ],
    goDeeper: [
      "Research zero-based budgeting, percentage budgeting, and cash-flow forecasting.",
      "Compare a personal cash flow statement with a business cash flow statement.",
      "Read Your Money or Your Life for the relationship between spending, life energy, and freedom.",
    ],
  },
  "keeping-3": {
    mechanism:
      "Lifestyle inflation works through normalization. A temporary upgrade becomes the new baseline, the new baseline becomes fixed cost, and the fixed cost consumes future income before it can become capital. The mechanism is quiet because each individual upgrade feels affordable.",
    example:
      "Income rises by £2,000 per month. If £1,600 becomes new recurring lifestyle, only £400 remains for wealth-building. If £1,200 is invested and £800 upgrades life, the 20-year difference at 6% is roughly £554,000 before tax and fees. The emotional experience may feel similar month to month, but the balance sheet becomes completely different.",
    expert:
      "Experts know the danger is not pleasure; it is irreversible fixed cost. A great holiday may be expensive but finite. A larger mortgage, car finance, private school fees, or permanent payroll obligation changes the risk profile of the whole household.",
    questions: [
      "Which of my lifestyle upgrades are one-off choices and which are permanent fixed costs?",
      "What percentage of each raise should be locked into wealth-building before spending adjusts?",
      "How would my current lifestyle survive a six-month income dip?",
    ],
    goDeeper: [
      "Research hedonic adaptation and fixed-cost ratios.",
      "Run the lifestyle inflation visualizer with your next expected income increase.",
      "Read The Psychology of Money, especially the chapters on enough and room for error.",
    ],
  },
  "keeping-4": {
    mechanism:
      "An emergency reserve is liquidity assigned to survival, not return. It interrupts the chain from surprise event to forced sale, high-interest borrowing, bad negotiation, or panic decision. Its size depends on monthly expenses, income volatility, dependents, business risk, and insurance gaps.",
    example:
      "If monthly essential expenses are £5,000, a three-month reserve is £15,000 and a six-month reserve is £30,000. For an employee with stable income, three months may be adequate. For a founder with uneven revenue and a family, six to twelve months may be more sensible. The extra £15,000 may look unproductive, but it can prevent selling investments after a 30% market fall.",
    expert:
      "Experts do not judge the reserve by yield alone. They judge it by access, safety, currency, separation from daily spending, and whether it is large enough to stop a temporary shock from becoming a permanent capital loss.",
    questions: [
      "What reserve target fits my income volatility, dependents, business risk, and insurance coverage?",
      "Where should the reserve sit so it is accessible but not accidentally spent?",
      "Which shocks should be covered by cash, and which should be covered by insurance or structure?",
    ],
    goDeeper: [
      "Research emergency funds, sinking funds, and business runway separately.",
      "Ask a financial planner how they size reserves for self-employed or founder households.",
      "Review Financial Conduct Authority guidance on cash savings protection in your jurisdiction.",
    ],
  },
  "keeping-5": {
    mechanism:
      "Good costs create future capacity or durable value; bad costs consume cash without strengthening the machine. The mechanism is opportunity cost. Every £1,000 can be comfort, capability, protection, debt reduction, or capital, and the category determines what future options it creates.",
    example:
      "A £2,000 course that helps you win £20,000 of higher-quality work is a capability investment if the link is real. A £2,000 status purchase financed at 22% interest costs about £440 per year in interest before repayment. The same cash amount has completely different consequences because one may increase earning power and the other reduces future surplus.",
    expert:
      "Experts ask for evidence of return, not just a persuasive story. A cost can be labelled business development, education, or networking and still be mostly consumption if it has no plausible path to cash flow, risk reduction, or capability.",
    questions: [
      "What future capability, asset, health, relationship, or resilience does this cost create?",
      "Am I measuring the full cost, including time, tax, maintenance, and debt interest?",
      "Which recurring costs no longer match my current priorities?",
    ],
    goDeeper: [
      "Research opportunity cost and return on investment for personal spending.",
      "Audit the last 90 days of spending into capability, joy, obligation, leakage, and capital.",
      "Read Die With Zero for a thoughtful counterweight on spending for meaningful life experiences.",
    ],
  },
  "keeping-6": {
    mechanism:
      "Tax planning is the timing and structuring of income, ownership, expenses, wrappers, and withdrawals within the rules. It affects how much of each pound survives. The mechanism is not magic: different types of income and different legal containers are taxed differently, and good planning aligns the transaction with the right container before the event happens.",
    example:
      "A founder taking £80,000 personally may face a different outcome depending on salary, dividends, pension contributions, retained company profit, or timing. A £10,000 pension contribution may reduce taxable income and grow in a tax-advantaged environment, but it may also lock money until later life. The correct answer depends on cash needs, rules, company position, and personal facts.",
    expert:
      "Experts know tax efficiency is not the same as financial wisdom. A structure that saves £3,000 of tax but creates illiquidity, compliance risk, or bad investment behaviour may be a poor trade.",
    questions: [
      "Which parts of my income should be salary, dividends, pension contribution, retained profit, or something else under current rules?",
      "What tax wrappers should I understand before investing outside them?",
      "Am I making this decision for tax reasons only, or does it also fit cash flow, risk, and flexibility?",
    ],
    goDeeper: [
      "Use Tax & Structures Lab for jurisdiction-specific concepts and structure trade-offs.",
      "Ask a qualified accountant to model salary, dividends, pension, and retained-profit scenarios.",
      "Research ISAs, pensions, allowances, and capital gains rules as current-year rules, not permanent truths.",
    ],
  },
  "keeping-7": {
    mechanism:
      "Catastrophic loss protection identifies events whose cost is too large to absorb from normal surplus. The mechanism is risk transfer or risk reduction: you either hold cash, buy insurance, use legal structures, diversify, avoid the exposure, or accept it consciously.",
    example:
      "If a £60,000 uninsured liability hits a household saving £1,500 per month, it can erase more than three years of surplus. If appropriate insurance reduces the uncovered cost to £5,000, the event is painful but not wealth-destroying. The goal is not to make bad events pleasant; it is to stop them resetting the machine.",
    expert:
      "Experts focus on low-probability, high-severity events. Beginners often insure small things they could pay for while leaving disability, liability, key person, or dependent-risk exposures unexamined.",
    questions: [
      "What event could erase several years of progress if it happened this year?",
      "Which risks should be insured, which should be self-insured, and which should be avoided?",
      "Do my business structures and policies actually separate personal and business risk?",
    ],
    goDeeper: [
      "Research income protection, life insurance, professional indemnity, public liability, and key person cover.",
      "Ask an insurance broker to explain exclusions, not just premiums.",
      "Use Tax & Structures Lab to understand liability separation and company structure basics.",
    ],
  },
  "growing-3a-1": {
    mechanism:
      "Investing exists because ownership can grow faster than stored cash. Saving preserves liquidity; investing buys assets that may produce earnings, rent, interest, or capital growth. The mechanism is a trade: you accept uncertainty and volatility today in exchange for a chance at higher future purchasing power.",
    example:
      "Put £20,000 in cash for 20 years at 3% inflation and its purchasing power falls to about £11,000 in today's money. Invest £20,000 for 20 years at a 6% nominal return and the nominal value becomes about £64,000 before tax and fees. After 3% inflation, that is roughly £35,000 of real purchasing power. The point is not that the return is guaranteed; it is that doing nothing has its own risk.",
    expert:
      "Experts separate money by time horizon. Money needed in the next year may belong in cash even if inflation erodes it. Money not needed for 15 years may be harmed by staying entirely in cash because inflation has time to do serious damage.",
    questions: [
      "Which parts of my money need liquidity, and which have a long enough horizon to accept volatility?",
      "What real return, after inflation, fees, and tax, does this plan rely on?",
      "What would make me a forced seller, and how do I prevent that before investing?",
    ],
    goDeeper: [
      "Read The Four Pillars of Investing by William Bernstein.",
      "Research nominal return versus real return.",
      "Review long-term historical return charts, but treat history as context rather than a promise.",
    ],
  },
  "growing-3a-2": {
    mechanism: [
      "Compounding works because each period's gain is added to the base that earns the next period's gain. If £10,000 earns 7%, the first year's gain is £700 and the new base is £10,700. The next 7% is £749, not £700. Repeat that for decades and the later years become much larger because the base has become much larger.",
      "This is why the curve looks flat and then steep. Early growth is real but visually quiet; later growth looks dramatic because old contributions, old returns, and new contributions are all earning together. The rule of 72 is a useful intuition tool: divide 72 by the annual return to estimate doubling time. At 6%, money roughly doubles every 12 years; at 9%, roughly every 8 years.",
      "Time, rate, and contribution matter differently. Early on, contributions dominate because the pot is small. Later, rate and time dominate because the pot is large. The dark mirror is that fees, inflation, and debt interest compound too. A 1% annual fee is not one small bite; it is one small bite every year on a growing balance.",
    ],
    example: [
      "Investor A starts at 30 with £10,000 and invests £500 per month for 30 years at 7%. They contribute £190,000 total and end near £666,000 before tax and fees. Investor B waits 10 years, starts at 40, and invests £900 per month for 20 years at the same return. They contribute £226,000 total and end near £487,000. B contributes more cash but has less time for compounding.",
      "Now add a 1% fee drag. At 7% gross, £500 per month for 30 years reaches about £610,000 if net return is 6% instead of 7%. That fee difference can cost more than £50,000. The same compounding force that builds wealth also magnifies small recurring costs.",
    ],
    principle:
      "The transferable principle is that repeated small percentages become large absolute amounts when applied to a growing base for a long time. This explains investment growth, fee drag, inflation erosion, debt interest, and why small savings-rate changes matter more than they first appear.",
    nuance:
      "The simple version breaks down when people assume a smooth return. Markets do not compound in a straight line; they jump, fall, recover, and stagnate. The formula is clean, but the lived experience requires liquidity and behaviour discipline so you do not interrupt the curve.",
    expert:
      "Experts know the biggest compounding advantage is not cleverness; it is uninterrupted time. They design systems to protect the compounding process from tax drag, high fees, panic selling, lifestyle raids, and forced withdrawals.",
    questions: [
      "What assumptions for return, inflation, fees, tax, and contribution growth sit underneath this projection?",
      "What would interrupt my compounding curve, and how do we design around that risk?",
      "Am I better served by starting smaller now or waiting until I can invest a larger amount later?",
    ],
    goDeeper: [
      "Research the rule of 72 and real versus nominal compounding.",
      "Read The Psychology of Money on time as the hidden variable in investing.",
      "Use the compound simulator with fee and early-start comparisons until the curve feels intuitive.",
    ],
  },
  "growing-3a-3": {
    mechanism: [
      "Risk and return are linked because capital demands compensation for bearing uncertainty. If two opportunities had the same expected return but one was safer, rational money would move to the safer one until its price rose and expected return fell. Higher expected return is usually the market's way of compensating investors for volatility, illiquidity, credit risk, business risk, leverage, or the chance of permanent loss.",
      "Risk is not one thing. Volatility is the value moving around. Permanent loss is capital being destroyed or sold at the wrong time. Uncertainty is not even knowing the range of outcomes. Time horizon changes the meaning: a 30% stock market fall is dangerous for money needed next month, but may be survivable for money invested for 25 years.",
    ],
    example:
      "A savings account paying 4% with deposit protection is very different from a private scheme promising 18% with no clear assets, no audited accounts, and pressure to join quickly. On £50,000, the savings account might produce £2,000 before tax in a year. The 18% promise claims £9,000, but if the risk is fraud or business failure, the real outcome may be losing most of the £50,000. High return without visible risk usually means the risk is hidden, misunderstood, or being mis-sold.",
    principle:
      "The transferable principle is compensation. Before accepting any return, ask what risk you are being paid to bear, whether you can survive that risk, and whether the compensation is enough.",
    nuance:
      "The simple version breaks down when people say more risk automatically means more return. Bad risk is not rewarded; concentrated, expensive, fraudulent, or poorly understood risk can simply destroy capital. The goal is compensated risk, not maximum risk.",
    expert:
      "Experts think in asymmetry. Missing an extra 1% return is annoying; suffering permanent ruin is life-changing. That is why avoiding catastrophic loss can matter more than optimizing expected return.",
    questions: [
      "What specific risk am I being compensated for here: volatility, illiquidity, credit risk, leverage, concentration, or something else?",
      "What has to go wrong for this investment to suffer permanent loss?",
      "If the return is high, why is the opportunity available to me and not already competed away?",
    ],
    goDeeper: [
      "Read Against the Gods by Peter Bernstein for the history of risk thinking.",
      "Research risk premium, credit risk, liquidity risk, and sequence risk.",
      "Study common investment scam warnings from the FCA or your local regulator.",
    ],
  },
  "growing-3a-4": {
    mechanism:
      "Volatility is price movement; permanent loss is capital impairment. A diversified equity fund can fall 30% because buyers are fearful, rates rise, or earnings expectations reset. If the underlying businesses survive and you do not sell, the loss may be temporary. Permanent loss happens when the asset fails, the price never recovers, fraud occurs, leverage forces a sale, or you sell because you needed the money.",
    example:
      "A £100,000 portfolio falls 30% to £70,000. If the investor has cash reserves and a 20-year horizon, they can remain invested and may recover when markets recover. If they need £40,000 for a house deposit next month, they may be forced to sell after the fall, turning volatility into a realized loss. Same market movement, different personal risk.",
    expert:
      "Experts match assets to liabilities. They do not ask only whether an asset is good; they ask when the money is needed, what could force a sale, and whether the investor can emotionally and financially endure the path.",
    questions: [
      "Which parts of my portfolio are exposed to volatility, and when might I need that money?",
      "What would force me to sell during a downturn?",
      "How do we distinguish a temporary price fall from genuine permanent impairment?",
    ],
    goDeeper: [
      "Research sequence-of-returns risk.",
      "Study market drawdown charts and recovery periods.",
      "Read Winning the Loser's Game by Charles Ellis for behaviour and long-term discipline.",
    ],
  },
  "growing-3a-5": {
    mechanism:
      "Inflation sets a hurdle rate. If cash earns 2% and inflation is 5%, your nominal balance rises but your real purchasing power falls by roughly 3%. Over long horizons, this gap compounds. Investing exists partly to own assets whose earnings, rents, or values can adjust upward with the economy.",
    example:
      "£50,000 held for 25 years at 3% inflation has purchasing power of about £23,900 in today's money. If invested at 6% nominal, it becomes about £214,500 before tax and fees, worth roughly £102,500 in today's money after inflation. The investment path is uncertain, but the cash erosion is built into the arithmetic.",
    expert:
      "Experts treat cash as a tool with a job. Emergency cash, tax cash, and near-term purchase cash are sensible. Long-term wealth cash is usually a silent bet that inflation will not matter, which is rarely a safe assumption.",
    questions: [
      "Which cash balances are for liquidity, and which are accidentally long-term investment money?",
      "What inflation assumption is used in my plan, and what happens if it is higher?",
      "How do my assets, income, and debts respond to inflation?",
    ],
    goDeeper: [
      "Research real return and inflation-linked bonds.",
      "Use the inflation eroder in the Understanding section.",
      "Read central bank explainers on inflation targets and purchasing power.",
    ],
  },
  "growing-3b-1": {
    mechanism:
      "An equity is fractional ownership of a company. The shareholder participates in future profits through dividends, reinvested earnings, or a higher valuation. Individual shares concentrate risk in one business; broad funds spread ownership across hundreds or thousands of companies.",
    example:
      "If a company earns £10 million and has 10 million shares, earnings are £1 per share. If you own 1,000 shares, your economic claim is tiny but real. If the market values those earnings at 15 times profit, a rough share value is £15. If earnings fall or the market only pays 10 times earnings, price can fall even if the business survives.",
    expert:
      "Experts separate business quality from investment price. A wonderful company can be a poor investment if bought at an excessive valuation; an ordinary company can sometimes be attractive at the right price.",
    questions: [
      "Am I buying a single business risk or broad market exposure?",
      "What earnings, valuation, and growth assumptions are embedded in this equity exposure?",
      "How much single-company risk is appropriate given my business is already concentrated?",
    ],
    goDeeper: [
      "Read The Intelligent Investor for business ownership framing, while remembering it is not a product guide.",
      "Research earnings, dividends, valuation multiples, and market capitalization.",
      "Use Business Reality Check to connect company analysis with shareholder economics.",
    ],
  },
  "growing-3b-2": {
    mechanism:
      "A bond is a loan. The borrower promises interest payments and repayment of principal, but the market value of that promise moves when interest rates, inflation expectations, and credit risk change. When new bonds offer higher yields, older low-coupon bonds usually fall in price.",
    example:
      "A £10,000 bond pays 3% interest, or £300 per year. If new comparable bonds pay 5%, investors will not pay full price for the old 3% income stream. Its market price may fall so the effective yield becomes competitive. If you hold to maturity and the borrower pays, the path differs from selling early at the lower price.",
    expert:
      "Experts look at duration and credit quality. Duration estimates sensitivity to rate changes; credit quality estimates the chance of not being paid. A bond fund can be conservative or surprisingly volatile depending on these two variables.",
    questions: [
      "What duration and credit risk does this bond exposure carry?",
      "Is the role income, stability, liability matching, or diversification?",
      "What happens to this bond allocation if interest rates rise or inflation stays high?",
    ],
    goDeeper: [
      "Research bond duration, yield to maturity, and credit ratings.",
      "Read central bank explainers on interest rates and bond prices.",
      "Ask an adviser to show how bonds behaved in both falling-rate and rising-rate periods.",
    ],
  },
  "growing-3b-3": {
    mechanism:
      "Property combines asset value, rental income, leverage, maintenance, tax, and illiquidity. Direct ownership adds operational work and concentration. REITs or property funds provide exposure with more liquidity but less control. Leverage can amplify returns because you control a larger asset with borrowed money, but it also magnifies losses and cash-flow stress.",
    example:
      "A £300,000 property bought with a £75,000 deposit and £225,000 mortgage rises 10% to £330,000. Before costs, equity rises from £75,000 to £105,000, a 40% gain on deposit. If the property falls 10%, equity falls to £45,000, a 40% loss. Stamp duty, repairs, void periods, tax, and mortgage rates can materially change the result.",
    expert:
      "Experts underwrite property by net yield, leverage, location risk, tenant risk, liquidity, tax, and maintenance, not just the belief that property always goes up.",
    questions: [
      "What is the net yield after mortgage interest, voids, maintenance, insurance, tax, and management?",
      "How would the property perform if rates rose, rent fell, or it sat empty for three months?",
      "Does property diversify my business and portfolio, or concentrate me further in one local economy?",
    ],
    goDeeper: [
      "Research loan-to-value, net yield, REITs, and liquidity risk.",
      "Use Tax & Structures Lab before making structure or tax assumptions.",
      "Build a property stress test with rates, vacancy, repairs, and tax included.",
    ],
  },
  "growing-3b-4": {
    mechanism:
      "Cash is a claim on immediate spending power. Its strengths are certainty of nominal value, access, and optionality. Its weakness is inflation and reinvestment risk: the return may not keep up with prices, and future interest rates may be lower when deposits mature.",
    example:
      "A £30,000 reserve at 4% earns £1,200 before tax. At 6% inflation, real purchasing power still falls by about £600 in the first year. That may be an acceptable cost if the cash prevents a forced sale or covers taxes. It is less acceptable if the money is meant to fund retirement in 25 years.",
    expert:
      "Experts assign each cash balance a job. Emergency reserve, tax reserve, opportunity cash, and long-term idle cash are different categories and should not be judged by the same return target.",
    questions: [
      "What is the job of each cash balance I hold?",
      "Am I protected by deposit protection limits and using appropriate institutions?",
      "How much cash is resilience, and how much is avoidance of necessary long-term risk?",
    ],
    goDeeper: [
      "Research deposit protection limits and money market funds.",
      "Review cash laddering for near-term planned expenses.",
      "Compare nominal interest with after-tax, after-inflation return.",
    ],
  },
  "growing-3b-5": {
    mechanism:
      "Other assets often promise diversification, inflation protection, scarcity, or access to returns outside public markets. The mechanism must be understood asset by asset: commodities do not produce cash flow, private equity is illiquid, crypto relies on network value and sentiment, and collectibles depend on buyer demand.",
    example:
      "Putting £10,000 into a complex private deal with a claimed 15% return looks attractive against a 6% portfolio assumption. But if the capital is locked for seven years, fees are opaque, valuation is subjective, and you cannot sell during stress, the return must compensate for illiquidity and uncertainty. If it does not, complexity is being mistaken for sophistication.",
    expert:
      "Experts separate core portfolio from satellite exposure. The core should not depend on assets whose valuation, liquidity, custody, or legal rights the investor cannot explain.",
    questions: [
      "What cash flow, legal claim, scarcity, or utility supports this asset's value?",
      "How would I exit, and what could prevent me from exiting when I need to?",
      "Is this a core holding, a small satellite, or speculation I can afford to lose?",
    ],
    goDeeper: [
      "Research liquidity, custody, counterparty risk, and valuation methods.",
      "Read regulator warnings on complex and high-risk investments.",
      "Write a one-paragraph explanation of the asset before committing money.",
    ],
  },
  "growing-3c-1": {
    mechanism: [
      "An index is a rule-based list of securities representing a market or slice of a market. An index fund or ETF tries to own the securities in that list cheaply, so the investor receives the market return minus costs and tracking difference. You are not buying clever forecasts; you are buying broad participation.",
      "Most active managers underperform after fees for structural reasons. Before costs, all investors collectively own the market and receive the market return. Active managers as a group are the market before costs, but after research costs, trading costs, fees, and tax drag, the average active pound must lag the average low-cost market pound. Some active managers can win, but identifying them in advance and sticking with them is difficult.",
    ],
    example:
      "Suppose the market returns 7% before costs. A low-cost index fund charging 0.15% leaves about 6.85% before tax. An active fund charging 1.2% plus higher trading costs might need to earn more than 8% gross just to match the index fund. On £100,000 over 25 years, the difference between 6.85% and 5.8% can be well over £100,000 before tax.",
    principle:
      "The transferable principle is that in competitive systems, costs and behaviour matter because edge is hard to prove in advance. When you cannot reliably identify superior skill, owning the broad system cheaply is often the rational default.",
    nuance:
      "The simple version breaks down if it becomes index worship. Active may make sense in less efficient markets, specialized mandates, tax-aware portfolios, or where the investor has genuine edge. But active must justify its cost, risk, and process; it does not deserve trust merely because it sounds intelligent.",
    expert:
      "Experts know indexing is not a guarantee of safety. It gives market exposure, including market crashes. The advantage is breadth, transparency, low cost, and behavioural simplicity, not immunity from loss.",
    questions: [
      "What benchmark should this active strategy be compared with after all fees, taxes, and trading costs?",
      "What evidence suggests this manager or strategy has repeatable skill rather than recent luck?",
      "Could a low-cost index approach achieve the same goal with fewer moving parts?",
    ],
    goDeeper: [
      "Read A Random Walk Down Wall Street by Burton Malkiel.",
      "Read SPIVA scorecards on active manager performance versus benchmarks.",
      "Research tracking error, expense ratio, ETF, index methodology, and benchmark selection.",
    ],
  },
  "growing-3c-2": {
    mechanism: [
      "Diversification works because different assets do not move together perfectly. If one asset falls while another is flat or rising, the combined portfolio can have a smoother path than either asset alone. The key concept is correlation: how closely returns move together. Lower correlation can reduce volatility without proportionally reducing expected return.",
      "This is why diversification is called the only free lunch in finance. You are not removing all risk; you are removing avoidable, uncompensated concentration risk. Owning one company adds company-specific risk. Owning hundreds of companies keeps market risk but reduces the risk that one company ruins the plan.",
    ],
    example:
      "Imagine £100,000 split equally between two assets. Asset A rises 20% in year one and falls 10% in year two. Asset B falls 5% in year one and rises 12% in year two. The combined portfolio is less dramatic than either holding alone. The arithmetic matters because a 50% loss requires a 100% gain to recover; smoothing large falls helps compounding survive.",
    principle:
      "The transferable principle is that concentration should be intentional and compensated. If you are not being paid for a risk, or you cannot survive it, spread it.",
    nuance:
      "Diversification cannot prevent system-wide crashes. In crises, correlations often rise because investors sell many assets at once. Over-diversification is also possible when extra holdings add complexity, fees, and overlap without reducing a meaningful risk.",
    expert:
      "Experts look through labels to underlying exposure. A founder may own a business, UK property, UK clients, and UK equities and believe they are diversified because the account names differ. The real exposure may still be one country, one currency, one cycle, and one income source.",
    questions: [
      "What risks am I diversified across: companies, sectors, countries, currencies, asset classes, income sources, and time horizons?",
      "Which holdings overlap more than their labels suggest?",
      "Given my business concentration, what should the rest of my wealth deliberately not be exposed to?",
    ],
    goDeeper: [
      "Research correlation, covariance, and modern portfolio theory at an intuition level.",
      "Use the asset allocation explorer and founder balance tool together.",
      "Read The Intelligent Asset Allocator by William Bernstein.",
    ],
  },
  "growing-3c-3": {
    mechanism:
      "Fees reduce the return that remains invested, and the lost return also stops compounding. A 1% annual fee is charged every year on a balance that may grow. The visible cost is the fee itself; the hidden cost is the growth the fee would have earned if it stayed in the portfolio.",
    example:
      "Invest £1,000 per month for 30 years at 7% before costs. At 0.2% annual cost, the ending value is roughly £1.16 million. At 1.2% annual cost, it is roughly £960,000. The difference is around £200,000 before tax. The annual fee looked small; the compounded lifetime drag did not.",
    expert:
      "Experts compare total cost, not only fund fee. Platform fees, advice fees, bid-offer spreads, transaction costs, tax drag, and product wrapper costs can all behave like return drag.",
    questions: [
      "What is the all-in annual cost of this investment path, including product, platform, advice, trading, and tax drag?",
      "What value am I receiving for any fee above a low-cost alternative?",
      "How does a 0.5%, 1%, or 1.5% fee difference change the 20-year projection?",
    ],
    goDeeper: [
      "Research expense ratios, ongoing charges figure, platform fees, and total cost of ownership.",
      "Use the fee eroder simulator with your actual contribution level.",
      "Read John Bogle's writing on costs and index investing.",
    ],
  },
  "growing-3c-4": {
    mechanism:
      "Asset allocation chooses the mix of growth assets, stabilizing assets, liquid assets, and inflation-sensitive assets. It is the big decision because it determines most of the portfolio's risk and return pattern. Individual funds matter, but the allocation decides how much of each kind of risk you are taking.",
    example:
      "A £100,000 portfolio with 80% equities and 20% bonds might have higher long-term expected return but could fall £25,000 or more in a severe downturn. A 40% equity, 40% bond, 20% cash mix may fall less but may not grow enough over 30 years. Neither is universally right; the right answer depends on horizon, goals, reserves, business risk, and behaviour.",
    expert:
      "Experts start with liabilities and goals, not products. Money needed in 3 years, 10 years, and 30 years may deserve different allocations even for the same person.",
    questions: [
      "What is the reasoning behind the allocation proposed for me?",
      "How does the allocation change as I get closer to needing the money?",
      "How does my business concentration affect the portfolio's risk budget?",
    ],
    goDeeper: [
      "Research strategic asset allocation, rebalancing, and glide paths.",
      "Read The Four Pillars of Investing for allocation principles.",
      "Ask an adviser to show a bad-market scenario, not just an average-return projection.",
    ],
  },
  "growing-3c-5": {
    mechanism:
      "Tax wrappers change the tax treatment of contributions, growth, income, or withdrawals. The mechanism varies by country and product, but the principle is consistent: if less return leaks to tax each year, more remains invested and compounds. Wrappers can also impose limits, access rules, or withdrawal tax.",
    example:
      "If £20,000 grows at 6% for 25 years, it becomes about £85,800 before tax. If annual tax drag reduces the effective return to 5%, it becomes about £67,700. The difference is over £18,000 on one starting amount. With annual contributions, the gap can be far larger. A wrapper that reduces tax drag can be a compounding accelerator.",
    expert:
      "Experts coordinate wrappers with liquidity. A pension may be tax-efficient but inaccessible until later life. An ISA may be flexible but has annual limits. Tax efficiency is powerful, but the wrapper must match the money's time horizon and purpose.",
    questions: [
      "Which wrappers should be filled first given my tax rate, access needs, and retirement goals?",
      "What tax is saved now, what tax may be due later, and what access restrictions apply?",
      "How should business profits, pension contributions, and personal investments be coordinated?",
    ],
    goDeeper: [
      "Use Tax & Structures Lab for wrapper and structure thinking.",
      "Ask an accountant or adviser to model ISA, pension, taxable account, and company-retained-profit paths.",
      "Research current ISA and pension rules for your tax year.",
    ],
  },
  "growing-3c-6": {
    mechanism: [
      "The behaviour gap is the difference between investment returns and investor returns. A fund may return 7% over a period, but investors in the fund may earn less because they buy after good performance, sell after falls, pause contributions, or switch strategies at the wrong time.",
      "The psychological mechanisms are predictable. Loss aversion makes a £10,000 fall feel more painful than a £10,000 gain feels good. Recency bias makes the latest market feel like the new permanent reality. Overconfidence makes intelligent people believe they can out-think a noisy system. Action bias makes doing something feel safer than sitting still, even when action damages the plan.",
      "Intelligence does not immunize you. It can make the problem worse because clever people can build clever stories for emotional decisions. Structural defenses work better than willpower: automation, written rules, rebalancing bands, pre-agreed downturn behaviour, and fewer portfolio checks.",
    ],
    example:
      "An investor puts £100,000 into a diversified portfolio. It falls 25% to £75,000. They sell to cash, wait for things to feel safer, and buy back after the market has recovered to £95,000. They locked in the fall and missed part of the recovery. Another investor with reserves and rules stays invested and keeps contributing £1,000 per month, buying more units when prices are lower.",
    principle:
      "The transferable principle is that the investor is part of the system. A mathematically sound portfolio can fail if it is psychologically impossible to hold.",
    nuance:
      "The simple version breaks down when staying invested becomes blind stubbornness. Sometimes facts change: fraud, excessive concentration, unsuitable risk, or a changed time horizon may require action. The defence is not never acting; it is acting from pre-written principles rather than panic.",
    expert:
      "Experts design portfolios for the client who will exist during a crisis, not the calm version filling out a risk questionnaire in a good market.",
    questions: [
      "What rules will govern my behaviour during a 20%, 30%, or 40% portfolio fall?",
      "How often should I review this portfolio without turning review into tinkering?",
      "What automation or rebalancing policy can protect me from my own worst market instincts?",
    ],
    goDeeper: [
      "Read The Behavior Gap by Carl Richards.",
      "Research loss aversion, recency bias, overconfidence, and action bias.",
      "Look up DALBAR-style studies on investor returns versus investment returns, while noting methodology debates.",
    ],
  },
  "growing-3c-7": {
    mechanism:
      "Pound-cost averaging invests a fixed amount at regular intervals. When prices are high, the fixed amount buys fewer units; when prices are low, it buys more units. It does not guarantee profit or always beat lump-sum investing, but it turns investing into a process rather than a repeated emotional decision.",
    example:
      "Invest £1,000 per month. At £10 per unit, you buy 100 units. If the price falls to £8, you buy 125 units. If it later rises to £12, the units bought during the fall contribute more to recovery. The real benefit is that the plan continued when emotion wanted to stop.",
    expert:
      "Experts distinguish contribution discipline from market-timing claims. If you already have a large lump sum and a long horizon, lump-sum investing has often been mathematically favoured historically, but staged entry may still help behaviour and regret management.",
    questions: [
      "Should this money be invested immediately, staged over time, or kept liquid because I need it soon?",
      "What regular contribution can continue through bad markets?",
      "How do we automate contributions so I do not negotiate with myself each month?",
    ],
    goDeeper: [
      "Research pound-cost averaging versus lump-sum investing.",
      "Use the behaviour gap simulator to test stopping contributions in downturns.",
      "Read Vanguard or similar research on lump-sum versus staged investing, treating it as evidence not instruction.",
    ],
  },
  "growing-3d-1": {
    mechanism:
      "A founder's business concentrates risk in one company, sector, customer base, country, currency, team, and owner. The outside portfolio should be analysed together with that exposure. If the business is risky and illiquid, adding more risky illiquid investments may make the whole life fragile.",
    example:
      "A founder has a £500,000 business and a £50,000 portfolio. If the portfolio is also mostly small private business deals, the founder is not diversified; they have repeated the same kind of risk. If the £50,000 is liquid, global, diversified, and low cost, it is small but strategically different.",
    expert:
      "Experts build a total balance sheet. They include business value, salary dependence, property, pensions, cash, debt, and human capital before deciding what the investment portfolio should do.",
    questions: [
      "What risks does my business already load onto my personal balance sheet?",
      "Should my portfolio seek excitement or deliberately provide boring counterweight?",
      "How much liquidity outside the business is enough before I take more business risk?",
    ],
    goDeeper: [
      "Research total balance sheet planning for business owners.",
      "Use the portfolio versus business balance tool.",
      "Ask an adviser to analyse your business as part of your asset allocation.",
    ],
  },
  "growing-3d-2": {
    mechanism:
      "Liquidity gives a founder time. When revenue slows, funding dries up, or a strategic opportunity appears, liquid assets prevent forced decisions. The mechanism is optionality: cash and liquid investments allow you to choose when to sell, borrow, hire, cut, invest, or negotiate.",
    example:
      "A business has a three-month slow period and the household needs £6,000 per month. With £6,000 of liquidity, pressure arrives immediately. With £60,000 of liquidity, the founder has 10 months to adjust without selling investments at a bad time or accepting poor client terms.",
    expert:
      "Experts know liquidity is most valuable when everyone else also wants it. In downturns, credit tightens, customers delay, asset prices fall, and investors become cautious at the same time.",
    questions: [
      "How many months can my household and business survive if revenue drops sharply?",
      "Which assets are truly liquid during stress, and which only look liquid in normal markets?",
      "How should personal reserves and business runway be separated?",
    ],
    goDeeper: [
      "Research business runway, personal emergency funds, and liquidity ladders.",
      "Build a founder liquidity policy: minimum household reserve, tax reserve, and business runway.",
      "Read about optionality and margin of safety in business finance.",
    ],
  },
  "growing-3d-3": {
    mechanism:
      "A liquidity event converts concentrated, illiquid value into liquid capital. That changes tax, risk, identity, and behaviour all at once. The mechanism is a sudden shift from growth problem to stewardship problem: protect the windfall, plan tax, decide purpose, and avoid irreversible moves while emotions are loud.",
    example:
      "A founder sells a business and receives £1 million before tax. If £250,000 is due in tax, £150,000 is spent quickly, and £400,000 is put into speculative deals, the life-changing event can shrink fast. A slower approach might reserve tax immediately, hold a cash buffer, stage investment decisions, and create a written policy before large commitments.",
    expert:
      "Experts often recommend a cooling-off period. The sale may create grief, excitement, pressure from advisers, pitches from friends, and lifestyle temptation. Good process protects against becoming a forced buyer of bad ideas.",
    questions: [
      "What tax planning must happen before the event rather than after it?",
      "What amount should be set aside immediately for tax, lifestyle transition, reserves, and long-term investment?",
      "What decision rules should be written before anyone pitches me products or deals?",
    ],
    goDeeper: [
      "Use Tax & Structures Lab for exit planning concepts.",
      "Research windfall planning and investment policy statements.",
      "Interview advisers before a liquidity event, not during the emotional aftermath.",
    ],
  },
  "growing-3d-4": {
    mechanism:
      "Reinvestment competes with diversification. Business reinvestment may have high expected return because you have control and information, but it also increases concentration. Diversification may have lower expected return but improves survival and independence. The capital allocation decision weighs expected return, risk, liquidity, control, and total-life exposure.",
    example:
      "You have £100,000 surplus. Putting it into the business might plausibly return 25% if it funds a proven acquisition channel, but could lose half if assumptions fail. Investing it in a diversified portfolio might target 5-7% over time with volatility. The question is not which number is bigger; it is how much of your life can depend on the business case being right.",
    expert:
      "Experts use hurdle rates and risk budgets. A business reinvestment should clear a high bar because it adds to an already concentrated position. The more personal wealth is tied to the company, the stronger the argument for outside diversification.",
    questions: [
      "What evidence supports the return on this business reinvestment?",
      "What percentage of my total net worth and income would still depend on the business after this decision?",
      "What outside diversification target should be met before more capital goes back into the company?",
    ],
    goDeeper: [
      "Use Business Reality Check to stress-test reinvestment assumptions.",
      "Research hurdle rates, opportunity cost, and capital allocation.",
      "Ask an adviser to model business reinvestment and outside diversification as one balance-sheet decision.",
    ],
  },
  "protecting-1": {
    mechanism:
      "Fragility comes from single points of failure. One income source, one client, no reserves, high debt, no insurance, one asset, or legal exposure can make a person financially brittle. Resilience adds buffers, alternatives, and shock absorbers so a bad event hurts but does not break the machine.",
    example:
      "A founder earning £12,000 per month from one client with £10,000 monthly fixed costs and £5,000 cash is fragile. Losing the client creates crisis within weeks. Another founder earns £9,000 from several clients, keeps fixed costs at £5,000, holds £40,000 cash, and has appropriate cover. Lower income, stronger machine.",
    expert:
      "Experts ask what fails together. Income, portfolio, property, and business may all be exposed to the same economic cycle, so resilience is not just having many things; it is having things that do not all break at once.",
    questions: [
      "What are my top three single points of failure?",
      "Which shock would force action fastest: income loss, lawsuit, illness, debt reset, market fall, or tax bill?",
      "What is the cheapest next move that increases shock absorption?",
    ],
    goDeeper: [
      "Research margin of safety and redundancy in personal finance.",
      "Use the fragility test and resilience builder.",
      "Read Antifragile selectively for the idea of systems that benefit from stress, while keeping financial risk practical.",
    ],
  },
  "protecting-2": {
    mechanism:
      "Diversification protects by reducing dependence on one outcome. Across income, assets, geography, currency, and counterparties, it limits the damage of being wrong in one place. It does not eliminate market risk; it reduces idiosyncratic risk that you are not reliably paid to bear.",
    example:
      "If 80% of net worth is a UK service business and the remaining 20% is a buy-to-let in the same city, a local downturn can hit clients, property value, rent, and business income together. A globally diversified liquid portfolio would not remove all risk, but it would add exposures that are not identical to the business.",
    principle:
      "The transferable principle is that risks sharing the same cause are not truly diversified. Real diversification asks what event would hurt everything at once.",
    nuance:
      "Diversification cannot protect against every system-wide crash, and too many overlapping funds can add clutter without new protection. The goal is meaningful difference, not a long list of holdings.",
    expert:
      "Experts examine correlation in bad times, not just normal times. Assets that look different in a calm market may all depend on cheap credit, local property prices, or founder income when stress arrives.",
    questions: [
      "What common cause could damage my income, business value, property, and portfolio at the same time?",
      "Which diversifiers would actually behave differently under stress?",
      "Am I concentrated because I have genuine edge or because the asset feels familiar?",
    ],
    goDeeper: [
      "Research correlation and concentration risk.",
      "Map your assets by country, currency, liquidity, and economic driver.",
      "Use the asset allocation explorer from the Growing section.",
    ],
  },
  "protecting-3": {
    mechanism:
      "Insurance pools many people's premiums to pay for the few who suffer covered events. You pay a known cost to transfer an uncertain, potentially severe cost. The mechanism only works for you if the covered event, exclusions, payout amount, waiting period, and claim process match the risk you are trying to transfer.",
    example:
      "If illness stops you working for six months and household expenses are £5,000 per month, the cash need is £30,000. A £10,000 reserve leaves a £20,000 gap. Appropriate income protection might cover part of that gap after a waiting period, while an emergency fund covers the waiting period.",
    expert:
      "Experts read exclusions and definitions. Own-occupation disability cover, any-occupation cover, waiting periods, indexation, and claim definitions can matter more than a headline premium.",
    questions: [
      "What exact event is this policy designed to protect against?",
      "What are the exclusions, waiting periods, payout limits, and definitions?",
      "Which risks should be covered by insurance versus cash reserves?",
    ],
    goDeeper: [
      "Research income protection, critical illness, life cover, liability, and professional indemnity.",
      "Ask a broker to explain three scenarios where the policy would not pay.",
      "Review coverage whenever income, dependents, debt, or business structure changes.",
    ],
  },
  "protecting-4": {
    mechanism:
      "Legal structures create boundaries between people, assets, contracts, and liabilities. A limited company may separate business obligations from personal assets, but only if operated properly. Contracts, insurance, record-keeping, and compliance all support the boundary.",
    example:
      "A consultant trading personally may be directly exposed if a client claim succeeds. Operating through a limited company may limit certain claims to company assets, but personal guarantees, negligence, tax debts, or poor separation can still reach the individual. The structure helps, but it is not a force field.",
    expert:
      "Experts know structure must match real behaviour. Mixing accounts, signing personal guarantees, ignoring contracts, or under-insuring can undo much of the protection people think they have.",
    questions: [
      "Which liabilities are actually limited by my current structure, and which are not?",
      "Have I signed personal guarantees or contracts that bypass the protection?",
      "What records, insurance, and governance are required to maintain the boundary?",
    ],
    goDeeper: [
      "Use Tax & Structures Lab for entity and liability concepts.",
      "Speak with a qualified solicitor and accountant before relying on a structure.",
      "Research limited liability, personal guarantees, and director responsibilities.",
    ],
  },
  "protecting-5": {
    mechanism:
      "The emergency reserve protects by buying time. Time lets you find a better client, wait for markets to recover, handle an insurance waiting period, or negotiate without desperation. The reserve is not measured only by amount; it is measured by months of essential expenses and speed of access.",
    example:
      "With £6,000 monthly expenses, £12,000 is two months and £48,000 is eight months. If a business shock takes four months to solve, the first reserve forces borrowing or selling; the second reserve allows deliberate decisions. The same shock has different consequences because liquidity changes timing.",
    expert:
      "Experts often separate household reserve from business runway. A company may need three months of operating costs while the household needs six months of expenses; mixing them can create false confidence.",
    questions: [
      "How many months of essential household expenses and business runway do I have separately?",
      "What events would require immediate cash before insurance or invoices arrive?",
      "Should my reserve target change because my business or family obligations changed?",
    ],
    goDeeper: [
      "Research liquidity ladders and business runway planning.",
      "Review the Keeping section's emergency reserve calculator.",
      "Ask a planner how they size reserves for founders with variable income.",
    ],
  },
  "protecting-6": {
    mechanism:
      "Catastrophic mistakes are dangerous because losses are asymmetric. A 50% loss requires a 100% gain to recover; bankruptcy, fraud, legal liability, and forced liquidation can remove the ability to keep playing. Avoiding ruin preserves the option to benefit from future compounding.",
    example:
      "A £200,000 portfolio loses 20%, falling to £160,000. Painful, but recoverable. If the same person personally guarantees a £200,000 business loan that fails, their portfolio and future income may be consumed by debt. The second outcome is not just a drawdown; it can change life options.",
    expert:
      "Experts treat leverage, guarantees, concentration, fraud, and irreversible commitments with special caution because they can turn a normal error into ruin.",
    questions: [
      "What is the worst-case outcome, and can I survive it without permanent damage?",
      "Am I using leverage or guarantees that could reach beyond the asset itself?",
      "What decision would I reverse if the downside happened tomorrow?",
    ],
    goDeeper: [
      "Research margin of safety, recourse debt, and personal guarantees.",
      "Read about financial blow-ups caused by leverage and concentration.",
      "Ask a solicitor before signing guarantees or high-liability contracts.",
    ],
  },
  "protecting-7": {
    mechanism:
      "Scams exploit trust, urgency, identity, and greed. The mechanism is usually pressure plus opacity: high promised returns, low stated risk, limited time, social proof, and resistance to independent verification. The victim is moved from analysis into emotion.",
    example:
      "A scheme promises 4% per month, says capital is protected, and asks for £25,000 by Friday to access a private allocation. 4% per month compounds to about 60% per year. If that return were genuinely low risk, large institutions would compete it away. The mismatch between promised return and stated risk is the warning.",
    expert:
      "Experts verify independently. They check regulation, custody, audited accounts, legal documents, withdrawal rights, conflicts of interest, and whether returns make economic sense.",
    questions: [
      "Who regulates this, who holds the assets, and how can I verify that independently?",
      "What risk explains this return, and why has the market not competed it away?",
      "What happens if I say I need two weeks and independent professional review?",
    ],
    goDeeper: [
      "Read FCA or local regulator scam warning lists.",
      "Research Ponzi schemes, affinity fraud, and boiler-room tactics.",
      "Create a personal rule: no urgent private investment without independent review.",
    ],
  },
  "understanding-1": {
    mechanism:
      "Money works because people accept it as a medium of exchange, unit of account, and store of value. Modern money is created through a banking and central-bank system: commercial banks create deposits when they lend, central banks influence reserves and rates, and trust in the system keeps the claims usable.",
    example:
      "When a bank issues a £250,000 mortgage, it creates a deposit for the seller and a loan for the borrower. New purchasing power enters the economy, backed by the borrower's future repayments and the property collateral. Multiply this across millions of loans and credit creation becomes a major part of money supply.",
    expert:
      "Experts know money is both a social agreement and a balance-sheet system. This is why confidence, regulation, credit standards, and central-bank credibility matter.",
    questions: [
      "How does credit creation affect asset prices and business conditions in my environment?",
      "What assumptions about currency stability and banking safety does my plan rely on?",
      "How should I separate bank deposits, investments, and business cash for protection?",
    ],
    goDeeper: [
      "Read the Bank of England explainer Money creation in the modern economy.",
      "Research money supply, central banks, and fractional-reserve banking.",
      "Study the difference between bank deposits, cash, and investment assets.",
    ],
  },
  "understanding-2": {
    mechanism: [
      "Inflation is a broad rise in prices, but the mechanism can begin in several places. Demand-pull inflation happens when spending power rises faster than goods and services. Cost-push inflation happens when energy, wages, imports, or supply constraints raise costs. Money and credit matter because more purchasing power chasing limited output can lift price levels.",
      "Moderate inflation is often policy, not accident. Many central banks target low positive inflation because mild inflation can give the economy flexibility, reduce the risk of deflation, and allow wages and prices to adjust. But inflation is also a hidden tax on cash because each pound buys less, and a hidden discount on fixed-rate debt because future repayments are made in cheaper pounds.",
    ],
    example:
      "If inflation is 4%, something costing £10,000 today costs about £14,800 in 10 years if prices rise steadily. A £100,000 cash balance would need to become £148,000 just to keep the same purchasing power. A fixed £1,500 mortgage payment may feel smaller over time if income rises with inflation, but a variable-rate loan may become more expensive if rates rise to fight inflation.",
    principle:
      "The transferable principle is that every long-term number must be translated into real purchasing power. Nominal pounds are labels; real value is what those pounds can buy.",
    nuance:
      "Inflation is uneven. Your personal inflation rate may differ from the headline if your spending is heavy on rent, childcare, travel, food, or imported goods. Asset prices can inflate even when consumer inflation looks calm.",
    expert:
      "Experts ask who has pricing power. Workers, businesses, landlords, borrowers, and savers experience inflation differently depending on whether their income, assets, and debts adjust.",
    questions: [
      "What inflation assumption is used in this projection, and what happens if my personal inflation is higher?",
      "Which parts of my income and assets can adjust with inflation?",
      "Do I hold too much long-term cash or fixed income that could be quietly eroded?",
    ],
    goDeeper: [
      "Read central bank inflation explainers and inflation reports.",
      "Research real returns, inflation-linked bonds, and pricing power.",
      "Use the inflation eroder to test 2%, 4%, and 7% inflation over 30 years.",
    ],
  },
  "understanding-3": {
    mechanism: [
      "Interest rates are the price of money through time. Central banks raise or lower policy rates to influence borrowing, saving, spending, inflation, employment, and currency conditions. Higher rates make borrowing more expensive and saving more attractive, which can cool demand. Lower rates do the reverse.",
      "Rates transmit through mortgages, business loans, savings accounts, bond yields, currency, and asset prices. Asset values often move inversely to rates because future cash flows are discounted at a higher rate. If an asset is expected to pay £10,000 per year, that income is worth more when safe rates are 1% than when safe rates are 5%, because investors now have a better alternative.",
    ],
    example:
      "A £300,000 repayment mortgage at 2% over 25 years costs roughly £1,270 per month. At 6%, it costs roughly £1,930 per month. That £660 monthly difference changes household surplus, property affordability, and buyer demand. For businesses, a project that looked attractive when borrowing cost 3% may fail the hurdle rate when borrowing costs 8%.",
    principle:
      "The transferable principle is discounting. The value of future money depends on the return available today and the risk of waiting.",
    nuance:
      "Knowing the direction of travel often matters more than predicting the exact rate. Fixed versus variable debt, refinancing dates, cash yields, bond duration, and business investment all respond to rate regimes.",
    expert:
      "Experts watch real rates, not just nominal rates. A 5% interest rate with 6% inflation is different from a 5% rate with 2% inflation.",
    questions: [
      "How sensitive are my mortgage, business, portfolio, and property assumptions to rate changes?",
      "What refinancing or duration risk am I carrying?",
      "Are we using nominal rates or real rates in this analysis?",
    ],
    goDeeper: [
      "Research discount rates, bond duration, and central bank policy transmission.",
      "Read Bank of England or Federal Reserve explainers on rate decisions.",
      "Stress-test debt payments at rates 2-3 percentage points higher than today.",
    ],
  },
  "understanding-4": {
    mechanism: [
      "Debt brings future money into the present. Used against an appreciating or income-producing asset, it can amplify returns because you control a larger asset than your own cash would allow. Used for depreciating consumption, it pulls future income backward and adds interest to something that may be worth less each month.",
      "Leverage amplifies both gains and losses. If you use £50,000 deposit to control a £250,000 asset and it rises 10%, the asset gain is £25,000, a 50% gain on deposit before costs. If it falls 10%, the £25,000 loss is also 50% of deposit. Debt does not change only the upside; it changes the whole distribution.",
    ],
    example:
      "Borrow £20,000 at 8%. If it funds equipment that reliably adds £8,000 annual profit, the debt may be productive after repayments and risk. If it funds a car that loses £4,000 of value in year one and costs £1,600 interest, the first-year economic drag is £5,600 before running costs. Same loan size, completely different wealth effect.",
    principle:
      "The transferable principle is matching. Debt should be matched to an asset or cash flow that can service it under stress, with a downside you can survive.",
    nuance:
      "Good debt can turn bad through over-leverage, variable rates, income disruption, poor asset quality, or bad timing. Bad debt can sometimes be rational for short-term necessity, but it should be recognized as a cost, not dressed up as strategy.",
    expert:
      "Experts ask about recourse, collateral, term, rate reset, cash-flow coverage, and exit plan. The label good debt is never enough.",
    questions: [
      "What cash flow repays this debt if the optimistic case does not happen?",
      "How does the decision perform if rates rise, income falls, or the asset value drops?",
      "Is the debt fixed or variable, secured or unsecured, recourse or non-recourse?",
    ],
    goDeeper: [
      "Research leverage, debt service coverage, amortization, and recourse.",
      "Use the good debt versus bad debt simulator with realistic rates.",
      "Ask a lender or adviser to show the stress case, not just the approval amount.",
    ],
  },
  "understanding-5": {
    mechanism:
      "Economic cycles emerge because credit, confidence, investment, employment, inventories, and policy feed on each other. In expansions, confidence and borrowing rise. At peaks, valuations and optimism can outrun fundamentals. In slowdowns, spending and hiring weaken. In recessions, fear and forced selling create pain and sometimes opportunity.",
    example:
      "A founder sells software to small businesses. During expansion, customers approve £500 monthly tools quickly. During recession, the same customers cut non-essential subscriptions and ask for discounts. If the founder built cash reserves and low fixed costs during the boom, they can survive and perhaps acquire customers more cheaply during the downturn.",
    expert:
      "Experts know cycles are normal, but timing them precisely is hard. The practical edge is preparation: avoid overcommitting in booms and keep enough liquidity to act in downturns.",
    questions: [
      "How cyclical is my income, business, property, and portfolio?",
      "What should I do during good times to be strong during bad times?",
      "Where might opportunity appear in a downturn if I have liquidity?",
    ],
    goDeeper: [
      "Research credit cycles and business cycles.",
      "Read Howard Marks' memos on cycles and risk.",
      "Use Business Reality Check to stress-test demand in different cycle phases.",
    ],
  },
  "understanding-6": {
    mechanism:
      "Asset prices move when expectations about future cash flows, discount rates, liquidity, and sentiment change. A share price can fall because profits fall, because rates rise, because investors demand a higher risk premium, or because fear dominates even before fundamentals change.",
    example:
      "A business expected to produce £1 million of annual profit may be valued at 20 times earnings when rates are low and growth optimism is high, implying £20 million. If rates rise and investors only pay 12 times earnings, the valuation falls to £12 million even if profit is unchanged. Price moved because the multiple changed.",
    expert:
      "Experts distinguish fundamentals from valuation and sentiment. Good news can still produce a falling price if expectations were even higher; bad news can produce a rising price if the market expected worse.",
    questions: [
      "Is this price move about cash flows, rates, liquidity, sentiment, or expectations?",
      "What assumptions are embedded in the current valuation?",
      "Am I reacting to price movement or to a change in the long-term thesis?",
    ],
    goDeeper: [
      "Research valuation multiples, discount rates, and risk premiums.",
      "Read The Most Important Thing by Howard Marks.",
      "Compare business fundamentals with market price over several historical periods.",
    ],
  },
  "understanding-7": {
    mechanism:
      "Credit systems estimate whether you will repay. Lenders look at income, stability, payment history, debt load, available credit, collateral, and documentation. Good credit increases options, but more available borrowing also increases the temptation to overextend.",
    example:
      "Two founders both earn £100,000. One has clean accounts, low personal debt, consistent payments, and organised company records. The other has missed payments, high credit-card balances, and unclear income documentation. Even with similar income, lenders may offer very different rates, limits, or approvals.",
    expert:
      "Experts know being lendable before you need money is valuable. Cleaning up records, reducing utilization, and documenting income can take time, so creditworthiness is built in advance.",
    questions: [
      "How does the financial system currently see me: income stability, debt load, payment history, and documentation?",
      "What credit improvements should be made before I need borrowing capacity?",
      "How much borrowing capacity is useful flexibility, and how much would create fragility?",
    ],
    goDeeper: [
      "Research credit utilization, debt-to-income ratios, and affordability tests.",
      "Check your credit reports from reputable agencies.",
      "Ask a mortgage broker how founder income is assessed differently from salaried income.",
    ],
  },
  "understanding-8": {
    mechanism:
      "Government policy affects the economy through taxes, spending, borrowing, regulation, and incentives. Tax changes alter after-tax returns and behaviour. Spending can support demand or infrastructure. Borrowing affects bond markets and future policy choices. Regulation changes what businesses and investors can do.",
    example:
      "A change in dividend tax affects whether a founder prefers salary, dividends, pension contributions, or retained company profit. A change in capital gains tax affects exit planning. A change in property tax can alter buy-to-let returns. The same business or investment can look different after policy changes.",
    expert:
      "Experts do not build plans that only work under one tax rule. They use current rules carefully but keep flexibility because policy is political and can change.",
    questions: [
      "Which parts of my plan depend heavily on current tax rules?",
      "What flexibility do I have if allowances, rates, or reliefs change?",
      "Are tax decisions being coordinated with investment, liquidity, and protection needs?",
    ],
    goDeeper: [
      "Use Tax & Structures Lab for deeper tax and structure work.",
      "Review official government guidance for current tax-year rules.",
      "Ask an accountant to identify policy-sensitive parts of your plan.",
    ],
  },
  "connections-1": {
    mechanism:
      "The full machine is a flow. Income enters through Making. Keeping decides how much survives. Growing compounds the retained capital. Protecting prevents shocks from forcing bad actions. Understanding updates the map as inflation, rates, tax, credit, and cycles change.",
    example:
      "A founder earns £120,000, keeps £24,000 after tax and lifestyle, invests it at a long-term 6%, holds £30,000 reserves, and understands that rates are rising. If any one part is absent, the outcome changes: no keeping means no capital, no protection means forced selling, no understanding means rate-sensitive debt may surprise them.",
    expert:
      "Experts rarely answer a serious financial question in one domain only. An investment question may be a tax question, liquidity question, behaviour question, and business-concentration question at the same time.",
    questions: [
      "Which domain is currently limiting the whole machine?",
      "What second-order effects does this decision create in tax, liquidity, risk, and behaviour?",
      "If one domain failed this year, which other domains would be dragged down with it?",
    ],
    goDeeper: [
      "Map your financial life as flows between income, spending, assets, debt, tax, and risk.",
      "Use the Machine Simulator after each major lesson.",
      "Bring the exported plan to a qualified adviser and ask them to challenge the system, not just products.",
    ],
  },
  "connections-2": {
    mechanism:
      "The wealth loop converts earned income into saved capital, saved capital into invested capital, and invested capital into future income. The loop accelerates when contributions rise, costs fall, tax drag is managed, and behaviour stays consistent.",
    example:
      "A founder invests £2,000 per month. At 6% for 20 years, that can become about £924,000 before tax and fees. At a 3.5% withdrawal rate, that capital could theoretically support about £32,000 per year of portfolio withdrawals. It may not replace the business fully, but it becomes a second engine.",
    expert:
      "Experts know the loop is fragile in its early years. The first £100,000 often comes mostly from contributions; later growth comes increasingly from the portfolio itself. Protecting the early habit matters.",
    questions: [
      "What monthly surplus reliably feeds my wealth loop?",
      "At what portfolio size does investment income become meaningful relative to business income?",
      "What leaks are slowing the loop most: tax, fees, lifestyle, debt, or behaviour?",
    ],
    goDeeper: [
      "Research financial independence withdrawal-rate debates without treating any rule as universal.",
      "Use the compound simulator to connect contribution rate to future investment income.",
      "Read The Simple Path to Wealth for a plain-language version of the loop, then add tax and founder nuance.",
    ],
  },
  "connections-3": {
    mechanism:
      "The business and portfolio are partners because they should do different jobs. The business pursues concentrated upside and active control. The portfolio provides diversification, liquidity, and lower-effort compounding. Together they can create both ambition and resilience.",
    example:
      "A founder with a £400,000 business and £40,000 portfolio is 91% business-exposed. Adding another £40,000 to the company may increase upside, but adding £40,000 to a diversified liquid portfolio doubles outside resilience. The right answer depends on expected business return and current fragility.",
    expert:
      "Experts treat business reinvestment as an investment decision with opportunity cost. Control does not eliminate risk; it can make risk feel more comfortable than it really is.",
    questions: [
      "What job should my business do, and what job should my portfolio do?",
      "How much of my future income and net worth already depends on one company?",
      "What level of outside assets would let me take business risks without personal panic?",
    ],
    goDeeper: [
      "Use Business Reality Check and the founder balance tool together.",
      "Research total wealth allocation for entrepreneurs.",
      "Ask an adviser to include the business in your asset allocation conversation.",
    ],
  },
  "connections-4": {
    mechanism:
      "Tax touches every stage because money changes form: revenue becomes salary, dividends, profit, capital gains, pension contributions, investment income, property income, gifts, or estate assets. Each form may have different timing, rates, allowances, and reporting duties.",
    example:
      "A £50,000 company profit can be retained, paid as salary, paid as dividends, contributed to pension, reinvested, or eventually extracted after a sale. Each path changes tax, liquidity, risk, and future compounding. The best path is rarely obvious from the tax rate alone.",
    expert:
      "Experts coordinate tax with commercial reality. A tax-efficient structure that blocks cash access, increases admin, or worsens investment decisions may not be efficient in the broader machine.",
    questions: [
      "At which points does this plan create taxable events?",
      "Which decisions must be made before income, investment growth, or a sale happens?",
      "What is tax-efficient but still liquid, compliant, and aligned with my goals?",
    ],
    goDeeper: [
      "Use Tax & Structures Lab as the companion depth tool.",
      "Ask an accountant for scenario modelling rather than a single recommendation.",
      "Research current-year allowances, wrappers, company extraction, and capital gains rules.",
    ],
  },
  "connections-5": {
    mechanism:
      "Time multiplies because many financial advantages require duration: compounding, tax qualification periods, business reputation, customer trust, pension growth, insurance planning, gifting windows, and skill accumulation. Impatience interrupts processes whose payoff is back-loaded.",
    example:
      "Investing £1,000 per month for 10 years at 6% creates about £164,000 before tax and fees. For 30 years, it creates about £1 million. The contribution only triples, but the ending value increases more than sixfold because time gives earlier pounds more periods to work.",
    expert:
      "Experts protect time-sensitive advantages early. Waiting until the year of a sale, retirement, or crisis often removes planning options that existed years earlier.",
    questions: [
      "Which parts of my plan benefit most from starting early?",
      "Which tax, pension, business, or protection decisions have qualification periods or waiting periods?",
      "What small action this month has a large payoff only because time can work on it?",
    ],
    goDeeper: [
      "Research rule of 72, pension contribution timing, and business exit planning timelines.",
      "Use the compound simulator's start-10-years-earlier comparison.",
      "Ask advisers which planning windows close if I wait.",
    ],
  },
  "connections-6": {
    mechanism:
      "Resilience enables aggression because buffers let you choose risk instead of being forced by it. With reserves, diversification, insurance, and low fixed costs, a founder can reject bad clients, keep investing in downturns, and pursue business opportunities without risking personal ruin.",
    example:
      "A founder with £5,000 cash and £8,000 monthly fixed costs may accept a bad client contract to survive. A founder with £60,000 reserves can decline it, keep standards, and wait for better work. The second founder can be more aggressive strategically because they are less desperate financially.",
    expert:
      "Experts distinguish risk capacity from risk tolerance. You may feel brave, but capacity is mathematical: reserves, debt, dependents, liquidity, and income stability.",
    questions: [
      "What resilience would let me take better business risks?",
      "Am I taking risks from strength or from lack of alternatives?",
      "Which protection measure would most improve my risk capacity?",
    ],
    goDeeper: [
      "Research risk capacity versus risk tolerance.",
      "Use the resilience builder and Machine Simulator together.",
      "Read about margin of safety in investing and business strategy.",
    ],
  },
  "connections-7": {
    mechanism:
      "Sequencing means solving the constraint that blocks the next stage. No income means keeping has little to work with. No surplus means investing is theory. No reserve means investing may be interrupted. No understanding means the wrong debt, tax, or risk choice can undermine everything.",
    example:
      "Someone with £2,000 monthly surplus but no emergency reserve may first build £15,000 cash before increasing investments. Someone with £50,000 idle cash, stable income, and no high-interest debt may move to an investment plan. Same domains, different sequence.",
    expert:
      "Experts do not apply generic checklists blindly. They identify the binding constraint: cash flow, debt, tax, liquidity, concentration, behaviour, or knowledge.",
    questions: [
      "What is the current binding constraint in my machine?",
      "What should wait until a more basic layer is secure?",
      "How should my sequence change if income, family, tax, or business risk changes?",
    ],
    goDeeper: [
      "Research financial order of operations frameworks, then adapt them to founder life.",
      "Use the Hub's weakest-domain indicator as a diagnostic, not a judgement.",
      "Ask an adviser what they would prioritize first and why.",
    ],
  },
  "connections-8": {
    mechanism:
      "Self-diagnosis turns education into action. The mechanism is scoring each domain, identifying the weakest link, and choosing one improvement that changes the whole system. Reflection matters because confidence and competence are not always the same.",
    example:
      "A founder may score Making 80, Keeping 45, Growing 25, Protecting 35, Understanding 40. The obvious temptation is to keep improving the business. The machine answer is different: a cash-flow system, emergency reserve, and investment foundation may improve total life more than another revenue tactic.",
    expert:
      "Experts listen for imbalance. A client who is brilliant at earning but vague on liquidity, tax, insurance, and allocation is not advanced; they are uneven.",
    questions: [
      "Where am I strongest because I have real skill, and where am I just familiar?",
      "Which weak domain creates the most risk for the domains I am already good at?",
      "What evidence would show this domain improved 90 days from now?",
    ],
    goDeeper: [
      "Re-run the self-assessment quarterly.",
      "Export the plan and ask a professional to identify blind spots.",
      "Keep a decision journal for major financial choices and revisit outcomes.",
    ],
  },
};

const fallbackProfile = (lesson: LessonSeed): DeepProfile => {
  const domain = domainFor(lesson.id);
  const concept = cleanTitle(lesson.title).toLowerCase();
  return {
    mechanism: `Mechanically, ${concept} changes the flow of money, risk, time, or information in the machine. Start with the cash amount, identify who controls it, when it moves, what risk it carries, and what future option it creates or removes.`,
    example: `Use a simple founder example: take £10,000, decide whether it is spent, reserved, invested, insured, borrowed against, or taxed, and then track the result over 12 months and 10 years. The same £10,000 can become comfort, capability, resilience, capital, or fragility depending on the mechanism.`,
    expert: `Experts translate ${concept} into trade-offs: return versus risk, liquidity versus growth, tax efficiency versus flexibility, and simplicity versus control.`,
    questions: [
      `What problem is ${concept} solving in my specific situation?`,
      `What numbers and assumptions would change the answer?`,
      `What would make this apparently sensible idea fail in practice?`,
    ],
    goDeeper: [
      `Research ${cleanTitle(lesson.title)} with sources from regulators, central banks, established finance authors, or qualified professional bodies.`,
      `Ask a ${professionalLanguage[domain]} to explain the downside case in plain English.`,
    ],
  };
};

export const buildDeepDive = (lesson: LessonSeed): LessonDeepDive => {
  const domain = domainFor(lesson.id);
  const profile = profiles[lesson.id] ?? fallbackProfile(lesson);
  const concept = cleanTitle(lesson.title);
  return {
    why: [
      ...toArray(profile.why),
      `${concept} exists because real financial life creates a problem that a simple bank balance cannot solve. ${lesson.body} The intuition is to ask what would go wrong if you ignored this concept entirely.`,
    ],
    mechanism: toArray(profile.mechanism),
    example: toArray(profile.example),
    principle: [...toArray(profile.principle), domainPrinciple[domain]],
    nuance: [...toArray(profile.nuance), domainNuance[domain]],
    expert: toArray(profile.expert),
    questions: profile.questions,
    web: lesson.connections.map(
      (connection) =>
        `${connection} In practice, this means the decision should be checked against cash flow, tax, risk, time horizon, liquidity, and behaviour before it becomes real money.`,
    ),
    goDeeper: profile.goDeeper,
  };
};

export const expandMistakes = (lessonId: string, mistakes: string[]) => {
  const domain = domainFor(lessonId);
  const fixes: Record<string, string[]> = {
    making: [
      "Fix: write the monthly amount, dependency, margin, and failure point for each income source.",
      "Fix: test whether the engine still works if you are unavailable for two weeks.",
      "Fix: compare the new engine with the risks it adds to tax, time, and fixed costs.",
    ],
    keeping: [
      "Fix: convert the mistake into a monthly number and annual cost, then decide if it deserves automation, a cap, or professional advice.",
      "Fix: separate tax money, reserve money, and spending money before the month begins.",
      "Fix: check whether the cost is one-off, recurring, fixed, or flexible.",
    ],
    growing: [
      "Fix: run the decision through return, risk, fees, tax, liquidity, time horizon, and behaviour before investing.",
      "Fix: model the downside in pounds, not percentages, so the risk feels real.",
      "Fix: write the rule you will follow before markets move against you.",
    ],
    protecting: [
      "Fix: ask what event would create a £25,000, £50,000, or £100,000 problem and how it would be funded.",
      "Fix: decide whether the risk should be held in cash, insured, diversified, structured, or avoided.",
      "Fix: review exclusions, guarantees, and legal boundaries before assuming protection exists.",
    ],
    understanding: [
      "Fix: translate the headline into real purchasing power, cash flow, and second-order effects.",
      "Fix: ask which variable is doing the work: inflation, rates, credit, tax, sentiment, or policy.",
      "Fix: stress-test the idea under a different rate, inflation, or cycle environment.",
    ],
    connections: [
      "Fix: check the decision against all five domains before treating it as solved.",
      "Fix: ask which other part of the machine becomes weaker if this part improves.",
      "Fix: turn the insight into one dated action in the financial plan.",
    ],
  };
  return mistakes.map((mistake, index) => `${mistake} ${fixes[domain][index % fixes[domain].length]}`);
};
