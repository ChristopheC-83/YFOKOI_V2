import { useMagicLink } from "@/hooks/auth/useMagicLink";
import { useState } from "react";

export function MagicLinkForm() {
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
      <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl text-center animate-in fade-in zoom-in duration-300">
        <span className="text-3xl">📧</span>
        <h3 className="mt-2 font-bold text-indigo-900">
          Vérifie ta boîte mail
        </h3>
        <p className="text-sm text-indigo-700 mt-1">
          On t'a envoyé un lien magique sur <br />
          <span className="font-semibold">{email}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="ton@email.com"
          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-2xl outline-none transition-all text-lg"
          value={email}
          onChange={function (e) {
            setEmail(e.target.value);
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Envoi en cours..." : "Recevoir mon lien magique"}
      </button>
    </form>
  );
}
