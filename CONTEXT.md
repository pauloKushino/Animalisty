# AnimaListy — Documento de Contexto

> Gerado em: 08/07/2026
> Projeto: Catálogo de Animes — Spring Boot + React + Tailwind + Jikan API

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Histórico de Commits](#2-histórico-de-commits)
3. [Arquitetura do Projeto](#3-arquitetura-do-projeto)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Fluxo de Desenvolvimento Seguido](#5-fluxo-de-desenvolvimento-seguido)
6. [Decisões Técnicas](#6-decisões-técnicas)
7. [Problemas Encontrados e Soluções](#7-problemas-encontrados-e-soluções)
8. [Próximos Passos Planejados](#8-próximos-passos-planejados)
9. [Como Rodar o Projeto](#9-como-rodar-o-projeto)

---

## 1. Visão Geral

**AnimaListy** é uma aplicação full-stack de catálogo de animes que consome a [Jikan API v4](https://docs.api.jikan.moe/) (versão não-oficial da API do MyAnimeList). O projeto foi construído seguindo um plano de 7 fases, cada uma focada em um aspecto específico da aplicação.

### Stack Tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Backend | Spring Boot | 3.3.5 |
| | Java | 17 (Microsoft JDK) |
| | Maven | 3.9.14 |
| | Banco | MySQL 8.0 (produção/dev) / H2 (dev/test) |
| | Cache | Caffeine |
| | JWT | jjwt 0.12.6 |
| | API externa | Jikan v4 (WebClient reativo) |
| Frontend | React | 19.x |
| | Vite | 8.x |
| | Tailwind CSS | 4.x |
| | React Router | 7.x |
| | Axios | 1.x |
| | TanStack Query | 5.x |

---

## 2. Histórico de Commits

O repositório foi organizado em **9 commits** seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/), cada um representando uma mudança atômica e coesa:

```
f220a1d chore: add Vite project config files
c65d5db feat(frontend): add all page views
f8a51c7 feat(frontend): add API services, auth context and UI components
7d7e95c feat(frontend): scaffold React + Vite + Tailwind project
67798a6 feat(backend): implement JWT authentication
d99bac3 feat(backend): implement Jikan API integration with caching
be5e892 feat(backend): add JPA entities, repositories and DTOs
73c09be feat(backend): scaffold Spring Boot 3.3.5 project
0c6a0d5 chore: add .gitignore with Java, Node, IDE rules
```

### Linha de Raciocínio dos Commits

1. **Primeiro**: `.gitignore` — nunca commitar lixo (IDE, build, node_modules)
2. **Backend primeiro**: infraestrutura → dados → integração externa → segurança
3. **Frontend depois**: scaffold → serviços/componentes → páginas
4. **Cada commit é funcional**:理论上 cada commit poderia ser deployado (embora alguns só façam sentido em conjunto)

---

## 3. Arquitetura do Projeto

### Backend (Spring Boot)

```
┌─────────────────────────────────────────────────┐
│                 SecurityConfig                    │
│  ┌──────────┐  ┌──────────────────┐              │
│  │  JWT     │  │ JwtAuthFilter    │              │
│  │  Service │  │ (OncePerRequest) │              │
│  └──────────┘  └──────────────────┘              │
├─────────────────────────────────────────────────┤
│                Controllers                        │
│  ┌────────────┐ ┌──────────────┐ ┌─────────────┐│
│  │   Auth     │ │   Anime      │ │ Engagement  ││
│  │ Controller │ │  Controller  │ │ Controller  ││
│  └────────────┘ └──────────────┘ └─────────────┘│
│  ┌────────────┐ ┌──────────────┐                 │
│  │   User     │ │   Health     │                 │
│  │ Controller │ │  Controller  │                 │
│  └────────────┘ └──────────────┘                 │
├─────────────────────────────────────────────────┤
│                Services                           │
│  ┌──────────────┐ ┌─────────────────┐           │
│  │ JikanService │ │ EngagementService│           │
│  │ (WebClient)  │ │ (rating, fav,   │           │
│  │ + Cacheable  │ │  comment, list) │           │
│  └──────────────┘ └─────────────────┘           │
├─────────────────────────────────────────────────┤
│              JPA / Database                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Entities │ │  Repos   │ │      DTOs        │ │
│  │ (5)      │ │  (5)     │ │  (6)             │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Frontend (React)

```
┌─────────────────────────────────────────────────┐
│                    main.jsx                       │
│  BrowserRouter → QueryClient → AuthProvider      │
│  → ToastProvider → App → BackToTop               │
├─────────────────────────────────────────────────┤
│              Layout + Navbar + Footer             │
├─────────────────────────────────────────────────┤
│          Routes (React.lazy + Suspense)           │
│                                                   │
│  /          → HomePage (público)                  │
│  /catalog   → CatalogPage (público)               │
│  /anime/:id → AnimeDetailPage (público)           │
│  /login     → LoginPage (público)                 │
│  /register  → RegisterPage (público)              │
│  /profile   → ProfilePage (privada)               │
│  *          → NotFoundPage (público)              │
├─────────────────────────────────────────────────┤
│              Context + Services                    │
│  AuthContext (login/register/logout)              │
│  ToastContext (notificações)                      │
│  api.js (axios + JWT interceptor)                 │
│  authService / animeService                       │
└─────────────────────────────────────────────────┘
```

---

## 4. Estrutura de Pastas

```
AnimaListy/
├── .gitignore
├── CONTEXT.md                          ← este arquivo
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/animalisty/
│       ├── AnimaListyApplication.java
│       ├── config/
│       │   ├── CacheConfig.java
│       │   ├── CorsConfig.java
│       │   ├── GlobalExceptionHandler.java
│       │   ├── OpenApiConfig.java
│       │   └── WebClientConfig.java
│       ├── controller/
│       │   ├── AnimeController.java
│       │   ├── AuthController.java
│       │   ├── EngagementController.java
│       │   ├── HealthController.java
│       │   └── UserController.java
│       ├── dto/
│       │   ├── AuthResponse.java
│       │   ├── CommentRequest.java
│       │   ├── LoginRequest.java
│       │   ├── RatingRequest.java
│       │   ├── RegisterRequest.java
│       │   └── UserListRequest.java
│       ├── entity/
│       │   ├── Comment.java
│       │   ├── Favorite.java
│       │   ├── Rating.java
│       │   ├── User.java
│       │   └── UserAnimeList.java
│       ├── repository/
│       │   ├── CommentRepository.java
│       │   ├── FavoriteRepository.java
│       │   ├── RatingRepository.java
│       │   ├── UserAnimeListRepository.java
│       │   └── UserRepository.java
│       ├── security/
│       │   ├── JwtAuthenticationFilter.java
│       │   ├── JwtService.java
│       │   ├── SecurityConfig.java
│       │   ├── SecurityUtil.java
│       │   └── UserDetailsServiceImpl.java
│       └── service/
│           ├── EngagementService.java
│           └── JikanService.java
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── AnimeCard.jsx
│       │   ├── BackToTop.jsx
│       │   ├── Badge.jsx
│       │   ├── Button.jsx
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── PrivateRoute.jsx
│       │   ├── SkeletonCard.jsx
│       │   └── Spinner.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       ├── pages/
│       │   ├── AnimeDetailPage.jsx
│       │   ├── CatalogPage.jsx
│       │   ├── HomePage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── NotFoundPage.jsx
│       │   ├── ProfilePage.jsx
│       │   └── RegisterPage.jsx
│       └── services/
│           ├── animeService.js
│           ├── api.js
│           └── authService.js
```

---

## 5. Fluxo de Desenvolvimento Seguido

### Fase 1 — Infraestrutura (Setup)

**O que foi feito:**
- Projeto Spring Boot criado manualmente (sem Initializr) com Maven
- Projeto React scaffoldado com `npm create vite@latest`
- Configuração de dependências: JPA, Security, JWT, WebClient, Caffeine, MySQL/H2
- Criação de 5 entidades JPA com relacionamentos
- Criação de 5 repositórios com queries customizadas
- Criação de DTOs básicos (RegisterRequest, LoginRequest, AuthResponse)
- Configuração de CORS, Swagger, Cache

**Por quê:**
- Infraestrutura primeiro para validar que tudo compila e se conecta antes de escrever lógica de negócio
- Entities + Repos primeiro porque são a base de tudo
- MySQL como default, H2 como fallback para dev

### Fase 2 — Autenticação JWT

**O que foi feito:**
- `JwtService`: geração e validação de tokens HMAC-SHA256
- `JwtAuthenticationFilter`: filtro OncePerRequest que extrai o Bearer token e valida
- `UserDetailsServiceImpl`: carrega usuário do banco para o Spring Security
- `AuthController`: endpoints de register e login
- `SecurityConfig`: cadeia de filtros com rotas públicas/protegidas
- `GlobalExceptionHandler`: tratamento de erros de validação, credenciais, etc.

**Decisões:**
- Token armazenado no `localStorage` (simplicidade, mas com ciência dos trade-offs de segurança)
- Senha com `BCryptPasswordEncoder`
- Profile `dev` com H2 para desenvolvimento sem MySQL

### Fase 3 — Integração Jikan API

**O que foi feito:**
- `WebClient` configurado com timeouts e User-Agent
- `JikanService`: métodos para season, top, search, byId
- `AnimeController`: proxy reativo para a Jikan API
- Cache Caffeine de 5 minutos para evitar rate limiting
- `@Cacheable` com async mode habilitado (necessário para `Mono`)

**Problemas encontrados:**
- Cache Caffeine padrão não suporta tipos reativos (`Mono`) → `setAsyncCacheMode(true)`
- Jikan API faz rate limiting → cache + User-Agent + timeouts

### Fase 4 — Engajamento (Ratings, Favoritos, Comentários)

**O que foi feito:**
- `EngagementService`: upsert de rating, toggle de favorito, CRUD de comentário com verificação de ownership
- `EngagementController`: todos os endpoints
- `SecurityUtil`: helper para extrair usuário logado do SecurityContext

**Decisões:**
- Rating usa upsert (1 usuário, 1 nota por anime)
- Favorito usa toggle (se existe, remove; se não, adiciona)
- Comentário só pode ser editado/excluído pelo próprio autor
- GET rating funciona para anônimos (retorna só a média)

### Fase 5 — My List e Perfil

**O que foi feito:**
- `UserController`: perfil com estatísticas, CRUD da lista pessoal
- `UserAnimeList`: entidade com enum Status (WATCHING, COMPLETED, PLAN_TO_WATCH, DROPPED)

### Fase 6 — UI/UX e Polish

**O que foi feito:**
- `ToastContext`: sistema de notificações (success, error, info, warning)
- `SkeletonCard`: loading esqueleto com shimmer
- `Button`/`Badge`: componentes reutilizáveis com variantes
- `BackToTop`: botão flutuante "voltar ao topo"
- `NotFoundPage`: página 404 personalizada
- Code splitting com `React.lazy` + `Suspense`
- Animações CSS: slide-up, fade-in, scale-in

---

## 6. Decisões Técnicas

### Por que WebClient (reativo) em vez de RestTemplate?

A Jikan API é um serviço externo com latência imprevisível. O WebClient do Spring WebFlux permite:
- Chamadas não-bloqueantes (não trava threads do Tomcat)
- Melhor escalabilidade para operações I/O-bound
- Tratamento de erros reativo com `onErrorResume`
- Integração nativa com o cache do Spring

### Por que Caffeine em vez de Redis?

Para um projeto monólito em desenvolvimento, Caffeine é:
- Zero infraestrutura externa (embutido na JVM)
- Configuração trivial (5 linhas)
- Performance excelente para cache local
- Pode ser substituído por Redis em produção se necessário

### Por que JWT em vez de Session?

- Stateless: não precisa de sessão no servidor
- Escalável horizontalmente sem shared session store
- O frontend React pode armazenar o token e enviar em toda requisição
- O plano original já especificava JWT

### Por que `@ManyToOne` LAZY nas entities?

- Evita carregar objetos inteiros do banco quando não necessários
- Previne N+1 queries (embora precise de `@EntityGraph` ou `JOIN FETCH` quando precisar)
- Com `spring.jpa.open-in-view=true` (default), funciona sem LazyInitializationException

### Por que React.lazy + Suspense?

- Reduz o bundle inicial dividindo em chunks por página
- Cada página só carrega quando navegada
- Melhora o Lighthouse/performance score

---

## 7. Problemas Encontrados e Soluções

### 1. ECONNREFUSED — Backend não rodando
- **Sintoma:** Vite proxy não conseguia conectar em localhost:8080
- **Causa:** Backend Spring Boot não estava rodando
- **Solução:** Iniciar o backend com `mvn spring-boot:run -Dspring.profiles.active=dev`

### 2. H2 não disponível em runtime
- **Sintoma:** "Unable to determine Dialect without JDBC metadata"
- **Causa:** H2 com escopo `test` no pom.xml → não disponível ao rodar aplicação
- **Solução:** Mudar para `<scope>runtime</scope>`

### 3. Profile dev não ativava via nohup
- **Sintoma:** Backend tentava conectar no MySQL mesmo com `-Dspring.profiles.active=dev`
- **Causa:** O argumento não passava corretamente via nohup
- **Solução:** Adicionar `spring.profiles.active=dev` no `application.properties` como fallback

### 4. Caffeine não suportava Mono
- **Sintoma:** "No Caffeine AsyncCache available"
- **Causa:** `@Cacheable` em métodos que retornam `Mono<>` precisam de async cache
- **Solução:** `cacheManager.setAsyncCacheMode(true)`

### 5. Jikan API timeout na busca
- **Sintoma:** Busca retornava 204 No Content
- **Causa:** Jikan API search endpoint lento/indisponível
- **Solução:** Aumentar timeout para 30s + tratamento de erro retornando mensagem amigável

### 6. Cache guardava respostas de erro
- **Sintoma:** Erro da Jikan API ficava cacheado por 5 minutos
- **Causa:** `@Cacheable(unless = "#result == null")` não filtrava respostas de erro (não-nulas)
- **Solução:** `@Cacheable(unless = "#result == null || #result.get('error') != null")`

### 7. Frontend sem feedback visual
- **Sintoma:** Ações do usuário (rating, favoritar, comentar) sem confirmação
- **Causa:** `catch {}` blocks silenciosos
- **Solução:** Toast notifications com `ToastContext`

### 8. Busca mostrava "Nenhum anime encontrado" mesmo com API fora
- **Sintoma:** Mensagem enganosa quando Jikan API estava timeout
- **Causa:** `handleError` retornava `Mono.empty()` → 204 → frontend interpretava como "sem resultados"
- **Solução:** `handleError` retorna 200 com `{ data: [], error: true, message: "..." }`

---

## 8. Próximos Passos Planejados

### Imediatos (não implementados)

#### ErrorBoundary para React.lazy
- Atualmente, se um chunk do code splitting falhar ao carregar (ex: rede instável), a aplicação quebra
- Criar um componente `ErrorBoundary` que mostra uma mensagem amigável e botão de retry
- Envolver o `<Suspense>` no `App.jsx` com o ErrorBoundary

#### Upload de avatar
- Adicionar campo `avatarUrl` na entidade User
- Endpoint para upload de imagem
- Exibir avatar no Navbar e ProfilePage

#### Melhorias na ProfilePage
- Quando o backend retorna dados da lista, o frontend usa `UserAnimeList` diretamente
- Seria melhor ter um DTO específico com dados do anime (título, imagem) vindos da Jikan API
- Atualmente a ProfilePage tenta renderizar `AnimeCard` com dados de `UserAnimeList`, que não tem poster/título/gêneros
- **Solução:** Fazer o backend buscar dados da Jikan API para cada anime na lista do usuário, ou o frontend buscar incrementalmente

### Futuros (Fase 7+)

#### Deploy (Fase 7)
- **Backend:** Railway (auto-deploy do GitHub, MySQL gerenciado)
- **Frontend:** Vercel (auto-deploy do GitHub, variáveis de ambiente)
- **CI/CD:** GitHub Actions para testes antes do merge

#### Testes
- Backend: testes unitários com JUnit + Mockito para Services
- Backend: testes de integração com WebMvcTest para Controllers
- Frontend: testes com Vitest + Testing Library

#### Funcionalidades extras
- Modo escuro customizável (trocar entre os temas)
- Recomendações baseadas em histórico
- Compartilhar lista em redes sociais
- PWA (instalável como app)
- Modo offline com cache do service worker

#### Performance
- Adicionar compression no backend (Gzip/Brotli)
- Configurar HTTP/2
- Image optimization com lazy loading + WebP
- Server-Side Rendering (SSR) com frameworks como Next.js

---

## 9. Como Rodar o Projeto

### Pré-requisitos

- Java 17+ (JDK disponível em `C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot`)
- Maven 3.9+
- Node.js 20+
- MySQL 8.0 (opcional — H2 funciona sem instalação)

### Backend

```bash
cd backend

# Com MySQL (padrão)
set JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot
mvn spring-boot:run

# Com H2 (sem MySQL)
mvn spring-boot:run -Dspring.profiles.active=dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Acessar

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html
- H2 Console (dev): http://localhost:8080/h2-console

---

*Documento gerado automaticamente para contexto do projeto AnimaListy.*
