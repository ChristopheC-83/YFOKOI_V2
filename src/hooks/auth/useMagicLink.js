import { supabase } from "@/lib/supabase";
import { useState } from "react";

export function useMagicLink() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function sendLink(email) {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // L'URL où l'utilisateur revient après avoir cliqué
        emailRedirectTo: window.location.origin,
      },
    });

    if (!error) {
      setSent(true);
    }

    setLoading(false);
    return { error };
  }

  return { sendLink, loading, sent };
}
