import { authService } from "@/services/authService";
import { useUserStore } from "@/store/user/useUserStore";
import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link est mieux que <a>
import { toast } from "sonner";

export function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const formValidated = useMemo(() => {
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && password.length >= 6;
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidated) return;

    setLoading(true);
    try {
      const data = await authService.login(formData.email, formData.password);
      // console.log("   data", data);

      if (data.user) {
        setUser(data.user);
        toast.success("Content de vous revoir !");
        navigate("/lists");
      }
    } catch (err) {
      toast.error(err.message || "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-[15vh] p-6 bg-background text-foreground animate-in slide-in-from-right duration-500">
      <div className="w-full max-w-sm space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-black tracking-tighter underline-clip inline-block mb-4">
            YFOKOI
          </h1>
          <p className="text-muted-foreground font-medium text-sm italic">
            L'app qui n'oublie rien.
          </p>
          <p className="text-muted-foreground font-medium text-sm italic">
            Pour que tu puisses tout oublier !
          </p>
        </div>

        <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-2xl border border-border/70">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-foreground outline-none transition-all"
            />
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-foreground outline-none transition-all"
            />

            <button
              type="submit"
              disabled={loading || !formValidated}
              className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl  hover:brightness-120 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Connexion..." : "C'est parti"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/80 italic">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="underline font-bold hover:text-foreground"
          >
            Inscris-toi ici
          </Link>
        </p>
      </div>
    </div>
  );
}
