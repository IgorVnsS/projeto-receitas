// Funções para controlar o loading global
export const showGlobalLoading = () => {
  window.dispatchEvent(new Event("startLoading"))
}

export const hideGlobalLoading = () => {
  window.dispatchEvent(new Event("stopLoading"))
}

// Hook para usar loading em componentes
export const useGlobalLoading = () => {
  return {
    show: showGlobalLoading,
    hide: hideGlobalLoading,
  }
}
