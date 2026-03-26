import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Account, Record_ } from "../backend.d";
import { useActor } from "./useActor";

export function useAllScripts() {
  const { actor, isFetching } = useActor();
  return useQuery<Record_[]>({
    queryKey: ["scripts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllScripts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useScriptsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Record_[]>({
    queryKey: ["scripts", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "Todos") return actor.getAllScripts();
      return actor.getScriptsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useScriptById(scriptId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Record_ | null>({
    queryKey: ["script", scriptId?.toString()],
    queryFn: async () => {
      if (!actor || scriptId === null) return null;
      return actor.getScriptById(scriptId);
    },
    enabled: !!actor && !isFetching && scriptId !== null,
  });
}

export function useAllUserAccounts() {
  const { actor, isFetching } = useActor();
  return useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserAccounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePurchasedScripts(luidId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["purchased", luidId],
    queryFn: async () => {
      if (!actor || !luidId) return [];
      return actor.getPurchasedScripts(luidId);
    },
    enabled: !!actor && !isFetching && !!luidId,
  });
}

export function useHasPurchased(
  luidId: string | null,
  scriptId: bigint | null,
) {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["hasPurchased", luidId, scriptId?.toString()],
    queryFn: async () => {
      if (!actor || !luidId || scriptId === null) return false;
      return actor.hasPurchasedScript(luidId, scriptId);
    },
    enabled: !!actor && !isFetching && !!luidId && scriptId !== null,
  });
}

export function usePurchaseScript() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      luidId,
      scriptId,
    }: { luidId: string; scriptId: bigint }) => {
      if (!actor) throw new Error("No actor");
      return actor.purchaseScript(luidId, scriptId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["purchased"] });
      qc.invalidateQueries({ queryKey: ["hasPurchased"] });
    },
  });
}

export function useAddScript() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category: string;
      price: number;
      version: string;
      language: string;
      fileUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addScriptForSale(
        data.title,
        data.description,
        data.category,
        data.price,
        data.version,
        data.language,
        data.fileUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
}

export function useUpdateScript() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: bigint;
      title: string;
      description: string;
      category: string;
      price: number;
      version: string;
      language: string;
      fileUrl: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateScript(
        data.id,
        data.title,
        data.description,
        data.category,
        data.price,
        data.version,
        data.language,
        data.fileUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
}

export function useDeleteScript() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (scriptId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteScript(scriptId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["scripts"] }),
  });
}

export function useDeleteUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (luidId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteUser(luidId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useUpdateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      luidId: string;
      email: string;
      password: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateUser(data.luidId, data.email, data.password);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useLoginUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      luidId,
      password,
    }: { luidId: string; password: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.login(luidId, password);
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      luidId,
      email,
      password,
    }: { luidId: string; email: string; password: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.register(luidId, email, password);
    },
  });
}
