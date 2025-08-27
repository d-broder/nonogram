<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Nonogram CSS Refactoring Instructions - v2.1

## � **Branch Focus: CSS Architecture & Container-Controlled Spacing**

Esta branch está focada exclusivamente em melhorias de **HTML e CSS** através do sistema de **container-controlled spacing** e **design tokens**.

## 🎨 **CSS ARCHITECTURE PRINCIPLES (MANDATORY)**

### **1. Container-Controlled Spacing (CORE PATTERN)**

**SEMPRE use container-controlled spacing - NUNCA permita que componentes filhos controlem suas próprias margens:**

```tsx
// ❌ ANTIPATTERN: Child components with margins
const BadComponent = () => (
  <div className={styles.container}>
    <Header className={styles.headerWithMargin} />
    <Content className={styles.contentWithMargin} />
  </div>
);

// ✅ CORRECT PATTERN: Container controls all spacing
const GoodComponent = () => (
  <div className={styles.container}>
    <Header />
    <Content />
  </div>
);

// CSS: Container manages spacing between children
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md); /* ALWAYS use design tokens */
}
```

### **2. Design Token System (REQUIRED)**

**SEMPRE use design tokens - NUNCA valores hardcoded:**

```css
/* ✅ CORRECT: Design tokens */
.component {
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  color: var(--color-primary);
}

/* ❌ FORBIDDEN: Hardcoded values */
.component {
  gap: 1rem;
  padding: 24px;
  border-radius: 8px;
  color: #3b82f6;
}

/* Design token scale (8px base) */
:root {
  --spacing-xs: 0.25rem; /* 4px */
  --spacing-sm: 0.5rem; /* 8px */
  --spacing-md: 1rem; /* 16px */
  --spacing-lg: 1.5rem; /* 24px */
  --spacing-xl: 2rem; /* 32px */
  --spacing-2xl: 3rem; /* 48px */
}
```

### **3. Mobile-First Responsive Design (MANDATORY)**

**TODO CSS deve ser mobile-first:**

```css
/* ✅ CORRECT: Mobile-first approach */
.component {
  /* Mobile styles first (320px+) */
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}

@media (min-width: var(--breakpoint-tablet)) {
  .component {
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }
}

/* Standard breakpoints */
:root {
  --breakpoint-mobile: 320px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1440px;
}
```

## 🚨 **CURRENT CSS PROBLEMS TO FIX**

### 1. **Spacing Inconsistencies**

- Hardcoded `margin` and `padding` values throughout components
- Child components managing their own spacing (antipattern)
- Inconsistent gaps between elements

### 2. **Missing Design Token System**

- No CSS custom properties for spacing/colors/breakpoints
- Magic numbers everywhere (20px, 1.5rem, etc.)
- No consistent spacing scale

### 3. **Non-Mobile-First CSS**

- Desktop styles written first, mobile as afterthought
- Missing responsive design in many components
- Inconsistent breakpoint usage

## 🛠️ **CSS REFACTORING PATTERNS**

### **Pattern 1: Convert Child Margins to Container Gap**

```css
/* BEFORE: Child components with margins */
.container .header {
  margin-bottom: 20px;
}
.container .content {
  margin-bottom: 16px;
}
.container .footer {
  margin-top: 24px;
}

/* AFTER: Container controls spacing */
.container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
/* Remove all child margins */
```

### **Pattern 2: Replace Hardcoded Values with Tokens**

```css
/* BEFORE: Hardcoded values */
.gameBoard {
  padding: 20px;
  gap: 16px;
  border-radius: 8px;
}

/* AFTER: Design tokens */
.gameBoard {
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### **Pattern 3: Mobile-First Responsive**

```css
/* BEFORE: Desktop-first */
.sidebar {
  width: 300px;
  padding: 24px;
}
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    padding: 16px;
  }
}

/* AFTER: Mobile-first */
.sidebar {
  width: 100%;
  padding: var(--spacing-md);
}
@media (min-width: var(--breakpoint-tablet)) {
  .sidebar {
    width: 300px;
    padding: var(--spacing-lg);
  }
}
```

## 📁 **CSS File Organization**

### **Structure for Design Tokens**

```
src/styles/
├── tokens/
│   ├── spacing.css      # Spacing scale
│   ├── colors.css       # Color palette
│   ├── typography.css   # Font sizes & weights
│   ├── breakpoints.css  # Media query breakpoints
│   └── index.css        # Import all tokens
├── components/
│   └── primitives/      # Container primitives (Stack, Inline, Grid)
└── utilities/
    ├── layout.css       # Layout utilities
    └── responsive.css   # Responsive utilities
```

### **CSS Modules Naming Convention**

```css
/* Component base styles */
.componentName {
  /* Base styles */
}

/* State modifiers */
.componentName.isActive {
  /* Active state */
}
.componentName.isDisabled {
  /* Disabled state */
}

/* Size variants */
.componentName.small {
  /* Small variant */
}
.componentName.large {
  /* Large variant */
}
```

## 🎯 **Priority Components for Refactoring**

### **Phase 1: Foundation (2 hours)**

1. Create `src/styles/tokens/` with design system
2. Update `src/index.css` with token imports
3. Create container primitive components (Stack, Inline)

### **Phase 2: Core Components (4-6 hours)**

1. **GameBoard.tsx**: Convert to container-controlled spacing
2. **PageLayout**: Apply design tokens throughout
3. **Form components**: Unify spacing patterns
4. **Button components**: Standardize sizing and spacing

### **Files with Spacing Issues (Identified)**

- `src/features/game/components/GameBoard/GameBoard.module.css`
- `src/features/layout/components/PageLayout/PageLayout.module.css`
- `src/views/GameView/GamePage.module.css`
- `src/shared/components/RoomForm/RoomForm.module.css`

## 🔧 **Tools & Commands**

```bash
# Development
npm run dev     # Vite dev server
npm run build   # Build check
npm run lint    # ESLint check

# CSS Analysis (when needed)
grep -r "margin\|padding" src/ --include="*.css"
grep -r "px\|rem" src/ --include="*.css" | grep -v "var("
```

## 💡 **CSS Best Practices for This Branch**

1. **Always use container-controlled spacing**
2. **Never use hardcoded spacing values**
3. **Write mobile-first responsive CSS**
4. **Use CSS custom properties for all design tokens**
5. **Prefer `gap` over margins for layout spacing**
6. **Keep components free of external spacing**

## 🚀 **When Helping with CSS**

1. **Check for spacing antipatterns** (child margins)
2. **Replace hardcoded values** with design tokens
3. **Ensure mobile-first responsive design**
4. **Use gap/grid for layout instead of margins**
5. **Follow the container-controlled spacing pattern**
6. **Test responsive behavior at different breakpoints**

---

**Remember**: Esta branch é focada exclusivamente em CSS e HTML. Evite mudanças na lógica de negócio, hooks ou funcionalidades React - apenas melhore a arquitetura de estilos.
