import { Bell, UserCircle2 } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">

      <div>
        <h1 className="text-lg font-bold text-slate-800">
          GNSS Virtual Laboratory
        </h1>
      </div>

      <div className="flex items-center gap-5">

        <Bell
          className="text-slate-600 cursor-pointer"
          size={18}
        />

        <div className="flex items-center gap-2">

          <UserCircle2
            size={28}
            className="text-blue-600"
          />

          <div>

            <p className="text-sm font-semibold">
              Omaima
            </p>

            <p className="text-xs text-slate-500">
              Student
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}