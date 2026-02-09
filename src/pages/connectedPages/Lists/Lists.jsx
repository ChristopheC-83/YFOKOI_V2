/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import CreateListModal from "./components/CreateListModal/CreateListModal";
import ListCard from "./components/ListCard/ListCard";
import { useNavigate } from "react-router-dom";
import HeaderList from "./components/HeaderList/HeaderList";
import CreateListButton from "./components/CreateListButton/CreateListButton";
import NoListFrame from "./components/NoListFrame/NoListFrame";
import useListStore from "@/store/lists/useListStore";

export default function Lists() {
  
  const { lists, loadLists, loading } = useListStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

 


  useEffect(() => {
    loadLists(); // On charge les data au montage
  }, []);

  const listsLength = lists?.length || 0;

  function handleListClick(listId) {
    navigate(`/list/${listId}`);
  }

  return (
    <div className="max-w-md w-full mx-auto py-8 animate-in fade-in duration-700 slide-in-from-right ">
      {/* HEADER : L'identité visuelle */}
      <HeaderList listsLength={listsLength} />

      {/* BODY : Gestion des états */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : lists.length === 0 ? (
        /* Pas encore de liste ? */

        <NoListFrame onClick={() => setIsModalOpen(true)} />
      ) : (
        /* Tes listes + création */
        <div className="w-full flex flex-col gap-3">
          <CreateListButton
            textButton={"Créer une nouvelle liste"}
            onClick={() => setIsModalOpen(true)}
          />

          {lists.map((list) => (
            <ListCard key={list.id} list={list} onClick={handleListClick} />
          ))}
        </div>
      )}
      <CreateListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
