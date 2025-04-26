import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getPrescriptionsByDoctor, getPatientsByDoctor } from '../../services/firebase';
import { format } from 'date-fns';
import { 
  FilePlus, 
  Users, 
  FileText, 
  BarChart, 
  Calendar, 
  Clock, 
  Plus 
} from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([]);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [prescriptionCount, setPrescriptionCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        // Fetch prescriptions
        const prescriptions = await getPrescriptionsByDoctor(currentUser.uid);
        setRecentPrescriptions(
          prescriptions
            .sort((a: any, b: any) => b.createdAt.toDate() - a.createdAt.toDate())
            .slice(0, 5)
        );
        setPrescriptionCount(prescriptions.length);

        // Fetch patients
        const patients = await getPatientsByDoctor(currentUser.uid);
        setPatientCount(patients.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  // Mock data for statistics
  const mockStats = {
    todayPrescriptions: 3,
    weekPrescriptions: 12,
    monthPrescriptions: 45
  };

  const QuickActions = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link to="/prescriptions/new" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <FilePlus className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">New Prescription</dt>
                <dd className="text-xs text-gray-500">Create a new prescription</dd>
              </dl>
            </div>
          </div>
        </div>
      </Link>

      <Link to="/patients" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary-100 rounded-md p-3">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Manage Patients</dt>
                <dd className="text-xs text-gray-500">View and edit patient records</dd>
              </dl>
            </div>
          </div>
        </div>
      </Link>

      <Link to="/prescriptions" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accent-100 rounded-md p-3">
              <FileText className="h-6 w-6 text-accent-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Prescriptions</dt>
                <dd className="text-xs text-gray-500">View all prescriptions</dd>
              </dl>
            </div>
          </div>
        </div>
      </Link>

      <Link to="/profile" className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-success-100 rounded-md p-3">
              <BarChart className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Clinic Profile</dt>
                <dd className="text-xs text-gray-500">Update your clinic details</dd>
              </dl>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  const Statistics = () => (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-full p-3">
              <Calendar className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Today</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{mockStats.todayPrescriptions}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Prescriptions</div>
              <div className="text-sm font-medium text-success-600">+{Math.floor(Math.random() * 10) + 1}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-secondary-100 rounded-full p-3">
              <Clock className="h-5 w-5 text-secondary-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">This Week</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{mockStats.weekPrescriptions}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Prescriptions</div>
              <div className="text-sm font-medium text-success-600">+{Math.floor(Math.random() * 15) + 5}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-accent-100 rounded-full p-3">
              <Users className="h-5 w-5 text-accent-600" />
            </div>
            <div className="ml-5">
              <div className="text-sm font-medium text-gray-500">Patients</div>
              <div className="mt-1 text-3xl font-semibold text-gray-900">{patientCount}</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-sm font-medium text-success-600">+{Math.floor(Math.random() * 10) + 1}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const RecentPrescriptions = () => (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Recent Prescriptions</h2>
        <Link to="/prescriptions" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View all
        </Link>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="py-10 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-gray-500">Loading...</p>
          </div>
        ) : recentPrescriptions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {recentPrescriptions.map((prescription) => (
              <li key={prescription.id}>
                <Link to={`/prescriptions/${prescription.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">{prescription.patientName}</p>
                        <p className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-success-100 text-success-800">
                          {prescription.diagnosis && prescription.diagnosis.length > 0 
                            ? prescription.diagnosis[0] 
                            : 'General Consultation'}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {prescription.createdAt ? format(prescription.createdAt.toDate(), 'MMM d, yyyy') : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>
                          {prescription.medications && prescription.medications.length} medication(s)
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-10 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new prescription.</p>
            <div className="mt-6">
              <Link to="/prescriptions/new" className="btn-primary">
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                New Prescription
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's an overview of your prescription activity.
        </p>
      </div>
      
      <QuickActions />
      <Statistics />
      <RecentPrescriptions />
    </MainLayout>
  );
};

export default DashboardPage;