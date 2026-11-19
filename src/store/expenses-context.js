import { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './auth-context';

const COLLECTION = 'despesas';
const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const { user } = useAuth();
  const uid = user.uid;
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudgetState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), where('uid', '==', uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => b.date.localeCompare(a.date));
        setExpenses(list);
        setError(null);
        setLoading(false);
      },
      () => {
        setError('Não foi possível carregar as despesas. Verifique a conexão e a configuração do Firebase.');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [uid]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'config', uid),
      (snap) => setBudgetState(snap.exists() ? snap.data().valor ?? 0 : 0),
      () => {}
    );
    return unsubscribe;
  }, [uid]);

  function addExpense(data) {
    return addDoc(collection(db, COLLECTION), { ...data, uid });
  }

  function updateExpense(id, data) {
    return updateDoc(doc(db, COLLECTION, id), data);
  }

  function deleteExpense(id) {
    return deleteDoc(doc(db, COLLECTION, id));
  }

  function setBudget(valor) {
    return setDoc(doc(db, 'config', uid), { valor });
  }

  return (
    <ExpensesContext.Provider
      value={{ expenses, budget, loading, error, addExpense, updateExpense, deleteExpense, setBudget }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses deve ser usado dentro de um ExpensesProvider');
  }
  return context;
}
