import {
  BookOpen,
  Satellite,
  Activity,
  Globe2,
} from "lucide-react";

import FeatureCard from "./FeatureCard";

const modules = [
  {
    title: "Learn GNSS",
    description:
      "Interactive lessons covering GPS, Galileo, GLONASS and BeiDou fundamentals.",
    icon: BookOpen,
    color: "bg-indigo-900",
    link: "/learn",
  },
  {
    title: "Satellite Visibility",
    description:
      "Visualize which satellites are visible from a selected location and time.",
    icon: Satellite,
    color: "bg-emerald-700",
    link: "/visibility",
  },
  {
    title: "DOP Analysis",
    description:
      "Analyze GDOP, PDOP, HDOP and VDOP values for positioning quality.",
    icon: Activity,
    color: "bg-amber-600",
    link: "/dop",
  },
  {
    title: "Skyplot",
    description:
      "Display satellites on a skyplot using azimuth and elevation angles.",
    icon: Globe2,
    color: "bg-cyan-700",
    link: "/skyplot",
  },
];

export default function DashboardCards() {
  return (
    <section>

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800">
            GNSS Modules
          </h2>

          <p className="text-slate-500">
            Choose a module to begin exploring.
          </p>

        </div>

      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <FeatureCard
            key={module.title}
            {...module}
          />
        ))}
      </div>

    </section>
  );
}