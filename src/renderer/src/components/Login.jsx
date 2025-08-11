import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-10">
      {/* Section 1: Image */}
      <div className="w-full max-w-md flex justify-center">
        <img
          src="https://images.unsplash.com/photo-1590080877777-e2c77b94560b?auto=format&fit=crop&w=600&q=80"
          alt="Marble Factory"
          className="rounded-lg shadow-md max-h-64 object-cover"
        />
      </div>

      {/* Section 2: Login Form */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Log In
          </button>
        </form>
      </div>

      {/* Section 3: Extra Info or Button */}
      <div className="w-full max-w-md text-center text-gray-600">
        <p>
          Forgot your password?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
}
