import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('React Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#050816', color: '#ff4444', padding: '40px', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ color: '#00f3ff', marginBottom: '20px' }}>⚠️ VyomVeda OrbitX — Render Error</h1>
          <pre style={{ background: '#0a0a2e', padding: '20px', borderRadius: '8px', border: '1px solid #ff4444', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
