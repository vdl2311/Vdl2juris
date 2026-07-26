import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  FileText, 
  Database, 
  Bot, 
  User, 
  Loader2, 
  BookOpen, 
  AlertCircle, 
  Check, 
  Search,
  Brain,
  Tag,
  Scale,
  Zap
} from 'lucide-react';
import { AiChatMessage, Processo, MemoriaJuridicaItem } from '../types';
import { mockMemoriaJuridica } from '../data/mockData';

interface AiAssistenteViewProps {
  processos: Processo[];
  initialPrompt?: string;
}

export const AiAssistenteView: React.FC<AiAssistenteViewProps> = ({ processos, initialPrompt }) => {
  const [subTab, setSubTab] = useState<'chat' | 'minutas' | 'rag' | 'memoria'>('chat');

  // Chat State
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'm1',
      role: 'model',
      content: initialPrompt || 'Olá! Sou o assistente e copiloto jurídico do JuriSmart OS. Como posso auxiliar hoje? Conheço os processos do escritório, documentos, prazos e a nossa memória jurídica.',
      timestamp: '09:00',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [selectedProcessId, setSelectedProcessId] = useState<string>(processos[0]?.id || '');
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Minutas State
  const [tipoPeca, setTipoPeca] = useState('Petição Inicial - Cobrança Contratual');
  const [poloAtivo, setPoloAtivo] = useState('TechLog Soluções Logísticas LTDA');
  const [poloPassivo, setPoloPassivo] = useState('Global Express Transportes S/A');
  const [fatosText, setFatosText] = useState('O réu descumpriu o contrato de prestação de serviços logísticos, atrasando entregas sistematicamente por 45 dias.');
  const [fundamText, setFundamText] = useState('Inadimplemento absoluto do contrato, incidência da multa moratória de 10% e danos emergentes (Art. 389 e 402 do Código Civil).');
  const [generatedMinuta, setGeneratedMinuta] = useState<string | null>(null);
  const [isGeneratingMinuta, setIsGeneratingMinuta] = useState(false);

  // RAG Search State
  const [ragQuery, setRagQuery] = useState('');
  const [ragResult, setRagResult] = useState<string | null>(null);
  const [isLoadingRag, setIsLoadingRag] = useState(false);

  // Memória Jurídica State
  const [memoriaList] = useState<MemoriaJuridicaItem[]>(mockMemoriaJuridica);
  const [memoriaSearch, setMemoriaSearch] = useState('');

  // Send message in Chat
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim()) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt('');
    setIsLoadingChat(true);

    try {
      const selectedProc = processos.find((p) => p.id === selectedProcessId);
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToSend,
          context: selectedProc
            ? `Processo Selecionado: CNJ ${selectedProc.numeroCnj}, Tribunal ${selectedProc.tribunal}, Partes: ${selectedProc.partes.poloAtivo} x ${selectedProc.partes.poloPassivo}. Assunto: ${selectedProc.assunto}.`
            : 'Memória geral e histórico de estratégias do escritório JuriSmart.',
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      const modelMsg: AiChatMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        content: data.reply || 'Desculpe, ocorreu uma falha no processamento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error('Erro no chat da IA:', err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Generate Minuta
  const handleGenerateMinuta = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingMinuta(true);

    try {
      const response = await fetch('/api/ai/draft-minuta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoPeca,
          poloAtivo,
          poloPassivo,
          fatos: fatosText,
          fundamentacao: fundamText,
        }),
      });

      const data = await response.json();
      setGeneratedMinuta(data.minutaText || 'Não foi possível gerar a minuta.');
    } catch (err) {
      console.error('Erro ao gerar minuta:', err);
    } finally {
      setIsGeneratingMinuta(false);
    }
  };

  // RAG Search
  const handleRagSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;

    setIsLoadingRag(true);
    try {
      const response = await fetch('/api/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: ragQuery }),
      });

      const data = await response.json();
      setRagResult(data.respostaIa || 'Sem resultados.');
    } catch (err) {
      console.error('Erro na busca RAG:', err);
    } finally {
      setIsLoadingRag(false);
    }
  };

  const filteredMemoria = memoriaList.filter(
    (m) =>
      m.titulo.toLowerCase().includes(memoriaSearch.toLowerCase()) ||
      m.descricao.toLowerCase().includes(memoriaSearch.toLowerCase()) ||
      m.tags.some((t) => t.toLowerCase().includes(memoriaSearch.toLowerCase()))
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          <span>Assistente & Copiloto Jurídico Gemini IA</span>
        </h2>
        <p className="text-xs text-slate-500">
          IA contextual do escritório que conhece os processos do DataJud, documentos, prazos e o histórico de estratégias do escritório.
        </p>
      </div>

      {/* Sub tabs (Horizontally scrollable on mobile) */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setSubTab('chat')}
          className={`py-2.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            subTab === 'chat'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Chat Contextual</span>
        </button>

        <button
          onClick={() => setSubTab('memoria')}
          className={`py-2.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            subTab === 'memoria'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain className="w-4 h-4 text-purple-600" />
          <span>Memória Jurídica do Escritório</span>
        </button>

        <button
          onClick={() => setSubTab('minutas')}
          className={`py-2.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            subTab === 'minutas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Gerador de Minutas e Peças</span>
        </button>

        <button
          onClick={() => setSubTab('rag')}
          className={`py-2.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            subTab === 'rag'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Busca Semântica (RAG)</span>
        </button>
      </div>

      {/* SUBTAB 1: CHAT CONTEXTUAL */}
      {subTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Chat Box */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col h-[600px] overflow-hidden">
            {/* Context Selector Header */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-indigo-600" />
                Contexto Ativo do Processo:
              </span>
              <select
                value={selectedProcessId}
                onChange={(e) => setSelectedProcessId(e.target.value)}
                className="bg-white text-slate-800 font-mono text-xs px-2.5 py-1 rounded border border-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="">Geral / Memória Global do Escritório</option>
                {processos.map((p) => (
                  <option key={p.id} value={p.id}>
                    CNJ: {p.numeroCnj} ({p.tribunal})
                  </option>
                ))}
              </select>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                      msg.role === 'user' ? 'bg-slate-800' : 'bg-gradient-to-tr from-indigo-600 to-blue-600'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.content}
                    <div className={`text-[10px] mt-1 text-right font-mono ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isLoadingChat && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 p-2 font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>JuriSmart AI consultando a base do escritório...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ex: 'Tenho audiência deste processo amanhã. O que preciso saber?' ou 'Resumir o caso'..."
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoadingChat || !inputPrompt.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Prompts Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3 h-fit">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              Perguntas Inteligentes
            </h4>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleSendMessage('Tenho audiência deste processo em breve. O que preciso saber e quais os pontos críticos?')}
                className="w-full p-2.5 rounded-lg bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 text-amber-950 text-left transition-colors font-semibold cursor-pointer"
              >
                "Tenho audiência amanhã. O que preciso saber?"
              </button>

              <button
                onClick={() => handleSendMessage('Resuma as movimentações mais recentes do DataJud e informe se há prazos correndo.')}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 text-left transition-colors font-medium cursor-pointer"
              >
                "Resumir movimentações do DataJud"
              </button>

              <button
                onClick={() => handleSendMessage('Mostre contratos de clientes empresariais com cláusula de multa no nosso histórico.')}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 text-left transition-colors font-medium cursor-pointer"
              >
                "Contratos com cláusula de multa"
              </button>

              <button
                onClick={() => handleSendMessage('Quais processos contra bancos tivemos nos últimos 3 anos e qual o percentual de êxito?')}
                className="w-full p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 text-left transition-colors font-medium cursor-pointer"
              >
                "Processos contra bancos no histórico"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: MEMÓRIA JURÍDICA DO ESCRITÓRIO */}
      {subTab === 'memoria' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-md border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold tracking-tight">Memória Jurídica & Inteligência Coletiva</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl">
              Uma das maiores inovações do JuriSmart OS. O sistema aprende continuadamente como o escritório trabalha: modelos utilizados, teses de sucesso no TJSP/TRF3, cláusulas padronizadas e jurisprudência vencedora.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar na memória do escritório por tese, tribunal, tag ou palavra-chave..."
                  value={memoriaSearch}
                  onChange={(e) => setMemoriaSearch(e.target.value)}
                  className="w-full bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <span className="text-xs text-slate-500 font-mono">
                {filteredMemoria.length} registros aprendidos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMemoria.map((item) => (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                        {item.categoria}
                      </span>
                      {item.tribunalOuOrgao && (
                        <span className="text-[10px] text-slate-400 font-mono">{item.tribunalOuOrgao}</span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{item.titulo}</h4>

                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.descricao}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200/60">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded text-slate-600 border border-slate-200">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Usada em {item.mencionadaEmProcessosCount} processos</span>
                      <button
                        onClick={() => {
                          setSubTab('chat');
                          handleSendMessage(`Utilize o conhecimento sobre "${item.titulo}" para elaborar uma recomendação.`);
                        }}
                        className="text-indigo-600 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Zap className="w-3 h-3" /> Usar na IA
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: GERADOR DE MINUTAS */}
      {subTab === 'minutas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={handleGenerateMinuta} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4 text-xs">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Gerador de Peças Jurídicas</span>
            </h3>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Tipo de Peça Processual</label>
              <input
                type="text"
                value={tipoPeca}
                onChange={(e) => setTipoPeca(e.target.value)}
                className="w-full bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Autor / Polo Ativo</label>
                <input
                  type="text"
                  value={poloAtivo}
                  onChange={(e) => setPoloAtivo(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Réu / Polo Passivo</label>
                <input
                  type="text"
                  value={poloPassivo}
                  onChange={(e) => setPoloPassivo(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Fatos e Contexto</label>
              <textarea
                rows={3}
                value={fatosText}
                onChange={(e) => setFatosText(e.target.value)}
                className="w-full bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Fundamentação & Teses</label>
              <textarea
                rows={3}
                value={fundamText}
                onChange={(e) => setFundamText(e.target.value)}
                className="w-full bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingMinuta}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingMinuta ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Redigindo Minuta com Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gerar Minuta Inicial</span>
                </>
              )}
            </button>
          </form>

          {/* Result Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3 text-xs flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-semibold text-slate-800">Minuta Gerada</span>
              <span className="text-[10px] text-slate-400 font-mono">Modelo Gemini 3.6-flash</span>
            </div>

            <div className="flex-1 bg-slate-50 rounded-lg border border-slate-200 p-4 font-mono text-[11px] text-slate-800 overflow-y-auto max-h-[500px] whitespace-pre-line leading-relaxed">
              {generatedMinuta || (
                <span className="text-slate-400 font-sans italic">
                  Preencha os dados à esquerda e clique em "Gerar Minuta Inicial" para obter a peça completa formatada.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: BUSCA RAG SEMÂNTICA */}
      {subTab === 'rag' && (
        <div className="space-y-6">
          <form onSubmit={handleRagSearch} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Busca Semântica na Base de Precedentes Jurídicos (RAG)</span>
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ex: 'Mostre contratos de clientes empresariais que tinham cláusula de multa...' ou 'Quais processos contra bancos tivemos nos últimos 3 anos?'"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                className="flex-1 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={isLoadingRag || !ragQuery.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoadingRag ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Buscar RAG</span>
              </button>
            </div>
          </form>

          {ragResult && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Resultados Encontrados na Base Jurídica</span>
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed text-slate-800 whitespace-pre-line">
                {ragResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
