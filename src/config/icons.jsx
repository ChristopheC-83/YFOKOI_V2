import {
  FiShoppingCart,
  FiShoppingBag,
  FiCoffee,
  FiBriefcase,
  FiHome,
  FiHeart,
  FiPackage,
  FiList,
} from "react-icons/fi";
import { PiForkKnifeBold } from "react-icons/pi";


export const AVAILABLE_ICONS = [
  { id: "FiShoppingCart", icon: <FiShoppingCart />, label: "Courses" },
  { id: "FiShoppingBag", icon: <FiShoppingBag />, label: "Shopping" },
  { id: "PiForkKnifeBold ", icon: <PiForkKnifeBold />, label: "Repas" },
  { id: "FiBriefcase", icon: <FiBriefcase />, label: "Boulot" },
  { id: "FiHome", icon: <FiHome />, label: "Maison" },
  { id: "FiHeart", icon: <FiHeart />, label: "Favoris" },
  { id: "FiPackage", icon: <FiPackage />, label: "Stock" },
  { id: "FiList", icon: <FiList />, label: "Divers" },
];

/**
 * Helper pour récupérer l'icône React à partir de son ID (string) stocké en BDD
 */
export const getIconById = (id) => {
  const iconObj = AVAILABLE_ICONS.find((item) => item.id === id);
  return iconObj ? iconObj.icon : <FiList />; // Fallback sur FiList
};
