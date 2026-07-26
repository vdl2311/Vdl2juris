import React from 'react';
import { Search, Plus, Bell, Sparkles, Command, Menu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onOpenCommandPalette: () => void;
  onOpenNewProcessModal: () => void;
  onOpenAiAssistant: () => void;
  onToggleMobileSidebar?: () => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onOpenCommandPalette,
  onOpenNewProcessModal,
  onOpenAiAssistant,
  onToggleMobileSidebar,
  unreadAlertsCount,
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Mobile Menu Hamburger Button */}
        {onToggleMobileSidebar && (
          <button
            id="btn-toggle-mobile-sidebar"
            onClick={onToggleMobileSidebar}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden cursor-pointer transition-colors"
            title="Abrir Menu de Navegação"
            aria-label="Abrir Menu de Navegação"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <h1 className="text-sm sm:text-base font-semibold text-slate-800 tracking-tight truncate max-w-[150px] xs:max-w-[200px] sm:max-w-xs md:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Command Palette Button (Linear style) */}
        <button
          id="btn-cmd-palette"
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs px-2.5 sm:px-3 py-1.5 rounded-md border border-slate-200 font-medium transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="hidden md:inline">Buscar ou executar comando...</span>
          <span className="inline md:hidden text-[11px]">Buscar</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 bg-white text-[10px] text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs font-mono ml-1">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* AI Assistant Quick Trigger */}
        <button
          id="btn-quick-ai"
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-700 text-xs px-2.5 sm:px-3 py-1.5 rounded-md border border-indigo-200/80 font-medium transition-all shadow-2xs cursor-pointer"
          title="Assistente IA"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse shrink-0" />
          <span className="hidden sm:inline">Assistente IA</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            id="btn-notifications"
            className="p-2 sm:p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Notificações e Alertas DataJud"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </button>
        </div>

        {/* Action Button: Novo Processo */}
        <button
          id="btn-novo-processo-header"
          onClick={onOpenNewProcessModal}
          className="flex items-center gap-1 sm:gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo Processo CNJ</span>
          <span className="inline sm:hidden">Novo</span>
        </button>
      </div>
    </header>
  );
};

