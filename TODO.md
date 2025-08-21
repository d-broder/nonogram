# PLANO ESTRATÉGICO DETALHADO - REFATORAÇÃO MULTIPLAYER

## REQUISITOS ORIGINAIS

Alteração da inicialização de multiplayer:

- Tela inicial será a página de puzzles - não terá mais a página "HomePage" (que é a seleção de Single Player ou Multiplayer)
- Não terá mais a "CreateRoomPage"
- Na "sidebar" e na "topBarExpanded" nas páginas "GamePage" e "PuzzleSelectionPage", por padrão, sempre será exibida a div "roomInfo". Porém por padrão, ao invés da estrutura atual (que contém as informações de título da sala, link, jogadores, etc.), por padrão ela conterá um botão "Create New Room". Ao clicar neste botão, será aberto um modal que será exibido o conteúdo igual ao do "CreateRoomPage" (mas em forma de modal)
- Após escolher um "Display Name", escolher uma cor e apertar em "Create Room":
  - uma nova sala será criada e será iniciado o modo multiplayer (isMultiplayer = True)
  - o botão de "Create New Room" - na "sidebar" e na "topBarExpanded" - será substituída pelas informações que da sala(informações de título, link, jogadores, etc. - a estrutura atual de "roomInfo") - que já aparece no multiplayer
  - Importante: Quando estamos na página "GamePage" e iniciamos o modo Multiplayer (criar uma nova sala), as informações do jogo atual devem ser subidas para o Firebase, mantendo o estado do jogo do single player para o multiplayer.

---

## PLANO DE EXECUÇÃO ESTRATÉGICO

### FASE 1: CRIAÇÃO DO MODAL E COMPONENTES BASE

**Objetivo**: Criar infraestrutura para o novo fluxo de criação de sala

#### 1.1 Criar CreateRoomModal

- **Arquivo**: `src/components/CreateRoomModal/CreateRoomModal.tsx`
- **Ação**: Reutilizar toda a lógica do `CreateRoomPage.tsx` em formato modal
- **Componentes necessários**:
  - Input para Display Name
  - Grid de seleção de cores
  - Botões Create Room e Cancel
  - Estados de loading e error
- **Base**: Usar estrutura similar ao `ConfirmationModal` existente
- **Funcionalidades**:
  - Callback para criação de sala bem-sucedida
  - Callback para cancelamento
  - Validação de nome e cor
  - Integração com `useFirebaseRoom`

#### 1.2 Criar RoomInfoDefault Component

- **Arquivo**: `src/components/RoomInfoDefault/RoomInfoDefault.tsx`
- **Ação**: Componente que exibe botão "Create New Room" quando não há sala ativa
- **Props**: `onCreateRoom: () => void`
- **Design**: Botão destacado e intuitivo para iniciar multiplayer

### FASE 2: REFATORAÇÃO DO PAGELAYOUT

**Objetivo**: Modificar PageLayout para sempre exibir área de room info

#### 2.1 Modificar PageLayout.tsx

- **Ação**: Alterar lógica condicional da área `roomInfo`
- **Lógica antiga**: `{isMultiplayer && roomId && (...)}`
- **Lógica nova**: Sempre exibir área, mas alternar conteúdo:
  - Se `!isMultiplayer`: Exibir `RoomInfoDefault`
  - Se `isMultiplayer && roomId`: Exibir informações da sala atual
- **Implementação**:
  ```tsx
  // Sempre exibir roomInfo area
  <div className={styles.roomInfo}>
    {!isMultiplayer ? (
      <RoomInfoDefault onCreateRoom={handleOpenCreateModal} />
    ) : (
      // Conteúdo atual de room info multiplayer
    )}
  </div>
  ```

#### 2.2 Adicionar Estados do Modal no PageLayout

- **Estados necessários**:
  - `showCreateRoomModal: boolean`
  - `isTransitioningToMultiplayer: boolean` (para loading states)
- **Callbacks**:
  - `handleOpenCreateModal`
  - `handleCloseCreateModal`
  - `handleRoomCreated`

### FASE 3: MODIFICAÇÃO DAS ROTAS E APP.TSX

**Objetivo**: Simplificar roteamento removendo HomePage e CreateRoomPage

#### 3.1 Atualizar App.tsx

- **Ação**: Modificar rota raiz de `<HomePage />` para `<PuzzleSelectionPage />`
- **Remover rotas**:
  - `path="/multiplayer/create"`
- **Manter rotas existentes**:
  - Todas as rotas de puzzle selection e game continuam iguais
  - Rotas de multiplayer com roomId continuam funcionando

#### 3.2 Cleanup de Arquivos

- **Deletar**: `src/pages/HomePage/` (pasta completa)
- **Deletar**: `src/pages/CreateRoomPage/` (pasta completa)
- **Atualizar imports**: Remover imports desses componentes em `App.tsx`

### FASE 4: IMPLEMENTAÇÃO DA MIGRAÇÃO SINGLE→MULTIPLAYER

**Objetivo**: Permitir que usuário inicie multiplayer durante um jogo single player

#### 4.1 Adicionar Hook de Migração de Estado

- **Arquivo**: `src/hooks/useGameStateMigration.ts`
- **Função**: `migrateToMultiplayer(currentGameState, roomId, puzzle)`
- **Responsabilidades**:
  - Extrair estado atual do jogo (grid, clues clicadas, etc.)
  - Fazer upload para Firebase na nova sala
  - Retornar dados para navegação

#### 4.2 Modificar GamePage para Suportar Migração

- **Ação**: Integrar lógica de migração quando sala é criada durante jogo
- **Fluxo**:
  1. User clica "Create New Room" durante jogo single player
  2. Modal abre, user preenche dados
  3. Sala é criada no Firebase
  4. Estado atual do jogo é migrado para Firebase
  5. Página navega para rota multiplayer com mesmo puzzle
  6. Estado sincronizado é carregado do Firebase

#### 4.3 Atualizar useFirebaseRoom

- **Ação**: Adicionar método `migrateGameState`
- **Funcionalidade**: Receber estado de jogo e fazer upload inicial para sala
- **Parâmetros**:
  - `roomId: string`
  - `gameState: GameState`
  - `puzzle: Puzzle`
  - `clueStates: { clickedRowClues, clickedColClues }`

### FASE 5: ATUALIZAÇÃO DE NAVEGAÇÃO E UX

**Objetivo**: Garantir fluxo suave e intuitivo

#### 5.1 Gerenciamento de Estado Global

- **Considerar**: Context ou estado persistente para transições
- **Dados a preservar durante migração**:
  - Estado do grid atual
  - Clues clicadas
  - Modo de paint
  - Zoom level
  - Configurações de UI (stickyClues, showPlayerIndicators)

#### 5.2 Loading States e Feedback

- **Durante criação de sala**: Mostrar loading no modal
- **Durante migração**: Mostrar feedback de "Migrating to multiplayer..."
- **Erro handling**: Fallback para single player se migração falhar

#### 5.3 Atualizar PuzzleSelectionPage

- **Ação**: Garantir que também tenha área roomInfo com botão Create New Room
- **Fluxo**: User pode criar sala antes mesmo de escolher puzzle

### FASE 6: TESTES E REFINAMENTOS

**Objetivo**: Validar fluxos e experiência do usuário

#### 6.1 Cenários de Teste

1. **Usuário novo**: Entra no site → vê puzzles → clica Create New Room → cria sala → escolhe puzzle
2. **Durante jogo**: Jogando single player → Create New Room → migra estado → continua em multiplayer
3. **Navegação**: Back/forward buttons funcionam corretamente
4. **Mobile**: Interface responsiva em todos os pontos

#### 6.2 Edge Cases

- **Firebase offline**: Fallback graceful para single player
- **Navegação durante loading**: Prevent navegação durante migração
- **Estado inconsistente**: Recovery strategies

---

## ORDEM DE IMPLEMENTAÇÃO RECOMENDADA

1. **CreateRoomModal** + **RoomInfoDefault** (componentes isolados)
2. **PageLayout refactoring** (integrar novos componentes)
3. **App.tsx route changes** (simplicar roteamento)
4. **Game state migration logic** (hooks e utilities)
5. **Integration testing** (testar fluxos completos)
6. **Cleanup e polish** (remover código antigo, otimizar UX)

---

## ARQUIVOS PRINCIPAIS A MODIFICAR

### Novos Arquivos

- `src/components/CreateRoomModal/` (novo)
- `src/components/RoomInfoDefault/` (novo)
- `src/hooks/useGameStateMigration.ts` (novo)

### Arquivos a Modificar

- `src/App.tsx` (rotas)
- `src/components/PageLayout/PageLayout.tsx` (lógica roomInfo)
- `src/pages/GamePage/GamePage.tsx` (integração migração)
- `src/pages/PuzzleSelectionPage/PuzzleSelectionPage.tsx` (área roomInfo)
- `src/hooks/useFirebaseRoom.ts` (método migração)

### Arquivos a Deletar

- `src/pages/HomePage/` (pasta completa)
- `src/pages/CreateRoomPage/` (pasta completa)

---

## CONSIDERAÇÕES TÉCNICAS

### Estado e Performance

- **Minimizar re-renders**: Usar useCallback para handlers do modal
- **Lazy loading**: Modal só renderiza quando necessário
- **Memory cleanup**: Limpar listeners Firebase durante migração

### Compatibilidade

- **Backward compatibility**: Links de sala existentes continuam funcionando
- **URL structure**: Manter estrutura de URLs multiplayer existente
- **SessionStorage**: Preservar formato atual de playerInfo

### Experiência do Usuário

- **Visual feedback**: Loading states claros durante transições
- **Error recovery**: Mensagens de erro compreensíveis
- **Mobile first**: Garantir usabilidade em dispositivos móveis
