# 💰 EconomizAi

Um aplicativo fullstack para **gerenciar finanças pessoais** de forma simples e eficiente.  
Com o **EconomizAi**, você pode criar **carteiras** e registrar **transações** (entradas e saídas), acompanhando o saldo total e o histórico de gastos em um só lugar.

---

## 🚀 Tecnologias Utilizadas

**Frontend**
- [Next.js](https://nextjs.org/)
- [MobX](https://mobx.js.org/README.html)

**Backend**
- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)

**Outros**
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [Docker](https://www.docker.com/)

---

## 🧩 Funcionalidades

- 📁 Criação de **carteiras de gastos**
- ➕ Registro de **transações** (entradas e saídas)
- 💵 Cálculo automático de **balanço total por carteira**
- 📊 Histórico de transações
- 🧠 Transações recorrentes
- 🗄️ Criação, edição e exclusão de categorias

---

## 🧱 Estrutura do Projeto

```
|── apps
| |── api
| | |── .turbo
| | |── prisma
| | ├── src
│ | | ├── auth
│ | | ├── wallet
│ | | ├── transaction
│ | | ├── category
│ | | ├── recurring
│ | | ├── dashboard
│ | | ├── database
│ | | ├── common
│ | | └── types
| |── web
| | ├── public
| | |── src
│ | | ├── app
│ | | ├── components
│ | | ├── constants
│ | | ├── features
│ | | ├── helpers
│ | | ├── lib
│ | | └── store
├── styles
├── types
```

## ⚙️ Como Rodar o Projeto Localmente

### 🧰 Pré-requisitos
- Node.js 18+  
- pnpm  
- MongoDB rodando localmente

### 🔧 Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/MatheusPCardoso/economizai.git
   cd economizai

2. Instale as dependências:
    ```bash
    pnpm install

3. Configure as variáveis de ambiente:\
Crie um arquivo .env em /api com:
    ```bash
    DATABASE_URL=
    SECRET_KEY=

4. Inicie o projeto:
    ```bash
    pnpm dev

5. Acesse:
    ```bash
    Frontend: http://localhost:3001
    Backend:  http://localhost:3000


🧠 Próximos Passos

 - Implementar atualização do dashboard
 - Corrigir bugs pendentes
 - Fazer deploy no Render, Railway ou Vercel

