import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FilePlus, Users, FileText, Settings, Menu, X, Cable as Capsule, ClipboardList, User, Pill } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Dashboard', to: '/dashboard', icon: <Home size={20} /> },
    { name: 'New Prescription', to: '/prescriptions/new', icon: <FilePlus size={20} /> },
    { name: 'Patients', to: '/patients', icon: <Users size={20} /> },
    { name: 'Prescriptions', to: '/prescriptions', icon: <FileText size={20} /> },
    { name: 'Medicines', to: '/medicines', icon: <Pill size={20} /> },
    { name: 'Templates', to: '/templates', icon: <ClipboardList size={20} /> },
    { name: 'Profile', to: '/profile', icon: <User size={20} /> },
    { name: 'Settings', to: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 p-4 z-20 lg:hidden">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`bg-white border-r border-gray-200 w-64 fixed inset-y-0 left-0 z-20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h2 className="text-xl font-bold text-primary-600">MediScript</h2>
          </div>

          <nav className="flex-1 overflow-y-auto pt-5 pb-4">
            <ul className="space-y-1 px-2">
              {links.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                        isActive 
                          ? 'bg-primary-50 text-primary-700' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
            <p>© 2025 MediScript</p>
            <p>HIPAA Compliant</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;