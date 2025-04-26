import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../services/firebase';

const Navbar: React.FC = () => {
  const { currentUser, doctorProfile } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-primary-600">MediScript</h1>
      </div>
      
      <div className="relative">
        <button 
          className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 focus:outline-none"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
            {doctorProfile?.name ? doctorProfile.name.charAt(0).toUpperCase() : 'D'}
          </div>
          <span className="hidden md:block font-medium">{doctorProfile?.name || currentUser?.displayName || currentUser?.email}</span>
        </button>

        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => navigate('/profile')}
            >
              <User size={16} className="mr-2" />
              Profile
            </button>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => navigate('/settings')}
            >
              <Settings size={16} className="mr-2" />
              Settings
            </button>
            <div className="border-t border-gray-100 my-1"></div>
            <button 
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;