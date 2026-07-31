import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error in app:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="font-display text-3xl text-ivory">Something went wrong</h1>
          <p className="font-body text-sm text-ivory/50">
            Please refresh the page. If the problem continues, your data is still safe in this browser.
          </p>
          <button type="button" onClick={() => window.location.assign('/')} className="btn-gold">
            Back to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
