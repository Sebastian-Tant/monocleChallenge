// screens/ProfileScreen.js - Simple Debug Version
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('Sign out button pressed');
      if (signOut) {
        await signOut();
      } else {
        console.log('signOut function not available');
        Alert.alert('Error', 'Sign out function not available');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile Screen</Text>
        
        <Text style={styles.userInfo}>
          User: {user?.displayName || 'No name'}
        </Text>
        
        <Text style={styles.userInfo}>
          Email: {user?.email || 'No email'}
        </Text>

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>SIGN OUT</Text>
        </TouchableOpacity>

        <Text style={styles.debug}>
          Debug: signOut function {signOut ? 'available' : 'missing'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  signOutButton: {
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 8,
    marginTop: 30,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debug: {
    fontSize: 12,
    color: '#999',
    marginTop: 20,
  },
});

export default ProfileScreen;