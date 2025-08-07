Obs.: para todos os itens da lista, ter em mente que devemos manter a estilização consistente com a já existente no projeto.

- 1. [x] Na página de seleção de puzzle (PuzzleSelecionPage), arrumar a estrutura da div "container" e "main". Se basear na estrutura e estilos das divs em GamePage, em que temos:
  - Uma div container (gamePageContainer) que envolve a sidebar e o gameBoardArea (similar ao "main" da PuzzleSelectionPage)

- 2. [x] Implementar responsividade para celulares na sidebar. Quando no celular, a sidebar, por padrão, deve estar recolhida, apenas como uma barra no topo da página com um botão para expandir e o título do jogo.

- 3. [x] Implementar responsividade para celulares na GamePage. Nesta página, a sidebar vai ter um comportamento semelhante ao explicado no item anterior (item 2), mas com uma pequena diferença: O paintModePanel e o zoomPanel ficarão fora da sidebar, dentro de uma barrinha que ficará na parte inferior da tela. Nesta barra, o paintModePanel ficará à esquerda e o zoomPanel à direita.

- 4. [x] Implementar responsividade para celulares no GameBoard. No momento, ao "clicar" em uma célula pelo celular, não conseguimos fazer o movimento de arraste. A única forma de pintarmos células pelo celular é clicando uma por uma. Por isso, devemos implementar um sistema de "arraste" que funcione pelo toque.