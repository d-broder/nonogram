- [ ] Fazer a implementação do modo multiplayer. Faça uma implementação básica do que foi pedido, mas que funcione. Se necessário refinamento, isso será feito posteriormente. O objetivo é que o modo multiplayer funcione, mesmo que de forma básica, para que possamos testar e iterar sobre ele.
    - [x] Implementação do Firebase (src/firebase.ts) no projeto.
    - [x] Implementar a lógica de criação e gerenciamento de salas, incluindo a capacidade de criar uma sala, entrar em uma sala existente e gerenciar o estado do jogo em tempo real.
    - [ ] Implementar a lógica de sincronização de estado entre os jogadores, garantindo que as ações de um jogador sejam refletidas em todos os outros jogadores na sala.
- [ ] Na sidebar, será exibido o nome dos participantes da sala com as respectivas cores.

Considerações:

- Para um usuário entrar numa sala já existente, ele deve acessar através de um link.
- Ao clicar em "Join Room" (na página acessada através de um link de uma sala já existente), o usuário será redirecionado para a tela:
    - Se o criador da sala estiver selecionando o tipo de puzzle, ou selecionando o puzzle: para uma página de "espera", em que será simplesmente exibido os participantes da sala com as respectivas cores, destacando o criador da sala. E exibindo uma mensagem como "Awaiting creator to select puzzle...".
    - Se o criador da sala já tiver selecionado o puzzle: para a tela de jogo, com o grid e as pistas, como já existe.
- Os estados das "clueNumbers" (clicado ou não clicado), o estado de cada célula do grid (preto, "x" ou "o") serão compartilhados entre todos os usuários da sala, ou seja, se um usuário clicar numa "clueNumber", todos os outros usuários verão essa mudança. O mesmo vale para as células do grid.
- O modo de zoom do grid e o paint mode não serão compartilhados entre os usuários da sala, ou seja, cada usuário poderá ter seu próprio zoom e paint mode.

---

está bem melhor, mas ainda estão acontecendo alguns bugs esquisitos:

- Uma coisa estranha que eu reparei: ao clicar, o sistema "empurra" para o Firebase o estado atual daquela célula. A ação de clicar é a única forma de atualizar o estado do jogo online. E quando clicamos e arrastamos, as informações das células pintadas no movimento de arrastar não são enviadas para o Firebase, apenas a célula onde o clique foi feito. Mas as células continuam pintadas para mim, mas essa informação não aparece pros outros jogadores. Eu quero que isso seja arrumado

- O grid é inicializado com informação nula sobre cada célula ("nula" é diferente de "white") (na verdade, nem aparece o estado de nenhuma cell no Firebase). Na prática, ao inicializar um novo jogo, o estado de todas as células é "white". Ao mandar a informação para o Firebase do estado da célula ele não está podendo mais ser alterado. Não é isso o que eu quero. Eu quero que todas as células possam ser alteradas

---

agora está acontecendo o seguinte: o grid está sendo inicializado com todas as células com estado "white"

Por algum motivo, não sei se pela forma com está sendo lidado no código, tem algo prevenindo que células com algum estado definido não possam mais ser alterados. E, como está tudo white, nada que eu faça altera as células, nem visualmente. O estado das células deve poder sim ser alterado quantas vezes o usuário quiser

Eu reparei, usando dev tools, que, ao clicar em uma célula, esta é alterada apenas por alguns instantes, voltando para o estado "white" praticamente instantaneamente.

Dica: em "useGameState.ts" temos a função "applyCellChange" que é responsável por aplicar as mudanças de estado das células. Sempre que é aplicada uma mudança de estado em uma célula através desta função, o estado da célula deve ser atualizado tanto localmente quanto no Firebase. Isso garante que todas as alterações sejam refletidas em tempo real para todos os jogadores na sala.


