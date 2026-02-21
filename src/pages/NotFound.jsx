import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h1 className="text-6xl font-black text-primary mb-4">404</h1>
      <p className="text-xl font-medium mb-8">
        Oups ! Cette liste (ou cette page) n'existe pas ou a été supprimée.
      </p>

      <button
        onClick={() => navigate("/")}
        className="px-8 py-3 bg-primary text-white rounded-full font-bold active:scale-95 transition-transform"
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
