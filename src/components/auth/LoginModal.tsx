import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useApp } from '../../contexts/AppContext';

const LoginModal: React.FC = () => {
  const { translations } = useLanguage();
  const { isModalOpen, closeModal } = useApp();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<{ success: boolean; message: string } | null>(null);

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginStatus(null);

    try {
      // Simulate API verification
      if (verificationCode === '123456') {
        setLoginStatus({
          success: true,
          message: translations.loginSuccess,
        });
        
        setTimeout(() => {
          closeModal();
          setVerificationCode('');
          setLoginStatus(null);
        }, 1500);
      } else {
        setLoginStatus({
          success: false,
          message: translations.loginError,
        });
      }
    } catch {
      setLoginStatus({
        success: false,
        message: translations.loginError,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kirish</h3>
              <p className="text-gray-600 mb-6">Telegram raqamingiz orqali tizimga kiring</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">1.</span>
                  <span>Telegram botga kiring:</span>
                  <a 
                    href="https://t.me/maydonreg_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700"
                  >
                    @maydonreg_bot
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">2.</span>
                  <span>Bot sizga tasdiqlash kodi yuboradi</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-green-600">3.</span>
                  <span>Kodni pastdagi oynaga kiriting</span>
                </div>
              </div>

              {loginStatus && (
                <div className={`mb-4 p-3 rounded-md ${loginStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {loginStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Tasdiqlash kodi"
                    className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-center text-lg tracking-wider"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                      <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Tasdiqlash'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;