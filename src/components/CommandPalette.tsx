import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Users, FileText, CalendarCheck, Sparkles, X } from 'lucide-react';
import { Processo, Cliente, Documento, TarefaPrazo } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  processos: Processo[];
  clientes: Cliente[];
  documentos: Documento[];
  tarefas: TarefaPrazo[];
  onSelectTab: (tab: string) => void;
  onSelectProcesso?: (p: Processo) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  processos,
  clientes,
  documentos,
  tarefas,
  onSelectTab,
  onSelectProcesso,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProcessos = processos.filter(
    (p) =>
      p.numeroCnj.toLowerCase().includes(query.toLowerCase()) ||
      p.assunto.toLowerCase().includes(query.toLowerCase()) ||
      p.partes.poloAtivo.toLowerCase().includes(query.toLowerCase()) ||
      p.partes.poloPassivo.toLowerCase().includes(query.toLowerCase())
  );

  const filteredClientes = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(query.toLowerCase()) ||
      c.cpfCnpj.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = documentos.filter(
    (d) =>
      d.nome.toLowerCase().includes(query.toLowerCase()) ||
      d.tipo.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTarefas = tarefas.filter(
    (t) =>
      t.descricao.toLowerCase().includes(query.toLowerCase()) ||
      t.categoria.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Input Header */}
        <div className="p-3 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Digite para buscar processos, CNJ, clientes, documentos ou ações..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4 text-xs">
          {/* Quick AI Action */}
          <div className="px-2 pt-1">
            <button
              onClick={() => {
                onSelectTab('assistente-ia');
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-900 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-xs">Perguntar ao Assistente IA Gemini</p>
                <p className="text-[11px] text-indigo-700 font-normal">Analisar contratos, gerar minutas ou resumos processuais</p>
              </div>
            </button>
          </div>

          {/* Processos */}
          {filteredProcessos.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-slate-500" /> Processos ({filteredProcessos.length})
              </div>
              <div className="space-y-1">
                {filteredProcessos.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (onSelectProcesso) onSelectProcesso(p);
                      onSelectTab('processos');
                      onClose();
                    }}
                    className="p-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <p className="font-mono font-medium text-indigo-700">{p.numeroCnj}</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-md">{p.partes.poloAtivo} x {p.partes.poloPassivo}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-600 border border-slate-200">
                      {p.tribunal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clientes */}
          {filteredClientes.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-slate-500" /> Clientes ({filteredClientes.length})
              </div>
              <div className="space-y-1">
                {filteredClientes.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectTab('clientes');
                      onClose();
                    }}
                    className="p-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{c.nome}</p>
                      <p className="text-slate-500 text-[11px] font-mono">{c.cpfCnpj} • {c.email}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.tipo}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documentos */}
          {filteredDocs.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-slate-500" /> Documentos ({filteredDocs.length})
              </div>
              <div className="space-y-1">
                {filteredDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      onSelectTab('documentos');
                      onClose();
                    }}
                    className="p-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{d.nome}</p>
                      <p className="text-slate-500 text-[11px]">{d.tipo} • {d.tamanho}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      IA Analisado
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tarefas */}
          {filteredTarefas.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CalendarCheck className="w-3 h-3 text-slate-500" /> Tarefas & Prazos ({filteredTarefas.length})
              </div>
              <div className="space-y-1">
                {filteredTarefas.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTab('prazos');
                      onClose();
                    }}
                    className="p-2 rounded-md hover:bg-slate-100 cursor-pointer flex items-center justify-between text-slate-700"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{t.descricao}</p>
                      <p className="text-slate-500 text-[11px]">Prazo: {t.dataLimite} • Resp: {t.responsavelNome}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                      t.prioridade === 'Urgente' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {t.prioridade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query &&
            filteredProcessos.length === 0 &&
            filteredClientes.length === 0 &&
            filteredDocs.length === 0 &&
            filteredTarefas.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <p>Nenhum resultado encontrado para "{query}".</p>
                <p className="text-[11px] mt-1 text-slate-400">Tente buscar por CNJ, nome de cliente ou tipo de documento.</p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 shadow-2xs font-mono">ESC</kbd>
            <span>para fechar</span>
          </div>
          <span className="font-mono text-[10px]">JuriSmart OS v2026.1</span>
        </div>
      </div>
    </div>
  );
};
