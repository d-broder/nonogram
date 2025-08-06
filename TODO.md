- [ ] Fazer a implementação do modo multiplayer. Faça uma implementação básica do que foi pedido, mas que funcione. Se necessário refinamento, isso será feito posteriormente. O objetivo é que o modo multiplayer funcione, mesmo que de forma básica, para que possamos testar e iterar sobre ele.
    - [ ] Implementação do Firebase (src/firebase.ts) no projeto.
    - [ ] Implementar a lógica de criação e gerenciamento de salas, incluindo a capacidade de criar uma sala, entrar em uma sala existente e gerenciar o estado do jogo em tempo real.
    - [ ] Implementar a lógica de sincronização de estado entre os jogadores, garantindo que as ações de um jogador sejam refletidas em todos os outros jogadores na sala.
- [ ] Na sidebar, será exibido o nome dos participantes da sala com as respectivas cores.

Considerações:

- Para um usuário entrar numa sala já existente, ele deve acessar através de um link.
- Ao clicar em "Join Room" (na página acessada através de um link de uma sala já existente), o usuário será redirecionado para a tela:
    - Se o criador da sala estiver selecionando o tipo de puzzle, ou selecionando o puzzle: para uma página de "espera", em que será simplesmente exibido os participantes da sala com as respectivas cores, destacando o criador da sala. E exibindo uma mensagem como "Awaiting creator to select puzzle...".
    - Se o criador da sala já tiver selecionado o puzzle: para a tela de jogo, com o grid e as pistas, como já existe.
- Os estados das "clueNumbers" (clicado ou não clicado), o estado de cada célula do grid (preto, "x" ou "o") serão compartilhados entre todos os usuários da sala, ou seja, se um usuário clicar numa "clueNumber", todos os outros usuários verão essa mudança. O mesmo vale para as células do grid.
- O modo de zoom do grid e o paint mode não serão compartilhados entre os usuários da sala, ou seja, cada usuário poderá ter seu próprio zoom e paint mode.