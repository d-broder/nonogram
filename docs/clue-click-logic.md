# Nonogram Multiplayer & Singleplayer Clue Click Logic

Este documento explica detalhadamente o fluxo de clique em uma dica de coluna (colClue) no Nonogram, tanto no modo multiplayer (com Firebase) quanto no modo singleplayer (local).

---

## 1. Clique em colClue no modo **multiplayer**

### Passo a passo:

### Diagrama de fluxo (Multiplayer)

```mermaid
flowchart TD
    A[Usuário clica em colClue] --> B[handleColClueClick (GameBoard)]
    B --> C{onColClueClick existe?}
    C -- Sim --> D[handleColClueClick (GamePage)]
    D --> E[Atualiza estado local]
    D --> F[updateClueState (Firebase)]
    F --> G[Firebase salva estado]
    G --> H[onSnapshot (todos jogadores)]
    H --> I[GamePage atualiza clickedColClues]
    I --> J[GameBoard renderiza clue clicada]
    C -- Não --> K[Atualiza estado local (singleplayer)]
```

#### 1.1. Usuário clica em uma dica de coluna
- O componente `GameBoard` renderiza cada clue com um handler:
  ```tsx
  <div onClick={(e) => handleColClueClick(e, index, blockIndex)}>
    {block}
  </div>
  ```
- O handler `handleColClueClick` é chamado.

#### 1.2. Handler detecta modo multiplayer
- O handler verifica se existe `onColClueClick` (passado via props):
  ```tsx
  if (onColClueClick) {
    onColClueClick(colIndex, clueIndex);
  }
  ```
- No multiplayer, `onColClueClick` está definido e aponta para a função do GamePage.

#### 1.3. GamePage processa o clique e sincroniza com Firebase
- Função chamada:
  ```tsx
  const handleColClueClick = async (colIndex, clueIndex) => {
    const clueId = `col-${colIndex}-${clueIndex}`;
    const isCurrentlyClicked = clickedColClues.has(clueId);
    const newState = !isCurrentlyClicked;
    // Atualiza estado local
    ...
    // Sincroniza com Firebase
    await updateClueState(clueId, newState);
  }
  ```
- O estado local é atualizado imediatamente para responsividade.
- A função `updateClueState` (do hook `useFirebaseRoom`) faz:
  ```ts
  await updateDoc(doc(firestore, 'rooms', roomId), {
    [`clues.${clueId}`]: newState
  });
  ```
- O Firebase salva o novo estado da clue.

#### 1.4. Firebase notifica todos os participantes
- O hook `useFirebaseRoom` escuta mudanças em tempo real:
  ```ts
  onSnapshot(doc(firestore, 'rooms', roomId), ...)
  ```
- Quando o estado da clue muda, todos recebem a atualização.

#### 1.5. GamePage atualiza o frontend
- O `useEffect` em GamePage detecta mudanças em `room.clues`:
  ```tsx
  if (room.clues) {
    Object.entries(room.clues).forEach(([clueId, isClicked]) => {
      if (clueId.startsWith('col-') && isClicked) {
        newClickedColClues.add(clueId);
      }
    });
    setClickedColClues(newClickedColClues);
  }
  ```
- O estado `clickedColClues` é atualizado.
- O componente `GameBoard` recebe o novo Set via props e renderiza a clue como clicada (classe CSS alterada).

---

## 2. Clique em colClue no modo **singleplayer**

### Passo a passo:

### Diagrama de fluxo (Singleplayer)

```mermaid
flowchart TD
    A[Usuário clica em colClue] --> B[handleColClueClick (GameBoard)]
    B --> C{onColClueClick existe?}
    C -- Não --> D[Atualiza estado local]
    D --> E[GameBoard renderiza clue clicada]
    C -- Sim --> F[Chama handler externo (multiplayer)]
```

#### 2.1. Usuário clica em uma dica de coluna
- O componente `GameBoard` renderiza cada clue com o mesmo handler:
  ```tsx
  <div onClick={(e) => handleColClueClick(e, index, blockIndex)}>
    {block}
  </div>
  ```
- O handler `handleColClueClick` é chamado.

#### 2.2. Handler detecta modo singleplayer
- O handler verifica se existe `onColClueClick`:
  ```tsx
  if (onColClueClick) {
    ...
  } else {
    // Modo singleplayer
    const clueId = `col-${colIndex}-${clueIndex}`;
    setInternalClickedColClues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clueId)) {
        newSet.delete(clueId);
      } else {
        newSet.add(clueId);
      }
      return newSet;
    });
  }
  ```
- O estado interno do componente é atualizado (Set local).

#### 2.3. GameBoard atualiza o frontend
- O próprio componente `GameBoard` usa o estado local para renderizar a clue como clicada ou não.
- Não há comunicação com Firebase nem outros jogadores.

---

## Resumo Visual

| Passo                | Multiplayer (Firebase)                | Singleplayer (Local)         |
|----------------------|---------------------------------------|------------------------------|
| Clique na clue       | handler → GamePage → Firebase         | handler → estado local       |
| Sincronização        | Firebase notifica todos               | Não há sincronização         |
| Renderização         | Estado via props → GameBoard          | Estado interno → GameBoard   |

---

## Referências de Código

- `GameBoard.tsx`: handler de clique, lógica de estado local/externo
- `GamePage.tsx`: wrapper para multiplayer, sincronização com Firebase
- `useFirebaseRoom.ts`: CRUD e listener do Firebase

---

Se quiser exemplos de código específicos ou um diagrama, só pedir!
