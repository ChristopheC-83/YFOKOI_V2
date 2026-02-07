import { useMagicLink } from "@/hooks/auth/useMagicLink";
import { useState } from "react";

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const { sendLink, loading, sent } = useMagicLink();

  function handleSubmit(e) {
    e.preventDefault();
    if (email) sendLink(email);
  }

  if (sent) {
    return (
      <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✉️</span>
        </div>
        <h3 className="text-xl font-bold tracking-tight">
          Vérifie tes mails !
        </h3>
        <p className="text-sm text-muted-foreground">
          Un lien magique vient de décoller vers <br />
          <span className="text-foreground font-semibold">{email}</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
        >
          Adresse Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="papa@famille.com"
          required
          className="w-full px-5 py-4 bg-input border border-border rounded-2xl outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl  hover:brightness-120 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "PRÉPARATION..." : "CONNEXION FLASH"}
      </button>
    </form>
  );
}
