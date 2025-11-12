import { useState } from "react";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage({ type: "success", text: "Account created! You can now log in." });
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
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-white">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4">
        <div className="grid w-full gap-8 rounded-3xl bg-white p-8 shadow-xl md:grid-cols-2 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-inner">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aditi Sharma"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
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
              {loading ? "Creating account..." : "Create account"}
            </button>

            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-indigo-500 hover:text-indigo-600">
                Log in
              </Link>
            </p>
          </form>

          <div className="space-y-5 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">Join EventHive today</h1>
            <p className="text-slate-500">
              Find events you&apos;ll love, meet students from across campuses, and grow your club&apos;s
              reach with EventHive.
            </p>
            <div className="hidden rounded-3xl bg-slate-50 p-6 md:block">
              <h2 className="text-lg font-semibold text-slate-800">What you get</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-500">
                <li>• Tailored event suggestions based on your interests.</li>
                <li>• Save events and manage your schedule in one place.</li>
                <li>• Exclusive access to inter-college communities.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

