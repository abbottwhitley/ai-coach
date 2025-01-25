import { Assistant, UserThread } from "@/server/db/schemas";
import { atom } from "jotai";

export const userThreadAtom = atom<UserThread | null>(null);
export const assistantAtom = atom<Assistant | null>(null);