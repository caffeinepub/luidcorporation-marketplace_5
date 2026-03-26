import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { Download, Package, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Record_ } from "../backend.d";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useAllScripts, usePurchasedScripts } from "../hooks/useQueries";

export default function DashboardPage() {
  const { luidId } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"scripts" | "profile">("scripts");

  const { data: purchasedIds, isLoading: loadingPurchased } =
    usePurchasedScripts(luidId);
  const { data: allScripts } = useAllScripts();

  useEffect(() => {
    if (!luidId) navigate({ to: "/login" });
  }, [luidId, navigate]);

  if (!luidId) return null;

  const purchasedScripts: Record_[] = (allScripts ?? []).filter((s) =>
    (purchasedIds ?? []).some((id) => id === s.id),
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-[#111827] text-white py-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-extrabold mb-1">Meu Painel</h1>
            <p className="text-gray-400 text-sm">
              ID Luid:{" "}
              <span className="text-[#39FF14] font-semibold">{luidId}</span>
            </p>
          </div>
        </section>

        <div
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          data-ocid="dashboard.section"
        >
          <div className="flex gap-2 mb-8 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("scripts")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "scripts"
                  ? "border-[#39FF14] text-[#111827]"
                  : "border-transparent text-gray-500 hover:text-[#111827]"
              }`}
              data-ocid="dashboard.tab"
            >
              <Package size={16} /> Meus Scripts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-[#39FF14] text-[#111827]"
                  : "border-transparent text-gray-500 hover:text-[#111827]"
              }`}
              data-ocid="dashboard.tab"
            >
              <User size={16} /> Perfil
            </button>
          </div>

          {activeTab === "scripts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loadingPurchased ? (
                <div className="space-y-4" data-ocid="dashboard.loading_state">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                  ))}
                </div>
              ) : purchasedScripts.length === 0 ? (
                <div
                  className="text-center py-16 text-gray-400"
                  data-ocid="dashboard.empty_state"
                >
                  <Package size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="font-semibold">
                    Você ainda não adquiriu nenhum script.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/marketplace" })}
                    className="mt-4 bg-[#39FF14] text-[#111827] font-bold px-6 py-2.5 rounded-full hover:bg-[#2ee610] transition-colors text-sm"
                    data-ocid="dashboard.primary_button"
                  >
                    Explorar Marketplace
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchasedScripts.map((script, i) => (
                    <div
                      key={script.id.toString()}
                      className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 shadow-card p-5"
                      data-ocid={`dashboard.item.${i + 1}`}
                    >
                      <div>
                        <h3 className="font-bold text-[#111827]">
                          {script.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {script.language} · v{script.version} ·{" "}
                          {script.category}
                        </p>
                      </div>
                      <a
                        href={script.fileUrl}
                        download
                        className="flex items-center gap-2 bg-[#39FF14] text-[#111827] font-bold text-sm px-4 py-2 rounded-full hover:bg-[#2ee610] transition-colors"
                        data-ocid={`dashboard.item.${i + 1}.button`}
                      >
                        <Download size={15} /> Download ZIP
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md"
            >
              <div
                className="bg-white rounded-2xl border border-gray-200 shadow-card p-6"
                data-ocid="dashboard.card"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center">
                    <User size={28} className="text-[#39FF14]" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#111827] text-xl">
                      {luidId}
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Membro LuidCorporation
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">ID Luid</p>
                    <p className="font-semibold text-[#111827]">{luidId}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Scripts Adquiridos
                    </p>
                    <p className="font-semibold text-[#111827]">
                      {purchasedScripts.length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
