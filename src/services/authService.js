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
    // 1. Authentification stricte
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) throw authError;
    // console.log("   authData", authData);
    // 2. Récupération de la Source de Vérité (Profiles)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Erreur de récupération du profil:", profileError.message);
      // On ne bloque pas la connexion, mais on log l'erreur
    }

    // 3. On construit l'objet utilisateur "Augmenté"
    // On place display_name à la racine pour un accès direct
    const cleanUser = {
      ...authData.user,
      display_name:
        profile?.display_name ||
        authData.user.user_metadata?.display_name ||
        "Anonyme",
    };
    // console.log("cleanUser :", cleanUser);
    // On retourne un objet structuré comme attendu par le composant
    return { user: cleanUser };
  },

  // Déconnexion

  async logout() {
    await supabase.auth.signOut();
    // On nettoiera le store via une action dédiée
  },
};
