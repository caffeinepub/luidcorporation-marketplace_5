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
import type { Account, Record_ } from "../backend.d";
import { useAuth } from "../context/AuthContext";
import {
  useAddScript,
  useAllScripts,
  useAllUserAccounts,
  useDeleteScript,
  useDeleteUser,
  useUpdateScript,
  useUpdateUser,
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

interface UserForm {
  email: string;
  password: string;
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

  // Script state
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [editingScript, setEditingScript] = useState<Record_ | null>(null);
  const [scriptForm, setScriptForm] = useState<ScriptForm>(emptyForm);
  const [deletingScriptId, setDeletingScriptId] = useState<bigint | null>(null);

  // User state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Account | null>(null);
  const [userForm, setUserForm] = useState<UserForm>({
    email: "",
    password: "",
  });
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const { data: scripts } = useAllScripts();
  const { data: accounts } = useAllUserAccounts();
  const addMutation = useAddScript();
  const updateMutation = useUpdateScript();
  const deleteMutation = useDeleteScript();
  const deleteUserMutation = useDeleteUser();
  const updateUserMutation = useUpdateUser();

  if (!isAdminLoggedIn) {
    return <AdminLogin onLogin={() => {}} />;
  }

  const openAdd = () => {
    setEditingScript(null);
    setScriptForm(emptyForm);
    setShowScriptModal(true);
  };

  const openEdit = (script: Record_) => {
    setEditingScript(script);
    setScriptForm({
      title: script.title,
      description: script.description,
      category: script.category,
      price: script.price.toString(),
      version: script.version,
      language: script.language,
      fileUrl: script.fileUrl,
    });
    setShowScriptModal(true);
  };

  const handleScriptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...scriptForm, price: Number.parseFloat(scriptForm.price) };
    try {
      if (editingScript) {
        await updateMutation.mutateAsync({ id: editingScript.id, ...data });
        toast.success("Script atualizado!");
      } else {
        await addMutation.mutateAsync(data);
        toast.success("Script adicionado!");
      }
      setShowScriptModal(false);
    } catch {
      toast.error("Erro ao salvar script.");
    }
  };

  const handleDeleteScript = async (id: bigint) => {
    setDeletingScriptId(id);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Script removido!");
    } catch {
      toast.error("Erro ao remover script.");
    } finally {
      setDeletingScriptId(null);
    }
  };

  const openEditUser = (account: Account) => {
    setEditingUser(account);
    setUserForm({ email: account.email, password: "" });
    setShowUserModal(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await updateUserMutation.mutateAsync({
        luidId: editingUser.luidId,
        email: userForm.email,
        password: userForm.password,
      });
      toast.success("Usuário atualizado!");
      setShowUserModal(false);
    } catch {
      toast.error("Erro ao atualizar usuário.");
    }
  };

  const handleDeleteUser = async (luidId: string) => {
    setDeletingUserId(luidId);
    try {
      await deleteUserMutation.mutateAsync(luidId);
      toast.success("Usuário removido!");
    } catch {
      toast.error("Erro ao remover usuário.");
    } finally {
      setDeletingUserId(null);
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
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
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
                              onClick={() => handleDeleteScript(script.id)}
                              disabled={deletingScriptId === script.id}
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
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
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
                      <TableHead className="font-bold text-[#111827]">
                        Ações
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
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditUser(account)}
                              className="p-2 text-gray-500 hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Editar usuário"
                              data-ocid={`admin.row.${i + 1}.edit_button`}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(account.luidId)}
                              disabled={deletingUserId === account.luidId}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Excluir usuário"
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
      </div>

      {/* Script Modal */}
      <Dialog open={showScriptModal} onOpenChange={setShowScriptModal}>
        <DialogContent
          className="max-w-lg rounded-2xl"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#111827]">
              {editingScript ? "Editar Script" : "Novo Script"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleScriptSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <Label className="text-sm font-semibold">Título</Label>
              <Input
                value={scriptForm.title}
                onChange={(e) =>
                  setScriptForm((f) => ({ ...f, title: e.target.value }))
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
                value={scriptForm.description}
                onChange={(e) =>
                  setScriptForm((f) => ({ ...f, description: e.target.value }))
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
                  value={scriptForm.category}
                  onValueChange={(v) =>
                    setScriptForm((f) => ({ ...f, category: v }))
                  }
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
                  value={scriptForm.language}
                  onValueChange={(v) =>
                    setScriptForm((f) => ({ ...f, language: v }))
                  }
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
                  value={scriptForm.price}
                  onChange={(e) =>
                    setScriptForm((f) => ({ ...f, price: e.target.value }))
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
                  value={scriptForm.version}
                  onChange={(e) =>
                    setScriptForm((f) => ({ ...f, version: e.target.value }))
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
                value={scriptForm.fileUrl}
                onChange={(e) =>
                  setScriptForm((f) => ({ ...f, fileUrl: e.target.value }))
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
                onClick={() => setShowScriptModal(false)}
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

      {/* User Edit Modal */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent
          className="max-w-md rounded-2xl"
          data-ocid="admin.dialog"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#111827]">
              Editar Usuário
            </DialogTitle>
          </DialogHeader>
          {editingUser && (
            <form onSubmit={handleUserSubmit} className="space-y-4 mt-2">
              <div className="space-y-1">
                <Label className="text-sm font-semibold">ID Luid</Label>
                <Input
                  value={editingUser.luidId}
                  disabled
                  className="rounded-xl bg-gray-50 text-gray-500"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">E-mail</Label>
                <Input
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="email@exemplo.com"
                  required
                  className="rounded-xl"
                  data-ocid="admin.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-semibold">Nova Senha</Label>
                <Input
                  type="password"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm((f) => ({ ...f, password: e.target.value }))
                  }
                  placeholder="Deixe em branco para manter a atual"
                  className="rounded-xl"
                  data-ocid="admin.input"
                />
                <p className="text-xs text-gray-400">
                  Deixe em branco para não alterar a senha.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 rounded-full hover:bg-gray-200 transition-colors"
                  data-ocid="admin.cancel_button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="flex-1 bg-[#39FF14] text-[#111827] font-bold py-3 rounded-full hover:bg-[#2ee610] transition-colors disabled:opacity-60"
                  data-ocid="admin.confirm_button"
                >
                  {updateUserMutation.isPending ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
