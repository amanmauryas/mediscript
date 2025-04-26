import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, getDoctorProfile, signOut as firebaseSignOut } from '../services/firebase';
import { AuthUser, Doctor } from '../types';

interface AuthContextType {
  currentUser: AuthUser | null;
  doctorProfile: Doctor | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  doctorProfile: null,
  loading: true,
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setCurrentUser(null);
      setDoctorProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Convert Firebase user to our AuthUser type
          const authUser: AuthUser = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || undefined
          };
          setCurrentUser(authUser);
          
          // Get doctor profile
          try {
            const doctorData = await getDoctorProfile(user.uid);
            setDoctorProfile(doctorData as Doctor);
          } catch (error) {
            console.error('Error fetching doctor profile:', error);
            // Set a default profile if there's an error
            setDoctorProfile({
              id: user.uid,
              name: user.displayName || '',
              email: user.email || '',
              specialization: '',
              phone: '',
              address: '',
              contact: '',
              clinic: {
                name: '',
                address: '',
                phone: '',
                email: '',
                license: '',
                logo: ''
              },
              clinicInfo: {
                name: '',
                address: '',
                phone: '',
                email: ''
              },
              licenseNumber: '',
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        } else {
          setCurrentUser(null);
          setDoctorProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setCurrentUser(null);
        setDoctorProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, doctorProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};