// screens/SimulateScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';

const SimulateScreen = () => {
  const [monthlyContribution, setMonthlyContribution] = useState('1000');
  const [timeHorizon, setTimeHorizon] = useState('10');
  const [expectedReturn, setExpectedReturn] = useState('8');
  const [selectedScenario, setSelectedScenario] = useState('moderate');

  const scenarios = [
    { 
      id: 'conservative', 
      name: 'Conservative', 
      return: 6, 
      description: 'Low risk, stable returns',
      color: '#10b981' 
    },
    { 
      id: 'moderate', 
      name: 'Moderate', 
      return: 8, 
      description: 'Balanced risk and return',
      color: '#667eea' 
    },
    { 
      id: 'aggressive', 
      name: 'Aggressive', 
      return: 12, 
      description: 'Higher risk, higher potential returns',
      color: '#f59e0b' 
    },
  ];

  const calculateProjection = () => {
    const monthly = parseFloat(monthlyContribution) || 0;
    const years = parseFloat(timeHorizon) || 0;
    const annualReturn = parseFloat(expectedReturn) / 100;
    const monthlyReturn = annualReturn / 12;
    const totalMonths = years * 12;

    if (monthly === 0 || years === 0) return { total: 0, contributions: 0, growth: 0 };

    // Future value of ordinary annuity formula
    const futureValue = monthly * (((1 + monthlyReturn) ** totalMonths - 1) / monthlyReturn);
    const totalContributions = monthly * totalMonths;
    const growth = futureValue - totalContributions;

    return {
      total: Math.round(futureValue),
      contributions: Math.round(totalContributions),
      growth: Math.round(growth),
    };
  };

  const projection = calculateProjection();

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario.id);
    setExpectedReturn(scenario.return.toString());
  };

  const formatCurrency = (amount) => {
    return `R ${amount.toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Simulate</Text>
          <Text style={styles.subtitle}>
            See how your investments could grow over time
          </Text>
        </View>

        {/* Investment Scenarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Strategy</Text>
          <View style={styles.scenariosContainer}>
            {scenarios.map((scenario) => (
              <TouchableOpacity
                key={scenario.id}
                style={[
                  styles.scenarioCard,
                  selectedScenario === scenario.id && styles.selectedScenario,
                ]}
                onPress={() => handleScenarioSelect(scenario)}
                activeOpacity={0.8}
              >
                <View style={styles.scenarioHeader}>
                  <Text style={[
                    styles.scenarioName,
                    selectedScenario === scenario.id && styles.selectedScenarioText,
                  ]}>
                    {scenario.name}
                  </Text>
                  <Text style={[
                    styles.scenarioReturn,
                    selectedScenario === scenario.id && styles.selectedScenarioText,
                  ]}>
                    {scenario.return}%
                  </Text>
                </View>
                <Text style={[
                  styles.scenarioDescription,
                  selectedScenario === scenario.id && styles.selectedScenarioDescription,
                ]}>
                  {scenario.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Input Parameters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Parameters</Text>
          
          <View style={styles.inputsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Contribution</Text>
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
              <Text style={styles.inputLabel}>Time Horizon (Years)</Text>
              <TextInput
                style={styles.textInputFull}
                value={timeHorizon}
                onChangeText={setTimeHorizon}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Expected Annual Return (%)</Text>
              <TextInput
                style={styles.textInputFull}
                value={expectedReturn}
                onChangeText={setExpectedReturn}
                keyboardType="numeric"
                placeholder="8"
              />
            </View>
          </View>
        </View>

        {/* Results */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projection Results</Text>
          
          <View style={styles.resultsContainer}>
            <View style={styles.mainResult}>
              <Text style={styles.resultLabel}>Projected Total Value</Text>
              <Text style={styles.resultValue}>{formatCurrency(projection.total)}</Text>
            </View>

            <View style={styles.breakdownContainer}>
              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownColor, { backgroundColor: '#667eea' }]} />
                <View style={styles.breakdownContent}>
                  <Text style={styles.breakdownLabel}>Total Contributions</Text>
                  <Text style={styles.breakdownValue}>{formatCurrency(projection.contributions)}</Text>
                </View>
              </View>

              <View style={styles.breakdownItem}>
                <View style={[styles.breakdownColor, { backgroundColor: '#10b981' }]} />
                <View style={styles.breakdownContent}>
                  <Text style={styles.breakdownLabel}>Investment Growth</Text>
                  <Text style={styles.breakdownValue}>{formatCurrency(projection.growth)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Insights</Text>
          
          <View style={styles.insightsContainer}>
            {projection.growth > projection.contributions && (
              <View style={styles.insightCard}>
                <Text style={styles.insightEmoji}>🚀</Text>
                <Text style={styles.insightText}>
                  Your investments could grow to more than double your contributions through compound growth!
                </Text>
              </View>
            )}

            {parseFloat(timeHorizon) >= 20 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightEmoji}>⏰</Text>
                <Text style={styles.insightText}>
                  With {timeHorizon} years, you're giving compound interest plenty of time to work its magic.
                </Text>
              </View>
            )}

            {parseFloat(monthlyContribution) >= 2000 && (
              <View style={styles.insightCard}>
                <Text style={styles.insightEmoji}>💪</Text>
                <Text style={styles.insightText}>
                  Great job! Contributing R{monthlyContribution} monthly puts you on a strong path to your goals.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            ⚠️ This is a simplified projection for educational purposes. Actual returns may vary significantly due to market volatility, fees, and other factors. Past performance does not guarantee future results.
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
});

export default SimulateScreen;