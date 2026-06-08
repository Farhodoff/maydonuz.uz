import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <HomePage />
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;