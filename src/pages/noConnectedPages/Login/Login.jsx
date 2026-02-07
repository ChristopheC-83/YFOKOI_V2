import { MagicLinkForm } from "./components/MagicLinkForm";



export function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-sm space-y-10">
        {/* Header avec ton utilitaire de dégradé personnalisé */}
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-black tracking-tighter underline-clip inline-block">
            YFOKOI
          </h1>
          <p className="text-muted-foreground font-medium text-sm">
            L'app qui n'oublie rien, <br />
            pour que tu puisses tout oublier.
          </p>
        </div>

        {/* Le conteneur du formulaire utilise tes variables de carte */}
        <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-2xl border border-border/50">
          <MagicLinkForm />
        </div>

        <p className="text-center text-xs text-muted-foreground/60 leading-relaxed italic">
          Entrez votre email, cliquez sur le lien reçu.
          <br />
          Pas de mot de passe, pas de prise de tête.
        </p>
      </div>
    </div>
  );
}
