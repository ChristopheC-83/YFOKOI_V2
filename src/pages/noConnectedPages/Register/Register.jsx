import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import { useUserStore } from "@/store/user/useUserStore";
import { toast } from "sonner";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const formValidated = useMemo(() => {
    const { name, email, password } = formData;

    // Test Email via RegEx
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (
      name.trim().length >= 2 && emailRegex.test(email) && password.length >= 6
    );
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidated) return;

    setLoading(true);
    try {
      const data = await authService.register(
        formData.email,
        formData.password,
        formData.name,
      );
      if (data.user) {
        setUser(data.user);
        toast.success(`Bienvenue à bord, ${formData.name} !`);
        navigate("/lists");
      }
    } catch (err) {
      toast.error(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-[3vh] p-6 bg-background text-foreground animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-sm space-y-8">
        {/* Header Identité */}
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-black tracking-tighter inline-block mb-2 underline-clip">
            YFOKOI
          </h1>
          <h2 className="text-4xl font-black tracking-tighter inline-block mb-6 underline-clip">
            REJOINDRE
          </h2>
          <p className="text-muted-foreground font-medium text-sm">
            Crée ton profil pour synchroniser <br /> tes listes sur tous tes
            appareils.
          </p>
        </div>

        {/* Card Formulaire */}
        <div className="bg-card text-card-foreground p-8 rounded-[2.5rem] shadow-2xl border border-border/70">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">
                Ton Prénom
              </label>
              <input
                type="text"
                required
                placeholder="mon petit nom"
                className="w-full mt-1 p-4 bg-muted/50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-background outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="v@example.com"
                className="w-full mt-1 p-4 bg-muted/50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-background outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-widest ml-1 text-muted-foreground">
                Mot de passe
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full mt-1 p-4 bg-muted/50 rounded-2xl border-2 border-transparent focus:border-orange-500 focus:bg-background outline-none transition-all"
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              disabled={loading || !formValidated}
              className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl  hover:brightness-120 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "CRÉATION..." : "C'EST PARTI !"}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link
              to="/login"
              className="font-bold text-foreground underline decoration-clip-1 underline-offset-4"
            >
              Se connecter
            </Link>
          </p>
          <Link
            to="/"
            className="block text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
