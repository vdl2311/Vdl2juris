import { Cliente, Processo, Documento, TarefaPrazo, UserProfile, InboxJuridicoItem, MemoriaJuridicaItem } from '../types';

export const mockUsers: UserProfile[] = [
  {
    id: 'u1',
    nome: 'Dra. Helena Martins',
    email: 'helena.martins@juris.adv.br',
    oab: 'SP 345.890',
    perfil: 'admin',
    permissoes: ['all'],
    preferencias: { notificacoesDataJud: true, resumoIaAutomatico: true, tema: 'light' }
  },
  {
    id: 'u2',
    nome: 'Dr. Roberto Fonseca',
    email: 'roberto.fonseca@juris.adv.br',
    oab: 'SP 210.450',
    perfil: 'advogado',
    permissoes: ['processos', 'clientes', 'documentos'],
    preferencias: { notificacoesDataJud: true, resumoIaAutomatico: true, tema: 'light' }
  },
  {
    id: 'u3',
    nome: 'Camila Alencar',
    email: 'camila.alencar@juris.adv.br',
    perfil: 'assistente',
    permissoes: ['processos_read', 'tarefas'],
    preferencias: { notificacoesDataJud: true, resumoIaAutomatico: false, tema: 'light' }
  },
  {
    id: 'u4',
    nome: 'Lucas Mendes',
    email: 'lucas.mendes@juris.adv.br',
    perfil: 'estagiario',
    permissoes: ['documentos_upload', 'pesquisa'],
    preferencias: { notificacoesDataJud: false, resumoIaAutomatico: true, tema: 'light' }
  }
];

export const mockClientes: Cliente[] = [
  {
    id: 'c1',
    nome: 'TechLog Soluções em Logística LTDA',
    tipo: 'PJ',
    cpfCnpj: '12.345.678/0001-90',
    email: 'juridico@techlog.com.br',
    telefone: '(11) 98765-4321',
    endereco: {
      logradouro: 'Av. das Nações Unidas, 12901 - cj 142',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '04578-000'
    },
    historicoNotas: 'Cliente corporativo com contrato de assessoria contínua focado em Contratos Cíveis e Litígios Tributários.',
    processosVinculados: ['p1', 'p3'],
    dataCadastro: '2024-01-15',
    status: 'Ativo'
  },
  {
    id: 'c2',
    nome: 'Carlos Eduardo Silveira',
    tipo: 'PF',
    cpfCnpj: '234.567.890-11',
    email: 'carlos.silveira@email.com',
    telefone: '(11) 97123-8899',
    endereco: {
      logradouro: 'Rua Augusta, 1500 - Ap 82',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01304-001'
    },
    historicoNotas: 'Ação de indenização por danos materiais e morais contra concessionária de energia.',
    processosVinculados: ['p2'],
    dataCadastro: '2024-03-10',
    status: 'Ativo'
  },
  {
    id: 'c3',
    nome: 'Construtora Leste Forte S/A',
    tipo: 'PJ',
    cpfCnpj: '98.765.432/0001-10',
    email: 'contato@lesteforte.com.br',
    telefone: '(11) 3344-5566',
    endereco: {
      logradouro: 'Rua Vergueiro, 2300',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '04102-000'
    },
    historicoNotas: 'Acompanhamento de processos trabalhistas e contratos imobiliários de grande porte.',
    processosVinculados: ['p4'],
    dataCadastro: '2023-11-20',
    status: 'Ativo'
  }
];

export const mockProcessos: Processo[] = [
  {
    id: 'p1',
    numeroCnj: '1004523-88.2025.8.26.0100',
    tribunal: 'TJSP',
    comarca: 'São Paulo - Foro Central Cível',
    classeProcessual: 'Procedimento Comum Cível',
    assunto: 'Inadimplemento de Contrato de Prestação de Serviços',
    partes: {
      poloAtivo: 'TechLog Soluções em Logística LTDA',
      poloPassivo: 'Global Express Transportes S/A'
    },
    advogadoResponsavelId: 'u1',
    advogadoResponsavelNome: 'Dra. Helena Martins',
    clienteId: 'c1',
    clienteNome: 'TechLog Soluções em Logística LTDA',
    status: 'Ativo',
    valorCausa: 450000.00,
    ultimaSincronizacaoDataJud: '2026-07-25 18:30',
    resumoIa: 'Ação de cobrança contratual decorrente de falha logística. Réu apresentou contestação alegando caso fortuito. Réplica apresentada e aguardando saneamento do processo.',
    datasImportantes: {
      distribuicao: '2025-02-10',
      proximaAudiencia: '2026-08-12 14:00',
      prazoFatal: '2026-07-30'
    },
    documentosIds: ['d1', 'd2'],
    movimentacoes: [
      {
        id: 'm1',
        data: '2026-07-25 16:45',
        descricao: 'Conclusos ao Juiz para Decisão Saneadora / Especificação de Provas',
        orgao: '12ª Vara Cível Central',
        fonte: 'DataJud',
        relevancia: 'Alta',
        alertaIa: 'Prazo previsível para despacho de provas em 5 a 10 dias úteis.'
      },
      {
        id: 'm2',
        data: '2026-07-10 10:15',
        descricao: 'Juntada de Petição de Réplica e Documentos',
        orgao: '12ª Vara Cível Central',
        fonte: 'DataJud',
        relevancia: 'Média'
      },
      {
        id: 'm3',
        data: '2026-06-02 15:30',
        descricao: 'Juntada de Contestação com Reconvenção pelo Réu',
        orgao: '12ª Vara Cível Central',
        fonte: 'DataJud',
        relevancia: 'Alta',
        alertaIa: 'Identificada tese de exceção do contrato não cumprido (art. 476 CC).'
      }
    ]
  },
  {
    id: 'p2',
    numeroCnj: '5001290-12.2024.4.03.6100',
    tribunal: 'TRF3',
    comarca: 'São Paulo - Seção Judiciária',
    classeProcessual: 'Ação Anulatória de Débito Fiscal',
    assunto: 'Imposto sobre a Renda - Pessoas Físicas',
    partes: {
      poloAtivo: 'Carlos Eduardo Silveira',
      poloPassivo: 'União Federal (Fazenda Nacional)'
    },
    advogadoResponsavelId: 'u2',
    advogadoResponsavelNome: 'Dr. Roberto Fonseca',
    clienteId: 'c2',
    clienteNome: 'Carlos Eduardo Silveira',
    status: 'Em Recurso',
    valorCausa: 185000.00,
    ultimaSincronizacaoDataJud: '2026-07-24 09:12',
    resumoIa: 'Discussão sobre autuação fiscal indevida por omissão de rendimentos de ganho de capital. Liminar deferida parcialmente para suspender a exigibilidade do crédito.',
    datasImportantes: {
      distribuicao: '2024-06-18',
      prazoFatal: '2026-08-05'
    },
    documentosIds: ['d3'],
    movimentacoes: [
      {
        id: 'm4',
        data: '2026-07-20 11:00',
        descricao: 'Recebimento do Agravo de Instrumento com Efeito Suspensivo Parcial',
        orgao: 'Gabinete Des. Federal 3ª Turma',
        fonte: 'DataJud',
        relevancia: 'Alta',
        alertaIa: 'Garantida a não inclusão do cliente no CADIN enquanto pender o julgamento.'
      },
      {
        id: 'm5',
        data: '2026-05-14 14:20',
        descricao: 'Decisão Interlocutória Indeferindo Tutela de Urgência Integral',
        orgao: '5ª Vara Cível Federal',
        fonte: 'DataJud',
        relevancia: 'Alta'
      }
    ]
  },
  {
    id: 'p3',
    numeroCnj: '1009844-33.2025.5.02.0045',
    tribunal: 'TRT2',
    comarca: 'São Paulo - 45ª Vara do Trabalho',
    classeProcessual: 'Reclamação Trabalhista',
    assunto: 'Horas Extras e Adicional de Insalubridade',
    partes: {
      poloAtivo: 'Marcos Vinicius Santos',
      poloPassivo: 'TechLog Soluções em Logística LTDA'
    },
    advogadoResponsavelId: 'u1',
    advogadoResponsavelNome: 'Dra. Helena Martins',
    clienteId: 'c1',
    clienteNome: 'TechLog Soluções em Logística LTDA',
    status: 'Ativo',
    valorCausa: 98000.00,
    ultimaSincronizacaoDataJud: '2026-07-26 08:00',
    resumoIa: 'Ação trabalhista proposta por ex-operador logístico. Defesa apresentada comprovando rigoroso controle de ponto eletrônico e laudo PPRA zerado.',
    datasImportantes: {
      distribuicao: '2025-04-02',
      proximaAudiencia: '2026-08-20 10:30',
      prazoFatal: '2026-08-10'
    },
    documentosIds: [],
    movimentacoes: [
      {
        id: 'm6',
        data: '2026-07-22 17:00',
        descricao: 'Designação de Perícia Técnica no Local de Trabalho',
        orgao: '45ª Vara do Trabalho',
        fonte: 'DataJud',
        relevancia: 'Alta',
        alertaIa: 'Necessário indicar assistente técnico e quesitos até a data do prazo.'
      }
    ]
  }
];

export const mockDocumentos: Documento[] = [
  {
    id: 'd1',
    tipo: 'Contrato',
    nome: 'Contrato_Prestacao_Servicos_TechLog_2024.pdf',
    arquivoUrl: '#',
    tamanho: '2.4 MB',
    dataUpload: '2025-02-11',
    processoId: 'p1',
    processoNumeroCnj: '1004523-88.2025.8.26.0100',
    clienteId: 'c1',
    resumoIa: 'Contrato comercial de fornecimento de sistemas logísticos com cláusula penal de 10% por descumprimento do SLA e foro eleito em SP.',
    entidadesExtraidas: {
      datas: ['2024-01-10', '2026-01-10'],
      valores: ['R$ 450.000,00', 'Multa de 10%'],
      clausulasCriticas: ['Cláusula 12 (Multa Rescisória)', 'Cláusula 18 (Foro de SP)'],
      partesCitadas: ['TechLog Soluções', 'Global Express Transportes']
    },
    statusIa: 'analisado'
  },
  {
    id: 'd2',
    tipo: 'Petição Initial',
    nome: 'Peticao_Inicial_Cobrança_Contratual_Assinada.pdf',
    arquivoUrl: '#',
    tamanho: '1.8 MB',
    dataUpload: '2025-02-12',
    processoId: 'p1',
    processoNumeroCnj: '1004523-88.2025.8.26.0100',
    clienteId: 'c1',
    resumoIa: 'Petição inicial requerendo o pagamento integral de faturas em aberto e indenização por lucros cessantes.',
    entidadesExtraidas: {
      datas: ['2025-02-10'],
      valores: ['R$ 450.000,00'],
      clausulasCriticas: ['Art. 389 do Código Civil'],
      partesCitadas: ['TechLog', 'Global Express']
    },
    statusIa: 'analisado'
  },
  {
    id: 'd3',
    tipo: 'Sentença',
    nome: 'Decisao_Liminar_TRF3_Agravo_Instrumento.pdf',
    arquivoUrl: '#',
    tamanho: '850 KB',
    dataUpload: '2026-07-20',
    processoId: 'p2',
    processoNumeroCnj: '5001290-12.2024.4.03.6100',
    clienteId: 'c2',
    resumoIa: 'Decisão do Relator concedendo efeito suspensivo parcial para obstaculizar a inscrição no CADIN, condicionando à caução idônea.',
    entidadesExtraidas: {
      datas: ['2026-07-20'],
      valores: ['R$ 185.000,00'],
      clausulasCriticas: ['Suspensão de Exigibilidade - Art. 151 CTN'],
      partesCitadas: ['Carlos Eduardo Silveira', 'Fazenda Nacional']
    },
    statusIa: 'analisado'
  }
];

export const mockTarefas: TarefaPrazo[] = [
  {
    id: 't1',
    descricao: 'Apresentar Especificação de Provas e Indicação de Testemunhas',
    processoId: 'p1',
    processoNumeroCnj: '1004523-88.2025.8.26.0100',
    responsavelId: 'u1',
    responsavelNome: 'Dra. Helena Martins',
    dataLimite: '2026-07-30',
    prioridade: 'Urgente',
    status: 'Pendente',
    categoria: 'Prazo Processual'
  },
  {
    id: 't2',
    descricao: 'Protocolar quesitos e indicar assistente técnico para Perícia Insalubridade',
    processoId: 'p3',
    processoNumeroCnj: '1009844-33.2025.5.02.0045',
    responsavelId: 'u2',
    responsavelNome: 'Dr. Roberto Fonseca',
    dataLimite: '2026-08-10',
    prioridade: 'Alta',
    status: 'Em Andamento',
    categoria: 'Diligência'
  },
  {
    id: 't3',
    descricao: 'Audiência de Conciliação Virtual - 12ª Vara Cível',
    processoId: 'p1',
    processoNumeroCnj: '1004523-88.2025.8.26.0100',
    responsavelId: 'u1',
    responsavelNome: 'Dra. Helena Martins',
    dataLimite: '2026-08-12',
    prioridade: 'Média',
    status: 'Pendente',
    categoria: 'Audiência'
  },
  {
    id: 't4',
    descricao: 'Reunião de alinhamento estratégico com diretoria da TechLog',
    responsavelId: 'u1',
    responsavelNome: 'Dra. Helena Martins',
    dataLimite: '2026-07-28',
    prioridade: 'Média',
    status: 'Pendente',
    categoria: 'Reunião'
  }
];

export const mockKnowledgeBase = [
  {
    id: 'kb1',
    titulo: 'Tese Recursal: Prevalência do Acordo sobre a Legislação (Art. 611-A CLT)',
    area: 'Direito do Trabalho',
    resumo: 'Modelo de recurso demonstrando validade de cláusula de banco de horas e compensação de jornada avençada via negociação coletiva.',
    tags: ['CLT', 'Trabalhista', 'Banco de Horas', 'STF Tema 1046']
  },
  {
    id: 'kb2',
    titulo: 'Modelo de Réplica: Exceção do Contrato Não Cumprido em Serviços Logísticos',
    area: 'Direito Civil / Contratos',
    resumo: 'Fundamentação baseada nos artigos 476 e 477 do Código Civil quando há mora probatória do prestador e inadimplemento recíproco.',
    tags: ['Código Civil', 'Inadimplemento', 'SLA', 'Contrato']
  },
  {
    id: 'kb3',
    titulo: 'Agravo de Instrumento em Matéria Tributária: Suspensão por Fiança Bancária',
    area: 'Direito Tributário',
    resumo: 'Minuta padronizada de agravo demonstrando risco de dano irreparável em autuações do IRPF antes do esgotamento administrativo.',
    tags: ['TRF3', 'Tributário', 'CADIN', 'CTN 151']
  }
];

export const mockInboxItems: InboxJuridicoItem[] = [
  {
    id: 'inb-1',
    tipo: 'Publicação Diário Oficial',
    titulo: 'Intimação: Despacho de Especificação de Provas',
    descricao: 'DJESP - 12ª Vara Cível Central SP: Manifestarem-se as partes em 5 dias úteis sobre as provas que pretendem produzir.',
    dataHora: '2026-07-26 07:15',
    processoId: 'p1',
    processoNumeroCnj: '1004523-88.2025.8.26.0100',
    clienteNome: 'TechLog Soluções em Logística LTDA',
    classificacaoIa: 'Ação Necessária',
    sugestaoAcaoIa: 'A IA identificou prazo de 5 dias fatais. Deseja cadastrar a tarefa de especificação de testemunhas para a Dra. Helena?',
    prazoSugeridoDias: 5,
    lido: false,
    arquivado: false
  },
  {
    id: 'inb-2',
    tipo: 'Movimentação DataJud',
    titulo: 'Decisão Interlocutória de Deferimento de Liminar Parcial',
    descricao: 'TRF3 - Agravo de Instrumento: Deferida a suspensão de inscrição no CADIN condicionada à caução prestada.',
    dataHora: '2026-07-25 18:40',
    processoId: 'p2',
    processoNumeroCnj: '5001290-12.2024.4.03.6100',
    clienteNome: 'Carlos Eduardo Silveira',
    classificacaoIa: 'Importante',
    sugestaoAcaoIa: 'Decisão favorável. A IA sugere enviar mensagem explicativa ao cliente informando sobre a vitória da liminar.',
    lido: false,
    arquivado: false
  },
  {
    id: 'inb-3',
    tipo: 'E-mail Cliente',
    titulo: 'Solicitação de Atualização: Processo Trabalhista Construtora Leste Forte',
    descricao: 'Diretoria enviou mensagem solicitando o status atualizado da perícia de insalubridade e valorProvisionado.',
    dataHora: '2026-07-25 15:10',
    processoId: 'p3',
    processoNumeroCnj: '1009844-33.2025.5.02.0045',
    clienteNome: 'Construtora Leste Forte S/A',
    classificacaoIa: 'Importante',
    sugestaoAcaoIa: 'Gerar resumo executivo via IA com 1-clique e enviar resposta por e-mail.',
    lido: true,
    arquivado: false
  },
  {
    id: 'inb-4',
    tipo: 'Documento Recebido',
    titulo: 'Laudo Pericial Prévio de Engenharia do Perito Judicial',
    descricao: 'Anexado ao e-SAJ pelo Perito nomeado Dr. Marcelo Viana. Conclusão desfavorável quanto ao nexo causal.',
    dataHora: '2026-07-24 11:20',
    processoId: 'p1',
    processoNumeroCnj: '1004523-88.2025.8.26.0100',
    clienteNome: 'TechLog Soluções',
    classificacaoIa: 'Ação Necessária',
    sugestaoAcaoIa: 'Atenção! Conclusão do laudo é desfavorável. Sugerida impugnação técnica e indicação de assistente técnico.',
    prazoSugeridoDias: 15,
    lido: false,
    arquivado: false
  },
  {
    id: 'inb-5',
    tipo: 'Movimentação DataJud',
    titulo: 'Juntada de Comprovante de Pagamento de Custas',
    descricao: 'Comprovante de taxa judiciária relativo à apelação juntado pela parte contrária.',
    dataHora: '2026-07-23 09:30',
    processoId: 'p2',
    processoNumeroCnj: '5001290-12.2024.4.03.6100',
    clienteNome: 'Carlos Eduardo Silveira',
    classificacaoIa: 'Pode Esperar',
    sugestaoAcaoIa: 'Mero andamento burocrático sem necessidade de providência urgente.',
    lido: true,
    arquivado: false
  }
];

export const mockMemoriaJuridica: MemoriaJuridicaItem[] = [
  {
    id: 'mem-1',
    titulo: 'Tese Recursal de Inadimplemento SLA Logístico',
    categoria: 'Estratégia Vencedora',
    tribunalOuOrgao: 'TJSP 2ª Câmara de Direito Privado',
    descricao: 'Argumentação consagrada no escritório demonstrando que mora reiterada acima de 15 dias afasta a exceção do contrato não cumprido alegada pelo fornecedor.',
    mencionadaEmProcessosCount: 14,
    dataAdicao: '2024-05-10',
    tags: ['Logística', 'SLA', 'Direito Civil', 'Inadimplemento']
  },
  {
    id: 'mem-2',
    titulo: 'Ação Anulatória IRPF com Caução em Fiança Bancária',
    categoria: 'Decisão Favorável',
    tribunalOuOrgao: 'TRF3 4ª Turma',
    descricao: 'Precedente obtido pela Dra. Helena onde se aceitou fiança bancária no montante exato do tributo corrigido, obstando a inscrição no CADIN.',
    mencionadaEmProcessosCount: 8,
    dataAdicao: '2025-01-20',
    tags: ['Tributário', 'CADIN', 'Fiança Bancária', 'Liminar']
  },
  {
    id: 'mem-3',
    titulo: 'Modelo de Cláusula de Eleição de Foro e Mediação Prévia',
    categoria: 'Cláusula Padronizada',
    tribunalOuOrgao: 'Escritório Geral',
    descricao: 'Cláusula contratual obrigatória para clientes PJ prevendo mediação privada antes da distribuição de qualquer ação rescisória.',
    mencionadaEmProcessosCount: 32,
    dataAdicao: '2023-09-15',
    tags: ['Contratos', 'Cláusula Padrão', 'Foro', 'Arbitragem']
  }
];

