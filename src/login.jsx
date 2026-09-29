import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";

export default function Login() {
  const { authenticate } = useUser();
  const [step, setStep] = useState("email");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step === "email") {
      setStep("password");
      setError("");
      return;
    }

    setBusy(true);
    setError("");
    try {
      await authenticate(step === "register" ? "register" : "login", formData);
      navigate("/profile");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="page login-page">
      <section className="page-intro">
        <div>
          <p className="eyebrow">TWINIE TREASURES</p>
          <h1>{step === "register" ? "Create account" : "Sign in"}</h1>
          <p>{step === "register" ? "A few details and your account is ready." : "Access your orders, delivery details, and saved frames."}</p>
        </div>
      </section>

      <section className="login-card">
        <form className="login-form" onSubmit={handleSubmit}>
          {step === "email" && <>
            <label>Email address<input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" autoComplete="email" autoFocus required /></label>
            <button type="submit" className="button button-yellow" disabled={busy}>Continue</button>
            <p className="login-terms">By continuing, you agree to Twinie Treasures’ Conditions of Use and Privacy Notice.</p>
          </>}

          {step === "password" && <>
            <div className="login-identity"><span>{formData.email}</span><button type="button" onClick={() => { setStep("email"); setError(""); }}>Change</button></div>
            <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" autoFocus required /></label>
            <button type="submit" className="button button-yellow" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
            <a className="text-button" href="mailto:support@twinietreasures.com?subject=Password%20help">Forgot your password?</a>
          </>}

          {step === "register" && <>
            <label>Your name<input name="name" value={formData.name} onChange={handleChange} autoComplete="name" autoFocus minLength={2} required /></label>
            <label>Email address<input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Mobile number<input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 555 123 4567" autoComplete="tel" minLength={7} maxLength={24} required /></label>
            <label>Password<input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required /></label>
            <p className="login-terms">Passwords must be at least 8 characters.</p>
            <button type="submit" className="button button-yellow" disabled={busy}>{busy ? "Creating account…" : "Create your account"}</button>
            <button type="button" className="text-button" onClick={() => { setStep("email"); setError(""); }}>Back to sign in</button>
          </>}

          {error && <p className="form-error" role="alert">{error}</p>}
        </form>
        {step !== "register" && <div className="new-customer"><span>New to Twinie Treasures?</span><button type="button" className="button button-outline" onClick={() => { setStep("register"); setError(""); }}>Create your account</button></div>}
      </section>
    </main>
  );
}
