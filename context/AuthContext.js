// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      
      // Get the users sign in result
      const signInResult = await GoogleSignin.signIn();
      console.log('Full Google Sign-In Result:', JSON.stringify(signInResult, null, 2));
      
      // Handle different response structures
      let idToken = null;
      let accessToken = null;
      
      // Check multiple possible structures
      if (signInResult.idToken) {
        idToken = signInResult.idToken;
        accessToken = signInResult.accessToken;
      } else if (signInResult.data?.idToken) {
        idToken = signInResult.data.idToken;
        accessToken = signInResult.data.accessToken;
      } else if (signInResult.user && signInResult.idToken) {
        idToken = signInResult.idToken;
        accessToken = signInResult.accessToken;
      }
      
      console.log('Extracted tokens:', { 
        hasIdToken: !!idToken, 
        hasAccessToken: !!accessToken 
      });
      
      if (!idToken) {
        console.error('No idToken found in any expected location');
        throw new Error('No ID token received from Google Sign-In');
      }
      
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken, accessToken);
      
      // Sign-in the user with the credential
      const result = await auth().signInWithCredential(googleCredential);
      console.log('Firebase auth result:', result.user?.email);
      
      setLoading(false);
      return result;
      
    } catch (error) {
      console.error('Google Sign-In Error Details:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // Handle specific error codes
      if (error?.code === 'sign_in_cancelled' || 
          error?.code === '12501' || 
          error?.code === 'SIGN_IN_CANCELLED') {
        console.log('User cancelled the sign-in flow');
        // Don't throw for user cancellation
        setLoading(false);
        return null;
      } else if (error?.code === 'in_progress') {
        console.log('Sign in is already in progress');
      } else if (error?.code === 'play_services_not_available') {
        console.log('Play services not available');
      }
      
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear any cached sign-in first
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      await auth().signOut();
      
      setLoading(false);
    } catch (error) {
      console.error('Sign-out Error:', error);
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};