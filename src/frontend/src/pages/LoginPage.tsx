import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useLoginUser } from "../hooks/useQueries";

export default function LoginPage() {
  const [luidId, setLuidId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setLuidId: saveUser } = useAuth();
  const navigate = useNavigate();
  const loginMutation = useLoginUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await loginMutation.mutateAsync({ luidId, password });
      if (success) {
        saveUser(luidId);
        toast.success("Login realizado com sucesso!");
        navigate({ to: "/dashboard" });
      } else {
        toast.error("ID Luid ou senha incorretos.");
      }
    } catch {
      toast.error("Erro ao conectar. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#111827] rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-[#39FF14]" fill="#39FF14" />
            </div>
            <span className="font-extrabold text-xl text-[#111827]">
              Luid <span className="text-[#39FF14]">MARKETPLACE</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#111827]">
            Entrar na sua conta
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Use seu ID Luid para acessar
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-card p-8"
          data-ocid="login.card"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="luidId"
                className="text-sm font-semibold text-[#111827]"
              >
                ID Luid
              </Label>
              <Input
                id="luidId"
                value={luidId}
                onChange={(e) => setLuidId(e.target.value)}
                placeholder="Seu ID Luid"
                required
                className="rounded-xl border-gray-200 focus:border-[#39FF14] focus:ring-[#39FF14]"
                data-ocid="login.input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-[#111827]"
              >
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="rounded-xl border-gray-200 focus:border-[#39FF14] focus:ring-[#39FF14] pr-10"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-[#39FF14] text-[#111827] font-bold py-3 rounded-full hover:bg-[#2ee610] transition-colors disabled:opacity-60"
              data-ocid="login.submit_button"
            >
              {loginMutation.isPending ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Não tem uma conta?{" "}
            <Link
              to="/register"
              className="text-[#111827] font-semibold hover:text-[#39FF14] transition-colors"
              data-ocid="login.link"
            >
              Cadastrar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
