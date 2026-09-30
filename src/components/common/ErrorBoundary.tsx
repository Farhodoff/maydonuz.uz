import React from 'react';
import { reportReactError } from '../../utils/errorMonitoring';

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    reportReactError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sahifa yuklanmadi</h1>
            <p className="mt-2 text-sm text-slate-600">Iltimos, sahifani yangilab qayta urinib ko‘ring.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Qayta yuklash
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
