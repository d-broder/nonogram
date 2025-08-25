# Parte 1

✅ **CONCLUÍDO**: Sistema de navegação interna implementado!

Agora, ao selecionar um puzzle na `PuzzleSelectionPage`, a URL permanece como `http://localhost:5174/`. O sistema puxa a informação do JSON do puzzle selecionado e exibe na `GamePage` através de um contexto de navegação interno. O botão "⯇ Back to Puzzles" também funciona sem mudar a URL.

## Implementação:

1. **Contexto de Navegação** (`src/contexts/AppNavigationContext.tsx`):

   - Gerencia o estado atual da visualização (`puzzle-selection` ou `game`)
   - Armazena informações do puzzle selecionado (tipo e ID)
   - Fornece funções para navegar entre visualizações

2. **Página Unificada** (`src/pages/UnifiedPage/UnifiedPage.tsx`):

   - Renderiza condicionalmente `PuzzleSelectionPage` ou `GamePage`
   - Baseado no estado do contexto de navegação

3. **Modificações no GamePage**:

   - Aceita props opcionais para tipo e ID do puzzle
   - Mantém compatibilidade com rotas URL para multiplayer
   - Usa navegação interna quando props são fornecidas

4. **Modificações no PuzzleSelectionPage**:

   - Usa navegação interna para modo single player
   - Mantém navegação por URL para multiplayer

5. **Modificações nos Controles**:
   - Botão "Back to Puzzles" usa navegação interna quando apropriado
   - Mantém Link para URL em contextos multiplayer

O sistema funciona perfeitamente mantendo a URL como `/` enquanto navega internamente entre seleção de puzzles e jogo!

# Parte 2

Alteração da implementação do modo multiplayer. Atualmente, ao iniciar o modo multiplayer (ao clicar no botão "Create Room" na tela de criação de sala), a URL é alterada para:

- Se estamos na "puzzle-selection": http://localhost:5173/multiplayer/room/{roomId}/puzzles
- Se estamos na "game": http://localhost:5173/multiplayer/game/{roomId}/{puzzleType}/{puzzleId}

Eu quero alterar esta lógica. Eu quero que, a qualquer momento, quando criamos a sala, a URL seja: http://localhost:5173/{roomId}

Quando a room é criada, é criado o objeto da room no Firebase informando o estado da sala:

```typescript
const roomData: Omit<Room, "id"> = {
  createdAt: serverTimestamp(),
  createdBy: creator.id,
  players: {
    [creator.id]: creator,
  },
  status: "waiting",
  puzzleType: null,
  puzzleId: null,
  grid: {},
  cellAuthors: {},
  clues: {},
};
```

O status será "waiting" se a sala estiver no "puzzle-selection" e "playing" se estiver no "game".

Isto vai definir em qual tela o usuário será direcionado depois que abrir o link (localhost:5173/{roomId}) da sala, informar os dados (nome do jogador e cor do jogador) e clicar em "Join Room".

Ou seja, sempre que um usuário abrir o link da sala, ele será redirecionado para a "JoinRoomPage". Ao clicar em "Join Room", a página que ele vai entrar vai ser definida pelo estado da sala (waiting ou playing), mas mantendo a mesma URL (localhost:5173/{roomId}).

# Parte 3

✅ **CONCLUÍDO**: Remover o "roomLink" de "roomInfo".

O sistema agora gera o roomLink internamente no PageLayout usando o roomId. Isso simplifica a passagem de props e centraliza a lógica de geração do link.

✅ **CONCLUÍDO**: Quando um jogador fecha a página, o jogador é removido da sala. Se o jogador for o criador:

- se o criador for o único jogador, a sala deve ser excluída.
- se houver outros jogadores, o título de "Host" será transferido para outro jogador.

Implementado através do hook `useRoomCleanup` que detecta quando o usuário fecha a página/aba e automaticamente remove o jogador da sala. A lógica no `useFirebaseRoom.leaveRoom` cuida da transferência de host e exclusão da sala conforme necessário.

✅ **CONCLUÍDO**: No modo multiplayer, tanto para o criador quanto para os demais jogadores, ao clicar em "titleButton"

O titleButton (logo "Nonogram") já utiliza a mesma função que o botão "Back to Puzzles", então funciona corretamente para ambos os cenários.

✅ **CONCLUÍDO**: Não exibir o "gameControls" (botões "Back to Puzzles", "Show Solution" e "Clear Grid") para os jogadores que não são o criador da sala

Implementado através da prop `showGameControls` no PageLayout que é controlada pela variável `isCreator` na GamePage. Apenas o criador da sala vê os controles do jogo.

✅ **CONCLUÍDO**: No modo multiplayer, quando o "Host" da sala apertar no botão "Back to Puzzles", a sala ficará com o status "waiting" e os demais jogadores da sala serão redirecionados para a "WaitingRoomPage". As demais informações da sala também serão resetadas (grid, cellAuthors, clues, puzzleId, puzzleType).

Implementado através da função `resetRoomToWaiting` no `useFirebaseRoom` que é chamada quando o criador clica em "Back to Puzzles". Isso reseta o status da sala para "waiting" e limpa todos os dados do jogo, fazendo com que os outros jogadores sejam automaticamente redirecionados para a WaitingRoomPage pelo MultiplayerRoomHandler.

# Parte 4

✅ **CONCLUÍDO**: Ao clicar no em "titleButton", o jogador será redirecionado para a página de seleção de puzzles

- Se estiver no modo single player, irá para a página de seleção de puzzles normalmente
- Se estiver no modo multiplayer e for o host, irá sair da sala (passando o "Host" para outro jogador, se tiverem outros jogadores, ou deletando a sala se for o único jogador da sala), ir para o modo singleplayer e ir para a página de seleção de puzzles
- Se estiver no modo multiplayer e não for o host, irá sair da sala, ir para o modo singleplayer e ir para a página de seleção de puzzles

Implementado através da modificação do `handleHomeClick` no PageLayout que detecta se está em modo multiplayer (através do roomId), remove o jogador da sala usando `leaveRoom`, limpa o sessionStorage e navega para a URL raiz (modo single player).

✅ **CONCLUÍDO**: Quando o jogador virar o "Host" após o "Host" anterior sair da sala, será exibido o "gameControls" para o novo "Host"

Implementado através da modificação da lógica `isCreator` no GamePage para usar dados em tempo real do Firebase (room.players) em vez de apenas o sessionStorage inicial. Também foi adicionado um useEffect para sincronizar o sessionStorage quando há mudanças de host.

# Parte 5

✅ **CONCLUÍDO**: Remover as divs "roomTitle" e "roomLink" da div "roomInfo"

As divs "roomTitle" (que mostrava "Room: {roomId}") e "roomLink" (que mostrava a URL completa da sala) foram removidas da interface. Agora apenas o botão "Copy Link" permanece visível para compartilhar a sala, simplificando a interface.

✅ **CONCLUÍDO**: No momento, a ordem dos jogadores em "playerList" fica alterando toda vez que algum jogador faz alguma mudança no grid. Eu quero que a ordem dos jogadores permaneça a mesma, independentemente das mudanças no grid. Quero que a ordem seja baseada na ordem de chegada dos jogadores na sala, mas com o "Host" sempre em primeiro.

Implementado através de:

1. **Adição do campo `joinedAt`** ao tipo `Player` para rastrear quando cada jogador entrou na sala
2. **Atualização dos pontos de criação de jogadores** (CreateRoomModal, JoinRoomPage, MobileCreateRoomForm) para incluir timestamp de entrada
3. **Função de ordenação personalizada** no PageLayout que ordena os jogadores com o Host sempre primeiro, seguido pelos demais jogadores na ordem de chegada
4. **Uso de `sortedPlayers`** em vez de `players` diretamente na renderização da lista

A ordem agora permanece estável independentemente das mudanças no grid, garantindo uma experiência de usuário consistente.
