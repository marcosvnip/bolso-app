# Bolso - Gerenciador de Despesas

Aplicativo mobile em React Native (Expo) para controlar gastos pessoais por categoria, com dados salvos na nuvem (Firebase Firestore).

**Integrante:** SEU NOME COMPLETO (projeto individual)

## Funcionalidades

- Cadastro, edição e exclusão de despesas (Firestore, com atualização em tempo real)
- Formulário com validação por campo (descrição, valor, data e categoria)
- Lista de despesas recentes (últimos 7 dias) e de todas as despesas
- Busca por descrição e filtro por categoria, com total e quantidade refletindo o filtro
- Estados de carregamento, erro e lista vazia
- Recursos nativos: seletor de data (DateTimePicker) e vibração (Haptics) ao salvar
- Navegação com Stack + Bottom Tabs (React Navigation)

## Capturas de tela

(adicione aqui os prints)

## Como executar

1. Instale as dependências:
   ```
   npm install
   ```
2. Crie um projeto no [Firebase](https://console.firebase.google.com), ative o **Firestore Database** (modo de teste) e registre um app Web.
3. Copie `.env.example` para `.env` e preencha com os valores do `firebaseConfig`.
4. Inicie o app:
   ```
   npx expo start
   ```
   Para abrir no navegador: `npx expo start --web`.

## Estrutura

```
App.js
src/
├── components/   (AppButton, ExpenseItem, ExpenseList)
├── constants/    (cores e categorias)
├── firebase/     (configuração do Firebase)
├── screens/      (RecentExpenses, AllExpenses, ManageExpense)
├── store/        (contexto global com Firestore)
└── util/         (datas e moeda)
```

## Git Flow

Branches `main`, `develop` e `feature/*`, com Pull Requests para a `develop`.

## Divisão das tarefas

Projeto individual: todas as tarefas foram feitas por SEU NOME.
