import { useState } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: null, text: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setMessage({ type: "success", text: "Logged in successfully!" });
      // Store token if needed
      if (data.token) {
        localStorage.setItem("eventhive_token", data.token);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4">
        <div className="grid w-full gap-8 rounded-3xl bg-white p-8 shadow-xl md:grid-cols-2 md:p-12">
          <div className="space-y-5 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">Welcome back to EventHive</h1>
            <p className="text-slate-500">
              Log in to discover campus events, track your RSVPs, and stay connected with your
              favorite clubs.
            </p>
            <div className="hidden rounded-3xl bg-slate-50 p-6 md:block">
              <h2 className="text-lg font-semibold text-slate-800">Why students love EventHive</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>• Personalized event recommendations across colleges.</li>
                <li>• Save events and get reminders before they begin.</li>
                <li>• Explore what&apos;s trending in student communities.</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-inner">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {message.text && (
              <div
                className={`rounded-lg px-4 py-2 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-500 px-4 py-2 font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-indigo-500 hover:text-indigo-600">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

