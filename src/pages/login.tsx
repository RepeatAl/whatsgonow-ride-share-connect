import { useState } from "react";
import { supabase } from "@/lib/supabaseclient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { error } = isSignup
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">
        {isSignup ? "Registrieren" : "Login"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          {isSignup ? "Registrieren" : "Einloggen"}
        </button>
      </form>

      <button
        onClick={() => setIsSignup(!isSignup)}
        className="text-sm mt-4 underline text-blue-600"
      >
        {isSignup ? "Schon registriert? Login" : "Noch kein Konto? Jetzt registrieren"}
      </button>
    </div>
  );
};

export default Login;
