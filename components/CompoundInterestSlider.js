// components/CompoundInterestSlider.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const SLIDER_WIDTH = screenWidth - 120;
const THUMB_SIZE = 28;

const CompoundInterestSlider = () => {
  const [years, setYears] = useState(1);
  const [simpleInterest, setSimpleInterest] = useState(10800);
  const [compoundInterest, setCompoundInterest] = useState(10800);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const dragStartXRef =useRef(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const differenceAnim = useRef(new Animated.Value(0)).current;

  const calculateInterest = (year) => {
    const principal = 10000;
    const rate = 0.08;
    
    // Simple Interest: P + (P * r * t)
    const simple = principal + (principal * rate * year);
    
    // Compound Interest: P * (1 + r)^t
    const compound = principal * Math.pow(1 + rate, year);
    
    setSimpleInterest(Math.round(simple));
    setCompoundInterest(Math.round(compound));
  };

  useEffect(() => {
    calculateInterest(years);
    
    // Animate the difference highlight when it changes
    Animated.sequence([
      Animated.timing(differenceAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(differenceAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [years]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: () => {
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: false,
      }).start();
      dragStartXRef.current = translateX.__getValue();
      Animated.spring(scaleAnim, {\
        toValue:1.3,
        useNativeDriver: false;
      }).start();
    },

    onPanResponderMove: (evt, gestureState) => {
      const newPosition = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, gestureState.dx));
      translateX.setValue(newPosition);
      
      const newYear = Math.round((newPosition / (SLIDER_WIDTH - THUMB_SIZE)) * 19) + 1;
      if (newYear !== years) {
        setYears(newYear);
      }
    },

    onPanResponderRelease: (evt, gestureState) => {
      const newPosition = Math.max(0, Math.min(SLIDER_WIDTH - THUMB_SIZE, gestureState.dx));
      const newYear = Math.round((newPosition / (SLIDER_WIDTH - THUMB_SIZE)) * 19) + 1;
      const max = SLIDER_WIDTH - THUMB_SIZE;
      
      
      setYears(newYear);
      
      // Snap to the correct position
      const finalPosition = ((newYear-1)/19)*max;
      
      Animated.spring(translateX, {
        toValue: finalPosition,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
      
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: false,
      }).start();
    },
  });

  const formatCurrency = (amount) => {
    return `R ${amount.toLocaleString()}`;
  };

  const difference = compoundInterest - simpleInterest;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Drag to see the magic happen!</Text>
        <Text style={styles.yearText}>Year {years}</Text>
      </View>

      <View style={styles.resultsContainer}>
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Simple Interest</Text>
          <Text style={styles.resultValue}>{formatCurrency(simpleInterest)}</Text>
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Compound Interest</Text>
          <Text style={styles.resultValue}>{formatCurrency(compoundInterest)}</Text>
        </View>
      </View>

      <Animated.View 
        style={[
          styles.differenceContainer,
          { transform: [{ scale: differenceAnim }] }
        ]}
      >
        <Text style={styles.differenceLabel}>Extra with Compound Interest:</Text>
        <Text style={styles.differenceValue}>+{formatCurrency(difference)}</Text>
      </Animated.View>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <Animated.View 
            style={[
              styles.sliderFill,
              {
                width: translateX.interpolate({
                  inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
                  outputRange: [4, SLIDER_WIDTH - THUMB_SIZE + 4],
                  extrapolate: 'clamp',
                }),
              }
            ]}
          />
          <Animated.View
            style={[
              styles.sliderThumb,
              {
                transform: [
                  { translateX },
                  { scale: scaleAnim },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          />
        </View>
        
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>1 Year</Text>
          <Text style={styles.sliderLabel}>20 Years</Text>
        </View>
      </View>

      <View style={styles.insightContainer}>
        {years >= 10 && (
          <Text style={styles.insightText}>
            💡 Notice how the gap widens dramatically over time? That's compound interest at work!
          </Text>
        )}
        {years >= 15 && (
          <Text style={styles.insightText}>
            🚀 After 15+ years, you're earning more from compound interest than your original investment!
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  yearText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#667eea',
  },
  resultsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  resultBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  differenceContainer: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  differenceLabel: {
    fontSize: 14,
    color: '#059669',
    marginBottom: 4,
  },
  differenceValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    position: 'relative',
    marginHorizontal: THUMB_SIZE / 2,
    justifyContent: 'center',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#667eea',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    position: 'absolute',
    top: -(THUMB_SIZE - 8) / 2,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: '#667eea',
    borderRadius: THUMB_SIZE / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'white',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginHorizontal: THUMB_SIZE / 2,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  insightContainer: {
    gap: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#059669',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CompoundInterestSlider;