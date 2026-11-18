import { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION = 'despesas';
const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
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

  async function addExpense(data) {
    await addDoc(collection(db, COLLECTION), data);
  }

  async function updateExpense(id, data) {
    await updateDoc(doc(db, COLLECTION, id), data);
  }

  async function deleteExpense(id) {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  return (
    <ExpensesContext.Provider
      value={{ expenses, loading, error, addExpense, updateExpense, deleteExpense }}
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
