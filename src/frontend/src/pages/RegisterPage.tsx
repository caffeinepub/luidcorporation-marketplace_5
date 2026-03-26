import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Info, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRegisterUser } from "../hooks/useQueries";

export default function RegisterPage() {
  const [luidId, setLuidId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const registerMutation = useRegisterUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ luidId, email, password });
      toast.success("Conta criada! Faça login para continuar.");
      navigate({ to: "/login" });
    } catch {
      toast.error("Erro ao criar conta. O ID Luid pode já estar em uso.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
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
            Criar sua conta
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Comece a automatizar seu negócio hoje
          </p>
        </div>

        <div
          className="bg-white rounded-2xl border border-gray-200 shadow-card p-8"
          data-ocid="register.card"
        >
          {/* Info box */}
          <div className="bg-[#39FF14]/10 border border-[#39FF14]/40 rounded-xl p-4 mb-6 flex gap-3">
            <Info size={18} className="text-[#111827] shrink-0 mt-0.5" />
            <p className="text-sm text-[#111827] leading-snug">
              Resgate seu <strong>ID Luid</strong> no seu perfil do site
              principal:{" "}
              <a
                href="https://luidcorporation-kxb.caffeine.xyz/perfil"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-[#39FF14] transition-colors break-all"
              >
                luidcorporation-kxb.caffeine.xyz/perfil
              </a>
            </p>
          </div>

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
                placeholder="Seu ID Luid único"
                required
                className="rounded-xl border-gray-200"
                data-ocid="register.input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-[#111827]"
              >
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="rounded-xl border-gray-200"
                data-ocid="register.input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-[#111827]"
              >
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha segura"
                required
                className="rounded-xl border-gray-200"
                data-ocid="register.input"
              />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-[#39FF14] text-[#111827] font-bold py-3 rounded-full hover:bg-[#2ee610] transition-colors disabled:opacity-60"
              data-ocid="register.submit_button"
            >
              {registerMutation.isPending ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{" "}
            <Link
              to="/login"
              className="text-[#111827] font-semibold hover:text-[#39FF14] transition-colors"
              data-ocid="register.link"
            >
              Entrar
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
