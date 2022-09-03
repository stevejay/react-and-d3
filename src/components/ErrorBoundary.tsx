import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center w-full mt-24">
          <h1 className="text-[72px] text-center">
            <span className="inline-block mb-2 font-semibold text-slate-200">Hmm&hellip;</span>
            <br />
            <span className="inline-block text-2xl text-transparent bg-gradient-to-r from-blue-500 to-green-700 bg-clip-text">
              Something went wrong
            </span>
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}
