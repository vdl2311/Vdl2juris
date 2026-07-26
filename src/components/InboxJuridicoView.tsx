import React, { useState } from 'react';
import { 
  Inbox, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Mail, 
  FileText, 
  Scale, 
  Send, 
  Calendar, 
  ArrowRight,
  Filter,
  UserCheck,
  Check
} from 'lucide-react';
import { InboxJuridicoItem, Processo } from '../types';

interface InboxJuridicoViewProps {
  inboxItems: InboxJuridicoItem[];
  processos: Processo[];
  onToggleRead: (id: string) => void;
  onArchive: (id: string) => void;
  onNavigateToProcess?: (processoId: string) => void;
  onNavigateToAiChat?: (prompt: string) => void;
}

export const InboxJuridicoView: React.FC<InboxJuridicoViewProps> = ({
  inboxItems,
  processos,
  onToggleRead,
  onArchive,
  onNavigateToProcess,
  onNavigateToAiChat
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'Ação Necessária' | 'Importante' | 'Pode Esperar'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>(inboxItems[0]?.id || '');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const filteredItems = inboxItems.filter((item) => {
    if (item.arquivado) return false;
    if (activeFilter !== 'all' && item.classificacaoIa !== activeFilter) return false;
    if (typeFilter !== 'all' && item.tipo !== typeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        item.titulo.toLowerCase().includes(q) ||
        item.descricao.toLowerCase().includes(q) ||
        item.processoNumeroCnj?.toLowerCase().includes(q) ||
        item.clienteNome?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedItem = inboxItems.find((i) => i.id === selectedItemId) || filteredItems[0];

  const handleQuickAction = (actionName: string) => {
    setActionSuccessMsg(`Ação executada com sucesso: "${actionName}"! A IA registrou o evento.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 font-mono">
              Caixa de Entrada Unificada
            </span>
            <span className="text-xs text-slate-400">Classificação Automática por Gemini IA</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Inbox Jurídico Inteligente</h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Estilo Gmail + Notion. Todas as publicações do Diário Oficial, intimações e movimentações do DataJud unificadas e filtradas por criticidade real.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-800/80 p-3 rounded-lg border border-slate-700">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>{inboxItems.filter((i) => i.classificacaoIa === 'Ação Necessária' && !i.arquivado).length} Ações Críticas</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">
            {inboxItems.filter((i) => !i.lido).length} não lidos
          </span>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 font-bold hover:underline">
            Ok
          </button>
        </div>
      )}

      {/* Main Inbox Layout: Left List + Right Preview/Actions Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left Column: Inbox List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Buscar publicações, CNJ ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Classification Tabs */}
            <div className="flex items-center gap-1 text-[11px]">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Todas ({inboxItems.filter((i) => !i.arquivado).length})
              </button>
              <button
                onClick={() => setActiveFilter('Ação Necessária')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'Ação Necessária'
                    ? 'bg-red-600 text-white font-semibold'
                    : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                Ação ({inboxItems.filter((i) => i.classificacaoIa === 'Ação Necessária' && !i.arquivado).length})
              </button>
              <button
                onClick={() => setActiveFilter('Importante')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'Importante'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                Importante
              </button>
              <button
                onClick={() => setActiveFilter('Pode Esperar')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  activeFilter === 'Pode Esperar'
                    ? 'bg-slate-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                Espera
              </button>
            </div>
          </div>

          {/* List of Inbox Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[520px]">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                Nenhum item encontrado nesta categoria.
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.id === selectedItem?.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`p-3.5 transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-indigo-50/90 border-l-4 border-l-indigo-600'
                        : item.lido
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-amber-50/20 font-semibold hover:bg-amber-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono bg-slate-100 text-slate-600 border-slate-200">
                        {item.tipo}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">{item.dataHora}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-900 leading-snug line-clamp-1">
                      {item.titulo}
                    </h4>

                    <p className="text-[11px] text-slate-600 line-clamp-2 font-normal leading-relaxed">
                      {item.descricao}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      {item.processoNumeroCnj && (
                        <span className="font-mono text-indigo-700 font-medium">
                          {item.processoNumeroCnj}
                        </span>
                      )}
                      <span
                        className={`font-bold px-1.5 py-0.2 rounded border ${
                          item.classificacaoIa === 'Ação Necessária'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : item.classificacaoIa === 'Importante'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {item.classificacaoIa}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Item Detail & AI Action Studio (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-6 flex flex-col justify-between space-y-6">
          {selectedItem ? (
            <div className="space-y-6">
              {/* Item Header */}
              <div className="border-b border-slate-100 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedItem.classificacaoIa === 'Ação Necessária'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : selectedItem.classificacaoIa === 'Importante'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    Classificação IA: {selectedItem.classificacaoIa}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRead(selectedItem.id)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 cursor-pointer"
                    >
                      {selectedItem.lido ? 'Marcar não lido' : 'Marcar como lido'}
                    </button>
                    <button
                      onClick={() => onArchive(selectedItem.id)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 cursor-pointer"
                    >
                      Arquivar
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900">{selectedItem.titulo}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div><strong>Origem:</strong> {selectedItem.tipo}</div>
                  <div>•</div>
                  <div><strong>Data:</strong> {selectedItem.dataHora}</div>
                  {selectedItem.processoNumeroCnj && (
                    <>
                      <div>•</div>
                      <div><strong>Processo CNJ:</strong> {selectedItem.processoNumeroCnj}</div>
                    </>
                  )}
                  {selectedItem.clienteNome && (
                    <>
                      <div>•</div>
                      <div><strong>Cliente:</strong> {selectedItem.clienteNome}</div>
                    </>
                  )}
                </div>
              </div>

              {/* Item Content */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Conteúdo do Evento / Publicação
                </h4>
                <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line">
                  {selectedItem.descricao}
                </div>
              </div>

              {/* AI Copilot Recommended Actions Box */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl border border-indigo-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <h4 className="text-xs font-bold text-indigo-950">Ação Recomendada pela IA</h4>
                  </div>
                  {selectedItem.prazoSugeridoDias && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200 font-mono">
                      Prazo Sugerido: {selectedItem.prazoSugeridoDias} dias úteis
                    </span>
                  )}
                </div>

                <p className="text-xs text-indigo-900 leading-relaxed">
                  {selectedItem.sugestaoAcaoIa}
                </p>

                {/* Automation Buttons Row */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleQuickAction(`Criar tarefa e prazo automático de ${selectedItem.prazoSugeridoDias || 5} dias`)}
                    className="flex items-center justify-center gap-1.5 p-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Criar Tarefa & Prazo</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToAiChat) {
                        onNavigateToAiChat(`Elabore uma resposta ou tese jurídica com base nesta publicação: "${selectedItem.titulo} - ${selectedItem.descricao}"`);
                      } else {
                        handleQuickAction('Rascunhar réplica/petição no assistente IA');
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 p-2 bg-white hover:bg-slate-100 text-indigo-900 border border-indigo-300 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sugerir Petição com IA</span>
                  </button>

                  <button
                    onClick={() => handleQuickAction(`Aviso enviado ao cliente ${selectedItem.clienteNome || ''}`)}
                    className="flex items-center justify-center gap-1.5 p-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Avisar Cliente</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Selecione uma publicação na lista ao lado para visualizar os detalhes e ações da IA.
            </div>
          )}

          {/* Footer Navigation */}
          {selectedItem?.processoId && onNavigateToProcess && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Processo vinculado: {selectedItem.processoNumeroCnj}</span>
              <button
                onClick={() => onNavigateToProcess(selectedItem.processoId!)}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Abrir ficha completa do processo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
