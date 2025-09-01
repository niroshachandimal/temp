import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary Caught:", error, errorInfo);
  }

  refreshPage = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="flex justify-center items-center h-[80vh]">
          <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div className="mx-auto max-w-screen-sm text-center">
              <p className="mb-4 text-3xl tracking-tight font-bold md:text-4xl text-red-500 ">
                Something's went wrong.
              </p>
              <p className="mb-4 text-lg font-light text-gray-500 ">
                Please go to another page and{" "}
                <span className="underline">refresh</span> or contact support.
              </p>
              <button
                onClick={this.refreshPage}
                className="inline-flex text-white bg-primary hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  my-4"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
