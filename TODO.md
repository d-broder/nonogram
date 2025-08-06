- [ ] No momento, quando o puzzle é resolvido, as divs ."nonogramContainer"."colClues" e ."nonogramContainer"."gameArea"."rowClues" são "removidas" para que o usuário não veja mais as dicas. Quando isso acontece, devido às configurações do CSS, o "grid" é deslocado para o meio e o usuário vê o grid centralizado na tela, sem as dicas visíveis. Eu quero que essa transição (tanto o "desaparecimento" das dicas quanto o "deslocamento" do grid) seja suave, com uma animação de transição.

- [ ] Quando o usuário completo o puzzle, todos os "x" e "o" devem ser removidos do grid (no momento, os "x" já estão sendo removidos). Quero que essa remoçã seja feita de forma suave, com uma animação igual à do desaparecimento dessas que já existe quando removemos elas normalmente.

- [ ] Fazer com que "ConfirmationModal" tenha um estilo mais consistente com o restante do projeto.

- [ ] Fazer com que a função "getAvailablePuzzles", em puzzleUtils.ts, retorne uma array com os puzzles disponíveis na pasta "public/puzzles" - de acordo com o tipo - automaticamente, ao invés de retornar uma array fixa.