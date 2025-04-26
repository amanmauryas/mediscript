import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import { Stethoscope } from 'lucide-react';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <span className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            <Stethoscope size={24} className="text-primary-600" />
          </span>
        </div>
        <h1 className="mt-3 text-center text-3xl font-extrabold text-gray-900">MediScript</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Professional Prescription Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p className="mb-1">For demo, use: demo@mediscript.com / password123</p>
        <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
        {' | '}
        <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link>
      </div>
    </div>
  );
};

export default LoginPage;