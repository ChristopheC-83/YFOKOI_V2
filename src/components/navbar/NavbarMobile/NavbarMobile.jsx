/* eslint-disable no-unused-vars */

import { NavLink, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/useUserStore";
import { USERS_LINKS, VISITORS_LINKS } from "@/config/navigation";

export default function NavbarMobile({ user }) {
  const { isAuth, logout } = useUserStore();
  const navigate = useNavigate();

  let links = [];

  if (!user) {
    links = VISITORS_LINKS;
  }
  if (user) {
    {
      links = USERS_LINKS;
    }
  }

  return (
    <nav className="flex justify-around pt-2 pb-1.5">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.path}
            to={link.path}
            className="flex flex-col items-center w-[30%]"
          >
            <Icon className="size-6" />
            <span className="text-center text-sm text-nowrap">
              {link.label}
            </span>
          </NavLink>
        );
      })}

     
    </nav>
  );
}
