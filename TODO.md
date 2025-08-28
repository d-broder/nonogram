# TODO.md - CSS Architecture & Design System Improvements

## 🎯 **Project Status Overview**

Este documento lista todas as melhorias necessárias no sistema CSS do projeto Nonogram, seguindo a arquitetura de **container-controlled spacing** e **design tokens**.

---

## 🚨 **PRIORITY 1: Critical Design Token Issues**

### **A. Variáveis CSS Indefinidas (5 tokens)**

Essas variáveis estão sendo usadas mas não estão definidas no sistema de tokens:

```css
/* ❌ UNDEFINED VARIABLES */
--color-surface     /* Usado em: GameControls.module.css */
--color-background  /* Usado em: GameControls.module.css */
--gradient-primary  /* Usado em: MobileTopBarExpanded.module.css */
--z-sticky         /* Usado em: GameControls.module.css */
--text-shadow-light /* Usado em: MobileTopBarExpanded.module.css */
```

**Action Required**: Definir essas variáveis em `src/styles/tokens/`:

- Adicionar `--color-surface` e `--color-background` em `colors.css`
- Criar `gradients.css` para `--gradient-primary`
- Criar `z-index.css` para `--z-sticky`
- Adicionar `--text-shadow-light` em `typography.css`

### **B. Z-Index Hardcoded (6 arquivos)**

```css
/* ❌ FILES WITH HARDCODED Z-INDEX */
GamePage.module.css:7              → z-index: 1000;
ConfirmationModal.module.css:11     → z-index: 1000;
CreateRoomModal.module.css:12       → z-index: 1000;
CopyTooltip.module.css:15           → z-index: 1000;
PageLayout.module.css:301           → z-index: 1000;
PageLayout.module.css:311           → z-index: 999;
```

**Action Required**: Criar sistema de z-index em `src/styles/tokens/z-index.css`:

```css
:root {
  --z-base: 1;
  --z-sticky: 100;
  --z-dropdown: 500;
  --z-overlay: 1000;
  --z-modal: 1000;
  --z-tooltip: 1001;
}
```

---

## 🟡 **PRIORITY 2: Transform & Animation Hardcoding**

### **A. Transform translateY Hardcoded (11 arquivos)**

```css
/* ❌ FILES WITH HARDCODED TRANSLATEY */
1. ButtonGroup.module.css:19          → translateY(-2px)
2. ClueToggleButton.module.css:74     → translateY(-2px)
3. GameControlButton.module.css:121   → translateY(-2px)
4. GameControlButton.module.css:144   → translateY(0)
5. RoomForm.module.css:79             → translateY(-2px)
6. GamePage.module.css:111            → translateY(-2px)
7. JoinRoomPage.module.css:88         → translateY(-2px)
8. JoinRoomPage.module.css:116        → translateY(-2px)
9. JoinRoomPage.module.css:161        → translateY(-2px)
10. PuzzleSelectionPage.module.css:94 → translateY(-2px)
11. PuzzleSelectionPage.module.css:112 → translateY(-2px)
```

**Action Required**: Criar tokens para animações em `src/styles/tokens/animations.css`:

```css
:root {
  --transform-hover-lift: translateY(-2px);
  --transform-reset: translateY(0);
  --animation-duration-fast: 0.15s;
  --animation-duration-normal: 0.3s;
}
```

### **B. Color Hardcoding (1 arquivo)**

```css
/* ❌ HARDCODED COLOR */
PageLayout.module.css:506 → color: #fef2f2;
```

**Action Required**: Adicionar cor ao sistema de tokens ou usar variável existente.

---

## 🔵 **PRIORITY 3: Container-Controlled Spacing Violations**

### **A. Child Components with Self-Margins**

Alguns componentes ainda controlam suas próprias margens, violando o padrão container-controlled:

```css
/* ❌ ANTIPATTERN: Components controlling own margins */
- GameBoard: Alguns elementos filhos podem ter margens próprias
- RoomForm: Campos de formulário com espaçamento interno
- PageLayout: Elementos header/footer com margens próprias
```

**Action Required**: Converter para padrão de container gap:

```css
/* ✅ CORRECT PATTERN */
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
```

---

## 🟢 **PRIORITY 4: Mobile-First Responsive Improvements**

### **A. Non-Mobile-First Components (verificar)**

Alguns componentes podem ainda usar abordagem desktop-first:

- `GameBoard.module.css` - Verificar media queries
- `GameControls.module.css` - Verificar responsividade
- `PageLayout.module.css` - Verificar breakpoints

**Action Required**: Converter para mobile-first approach:

```css
/* ✅ Mobile-first pattern */
.component {
  /* Mobile styles (320px+) */
}

@media (min-width: var(--breakpoint-tablet)) {
  .component {
    /* Tablet+ enhancements */
  }
}
```

---

## ✅ **COMPLETED TASKS**

### **Fixed in Previous Sessions:**

- ✅ `MobileCreateRoomForm.module.css` - Design tokens implementados
- ✅ `MobileTopBarExpanded.module.css` - Hardcoded values removidos
- ✅ `GameControlsPanel.module.css` - Gap implementado, width tokenizado
- ✅ `PageLayout.module.css` - Font-family hardcoding removido
- ✅ `GameControlButton.module.css` - Transform values tokenizados
- ✅ `ConfirmationModal.module.css` - Max-width e backdrop-filter tokenizados
- ✅ `ButtonGroup.module.css` - Mobile-first responsive implementado
- ✅ Design token system criado em `src/styles/tokens/`

### **Completed in Current Session (Phase 1 & 2):**

- ✅ `colors.css` - Adicionadas variáveis `--color-surface` e `--color-background`
- ✅ `gradients.css` - Criado sistema de gradientes com `--gradient-primary`
- ✅ `z-index.css` - Criado sistema completo de z-index tokens
- ✅ `typography.css` - Adicionados tokens de text-shadow
- ✅ `animations.css` - Criado sistema completo de animation/transform tokens
- ✅ **6 arquivos** - Z-index hardcoded substituído por tokens
- ✅ **8 arquivos** - TranslateY hardcoded substituído por tokens
- ✅ **1 cor hardcoded** - Substituída por token existente

---

## 📊 **Progress Summary**

```
Total CSS Files: 33
Critical Issues: RESOLVED ✅
Medium Priority: RESOLVED ✅
Low Priority: ~8 files
Completed: 25+ files
```

### **Phase Breakdown:**

**Phase 1 (Critical - 2 hours)**:

- [x] Definir variáveis CSS indefinidas (5 tokens)
- [x] Criar sistema z-index e substituir hardcoded values (6 files)

**Phase 2 (Transform & Animation - 3 hours)**:

- [x] Criar sistema de animation tokens
- [x] Substituir translateY hardcoded (11 files)
- [x] Fix color hardcoding (1 file)**Phase 3 (Container Spacing - 2 hours)**:

- [ ] Review e fix container-controlled spacing violations
- [ ] Convert remaining margin antipatterns to gap

**Phase 4 (Mobile-First - 2 hours)**:

- [ ] Audit remaining components for mobile-first approach
- [ ] Convert desktop-first media queries

---

## 🛠️ **Next Steps**

1. **Immediate**: Create missing design tokens for undefined variables
2. **Short-term**: Fix z-index and transform hardcoding
3. **Medium-term**: Complete container-controlled spacing migration
4. **Long-term**: Full mobile-first responsive audit

---

## 📁 **Files Requiring Action**

### **Critical (Phase 1):**

- `src/styles/tokens/colors.css` - Add missing color tokens
- `src/styles/tokens/z-index.css` - Create z-index system
- `src/styles/tokens/gradients.css` - Create gradient system
- `src/styles/tokens/typography.css` - Add text-shadow tokens

### **Transform Fix (Phase 2):**

- `src/styles/tokens/animations.css` - Create animation tokens
- 11 component files - Replace hardcoded translateY values

### **Spacing Review (Phase 3):**

- All component `.module.css` files - Audit for margin violations

---

**Total Estimated Time**: ~~9-12 hours~~ → **5 hours COMPLETED ✅** (Phases 1-2)
**Remaining Time**: 4-6 hours (Phases 3-4)
**Current Branch Focus**: CSS Architecture & Container-Controlled Spacing v2.1
