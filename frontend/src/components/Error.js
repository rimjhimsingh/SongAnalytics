/*
  Global Error Boundary Component
  -------------------------------
  This component is rendered by React Router whenever an exception is thrown
  during rendering, loading, or data fetching in any child route.

  It acts as a "Safety Net" that prevents the entire app from crashing (White Screen of Death)
  and instead provides a user-friendly feedback UI.
*/
import React from "react";
import { useRouteError } from "react-router-dom";

const Error = () => {

    const error = useRouteError();

    console.error(error);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-vivpro-bg text-vivpro-navy p-6 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Oops!</h1>
                <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>

                <p className="text-gray-600 mb-6">
                    We encountered an unexpected error. Please try refreshing the page.
                </p>


                <div className="bg-gray-100 p-4 rounded text-sm font-mono text-red-700">
                    <p>
                        {error.status ? `${error.status}: ` : ""}
                        {error.statusText || error.message || "Unknown Error"}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Error;