import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Code,
  Download,
  GitBranch,
  Layers,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  useHasPurchased,
  usePurchaseScript,
  useScriptById,
} from "../hooks/useQueries";

const FALLBACK_SCRIPTS: Record<
  string,
  {
    id: bigint;
    title: string;
    description: string;
    language: string;
    version: string;
    category: string;
    price: number;
    fileUrl: string;
  }
> = {
  "1": {
    id: 1n,
    title: "Discord Bot Premium",
    description:
      "Bot completo para Discord com moderação automática, músicas HD, comandos customizados, sistema de tickets e integração com APIs externas. Código limpo e documentado.",
    language: "Python",
    version: "2.4.1",
    category: "Bots Discord",
    price: 149.9,
    fileUrl: "#",
  },
  "2": {
    id: 2n,
    title: "Web Scraper Pro",
    description:
      "Extração avançada de dados. Suporte a JavaScript (Selenium/Playwright), proxies rotatórios, exportação CSV/JSON/Excel, suporte a CAPTCHA e modo stealth.",
    language: "Python",
    version: "1.8.0",
    category: "Web Scraping",
    price: 89.9,
    fileUrl: "#",
  },
  "3": {
    id: 3n,
    title: "Auto Sales Bot",
    description:
      "Automação completa de funil de vendas no WhatsApp Business e Instagram DM. CRM integrado, relatórios em tempo real e integração com Google Sheets.",
    language: "JavaScript",
    version: "3.1.2",
    category: "Scripts de Vendas",
    price: 199.9,
    fileUrl: "#",
  },
  "4": {
    id: 4n,
    title: "Task Automator",
    description:
      "Automação de tarefas repetitivas com agendamento cron, notificações por email/Telegram, logs detalhados e suporte a Linux/Windows/macOS.",
    language: "Python",
    version: "1.2.5",
    category: "Automações",
    price: 69.9,
    fileUrl: "#",
  },
};

export default function ScriptDetailPage() {
  const { id } = useParams({ from: "/script/$id" });
  const navigate = useNavigate();
  const { luidId } = useAuth();

  const scriptId = BigInt(id);
  const { data: backendScript, isLoading } = useScriptById(scriptId);
  const { data: hasPurchased } = useHasPurchased(luidId, scriptId);
  const purchaseMutation = usePurchaseScript();

  const script = backendScript ?? FALLBACK_SCRIPTS[id] ?? null;

  const handlePurchase = async () => {
    if (!luidId) {
      navigate({ to: "/login" });
      return;
    }
    try {
      await purchaseMutation.mutateAsync({ luidId, scriptId });
      toast.success("Script adquirido com sucesso!");
    } catch {
      toast.error("Erro ao processar compra. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main
          className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full"
          data-ocid="script.loading_state"
        >
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main
          className="flex-1 flex items-center justify-center"
          data-ocid="script.error_state"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#111827] mb-2">
              Script não encontrado
            </h2>
            <button
              type="button"
              onClick={() => navigate({ to: "/marketplace" })}
              className="text-[#39FF14] hover:underline font-semibold"
            >
              ← Voltar ao Marketplace
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <button
            type="button"
            onClick={() => navigate({ to: "/marketplace" })}
            className="flex items-center gap-2 text-gray-500 hover:text-[#111827] transition-colors mb-8 text-sm"
            data-ocid="script.link"
          >
            <ArrowLeft size={16} /> Voltar ao Marketplace
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              <div
                className="bg-white rounded-2xl border border-gray-200 shadow-card p-8"
                data-ocid="script.card"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {script.category}
                    </span>
                    <h1 className="text-3xl font-extrabold text-[#111827] mt-1">
                      {script.title}
                    </h1>
                  </div>
                  <span className="bg-[#39FF14] text-[#111827] font-bold text-lg px-4 py-1.5 rounded-full whitespace-nowrap">
                    R$ {script.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {script.description}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6">
                <h2 className="font-bold text-[#111827] mb-4">
                  Detalhes Técnicos
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Code size={18} className="text-[#39FF14]" />
                    <div>
                      <p className="text-xs text-gray-500">Linguagem</p>
                      <p className="font-semibold text-[#111827] text-sm">
                        {script.language}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <GitBranch size={18} className="text-[#39FF14]" />
                    <div>
                      <p className="text-xs text-gray-500">Versão</p>
                      <p className="font-semibold text-[#111827] text-sm">
                        v{script.version}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Tag size={18} className="text-[#39FF14]" />
                    <div>
                      <p className="text-xs text-gray-500">Categoria</p>
                      <p className="font-semibold text-[#111827] text-sm">
                        {script.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Layers size={18} className="text-[#39FF14]" />
                    <div>
                      <p className="text-xs text-gray-500">Formato</p>
                      <p className="font-semibold text-[#111827] text-sm">
                        ZIP
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-card p-6 sticky top-20">
                <div className="text-center mb-6">
                  <p className="text-gray-500 text-sm mb-1">Preço do Script</p>
                  <p className="text-4xl font-extrabold text-[#111827]">
                    R$ {script.price.toFixed(2)}
                  </p>
                </div>

                {hasPurchased ? (
                  <a
                    href={script.fileUrl}
                    download
                    className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-[#111827] font-bold py-3 rounded-full hover:bg-[#2ee610] transition-colors"
                    data-ocid="script.primary_button"
                  >
                    <Download size={18} /> Download ZIP
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handlePurchase}
                    disabled={purchaseMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 bg-[#39FF14] text-[#111827] font-bold py-3 rounded-full hover:bg-[#2ee610] transition-colors disabled:opacity-60"
                    data-ocid="script.primary_button"
                  >
                    {purchaseMutation.isPending ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                    {purchaseMutation.isPending
                      ? "Processando..."
                      : "Comprar Script"}
                  </button>
                )}

                {!luidId && (
                  <p className="text-xs text-gray-400 text-center mt-3">
                    Você precisa estar logado para comprar.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
