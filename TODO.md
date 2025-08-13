Obs.: para todos os itens da lista, ter em mente que devemos manter a estilização consistente com a já existente no projeto.

- 1. [ ] No modo celular, implementar responsividade para celulares no GameBoard. No momento, ao "clicar" em uma célula pelo celular, não conseguimos fazer o movimento de arraste. A única forma de pintarmos células pelo celular é clicando uma por uma. Por isso, devemos implementar um sistema de "arraste" que funcione pelo toque.

- 2. [ ] Juntar a PuzzleTypePage e a PuzzleSelectionPage em uma única página. Funcionará da seguinte forma: Será uma div que terá dois botões: "Classic" e "Super" no topo da página. Apenas um destes botões poderá estar apertado por vez. Por padrão, o botão "Classic" estará apertado. Estes botões ficarão um do lado do outro.

- 3.1. [ ] No modo computador, a sidebar deve aparecer em todas as telas, incluindo:
  - HomePage
  - Nova página que será a junção de PuzzleTypePage e PuzzleSelectionPage no modo singleplayer
  - Nova página que será a junção de PuzzleTypePage e PuzzleSelectionPage no modo multiplayer
  - WaitingRoomPage

- 3.2. [ ] No modo computador, em todas as telas que tem algum botão de voltar para a tela anterior (Por exemplo, "← Back to Game Mode Selection"), este botão será subsituído por um ícone minimalista de "voltar" que ficará na parte superior esquerda do container de conteúdo da página.

- 4.1. [ ] No modo celular, a topbar deve aparecer em todas as telas, incluindo:
  - HomePage
  - Nova página que será a junção de PuzzleTypePage e PuzzleSelectionPage no modo singleplayer
  - Nova página que será a junção de PuzzleTypePage e PuzzleSelectionPage no modo multiplayer
  - WaitingRoomPage
Porém, em todas essas páginas, com exceção da "Nova página que será a junção de PuzzleTypePage e PuzzleSelectionPage no modo multiplayer", a topbar não terá um botão para "abrir", já que não têm funções para ser exibidas nestas telas.

- 4.2. [ ] No modo celular, em todas as telas que tem algum botão de voltar para a tela anterior (Por exemplo, "← Back to Game Mode Selection"), este botão será subsituído por um ícone minimalista de "voltar" que ficará na parte esquerda da mobileTopBar

- 5. [ ] No modo celular, implementar, na mobileBottomBar, um botão de "toggle" que faz, na GameBoard, as classes "cornerSpace", "colClues" e "rowClues" trocarem entre ter a propriedade "position: sticky" ligada e desligada.

- 6. [ ] No modo celular, na tela GamePage, remover o paintModePanel e o zoomPanel da "sidebar abert" (ao clicar no hamburgerButton)

- 7. [ ] No modo celular, atualmente, ao clicar em "hamburgerButton", a "mobileTopBar" some e ela é "subtituída" por:

```tsx
<button class="_closeButton_wvopq_757" aria-label="Close menu">×</button>
<div><button class="_titleButton_wvopq_67">Nonogram</button></div>
```

Eu quero que a "mobileTopBar" continue aparecendo e não seja substituída pelos elementos acima. O "x" deverá aparecer na própria "mobileTopBar" no lugar do botão de "hamburgerButton".