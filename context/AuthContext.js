// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
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

  // Function to create or update user document in Firestore
  const createUserDocument = async (firebaseUser) => {
    if (!firebaseUser) {
      console.log('No firebase user provided to createUserDocument');
      return;
    }
    
    console.log('Creating/updating user document for:', firebaseUser.uid);
    
    try {
      const userRef = firestore().collection('users').doc(firebaseUser.uid);
      console.log('User ref created, checking if document exists...');
      
      // Use a more robust way to check if document exists
      let userDoc;
      try {
        userDoc = await userRef.get();
        console.log('Document exists:', userDoc.exists);
      } catch (getError) {
        console.log('Error getting document (likely doesnt exist):', getError.message);
        // If we can't get the doc, assume it doesn't exist and create it
        userDoc = { exists: false };
      }
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        photoURL: firebaseUser.photoURL || '',
        lastSignIn: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      if (!userDoc.exists) {
        // New user - create document with all initial data
        console.log('Creating new user document...');
        const newUserData = {
          ...userData,
          createdAt: firestore.FieldValue.serverTimestamp(),
          // Add any other initial user data you want to store
          goals: [],
          totalSavings: 0,
          lessonsCompleted: [],
          preferences: {
            notifications: true,
            darkMode: false,
          }
        };
        
        await userRef.set(newUserData);
        console.log('✅ New user document created for:', firebaseUser.email);
      } else {
        // Existing user - update their info and last sign in time
        console.log('Updating existing user document...');
        await userRef.update(userData);
        console.log('✅ User document updated for:', firebaseUser.email);
      }
    } catch (error) {
      console.error('❌ Error creating/updating user document:', {
        code: error.code,
        message: error.message,
        uid: firebaseUser.uid,
        email: firebaseUser.email
      });
      
      // Try a fallback approach - just create the document
      try {
        console.log('Trying fallback approach - forcing document creation...');
        const userRef = firestore().collection('users').doc(firebaseUser.uid);
        await userRef.set({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          lastSignIn: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
          goals: [],
          totalSavings: 0,
          lessonsCompleted: [],
          preferences: {
            notifications: true,
            darkMode: false,
          }
        }, { merge: true }); // Use merge to avoid overwriting if it exists
        
        console.log('✅ Fallback user document creation successful');
      } catch (fallbackError) {
        console.error('❌ Fallback approach also failed:', fallbackError);
      }
    }
  };

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
      
      // Create or update user document in Firestore
      await createUserDocument(result.user);
      
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

  // Helper function to update user data in Firestore
  const updateUserData = async (updates) => {
    if (!user) return;
    
    try {
      const userRef = firestore().collection('users').doc(user.uid);
      await userRef.update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      console.log('User data updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  // Helper function to get user data from Firestore
  const getUserData = async () => {
    if (!user) return null;
    
    try {
      const userRef = firestore().collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
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
        updateUserData,
        getUserData,
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