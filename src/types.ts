export type UserRole = 'admin' | 'advogado' | 'assistente' | 'estagiario';

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  oab?: string;
  perfil: UserRole;
  permissoes: string[];
  preferencias: {
    notificacoesDataJud: boolean;
    resumoIaAutomatico: boolean;
    tema: 'light' | 'dark' | 'system';
  };
}

export interface Cliente {
  id: string;
  nome: string;
  tipo: 'PF' | 'PJ';
  cpfCnpj: string;
  email: string;
  telefone: string;
  endereco: {
    logradouro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  historicoNotas: string;
  processosVinculados: string[]; // IDs dos processos
  dataCadastro: string;
  status: 'Ativo' | 'Inativo' | 'Potencial';
}

export interface MovimentacaoProcessual {
  id: string;
  data: string;
  descricao: string;
  orgao: string;
  fonte: 'DataJud' | 'Manual' | 'Diário Oficial';
  relevancia: 'Alta' | 'Média' | 'Baixa';
  alertaIa?: string;
}

export interface Processo {
  id: string;
  numeroCnj: string;
  tribunal: string; // ex: TJSP, TRF3, TST, STJ
  comarca: string;
  classeProcessual: string; // ex: Procedimento Comum Cível, Ação Trabalhista
  assunto: string;
  partes: {
    poloAtivo: string;
    poloPassivo: string;
  };
  advogadoResponsavelId: string;
  advogadoResponsavelNome: string;
  clienteId: string;
  clienteNome: string;
  status: 'Ativo' | 'Arquivado' | 'Suspenso' | 'Em Recurso' | 'Acordo';
  movimentacoes: MovimentacaoProcessual[];
  documentosIds: string[];
  datasImportantes: {
    distribuicao: string;
    proximaAudiencia?: string;
    prazoFatal?: string;
  };
  valorCausa: number;
  ultimaSincronizacaoDataJud: string;
  resumoIa?: string;
}

export interface Documento {
  id: string;
  tipo: 'Contrato' | 'Procuração' | 'Petição Initial' | 'Sentença' | 'Contestação' | 'Outro';
  nome: string;
  arquivoUrl: string;
  tamanho: string;
  dataUpload: string;
  processoId?: string;
  processoNumeroCnj?: string;
  clienteId?: string;
  resumoIa?: string;
  entidadesExtraidas?: {
    datas?: string[];
    valores?: string[];
    clausulasCriticas?: string[];
    partesCitadas?: string[];
  };
  statusIa: 'analisado' | 'pendente' | 'processando';
}

export interface TarefaPrazo {
  id: string;
  descricao: string;
  processoId?: string;
  processoNumeroCnj?: string;
  responsavelId: string;
  responsavelNome: string;
  dataLimite: string; // YYYY-MM-DD
  prioridade: 'Urgente' | 'Alta' | 'Média' | 'Baixa';
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado';
  categoria: 'Prazo Processual' | 'Audiência' | 'Diligência' | 'Reunião';
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  contexto?: string;
  sugestooes?: string[];
}

export interface DataJudImportResult {
  numeroCnj: string;
  tribunal: string;
  comarca: string;
  classe: string;
  assunto: string;
  poloAtivo: string;
  poloPassivo: string;
  valorCausa: number;
  dataDistribuicao: string;
  movimentacoesExtraidas: Array<{
    data: string;
    descricao: string;
    orgao: string;
  }>;
}

export interface InboxJuridicoItem {
  id: string;
  tipo: 'Publicação Diário Oficial' | 'Movimentação DataJud' | 'E-mail Cliente' | 'Documento Recebido';
  titulo: string;
  descricao: string;
  dataHora: string;
  processoId?: string;
  processoNumeroCnj?: string;
  clienteNome?: string;
  classificacaoIa: 'Ação Necessária' | 'Importante' | 'Pode Esperar';
  sugestaoAcaoIa: string;
  prazoSugeridoDias?: number;
  lido: boolean;
  arquivado: boolean;
}

export interface DossieAudiencia {
  processoId: string;
  processoNumeroCnj: string;
  partes: string;
  dataAudiencia: string;
  varaTribunal: string;
  resumoCaso: string;
  linhaTempoFatos: Array<{ data: string; evento: string }>;
  pontosFortes: string[];
  pontosFracosRiscos: string[];
  perguntasTestemunhas: string[];
  perguntasParteContraria: string[];
  documentosRelevantes: string[];
  jurisprudenciaTese: string;
}

export interface MemoriaJuridicaItem {
  id: string;
  titulo: string;
  categoria: 'Estratégia Vencedora' | 'Modelo de Peça' | 'Decisão Favorável' | 'Cláusula Padronizada';
  tribunalOuOrgao?: string;
  descricao: string;
  mencionadaEmProcessosCount: number;
  dataAdicao: string;
  tags: string[];
}

