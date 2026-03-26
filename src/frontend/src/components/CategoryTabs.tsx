const CATEGORIES = [
  "Todos",
  "Bots Discord",
  "Web Scraping",
  "Automações",
  "Scripts de Vendas",
];

interface CategoryTabsProps {
  active: string;
  onChange: (cat: string) => void;
}

export default function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap" data-ocid="category.filter.tab">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
            active === cat
              ? "bg-[#39FF14] text-[#111827] border-[#39FF14] font-bold shadow-neon-glow"
              : "bg-white text-gray-600 border-gray-200 hover:border-[#39FF14] hover:text-[#111827]"
          }`}
          data-ocid="category.tab"
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
