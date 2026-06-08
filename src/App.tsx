import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <AppProvider>
            <HomePage />
          </AppProvider>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;