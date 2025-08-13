// screens/WelcomeScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ onGetStarted }) => {
  const insets = useSafeAreaInsets();
  const logoScaleAnimation = useRef(new Animated.Value(0)).current;
  const logoFloatAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;
  const plantAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations sequence
    Animated.sequence([
      // First animate the logo scale (appearance)
      Animated.timing(logoScaleAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Then animate text
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Finally animate the plant
      Animated.timing(plantAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // After initial animations complete, start the floating animation
      startFloatingAnimation();
    });

    return () => {
      // Clean up animations when component unmounts
      logoFloatAnimation.stopAnimation();
    };
  }, []);

  const startFloatingAnimation = () => {
    const floatAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloatAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoFloatAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    floatAnimation.start();
  };

  const logoTranslateY = logoFloatAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoScaleAnimation },
                { translateY: logoTranslateY }
              ],
            },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>💰</Text>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          Welcome. Your journey to financial confidence starts now.
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          We'll help you understand money, build smart habits, and see your future grow.
        </Animated.Text>

        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnimation,
              transform: [{ translateY: slideAnimation }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text
          style={[
            styles.plantEmoji,
            {
              opacity: plantAnimation,
              transform: [
                { scale: plantAnimation },
                { translateY: Animated.multiply(plantAnimation, -20) },
              ],
            },
          ]}
        >
          🌱
        </Animated.Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  logoEmoji: {
    fontSize: 48,
  },
  tagline: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 60,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  getStartedButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 50,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  buttonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: '600',
  },
  plantEmoji: {
    position: 'absolute',
    bottom: 100,
    right: 40,
    fontSize: 40,
  },
});

export default WelcomeScreen;