import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <AppProvider>
            <ToastProvider>
              <HomePage />
              <ToastContainer />
            </ToastProvider>
          </AppProvider>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;