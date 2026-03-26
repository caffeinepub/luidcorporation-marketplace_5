import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import type { Record_ } from "../backend.d";

const CATEGORY_COLORS: Record<string, string> = {
  "Bots Discord": "bg-indigo-100 text-indigo-700",
  "Web Scraping": "bg-blue-100 text-blue-700",
  Automações: "bg-purple-100 text-purple-700",
  "Scripts de Vendas": "bg-orange-100 text-orange-700",
};

function LanguageIcon({ language }: { language: string }) {
  if (language.toLowerCase().includes("python")) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#3776AB] flex items-center justify-center shadow-sm">
        <span className="text-white text-xs font-bold">PY</span>
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-[#F7DF1E] flex items-center justify-center shadow-sm">
      <span className="text-[#111827] text-xs font-bold">JS</span>
    </div>
  );
}

interface ScriptCardProps {
  script: Record_;
  index?: number;
}

export default function ScriptCard({ script, index = 1 }: ScriptCardProps) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 shadow-card p-5 flex flex-col gap-4 hover:shadow-lg hover:border-[#39FF14]/40 transition-all duration-200 group"
      data-ocid={`scripts.item.${index}`}
    >
      <div className="flex items-start justify-between gap-3">
        <LanguageIcon language={script.language} />
        <Badge
          className={`text-xs px-2 py-0.5 font-medium rounded-full border-0 ${CATEGORY_COLORS[script.category] ?? "bg-gray-100 text-gray-600"}`}
        >
          {script.category}
        </Badge>
      </div>

      <div className="flex-1">
        <h3 className="font-bold text-[#111827] text-base leading-tight mb-1 group-hover:text-[#111827]">
          {script.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {script.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="bg-[#39FF14] text-[#111827] font-bold text-sm px-3 py-1 rounded-full">
          R$ {script.price.toFixed(2)}
        </span>
        <span className="text-xs text-gray-400 font-medium">
          {script.language} • v{script.version}
        </span>
      </div>

      <Link
        to="/script/$id"
        params={{ id: script.id.toString() }}
        className="w-full block text-center bg-[#111827] text-white font-semibold text-sm px-4 py-2.5 rounded-full hover:bg-[#1f2937] transition-colors"
        data-ocid={`scripts.item.${index}.button`}
      >
        Ver Detalhes
      </Link>
    </div>
  );
}
