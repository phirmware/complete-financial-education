export type CurrencyCode = "GBP" | "USD" | "EUR" | "NGN" | "CAD" | "AUD";

export type CompoundPoint = {
  year: number;
  contributions: number;
  growth: number;
  balance: number;
  earlyStartBalance?: number;
};

export type MachineInputs = {
  annualIncome: number;
  taxRate: number;
  savingsRate: number;
  annualReturn: number;
  annualFees: number;
  inflationRate: number;
  businessValue: number;
  businessGrowth: number;
  emergencyReserve: number;
  monthlyExpenses: number;
  protectionLevel: number;
  debtBalance: number;
  debtRate: number;
  shockYear: number;
  shockCost: number;
  years: number;
};

export type MachinePoint = {
  year: number;
  ageLabel: string;
  income: number;
  portfolio: number;
  business: number;
  debt: number;
  realNetWorth: number;
  nominalNetWorth: number;
  liquidMonths: number;
  shockCostPaid: number;
};

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const percent = (value: number) => `${Math.round(value * 100)}%`;

export const formatMoney = (value: number, currency: CurrencyCode = "GBP", compact = false) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: compact ? 1 : 0,
    notation: compact ? "compact" : "standard",
  }).format(Number.isFinite(value) ? value : 0);
};

export const futureValue = (
  initial: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
) => {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualReturn / 12;
  if (months === 0) return initial;
  if (monthlyRate === 0) return initial + monthlyContribution * months;
  return (
    initial * Math.pow(1 + monthlyRate, months) +
    monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
  );
};

export const compoundSeries = (
  initial: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
  earlyStartYears = 10,
): CompoundPoint[] => {
  const data: CompoundPoint[] = [];
  for (let year = 0; year <= years; year += 1) {
    const balance = futureValue(initial, monthlyContribution, annualReturn, year);
    const contributions = initial + monthlyContribution * 12 * year;
    data.push({
      year,
      balance,
      contributions,
      growth: Math.max(0, balance - contributions),
      earlyStartBalance: futureValue(initial, monthlyContribution, annualReturn, year + earlyStartYears),
    });
  }
  return data;
};

export const purchasingPower = (amount: number, inflationRate: number, years: number) => {
  return amount / Math.pow(1 + inflationRate, years);
};

export const inflationSeries = (amount: number, inflationRate: number, years: number) => {
  return Array.from({ length: years + 1 }, (_, year) => ({
    year,
    purchasingPower: purchasingPower(amount, inflationRate, year),
    nominal: amount,
    lostPower: amount - purchasingPower(amount, inflationRate, year),
  }));
};

export const feeSeries = (
  initial: number,
  monthlyContribution: number,
  annualReturn: number,
  lowFee: number,
  highFee: number,
  years: number,
) => {
  return Array.from({ length: years + 1 }, (_, year) => {
    const lowCost = futureValue(initial, monthlyContribution, Math.max(-0.99, annualReturn - lowFee), year);
    const highCost = futureValue(initial, monthlyContribution, Math.max(-0.99, annualReturn - highFee), year);
    return {
      year,
      lowCost,
      highCost,
      feeDrag: lowCost - highCost,
    };
  });
};

export const allocationProfile = (equity: number, bonds: number, property: number, cash: number) => {
  const total = equity + bonds + property + cash || 1;
  const weights = {
    equity: equity / total,
    bonds: bonds / total,
    property: property / total,
    cash: cash / total,
  };
  const expectedReturn =
    weights.equity * 0.075 + weights.bonds * 0.035 + weights.property * 0.055 + weights.cash * 0.02;
  const volatility =
    weights.equity * 0.18 + weights.bonds * 0.07 + weights.property * 0.14 + weights.cash * 0.01;
  const liquidity = weights.cash * 1 + weights.bonds * 0.75 + weights.equity * 0.7 + weights.property * 0.25;
  const inflationDefense =
    weights.equity * 0.8 + weights.bonds * 0.35 + weights.property * 0.75 + weights.cash * 0.15;
  return { weights, expectedReturn, volatility, liquidity, inflationDefense };
};

export const assetBehaviourSeries = (years = 30) => {
  const shockYears: Record<number, number> = {
    4: -0.22,
    11: -0.34,
    18: -0.16,
    25: -0.27,
  };
  let equity = 100;
  let bonds = 100;
  let property = 100;
  let cash = 100;
  return Array.from({ length: years + 1 }, (_, year) => {
    if (year > 0) {
      const shock = shockYears[year] ?? 0;
      equity *= 1 + 0.08 + shock;
      bonds *= 1 + 0.035 + shock * 0.18;
      property *= 1 + 0.055 + shock * 0.45;
      cash *= 1 + 0.02;
    }
    return {
      year,
      equities: Math.max(0, equity),
      bonds: Math.max(0, bonds),
      property: Math.max(0, property),
      cash,
      event: shockYears[year] ? "market shock" : "",
    };
  });
};

export const behaviourGapSeries = (
  initial: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
) => {
  const data: Array<{ year: number; stayed: number; panicSold: number; chased: number }> = [];
  let stayed = initial;
  let panicSold = initial;
  let chased = initial;
  const annualContribution = monthlyContribution * 12;
  for (let year = 0; year <= years; year += 1) {
    data.push({ year, stayed, panicSold, chased });
    const downturn = year === 7 || year === 16;
    const hotMarket = year === 4 || year === 12;
    const normalReturn = downturn ? -0.28 : hotMarket ? 0.22 : annualReturn;
    stayed = stayed * (1 + normalReturn) + annualContribution;
    panicSold =
      downturn && year === 7
        ? panicSold * 0.72
        : year > 7 && year < 11
          ? panicSold * 1.015 + annualContribution
          : panicSold * (1 + normalReturn) + annualContribution;
    chased =
      hotMarket && year === 4
        ? chased * 1.22 + annualContribution
        : year === 5
          ? chased * 0.62 + annualContribution
          : chased * (1 + normalReturn - 0.012) + annualContribution;
  }
  return data;
};

export const lifestyleSeries = (
  startingIncome: number,
  startingExpenses: number,
  incomeGrowth: number,
  lifestyleCapture: number,
  annualReturn: number,
  years: number,
) => {
  let flexiblePortfolio = 0;
  let inflatedPortfolio = 0;
  let income = startingIncome;
  let lockedExpenses = startingExpenses;
  let inflatedExpenses = startingExpenses;
  return Array.from({ length: years + 1 }, (_, year) => {
    const lockedSurplus = Math.max(0, income - lockedExpenses);
    const inflatedSurplus = Math.max(0, income - inflatedExpenses);
    const point = {
      year,
      income,
      lockedExpenses,
      inflatedExpenses,
      lockedPortfolio: flexiblePortfolio,
      inflatedPortfolio,
      gap: flexiblePortfolio - inflatedPortfolio,
    };
    income *= 1 + incomeGrowth;
    const increase = income - point.income;
    inflatedExpenses += increase * lifestyleCapture;
    flexiblePortfolio = flexiblePortfolio * (1 + annualReturn) + lockedSurplus;
    inflatedPortfolio = inflatedPortfolio * (1 + annualReturn) + inflatedSurplus;
    return point;
  });
};

export const debtSeries = (
  borrowedAmount: number,
  debtRate: number,
  assetReturn: number,
  depreciatingRate: number,
  years: number,
) => {
  let productiveAsset = borrowedAmount;
  let consumptionAsset = borrowedAmount;
  let debt = borrowedAmount;
  const annualPayment = borrowedAmount / Math.max(1, years) + borrowedAmount * debtRate;
  return Array.from({ length: years + 1 }, (_, year) => {
    const point = {
      year,
      productiveNet: productiveAsset - debt,
      consumptionNet: consumptionAsset - debt,
      productiveAsset,
      consumptionAsset,
      debt,
    };
    productiveAsset *= 1 + assetReturn;
    consumptionAsset *= 1 - depreciatingRate;
    debt = Math.max(0, debt * (1 + debtRate) - annualPayment);
    return point;
  });
};

export const simulateMachine = (inputs: MachineInputs): MachinePoint[] => {
  let income = inputs.annualIncome;
  let portfolio = Math.max(0, inputs.emergencyReserve);
  let business = Math.max(0, inputs.businessValue);
  let debt = Math.max(0, inputs.debtBalance);
  const data: MachinePoint[] = [];
  const netReturn = inputs.annualReturn - inputs.annualFees;
  const reserveMonths = inputs.monthlyExpenses > 0 ? inputs.emergencyReserve / inputs.monthlyExpenses : 0;

  for (let year = 0; year <= inputs.years; year += 1) {
    const shockCostPaid =
      year === inputs.shockYear ? inputs.shockCost * (1 - clamp(inputs.protectionLevel, 0, 100) / 100) : 0;
    if (shockCostPaid > 0) {
      portfolio = Math.max(0, portfolio - shockCostPaid);
      if (portfolio === 0) {
        debt += Math.max(0, shockCostPaid - inputs.emergencyReserve);
      }
    }
    const nominalNetWorth = portfolio + business - debt;
    data.push({
      year,
      ageLabel: `Year ${year}`,
      income,
      portfolio,
      business,
      debt,
      nominalNetWorth,
      realNetWorth: purchasingPower(nominalNetWorth, inputs.inflationRate, year),
      liquidMonths: reserveMonths + portfolio / Math.max(1, inputs.monthlyExpenses),
      shockCostPaid,
    });

    const afterTaxIncome = income * (1 - inputs.taxRate);
    const annualContribution = Math.max(0, afterTaxIncome * inputs.savingsRate);
    portfolio = portfolio * (1 + netReturn) + annualContribution;
    business *= 1 + inputs.businessGrowth;
    debt = Math.max(0, debt * (1 + inputs.debtRate) - annualContribution * 0.1);
    income *= 1 + 0.03;
  }
  return data;
};

export const machineScore = (latest: MachinePoint, inputs: MachineInputs) => {
  const reserveScore = clamp(inputs.emergencyReserve / Math.max(1, inputs.monthlyExpenses * 6), 0, 1);
  const savingsScore = clamp(inputs.savingsRate / 0.25, 0, 1);
  const protectionScore = clamp(inputs.protectionLevel / 100, 0, 1);
  const debtScore = clamp(1 - inputs.debtBalance / Math.max(1, inputs.annualIncome * 2), 0, 1);
  const concentration =
    inputs.businessValue / Math.max(1, inputs.businessValue + Math.max(1, latest.portfolio));
  const diversificationScore = clamp(1 - concentration, 0, 1);
  return Math.round(
    (reserveScore * 0.2 + savingsScore * 0.22 + protectionScore * 0.2 + debtScore * 0.16 + diversificationScore * 0.22) *
      100,
  );
};
