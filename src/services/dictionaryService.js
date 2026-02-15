const STORAGE_KEY = "shopping_dict";

export const dictionaryService = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  },

  set: (words) => {
    if (!Array.isArray(words)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
  },


  add(word) {
    if (!word || word.trim().length < 2) return;
    const dict = this.get();
    const cleanWord = word.trim().toLowerCase();

    if (!dict.includes(cleanWord)) {
      const newDict = [cleanWord, ...dict].slice(0, 500); // On garde les 500 derniers
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDict));
    }
  },

  search(query) {
    if (!query || query.trim().length < 1) return [];
    const dict = this.get();
    const q = query.toLowerCase().trim();

    const startsWith = dict.filter((item) => item.startsWith(q));
    const contains = dict.filter(
      (item) => item.includes(q) && !item.startsWith(q),
    );

    return [...startsWith, ...contains].slice(0, 5);
  },

  clear: () => {
    localStorage.removeItem('shopping_dict');
  }
};
