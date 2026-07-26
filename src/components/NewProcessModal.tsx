import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle2, Loader2, X, Briefcase, Database } from 'lucide-react';
import { Processo } from '../types';

interface NewProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProcesso: (p: Processo) => void;
}

export const NewProcessModal: React.FC<NewProcessModalProps> = ({
  isOpen,
  onClose,
  onAddProcesso,
}) => {
  const [cnjInput, setCnjInput] = useState('1004523-88.2025.8.26.0100');
  const [tribunalInput, setTribunalInput] = useState('TJSP');
  const [isSearching, setIsSearching] = useState(false);
  const [scrapedData, setScrapedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSearchDataJud = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnjInput.trim()) return;

    setIsSearching(true);
    setScrapedData(null);

    try {
      const response = await fetch(`/api/datajud/cnj/${encodeURIComponent(cnjInput)}`);
      const data = await response.json();
      setScrapedData(data);
    } catch (err) {
      console.error('Erro ao buscar processo no DataJud:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmImport = () => {
    if (!scrapedData) return;

    const newProc: Processo = {
      id: `p${Date.now()}`,
      numeroCnj: scrapedData.numeroCnj || cnjInput,
      tribunal: scrapedData.tribunal || tribunalInput,
      comarca: scrapedData.comarca || 'São Paulo - SP',
      classeProcessual: scrapedData.classeProcessual || 'Procedimento Comum Cível',
      assunto: scrapedData.assunto || 'Inadimplemento Contratual',
      status: 'Ativo',
      valorCausa: scrapedData.valorCausa || 120000.0,
      clienteId: 'c1',
      clienteNome: 'TechLog Soluções Logísticas LTDA',
      partes: scrapedData.partes || {
        poloAtivo: 'TechLog Soluções Logísticas LTDA',
        poloPassivo: 'Global Express Transportes S/A',
      },
      advogadoResponsavelId: 'u1',
      advogadoResponsavelNome: 'Dra. Sofia Alencar',
      datasImportantes: {
        distribuicao: new Date().toISOString().split('T')[0],
      },
      movimentacoes: scrapedData.movimentacoes || [
        {
          id: `m-${Date.now()}`,
          data: new Date().toISOString().split('T')[0],
          descricao: 'Processo cadastrado no JuriSmart OS e integrado ao DataJud',
          orgao: tribunalInput,
          fonte: 'DataJud CNJ',
        },
      ],
      documentosIds: [],
      ultimaSincronizacaoDataJud: new Date().toISOString().replace('T', ' ').substring(0, 16),
      resumoIa: 'Processo importado via DataJud. Aguardando primeira análise de prazos pelo Gemini.',
    };

    onAddProcesso(newProc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Importar Processo via DataJud CNJ</h3>
              <p className="text-[11px] text-slate-300">Consulta direta na API pública de processos unificada</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <form onSubmit={handleSearchDataJud} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Número do Processo (Padrão CNJ)</label>
                <input
                  type="text"
                  required
                  placeholder="0000000-00.2026.8.26.0000"
                  value={cnjInput}
                  onChange={(e) => setCnjInput(e.target.value)}
                  className="w-full bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tribunal</label>
                <select
                  value={tribunalInput}
                  onChange={(e) => setTribunalInput(e.target.value)}
                  className="w-full bg-slate-50 px-2 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="TJSP">TJSP (Estadual SP)</option>
                  <option value="TRF3">TRF3 (Federal 3ª Reg.)</option>
                  <option value="TRT2">TRT2 (Trabalhista SP)</option>
                  <option value="STJ">STJ (Superior Tribunal)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Consultando bases do CNJ DataJud...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Localizar Processo no CNJ</span>
                </>
              )}
            </button>
          </form>

          {/* Scraped Result Preview Card */}
          {scrapedData && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Processo Localizado no DataJud
                </span>
                <span className="text-[10px] font-mono text-slate-400">API CNJ v2</span>
              </div>

              <div className="space-y-1.5 text-slate-800">
                <p><strong>CNJ:</strong> <span className="font-mono text-indigo-700">{scrapedData.numeroCnj}</span></p>
                <p><strong>Classe:</strong> {scrapedData.classeProcessual}</p>
                <p><strong>Assunto:</strong> {scrapedData.assunto}</p>
                <p><strong>Partes:</strong> {scrapedData.partes?.poloAtivo} vs {scrapedData.partes?.poloPassivo}</p>
                <p><strong>Última Movimentação:</strong> {scrapedData.movimentacoes?.[0]?.descricao}</p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Confirmar Importação</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
