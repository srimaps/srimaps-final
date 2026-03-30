import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, TruckIcon, AlertCircleIcon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface DriverLoginProps {
  onBack: () => void;
}

export function DriverLogin({ onBack }: DriverLoginProps) {
  const { loginDriver, signupDriver } = useUser();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const ok = await loginDriver(username, password);
    if (!ok) {
      setError('Invalid username or password');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = await signupDriver(fullName, username, phoneNumber, password);
    if (!result.success) {
      setError(result.error || 'Signup failed');
      return;
    }

    setSuccess('Signup successful. Now log in with your username and password.');
    setMode('login');
    setFullName('');
    setPhoneNumber('');
    setPassword('');
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <ArrowLeftIcon size={18} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-teal-100 dark:bg-teal-900/40 p-3 rounded-xl">
            <TruckIcon className="text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Access</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign up or log in to start sharing your route location
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('login');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mode === 'login'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 rounded-lg font-medium ${
              mode === 'signup'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Enter full name"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">Phone Number</label>
              <input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="0771234567"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Choose username"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium dark:text-white">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Choose password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-semibold"
            >
              Create Account
            </button>
          </form>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertCircleIcon size={18} />
            {error}
          </div>
        )}

        {success && <div className="mt-4 text-sm text-green-600 dark:text-green-400">{success}</div>}
      </motion.div>
    </div>
  );
}
