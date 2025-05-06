import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './dashboard.css';

// ErrorBoundary for global error catching
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32 }}>
          <h2>Something went wrong.</h2>
          <pre style={{ color: 'red' }}>{this.state.error && this.state.error.toString()}</pre>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Add wp-admin CSS class to body for compatibility with WP admin styles
document.body.classList.add('wp-admin', 'wp-core-ui');

document.addEventListener('DOMContentLoaded', function () {
    const root = ReactDOM.createRoot(document.getElementById('cookiebot-dashboard-root'));
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>
    );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
reportWebVitals(); 