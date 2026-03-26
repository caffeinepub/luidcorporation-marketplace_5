import { Link } from "@tanstack/react-router";
import { Download, Shield, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Record_ } from "../backend.d";
import CategoryTabs from "../components/CategoryTabs";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ScriptCard from "../components/ScriptCard";
import { useAllScripts } from "../hooks/useQueries";

const FALLBACK_SCRIPTS: Record_[] = [
  {
    id: 1n,
    title: "Discord Bot Premium",
    description:
      "Bot completo para Discord com moderação, músicas, comandos customizados e integração com APIs externas.",
    language: "Python",
    version: "2.4.1",
    category: "Bots Discord",
    price: 149.9,
    fileUrl: "#",
  },
  {
    id: 2n,
    title: "Web Scraper Pro",
    description:
      "Extração automática de dados de qualquer site. Suporte a JavaScript, proxies rotativos e exportação CSV/JSON.",
    language: "Python",
    version: "1.8.0",
    category: "Web Scraping",
    price: 89.9,
    fileUrl: "#",
  },
  {
    id: 3n,
    title: "Auto Sales Bot",
    description:
      "Automação completa de funil de vendas no WhatsApp e Instagram. CRM integrado e relatórios em tempo real.",
    language: "JavaScript",
    version: "3.1.2",
    category: "Scripts de Vendas",
    price: 199.9,
    fileUrl: "#",
  },
  {
    id: 4n,
    title: "Task Automator",
    description:
      "Automatize tarefas repetitivas no seu computador ou servidor. Agendamento, notificações e logs detalhados.",
    language: "Python",
    version: "1.2.5",
    category: "Automações",
    price: 69.9,
    fileUrl: "#",
  },
];

const FEATURES = [
  {
    icon: <Zap size={24} className="text-[#39FF14]" />,
    title: "Scripts Otimizados",
    desc: "Código revisado e testado por especialistas. Performance máxima garantida.",
  },
  {
    icon: <Shield size={24} className="text-[#39FF14]" />,
    title: "Segurança ICP",
    desc: "Dados armazenados em blockchain do Internet Computer. Sem servidores centralizados.",
  },
  {
    icon: <Download size={24} className="text-[#39FF14]" />,
    title: "Entrega Instantânea",
    desc: "Download imediato após a compra. Sem espera, sem burocracia.",
  },
];

export default function LandingPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { data: backendScripts } = useAllScripts();

  const allScripts =
    backendScripts && backendScripts.length > 0
      ? backendScripts
      : FALLBACK_SCRIPTS;
  const filtered =
    activeCategory === "Todos"
      ? allScripts
      : allScripts.filter((s) => s.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden">
        <img
          src="/assets/generated/hero-marketplace.dim_1920x600.jpg"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#111827]/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Star size={12} fill="#39FF14" /> Scripts Profissionais &
              Verificados
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
              Automatize seu Negócio com{" "}
              <span className="text-[#39FF14]">Scripts Profissionais</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Bots Discord, Web Scrapers, Automações e Scripts de Vendas.
              Construídos para performance, entregues via blockchain.
            </p>
            <Link
              to="/marketplace"
              className="inline-block bg-[#39FF14] text-[#111827] font-bold text-base px-8 py-3.5 rounded-full hover:bg-[#2ee610] transition-all shadow-neon-glow hover:shadow-lg"
              data-ocid="hero.primary_button"
            >
              Explorar Scripts
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-[#111827] mb-2">
              Por que escolher a LuidCorporation?
            </h2>
            <p className="text-gray-500">
              Tecnologia de ponta com segurança blockchain
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-card p-6"
              >
                <div className="w-12 h-12 bg-[#111827] rounded-xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#111827] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Script Catalog Preview */}
      <section className="py-16 bg-white" data-ocid="scripts.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-[#111827]">
                Scripts em Destaque
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Os mais vendidos desta semana
              </p>
            </div>
            <Link
              to="/marketplace"
              className="text-sm text-[#39FF14] font-semibold hover:underline"
              data-ocid="scripts.link"
            >
              Ver todos →
            </Link>
          </div>
          <div className="mb-6">
            <CategoryTabs
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
          {filtered.length === 0 ? (
            <div
              className="text-center py-16 text-gray-400"
              data-ocid="scripts.empty_state"
            >
              Nenhum script nesta categoria ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(0, 6).map((script, i) => (
                <ScriptCard
                  key={script.id.toString()}
                  script={script}
                  index={i + 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
