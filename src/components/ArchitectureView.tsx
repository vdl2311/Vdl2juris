import React, { useState } from 'react';
import { 
  Layers, 
  Server, 
  Database, 
  Shield, 
  Sparkles, 
  Workflow, 
  Cpu, 
  Code, 
  CheckCircle2, 
  FileCode, 
  Lock, 
  Zap,
  Globe,
  Terminal
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'firestore' | 'security' | 'datajud' | 'rag' | 'roadmap'>('overview');

  const firestoreSchemaJson = `{
  "entities": {
    "User": {
      "title": "Usuários do Sistema",
      "properties": {
        "uid": { "type": "string" },
        "nome": { "type": "string" },
        "email": { "type": "string", "format": "email" },
        "perfil": { "enum": ["admin", "advogado", "assistente", "estagiario"] },
        "oab": { "type": "string" }
      },
      "required": ["uid", "email", "perfil"]
    },
    "Cliente": {
      "title": "Clientes PF/PJ",
      "properties": {
        "id": { "type": "string" },
        "nome": { "type": "string" },
        "tipo": { "enum": ["PF", "PJ"] },
        "cpfCnpj": { "type": "string" },
        "email": { "type": "string" },
        "telefone": { "type": "string" }
      }
    },
    "Processo": {
      "title": "Processos Jurídicos",
      "properties": {
        "id": { "type": "string" },
        "numeroCnj": { "type": "string", "pattern": "^\\\\d{7}-\\\\d{2}\\\\.\\\\d{4}\\\\.\\\\d\\\\.\\\\d{2}\\\\.\\\\d{4}$" },
        "tribunal": { "type": "string" },
        "classeProcessual": { "type": "string" },
        "assunto": { "type": "string" },
        "status": { "enum": ["Ativo", "Em Recurso", "Arquivado", "Suspenso"] },
        "valorCausa": { "type": "number" }
      }
    }
  },
  "firestore": {
    "/users/{userId}": { "schema": "User", "description": "Perfil de usuário e permissões" },
    "/clientes/{clienteId}": { "schema": "Cliente", "description": "Base de clientes" },
    "/processos/{processoId}": { "schema": "Processo", "description": "Processos ativos e arquivados" },
    "/processos/{processoId}/movimentacoes/{movId}": { "schema": "Movimentacao", "description": "Histórico do DataJud" }
  }
}`;

  const firestoreRulesDraft = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isAdmin() {
      return isSignedIn() && getUserData().perfil == 'admin';
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow write: if isOwner(userId) || isAdmin();
    }

    match /clientes/{clienteId} {
      allow read, write: if isSignedIn();
    }

    match /processos/{processoId} {
      allow read: if isSignedIn();
      allow create, update: if isSignedIn();
      allow delete: if isAdmin();
      
      match /movimentacoes/{movId} {
        allow read: if isSignedIn();
        allow write: if isSignedIn();
      }
    }
  }
}`;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-700 border border-indigo-200 uppercase font-mono">
            Entregáveis Técnicos
          </span>
          <span className="text-xs text-slate-400">Next.js + Firebase + Gemini + DataJud Architecture</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          <span>Especificação Completa da Arquitetura do Sistema</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Documentação de engenharia para implementação do sistema jurídico moderno estilo Linear/Notion/Stripe.
        </p>
      </div>

      {/* Navigation sub-tabs (Horizontally scrollable on mobile) */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveSection('overview')}
          className={`py-2.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
            activeSection === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          1. Arquitetura Global
        </button>

        <button
          onClick={() => setActiveSection('firestore')}
          className={`py-2.5 px-3 sm:px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer shrink-0 ${
            activeSection === 'firestore' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          2. Modelo Firestore (Blueprint)
        </button>

        <button
          onClick={() => setActiveSection('security')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSection === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          3. Regras de Segurança Rules
        </button>

        <button
          onClick={() => setActiveSection('datajud')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSection === 'datajud' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          4. Integração DataJud CNJ
        </button>

        <button
          onClick={() => setActiveSection('rag')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSection === 'rag' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          5. Gemini RAG & IA
        </button>

        <button
          onClick={() => setActiveSection('roadmap')}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeSection === 'roadmap' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'
          }`}
        >
          6. Plano de Fases
        </button>
      </div>

      {/* SECTION 1: GLOBAL ARCHITECTURE */}
      {activeSection === 'overview' && (
        <div className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Frontend (Vercel / Next.js)</h3>
              <p className="text-slate-600 leading-relaxed">
                App Router no Next.js com Server Components, Tailwind CSS para estilo utilitário e Lucide React. Interface otimizada no padrão Linear/Stripe.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Backend & Firebase</h3>
              <p className="text-slate-600 leading-relaxed">
                Firebase Authentication (RBAC para Admin, Advogado, Assistente, Estagiário) e Cloud Firestore para dados em tempo real com subcoleções relacionais.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">IA Gemini & DataJud CNJ</h3>
              <p className="text-slate-600 leading-relaxed">
                Servidor centralizado com @google/genai (Gemini 3.6-flash) e rota proxy para API pública do DataJud CNJ com sincronização em background.
              </p>
            </div>
          </div>

          <div className="p-5 bg-slate-900 text-white rounded-xl space-y-3 font-mono">
            <h4 className="text-sm font-bold text-indigo-400">Estrutura do Projeto Next.js Recomendada:</h4>
            <pre className="text-[11px] leading-relaxed overflow-x-auto text-slate-300">
{`app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx (Visão Geral)
│   ├── processos/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── clientes/page.tsx
│   ├── documentos/page.tsx
│   ├── prazos/page.tsx
│   └── assistente-ia/page.tsx
├── api/
│   ├── datajud/cnj/[cnj]/route.ts
│   ├── ai/chat/route.ts
│   ├── ai/analyze-doc/route.ts
│   └── ai/draft-minuta/route.ts
├── lib/
│   ├── firebase.ts
│   ├── gemini.ts
│   └── datajud.ts
└── types/index.ts`}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 2: FIRESTORE BLUEPRINT */}
      {activeSection === 'firestore' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Modelagem IR (firebase-blueprint.json)</span>
            </h3>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">Schema Draft-07</span>
          </div>

          <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
            <pre>{firestoreSchemaJson}</pre>
          </div>
        </div>
      )}

      {/* SECTION 3: FIRESTORE SECURITY RULES */}
      {activeSection === 'security' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Regras de Segurança Hardened (firestore.rules)</span>
            </h3>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono">Deny-by-default</span>
          </div>

          <div className="p-4 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto">
            <pre>{firestoreRulesDraft}</pre>
          </div>
        </div>
      )}

      {/* SECTION 4: DATAJUD CNJ INTEGRATION */}
      {activeSection === 'datajud' && (
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Workflow className="w-4 h-4 text-indigo-600" />
            <span>Arquitetura de Sincronização DataJud CNJ</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-indigo-900">1. Consulta e Cache de Respostas</h4>
              <p className="text-slate-600 leading-relaxed">
                As requisições passam pela API Route <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">/api/datajud/cnj/[cnj]</code>. Respostas da API do CNJ são salvos no Firestore sob a coleção <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">/processos/{'{id}'}/movimentacoes</code> para evitar consultas repetidas e estourar a quota.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-indigo-900">2. Jobs Automáticos de Atualização</h4>
              <p className="text-slate-600 leading-relaxed">
                Um job noturno (via Vercel Cron ou Firebase Scheduled Function) varre os processos com status "Ativo", compara o hash do último andamento e dispara um alerta automático para o advogado caso surja nova movimentação relevante.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: GEMINI RAG & IA */}
      {activeSection === 'rag' && (
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Camada de IA Gemini & Pipeline RAG</span>
          </h3>

          <p className="text-slate-700 leading-relaxed">
            Utilização do modelo <strong>gemini-3.6-flash</strong> acoplado ao SDK oficial <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">@google/genai</code>. As chamadas são estritamente mantidas no backend Node/Express ou Next.js API Routes para garantir sigilo da chave <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">GEMINI_API_KEY</code>.
          </p>

          <div className="p-3.5 bg-purple-50/60 rounded-lg border border-purple-100 space-y-2">
            <h4 className="font-bold text-purple-900">Pipeline RAG (Retrieval Augmented Generation):</h4>
            <ol className="list-decimal list-inside space-y-1 text-purple-950 text-[11px]">
              <li>O usuário envia a dúvida ou caso no assistente do escritório.</li>
              <li>A API busca no Firestore por peças, decisões e jurisprudências semelhantes salvas.</li>
              <li>O contexto recortado é injetado como <code className="bg-purple-100 px-1 rounded font-mono">systemInstruction</code> para a chamada GenAI.</li>
              <li>O Gemini sintetiza uma recomendação fundamentada em leis brasileiras (CPC, CC, CLT) em milissegundos.</li>
            </ol>
          </div>
        </div>
      )}

      {/* SECTION 6: ROADMAP DE DESENVOLVIMENTO */}
      {activeSection === 'roadmap' && (
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">1</div>
            <div>
              <h4 className="font-bold text-slate-900">Fase 1: Core System & Auth (Semanas 1-2)</h4>
              <p className="text-slate-500">Configuração Next.js, Firebase Auth, Perfis de Usuário (RBAC) e telas de login/dashboard.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">2</div>
            <div>
              <h4 className="font-bold text-slate-900">Fase 2: Gestão Processual & DataJud (Semanas 3-4)</h4>
              <p className="text-slate-500">Importação por CNJ, raspagem DataJud, linha do tempo de movimentações e controle de prazos.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold">3</div>
            <div>
              <h4 className="font-bold text-slate-900">Fase 3: Inteligência Artificial Gemini (Semanas 5-6)</h4>
              <p className="text-slate-500">Chat do assistente, extrator de documentos PDF, gerador de minutas e base RAG.</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">4</div>
            <div>
              <h4 className="font-bold text-slate-900">Fase 4: Automação & Hardening (Semanas 7-8)</h4>
              <p className="text-slate-500">Alertas automáticos, regras de segurança Firestore, otimização de performance Vercel e produção.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
