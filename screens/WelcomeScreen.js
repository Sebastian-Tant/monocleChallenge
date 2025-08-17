// screens/WelcomeScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ onGetStarted }) => {
  const { signInWithGoogle, loading, user } = useAuth();

  // Animation values
  const treeGrowthAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moneyFallAnim = useRef(new Animated.Value(0)).current;
  const buttonPulseAnim = useRef(new Animated.Value(1)).current;
  const leafShimmerAnim = useRef(new Animated.Value(0)).current;
  const rootGrowAnim = useRef(new Animated.Value(0)).current;

  // State for money positions
  const [moneyPositions] = useState([
    { x: width * 0.3, y: height * 0.35, delay: 0 },
    { x: width * 0.7, y: height * 0.4, delay: 500 },
    { x: width * 0.2, y: height * 0.45, delay: 1000 },
    { x: width * 0.8, y: height * 0.35, delay: 1500 },
    { x: width * 0.5, y: height * 0.3, delay: 2000 },
    { x: width * 0.4, y: height * 0.42, delay: 2500 },
  ]);

  useEffect(() => {
    // Start the tree growing animation sequence
    const startAnimations = () => {
      // Fade in the scene
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Grow roots first
      Animated.timing(rootGrowAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      // Then grow the tree
      Animated.timing(treeGrowthAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        // After tree is grown, start money falling
        Animated.stagger(300, 
          moneyPositions.map((_, index) => 
            Animated.timing(moneyFallAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            })
          )
        ).start();
      });

      // Continuous leaf shimmer
      const leafShimmer = Animated.loop(
        Animated.sequence([
          Animated.timing(leafShimmerAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(leafShimmerAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      leafShimmer.start();

      // Button pulse
      const buttonPulse = Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(buttonPulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      buttonPulse.start();
    };

    startAnimations();
  }, []);

  // Handle successful sign-in
  useEffect(() => {
    if (user && onGetStarted) {
      onGetStarted();
    }
  }, [user, onGetStarted]);

  const handleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      
      if (result) {
        console.log('Sign-in successful:', result.user?.email);
      } else {
        console.log('Sign-in was cancelled by user');
      }
    } catch (error) {
      console.error('Sign-in error in component:', error);
      
      if (error?.code !== 'sign_in_cancelled' && 
          error?.code !== 'SIGN_IN_CANCELLED' && 
          error?.code !== '12501') {
        alert('Sign-in failed. Please try again.');
      }
    }
  };

  const MoneyIcon = ({ style, delay = 0 }) => {
    const fallAnim = useRef(new Animated.Value(-50)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fallAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 3000,
              useNativeDriver: true,
            })
          ),
        ]).start();
      }, delay);

      return () => clearTimeout(timer);
    }, [delay]);

    const rotate = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View
        style={[
          style,
          {
            transform: [
              { translateY: fallAnim },
              { rotate },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Text style={styles.moneyIcon}>💰</Text>
      </Animated.View>
    );
  };

  const TreeTrunk = () => {
    const trunkScale = treeGrowthAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        style={[
          styles.treeTrunk,
          {
            transform: [{ scaleY: trunkScale }],
            transformOrigin: 'bottom',
          }
        ]}
      />
    );
  };

  const TreeRoots = () => {
    const rootScale = rootGrowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View style={styles.rootsContainer}>
        <Animated.View style={[
          styles.root, 
          styles.rootLeft, 
          { transform: [{ scaleX: rootScale }] }
        ]} />
        <Animated.View style={[
          styles.root, 
          styles.rootRight, 
          { transform: [{ scaleX: rootScale }] }
        ]} />
        <Animated.View style={[
          styles.root, 
          styles.rootCenter, 
          { transform: [{ scaleX: rootScale }] }
        ]} />
      </Animated.View>
    );
  };

  const TreeCanopy = () => {
    const canopyScale = treeGrowthAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.5, 1],
    });

    const shimmerOpacity = leafShimmerAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.6, 1, 0.6],
    });

    return (
      <Animated.View
        style={[
          styles.treeCanopy,
          {
            transform: [{ scale: canopyScale }],
            opacity: shimmerOpacity,
          },
        ]}
      >
        {/* Multiple leaf layers for depth */}
        <View style={[styles.leafLayer, styles.leafLayer1]}>
          <Text style={styles.leafEmoji}>🌿</Text>
          <Text style={styles.leafEmoji}>🍃</Text>
          <Text style={styles.leafEmoji}>🌿</Text>
        </View>
        <View style={[styles.leafLayer, styles.leafLayer2]}>
          <Text style={styles.leafEmoji}>🍃</Text>
          <Text style={styles.leafEmoji}>🌿</Text>
          <Text style={styles.leafEmoji}>🍃</Text>
          <Text style={styles.leafEmoji}>🌿</Text>
        </View>
        <View style={[styles.leafLayer, styles.leafLayer3]}>
          <Text style={styles.leafEmoji}>🌿</Text>
          <Text style={styles.leafEmoji}>🍃</Text>
          <Text style={styles.leafEmoji}>🌿</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0F4C3A" />
      <View style={styles.container}>
        {/* Animated background */}
        <View style={styles.backgroundGradient}>
          {/* Stars/sparkles */}
          <View style={styles.sparkle1}>✨</View>
          <View style={styles.sparkle2}>⭐</View>
          <View style={styles.sparkle3}>✨</View>
          <View style={styles.sparkle4}>⭐</View>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Welcome Text */}
          <Animated.View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Watch Your Money</Text>
            <Text style={styles.subTitle}>🌱 Grow 🌱</Text>
            <Text style={styles.description}>
              The power of compound interest
            </Text>
          </Animated.View>

          {/* Tree Container */}
          <View style={styles.treeContainer}>
            {/* Falling Money */}
            {moneyPositions.map((position, index) => (
              <MoneyIcon
                key={index}
                style={[
                  styles.floatingMoney,
                  { left: position.x - 15, top: position.y }
                ]}
                delay={position.delay}
              />
            ))}

            {/* Tree Roots */}
            <TreeRoots />

            {/* Tree Trunk */}
            <TreeTrunk />

            {/* Tree Canopy */}
            <TreeCanopy />
          </View>

          {/* Sign In Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              {
                transform: [{ scale: buttonPulseAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={{
                    uri: 'https://developers.google.com/identity/images/g-logo.png',
                  }}
                  style={styles.googleLogo}
                />
                <Text style={styles.buttonText}>
                  {loading ? 'Growing...' : 'Start Growing'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🌳 Plant the seed of your financial future 🌳
            </Text>
          </View>
        </Animated.View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F4C3A',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F4C3A',
    // Add a subtle gradient effect with overlays
  },
  sparkle1: {
    position: 'absolute',
    top: '15%',
    left: '20%',
    fontSize: 20,
    opacity: 0.7,
  },
  sparkle2: {
    position: 'absolute',
    top: '25%',
    right: '15%',
    fontSize: 16,
    opacity: 0.5,
  },
  sparkle3: {
    position: 'absolute',
    top: '70%',
    left: '10%',
    fontSize: 14,
    opacity: 0.6,
  },
  sparkle4: {
    position: 'absolute',
    top: '80%',
    right: '25%',
    fontSize: 18,
    opacity: 0.4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subTitle: {
    fontSize: 24,
    color: '#90EE90',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  treeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingMoney: {
    position: 'absolute',
    zIndex: 10,
  },
  moneyIcon: {
    fontSize: 30,
  },
  rootsContainer: {
    position: 'absolute',
    bottom: -20,
    alignItems: 'center',
  },
  root: {
    width: 80, // Fixed width now
    height: 3,
    backgroundColor: '#8B4513',
    position: 'absolute',
    bottom: 0,
  },
  rootLeft: {
    left: -40,
    transform: [{ rotate: '15deg' }],
  },
  rootRight: {
    right: -40,
    transform: [{ rotate: '-15deg' }],
  },
  rootCenter: {
    left: -40,
    transform: [{ rotate: '0deg' }],
  },
  treeTrunk: {
    width: 20,
    height: 120, // Fixed height now
    backgroundColor: '#8B4513',
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  treeCanopy: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    width: 200,
    height: 150,
  },
  leafLayer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leafLayer1: {
    top: 0,
    width: 120,
  },
  leafLayer2: {
    top: 40,
    width: 180,
  },
  leafLayer3: {
    top: 80,
    width: 140,
  },
  leafEmoji: {
    fontSize: 40,
    marginHorizontal: 5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default LandingScreen;