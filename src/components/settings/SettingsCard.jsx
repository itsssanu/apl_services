import { ChevronRight } from "lucide-react";

export default function SettingsCard({
  icon: Icon,
  title,
  description,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        flex
        items-center
        justify-between
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        border
        border-gray-100
        hover:border-blue-200
        hover:shadow-md
        transition-all
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-slate-700" />
        </div>

        <div className="text-left">
          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>

          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}