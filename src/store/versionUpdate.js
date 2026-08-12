import { create } from "zustand";

// Store (sin persistencia) para coordinar el aviso de nueva versión
// entre el hook useAppVersionChecker y la UI (Navbar).
export const useVersionUpdateStore = create((set) => ({
  // true mientras corre la cuenta regresiva de gracia (1:30 min)
  countdownActive: false,
  secondsLeft: 90,
  // Se sobreescriben desde el hook al montar la app
  triggerImmediateUpdate: () => {},
  simulateNewVersion: () => {},
  setCountdown: (payload) => set(payload),
}));
