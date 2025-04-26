import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, onAuthStateChanged, getDoctorProfile } from '../services/firebase';
import { AuthUser, Doctor } from '../types';

interface AuthContextType {
  currentUser: AuthUser | null;
  doctorProfile: Doctor | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  doctorProfile: null,
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

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
    <AuthContext.Provider value={{ currentUser, doctorProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};