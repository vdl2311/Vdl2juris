import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Processo, Cliente, Documento, TarefaPrazo } from '../types';
import { mockProcessos, mockClientes, mockDocumentos, mockTarefas } from '../data/mockData';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details:', JSON.stringify(errInfo));
  return errInfo;
}

// Test Connection on Boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'processos', 'connection_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline or restricted network environment.');
    }
  }
}

// Initialize default mock data into Firestore if collections are empty
export const seedInitialFirestoreData = async () => {
  try {
    await testFirestoreConnection();

    const procSnap = await getDocs(collection(db, 'processos'));
    if (procSnap.empty) {
      for (const p of mockProcessos) {
        await setDoc(doc(db, 'processos', p.id), p);
      }
    }

    const cliSnap = await getDocs(collection(db, 'clientes'));
    if (cliSnap.empty) {
      for (const c of mockClientes) {
        await setDoc(doc(db, 'clientes', c.id), c);
      }
    }

    const docSnap = await getDocs(collection(db, 'documentos'));
    if (docSnap.empty) {
      for (const d of mockDocumentos) {
        await setDoc(doc(db, 'documentos', d.id), d);
      }
    }

    const tarSnap = await getDocs(collection(db, 'tarefas'));
    if (tarSnap.empty) {
      for (const t of mockTarefas) {
        await setDoc(doc(db, 'tarefas', t.id), t);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'initial_seed');
  }
};

// Real-time Firestore Subscribers with Error Handlers & Accurate Full-Sync
export const subscribeProcessos = (callback: (data: Processo[]) => void) => {
  return onSnapshot(
    collection(db, 'processos'),
    (snapshot) => {
      const list: Processo[] = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
      }) as Processo);
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'processos');
    }
  );
};

export const subscribeClientes = (callback: (data: Cliente[]) => void) => {
  return onSnapshot(
    collection(db, 'clientes'),
    (snapshot) => {
      const list: Cliente[] = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
      }) as Cliente);
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'clientes');
    }
  );
};

export const subscribeDocumentos = (callback: (data: Documento[]) => void) => {
  return onSnapshot(
    collection(db, 'documentos'),
    (snapshot) => {
      const list: Documento[] = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
      }) as Documento);
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'documentos');
    }
  );
};

export const subscribeTarefas = (callback: (data: TarefaPrazo[]) => void) => {
  return onSnapshot(
    collection(db, 'tarefas'),
    (snapshot) => {
      const list: TarefaPrazo[] = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
      }) as TarefaPrazo);
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tarefas');
    }
  );
};

// Database Mutators
export const saveProcessoDb = async (proc: Processo) => {
  try {
    await setDoc(doc(db, 'processos', proc.id), proc);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `processos/${proc.id}`);
  }
};

export const updateProcessoResumoDb = async (processoId: string, resumo: string) => {
  try {
    await updateDoc(doc(db, 'processos', processoId), { resumoIa: resumo });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `processos/${processoId}`);
  }
};

export const saveClienteDb = async (cli: Cliente) => {
  try {
    await setDoc(doc(db, 'clientes', cli.id), cli);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `clientes/${cli.id}`);
  }
};

export const saveDocumentoDb = async (docObj: Documento) => {
  try {
    await setDoc(doc(db, 'documentos', docObj.id), docObj);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `documentos/${docObj.id}`);
  }
};

export const saveTarefaDb = async (tarefa: TarefaPrazo) => {
  try {
    await setDoc(doc(db, 'tarefas', tarefa.id), tarefa);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `tarefas/${tarefa.id}`);
  }
};

export const updateTarefaStatusDb = async (tarefaId: string, status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado') => {
  try {
    await updateDoc(doc(db, 'tarefas', tarefaId), { status });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `tarefas/${tarefaId}`);
  }
};
