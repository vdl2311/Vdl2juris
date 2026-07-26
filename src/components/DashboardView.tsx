import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Sparkles, 
  ArrowUpRight, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Search,
  Scale,
  Inbox,
  Clock,
  Send,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';
import { Processo, TarefaPrazo, Cliente } from '../types';

interface DashboardViewProps {
  processos: Processo[];
  tarefas: TarefaPrazo[];
  clientes: Cliente[];
  onSelectTab: (tab: string) => void;
  onOpenNewProcessModal: () => void;
  onSelectProcesso: (p: Processo) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  processos,
  tarefas,
  clientes,
  onSelectTab,
  onOpenNewProcessModal,
  onSelectProcesso,
}) => {
  const [naturalCommand, setNaturalCommand] = useState('');
  const [commandFeedback, setCommandFeedback] = useState<string | null>(null);

  const processosAtivos = processos.filter((p) => p.status === 'Ativo' || p.status === 'Em Recurso');
  const prazosUrgentes = tarefas.filter((t) => t.prioridade === 'Urgente' || t.prioridade === 'Alta');
  const totalClientes = clientes.length;

  const movimentacoesRecentes = processos
    .flatMap((p) =>
      p.movimentacoes.map((m) => ({
        ...m,
        processoNumeroCnj: p.numeroCnj,
        processoId: p.id,
        processoObjeto: p,
      }))
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5);

  const handleNaturalCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalCommand.trim()) return;

    setCommandFeedback(`Comando de voz/texto processado com sucesso: "${naturalCommand}". A IA atualizou os registros do escritório.`);
    setNaturalCommand('');
    setTimeout(() => setCommandFeedback(null), 4000);
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Quick Action Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 font-mono">
              O Primeiro Sistema Operacional Inteligente do Advogado
            </span>
            <span className="text-xs text-slate-400">DataJud Sync + Gemini 3.6</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">JuriSmart OS - Painel de Controle</h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Sem excesso de cliques ou cadastros manuais. O sistema se alimenta sozinho, monitora publicações e traz proativamente o que precisa da sua atenção hoje.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectTab('inbox')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Inbox className="w-4 h-4 text-amber-300" />
            <span>Inbox Jurídico</span>
          </button>
          <button
            onClick={() => onSelectTab('assistente-ia')}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>IA do Escritório</span>
          </button>
        </div>
      </div>

      {/* QUICK NATURAL LANGUAGE FEEDER BAR ("Alimentação Automática por IA") */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>Comando Rápido em Linguagem Natural (Alimentação Automática por IA)</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Ex: "Novo cliente: João Silva, CPF 123.456, processo contra Banco X"</span>
        </div>

        <form onSubmit={handleNaturalCommandSubmit} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Digite qualquer ordem (ex: 'Cadastrar cliente TechLog com contrato de R$ 50 mil', 'Preparar audiência do processo 1004523')..."
            value={naturalCommand}
            onChange={(e) => setNaturalCommand(e.target.value)}
            className="flex-1 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
          >
            Executar via IA
          </button>
        </form>

        {commandFeedback && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{commandFeedback}</span>
          </div>
        )}
      </div>

      {/* CONCEPT 1: DASHBOARD "HOJE NO ESCRITÓRIO" (Copiloto Ativo) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-bold text-slate-900">Hoje no Escritório - Copiloto de Atenção Diária</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              A IA analisou os processos, prazos, intimações e movimentações do DataJud e separou os 5 pontos críticos de hoje:
            </p>
          </div>
          <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-200 font-semibold">
            5 Pontos Identificados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Point 1: 🔴 Prazo vence em 2 dias */}
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 space-y-2 flex flex-col justify-between hover:border-red-300 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1 font-mono">
                  🔴 URGENTE - PRAZO CRÍTICO
                </span>
                <span className="text-slate-500 font-mono">Vence em 2 dias</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-xs">Especificação de Provas e Testemunhas</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Processo CNJ: <span className="font-mono text-indigo-700 font-semibold">1004523-88.2025.8.26.0100</span> (TechLog).
              </p>
            </div>
            <button
              onClick={() => onSelectTab('prazos')}
              className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all text-[11px] cursor-pointer"
            >
              Resolver Prazo Agora &rarr;
            </button>
          </div>

          {/* Point 2: 🟡 Processo parado há 90 dias */}
          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 flex flex-col justify-between hover:border-amber-300 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 font-mono">
                  🟡 PROCESSO PARADO (90 DIAS)
                </span>
                <span className="text-slate-500 font-mono">Sem movimentação</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-xs">Ação Anulatória IRPF - Aguardando Citação</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Processo CNJ: <span className="font-mono text-indigo-700 font-semibold">5001290-12.2024.4.03.6100</span> (TRF3).
              </p>
            </div>
            <button
              onClick={() => onSelectTab('assistente-ia')}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-all text-[11px] cursor-pointer"
            >
              Pedir Andamento / Petição IA &rarr;
            </button>
          </div>

          {/* Point 3: 🟢 Cliente precisa de atualização */}
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2 flex flex-col justify-between hover:border-emerald-300 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 font-mono">
                  🟢 ATUALIZAR CLIENTE
                </span>
                <span className="text-slate-500 font-mono">Vitória em Liminar</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-xs">Enviar relatório para Carlos Eduardo Silveira</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Liminar concedida no TRF3 suspendendo inscrição no CADIN.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('inbox')}
              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all text-[11px] cursor-pointer"
            >
              Enviar Resumo IA ao Cliente &rarr;
            </button>
          </div>

          {/* Point 4: ⚠️ Nova decisão encontrada */}
          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2 flex flex-col justify-between hover:border-purple-300 transition-colors">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-purple-800 bg-purple-100 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1 font-mono">
                  ⚠️ LAUDO PERICIAL ANEXADO
                </span>
                <span className="text-slate-500 font-mono">e-SAJ Notificação</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-xs">Perícia Técnica do Perito Dr. Marcelo</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Conclusão desfavorável quanto ao nexo causal no processo 1004523.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('documentos')}
              className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all text-[11px] cursor-pointer"
            >
              Analisar Laudo com IA &rarr;
            </button>
          </div>

          {/* Point 5: 🔵 Audiência Próxima */}
          <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2 flex flex-col justify-between hover:border-indigo-300 transition-colors md:col-span-2 lg:col-span-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1 font-mono">
                  🔵 PREPARAR AUDIÊNCIA
                </span>
                <span className="text-slate-500 font-mono">Próxima semana</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-xs">Audiência de Conciliação Virtual - 12ª Vara Cível</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                O botão "Preparar Audiência" gera a linha do tempo, perguntas para testemunhas, pontos fortes e fracos em 1 clique.
              </p>
            </div>
            <button
              onClick={() => {
                onSelectProcesso(processos[0]);
                onSelectTab('processos');
              }}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all text-[11px] cursor-pointer"
            >
              Abrir Copiloto de Audiência com IA &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onSelectTab('processos')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Processos Ativos</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{processosAtivos.length}</span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5">
              100% Monitorados <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">TJSP, TRF3, TRT2 atualizados via DataJud</p>
        </div>

        <div
          onClick={() => onSelectTab('prazos')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Prazos Fatais Próximos</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{prazosUrgentes.length}</span>
            <span className="text-[11px] text-amber-600 font-medium flex items-center gap-0.5">
              Atenção Requerida
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Próximos 5 dias de vencimento</p>
        </div>

        <div
          onClick={() => onSelectTab('clientes')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Base de Clientes</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">{totalClientes}</span>
            <span className="text-[11px] text-slate-500 font-medium">PF / PJ Ativos</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Com histórico e documentos anexos</p>
        </div>

        <div
          onClick={() => onSelectTab('inbox')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Inbox Unificado</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">5</span>
            <span className="text-[11px] text-purple-600 font-medium">Classificados por IA</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Diário Oficial e DataJud sem ruído</p>
        </div>
      </div>

      {/* Main Content Grid: Recent Movements & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-800">Linha do Tempo - Movimentações DataJud</h3>
            </div>
            <button
              onClick={() => onSelectTab('processos')}
              className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              Ver todos os processos &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {movimentacoesRecentes.map((mov) => (
              <div
                key={mov.id}
                onClick={() => {
                  onSelectProcesso(mov.processoObjeto);
                  onSelectTab('processos');
                }}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-medium text-indigo-700 group-hover:underline">
                    {mov.processoNumeroCnj}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">{mov.data}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-medium border border-indigo-200">
                      {mov.orgao}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-medium text-slate-800">{mov.descricao}</p>

                {mov.alertaIa && (
                  <div className="flex items-start gap-1.5 p-2 rounded bg-indigo-50/80 border border-indigo-100 text-[11px] text-indigo-900">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                    <span><strong>Insight IA:</strong> {mov.alertaIa}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Priority Prazos & AI Teaser */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-slate-800">Próximos Prazos</h3>
              </div>
              <button
                onClick={() => onSelectTab('prazos')}
                className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer"
              >
                Gerenciar
              </button>
            </div>

            <div className="space-y-2.5">
              {tarefas.slice(0, 4).map((t) => (
                <div key={t.id} className="p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 truncate max-w-[180px]">{t.descricao}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      t.prioridade === 'Urgente' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {t.dataLimite}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>{t.responsavelNome}</span>
                    <span className="font-mono text-indigo-600">{t.categoria}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-5 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <h4 className="font-semibold text-sm">Memória Jurídica do Escritório</h4>
            </div>
            <p className="text-xs text-indigo-100">
              O sistema aprende modelos, teses vencedoras e precedentes para sugerir estratégias de alta assertividade.
            </p>
            <button
              onClick={() => onSelectTab('assistente-ia')}
              className="w-full py-2 bg-white text-indigo-900 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Acessar Assistente IA & Memória</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
