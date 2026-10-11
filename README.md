# SaborArt — Alta Gastronomia & Receitas Culinárias
### Projeto Final — Aplicação Web Dinâmica e Interativa (UTFPR)

> Aplicação web completa desenvolvida em **React 19 com TypeScript** e **Mantine UI**, consumindo a API pública de receitas da [DummyJSON](https://dummyjson.com/recipes).

🔗 **Deploy (Aplicação no ar):** [https://brunoemferreira.github.io/utfpr-aplicacao-web-dinamica-e-interativa/](https://brunoemferreira.github.io/utfpr-aplicacao-web-dinamica-e-interativa/)  
📦 **Repositório GitHub:** [https://github.com/brunoemferreira/utfpr-aplicacao-web-dinamica-e-interativa](https://github.com/brunoemferreira/utfpr-aplicacao-web-dinamica-e-interativa)

---

## 📌 Cenário do Projeto

O objetivo deste projeto final é construir e publicar uma aplicação web de ponta a ponta em **React com TypeScript**, consumindo os dados da API pública [DummyJSON](https://dummyjson.com). O projeto consolida boas práticas da engenharia de software frontend, abrangendo tipagem estrita, gerenciamento de estado reativo e global, autenticação JWT, formulários validados com Zod, suíte de testes (Vitest + React Testing Library + Playwright) e pipeline automatizado de CI/CD para deploy no GitHub Pages.

### Tema Escolhido: Receitas Culinárias (`/recipes`)
A aplicação foi construída em torno do recurso de **Receitas Culinárias** da DummyJSON, apresentando:
- **Vitrine e Catálogo:** Listagem rica de pratos com fotos, culinária, nível de dificuldade, calorias por porção e tempo de preparo.
- **Busca com Debounce e Filtros:** Pesquisa em tempo real com cancelamento de timer e filtros rápidos por tipo de cozinha (*Italian*, *Asian*, *Mexican*, *American*, *Indian*, etc.).
- **Tela de Detalhes Dinâmica (`/receitas/:id`):** Visualização completa do prato, cálculo dinâmico de porções, lista interativa de ingredientes com checklist e instruções passo a passo numeradas.
- **Favoritos:** Área para salvar e gerenciar pratos favoritos com persistência local.
- **Área Administrativa Protegida (`/admin` e `/admin/nova-receita`):** Gestão de receitas em tabela paginada com cadastro de novos itens via formulário validado por Zod e exclusão simulada na API.

---

## 🔐 Autenticação e Divisão da Aplicação

A aplicação possui separação estrita de áreas:
- **Área Pública:** Navegação completa pela vitrine de pratos, busca, visualização de detalhes das receitas e lista de favoritos.
- **Área Administrativa (Protegida):** Exclusiva para usuários autenticados via `POST /auth/login` da DummyJSON. O acesso é interceptado pelo componente `<ProtectedRoute>`, redirecionando usuários não autenticados para `/login` e preservando a rota de retorno.

> **Credenciais de teste da DummyJSON:**  
> **Usuário:** `emilys`  
> **Senha:** `emilyspass`  
> *(A tela de login conta com um botão de preenchimento automático para testes rápidos).*

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js** (v18 ou superior, recomendado v20+)
- **Yarn** (v1.22+) ou **npm**

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/brunoemferreira/utfpr-aplicacao-web-dinamica-e-interativa.git
   cd utfpr-aplicacao-web-dinamica-e-interativa
   ```

2. **Instalar as dependências com lockfile congelado:**
   ```bash
   yarn install --frozen-lockfile
   ```

3. **Iniciar o servidor de desenvolvimento:**
   ```bash
   yarn dev
   ```
   Acesse a aplicação no navegador em `http://localhost:5173`.

4. **Executar a suíte de testes unitários e de integração (Vitest + RTL):**
   ```bash
   yarn test
   ```

5. **Executar os testes ponta a ponta em navegador real (Playwright):**
   ```bash
   # Instala os navegadores do Playwright (primeira execução)
   npx playwright install chromium

   # Executa os testes E2E em modo headless
   yarn test:e2e
   ```

6. **Gerar a build de produção:**
   ```bash
   yarn build
   ```
   Os arquivos otimizados serão gerados no diretório `dist/`.

---

## ✅ Checklist dos 10 Requisitos Técnicos

- [x] **1. Estrutura de componentes e tipagem com TypeScript**  
  - **Como foi resolvido:** Projeto inicializado com Vite (`react-ts`). Código organizado modularmente em pastas (`components/`, `pages/`, `contexts/`, `services/`, `schemas/`, `routes/`, `theme/`). Todos os componentes são funcionais, com tipagem estrita de props via interfaces TypeScript, composição com `children` (ex: `ProtectedRoute`, `MainLayout`, `MantineProvider`) e total ausência do tipo `any`. Estilização baseada em tokens do Mantine UI v9 e CSS customizado com micro-animações de hover nos cards.

- [x] **2. Estado reativo, imutabilidade e ciclo de vida**  
  - **Como foi resolvido:** Estados locais manipulados estritamente com `useState` e respeitando a imutabilidade por meio do operador spread (`...prev`) e métodos imutáveis (`.filter(...)`, `.map(...)`). Na tela de detalhes, a lista de ingredientes selecionados e o multiplicador de porções são atualizados de forma imutável. No `HomePage`, foi implementado `useEffect` com função de limpeza (`clearTimeout`) para o debounced search de 400ms e flags de cancelamento para requisições assíncronas.

- [x] **3. Estado global com Context API e Custom Hooks**  
  - **Como foi resolvido:** Criados dois contextos globais: `AuthContext` (gerencia sessão, token JWT e dados do usuário) e `FavoritesContext` (gerencia receitas favoritadas). Ambos expõem Custom Hooks dedicados (`useAuth` e `useFavorites`) que contêm validação explícita lançando erros caso sejam consumidos fora de seus respectivos Providers. A persistência é sincronizada no `localStorage`.

- [x] **4. Roteamento e layouts com React Router**  
  - **Como foi resolvido:** Configurado `react-router-dom` v7 com rotas declarativas centralizadas em `AppRoutes.tsx`. Criado o layout persistente `MainLayout` contendo `AppHeader` e `AppFooter`, renderizando as páginas filhas via `<Outlet />`. Navegação declarativa implementada com `<NavLink>` (com indicador visual de rota ativa), navegação programática com `useNavigate()` e rotas dinâmicas capturadas via `useParams<{ id: string }>()` na página de detalhes `/receitas/:id`.

- [x] **5. Interface gráfica e formulários com Mantine UI**  
  - **Como foi resolvido:** Configurado `<MantineProvider>` com tema culinário personalizado (`culinaryTheme`, cor primária `orange`, suporte a modo claro/escuro via `useMantineColorScheme`). Montados layouts responsivos com `Container`, `Grid`, `SimpleGrid` e `Card`. Formulários de login e de cadastro de receita desenvolvidos com `@mantine/form`, tabelas com paginação (`Pagination`) e feedback de carregamento com `RecipeSkeletonGrid` e `Loader`.

- [x] **6. Fluxo de autenticação JWT e rotas protegidas**  
  - **Como foi resolvido:** Tela de login consumindo o endpoint `POST /auth/login` da DummyJSON. Ao autenticar, o token JWT (`accessToken`) e os dados do usuário são salvos no `localStorage` e refletidos no `AuthContext`. O componente `<ProtectedRoute>` intercepta requisições às rotas `/admin` e `/admin/nova-receita`, redirecionando visitantes não autorizados para `/login` e preservando a rota de retorno no `location.state.from`.

- [x] **7. Consumo de API REST, interceptors e validação com Zod**  
  - **Como foi resolvido:** Instância centralizada do Axios em `src/services/api.ts` com `baseURL: 'https://dummyjson.com'`. Configurado interceptor de requisição que injeta o token JWT no cabeçalho `Authorization: Bearer <token>`. Interceptor de resposta padroniza mensagens amigáveis de erro (trata erros 400, 401, 404, 500 e offline). Schemas criados com Zod (`recipeSchema`, `createRecipeFormSchema`, `loginFormSchema`), com inferência de tipos via `z.infer`, validação segura com `.safeParse()` e integração com os formulários do Mantine via função `zodResolver`.

- [x] **8. Testes automatizados com Vitest e RTL**  
  - **Como foi resolvido:** Suíte completa com 16 testes unitários e de componentes passando com 100% de sucesso. Testes dos schemas Zod (`recipe.schema.test.ts`, `auth.schema.test.ts`), teste do componente `RecipeCard.test.tsx` com acessibilidade (`getByRole`, `getByLabelText`) e `@testing-library/user-event`, teste do formulário `LoginPage.test.tsx` (validações e quick fill) e teste do guardião `ProtectedRoute.test.tsx`. Criado utilitário `renderWithProviders` com `MemoryRouter` e providers em memória.

- [x] **9. Testes ponta a ponta com Playwright**  
  - **Como foi resolvido:** Playwright configurado em `playwright.config.ts` com webServer automático e execução headless. Criados dois cenários E2E completos:
    1. `e2e/auth.spec.ts`: Tentativa de acesso direto à área restrita `/admin`, redirecionamento automático para `/login`, preenchimento com credenciais da DummyJSON, login bem-sucedido, redirecionamento ao painel administrativo e logout.
    2. `e2e/recipes.spec.ts`: Carregamento da vitrine de receitas, busca por termo ("Pizza"), debounce, navegação dinâmica até a tela de detalhes `/receitas/:id`, marcação de favorito e verificação do prato salvo na tela `/favoritos`.

- [x] **10. Pipeline de CI/CD e deploy em produção**  
  - **Como foi resolvido:** Workflows criados no diretório `.github/workflows/`:
    - `ci.yml`: Disparado a cada `push` e `pull_request` na branch `main`. Realiza checkout, setup do Node.js 20, instalação com lockfile congelado (`yarn install --frozen-lockfile`), execução dos testes do Vitest (`yarn test`) e dos testes E2E do Playwright (`yarn test:e2e`).
    - `cd.yml`: Disparado a cada `push` na branch `main`. Realiza o build de produção (`yarn build`) e publica no GitHub Pages via `actions/deploy-pages@v4`.
    - Configurado `base: process.env.VITE_BASE_URL || './'` no `vite.config.ts` e fallback de SPA `public/404.html` integrado ao script no `index.html`, garantindo que rotas diretas da SPA não gerem erro 404 ao serem recarregadas.

---

## 🤖 Uso de Inteligência Artificial

O desenvolvimento deste projeto contou com o apoio de ferramentas de IA (Google Antigravity IDE):

- **Aceleração de Código e Schemas:** Criação e refinamento de schemas do Zod com validação rigorosa para os tipos retornados pela API DummyJSON de receitas.
- **Testes e Casos de Borda:** Elaboração de cenários de teste para validações de formulário, redirecionamento de rotas protegidas e fluxos E2E no Playwright.
- **Arquitetura e Refatoração:** Configuração dos interceptors do Axios, abstração dos Custom Hooks (`useAuth`, `useFavorites`) e estruturação do pipeline de CI/CD no GitHub Actions.
- **Responsabilidade Técnica:** Todo o código gerado foi revisado, testado localmente, ajustado para conformidade com a versão mais recente das bibliotecas (React 19, Mantine UI v9, Zod 4, Vitest 5 e Playwright) e validado com compilação estrita do TypeScript.

---

## 📋 Regras de Entrega

1. **Repositório Git:** Repositório público no GitHub com todo o código fonte e histórico de commits.
2. **README no Repositório:** Instruções de execução local, tema `/recipes`, checklist dos 10 itens explicada e nota sobre o uso de IA.
3. **Aplicação no ar:** Link público da aplicação no GitHub Pages no topo deste README e no campo de envio do Moodle.
