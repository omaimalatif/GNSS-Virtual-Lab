import {
  LayoutDashboard,
  BookOpen,
  Satellite,
  Activity,
  Globe2,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Learn GNSS",
    path: "/learn",
    icon: BookOpen,
  },
  {
    name: "Visibility",
    path: "/visibility",
    icon: Satellite,
  },
  {
    name: "DOP Analysis",
    path: "/dop",
    icon: Activity,
  },
  {
    name: "Skyplot",
    path: "/skyplot",
    icon: Globe2,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">

      <div className="p-6 border-b border-slate-700">

        <h1 className="text-xl font-bold">
          GNSS Lab
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Virtual Laboratory
        </p>

      </div>

      <nav className="flex-1 p-4">

        {links.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl mb-2 transition ${
                  isActive
                    ? "bg-indigo-900"
                    : "hover:bg-slate-800"
                }`
              }
            >

              <Icon size={18} />

              {item.name}

            </NavLink>

          );

        })}

      </nav>

      <div className="p-4 border-t border-slate-700">

        <button className="flex items-center gap-3 w-full hover:bg-slate-800 rounded-xl px-4 py-3">

          <Settings size={20} />

          Settings

        </button>

      </div>

    </aside>
  );
}
