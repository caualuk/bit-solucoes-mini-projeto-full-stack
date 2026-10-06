import { useSyncExternalStore } from "react";

// Não precisa acompanhar mudança, por isso a função é vazia
const subscribe = () => () => {};

// Retorna true apenas no navegador e false no servidor.
// Podemos usar  recursos (localStorage) sem causar problemas na hidratação
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
