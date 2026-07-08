import {
  BookOpen,
  Satellite,
 Activity,
  Globe,
} from "lucide-react";

const stats = [
  {
    title: "Learning Modules",
    value: "12",
    icon: BookOpen,
  },
  {
    title: "GNSS Systems",
    value: "4",
    icon: Globe,
  },
  {
    title: "Satellite Visibility",
    value: "Live",
    icon: Satellite,
  },
  {
    title: "DOP Analysis",
    value: "Ready",
    icon: Activity,
  },
];

export default function Stats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">

              <div>
                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="text-2xl font-bold mt-2">
                  {item.value}
                </h2>
              </div>

              <div className="bg-indigo-100 p-3 rounded-lg">
                <Icon
                  className="text-indigo-900"
                  size={22}
                />
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}