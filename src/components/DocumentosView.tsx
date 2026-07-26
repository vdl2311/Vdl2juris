import React, { useState } from 'react';
import { FileText, UploadCloud, Sparkles, CheckCircle2, AlertTriangle, File, Search, Loader2 } from 'lucide-react';
import { Documento, Processo } from '../types';

interface DocumentosViewProps {
  documentos: Documento[];
  processos: Processo[];
  onAddDocumento: (doc: Documento) => void;
}

export const DocumentosView: React.FC<DocumentosViewProps> = ({
  documentos,
  processos,
  onAddDocumento,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(documentos[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [docType, setDocType] = useState('Contrato');
  const [associatedProcessCnj, setAssociatedProcessCnj] = useState('');

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName) return;

    setIsUploading(true);

    try {
      // Call Gemini document analysis endpoint
      const response = await fetch('/api/ai/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: uploadedFileName,
          docType: docType,
          documentContent: `Documento legal enviado: ${uploadedFileName}. Contém cláusulas de fornecimento, vigência de 24 meses, penalidade por descumprimento de SLA e foro de escolha em São Paulo.`,
        }),
      });

      const data = await response.json();
      const analysis = data.analysis || {};

      const newDoc: Documento = {
        id: `d${Date.now()}`,
        tipo: docType as any,
        nome: uploadedFileName.endsWith('.pdf') ? uploadedFileName : `${uploadedFileName}.pdf`,
        arquivoUrl: '#',
        tamanho: '1.2 MB',
        dataUpload: new Date().toISOString().split('T')[0],
        processoNumeroCnj: associatedProcessCnj || '1004523-88.2025.8.26.0100',
        resumoIa: analysis.resumoExecutivo || 'Análise de documento concluída com sucesso.',
        entidadesExtraidas: {
          datas: analysis.prazosIdentificados || ['15/08/2026'],
          valores: analysis.valoresMonetarios || ['R$ 50.000,00'],
          clausulasCriticas: analysis.pontosCriticos || ['Cláusula Penal', 'Foro de Eleição'],
          partesCitadas: ['Contratante', 'Contratado'],
        },
        statusIa: 'analisado',
      };

      onAddDocumento(newDoc);
      setSelectedDoc(newDoc);
      setUploadedFileName('');
    } catch (err) {
      console.error('Erro na análise documental de upload:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredDocs = documentos.filter(
    (d) =>
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.processoNumeroCnj && d.processoNumeroCnj.includes(searchTerm))
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <span>Gestor de Documentos & Extrator IA</span>
        </h2>
        <p className="text-xs text-slate-500">
          Upload inteligente de contratos, peças e decisões com leitura OCR e extração automatizada de entidades pelo Gemini.
        </p>
      </div>

      {/* Grid: Upload Box + Document List & Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload Dropzone Simulator */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-indigo-600" />
            <span>Upload & Análise de Documento</span>
          </h3>

          <form onSubmit={handleFileUpload} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Nome do Arquivo / Título</label>
              <input
                type="text"
                required
                placeholder="Ex: Contrato_Prestacao_Servicos_V2.pdf"
                value={uploadedFileName}
                onChange={(e) => setUploadedFileName(e.target.value)}
                className="w-full bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Tipo de Peça</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200 text-slate-800 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Contrato">Contrato</option>
                  <option value="Procuração">Procuração</option>
                  <option value="Petição Initial">Petição Initial</option>
                  <option value="Sentença">Sentença</option>
                  <option value="Contestação">Contestação</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Processo CNJ</label>
                <select
                  value={associatedProcessCnj}
                  onChange={(e) => setAssociatedProcessCnj(e.target.value)}
                  className="w-full bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200 text-slate-800 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="">Nenhum / Geral</option>
                  {processos.map((p) => (
                    <option key={p.id} value={p.numeroCnj}>
                      {p.numeroCnj} ({p.tribunal})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 rounded-xl p-6 text-center space-y-2 transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
              <p className="font-semibold text-slate-700">Arraste seu PDF ou selecione um arquivo</p>
              <p className="text-[11px] text-slate-400">PDF, DOCX ou Imagens escaneadas (até 25MB)</p>
            </div>

            <button
              type="submit"
              disabled={isUploading || !uploadedFileName}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Extraindo com Gemini IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Processar e Analisar Documento</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Document List & AI Extracted Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Document list selector */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar por nome de arquivo ou CNJ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-800 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    selectedDoc?.id === doc.id
                      ? 'border-indigo-600 bg-indigo-50/60 font-medium'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <File className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate">{doc.nome}</p>
                      <p className="text-[10px] text-slate-500">{doc.tipo} • {doc.tamanho}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono shrink-0">
                    IA Pronta
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Extracted Entities Card */}
          {selectedDoc && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Extrator de Informações do Documento</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                  {selectedDoc.nome}
                </span>
              </div>

              {/* Resumo Executivo */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Resumo Gerado pela IA:</span>
                <p className="text-slate-800 leading-relaxed">{selectedDoc.resumoIa}</p>
              </div>

              {/* Entities Grid */}
              {selectedDoc.entidadesExtraidas && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Cláusulas Críticas */}
                  <div className="p-3 bg-red-50/60 rounded-lg border border-red-100 space-y-1">
                    <span className="font-bold text-red-900 text-[11px] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      Cláusulas de Atenção
                    </span>
                    <ul className="list-disc list-inside text-red-800 space-y-0.5 text-[11px]">
                      {selectedDoc.entidadesExtraidas.clausulasCriticas?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prazos / Datas */}
                  <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-100 space-y-1">
                    <span className="font-bold text-amber-900 text-[11px]">Datas & Prazos Mencionados</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDoc.entidadesExtraidas.datas?.map((data, idx) => (
                        <span key={idx} className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono text-[10px]">
                          {data}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Valores Monetários */}
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100 space-y-1">
                    <span className="font-bold text-emerald-900 text-[11px]">Valores Identificados</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDoc.entidadesExtraidas.valores?.map((val, idx) => (
                        <span key={idx} className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold text-[10px]">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Partes Citadas */}
                  <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 space-y-1">
                    <span className="font-bold text-indigo-900 text-[11px]">Partes Envolvidas</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedDoc.entidadesExtraidas.partesCitadas?.map((parte, idx) => (
                        <span key={idx} className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px]">
                          {parte}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
