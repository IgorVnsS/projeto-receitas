// Sistema de eventos para autenticação
export const AUTH_EVENTS = {
  LOGIN: "auth:login",
  LOGOUT: "auth:logout",
  REGISTER: "auth:register",
}

// Função para disparar eventos de autenticação
export function dispatchAuthEvent(eventType: string, userData: any = null) {
  // Usar CustomEvent para comunicação entre componentes
  const event = new CustomEvent(eventType, {
    detail: { user: userData },
  })

  // Disparar o evento globalmente
  window.dispatchEvent(event)
}
