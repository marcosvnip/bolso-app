import { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION = 'despesas';
const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudgetState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setExpenses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setError(null);
        setLoading(false);
      },
      () => {
        setError('Não foi possível carregar as despesas. Verifique a conexão e a configuração do Firebase.');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'config', 'orcamento'),
      (snap) => setBudgetState(snap.exists() ? snap.data().valor ?? 0 : 0),
      () => {}
    );
    return unsubscribe;
  }, []);

  function addExpense(data) {
    return addDoc(collection(db, COLLECTION), data);
  }

  function updateExpense(id, data) {
    return updateDoc(doc(db, COLLECTION, id), data);
  }

  function deleteExpense(id) {
    return deleteDoc(doc(db, COLLECTION, id));
  }

  function setBudget(valor) {
    return setDoc(doc(db, 'config', 'orcamento'), { valor });
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
