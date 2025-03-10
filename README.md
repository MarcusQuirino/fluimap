# FluiMap

FluiMap é uma aplicação web projetada para ajudar gestores a avaliar a dinâmica, engajamento e relacionamentos da equipe através de pesquisas estruturadas. O sistema coleta respostas dos membros da equipe via pesquisas distribuídas por e-mail e processa esses dados através de um modelo estatístico em R acessível por meio de uma API web.

## Visão Geral do Projeto

FluiMap ajuda gestores a entender a dinâmica da equipe:

- Fornecendo ferramentas para avaliar relacionamentos e padrões de comunicação
- Simplificando processos de distribuição e coleta de pesquisas
- Gerando insights relevantes a partir das respostas da equipe
- Apresentando visualizações de dados que destacam os relacionamentos da equipe

## Principais Funcionalidades

### Para Gestores

- Autenticação usando Clerk
- Gerenciamento de equipe com uploads individuais e em massa via CSV
- Administração de pesquisas com prazos e acompanhamento de respostas em tempo real
- Painel analítico com visualizações interativas

### Para Membros da Equipe

- Não requer criação de conta
- Interface de pesquisa otimizada para dispositivos móveis
- Envio seguro de feedback através de links únicos

### Análise e Visualização

- Visualização de rede de relacionamentos da equipe
- Métricas de engajamento com análise de tendências
- Análises comparativas para dados históricos

## Stack Tecnológica

### Frontend

- [Next.js](https://nextjs.org/) - Framework React
- [Shadcn UI](https://ui.shadcn.com/) - Biblioteca de componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [React Hook Form](https://react-hook-form.com/) - Validação de formulários
- [Zod](https://zod.dev/) - Validação de esquemas
- [React Email](https://react.email/) - Sistema de templates de e-mail

### Backend

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Endpoints do servidor
- [MongoDB](https://www.mongodb.com/) - Banco de dados
- [Mongoose](https://mongoosejs.com/) - ODM para MongoDB
- [Clerk](https://clerk.com/) - Autenticação
- [Resend](https://resend.io/) - Serviço de e-mail

### Ferramentas de Desenvolvimento

- [TypeScript](https://www.typescriptlang.org/) - Segurança de tipos
- [ESLint](https://eslint.org/) - Linting de código
- [Prettier](https://prettier.io/) - Formatação de código
- [Docker](https://www.docker.com/) - Containerização

## Começando

### Instalação

Primeiramente se certifique que possua um sistema operacional de adulto funcional (linux ou macos)

brincadeiras a parte, esse tutorial é pra unix, se tu usa windows tu vai ter que adaptar alguns comando mas nada que o GPT não possa te ajudar com.

Para sistemas UNIX eu criei um script q deve fazer todo o setup sozinho (talvez)

```bash
./setup.sh
```

se der certo pula lá pro passo 6

1. Baixe um Versionador de node

- se certifique q não possui o node já instalado na maquina

  ```bash
  node --version
  ```

  caso tenha desinstale

- baixe algum versionador: de preferencia (nvm)[https://github.com/nvm-sh/nvm] mas eu uso (fnm)[https://github.com/Schniz/fnm]
  o tutorial vai estar assumindo nvm

2. Clone o repositório

   ```bash
   git clone https://github.com/MarcusQuirino/fluimap
   cd fluimap
   ```

3. Instale a versão do node

   ```bash
    nvm use
   ```

   esse comando vai setar a versão do node definida para o projeto em (.nvmrc)[.nvmrc] e baixar caso tu não tenha

4. Instale as dependências

   ```bash
   npm install
   ```

5. Configure as variáveis de ambiente

   ```bash
   cp .env.example .env
   ```

   Atualize o arquivo `.env` com suas credenciais fornecidas no servidor do discord

6. Inicie o MongoDB
   esse passo é só se tu quiser usar o mongodb no docker. eu recoemndo fazer isso se tu vai fazer muitos testes e mudanças e não quer poluir o banco de dev

   ```bash
   docker-compose up -d
   ```

7. Inicie o servidor de desenvolvimento

   ```bash
   npm run dev
   ```

8. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Variáveis de Ambiente

Variáveis de ambiente necessárias:

- `DATABASE_URL`: String de conexão do MongoDB Atlas ou do docker (mongodb://localhost:27017/db)
- `CLERK_SECRET_KEY`: Chave secreta do Clerk
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Chave pública do Clerk
- `RESEND_API_KEY`: Chave da API Resend para envio de e-mails

## Estrutura do Projeto

```
fluimap/
├── src/
│   ├── app/              # Páginas e layouts do Next.js
│   │   ├── [page route]/ # pagina web
│   │   └── api/          # rotas de API
│   ├── lib/              # Funções utilitárias
│   ├── models/           # Scheemas MongoDB
│   ├── server/           # Código do servidor
│   └── styles/           # Estilos globais
├── public/               # Ativos estáticos
├── LLM                   # contexto para IA
├── .env.example          # Exemplo de variáveis de ambiente
└── docker-compose.yml    # Configuração Docker
```

## Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Verificar tipos e lint
npm run check

# Formatar código
npm run format:write

# Compilar para produção
npm run build

# Iniciar servidor de produção
npm run start
```

## Acessos

todos os acessos necessarios para o desenvolvimento foram criados e podem ser encontrados no discord.

são eles:

- Clerk
- MongoDB Atlas
- Resend

## Integração com Modelo R

FluiMap integra-se com um modelo estatístico em R por meio de uma API web para processar dados de pesquisa e gerar insights. Os dados são transformados antes de serem enviados ao modelo R e os resultados são visualizados no painel.

## Contribuição

O workflow e convenção de como iremos trabalhar pode ser encontrado no arquivo (CONTRIBUTING)[CONTRIBUTING]

## Licença

[MIT](LICENSE)
