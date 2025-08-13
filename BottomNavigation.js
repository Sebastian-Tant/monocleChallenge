// components/BottomNavigation.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BottomNavigation = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      id: 'home',
      icon: '🏠',
      label: 'Home',
    },
    {
      id: 'learn',
      icon: '📚',
      label: 'Learn',
    },
    {
      id: 'simulate',
      icon: '📈',
      label: 'Simulate',
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
    },
  ];

  return (
    <View style={[
      styles.container,
      { paddingBottom: insets.bottom + 16 }
    ]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <View style={[
              styles.iconContainer,
              activeTab === tab.id && styles.activeIconContainer
            ]}>
              <Text style={[
                styles.icon,
                activeTab === tab.id && styles.activeIcon
              ]}>
                {tab.icon}
              </Text>
            </View>
            <Text style={[
              styles.label,
              activeTab === tab.id && styles.activeLabel
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  activeTab: {
    // Could add any active tab container styles here
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: '#667eea',
  },
  icon: {
    fontSize: 20,
  },
  activeIcon: {
    // Icons remain the same size and color since they're emojis
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  activeLabel: {
    color: '#667eea',
    fontWeight: '600',
  },
});

export default BottomNavigation;