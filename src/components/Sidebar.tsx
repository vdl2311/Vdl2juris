import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  CalendarCheck, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  ChevronDown,
  Scale,
  X
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  currentUser?: UserProfile;
  onSwitchRole?: (role: string) => void;
  currentUserRole?: UserRole;
  setCurrentUserRole?: (role: UserRole) => void;
  unreadAlertsCount?: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  setActiveTab,
  currentUser,
  onSwitchRole,
  currentUserRole = 'admin',
  setCurrentUserRole,
  unreadAlertsCount = 2,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const handleSelectTab = (tabId: string) => {
    if (onSelectTab) onSelectTab(tabId);
    if (setActiveTab) setActiveTab(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'processos', label: 'Processos & DataJud', icon: Briefcase, badge: 'CNJ Sync' },
    { id: 'clientes', label: 'Clientes (CRM)', icon: Users },
    { id: 'documentos', label: 'Documentos & Extrator', icon: FileText },
    { id: 'prazos', label: 'Tarefas & Prazos', icon: CalendarCheck, badgeCount: unreadAlertsCount },
    { id: 'assistente-ia', label: 'Assistente IA Gemini', icon: Sparkles, highlight: true },
    { id: 'arquitetura', label: 'Arquitetura & Especificação', icon: Layers },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-2xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar (Responsive: drawer on mobile, static on desktop) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col h-screen border-r border-slate-800 select-none transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Workspace Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-900/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white">JuriSmart</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  PRO 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Advocacia Inteligente</p>
            </div>
          </div>

          {/* Close Button on Mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 md:hidden transition-colors cursor-pointer"
              title="Fechar Menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Role Switcher (Linear Style) */}
        <div className="px-3 py-2.5 bg-slate-950/40 border-b border-slate-800/50">
          <div className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1 tracking-wider">
            Perfil em Uso
          </div>
          <div className="relative">
            <select
              id="role-selector"
              aria-label="Selecionar perfil em uso"
              value={currentUser?.perfil || currentUserRole}
              onChange={(e) => {
                const selectedRole = e.target.value as UserRole;
                if (onSwitchRole) onSwitchRole(selectedRole);
                if (setCurrentUserRole) setCurrentUserRole(selectedRole);
              }}
              className="w-full bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium rounded-md px-2.5 py-2 appearance-none border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-colors"
            >
              <option value="admin">Dra. Helena (Admin / Sócio)</option>
              <option value="advogado">Dr. Roberto (Advogado Sênior)</option>
              <option value="assistente">Camila (Assistente Jurídica)</option>
              <option value="estagiario">Lucas (Estagiário de Direito)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navegação Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all cursor-pointer min-h-[40px] ${
                  isActive
                    ? 'bg-indigo-600/90 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono shrink-0">
                    {item.badge}
                  </span>
                )}
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Integration & DataJud Live Indicator */}
        <div className="p-3 m-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-2 shrink-0">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              DataJud API CNJ
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">Conectado</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Gemini 3.6 IA
            </span>
            <span className="text-indigo-300 font-mono text-[10px]">Ativo</span>
          </div>
        </div>

        {/* Footer / User Profile */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/30 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-indigo-900 text-indigo-200 border border-indigo-700/50 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser?.nome ? currentUser.nome.substring(0, 2).toUpperCase() : 'HM'}
            </div>
            <div className="truncate max-w-[120px]">
              <p className="font-medium text-slate-200 truncate">
                {currentUser?.nome || 'Dra. Helena Alencar'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize truncate">
                {currentUser?.perfil || currentUserRole}
              </p>
            </div>
          </div>
          <div title="Autenticação Firebase & Permissões Ativas">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};

