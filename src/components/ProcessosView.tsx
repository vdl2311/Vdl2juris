import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Briefcase, 
  Clock, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  X, 
  Scale, 
  User, 
  DollarSign, 
  ChevronRight,
  Loader2,
  CheckCircle2,
  Gavel
} from 'lucide-react';
import { Processo, Documento } from '../types';
import { PreAudienciaModal } from './PreAudienciaModal';

interface ProcessosViewProps {
  processos: Processo[];
  documentos: Documento[];
  selectedProcesso: Processo | null;
  onSelectProcesso: (p: Processo | null) => void;
  onOpenNewProcessModal: () => void;
  onUpdateProcessoResumo: (processoId: string, resumo: string) => void;
}

export const ProcessosView: React.FC<ProcessosViewProps> = ({
  processos,
  documentos,
  selectedProcesso,
  onSelectProcesso,
  onOpenNewProcessModal,
  onUpdateProcessoResumo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tribunalFilter, setTribunalFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [drawerTab, setDrawerTab] = useState<'timeline' | 'partes' | 'documentos' | 'ia'>('timeline');
  const [isGeneratingIaSummary, setIsGeneratingIaSummary] = useState(false);
  const [iaSummaryResult, setIaSummaryResult] = useState<string | null>(null);

  // Pre-Audiência Modal state
  const [isPreAudienciaOpen, setIsPreAudienciaOpen] = useState(false);
  const [processoParaAudiencia, setProcessoParaAudiencia] = useState<Processo | null>(null);

  const filteredProcessos = processos.filter((p) => {
    const matchesSearch =
      p.numeroCnj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partes.poloAtivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partes.poloPassivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clienteNome.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTribunal = tribunalFilter === 'todos' || p.tribunal.toLowerCase() === tribunalFilter.toLowerCase();
    const matchesStatus = statusFilter === 'todos' || p.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesTribunal && matchesStatus;
  });

  const handleGenerateIaSummary = async (p: Processo) => {
    setIsGeneratingIaSummary(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Forneça um resumo executivo sintetizado e estratégico para o processo CNJ ${p.numeroCnj}, referente a ${p.assunto}. Analise os riscos, principais movimentações recentes e recomende os próximos passos táticos.`,
          context: JSON.stringify({
            cnj: p.numeroCnj,
            tribunal: p.tribunal,
            partes: p.partes,
            movimentacoes: p.movimentacoes,
            valorCausa: p.valorCausa,
          }),
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setIaSummaryResult(data.reply);
        onUpdateProcessoResumo(p.id, data.reply);
      }
    } catch (err) {
      console.error('Erro ao gerar resumo de IA do processo:', err);
      setIaSummaryResult('Não foi possível se conectar ao servidor da IA Gemini.');
    } finally {
      setIsGeneratingIaSummary(false);
    }
  };

  const handleOpenAudienciaCopilot = (p: Processo, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProcessoParaAudiencia(p);
    setIsPreAudienciaOpen(true);
  };

  const docsDoProcesso = selectedProcesso
    ? documentos.filter((d) => d.processoId === selectedProcesso.id)
    : [];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span>Gestão de Processos & DataJud CNJ</span>
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhamento automatizado de processos nos tribunais brasileiros com atualização de movimentações.
          </p>
        </div>

        <button
          onClick={onOpenNewProcessModal}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Importar CNJ / Novo Processo</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por número CNJ, parte, assunto ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Tribunal Select */}
          <select
            aria-label="Filtrar por tribunal"
            value={tribunalFilter}
            onChange={(e) => setTribunalFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Tribunais</option>
            <option value="tjsp">TJSP (Estadual SP)</option>
            <option value="trf3">TRF3 (Federal 3ª Região)</option>
            <option value="trt2">TRT2 (Trabalhista SP)</option>
            <option value="stj">STJ</option>
          </select>

          {/* Status Select */}
          <select
            aria-label="Filtrar por status do processo"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="em recurso">Em Recurso</option>
            <option value="arquivado">Arquivado</option>
            <option value="suspenso">Suspenso</option>
          </select>
        </div>
      </div>

      {/* Process Table List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Número CNJ / Tribunal</th>
                <th className="py-3 px-4">Partes (Ativo x Passivo)</th>
                <th className="py-3 px-4">Classe & Assunto</th>
                <th className="py-3 px-4">Advogado Resp.</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Última Sincronização</th>
                <th className="py-3 px-4 text-right">Ação / Copiloto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {filteredProcessos.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => {
                    onSelectProcesso(p);
                    setIaSummaryResult(p.resumoIa || null);
                  }}
                  className="hover:bg-indigo-50/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="font-mono font-semibold text-indigo-700 group-hover:underline">
                      {p.numeroCnj}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {p.tribunal}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{p.comarca}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{p.partes.poloAtivo}</div>
                    <div className="text-[11px] text-slate-500">vs {p.partes.poloPassivo}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{p.classeProcessual}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[180px]">{p.assunto}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {p.advogadoResponsavelNome}
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      p.status === 'Ativo'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : p.status === 'Em Recurso'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {p.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                    {p.ultimaSincronizacaoDataJud}
                  </td>

                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={(e) => handleOpenAudienciaCopilot(p, e)}
                      title="Copiloto de Audiência: Gerar Dossiê da Audiência em 1 clique"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-semibold rounded border border-amber-200 transition-colors cursor-pointer"
                    >
                      <Gavel className="w-3.5 h-3.5 text-amber-600" />
                      <span>Preparar Audiência</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProcessos.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Nenhum processo localizado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROCESS DETAIL DRAWER / MODAL */}
      {selectedProcesso && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-mono">
                    {selectedProcesso.tribunal}
                  </span>
                  <span className="text-xs text-slate-300">{selectedProcesso.classeProcessual}</span>
                </div>
                <h3 className="text-lg font-bold font-mono text-white mt-1">{selectedProcesso.numeroCnj}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{selectedProcesso.assunto}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAudienciaCopilot(selectedProcesso)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Preparar Audiência</span>
                </button>
                <button
                  onClick={() => onSelectProcesso(null)}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200 bg-slate-50 px-2 sm:px-4 overflow-x-auto whitespace-nowrap scrollbar-none">
              <button
                onClick={() => setDrawerTab('timeline')}
                className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  drawerTab === 'timeline'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Movimentações DataJud ({selectedProcesso.movimentacoes.length})</span>
              </button>

              <button
                onClick={() => setDrawerTab('partes')}
                className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  drawerTab === 'partes'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Partes & Detalhes</span>
              </button>

              <button
                onClick={() => setDrawerTab('documentos')}
                className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  drawerTab === 'documentos'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Documentos ({docsDoProcesso.length})</span>
              </button>

              <button
                onClick={() => setDrawerTab('ia')}
                className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  drawerTab === 'ia'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Resumo & Análise IA</span>
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {drawerTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Histórico do Processo</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Última atualização: {selectedProcesso.ultimaSincronizacaoDataJud}</span>
                  </div>

                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
                    {selectedProcesso.movimentacoes.map((mov) => (
                      <div key={mov.id} className="relative pl-8 space-y-1">
                        <div className="absolute left-2 top-1.5 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white"></div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-800">{mov.descricao}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{mov.data}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Órgão: {mov.orgao}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700">
                              {mov.fonte}
                            </span>
                          </div>
                          {mov.alertaIa && (
                            <div className="mt-2 p-2 bg-purple-50 border border-purple-100 rounded text-[11px] text-purple-900 flex items-start gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                              <span>{mov.alertaIa}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === 'partes' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Polo Ativo (Autor)</span>
                      <p className="font-semibold text-slate-800">{selectedProcesso.partes.poloAtivo}</p>
                      <p className="text-[11px] text-slate-500">Cliente Vinculado: {selectedProcesso.clienteNome}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Polo Passivo (Réu)</span>
                      <p className="font-semibold text-slate-800">{selectedProcesso.partes.poloPassivo}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <h5 className="font-bold text-slate-800 text-xs">Informações Processuais</h5>
                    <div className="grid grid-cols-2 gap-3 text-slate-700">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Valor da Causa:</span>
                        <span className="font-semibold text-slate-900 font-mono">
                          R$ {selectedProcesso.valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Comarca / Foro:</span>
                        <span className="font-medium text-slate-800">{selectedProcesso.comarca}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Advogado Responsável:</span>
                        <span className="font-medium text-slate-800">{selectedProcesso.advogadoResponsavelNome}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Data de Distribuição:</span>
                        <span className="font-mono text-slate-800">{selectedProcesso.datasImportantes.distribuicao}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'documentos' && (
                <div className="space-y-3 text-xs">
                  {docsDoProcesso.length > 0 ? (
                    docsDoProcesso.map((doc) => (
                      <div key={doc.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800">{doc.nome}</p>
                            <p className="text-[11px] text-slate-500">{doc.tipo} • {doc.tamanho}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {doc.statusIa}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      Nenhum documento anexado a este processo ainda.
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'ia' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        Análise de Inteligência Artificial Gemini
                      </h5>
                      <p className="text-[11px] text-slate-500">Resumo executivo, pontos de atenção e sugestões de conduta.</p>
                    </div>

                    <button
                      onClick={() => handleGenerateIaSummary(selectedProcesso)}
                      disabled={isGeneratingIaSummary}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-1.5 rounded-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingIaSummary ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Analisando...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Atualizar Resumo IA</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 leading-relaxed text-slate-800 whitespace-pre-line">
                    {iaSummaryResult || selectedProcesso.resumoIa || (
                      <span className="text-slate-400 italic">
                        Clique em "Atualizar Resumo IA" para gerar a análise em tempo real usando o modelo Gemini 3.6-flash.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Copiloto Pré-Audiência Modal */}
      <PreAudienciaModal
        isOpen={isPreAudienciaOpen}
        onClose={() => setIsPreAudienciaOpen(false)}
        processo={processoParaAudiencia}
      />
    </div>
  );
};
