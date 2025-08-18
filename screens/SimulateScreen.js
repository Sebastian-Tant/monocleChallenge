// screens/SimulateScreen.js

import { useTranslation } from 'react-i18next';

import React, { useState } from 'react';
const MODES = { SAVINGS: 'savings', DEBT: 'debt' };
const DEBT_INPUT = { TERM: 'term', PAYMENT: 'payment' };

class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    // You could log this to Sentry/Crashlytics if desired
    console.warn('Chart render error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

const ChartUnavailable = () => (
  <View style={styles.chartFallback}>
    <Text style={styles.chartFallbackTitle}>
      {t('simulate.chartUnavailable')}
    </Text>
    <Text style={styles.chartFallbackText}>{t('simulate.chartError')}</Text>
    <Text style={styles.chartFallbackSteps}>
      Fix tips: iOS → `cd ios && pod install`, then clean & rebuild. Android →
      `cd android && ./gradlew clean`, then rebuild.
    </Text>
  </View>
);
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Switch,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Chart components from victory-native. Ensure that victory-native and
// react-native-svg are installed in your project to use these components.
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryArea,
  VictoryStack,
  VictoryLegend,
} from 'victory-native';

const SimulateScreen = () => {
  const { t } = useTranslation();
  // Guard VictoryTheme for environments where it's undefined
  const chartTheme =
    VictoryTheme && VictoryTheme.material ? VictoryTheme.material : undefined;
  // Guard for environments where victory-native / react-native-svg may be missing
  const hasVictory = !!(
    VictoryChart &&
    VictoryAxis &&
    VictoryLine &&
    VictoryArea &&
    VictoryStack &&
    VictoryLegend
  );
  // Mode toggle: Savings (existing) or Debt (new)
  const [mode, setMode] = useState(MODES.SAVINGS);

  // Debt mode inputs
  const [debtPrincipal, setDebtPrincipal] = useState('200000');
  const [debtAnnualRate, setDebtAnnualRate] = useState('12');
  const [debtYears, setDebtYears] = useState('5');
  const [debtPayment, setDebtPayment] = useState(''); // used when user chooses PAYMENT mode
  const [debtInputMode, setDebtInputMode] = useState(DEBT_INPUT.TERM);

  // User inputs
  const [initialPrincipal, setInitialPrincipal] = useState('0');
  const [monthlyContribution, setMonthlyContribution] = useState('1000');
  const [timeHorizon, setTimeHorizon] = useState('10');
  const [expectedReturn, setExpectedReturn] = useState('8');
  const [depositAtStart, setDepositAtStart] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('moderate');

  // Predefined scenarios to help users select an interest rate
  const scenarios = [
    {
      id: t('simulate.conservative'),
      name: t('simulate.conservative'),
      return: 6,
      description: t('simulate.conservativeDesc'),
      color: '#10b981',
    },
    {
      id: t('simulate.moderate'),
      name: t('simulate.moderate'),
      return: 8,
      description: t('simulate.moderateDesc'),
      color: '#667eea',
    },
    {
      id: t('simulate.aggressive'),
      name: t('simulate.aggressive'),
      return: 12,
      description: t('simulate.aggressiveDesc'),
      color: '#f59e0b',
    },
  ];

  const handleScenarioSelect = scenario => {
    setSelectedScenario(scenario.id);
    setExpectedReturn(scenario.return.toString());
  };

  const [infoVisible, setInfoVisible] = useState(false);
  const [infoScenario, setInfoScenario] = useState(null);

  // Debt strategy info modal state
  const [debtInfoVisible, setDebtInfoVisible] = useState(false);
  const [debtInfoStrategy, setDebtInfoStrategy] = useState(null);

  // ================= DEBT (Loan) CALCULATIONS =================
  const buildDebtSchedule = ({
    principal,
    annualRatePct,
    payment,
    years,
    maxMonths = 1000,
  }) => {
    const P = Math.max(0, Number(principal) || 0);
    const r = Math.max(0, Number(annualRatePct) || 0) / 100;
    const i = r / 12;

    let n = years ? Math.max(0, Math.round(Number(years) * 12)) : undefined;

    // If years is provided but payment is missing, compute EMI (fixed PMT)
    let PMT = payment ? Number(payment) : undefined;
    if (!PMT && n && i > 0) {
      // EMI formula: P * i / (1 - (1 + i)^(-n))
      const denom = 1 - Math.pow(1 + i, -n);
      PMT = denom > 0 ? (P * i) / denom : 0;
    } else if (!PMT && n && i === 0) {
      PMT = P / n; // zero-interest simple division
    }

    // Guard against invalid or zero payment
    if (!PMT || PMT <= 0) {
      return {
        schedule: [],
        summary: {
          payment: 0,
          months: 0,
          totalInterest: 0,
          totalPaid: 0,
          remainingBalance: P,
          insufficient: true,
        },
      };
    }

    const schedule = [];
    let balance = P;
    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    let insufficient = false;

    const cap = n || maxMonths; // when payment is user-specified, run until payoff or cap

    while (balance > 0 && month < cap) {
      month += 1;
      const interest = balance * i;
      let principalPaid = PMT - interest;

      // If payment is too small to cover interest, balance grows — mark insufficient
      if (principalPaid <= 0) {
        insufficient = true;
        // pay only interest to avoid negative principal paid
        principalPaid = 0;
      }

      // Handle final month partial payment
      if (principalPaid > balance) {
        principalPaid = balance;
      }

      const paymentThisMonth = interest + principalPaid;
      balance = balance - principalPaid;

      totalInterest += interest;
      totalPaid += paymentThisMonth;

      schedule.push({
        month,
        payment: paymentThisMonth,
        interest,
        principal: principalPaid,
        balance,
      });

      // If we were running with a fixed term (computed EMI), stop on payoff
      if (n && balance <= 0) break;

      // If payment provided but balance isn't decreasing, break to avoid infinite loop
      if (!n && insufficient && month >= 3) break;
    }

    return {
      schedule,
      summary: {
        payment: PMT,
        months: schedule.length,
        totalInterest,
        totalPaid,
        remainingBalance: balance,
        insufficient: insufficient || balance > 0,
      },
    };
  };

  /**
   * Calculates a schedule of balances for each month, given the inputs. The
   * schedule includes the month number, balance at the end of the month,
   * interest earned that month and cumulative contributions. A summary is
   * returned containing the final balance, total contributions and total
   * interest (growth).
   */
  const calculateSchedule = () => {
    const principal = parseFloat(initialPrincipal) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const years = parseFloat(timeHorizon) || 0;
    const annualReturn = parseFloat(expectedReturn) / 100 || 0;
    const totalMonths = years * 12;

    // Return early if there is no starting amount and no contributions
    if (monthly === 0 && principal === 0) {
      return {
        schedule: [],
        summary: { total: 0, contributions: 0, growth: 0 },
      };
    }

    let balance = principal;
    let totalContributions = 0;
    let totalInterest = 0;
    const schedule = [];

    for (let m = 1; m <= totalMonths; m++) {
      // Optionally add contribution at the start of the month
      if (depositAtStart) {
        balance += monthly;
        totalContributions += monthly;
      }
      // Calculate monthly interest and update balance
      const interest = balance * (annualReturn / 12);
      balance += interest;
      totalInterest += interest;
      // Optionally add contribution at the end of the month
      if (!depositAtStart) {
        balance += monthly;
        totalContributions += monthly;
      }
      schedule.push({
        month: m,
        balance: balance,
        interest: interest,
        totalContributions: totalContributions,
      });
    }

    return {
      schedule,
      summary: {
        total: balance,
        contributions: totalContributions,
        growth: totalInterest,
      },
    };
  };

  // Generate schedule(s) and summary on each render based on mode
  let schedule = [];
  let summary = { total: 0, contributions: 0, growth: 0 };
  let debt = null;

  if (mode === MODES.SAVINGS) {
    const result = calculateSchedule();
    schedule = result.schedule;
    summary = result.summary;
  } else {
    debt = buildDebtSchedule({
      principal: debtPrincipal,
      annualRatePct: debtAnnualRate,
      payment:
        debtInputMode === DEBT_INPUT.PAYMENT
          ? parseFloat(debtPayment) || 0
          : undefined,
      years:
        debtInputMode === DEBT_INPUT.TERM
          ? parseFloat(debtYears) || 0
          : undefined,
    });
  }

  // ----- Yearly interest breakdowns -----
  const buildSavingsYearly = sched => {
    if (!sched?.length) return [];
    const rows = [];
    let year = 1,
      interestSum = 0,
      endBal = 0;
    for (let idx = 0; idx < sched.length; idx++) {
      const m = sched[idx];
      interestSum += Number(m.interest || 0);
      endBal = Number(m.balance || 0);
      const isYearEnd = (idx + 1) % 12 === 0 || idx === sched.length - 1;
      if (isYearEnd) {
        rows.push({ year, interest: interestSum, endingBalance: endBal });
        year += 1;
        interestSum = 0;
        endBal = 0;
      }
    }
    return rows;
  };

  const buildDebtYearly = sched => {
    if (!sched?.length) return [];
    const rows = [];
    let year = 1,
      interestSum = 0,
      endBal = sched[0]?.balance ?? 0;
    for (let idx = 0; idx < sched.length; idx++) {
      const m = sched[idx];
      interestSum += Number(m.interest || 0);
      endBal = Number(m.balance || 0);
      const isYearEnd = (idx + 1) % 12 === 0 || idx === sched.length - 1;
      if (isYearEnd) {
        rows.push({ year, interest: interestSum, endingBalance: endBal });
        year += 1;
        interestSum = 0;
      }
    }
    return rows;
  };

  // Build yearly rows + cumulative interest
  const yearlyRowsRaw =
    mode === MODES.SAVINGS
      ? buildSavingsYearly(schedule)
      : buildDebtYearly(debt?.schedule || []);

  const yearlyRows = yearlyRowsRaw.map((r, i) => {
    const cum = yearlyRowsRaw
      .slice(0, i + 1)
      .reduce((s, x) => s + x.interest, 0);
    return { ...r, cumulativeInterest: cum };
  });

  // Build stacked-area data for Savings (Principal, Simple Interest, Compound Extra)
  const buildSavingsChartSeries = () => {
    const n = schedule.length;
    if (!n) return { principal: [], simple: [], compoundExtra: [], total: [] };

    const principalSeries = [];
    const simpleInterestSeries = [];
    const compoundExtraSeries = [];
    const totalSeries = [];

    const principal0 = Math.max(0, parseFloat(initialPrincipal) || 0);
    const monthly = Math.max(0, parseFloat(monthlyContribution) || 0);
    const r = Math.max(0, parseFloat(expectedReturn) || 0) / 100;
    const i = r / 12;

    let principalAccum = principal0; // contributions + initial, no interest
    let simpleInterestAccum = 0; // simple interest accrued (no compounding)

    for (let idx = 0; idx < n; idx++) {
      const m = idx + 1;
      // match contribution timing to the schedule
      if (depositAtStart) principalAccum += monthly;
      simpleInterestAccum += principalAccum * i; // interest on principal only (no interest-on-interest)
      if (!depositAtStart) principalAccum += monthly;

      const totalBal = schedule[idx]?.balance || 0;
      const contribSoFar =
        (schedule[idx]?.totalContributions || 0) + principal0;
      const compoundInterestSoFar = Math.max(0, totalBal - contribSoFar);
      const compoundOnly = Math.max(
        0,
        compoundInterestSoFar - simpleInterestAccum,
      );

      principalSeries.push({ x: m, y: contribSoFar });
      simpleInterestSeries.push({ x: m, y: simpleInterestAccum });
      compoundExtraSeries.push({ x: m, y: compoundOnly });
      totalSeries.push({ x: m, y: totalBal });
    }

    return {
      principal: principalSeries,
      simple: simpleInterestSeries,
      compoundExtra: compoundExtraSeries,
      total: totalSeries,
    };
  };

  // Preview savings totals at a given annual rate using current inputs
  const simulateSavingsAtRate = annualRatePct => {
    const principal = parseFloat(initialPrincipal) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const years = parseFloat(timeHorizon) || 0;
    const r = (Number(annualRatePct) || 0) / 100;
    const i = r / 12;
    const n = years * 12;

    if (n <= 0 || (principal === 0 && monthly === 0)) {
      return { total: 0, contributions: 0, growth: 0 };
    }

    let balance = principal;
    let totalContributions = 0;
    let totalInterest = 0;

    for (let m = 1; m <= n; m++) {
      if (depositAtStart) {
        balance += monthly;
        totalContributions += monthly;
      }
      const interest = balance * i;
      balance += interest;
      totalInterest += interest;
      if (!depositAtStart) {
        balance += monthly;
        totalContributions += monthly;
      }
    }
    return {
      total: balance,
      contributions: totalContributions,
      growth: totalInterest,
    };
  };

  // Build the explanatory text for a scenario using current inputs
  const getScenarioExplanation = scenario => {
    if (!scenario) return '';

    const preview = simulateSavingsAtRate(scenario.return);
    const yrs = parseFloat(timeHorizon) || 0;

    // Map scenario to volatility level
    const volatilityMap = {
      conservative: t('simulate.volatility_lower'),
      moderate: t('simulate.volatility_moderate'),
      aggressive: t('simulate.volatility_higher'),
    };
    const volatilityText = volatilityMap[scenario.id] || '';

    // Get the correct singular/plural unit for "year"
    const yearUnit =
      yrs === 1 ? t('simulate.year_one') : t('simulate.year_other');

    // Build the text parts using the translation function
    const projectionText = t('simulate.scenarioProjection', {
      scenarioName: scenario.name.toLowerCase(),
      returnRate: scenario.return,
      years: yrs,
      yearUnit: yearUnit,
      total: formatCurrency(preview.total),
      growth: formatCurrency(preview.growth),
    });

    const implicationText = t('simulate.scenarioImplication', {
      scenarioName: scenario.name.toLowerCase(),
      returnRate: scenario.return,
      volatility: volatilityText, // Use the mapped volatility text
    });

    const disclaimerText = t('simulate.scenarioDisclaimer');

    // Combine the parts into the final message
    return `${projectionText}\n\n${implicationText} ${disclaimerText}`;
  };
  // ------- Debt strategies helpers -------
  // Build a baseline schedule based on current debt inputs (Payment or Term)
  const getBaselineDebtSummary = () => {
    const base = buildDebtSchedule({
      principal: debtPrincipal,
      annualRatePct: debtAnnualRate,
      payment:
        debtInputMode === DEBT_INPUT.PAYMENT
          ? parseFloat(debtPayment) || 0
          : undefined,
      years:
        debtInputMode === DEBT_INPUT.TERM
          ? parseFloat(debtYears) || 0
          : undefined,
    });
    return base;
  };

  const roundUpToNextHundred = amt => {
    const v = Math.max(0, Number(amt) || 0);
    return Math.ceil(v / 100) * 100;
  };

  // Simulate a strategy -> returns { base, variant, deltas }
  const simulateDebtStrategy = strategyId => {
    const base = getBaselineDebtSummary();
    const basePMT = base?.summary?.payment || 0;

    if (!basePMT) {
      return { base, variant: null, deltas: null };
    }

    let variant;
    if (strategyId === 'add200') {
      variant = buildDebtSchedule({
        principal: debtPrincipal,
        annualRatePct: debtAnnualRate,
        payment: basePMT + 200,
      });
    } else if (strategyId === 'add500') {
      variant = buildDebtSchedule({
        principal: debtPrincipal,
        annualRatePct: debtAnnualRate,
        payment: basePMT + 500,
      });
    } else if (strategyId === 'roundUp100') {
      const rounded = roundUpToNextHundred(basePMT);
      variant = buildDebtSchedule({
        principal: debtPrincipal,
        annualRatePct: debtAnnualRate,
        payment: rounded,
      });
    } else if (strategyId === 'thirteenth') {
      // Approximate a 13th monthly payment per year by adding 1/12 of base PMT monthly
      const eff = basePMT + basePMT / 12;
      variant = buildDebtSchedule({
        principal: debtPrincipal,
        annualRatePct: debtAnnualRate,
        payment: eff,
      });
    } else {
      variant = null;
    }

    const deltas = variant
      ? {
          monthsSaved: Math.max(
            0,
            (base.summary?.months || 0) - (variant.summary?.months || 0),
          ),
          interestSaved: Math.max(
            0,
            (base.summary?.totalInterest || 0) -
              (variant.summary?.totalInterest || 0),
          ),
          newPayment: variant.summary?.payment || 0,
        }
      : null;

    return { base, variant, deltas };
  };

  const getDebtStrategyMeta = id => {
    switch (id) {
      case 'add200':
        return {
          id,
          name: t('simulate.add200'),
          desc: t('simulate.add200Desc'),
        };
      case 'add500':
        return {
          id,
          name: t('simulate.add500'),
          desc: t('simulate.add500Desc'),
        };
      case 'roundUp100':
        return {
          id,
          name: t('simulate.roundUp100'),
          desc: t('simulate.roundUp100Desc'),
        };
      case 'thirteenth':
        return {
          id,
          name: t('simulate.thirteenth'),
          desc: t('simulate.thirteenthDesc'),
        };
      default:
        return { id, name: t('simulate.paymentStrategies'), desc: '' };
    }
  };

  const getDebtStrategyExplanation = id => {
    const meta = getDebtStrategyMeta(id);
    const { base, variant, deltas } = simulateDebtStrategy(id);

    if (!base?.summary?.payment) {
      return t('simulate.strategyExplanationError');
    }

    const basePmt = formatCurrency(base.summary.payment);
    const newPmt = variant ? formatCurrency(variant.summary.payment) : basePmt;
    const monthsSaved = deltas?.monthsSaved ?? 0;
    const interestSaved = deltas
      ? formatCurrency(deltas.interestSaved)
      : formatCurrency(0);
    const months = base.summary.months || 0;
    const variantMonths = variant?.summary?.months || months;

    return t('simulate.strategyExplanation', {
      name: meta.name,
      basePmt,
      newPmt,
      months,
      variantMonths,
      monthsSaved,
      interestSaved,
    });
  };

  // Prepare chart data for the Victory chart
  const chartData = schedule.map(item => ({
    x: item.month,
    y: Number(item.balance.toFixed(2)),
  }));

  // Formats a number as a currency string with Rand prefix
  const formatCurrency = amount => {
    if (!amount) return 'R 0.00';
    return `R ${Number(amount)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  // Builds a CSV string from the schedule for exporting, using the same currency formatting as the UI
  const generateSavingsCSV = () => {
    let csv = 'Month,Balance,Interest,TotalContributions\n';
    const fmt = v => formatCurrency(Number(v || 0));
    schedule.forEach(item => {
      csv += `${item.month},${fmt(item.balance)},${fmt(item.interest)},${fmt(
        item.totalContributions,
      )}\n`;
    });
    return csv;
  };

  const generateDebtCSV = () => {
    if (!debt || !debt.schedule) return '';
    let csv = 'Month,Payment,Interest,Principal,RemainingBalance\n';
    const fmt = v => formatCurrency(Number(v || 0));
    debt.schedule.forEach(row => {
      csv += `${row.month},${fmt(row.payment)},${fmt(row.interest)},${fmt(
        row.principal,
      )},${fmt(row.balance)}\n`;
    });
    return csv;
  };

  // Share the CSV data via the OS share sheet
  const handleExport = async () => {
    const csv =
      mode === MODES.SAVINGS ? generateSavingsCSV() : generateDebtCSV();
    try {
      await Share.share({
        title:
          mode === MODES.SAVINGS
            ? 'Investment Projection Data'
            : 'Debt Amortization Schedule',
        message:
          (mode === MODES.SAVINGS
            ? 'Investment Projection Data'
            : 'Debt Amortization Schedule') +
          '\n\n' +
          csv,
      });
    } catch (err) {
      console.error('Error sharing CSV:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>{t('simulate.title')}</Text>
          <Text style={styles.subtitle}>{t('simulate.subtitle')}</Text>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.modeToggleButton,
              mode === MODES.SAVINGS && styles.modeToggleActive,
            ]}
            onPress={() => setMode(MODES.SAVINGS)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeToggleText,
                mode === MODES.SAVINGS && styles.modeToggleTextActive,
              ]}
            >
              {t('simulate.savings')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeToggleButton,
              mode === MODES.DEBT && styles.modeToggleActive,
            ]}
            onPress={() => setMode(MODES.DEBT)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeToggleText,
                mode === MODES.DEBT && styles.modeToggleTextActive,
              ]}
            >
              {t('simulate.debt')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Investment Scenarios (Savings only) */}
        {mode === MODES.SAVINGS && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('simulate.investmentStrategy')}
            </Text>

            {/* Quick presets for Years */}
            <View
              style={{
                paddingHorizontal: 24,
                marginBottom: 10,
                flexDirection: 'row',
                gap: 8,
              }}
            >
              {['5', '10', '20'].map(yrs => (
                <TouchableOpacity
                  key={yrs}
                  style={[
                    styles.modeToggleButtonSm,
                    timeHorizon === yrs && styles.modeToggleActive,
                  ]}
                  onPress={() => setTimeHorizon(yrs)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.modeToggleText,
                      timeHorizon === yrs && styles.modeToggleTextActive,
                    ]}
                  >
                    {yrs} yrs
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.scenariosContainer}>
              {scenarios.map(scenario => (
                <View
                  key={scenario.id}
                  style={[
                    styles.scenarioCard,
                    selectedScenario === scenario.id && styles.selectedScenario,
                  ]}
                >
                  <View style={styles.scenarioHeader}>
                    <Text
                      style={[
                        styles.scenarioName,
                        selectedScenario === scenario.id &&
                          styles.selectedScenarioText,
                      ]}
                    >
                      {scenario.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <TouchableOpacity
                        accessibilityLabel={`Explain ${scenario.name} scenario`}
                        onPress={() => {
                          setInfoScenario(scenario);
                          setInfoVisible(true);
                        }}
                        style={styles.infoIconButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.infoIconText}>i</Text>
                      </TouchableOpacity>
                      <Text
                        style={[
                          styles.scenarioReturn,
                          selectedScenario === scenario.id &&
                            styles.selectedScenarioText,
                        ]}
                      >
                        {scenario.return}%
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={[
                      styles.scenarioDescription,
                      selectedScenario === scenario.id &&
                        styles.selectedScenarioDescription,
                    ]}
                  >
                    {scenario.description}
                  </Text>

                  {/* Live preview for this scenario */}
                  {(() => {
                    const preview = simulateSavingsAtRate(scenario.return);
                    return (
                      <View style={styles.scenarioPreviewRow}>
                        <View style={styles.scenarioPreviewCol}>
                          <Text style={styles.previewLabel}>
                            {t('simulate.total')}
                          </Text>
                          <Text style={styles.previewValue}>
                            {formatCurrency(preview.total)}
                          </Text>
                        </View>
                        <View style={styles.scenarioPreviewCol}>
                          <Text style={styles.previewLabel}>
                            {t('simulate.growth')}
                          </Text>
                          <Text style={styles.previewValue}>
                            {formatCurrency(preview.growth)}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}

                  <TouchableOpacity
                    style={styles.scenarioApplyBtn}
                    onPress={() => handleScenarioSelect(scenario)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.scenarioApplyText}>
                      {t('simulate.applyRate', { rate: scenario.return })}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Scenario Info Modal */}
        <Modal
          visible={infoVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setInfoVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setInfoVisible(false)}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {t('simulate.scenarioStrategy', {
                  scenario: infoScenario?.name,
                })}
              </Text>
              <Text style={styles.modalBody}>
                {getScenarioExplanation(infoScenario)}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    if (infoScenario) handleScenarioSelect(infoScenario);
                    setInfoVisible(false);
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalButtonText}>
                    {t('simulate.applyThisRate')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={() => setInfoVisible(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalButtonSecondaryText}>
                    {t('simulate.close')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Debt Strategy Info Modal */}
        <Modal
          visible={debtInfoVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDebtInfoVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDebtInfoVisible(false)}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>
                {t('simulate.strategyDetails')}
              </Text>
              <Text style={styles.modalBody}>
                {getDebtStrategyExplanation(debtInfoStrategy)}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    const { variant } = simulateDebtStrategy(debtInfoStrategy);
                    if (variant?.summary?.payment) {
                      setDebtInputMode(DEBT_INPUT.PAYMENT);
                      setDebtPayment(
                        String(Math.round(variant.summary.payment)),
                      );
                    }
                    setDebtInfoVisible(false);
                  }}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalButtonText}>
                    {t('simulate.apply')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonSecondary}
                  onPress={() => setDebtInfoVisible(false)}
                  activeOpacity={0.9}
                >
                  <Text style={styles.modalButtonSecondaryText}>
                    {t('simulate.close')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Input Parameters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('simulate.yourParameters')}
          </Text>

          {mode === MODES.SAVINGS ? (
            <View style={styles.inputsContainer}>
              {/* SAVINGS INPUTS */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('simulate.initialPrincipal')}
                </Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencySymbol}>R</Text>
                  <TextInput
                    style={styles.textInput}
                    value={initialPrincipal}
                    onChangeText={setInitialPrincipal}
                    keyboardType="numeric"
                    placeholder="0"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('simulate.monthlyContribution')}
                </Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencySymbol}>R</Text>
                  <TextInput
                    style={styles.textInput}
                    value={monthlyContribution}
                    onChangeText={setMonthlyContribution}
                    keyboardType="numeric"
                    placeholder="1000"
                  />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('simulate.timeHorizon')}
                </Text>
                <TextInput
                  style={styles.textInputFull}
                  value={timeHorizon}
                  onChangeText={setTimeHorizon}
                  keyboardType="numeric"
                  placeholder="10"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('simulate.annualInterestRate')}
                </Text>
                <TextInput
                  style={styles.textInputFull}
                  value={expectedReturn}
                  onChangeText={setExpectedReturn}
                  keyboardType="numeric"
                  placeholder="8"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('simulate.depositAtStart')}
                </Text>
                <Switch
                  value={depositAtStart}
                  onValueChange={setDepositAtStart}
                  style={{ marginTop: 8 }}
                />
              </View>
            </View>
          ) : (
            <View style={styles.inputsContainer}>
              {/* DEBT INPUTS */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('simulate.loanAmount')}
                </Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.currencySymbol}>R</Text>
                  <TextInput
                    style={styles.textInput}
                    value={debtPrincipal}
                    onChangeText={setDebtPrincipal}
                    keyboardType="numeric"
                    placeholder="200000"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('simulate.annualInterestRate')}
                </Text>
                <TextInput
                  style={styles.textInputFull}
                  value={debtAnnualRate}
                  onChangeText={setDebtAnnualRate}
                  keyboardType="numeric"
                  placeholder="12"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('simulate.iKnowMy')}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={[
                      styles.modeToggleButtonSm,
                      debtInputMode === DEBT_INPUT.TERM &&
                        styles.modeToggleActive,
                    ]}
                    onPress={() => setDebtInputMode(DEBT_INPUT.TERM)}
                  >
                    <Text
                      style={[
                        styles.modeToggleText,
                        debtInputMode === DEBT_INPUT.TERM &&
                          styles.modeToggleTextActive,
                      ]}
                    >
                      {t('simulate.term')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modeToggleButtonSm,
                      debtInputMode === DEBT_INPUT.PAYMENT &&
                        styles.modeToggleActive,
                    ]}
                    onPress={() => setDebtInputMode(DEBT_INPUT.PAYMENT)}
                  >
                    <Text
                      style={[
                        styles.modeToggleText,
                        debtInputMode === DEBT_INPUT.PAYMENT &&
                          styles.modeToggleTextActive,
                      ]}
                    >
                      {t('simulate.payment')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {debtInputMode === DEBT_INPUT.TERM ? (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {t('simulate.termYears')}
                  </Text>
                  <TextInput
                    style={styles.textInputFull}
                    value={debtYears}
                    onChangeText={setDebtYears}
                    keyboardType="numeric"
                    placeholder="5"
                  />
                </View>
              ) : (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {t('simulate.monthlyPayment')}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.currencySymbol}>R</Text>
                    <TextInput
                      style={styles.textInput}
                      value={debtPayment}
                      onChangeText={setDebtPayment}
                      keyboardType="numeric"
                      placeholder="5000"
                    />
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {mode === MODES.SAVINGS
              ? 'Projection Results'
              : 'Debt Payoff Results'}
          </Text>

          {mode === MODES.SAVINGS ? (
            <View style={styles.resultsContainer}>
              <View style={styles.mainResult}>
                <Text style={styles.resultLabel}>
                  {t('simulate.projectedTotalValue')}
                </Text>
                <Text style={styles.resultValue}>
                  {formatCurrency(summary.total)}
                </Text>
              </View>
              <View style={styles.breakdownContainer}>
                <View style={styles.breakdownItem}>
                  <View
                    style={[
                      styles.breakdownColor,
                      { backgroundColor: '#667eea' },
                    ]}
                  />
                  <View style={styles.breakdownContent}>
                    <Text style={styles.breakdownLabel}>
                      {t('simulate.totalContributions')}
                    </Text>
                    <Text style={styles.breakdownValue}>
                      {formatCurrency(summary.contributions)}
                    </Text>
                  </View>
                </View>
                <View style={styles.breakdownItem}>
                  <View
                    style={[
                      styles.breakdownColor,
                      { backgroundColor: '#10b981' },
                    ]}
                  />
                  <View style={styles.breakdownContent}>
                    <Text style={styles.breakdownLabel}>
                      {t('simulate.investmentGrowth')}
                    </Text>
                    <Text style={styles.breakdownValue}>
                      {formatCurrency(summary.growth)}
                    </Text>
                  </View>
                </View>
              </View>
              {schedule.length > 0 && (
                <View style={styles.chartContainer}>
                  {!hasVictory ? (
                    <ChartUnavailable />
                  ) : (
                    <ChartErrorBoundary fallback={<ChartUnavailable />}>
                      {(() => {
                        const series = buildSavingsChartSeries();
                        return (
                          <VictoryChart
                            height={260}
                            padding={{
                              top: 8,
                              left: 56,
                              right: 20,
                              bottom: 36,
                            }}
                            theme={chartTheme}
                          >
                            <VictoryAxis
                              dependentAxis
                              tickFormat={t =>
                                `R ${Number(t).toLocaleString()}`
                              }
                              style={{ tickLabels: { fontSize: 10 } }}
                            />
                            <VictoryAxis
                              tickFormat={t => `${t}`}
                              style={{ tickLabels: { fontSize: 10 } }}
                            />
                            <VictoryStack>
                              <VictoryArea
                                data={series.principal}
                                interpolation="monotoneX"
                                style={{
                                  data: { fill: '#10b981', fillOpacity: 0.9 },
                                }}
                              />
                              <VictoryArea
                                data={series.simple}
                                interpolation="monotoneX"
                                style={{
                                  data: { fill: '#38bdf8', fillOpacity: 0.9 },
                                }}
                              />
                              <VictoryArea
                                data={series.compoundExtra}
                                interpolation="monotoneX"
                                style={{
                                  data: { fill: '#8b5cf6', fillOpacity: 0.9 },
                                }}
                              />
                            </VictoryStack>
                            <VictoryLegend
                              x={80}
                              y={220}
                              orientation="horizontal"
                              gutter={20}
                              style={{ labels: { fontSize: 10 } }}
                              data={[
                                {
                                  name: 'Contributions',
                                  symbol: { fill: '#10b981' },
                                },
                                {
                                  name: 'Simple Interest',
                                  symbol: { fill: '#38bdf8' },
                                },
                                {
                                  name: 'Compound Growth',
                                  symbol: { fill: '#8b5cf6' },
                                },
                              ]}
                            />
                          </VictoryChart>
                        );
                      })()}
                    </ChartErrorBoundary>
                  )}
                </View>
              )}
              {schedule.length > 0 && (
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={handleExport}
                  activeOpacity={0.8}
                >
                  <Text style={styles.exportButtonText}>
                    {t('simulate.exportCSV')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.resultsContainer}>
              <View style={styles.mainResult}>
                <Text style={styles.resultLabel}>
                  {t('simulate.monthlyPayment')}
                </Text>
                <Text style={styles.resultValue}>
                  {formatCurrency(debt?.summary?.payment || 0)}
                </Text>
              </View>

              <View style={styles.breakdownContainer}>
                <View style={styles.breakdownItem}>
                  <View
                    style={[
                      styles.breakdownColor,
                      { backgroundColor: '#ef4444' },
                    ]}
                  />
                  <View style={styles.breakdownContent}>
                    <Text style={styles.breakdownLabel}>
                      {t('simulate.totalInterest')}
                    </Text>
                    <Text style={styles.breakdownValue}>
                      {formatCurrency(debt?.summary?.totalInterest || 0)}
                    </Text>
                  </View>
                </View>
                <View style={styles.breakdownItem}>
                  <View
                    style={[
                      styles.breakdownColor,
                      { backgroundColor: '#3b82f6' },
                    ]}
                  />
                  <View style={styles.breakdownContent}>
                    <Text style={styles.breakdownLabel}>
                      {t('simulate.totalPaid')}
                    </Text>
                    <Text style={styles.breakdownValue}>
                      {formatCurrency(debt?.summary?.totalPaid || 0)}
                    </Text>
                  </View>
                </View>
              </View>

              {debt && (
                <View style={{ marginTop: 12, padding: 12 }}>
                  {debt.summary.insufficient ? (
                    <Text style={{ color: '#991b1b' }}>
                      {t('simulate.paymentTooSmall')}{' '}
                      {formatCurrency(debt.summary.remainingBalance)}
                    </Text>
                  ) : (
                    <Text style={{ color: '#425166ff' }}>
                      {t('simulate.monthsToPayoff')}{' '}
                      <Text style={{ fontWeight: '700' }}>
                        {debt.summary.months}
                      </Text>
                    </Text>
                  )}
                </View>
              )}

              {debt?.schedule?.length > 0 && (
                <View style={styles.chartContainer}>
                  {!hasVictory ? (
                    <ChartUnavailable />
                  ) : (
                    <ChartErrorBoundary fallback={<ChartUnavailable />}>
                      <VictoryChart
                        height={260}
                        padding={{ top: 8, left: 56, right: 20, bottom: 36 }}
                        theme={chartTheme}
                      >
                        <VictoryAxis
                          dependentAxis
                          tickFormat={t => `R ${Number(t).toLocaleString()}`}
                          style={{ tickLabels: { fontSize: 10 } }}
                        />
                        <VictoryAxis
                          tickFormat={t => `${t}`}
                          style={{ tickLabels: { fontSize: 10 } }}
                        />
                        <VictoryLine
                          interpolation="monotoneX"
                          style={{
                            data: { stroke: '#0ea5e9', strokeWidth: 2 },
                          }}
                          data={(debt?.schedule || []).map(row => ({
                            x: row.month,
                            y: Number(row.balance.toFixed(2)),
                          }))}
                        />
                        <VictoryLegend
                          x={120}
                          y={220}
                          orientation="horizontal"
                          gutter={20}
                          style={{ labels: { fontSize: 10 } }}
                          data={[
                            {
                              name: 'Remaining Balance',
                              symbol: { fill: '#0ea5e9' },
                            },
                          ]}
                        />
                      </VictoryChart>
                    </ChartErrorBoundary>
                  )}
                </View>
              )}

              {debt?.schedule?.length > 0 && (
                <TouchableOpacity
                  style={styles.exportButton}
                  onPress={handleExport}
                  activeOpacity={0.8}
                >
                  <Text style={styles.exportButtonText}>
                    {t('simulate.exportCSV')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Debt Payment Strategies (Debt only) */}
        {mode === MODES.DEBT && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('simulate.paymentStrategies')}
            </Text>

            <View style={styles.debtChipsRow}>
              {['add200', 'add500', 'roundUp100', 'thirteenth'].map(sid => {
                const sim = simulateDebtStrategy(sid);
                const monthsSaved = sim.deltas?.monthsSaved || 0;
                const interestSaved = sim.deltas?.interestSaved || 0;

                return (
                  <View key={sid} style={styles.debtChip}>
                    <View style={styles.debtChipHeader}>
                      <Text style={styles.debtChipTitle}>
                        {t(`simulate.${sid}`)}
                      </Text>
                      <TouchableOpacity
                        accessibilityLabel={t('simulate.strategyDetails')}
                        onPress={() => {
                          setDebtInfoStrategy(sid);
                          setDebtInfoVisible(true);
                        }}
                        style={styles.infoIconButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.infoIconText}>i</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.debtChipDesc}>
                      {t(`simulate.${sid}Desc`)}
                    </Text>
                    {sim.variant && (
                      <View style={styles.debtChipPreviewRow}>
                        <Text style={styles.debtChipPreviewText}>
                          {t('simulate.saveMonthsInterest', {
                            months: monthsSaved,
                            interest: formatCurrency(interestSaved),
                          })}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.debtChipApplyBtn}
                      activeOpacity={0.9}
                      onPress={() => {
                        const { variant } = simulateDebtStrategy(sid);
                        if (variant?.summary?.payment) {
                          setDebtInputMode(DEBT_INPUT.PAYMENT);
                          setDebtPayment(
                            String(Math.round(variant.summary.payment)),
                          );
                        }
                      }}
                    >
                      <Text style={styles.debtChipApplyText}>
                        {t('simulate.apply')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Insights */}
        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('simulate.keyInsights')}</Text>
          <View style={styles.insightsContainer}>
            {mode === MODES.SAVINGS ? (
              <>
                {summary.growth > summary.contributions && (
                  <View style={styles.insightCard}>
                    <Text style={styles.insightEmoji}></Text>
                    <Text style={styles.insightText}>
                      {t('simulate.compoundGrowthInsight')}
                    </Text>
                  </View>
                )}
                {parseFloat(timeHorizon) >= 20 && (
                  <View style={styles.insightCard}>
                    <Text style={styles.insightEmoji}>⏰</Text>
                    <Text style={styles.insightText}>
                      {t('simulate.timeInsight', { years: timeHorizon })}
                    </Text>
                  </View>
                )}
                {parseFloat(monthlyContribution) >= 2000 && (
                  <View style={styles.insightCard}>
                    <Text style={styles.insightEmoji}></Text>
                    <Text style={styles.insightText}>
                      {t('simulate.contributionInsight', {
                        amount: monthlyContribution,
                      })}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <>
                {debt && (
                  <View style={styles.insightCard}>
                    <Text style={styles.insightEmoji}>💡</Text>
                    <Text style={styles.insightText}>
                      {t('simulate.debtInsight')}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>

        {/* Interest by Year */}
        {yearlyRows.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t('simulate.interestByYear')}
            </Text>

            <View style={styles.table}>
              {/* Header */}
              <View style={[styles.tr, styles.trHeader]}>
                <Text style={[styles.td, styles.tdYear]}>
                  {t('simulate.year')}
                </Text>
                <Text style={[styles.td, styles.tdMoney]}>
                  {t('simulate.interestYear')}
                </Text>
                <Text style={[styles.td, styles.tdMoney]}>
                  {t('simulate.cumulativeInterest')}
                </Text>
                <Text style={[styles.td, styles.tdMoney]}>
                  {t('simulate.endingBalance')}
                </Text>
              </View>

              {/* Rows */}
              {yearlyRows.map(row => (
                <View key={row.year} style={styles.tr}>
                  <Text style={[styles.td, styles.tdYear]}>{row.year}</Text>
                  <Text style={[styles.td, styles.tdMoney]}>
                    {formatCurrency(row.interest)}
                  </Text>
                  <Text style={[styles.td, styles.tdMoney]}>
                    {formatCurrency(row.cumulativeInterest)}
                  </Text>
                  <Text style={[styles.td, styles.tdMoney]}>
                    {formatCurrency(row.endingBalance)}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={styles.tableHint}>
              {t(
                mode === MODES.SAVINGS
                  ? 'simulate.savingsTableHint'
                  : 'simulate.debtTableHint',
              )}
            </Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            {t('simulate.disclaimer')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  scenariosContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  scenarioCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  selectedScenario: {
    borderColor: '#667eea',
    backgroundColor: '#f0f4ff',
  },
  scenarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  scenarioReturn: {
    fontSize: 16,
    fontWeight: '700',
    color: '#667eea',
  },
  selectedScenarioText: {
    color: '#667eea',
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedScenarioDescription: {
    color: '#475569',
  },
  inputsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  inputGroup: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#6b7280',
    paddingLeft: 12,
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  textInputFull: {
    fontSize: 16,
    color: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  resultsContainer: {
    paddingHorizontal: 24,
  },
  mainResult: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
  },
  breakdownContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  breakdownContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  chartContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exportButton: {
    marginTop: 16,
    backgroundColor: '#667eea',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  insightsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  insightEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  disclaimerContainer: {
    margin: 24,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
  },
  chartFallback: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#fee2e2',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
  },
  chartFallbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: 6,
  },
  chartFallbackText: {
    fontSize: 12,
    color: '#7f1d1d',
    lineHeight: 18,
    marginBottom: 8,
  },
  chartFallbackSteps: {
    fontSize: 12,
    color: '#7f1d1d',
    fontStyle: 'italic',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  modeToggleButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modeToggleButtonSm: {
    backgroundColor: '#e2e8f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeToggleActive: {
    backgroundColor: '#c7d2fe',
    borderColor: '#667eea',
    borderWidth: 1,
  },
  modeToggleText: {
    color: '#334155',
    fontWeight: '600',
  },
  modeToggleTextActive: {
    color: '#4338ca',
    fontWeight: '700',
  },

  table: {
    marginHorizontal: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tr: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  trHeader: {
    backgroundColor: '#f8fafc',
  },
  td: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  tdYear: {
    flex: 0.5,
    fontWeight: '700',
    color: '#1e293b',
  },
  tdMoney: {
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  tableHint: {
    marginTop: 8,
    marginHorizontal: 24,
    fontSize: 12,
    color: '#64748b',
  },
  scenarioPreviewRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  scenarioPreviewCol: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 10,
  },
  previewLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  previewValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  scenarioApplyBtn: {
    marginTop: 12,
    backgroundColor: '#667eea',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  scenarioApplyText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  infoIconButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIconText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: '#334155',
    fontWeight: '600',
  },
  debtChipsRow: {
    paddingHorizontal: 24,
    gap: 12,
  },
  debtChip: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  debtChipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtChipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  debtChipDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  debtChipPreviewRow: {
    marginTop: 8,
  },
  debtChipPreviewText: {
    fontSize: 12,
    color: '#334155',
  },
  debtChipApplyBtn: {
    marginTop: 10,
    backgroundColor: '#0ea5e9',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  debtChipApplyText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SimulateScreen;
