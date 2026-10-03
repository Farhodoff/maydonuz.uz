import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test crash in child component');
};

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('catches render errors and displays fallback UI', () => {
    // Suppress console.error in test output for intentional throw
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Sahifa yuklanmadi')).toBeInTheDocument();
    expect(
      screen.getByText('Iltimos, sahifani yangilab qayta urinib ko‘ring.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Qayta yuklash' })).toBeInTheDocument();

    spy.mockRestore();
  });
});
