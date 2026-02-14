export const LIST_ROLES = {
  READ: {
    // Lecture seule
    role: "read",
    can: "Il peut voir la liste.",
  },
  // Peut ajouter/cocher des items
  EDIT: {
    role: "edit",
    can: "Il peut voir la liste, ajouter des éléments, cocher les éléments, supprimer seulement ses éléments",
  },
  // Peut gérer les éléments sans restriction
  MODO: {
    role: "modo",
    can: "Il peut gérer tous les éléments",
  },
};
