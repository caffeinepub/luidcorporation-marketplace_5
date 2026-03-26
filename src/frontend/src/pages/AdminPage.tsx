import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, LogOut, Package, Plus, Trash2, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Record_ } from "../backend.d";
import { useAuth } from "../context/AuthContext";
import {
  useAddScript,
  useAllScripts,
  useAllUserAccounts,
  useDeleteScript,
  useUpdateScript,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Bots Discord",
  "Web Scraping",
  "Automações",
  "Scripts de Vendas",
];
const LANGUAGES = ["Python", "JavaScript"];

interface ScriptForm {
  title: string;
  description: string;
  category: string;
  price: string;
  version: string;
  language: string;
  fileUrl: string;
}

const emptyForm: ScriptForm = {
  title: "",
  description: "",
  category: "Bots Discord",
  price: "",
  version: "1.0.0",
  language: "Python",
  fileUrl: "",
};

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { adminLogin } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = adminLogin(username, password);
    if (ok) {
      onLogin();
      toast.success("Bem-vindo, Administrador!");
    } else {
      toast.error("Credenciais inválidas.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-10 w-full max-w-md shadow-2xl"
        data-ocid="admin.dialog"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#111827] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-[#39FF14]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#111827]">
            Master Panel
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Acesso exclusivo para administradores
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#111827]">
              Usuário
            </Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nome de usuário"
              required
              className="rounded-xl"
              data-ocid="admin.input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-[#111827]">
              Senha
            </Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha master"
              required
              className="rounded-xl"
              data-ocid="admin.input"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#39FF14] text-[#111827] font-bold py-3 rounded-full hover:bg-[#2ee610] transition-colors"
            data-ocid="admin.submit_button"
          >
            Acessar Painel
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const { isAdminLoggedIn, adminLogout } = useAuth();
  const [activeTab, setActiveTab] = useState<"scripts" | "users">("scripts");
  const [showModal, setShowModal] = useState(false);
  const [editingScript, setEditingScript] = useState<Record_ | null>(null);
  const [form, setForm] = useState<ScriptForm>(emptyForm);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const { data: scripts } = useAllScripts();
  const { data: accounts } = useAllUserAccounts();
  const addMutation = useAddScript();
  const updateMutation = useUpdateScript();
  const deleteMutation = useDeleteScript();

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={() => {}} />;
  }

  const openAdd = () => {
    setEditingScript(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (script: Record_) => {
    setEditingScript(script);
    setForm({
      title: script.title,
      description: script.description,
      category: script.category,
      price: script.price.toString(),
      version: script.version,
      language: script.language,
      fileUrl: script.fileUrl,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, price: Number.parseFloat(form.price) };
    try {
      if (editingScript) {
        await updateMutation.mutateAsync({ id: editingScript.id, ...data });
        toast.success("Script atualizado!");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Script adicionado!");
      }
      setShowModal(false);
    } catch {
      toast.error("Erro ao salvar script.");
    }
  };

  const handleDelete = async (id: bigint) => {
    setDeletingId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Script removido!");
    } catch {
      toast.error("Erro ao remover script.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#111827] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#39FF14] rounded-lg flex items-center justify-center">
            <Package size={16} className="text-[#111827]" />
          </div>
          <span className="font-extrabold">
            Master Panel{" "}
            <span className="text-[#39FF14] text-sm font-normal ml-1">
              Admin
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={adminLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          data-ocid="admin.secondary_button"
        >
          <LogOut size={16} /> Sair
        </button>
      </header>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        data-ocid="admin.section"
      >
        <div className="flex gap-2 border-b border-gray-200 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("scripts")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "scripts"
                ? "border-[#39FF14] text-[#111827]"
                : "border-transparent text-gray-500 hover:text-[#111827]"
            }`}
            data-ocid="admin.tab"
          >
            <Package size={16} /> Scripts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "users"
                ? "border-[#39FF14] text-[#111827]"
                : "border-transparent text-gray-500 hover:text-[#111827]"
            }`}
            data-ocid="admin.tab"
          >
            <Users size={16} /> Usuários
          </button>
        </div>

        {activeTab === "scripts" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-[#111827]">
                Gerenciar Scripts
              </h2>
              <button
                type="button"
                onClick={openAdd}
                className="flex items-center gap-2 bg-[#39FF14] text-[#111827] font-bold px-5 py-2.5 rounded-full hover:bg-[#2ee610] transition-colors text-sm"
                data-ocid="admin.primary_button"
              >
                <Plus size={16} /> Novo Script
              </button>
            </div>

            {!scripts || scripts.length === 0 ? (
              <div
                className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200"
                data-ocid="admin.empty_state"
              >
                Nenhum script cadastrado ainda.
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden"
                data-ocid="admin.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold text-[#111827]">
                        Título
                      </TableHead>
                      <TableHead className="font-bold text-[#111827]">
                        Linguagem
                      </TableHead>
                      <TableHead className="font-bold text-[#111827]">
                        Categoria
                      </TableHead>
                      <TableHead className="font-bold text-[#111827]">
                        Preço
                      </TableHead>
                      <TableHead className="font-bold text-[#111827]">
                        Versão
                      </TableHead>
                      <TableHead className="font-bold text-[#111827]">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scripts.map((script, i) => (
                      <TableRow
                        key={script.id.toString()}
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="font-semibold">
                          {script.title}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              script.language === "Python"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {script.language}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {script.category}
                        </TableCell>
                        <TableCell>
                          <span className="bg-[#39FF14] text-[#111827] font-bold text-xs px-3 py-1 rounded-full">
                            R$ {script.price.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          v{script.version}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(script)}
                              className="p-2 text-gray-500 hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
                              data-ocid={`admin.row.${i + 1}.edit_button`}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(script.id)}
                              disabled={deletingId === script.id}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              data-ocid={`admin.row.${i + 1}.delete_button`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-extrabold text-[#111827] mb-6">
              Usuários Registrados
            </h2>
            {!accounts || accounts.length === 0 ? (
              <div
                className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200"
                data-ocid="admin.empty_state"
              >
                Nenhum usuário registrado ainda.
              </div>
            ) : (
              <div
                className="bg-white rounded-2xl border border-gray-200 shadow-card overflow-hidden"
                data-ocid="admin.table"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-bold text-[#111827]">
                        #
                      </TableHead>
                      <TableHead className="font-bold text-[#111827]">
                        ID Luid
                      </TableHead>
                      <TableHead className="font-bold text-[#111827]">
                        E-mail
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account, i) => (
                      <TableRow
                        key={account.luidId}
                        data-ocid={`admin.row.${i + 1}`}
                      >
                        <TableCell className="text-gray-500 text-sm">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {account.luidId}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {account.email}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="max-w-lg rounded-2xl"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#111827]">
              {editingScript ? "Editar Script" : "Novo Script"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label className="text-sm font-semibold">Título</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Nome do script"
                required
                className="rounded-xl"
                data-ocid="admin.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-semibold">Descrição</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Descreva o script..."
                required
                className="rounded-xl resize-none"
                rows={3}
                data-ocid="admin.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Categoria</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                >
                  <SelectTrigger
                    className="rounded-xl"
                    data-ocid="admin.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Linguagem</Label>
                <Select
                  value={form.language}
                  onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}
                >
                  <SelectTrigger
                    className="rounded-xl"
                    data-ocid="admin.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Preço (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="99.90"
                  required
                  className="rounded-xl"
                  data-ocid="admin.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Versão</Label>
                <Input
                  value={form.version}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, version: e.target.value }))
                  }
                  placeholder="1.0.0"
                  required
                  className="rounded-xl"
                  data-ocid="admin.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-sm font-semibold">
                URL do Arquivo ZIP
              </Label>
              <Input
                value={form.fileUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileUrl: e.target.value }))
                }
                placeholder="https://..."
                required
                className="rounded-xl"
                data-ocid="admin.input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors"
                data-ocid="admin.cancel_button"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
                className="flex-1 bg-[#39FF14] text-[#111827] font-bold py-3 rounded-full hover:bg-[#2ee610] transition-colors disabled:opacity-60"
                data-ocid="admin.confirm_button"
              >
                {addMutation.isPending || updateMutation.isPending
                  ? "Salvando..."
                  : "Salvar"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
