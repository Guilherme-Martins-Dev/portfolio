"use client";

import { useSyncExternalStore } from "react";

import { motionPreference } from "./preference";

const subscribe = (listener: () => void) => motionPreference().subscribe(listener);
// No servidor (e na hidratação) não há como saber: assume movimento normal e corrige no cliente.
const serverSnapshot = () => false;

/** Movimento reduzido efetivo (sistema OU botão "Reduzir efeitos"), reativo às duas fontes. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => motionPreference().reduced(), serverSnapshot);
}

/** Só a escolha do botão "Reduzir efeitos". */
export function useUserReduceMotion(): boolean {
  return useSyncExternalStore(subscribe, () => motionPreference().userChoice(), serverSnapshot);
}
