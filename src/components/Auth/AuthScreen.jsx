"use client";

import { useEffect, useState } from "react";
import Button from "../UI/Button";
import Input from "../UI/Input";

function AuthTabs({ mode, onChange }) {
  return (
    <div className="auth-tabs">
      <button
        className={`auth-tabs__item ${mode === "login" ? "is-active" : ""}`}
        onClick={() => onChange("login")}
      >
        Login
      </button>
      <button
        className={`auth-tabs__item ${mode === "register" ? "is-active" : ""}`}
        onClick={() => onChange("register")}
      >
        Sign up
      </button>
    </div>
  );
}

export default function AuthScreen({
  mode,
  pendingEmail,
  onModeChange,
  onRegister,
  onLogin,
  onVerifyOtp,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: pendingEmail || "",
    password: "",
    otp: "",
  });

  useEffect(() => {
    if (pendingEmail) {
      setForm((current) => ({ ...current, email: pendingEmail }));
    }
  }, [pendingEmail]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await onRegister({
          name: form.name,
          email: form.email,
          password: form.password,
        });
        setForm((current) => ({ ...current, otp: "" }));
      } else if (mode === "login") {
        await onLogin({
          email: form.email,
          password: form.password,
        });
      } else {
        await onVerifyOtp({
          email: form.email,
          otp: form.otp,
        });
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__hero">
          <span className="auth-card__eyebrow">Smart Study Planner</span>
          <h1>Focus on the work, not the sprawl.</h1>
          <p>
            Sign in to manage your study plan, sync tasks to MongoDB, and keep admin
            oversight in one place.
          </p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode !== "verify" ? <AuthTabs mode={mode} onChange={onModeChange} /> : null}
          {mode === "register" ? (
            <>
              <label>
                <span>Name</span>
                <Input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </label>
              <label>
                <span>Email</span>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
              <label>
                <span>Password</span>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
              </label>
            </>
          ) : null}
          {mode === "login" ? (
            <>
              <label>
                <span>Email</span>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
              <label>
                <span>Password</span>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
              </label>
            </>
          ) : null}
          {mode === "verify" ? (
            <>
              <div className="auth-verify">
                <h2>Enter the OTP sent to your email</h2>
                <p>{pendingEmail}</p>
              </div>
              <label>
                <span>Email</span>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
              <label>
                <span>OTP</span>
                <Input
                  value={form.otp}
                  onChange={(event) => setForm({ ...form, otp: event.target.value })}
                />
              </label>
            </>
          ) : null}
          {error ? <p className="form-error">{error}</p> : null}
          <Button type="submit" disabled={loading}>
            {loading
              ? "Please wait"
              : mode === "register"
                ? "Send OTP"
                : mode === "login"
                  ? "Login"
                  : "Verify and continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
