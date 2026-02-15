export function sortItems(items) {
  return [...items].sort((a, b) => {
    // 1. D'abord les non-cochés
    if (a.checked !== b.checked) return a.checked ? 1 : -1;
    // 2. Puis alphabétique sur 'label'
    return (a.label || "").localeCompare(b.label || "");
  });
}
