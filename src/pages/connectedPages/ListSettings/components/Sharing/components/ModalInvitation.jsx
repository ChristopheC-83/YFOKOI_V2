import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FiUsers, FiChevronRight } from "react-icons/fi";
import Invitations from "./Invitations";

export function ModalInvitation({ list }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-full flex items-center justify-between p-1 rounded-2xl hover:bg-secondary/50 transition-colors group">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <FiUsers className="text-primary" />
            </div>
            <span className="font-bold italic">Inviter un proche</span>
          </div>
          <FiChevronRight className="text-muted-foreground" />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md border-none bg-background p-0 overflow-hidden rounded-[2rem]">
        <Invitations list={list} />
      </DialogContent>
    </Dialog>
  );
}
