import React, { useState } from 'react';
import { Users, Plus, Search, Building2, User, Phone, Mail, MapPin, Briefcase, FileText } from 'lucide-react';
import { Cliente, Processo } from '../types';

interface ClientesViewProps {
  clientes: Cliente[];
  processos: Processo[];
  onOpenNewClienteModal?: () => void;
  onSelectProcesso?: (p: Processo) => void;
  onSelectTab?: (tab: string) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clientes,
  processos,
  onSelectProcesso,
  onSelectTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  const filteredClientes = clientes.filter((c) => {
    const matchesSearch =
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpfCnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'todos' || c.tipo.toLowerCase() === tipoFilter.toLowerCase();
    return matchesSearch && matchesTipo;
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Gestão de Clientes (CRM Jurídico)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Cadastro unificado de clientes PF e PJ, histórico de interações e processos vinculados.
          </p>
        </div>

        <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-2xs transition-all cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Cliente</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF/CNPJ ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <select
          aria-label="Filtrar por tipo de pessoa"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="bg-slate-50 text-slate-700 text-xs px-3 py-1.5 rounded-md border border-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="todos">Todos os Tipos</option>
          <option value="pf">Pessoa Física (PF)</option>
          <option value="pj">Pessoa Jurídica (PJ)</option>
        </select>
      </div>

      {/* Grid of Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClientes.map((c) => {
          const clienteProcessos = processos.filter((p) => p.clienteId === c.id || c.processosVinculados.includes(p.id));
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCliente(c)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                      c.tipo === 'PJ' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {c.tipo === 'PJ' ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{c.nome}</h3>
                      <span className="text-[11px] text-slate-400 font-mono">{c.cpfCnpj}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {c.tipo}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 pt-1">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{c.telefone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{c.endereco.cidade} - {c.endereco.uf}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  {clienteProcessos.length} Processo(s)
                </span>
                <span className="text-indigo-600 font-semibold group-hover:underline">Ver ficha &rarr;</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* CLIENT DETAILS DRAWER */}
      {selectedCliente && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 font-mono">
                  Cliente {selectedCliente.tipo}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedCliente.nome}</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">{selectedCliente.cpfCnpj}</p>
              </div>
              <button
                onClick={() => setSelectedCliente(null)}
                className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800">Contatos e Endereço</h4>
                <p className="text-slate-600"><strong>E-mail:</strong> {selectedCliente.email}</p>
                <p className="text-slate-600"><strong>Telefone:</strong> {selectedCliente.telefone}</p>
                <p className="text-slate-600"><strong>Endereço:</strong> {selectedCliente.endereco.logradouro}, {selectedCliente.endereco.cidade} - {selectedCliente.endereco.uf}, CEP {selectedCliente.endereco.cep}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800">Histórico de Atendimento</h4>
                <p className="text-slate-600 leading-relaxed">{selectedCliente.historicoNotas}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800">Processos Associados</h4>
                {processos
                  .filter((p) => p.clienteId === selectedCliente.id || selectedCliente.processosVinculados.includes(p.id))
                  .map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (onSelectProcesso) onSelectProcesso(p);
                        if (onSelectTab) onSelectTab('processos');
                        setSelectedCliente(null);
                      }}
                      className="p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-mono font-semibold text-indigo-700">{p.numeroCnj}</p>
                        <p className="text-slate-500 text-[11px]">{p.assunto}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {p.status}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
