import React, { useState } from 'react';
import { CalendarCheck, Plus, CheckCircle2, Clock, AlertTriangle, User, Filter } from 'lucide-react';
import { TarefaPrazo, UserProfile } from '../types';

interface TarefasViewProps {
  tarefas: TarefaPrazo[];
  users: UserProfile[];
  onToggleTarefaStatus: (id: string) => void;
  onAddTarefa: (tarefa: TarefaPrazo) => void;
}

export const TarefasView: React.FC<TarefasViewProps> = ({
  tarefas,
  users,
  onToggleTarefaStatus,
  onAddTarefa,
}) => {
  const [filterCategory, setFilterCategory] = useState('todas');
  const [filterPriority, setFilterPriority] = useState('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newDesc, setNewDesc] = useState('');
  const [newRespId, setNewRespId] = useState(users[0]?.id || 'u1');
  const [newDataLimite, setNewDataLimite] = useState('2026-08-05');
  const [newPrioridade, setNewPrioridade] = useState<'Urgente' | 'Alta' | 'Média' | 'Baixa'>('Alta');
  const [newCategoria, setNewCategoria] = useState<'Prazo Processual' | 'Audiência' | 'Diligência' | 'Reunião'>('Prazo Processual');

  const filteredTarefas = tarefas.filter((t) => {
    const matchesCategory = filterCategory === 'todas' || t.categoria.toLowerCase() === filterCategory.toLowerCase();
    const matchesPriority = filterPriority === 'todas' || t.prioridade.toLowerCase() === filterPriority.toLowerCase();
    return matchesCategory && matchesPriority;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc) return;

    const assignedUser = users.find((u) => u.id === newRespId);

    const task: TarefaPrazo = {
      id: `t${Date.now()}`,
      descricao: newDesc,
      responsavelId: newRespId,
      responsavelNome: assignedUser?.nome || 'Advogado Responsável',
      dataLimite: newDataLimite,
      prioridade: newPrioridade,
      status: 'Pendente',
      categoria: newCategoria,
    };

    onAddTarefa(task);
    setIsModalOpen(false);
    setNewDesc('');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-indigo-600" />
            <span>Controle de Prazos Processuais & Tarefas</span>
          </h2>
          <p className="text-xs text-slate-500">
            Agenda centralizada de prazos fatais, audiências e diligências com atribuição de responsáveis e alertas.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Prazo</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="flex items-center gap-2 w-full md:w-auto text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-600">Filtrar por:</span>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            aria-label="Filtrar por categoria de prazo"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="todas">Todas as Categorias</option>
            <option value="prazo processual">Prazo Processual</option>
            <option value="audiência">Audiência</option>
            <option value="diligência">Diligência</option>
            <option value="reunião">Reunião</option>
          </select>

          <select
            aria-label="Filtrar por prioridade"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="todas">Todas as Prioridades</option>
            <option value="urgente">Urgente</option>
            <option value="alta">Alta</option>
            <option value="média">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>
      </div>

      {/* Task List / Board */}
      <div className="space-y-3">
        {filteredTarefas.map((tarefa) => (
          <div
            key={tarefa.id}
            className={`p-4 bg-white rounded-xl border transition-all flex items-start justify-between gap-4 shadow-2xs ${
              tarefa.status === 'Concluído'
                ? 'opacity-60 bg-slate-50 border-slate-200'
                : 'border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <button
                onClick={() => onToggleTarefaStatus(tarefa.id)}
                className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors cursor-pointer ${
                  tarefa.status === 'Concluído'
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 hover:border-indigo-500 bg-white'
                }`}
              >
                {tarefa.status === 'Concluído' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-xs font-semibold ${tarefa.status === 'Concluído' ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {tarefa.descricao}
                  </h4>
                  {tarefa.processoNumeroCnj && (
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                      CNJ: {tarefa.processoNumeroCnj}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" /> {tarefa.responsavelNome}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-slate-600">Cat: {tarefa.categoria}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-900 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tarefa.dataLimite}</span>
                </div>
                <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border mt-0.5 ${
                  tarefa.prioridade === 'Urgente'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {tarefa.prioridade}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE NEW TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Cadastrar Novo Prazo Processual</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descrição do Prazo / Tarefa</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Protocolar Agravo de Instrumento"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Responsável</label>
                  <select
                    value={newRespId}
                    onChange={(e) => setNewRespId(e.target.value)}
                    className="w-full bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Data Limite (Fatal)</label>
                  <input
                    type="date"
                    required
                    value={newDataLimite}
                    onChange={(e) => setNewDataLimite(e.target.value)}
                    className="w-full bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Prioridade</label>
                  <select
                    value={newPrioridade}
                    onChange={(e) => setNewPrioridade(e.target.value as any)}
                    className="w-full bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="Urgente">Urgente</option>
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoria</label>
                  <select
                    value={newCategoria}
                    onChange={(e) => setNewCategoria(e.target.value as any)}
                    className="w-full bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="Prazo Processual">Prazo Processual</option>
                    <option value="Audiência">Audiência</option>
                    <option value="Diligência">Diligência</option>
                    <option value="Reunião">Reunião</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-md border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-2xs cursor-pointer"
                >
                  Salvar Prazo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
