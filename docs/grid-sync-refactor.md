# Refatoração da Sincronização de Células do Grid

## Problema Identificado

O usuário identificou que ao clicar em células, estas eram alteradas apenas por alguns instantes, voltando para o estado "white" quase instantaneamente. Isso acontecia devido à lógica de sincronização com Firebase estar mal implementada, com problemas de timing e conflitos entre estado local e remoto.

## Solução Implementada

### 1. Nova Arquitetura no `useGameState`

**Antes:**
- A sincronização com Firebase era feita externamente no `GamePage`
- As funções wrapper tentavam sincronizar após a mudança, causando conflitos

**Depois:**
- O `useGameState` agora recebe um callback opcional `onCellChange`
- A sincronização acontece diretamente na função `applyCellChange`
- Garantia de que toda mudança de célula seja sincronizada imediatamente

```typescript
interface UseGameStateOptions {
  onCellChange?: (cellId: string, state: CellState) => Promise<void>;
}

export function useGameState(puzzle: Puzzle | null, options?: UseGameStateOptions)
```

### 2. Modificação na função `applyCellChange`

```typescript
// Sync to Firebase if callback is provided
if (onCellChange) {
  onCellChange(cellId, newState).catch(error => {
    console.error('Error syncing cell to Firebase:', error);
  });
}
```

**Características:**
- A sincronização acontece dentro do `setGameState`
- Garantia de que o estado local e remoto sejam atualizados simultaneamente
- Tratamento de erro sem afetar o estado local

### 3. Nova função `updateCellExternally`

```typescript
const updateCellExternally = useCallback((cellId: string, newState: CellState) => {
  const [row, col] = cellId.split('-').map(Number);
  
  setGameState(prev => {
    // Check if cell is already in this state
    if (prev.grid[row] && prev.grid[row][col] === newState) {
      return prev;
    }

    const newGrid = prev.grid.map((gridRow, rowIndex) =>
      gridRow.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return newState;
        }
        return cell;
      })
    );

    const isComplete = puzzle ? checkSolution(newGrid, puzzle.solution) : false;

    return {
      ...prev,
      grid: newGrid,
      isComplete,
    };
  });
}, [puzzle]);
```

**Função:**
- Atualiza células baseado em mudanças externas (Firebase)
- Verifica se a célula já está no estado correto antes de atualizar
- Recalcula se o puzzle está completo

### 4. Simplificação no `GamePage`

**Removido:**
- Funções wrapper `handleMultiplayerCellMouseDown`, `handleMultiplayerCellMouseEnter`, `handleMultiplayerCellMouseUp`
- Lógica complexa de comparação de grids
- setTimeout para sincronização

**Adicionado:**
- Configuração direta do callback no `useGameState`
- Uso da função `updateCellExternally` no listener do Firebase

```typescript
const { 
  gameState, 
  // ... outras funções
  updateCellExternally
} = useGameState(puzzle, {
  onCellChange: isMultiplayer && roomId ? updateGridCell : undefined
});
```

### 5. Atualização do Listener Firebase

```typescript
// Update grid based on Firebase room state
if (room.grid) {
  Object.entries(room.grid).forEach(([cellId, cellState]) => {
    updateCellExternally(cellId, cellState as CellState);
  });
}
```

**Vantagens:**
- Sincronização mais limpa e direta
- Evita conflitos de estado
- Melhor performance (sem comparações desnecessárias)

## Fluxo Atualizado

### Modo Multiplayer
1. **Usuário clica em célula** → `applyCellChange` é chamada
2. **Estado local é atualizado** → Grid é modificado localmente
3. **Firebase é atualizado** → `onCellChange` callback é executado
4. **Firebase notifica outros jogadores** → Listener `onSnapshot` detecta mudança
5. **Outros jogadores recebem atualização** → `updateCellExternally` é chamada
6. **Grid é atualizado** → Mudança é refletida no frontend

### Modo Singleplayer
1. **Usuário clica em célula** → `applyCellChange` é chamada
2. **Estado local é atualizado** → Grid é modificado localmente
3. **Não há sincronização** → `onCellChange` é `undefined`

## Benefícios da Refatoração

- **Eliminação do bug de rollback:** Células não voltam mais ao estado anterior
- **Sincronização mais confiável:** Mudanças locais e remotas são consistentes
- **Código mais limpo:** Remoção de lógica complexa e redundante
- **Melhor performance:** Menos operações desnecessárias
- **Arquitetura mais robusta:** Separação clara entre lógica local e sincronização

## Arquivos Modificados

- `src/hooks/useGameState.ts`: Nova interface, callback de sincronização, função de atualização externa
- `src/pages/GamePage/GamePage.tsx`: Remoção de wrappers, configuração do callback, uso da nova função de atualização
