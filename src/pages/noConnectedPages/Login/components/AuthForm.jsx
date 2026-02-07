import { useMagicLink } from "@/hooks/auth/useMagicLink";
import { useState } from "react";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const { sendLink, loading, sent } = useMagicLink();

  function handleSubmit(event) {
    event.preventDefault();
    if (email) {
      sendLink(email);
    }
  }

  if (sent) {
    return (
      <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
        <p className="text-green-800 font-medium">Lien envoyé ! 📧</p>
        <p className="text-green-600 text-sm mt-1">
          Check tes mails pour te connecter.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Ton adresse email
        </label>
        <input
          id="email"
          type="email"
          required
          className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          placeholder="ex: chouchou@mail.com"
          value={email}
          onChange={function (e) {
            setEmail(e.target.value);
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? "Traitement..." : "Recevoir mon lien"}
      </button>
    </form>
  );
}
