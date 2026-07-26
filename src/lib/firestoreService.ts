import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc, 
  getDocs 
} from 'firebase/firestore';
import { db } from './firebase';
import { Processo, Cliente, Documento, TarefaPrazo } from '../types';
import { mockProcessos, mockClientes, mockDocumentos, mockTarefas } from '../data/mockData';

// Initialize default mock data into Firestore if collections are empty
export const seedInitialFirestoreData = async () => {
  try {
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
    console.warn('Firestore initial seed warning (offline or permissions):', error);
  }
};

// Real-time Firestore Subscribers
export const subscribeProcessos = (callback: (data: Processo[]) => void) => {
  return onSnapshot(
    collection(db, 'processos'),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Processo[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Processo);
        });
        callback(list);
      }
    },
    (error) => {
      console.warn('Error subscribing to processos:', error);
    }
  );
};

export const subscribeClientes = (callback: (data: Cliente[]) => void) => {
  return onSnapshot(
    collection(db, 'clientes'),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Cliente[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Cliente);
        });
        callback(list);
      }
    },
    (error) => {
      console.warn('Error subscribing to clientes:', error);
    }
  );
};

export const subscribeDocumentos = (callback: (data: Documento[]) => void) => {
  return onSnapshot(
    collection(db, 'documentos'),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Documento[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as Documento);
        });
        callback(list);
      }
    },
    (error) => {
      console.warn('Error subscribing to documentos:', error);
    }
  );
};

export const subscribeTarefas = (callback: (data: TarefaPrazo[]) => void) => {
  return onSnapshot(
    collection(db, 'tarefas'),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: TarefaPrazo[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ ...docSnap.data(), id: docSnap.id } as TarefaPrazo);
        });
        callback(list);
      }
    },
    (error) => {
      console.warn('Error subscribing to tarefas:', error);
    }
  );
};

// Database Mutators
export const saveProcessoDb = async (proc: Processo) => {
  try {
    await setDoc(doc(db, 'processos', proc.id), proc);
  } catch (err) {
    console.error('Error saving processo to Firestore:', err);
  }
};

export const updateProcessoResumoDb = async (processoId: string, resumo: string) => {
  try {
    await updateDoc(doc(db, 'processos', processoId), { resumoIa: resumo });
  } catch (err) {
    console.error('Error updating processo resumo:', err);
  }
};

export const saveClienteDb = async (cli: Cliente) => {
  try {
    await setDoc(doc(db, 'clientes', cli.id), cli);
  } catch (err) {
    console.error('Error saving cliente to Firestore:', err);
  }
};

export const saveDocumentoDb = async (docObj: Documento) => {
  try {
    await setDoc(doc(db, 'documentos', docObj.id), docObj);
  } catch (err) {
    console.error('Error saving documento to Firestore:', err);
  }
};

export const saveTarefaDb = async (tarefa: TarefaPrazo) => {
  try {
    await setDoc(doc(db, 'tarefas', tarefa.id), tarefa);
  } catch (err) {
    console.error('Error saving tarefa to Firestore:', err);
  }
};

export const updateTarefaStatusDb = async (tarefaId: string, status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado') => {
  try {
    await updateDoc(doc(db, 'tarefas', tarefaId), { status });
  } catch (err) {
    console.error('Error updating tarefa status in Firestore:', err);
  }
};
