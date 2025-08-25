# 🏗️ REFATORAÇÃO COMPLETA DO PROJETO - Tracking System

## 📊 **STATUS GERAL DA REFATORAÇÃO**

```
PROGRESS: [██░░░░░░░░] 20% (Preparação concluída)
ESTIMATIVA: 10-13 horas totais
BRANCH: refactor/feature-architecture
FASE ATUAL: Preparação → Centralização de Constantes
```

---

## 📋 **INVENTÁRIO COMPLETO - ESTADO ATUAL vs TARGET**

### 📁 **Estrutura Atual (Para Migração)**

#### **🏠 Root & Config (Manter)**

```
├── src/main.tsx ✅
├── src/App.tsx (51 linhas) ✅
├── src/index.css ✅
├── src/App.css ✅
├── src/firebase.ts → shared/services/ 📦
├── src/vite-env.d.ts → shared/types/ 📦
├── package.json ✅
├── vite.config.ts ✅
├── tsconfig*.json ✅
└── vercel.json ✅
```

#### **📄 Pages/Routers (6 arquivos) - RENOMEAR/MOVER**

```
src/pages/
├── UnifiedPage.tsx (15 linhas) → SinglePlayerRouter.tsx 🔄
├── MultiplayerRoomHandler.tsx (135 linhas) → MultiplayerRouter.tsx 🔄
├── GamePage.tsx (471 linhas) → views/GameView/ 📦 [REFATORAR]
├── PuzzleSelectionPage.tsx (190 linhas) → views/PuzzleSelectionView/ 📦
├── JoinRoomPage.tsx (265 linhas) → views/JoinRoomView/ 📦 [EXTRAIR FORM]
└── WaitingRoomPage.tsx (77 linhas) → views/WaitingRoomView/ 📦
```

#### **🧩 Components (12 arquivos) - REORGANIZAR POR FEATURE**

```
src/components/
├── PageLayout.tsx (731 linhas) 🔥 [URGENTE: DIVIDIR EM 8]
├── GameBoard.tsx (495 linhas) → features/puzzle/components/ 📦
├── CreateRoomModal.tsx (166 linhas) → features/multiplayer/ 📦 [REFATORAR]
├── GameControls.tsx (57 linhas) → features/puzzle/components/ 📦
├── GameControlsPanel.tsx (143 linhas) → features/puzzle/components/ 📦
├── GameControlButton.tsx (73 linhas) → shared/components/ui/ 📦
├── ButtonGroup.tsx (29 linhas) → shared/components/ui/ 📦
├── ClueToggleButton.tsx → shared/components/ui/Toggle/ 📦
├── PlayerIndicatorToggleButton.tsx → shared/components/ui/Toggle/ 📦
├── ConfirmationModal.tsx (55 linhas) → shared/components/ui/Modal/ 📦
├── CopyTooltip.tsx (24 linhas) → shared/components/ui/Tooltip/ 📦
└── RoomInfoDefault.tsx (15 linhas) → features/multiplayer/ 📦
```

#### **🔧 Hooks (6 arquivos) - MOVER POR FEATURE**

```
src/hooks/
├── useGameState.ts (267 linhas) → features/puzzle/hooks/ 📦
├── usePuzzleLoader.ts → features/puzzle/hooks/ 📦
├── useZoom.ts → features/puzzle/hooks/ 📦
├── useFirebaseRoom.ts (254 linhas) → features/multiplayer/hooks/ 📦
├── useRoomCleanup.ts → features/multiplayer/hooks/ 📦
└── useGameStateMigration.ts → features/multiplayer/hooks/ 📦
```

#### **🔧 Utils & Types (4 arquivos) - CENTRALIZAR**

```
src/
├── types/index.ts → shared/types/ 📦
├── utils/gridUtils.ts → shared/utils/ 📦
├── utils/puzzleUtils.ts → shared/utils/ 📦
└── contexts/AppNavigationContext.tsx → shared/contexts/ 📦
```

#### **🎮 Assets & Puzzles (Manter)**

```
public/
├── puzzles/classic/ (3 puzzles) ✅
├── puzzles/super/ (3 puzzles) ✅
└── assets/ ✅
```

---

### 🎯 **Estrutura Target (Nova Organização)**

```
src/
├── app/                          # 📁 Application Core
│   ├── App.tsx
│   ├── App.css
│   └── router.tsx               # 🆕 Centralized routing
├── shared/                      # 📁 Shared Resources
│   ├── components/
│   │   ├── layout/
│   │   │   ├── PageLayout/      # 🔥 REFATORADO (8 componentes)
│   │   │   │   ├── PageLayout.tsx (~120 linhas)
│   │   │   │   ├── Sidebar/
│   │   │   │   ├── MobileTopBar/
│   │   │   │   ├── MobileBottomBar/
│   │   │   │   └── RoomInfo/
│   │   │   └── GameBoard/       # Movido de components/
│   │   └── ui/
│   │       ├── Button/
│   │       │   ├── ButtonGroup/
│   │       │   └── GameControlButton/
│   │       ├── Modal/
│   │       │   └── ConfirmationModal/
│   │       ├── Toggle/
│   │       │   ├── ClueToggleButton/
│   │       │   └── PlayerIndicatorToggleButton/
│   │       └── Tooltip/
│   │           └── CopyTooltip/
│   ├── hooks/                   # 🆕 General utility hooks
│   ├── utils/                   # Movido de src/utils/
│   ├── types/                   # Movido de src/types/
│   ├── contexts/                # Movido de src/contexts/
│   ├── services/                # 🆕 firebase.ts aqui
│   └── constants/               # 🆕 Cores, configs centralizadas
├── features/                    # 📁 Domain-Based Features
│   ├── puzzle/
│   │   ├── components/
│   │   │   ├── PuzzleControls/  # GameControls + GameControlsPanel
│   │   │   └── PuzzleSelection/
│   │   ├── hooks/               # useGameState, usePuzzleLoader, useZoom
│   │   └── types/
│   ├── multiplayer/
│   │   ├── components/
│   │   │   ├── CreateRoomForm/  # 🔥 UNIFICADO (3 → 1 componente)
│   │   │   ├── RoomInfo/        # RoomInfoDefault movido
│   │   │   └── WaitingRoom/
│   │   ├── hooks/               # useFirebaseRoom, useRoomCleanup, etc
│   │   └── services/
│   └── game/                    # 🆕 Game-specific logic
├── pages/                       # 📁 Route Handlers Only
│   ├── SinglePlayerRouter.tsx   # UnifiedPage renomeado
│   └── MultiplayerRouter.tsx    # MultiplayerRoomHandler renomeado
└── views/                       # 📁 Page Views
    ├── GameView/                # GamePage refatorado
    ├── PuzzleSelectionView/     # PuzzleSelectionPage movido
    ├── JoinRoomView/            # JoinRoomPage movido + form extraído
    └── WaitingRoomView/         # WaitingRoomPage movido
```

---

## 🔥 **PROBLEMAS CRÍTICOS IDENTIFICADOS**

### **1. PageLayout.tsx - 731 linhas (URGENTE)**

```tsx
// LOCALIZAÇÃO ATUAL: src/components/PageLayout/PageLayout.tsx
// PROBLEMAS:
❌ 731 linhas (era 799, mas ainda muito grande)
❌ MobileCreateRoomForm interno (linhas ~40-85)
❌ MobileClearGridForm interno (linhas ~147-181)
❌ Cores duplicadas (COLOR_VALUES, AVAILABLE_COLORS)
❌ Props interface complexa (30+ propriedades)
❌ Responsabilidades misturadas

// SOLUÇÃO: Dividir em 8 componentes separados
✅ PageLayout.tsx principal (~120 linhas)
✅ Sidebar/ (desktop)
✅ MobileTopBar/ + MobileBottomBar/ (mobile)
✅ RoomInfo/ (multiplayer)
✅ Formulários extraídos para features/multiplayer/
```

### **2. Formulários Duplicados (3 locais)**

```tsx
// PROBLEMA: Lógica duplicada em:
❌ CreateRoomModal.tsx (166 linhas) - Modal desktop
❌ MobileCreateRoomForm em PageLayout.tsx (~45 linhas) - Mobile inline
❌ JoinRoomPage.tsx (265 linhas) - Formulário similar

// SOLUÇÃO: Componente base unificado
✅ features/multiplayer/components/CreateRoomForm/
  ├── RoomForm.tsx (base reutilizável)
  ├── CreateRoomModal.tsx (wrapper modal)
  ├── CreateRoomInline.tsx (wrapper inline)
  └── useRoomForm.ts (hook compartilhado)
```

### **3. Constantes Duplicadas**

```tsx
// PROBLEMA: Cores em 4+ locais diferentes
❌ PageLayout.tsx → COLOR_VALUES, AVAILABLE_COLORS
❌ CreateRoomModal.tsx → Cores duplicadas
❌ JoinRoomPage.tsx → Lógica de cor similar

// SOLUÇÃO: Centralização
✅ shared/constants/
  ├── colors.ts (COLOR_VALUES, AVAILABLE_COLORS, PlayerColor)
  ├── playerConfig.ts
  └── validation.ts
```

---

## 📅 **CRONOGRAMA DE EXECUÇÃO - 6 FASES**

### **Fase 1: Preparação e Setup (1-2h) ⚪ TODO**

- [ ] 🔄 Criar nova estrutura de pastas
- [ ] 🔄 Centralizar constantes (cores, validações)
- [ ] 🔄 Mover utils, types, services para shared/
- [ ] 🔄 Configurar barrel exports básicos

### **Fase 2: PageLayout Refactoring (3-4h) ⚪ TODO**

- [ ] 🔥 Extrair MobileCreateRoomForm → features/multiplayer/
- [ ] 🔥 Extrair MobileClearGridForm → shared/components/
- [ ] 🔥 Dividir PageLayout em componentes menores
- [ ] 🔥 Simplificar props interface
- [ ] 🔄 Aplicar container-controlled spacing

### **Fase 3: Form Unification (2-3h) ⚪ TODO**

- [ ] 🔄 Criar RoomForm base component
- [ ] 🔄 Refatorar CreateRoomModal usando base
- [ ] 🔄 Refatorar JoinRoomPage form usando base
- [ ] 🔄 Criar useRoomForm hook compartilhado

### **Fase 4: Feature Organization (2h) ⚪ TODO**

- [ ] 🔄 Mover hooks para features apropriadas
- [ ] 🔄 Mover components para features
- [ ] 🔄 Reorganizar GameControls → PuzzleControls
- [ ] 🔄 Configurar barrel exports por feature

### **Fase 5: Pages/Views Migration (1h) ⚪ TODO**

- [ ] 🔄 Renomear UnifiedPage → SinglePlayerRouter
- [ ] 🔄 Renomear MultiplayerRoomHandler → MultiplayerRouter
- [ ] 🔄 Mover pages para views/
- [ ] 🔄 Atualizar imports e rotas

### **Fase 6: Validation & Cleanup (1h) ⚪ TODO**

- [ ] 🔄 Testar funcionamento completo
- [ ] 🔄 Verificar imports circulares
- [ ] 🔄 Remover arquivos antigos
- [ ] 🔄 Documentar mudanças

**⏱️ Total: 10-13 horas estimadas**

---

## 📊 **TRACKING DE PROGRESSO**

### **Legenda de Status:**

- ✅ **Concluído**
- 🔄 **Em andamento**
- ⚪ **Pendente**
- 🔥 **Urgente/Crítico**
- 📦 **Para mover**

### **Métricas de Sucesso:**

- **Redução de linhas**: PageLayout 731 → ~120 (-83%)
- **Eliminação de duplicação**: 3 formulários → 1 base
- **Organização**: 40+ arquivos → estrutura por features
- **Manutenibilidade**: Responsabilidades bem definidas

### **Riscos Identificados:**

- ⚠️ **Imports circulares** durante reorganização
- ⚠️ **Quebra de funcionalidade** durante PageLayout split
- ⚠️ **Conflitos de merge** se trabalhar em paralelo

---

## 🎯 **PRÓXIMOS PASSOS IMEDIATOS**

1. **Criar branch**: `refactor/feature-architecture`
2. **Fase 1**: Centralizar constantes (começar pequeno)
3. **Teste**: Validar que tudo funciona após cada fase
4. **Commit frequente**: Cada sub-tarefa = 1 commit

### **Comandos para Iniciar:**

```bash
git checkout main
git pull origin main
git checkout -b refactor/feature-architecture
# Começar Fase 1: Centralização de constantes
```
