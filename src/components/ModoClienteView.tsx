import React, { useState } from 'react';
import { 
  UserCheck, 
  Shield, 
  Clock, 
  FileText, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  Download, 
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Processo, Cliente, Documento } from '../types';

interface ModoClienteViewProps {
  processos: Processo[];
  clientes: Cliente[];
  documentos: Documento[];
}

export const ModoClienteView: React.FC<ModoClienteViewProps> = ({
  processos,
  clientes,
  documentos,
}) => {
  const [selectedClienteId, setSelectedClienteId] = useState<string>(
    clientes[0]?.id || ''
  );
  const [mensagemEnviada, setMensagemEnviada] = useState(false);
  const [textoMensagem, setTextoMensagem] = useState('');

  const clienteAtual = clientes.find((c) => c.id === selectedClienteId) || clientes[0];
  const processosDoCliente = processos.filter(
    (p) => p.clienteId === clienteAtual?.id || p.clienteNome === clienteAtual?.nome
  );

  const [selectedProcessoId, setSelectedProcessoId] = useState<string>(
    processosDoCliente[0]?.id || processos[0]?.id || ''
  );

  const processoAtual =
    processos.find((p) => p.id === selectedProcessoId) || processosDoCliente[0] || processos[0];

  const documentosDoCliente = documentos.filter(
    (d) => d.clienteId === clienteAtual?.id || d.processoId === processoAtual?.id
  );

  const handleEnviarMensagem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoMensagem.trim()) return;
    setMensagemEnviada(true);
    setTextoMensagem('');
    setTimeout(() => setMensagemEnviada(false), 4000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-mono flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Portal de Transparência do Cliente
            </span>
            <span className="text-xs text-slate-400">Modo Leigo Descomplicado</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Área Exclusiva do Cliente</h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Acompanhamento em tempo real sem 'juridiquês'. Veja o andamento, entenda os próximos passos e converse diretamente com seu advogado.
          </p>
        </div>

        {/* Client Switcher for Demonstration / Testing */}
        <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 space-y-1 w-full md:w-auto min-w-[240px]">
          <label className="text-[11px] font-medium text-slate-300 block">
            Visualizar Como Cliente:
          </label>
          <select
            value={selectedClienteId}
            onChange={(e) => {
              setSelectedClienteId(e.target.value);
              const firstProc = processos.find((p) => p.clienteId === e.target.value);
              if (firstProc) setSelectedProcessoId(firstProc.id);
            }}
            className="w-full bg-slate-900 text-slate-200 text-xs font-semibold rounded px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} ({c.tipo})
              </option>
            ))}
          </select>
        </div>
      </div>

      {clienteAtual && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Col: Process Status & Plain Language Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Overview Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {processoAtual?.classeProcessual || 'Procedimento Comum'}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {processoAtual?.assunto || 'Ação Judicial em Andamento'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Processo nº {processoAtual?.numeroCnj} • {processoAtual?.tribunal}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {processoAtual?.status || 'Ativo'}
                  </span>
                </div>
              </div>

              {/* Status Bar / Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Estágio Atual do Caso</span>
                  <span className="font-mono text-indigo-600 font-bold">Fase de Produção de Provas</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-emerald-500 h-full w-[35%]" title="Distribuição Inicial"></div>
                  <div className="bg-indigo-600 h-full w-[35%]" title="Fase Atual"></div>
                  <div className="bg-slate-200 h-full w-[30%]" title="Fase Final"></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>1. Inicial Registrada</span>
                  <span className="font-bold text-indigo-700">2. Análise do Juiz (Hoje)</span>
                  <span>3. Decisão / Sentença</span>
                </div>
              </div>

              {/* IA Plain Language Summary ("Explicador para o Cliente") */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Resumo do seu Caso em Palavras Simples</span>
                </div>
                <p className="text-indigo-950 leading-relaxed">
                  {processoAtual?.resumoIa ||
                    'Seu processo foi recebido pelo juiz e o réu foi notificado para se manifestar. O advogado da sua equipe já apresentou todos os documentos necessários. Não há nenhuma pendência sob sua responsabilidade neste momento.'}
                </p>
              </div>
            </div>

            {/* Plain-Language Visual Timeline ("Linha do Tempo Descomplicada") */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Linha do Tempo do Seu Caso</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Atualizado via DataJud</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {processoAtual?.movimentacoes.map((mov, idx) => (
                  <div key={mov.id || idx} className="relative group">
                    <div
                      className={`absolute -left-[19px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        idx === 0 ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-400'
                      }`}
                    ></div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{mov.descricao}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{mov.data}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {mov.alertaIa || 'Movimentação oficial registrada no sistema do tribunal.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Client Support & Documents */}
          <div className="space-y-6">
            {/* Contact Lawyer Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Mensagem para seu Advogado</h3>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <p className="font-semibold text-slate-800">Advogado Responsável:</p>
                <p className="text-indigo-700 font-medium">Dra. Helena Alencar • OAB/SP 412.890</p>
                <p className="text-[11px] text-slate-500">Equipe de Direito Cível e Empresarial</p>
              </div>

              <form onSubmit={handleEnviarMensagem} className="space-y-3">
                <textarea
                  rows={3}
                  value={textoMensagem}
                  onChange={(e) => setTextoMensagem(e.target.value)}
                  placeholder="Escreva sua dúvida ou solicitação ao advogado..."
                  className="w-full bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                ></textarea>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar ao Escritório</span>
                </button>
              </form>

              {mensagemEnviada && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sua mensagem foi entregue à Dra. Helena! Você receberá notificação assim que respondida.</span>
                </div>
              )}
            </div>

            {/* Documents Download Center */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Seus Documentos do Caso</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Acesso Seguro</span>
              </div>

              <div className="space-y-2.5">
                {documentosDoCliente.length > 0 ? (
                  documentosDoCliente.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5 truncate max-w-[180px]">
                        <p className="font-semibold text-slate-800 truncate">{doc.nome}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{doc.tipo} • {doc.tamanho}</p>
                      </div>
                      <button
                        onClick={() => alert(`Baixando documento com segurança: ${doc.nome}`)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Baixar Cópia em PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic text-center py-4">
                    Nenhum documento pendente para este processo.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
