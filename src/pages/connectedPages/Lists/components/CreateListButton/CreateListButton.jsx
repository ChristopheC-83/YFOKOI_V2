import React from "react";
import { FiPlus } from "react-icons/fi";
import { ModalJoinList } from "../ModalJoinList/ModalJoinList";
import useListStore from "@/store/lists/useListStore";

export default function CreateListButton({ textButton, onClick }) {

  const loadLists = useListStore((state) => state.loadLists);

  return (
    <div className="flex gap-3">
      <button
        onClick={onClick}
        className="w-2/3 bg-primary text-primary-foreground font-black px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer mb-2 text-md"
      >
        <FiPlus className="size-8" />
        {textButton.toUpperCase()}
      </button>
      <ModalJoinList refreshLists={loadLists} />
    </div>
  );
}
