// import { useState, useEffect } from "react";

// function InstallPWA() {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [isVisible, setIsVisible] = useState(false); // Pour l'animation d'entrée
//   const isDebug = true;

//   const [isInstalled, setIsInstalled] = useState(
//     () =>
//       typeof window !== "undefined" &&
//       window.matchMedia("(display-mode: standalone)").matches,
//   );

//   useEffect(() => {
//     const handler = (e) => {
//       e.preventDefault();
//       console.log("✅ PWA : Prêt pour installation");
//       setDeferredPrompt(e);
//       // On attend un peu pour déclencher l'animation d'entrée
//       setTimeout(() => setIsVisible(true), 1000);
//     };

//     window.addEventListener("beforeinstallprompt", handler);
//     const mediaQuery = window.matchMedia("(display-mode: standalone)");
//     const trackMode = (e) => setIsInstalled(e.matches);
//     mediaQuery.addEventListener("change", trackMode);

//     return () => {
//       window.removeEventListener("beforeinstallprompt", handler);
//       mediaQuery.removeEventListener("change", trackMode);
//     };
//   }, []);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     if (outcome === "accepted") {
//       setDeferredPrompt(null);
//       setIsVisible(false);
//     }
//   };

//   if (!isDebug && (isInstalled || !deferredPrompt || !isVisible)) return null;
//   if (isDebug && !isVisible) return null;
//   // On ne rend rien si installé, pas de prompt, ou si l'utilisateur a fermé la modale
//   if (isInstalled || !deferredPrompt || !isVisible) return null;

//   return (
//     <div className="fixed inset-0 z-999 flex items-center justify-center p-6 animate-in fade-in duration-500">
//       {/* OVERLAY : Noir profond, flouté */}
//       <div
//         className="absolute inset-0 bg-black/80 backdrop-blur-xl"
//         onClick={() => setIsVisible(false)}
//       />

//       {/* MODALE : Glassmorphism Style */}
//       <div className="relative w-full max-w-sm bg-zinc-900/50 border border-white/10 p-8 rounded-[40px] shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-300">
//         {/* Icone d'App flottante */}
//         <div className="relative mx-auto size-24">
//           <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
//           <div className="relative size-full bg-linear-to-br from-zinc-800 to-black border border-white/10 rounded-3xl flex items-center justify-center text-4xl shadow-2xl">
//             📋
//           </div>
//         </div>

//         <div className="space-y-2">
//           <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
//             Passer en mode App
//           </h2>
//           <p className="text-zinc-400 text-sm font-medium px-4">
//             Installe l'interface sur ton écran d'accueil pour un accès
//             instantané au terrain.
//           </p>
//         </div>

//         <div className="flex flex-col gap-3">
//           <button
//             onClick={handleInstallClick}
//             className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl"
//           >
//             Installer maintenant
//           </button>

//           <button
//             onClick={() => setIsVisible(false)}
//             className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] hover:text-zinc-300 transition-colors"
//           >
//             Ignorer pour le moment
//           </button>
//         </div>

//         {/* Petit indicateur visuel pour rassurer */}
//         <div className="pt-2">
//           <p className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">
//             Garanti sans publicité • Accès Offline
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default InstallPWA;
