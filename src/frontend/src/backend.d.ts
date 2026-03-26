import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Category = string;
export interface Account {
    password: Password;
    email: string;
    luidId: LuidId;
}
export type LuidId = string;
export interface Record_ {
    id: bigint;
    title: string;
    description: string;
    language: string;
    version: string;
    category: Category;
    price: number;
    fileUrl: string;
}
export type Password = string;
export type ScriptId = bigint;
export interface UserProfile {
    email: string;
    luidId: LuidId;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addScriptForSale(title: string, description: string, category: Category, price: number, version: string, language: string, fileUrl: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteScript(scriptId: ScriptId): Promise<void>;
    getAllScripts(): Promise<Array<Record_>>;
    getAllUserAccounts(): Promise<Array<Account>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPurchasedScripts(luidId: LuidId): Promise<Array<ScriptId>>;
    getScriptById(scriptId: ScriptId): Promise<Record_>;
    getScriptsByCategory(category: Category): Promise<Array<Record_>>;
    getScriptsByLanguage(language: string): Promise<Array<Record_>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasPurchasedScript(luidId: LuidId, scriptId: ScriptId): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isRegistered(luidId: LuidId): Promise<boolean>;
    login(luidId: LuidId, password: string): Promise<boolean>;
    purchaseScript(luidId: LuidId, scriptId: ScriptId): Promise<void>;
    register(luidId: LuidId, email: string, password: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateScript(scriptId: ScriptId, title: string, description: string, category: Category, price: number, version: string, language: string, fileUrl: string): Promise<void>;
}
