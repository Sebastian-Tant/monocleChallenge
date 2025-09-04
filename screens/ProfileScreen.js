// screens/ProfileScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ onChangeLanguage }) => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Button press animations
  const languageButtonScale = useRef(new Animated.Value(1)).current;
  const signOutButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous animations
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert(
        t('profile.error', 'Error'), 
        t('profile.signOutError', 'Failed to sign out')
      );
    }
  };

  const animateButtonPress = (buttonScale, callback) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (callback) callback();
    });
  };

  const handleLanguagePress = () => {
    animateButtonPress(languageButtonScale, onChangeLanguage);
  };

  const handleSignOutPress = () => {
    animateButtonPress(signOutButtonScale, handleSignOut);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundContainer}>
        <Animated.View 
          style={[
            styles.backgroundCircle, 
            styles.circle1,
            { transform: [{ rotate: spin }, { scale: pulseAnim }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle, 
            styles.circle2,
            { transform: [{ rotate: spin }, { scale: pulseAnim }] }
          ]} 
        />
        <Animated.View 
          style={[
            styles.backgroundCircle, 
            styles.circle3,
            { transform: [{ rotate: spin }] }
          ]} 
        />
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        {/* Header Section */}
        <Animated.View 
          style={[
            styles.headerSection,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>💰</Text>
          </View>
          <Text style={styles.title}>{t('profile.title', 'Profile')}</Text>
          <Text style={styles.subtitle}>{t('profile.subtitle', 'First Principles Bank')}</Text>
        </Animated.View>

        {/* User Info Cards */}
        <Animated.View style={styles.userInfoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>👤</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('profile.name', 'Name')}</Text>
              <Text style={styles.infoValue}>
                {user?.displayName || t('profile.defaultName', 'Financial Learner')}
              </Text>
            </View>
          </View>

          <View style={[styles.infoCard, styles.infoCardDelayed]}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>📧</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{t('profile.email', 'Email')}</Text>
              <Text style={styles.infoValue}>
                {user?.email || t('profile.noEmail', 'No email')}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: languageButtonScale }] }}>
            <TouchableOpacity
              style={styles.languageButton}
              onPress={handleLanguagePress}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🌍</Text>
                <Text style={styles.buttonText}>
                  {t('profile.changeLanguage', 'Change Language')}
                </Text>
              </View>
              <View style={styles.buttonGlow} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: signOutButtonScale }] }}>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOutPress}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🚪</Text>
                <Text style={styles.buttonText}>
                  {t('profile.signOut', 'SIGN OUT')}
                </Text>
              </View>
              <View style={styles.signOutGlow} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.08,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#4CAF50',
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#2196F3',
    bottom: -30,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#FF9800',
    top: height * 0.4,
    right: -20,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileIconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  userInfoContainer: {
    width: '100%',
    marginBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoCardDelayed: {
    marginBottom: 0,
  },
  infoIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  iconText: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  languageButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: width * 0.8,
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.3)',
    overflow: 'hidden',
  },
  signOutButton: {
    backgroundColor: '#F44336',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: width * 0.8,
    alignItems: 'center',
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(244, 67, 54, 0.3)',
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
  },
  signOutGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
  },
});

export default ProfileScreen;