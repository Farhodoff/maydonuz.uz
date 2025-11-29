import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppProvider } from './contexts/AppContext';
import HomePage from './pages/HomePage';

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <HomePage />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;