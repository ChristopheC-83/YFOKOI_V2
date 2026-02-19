import React from "react";
import { FiPlus } from "react-icons/fi";
import { ModalJoinList } from "../ModalJoinList/ModalJoinList";
import useAppStore from "@/store/useAppStore";

export default function CreateListButton({ textButton, onClick }) {

  const loadLists = useAppStore((state) => state.loadLists);

  return (
    <div className="flex justify-between gap-3 w-full">
      <button
        onClick={onClick}
        className="w-1/2 bg-primary text-primary-foreground font-black justify-center py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer mb-2 text-md whitespace-nowrap"
      >
        <FiPlus className="size-5" />
        {textButton.toUpperCase()}
      </button>
      <ModalJoinList refreshLists={loadLists} />
    </div>
  );
}
