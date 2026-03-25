import React from 'react';
import { useLanguage } from '../hooks/useLanguage';

const DefaultFallback = ({ error, resetError }) => {
  const { t } = useLanguage();
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>{t('error.something_went_wrong')}</h2>
      <p>{error?.message}</p>
      <button onClick={resetError}>
        {t('error.try_again')}
      </button>
    </div>
  );
};

/**
 * Error Boundary component that catches rendering errors
 * and displays a fallback UI instead of crashing the app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <DefaultFallback 
            error={this.state.error} 
            resetError={() => this.setState({ hasError: false, error: null })} 
          />
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
