import { Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#111827] text-gray-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#39FF14] rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-[#111827]" fill="#111827" />
              </div>
              <span className="font-extrabold text-white text-lg">
                Luid <span className="text-[#39FF14]">MARKETPLACE</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A plataforma definitiva para scripts e bots profissionais.
              Automatize, escale e lucre.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-[#39FF14] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  className="hover:text-[#39FF14] transition-colors"
                >
                  Marketplace
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="hover:text-[#39FF14] transition-colors"
                >
                  Entrar
                </a>
              </li>
              <li>
                <a
                  href="/register"
                  className="hover:text-[#39FF14] transition-colors"
                >
                  Cadastrar
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">
              Categorias
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/marketplace"
                  className="hover:text-[#39FF14] transition-colors"
                >
                  Bots Discord
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  className="hover:text-[#39FF14] transition-colors"
                >
                  Web Scraping
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  className="hover:text-[#39FF14] transition-colors"
                >
                  Automações
                </a>
              </li>
              <li>
                <a
                  href="/marketplace"
                  className="hover:text-[#39FF14] transition-colors"
                >
                  Scripts de Vendas
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span>
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="text-[#39FF14] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              caffeine.ai
            </a>
          </span>
          <span>LuidCorporation © {year}</span>
        </div>
      </div>
    </footer>
  );
}
