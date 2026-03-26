import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, ShoppingBag, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { luidId, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <header
      className="bg-[#111827] text-white sticky top-0 z-50 shadow-lg"
      data-ocid="navbar.section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="navbar.link"
          >
            <div className="w-8 h-8 bg-[#39FF14] rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-[#111827]" fill="#111827" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">
              Luid <span className="text-[#39FF14]">MARKETPLACE</span>
            </span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-8"
            data-ocid="navbar.section"
          >
            <Link
              to="/"
              className="text-gray-300 hover:text-[#39FF14] transition-colors text-sm font-medium"
              data-ocid="nav.home.link"
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="text-gray-300 hover:text-[#39FF14] transition-colors text-sm font-medium"
              data-ocid="nav.marketplace.link"
            >
              Marketplace
            </Link>
            <a
              href="mailto:suporte@luidcorporation.com"
              className="text-gray-300 hover:text-[#39FF14] transition-colors text-sm font-medium"
            >
              Suporte
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {luidId ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm text-gray-300 hover:text-[#39FF14] transition-colors font-medium flex items-center gap-1"
                  data-ocid="nav.dashboard.link"
                >
                  <ShoppingBag size={15} />
                  Meus Scripts
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 transition-colors"
                  data-ocid="nav.logout.button"
                >
                  <LogOut size={15} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-gray-300 hover:text-white transition-colors font-medium"
                  data-ocid="nav.login.link"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-[#39FF14] text-[#111827] font-bold text-sm px-5 py-2 rounded-full hover:bg-[#2ee610] transition-colors shadow-neon-glow"
                  data-ocid="nav.register.button"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
