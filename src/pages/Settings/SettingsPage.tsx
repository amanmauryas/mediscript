import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Lock, Globe, Printer, FileText } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';

const SettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'en',
    prescriptionFormat: 'standard',
    autoSave: true,
  });

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSelect = (setting: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customize your application preferences and account settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Bell className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                  <p className="text-sm text-gray-500">Manage your notification preferences</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className={`${
                    settings.notifications ? 'bg-primary-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  onClick={() => handleToggle('notifications')}
                >
                  <span
                    className={`${
                      settings.notifications ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Globe className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
                  <p className="text-sm text-gray-500">Customize the look and feel</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className={`${
                    settings.darkMode ? 'bg-primary-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  onClick={() => handleToggle('darkMode')}
                >
                  <span
                    className={`${
                      settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Globe className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Language</h3>
                <p className="text-sm text-gray-500">Select your preferred language</p>
              </div>
            </div>
            <div className="mt-4">
              <select
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prescription Format */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Prescription Format</h3>
                <p className="text-sm text-gray-500">Choose your preferred prescription layout</p>
              </div>
            </div>
            <div className="mt-4">
              <select
                value={settings.prescriptionFormat}
                onChange={(e) => handleSelect('prescriptionFormat', e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option value="standard">Standard</option>
                <option value="compact">Compact</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Auto Save */}
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Printer className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Auto Save</h3>
                  <p className="text-sm text-gray-500">Automatically save your work</p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  type="button"
                  className={`${
                    settings.autoSave ? 'bg-primary-600' : 'bg-gray-200'
                  } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                  onClick={() => handleToggle('autoSave')}
                >
                  <span
                    className={`${
                      settings.autoSave ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage; 