import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export type AuthModalMode = 'login' | 'register' | 'profile' | 'password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthModalMode;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { translations } = useLanguage();
  const { login, register, updateProfile, changePassword, user } = useAuth();
  
  const [mode, setMode] = useState<AuthModalMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode with initialMode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setMessage(null);
      // Populate fields if editing profile
      if (initialMode === 'profile' && user) {
        setName(user.name);
        setEmail(user.email);
      } else {
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
        setOldPassword('');
        setNewPassword('');
      }
    }
  }, [isOpen, initialMode, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login({ email, password });
        if (res.success) {
          setMessage({ type: 'success', text: translations.loginSuccess || res.message });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setMessage({ type: 'error', text: res.message });
        }
      } else if (mode === 'register') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Parollar mos kelmadi!' });
          setLoading(false);
          return;
        }
        const res = await register({ name, email, password });
        if (res.success) {
          setMessage({ type: 'success', text: res.message });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setMessage({ type: 'error', text: res.message });
        }
      } else if (mode === 'profile') {
        const res = await updateProfile(name, email);
        if (res.success) {
          setMessage({ type: 'success', text: res.message });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setMessage({ type: 'error', text: res.message });
        }
      } else if (mode === 'password') {
        if (newPassword !== confirmPassword) {
          setMessage({ type: 'error', text: 'Yangi parollar mos kelmadi!' });
          setLoading(false);
          return;
        }
        const res = await changePassword(oldPassword, newPassword);
        if (res.success) {
          setMessage({ type: 'success', text: res.message });
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setMessage({ type: 'error', text: res.message });
        }
      }
    } catch {
      setMessage({ type: 'error', text: 'Xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.' });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return translations.login;
      case 'register': return translations.register;
      case 'profile': return translations.editProfile;
      case 'password': return translations.changePassword;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 transform transition-all">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors rounded-full p-1.5 hover:bg-slate-100"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{getTitle()}</h2>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-2xl flex items-start space-x-3 text-sm font-medium leading-5 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* REGISTER & PROFILE: Name Input */}
          {(mode === 'register' || mode === 'profile') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translations.name}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* LOGIN, REGISTER & PROFILE: Email Input */}
          {mode !== 'password' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translations.email}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
              </div>
            </div>
          )}

          {/* PASSWORD: Old Password Input */}
          {mode === 'password' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translations.oldPassword}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* PASSWORD: New Password Input */}
          {mode === 'password' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translations.newPassword}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* LOGIN & REGISTER: Password Input */}
          {(mode === 'login' || mode === 'register') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translations.password}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* REGISTER & PASSWORD: Confirm Password Input */}
          {(mode === 'register' || mode === 'password') && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{translations.confirmPassword}</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-500/10 mt-6"
          >
            {loading ? 'Yuklanmoqda...' : (mode === 'profile' || mode === 'password' ? translations.save : getTitle())}
          </button>
        </form>

        {/* Footer Toggle Actions */}
        {mode === 'login' && (
          <div className="mt-6 text-center text-sm text-slate-500">
            <span>{translations.dontHaveAccount.split('?')[0]}? </span>
            <button 
              onClick={() => setMode('register')} 
              className="text-brand-600 font-semibold hover:underline"
            >
              {translations.register}
            </button>
          </div>
        )}

        {mode === 'register' && (
          <div className="mt-6 text-center text-sm text-slate-500">
            <span>{translations.alreadyHaveAccount.split('?')[0]}? </span>
            <button 
              onClick={() => setMode('login')} 
              className="text-brand-600 font-semibold hover:underline"
            >
              {translations.login}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
