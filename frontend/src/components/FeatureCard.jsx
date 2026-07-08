import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  color,
  link,
}) {
  return (
    <Link
      to={link}
      className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon className="text-white" size={28} />
      </div>

      <h3 className="mt-5 text-xl font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-slate-500 text-sm leading-6">
        {description}
      </p>

      <div className="mt-6 flex items-center text-indigo-900 font-medium">
        Open Module

        <ArrowRight
          className="ml-2 group-hover:translate-x-2 transition"
          size={18}
        />
      </div>
    </Link>
  );
}