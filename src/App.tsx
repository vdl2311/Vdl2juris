import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandPalette } from './components/CommandPalette';
import { DashboardView } from './components/DashboardView';
import { ProcessosView } from './components/ProcessosView';
import { ClientesView } from './components/ClientesView';
import { DocumentosView } from './components/DocumentosView';
import { TarefasView } from './components/TarefasView';
import { AiAssistenteView } from './components/AiAssistenteView';
import { ModoClienteView } from './components/ModoClienteView';
import { ArchitectureView } from './components/ArchitectureView';
import { NewProcessModal } from './components/NewProcessModal';

import {
  mockProcessos,
  mockClientes,
  mockDocumentos,
  mockTarefas,
  mockUsers,
} from './data/mockData';

import { Processo, Cliente, Documento, TarefaPrazo, UserProfile } from './types';
import { 
  seedInitialFirestoreData, 
  subscribeProcessos, 
  subscribeClientes, 
  subscribeDocumentos, 
  subscribeTarefas,
  saveProcessoDb,
  saveDocumentoDb,
  saveTarefaDb,
  updateTarefaStatusDb,
  updateProcessoResumoDb
} from './lib/firestoreService';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockUsers[0]);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Main application data state
  const [processos, setProcessos] = useState<Processo[]>(mockProcessos);
  const [clientes, setClientes] = useState<Cliente[]>(mockClientes);
  const [documentos, setDocumentos] = useState<Documento[]>(mockDocumentos);
  const [tarefas, setTarefas] = useState<TarefaPrazo[]>(mockTarefas);
  const [users] = useState<UserProfile[]>(mockUsers);

  const [selectedProcesso, setSelectedProcesso] = useState<Processo | null>(null);

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNewProcessModalOpen, setIsNewProcessModalOpen] = useState(false);

  // Initialize and Sync Firestore Database
  useEffect(() => {
    seedInitialFirestoreData();

    const unsubProc = subscribeProcessos((data) => setProcessos(data));
    const unsubCli = subscribeClientes((data) => setClientes(data));
    const unsubDoc = subscribeDocumentos((data) => setDocumentos(data));
    const unsubTar = subscribeTarefas((data) => setTarefas(data));

    return () => {
      unsubProc();
      unsubCli();
      unsubDoc();
      unsubTar();
    };
  }, []);

  // Handlers
  const handleAddProcesso = (newProc: Processo) => {
    setProcessos((prev) => [newProc, ...prev]);
    setSelectedProcesso(newProc);
    saveProcessoDb(newProc);
  };

  const handleUpdateProcessoResumo = (processoId: string, resumo: string) => {
    setProcessos((prev) =>
      prev.map((p) => (p.id === processoId ? { ...p, resumoIa: resumo } : p))
    );
    updateProcessoResumoDb(processoId, resumo);
  };

  const handleAddDocumento = (newDoc: Documento) => {
    setDocumentos((prev) => [newDoc, ...prev]);
    saveDocumentoDb(newDoc);
  };

  const handleToggleTarefaStatus = (id: string) => {
    let updatedStatus: 'Pendente' | 'Concluído' = 'Pendente';
    setTarefas((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          updatedStatus = t.status === 'Concluído' ? 'Pendente' : 'Concluído';
          return { ...t, status: updatedStatus };
        }
        return t;
      })
    );
    updateTarefaStatusDb(id, updatedStatus);
  };

  const handleAddTarefa = (newTarefa: TarefaPrazo) => {
    setTarefas((prev) => [newTarefa, ...prev]);
    saveTarefaDb(newTarefa);
  };

  // Get dynamic title for Header
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Visão Geral & Indicadores';
      case 'processos':
        return 'Processos & Sincronização DataJud';
      case 'clientes':
        return 'CRM de Clientes (PF / PJ)';
      case 'documentos':
        return 'Gestor de Documentos & Extrator IA';
      case 'prazos':
        return 'Agenda de Prazos Processuais & Tarefas';
      case 'assistente-ia':
        return 'Copiloto & Gerador de Peças IA';
      case 'modo-cliente':
        return 'Portal de Transparência do Cliente';
      case 'arquitetura':
        return 'Especificação e Arquitetura do Sistema';
      default:
        return 'JuriSmart OS';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800 antialiased selection:bg-indigo-500 selection:text-white relative">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        currentUser={currentUser}
        onSwitchRole={(role) => {
          const matched = users.find((u) => u.perfil === role);
          if (matched) setCurrentUser(matched);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          title={getHeaderTitle()}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenNewProcessModal={() => setIsNewProcessModalOpen(true)}
          onOpenAiAssistant={() => setActiveTab('assistente-ia')}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          unreadAlertsCount={2}
        />

        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView
              processos={processos}
              tarefas={tarefas}
              clientes={clientes}
              onSelectTab={setActiveTab}
              onOpenNewProcessModal={() => setIsNewProcessModalOpen(true)}
              onSelectProcesso={(p) => {
                setSelectedProcesso(p);
                setActiveTab('processos');
              }}
            />
          )}

          {activeTab === 'processos' && (
            <ProcessosView
              processos={processos}
              documentos={documentos}
              selectedProcesso={selectedProcesso}
              onSelectProcesso={setSelectedProcesso}
              onOpenNewProcessModal={() => setIsNewProcessModalOpen(true)}
              onUpdateProcessoResumo={handleUpdateProcessoResumo}
            />
          )}

          {activeTab === 'clientes' && (
            <ClientesView
              clientes={clientes}
              processos={processos}
              onSelectProcesso={(p) => {
                setSelectedProcesso(p);
                setActiveTab('processos');
              }}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'documentos' && (
            <DocumentosView
              documentos={documentos}
              processos={processos}
              onAddDocumento={handleAddDocumento}
            />
          )}

          {activeTab === 'prazos' && (
            <TarefasView
              tarefas={tarefas}
              users={users}
              onToggleTarefaStatus={handleToggleTarefaStatus}
              onAddTarefa={handleAddTarefa}
            />
          )}

          {activeTab === 'assistente-ia' && (
            <AiAssistenteView processos={processos} />
          )}

          {activeTab === 'modo-cliente' && (
            <ModoClienteView
              processos={processos}
              clientes={clientes}
              documentos={documentos}
            />
          )}

          {activeTab === 'arquitetura' && <ArchitectureView />}
        </main>
      </div>

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        processos={processos}
        clientes={clientes}
        documentos={documentos}
        tarefas={tarefas}
        onSelectTab={setActiveTab}
        onSelectProcesso={(p) => setSelectedProcesso(p)}
      />

      {/* Import CNJ Process Modal */}
      <NewProcessModal
        isOpen={isNewProcessModalOpen}
        onClose={() => setIsNewProcessModalOpen(false)}
        onAddProcesso={handleAddProcesso}
      />
    </div>
  );
}

export default App;
