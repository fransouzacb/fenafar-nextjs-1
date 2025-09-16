'use client'

import { useNotifications } from '@/contexts/notification-context'

// Hook personalizado para facilitar o uso das notificações
export function useToast() {
  const {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showDeleteConfirmation,
    showActivationConfirmation,
    showConfirmation,
  } = useNotifications()

  return {
    // Notificações simples
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,

    // Confirmações específicas
    confirmDelete: showDeleteConfirmation,
    confirmActivation: showActivationConfirmation,
    confirm: showConfirmation,

    // Helpers para ações comuns do sistema FENAFAR
    notifyUserCreated: (name: string) => 
      showSuccess('Usuário criado', `${name} foi criado com sucesso.`),
    
    notifyUserUpdated: (name: string) => 
      showSuccess('Usuário atualizado', `${name} foi atualizado com sucesso.`),
    
    notifyUserDeleted: (name: string) => 
      showSuccess('Usuário excluído', `${name} foi excluído com sucesso.`),
    
    notifySindicatoCreated: (name: string) => 
      showSuccess('Sindicato criado', `${name} foi criado com sucesso.`),
    
    notifySindicatoUpdated: (name: string) => 
      showSuccess('Sindicato atualizado', `${name} foi atualizado com sucesso.`),
    
    notifySindicatoDeleted: (name: string) => 
      showSuccess('Sindicato excluído', `${name} foi excluído com sucesso.`),
    
    notifyMembroCreated: (name: string) => 
      showSuccess('Membro adicionado', `${name} foi adicionado ao sindicato com sucesso.`),
    
    notifyMembroUpdated: (name: string) => 
      showSuccess('Membro atualizado', `${name} foi atualizado com sucesso.`),
    
    notifyMembroDeleted: (name: string) => 
      showSuccess('Membro removido', `${name} foi removido do sindicato com sucesso.`),
    
    notifyDocumentoUploaded: (name: string) => 
      showSuccess('Documento enviado', `${name} foi enviado com sucesso.`),
    
    notifyDocumentoDeleted: (name: string) => 
      showSuccess('Documento excluído', `${name} foi excluído com sucesso.`),
    
    notifyConviteEnviado: (email: string) => 
      showSuccess('Convite enviado', `Convite foi enviado para ${email}.`),
    
    notifyConviteAceito: (email: string) => 
      showSuccess('Convite aceito', `${email} aceitou o convite.`),
    
    notifyConviteExpirado: (email: string) => 
      showWarning('Convite expirado', `O convite para ${email} expirou.`),
    
    // Erros comuns
    notifyError: (message: string) => 
      showError('Erro', message),
    
    notifyNetworkError: () => 
      showError('Erro de conexão', 'Verifique sua conexão com a internet e tente novamente.'),
    
    notifyValidationError: (field: string) => 
      showError('Erro de validação', `Por favor, verifique o campo ${field}.`),
    
    notifyUnauthorized: () => 
      showError('Acesso negado', 'Você não tem permissão para realizar esta ação.'),
    
    notifyNotFound: (item: string) => 
      showError('Não encontrado', `${item} não foi encontrado.`),
    
    notifyServerError: () => 
      showError('Erro do servidor', 'Ocorreu um erro interno. Tente novamente mais tarde.'),
  }
}
