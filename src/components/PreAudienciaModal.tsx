import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Scale, 
  Clock, 
  ShieldAlert, 
  HelpCircle, 
  FileText, 
  Copy, 
  Check, 
  Download,
  BookOpen
} from 'lucide-react';
import { Processo, DossieAudiencia } from '../types';

interface PreAudienciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  processo: Processo | null;
}

export const PreAudienciaModal: React.FC<PreAudienciaModalProps> = ({
  isOpen,
  onClose,
  processo,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'resumo' | 'perguntas' | 'riscos' | 'docs'>('resumo');

  if (!isOpen || !processo) return null;

  // Generate intelligent mock dossier for the given process
  const dossie: DossieAudiencia = {
    processoId: processo.id,
    processoNumeroCnj: processo.numeroCnj,
    partes: `${processo.partes.poloAtivo} x ${processo.partes.poloPassivo}`,
    dataAudiencia: processo.datasImportantes.proximaAudiencia || '2026-08-12 às 14:00',
    varaTribunal: `${processo.comarca} - ${processo.tribunal}`,
    resumoCaso: `Ação de ${processo.assunto} onde o autor (${processo.partes.poloAtivo}) sustenta inadimplemento de cláusula contratual e prejuízos operacionais acumulados de R$ ${processo.valorCausa.toLocaleString('pt-BR')}. A parte ré contestou alegando caso fortuito.`,
    linhaTempoFatos: [
      { data: '15/01/2024', evento: 'Assinatura do contrato principal entre as partes com SLA estipulado.' },
      { data: '02/11/2024', evento: 'Primeiro registro formal de atraso na prestação de serviço por e-mail.' },
      { data: '10/02/2025', evento: 'Ajuizamento da Petição Inicial com requerimento de liminar.' },
      { data: '02/06/2026', evento: 'Apresentação de contestação com réplica em seguida.' },
    ],
    pontosFortes: [
      'Notificações extrajudiciais comprovam a mora reiterada por mais de 45 dias.',
      'Testemunha confirma que o réu foi alertado sobre a urgência das entregas.',
      'Inexistência de prova de força maior ou caso fortuito anexada pela ré.'
    ],
    pontosFracosRiscos: [
      'Ausência de notificação por carta registrada em um dos eventos de mora.',
      'Réu alega que flutuações cambiais inviabilizaram os prazos de transporte.',
      'Possível pedido de perícia técnica que pode prorrogar o julgamento.'
    ],
    perguntasTestemunhas: [
      'Qual era a frequência habitual das entregas acordadas e quem fiscalizava o recebimento?',
      'O réu enviou algum comunicado por escrito justificando o atraso no dia do ocorrido?',
      'Existia alternativa operacional para evitar o colapso na cadeia de suprimentos?'
    ],
    perguntasParteContraria: [
      'O senhor confirma que recebeu os e-mails de cobrança nos dias 02/11 e 15/11 sem responder?',
      'Qual providência concreta a empresa tomou imediatamente após a ciência da falha?'
    ],
    documentosRelevantes: [
      'Contrato de Prestação de Serviços (Fls. 15-28)',
      'Troca de E-mails e Notificação Extrajudicial (Fls. 45-60)',
      'Laudo de Apuração de Prejuízos Operacionais (Fls. 112-130)'
    ],
    jurisprudenciaTese: 'Súmula do TJSP e Precedentes do STJ: A inexecução culposa de contrato de transporte e logística sujeita o infror ao ressarcimento dos lucros cessantes comprovados.'
  };

  const handleCopyDossie = () => {
    const textToCopy = `
==================================================
DOSSIÊ PRÉ-AUDIÊNCIA - JURISMART OS AI
==================================================
Processo CNJ: ${dossie.processoNumeroCnj}
Partes: ${dossie.partes}
Data/Hora: ${dossie.dataAudiencia}
Órgão Julgador: ${dossie.varaTribunal}

RESUMO EXECUTIVO DO CASO:
${dossie.resumoCaso}

PONTOS FORTES PARA A ENFATIZAR:
${dossie.pontosFortes.map((p, i) => `${i + 1}. ${p}`).join('\n')}

PONTOS FRACOS E RISCOS DA PARTE CONTRÁRIA:
${dossie.pontosFracosRiscos.map((p, i) => `${i + 1}. ${p}`).join('\n')}

PERGUNTAS RECOMENDADAS PARA TESTEMUNHAS:
${dossie.perguntasTestemunhas.map((p, i) => `[ ] ${i + 1}. ${p}`).join('\n')}

DOCUMENTOS CHAVE PARA MANUSEAR:
${dossie.documentosRelevantes.map((d) => `- ${d}`).join('\n')}
==================================================
    `;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 font-mono">
                  Copiloto de Audiência IA
                </span>
                <span className="text-xs text-slate-300 font-mono">{dossie.dataAudiencia}</span>
              </div>
              <h3 className="text-base font-bold tracking-tight">
                Dossiê Estratégico de Audiência - CNJ {dossie.processoNumeroCnj}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap scrollbar-none pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('resumo')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                activeTab === 'resumo' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Linha do Tempo & Resumo
            </button>
            <button
              onClick={() => setActiveTab('perguntas')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                activeTab === 'perguntas' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Perguntas para Testemunhas
            </button>
            <button
              onClick={() => setActiveTab('riscos')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                activeTab === 'riscos' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Pontos Fortes & Riscos
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer shrink-0 ${
                activeTab === 'docs' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Documentos & Tese
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyDossie}
              className="w-full sm:w-auto px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Dossiê Completo'}</span>
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
          {activeTab === 'resumo' && (
            <div className="space-y-6">
              {/* Partes & Vara Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 font-mono">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block">Partes do Processo</span>
                  <span className="text-slate-900 font-semibold">{dossie.partes}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-700 block">Juízo / Vara</span>
                  <span className="text-slate-900 font-semibold">{dossie.varaTribunal}</span>
                </div>
              </div>

              {/* Resumo do Caso */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  <span>Resumo Sintético para a Audiência</span>
                </h4>
                <p className="p-4 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed font-sans">
                  {dossie.resumoCaso}
                </p>
              </div>

              {/* Linha do Tempo dos Fatos */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Linha do Tempo dos Fatos e Provas</span>
                </h4>
                <div className="space-y-2 pl-2 border-l-2 border-indigo-200 ml-2">
                  {dossie.linhaTempoFatos.map((item, idx) => (
                    <div key={idx} className="relative pl-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 absolute -left-[19px] top-1 border-2 border-white"></div>
                      <span className="text-[10px] font-bold text-indigo-700 font-mono block">{item.data}</span>
                      <p className="text-xs text-slate-800 font-medium">{item.evento}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'perguntas' && (
            <div className="space-y-6">
              {/* Perguntas Testemunhas */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>Roteiro de Perguntas para Testemunhas Sugeridas pela IA</span>
                </h4>
                <div className="space-y-2">
                  {dossie.perguntasTestemunhas.map((p, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <p className="font-medium text-slate-800 pt-0.5">{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Depoimento Pessoal Parte Contraria */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Inquiridores / Depoimento Pessoal da Parte Contrária</span>
                </h4>
                <div className="space-y-2">
                  {dossie.perguntasParteContraria.map((p, idx) => (
                    <div key={idx} className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <p className="font-medium text-amber-950 pt-0.5">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'riscos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pontos Fortes */}
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/80 space-y-3">
                <h4 className="font-bold text-emerald-900 flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Pontos Fortes a Enfatizar</span>
                </h4>
                <ul className="space-y-2">
                  {dossie.pontosFortes.map((p, idx) => (
                    <li key={idx} className="text-xs text-emerald-950 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pontos Fracos & Riscos */}
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-200/80 space-y-3">
                <h4 className="font-bold text-red-900 flex items-center gap-2 text-sm">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Pontos Fracos & Refutações</span>
                </h4>
                <ul className="space-y-2">
                  {dossie.pontosFracosRiscos.map((p, idx) => (
                    <li key={idx} className="text-xs text-red-950 flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6">
              {/* Documentos Relevantes */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Documentos Chave no Processo</span>
                </h4>
                <div className="space-y-2">
                  {dossie.documentosRelevantes.map((doc, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 flex items-center justify-between">
                      <span>{doc}</span>
                      <span className="text-[10px] text-indigo-600 font-sans font-semibold">Anexado e Analisado</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jurisprudencia e Tese Principal */}
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-200 space-y-2">
                <h4 className="font-bold text-indigo-950 flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Tese e Jurisprudência Norteadora</span>
                </h4>
                <p className="text-xs text-indigo-900 leading-relaxed font-sans">
                  {dossie.jurisprudenciaTese}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">Dossiê pré-audiência gerado com contexto total dos autos do DataJud.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
          >
            Pronto para Audiência
          </button>
        </div>
      </div>
    </div>
  );
};
