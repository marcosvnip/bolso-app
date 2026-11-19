# MyPocket — Gerenciador Financeiro Pessoal

O **MyPocket** é um aplicativo mobile desenvolvido com React Native e Expo para auxiliar no controle e na organização das finanças pessoais, permitindo registrar despesas, acompanhar movimentações e visualizar informações financeiras.

Os dados são armazenados na nuvem utilizando Firebase Firestore.

**Integrante:** Marcos (projeto individual).

## Funcionalidades

- Cadastro, edição e exclusão de despesas.
- Armazenamento das despesas no Firebase Firestore.
- Formulário com validação de descrição, valor, data e categoria.
- Lista de despesas recentes e histórico completo.
- Busca por descrição e filtro por categoria.
- Exibição de totais e quantidade de despesas.
- Resumo financeiro com gráficos.
- Acompanhamento de meta mensal.
- Perfil do usuário.
- Estados de carregamento, erro e lista vazia.
- Seletor de data e vibração ao salvar.

## Tecnologias utilizadas

- React Native
- Expo
- JavaScript
- Firebase Firestore
- React Navigation
- Git e GitHub

## Capturas de tela

### Resumo financeiro
![Resumo financeiro](assets/screenshots/tela%201%20trabalho.png)

### Despesas recentes
![Despesas recentes](assets/screenshots/tela%202%20trabalho.png)

### Todas as despesas
![Todas as despesas](assets/screenshots/tela%203%20trabalho.png)

### Perfil
![Perfil](assets/screenshots/tela%204%20trabalho.png)

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/marcosvnip/bolso-app.git
```

### 2. Entrar na pasta

```bash
cd bolso-app
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o Firebase

Configure as credenciais do Firebase conforme o arquivo `.env.example` do projeto.

### 5. Iniciar o aplicativo

```bash
npx expo start
```

Para executar na versão web:

```bash
npx expo start --web
```

## Estrutura do projeto

- `assets/` — imagens e recursos visuais.
- `src/` — telas, componentes e funcionalidades.
- `App.js` — arquivo principal da aplicação.
- `README.md` — documentação do projeto.

## Controle de versão

O projeto utiliza Git e GitHub para controle de versão, com branches para organização do desenvolvimento:

- `main` — versão principal.
- `develop` — integração das funcionalidades.
- `feature/*` — desenvolvimento de funcionalidades específicas.

## Divisão das tarefas

Projeto individual: planejamento, desenvolvimento, implementação, testes e documentação realizados por Marcos.
