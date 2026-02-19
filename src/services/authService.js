import { supabase } from "@/lib/supabase";

export const authService = {
  // Inscription : On envoie le nom au "Cloud" (metadata)
  //     async register(email, password, name) {
  //         console.log(email, name);
  //     const { data, error } = await supabase.auth.signUp({
  //       email,
  //       password,
  //       options: {
  //         data: { display_name: name },
  //       },
  //     });
  //     if (error) throw error;
  //     return data;
  //   },

  async register(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: name },
      },
    });

    if (error) throw error;

    if (data?.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: name,
        email: email,
      });

      if (profileError) {
        console.error("Erreur profil:", profileError.message);
      }
    }

    return data;
  },

  // Connexion
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Déconnexion

  async logout() {
    await supabase.auth.signOut();
    // On nettoiera le store via une action dédiée
  },
};
