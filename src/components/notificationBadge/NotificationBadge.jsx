import React from "react";

export default function NotificationBadge() {
  return (
    <div className="absolute -top-1 -right-1 z-10">
      <div className="bg-red-500 text-white text-[12px] font-black h-7 w-7 flex items-center justify-center rounded-full shadow-lg border-2 border-background animate-bounce">
        !
      </div>
    </div>
  );
}
