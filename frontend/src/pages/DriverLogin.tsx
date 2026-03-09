import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TruckIcon, ArrowLeftIcon, AlertCircleIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translate } from '../utils/translations';
import { useUser } from '../contexts/UserContext';
interface DriverLoginProps {
  onBack: () => void;
}
export function DriverLogin({ onBack }: DriverLoginProps) {
  const { language } = useLanguage();
  const { loginDriver } = useUser();
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginDriver(busNumber, password);
    if (!success) {
      setError(translate('invalidCredentials', language));
    }
  };
  return ();

}
