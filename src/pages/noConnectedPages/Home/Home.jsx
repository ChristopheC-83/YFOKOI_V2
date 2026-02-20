import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-start p-6 overflow-hidden">
      {/* Background Decor */}

      <main className="max-w-md w-full text-center space-y-12">
        {/* Logo/Icon */}
        <div className="relative mx-auto w-48 h-36">
          <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
          <div className="relative size-full bg-linear-to-br from-zinc-800 to-black border border-white/10 rounded-3xl flex items-center justify-center text-5xl shadow-2xl overflow-hidden">
            <span className="animate-in slide-in-from-left duration-700">
              📋
            </span>{" "}
            <span className="animate-in slide-in-from-right duration-700">
              🛒
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-[0.8] animate-in slide-in-from-bottom duration-700 ">
            YFOKOI <br />
            <span className="text-primary">V2</span>
          </h1>
          <p className="text-zinc-400 font-medium text-lg leading-tight px-6">
            L'assistant de terrain qui transforme le chaos des courses en
            expérience collaborative.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl  animate-in slide-in-from-left duration-700 ">
            <span className="text-primary text-xl font-bold italic">01</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Shared
            </p>
            <p className="text-sm font-bold">Partages ciblés</p>
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl animate-in slide-in-from-right duration-700">
            <span className="text-primary text-xl font-bold italic">02</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Autorisations
            </p>
            <p className="text-sm font-bold">
              Différents niveaux d'accès possibles
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl animate-in slide-in-from-left duration-700">
            <span className="text-primary text-xl font-bold italic">03</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Auto-apprentissage
            </p>
            <p className="text-sm font-bold">
              Votre dictionnaire grandit tout seul
            </p>
          </div>
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl animate-in slide-in-from-right duration-700">
            <span className="text-primary text-xl font-bold italic">04</span>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ">
              Facile
            </p>
            <p className="text-sm font-bold">
              Utilisation simple et accessible
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col gap-4 pt-4">
          <Link
            to="/login"
            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-2 animate-in slide-in-from-bottom duration-700"
          >
            Commencer les partages !
          </Link>
          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">
            Accès gratuit • PWA Ready • No Ads
          </p>
        </div>
      </main>
    </div>
  );
}
