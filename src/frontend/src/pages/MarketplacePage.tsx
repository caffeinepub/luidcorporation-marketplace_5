import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useState } from "react";
import CategoryTabs from "../components/CategoryTabs";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ScriptCard from "../components/ScriptCard";
import { useAllScripts } from "../hooks/useQueries";

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { data: scripts, isLoading } = useAllScripts();

  const filtered =
    !scripts || scripts.length === 0
      ? []
      : activeCategory === "Todos"
        ? scripts
        : scripts.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#111827] text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-extrabold mb-2">Marketplace</h1>
            <p className="text-gray-400">
              Explore nossa coleção de scripts profissionais
            </p>
          </div>
        </section>

        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
          data-ocid="marketplace.section"
        >
          <div className="mb-8">
            <CategoryTabs
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="marketplace.loading_state"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="text-center py-20 text-gray-400"
              data-ocid="marketplace.empty_state"
            >
              <p className="text-lg font-semibold mb-2">
                Nenhum script disponível ainda.
              </p>
              <p className="text-sm">
                O administrador irá adicionar scripts em breve.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filtered.map((script, i) => (
                <ScriptCard
                  key={script.id.toString()}
                  script={script}
                  index={i + 1}
                />
              ))}
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
