import { useTheme } from "@/hooks/useTheme";



export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  // On déduit l'état du switch depuis le state global
  const isDark = theme === "dark";

  return (
    <label
      className="relative h-6 w-9 cursor-pointer [-webkit-tap-highlight-color:transparent]"
      htmlFor="switch" 
    >
      <input
        className="peer sr-only"
        id="switch"
        type="checkbox"
        checked={isDark} 
        onChange={() => setTheme(isDark ? "light" : "dark")} 
      />

      <span className="absolute inset-0 m-auto h-2 rounded-full bg-stone-400"></span>

      <span className="absolute inset-y-0 start-0 m-auto size-4 rounded-full bg-stone-600 transition-all peer-checked:start-6">
        <span className="absolute inset-0 m-auto size-2 rounded-full bg-stone-300 transition peer-checked:scale-0"></span>
      </span>
    </label>
  );
}
