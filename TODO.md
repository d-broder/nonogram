- [ ] No momento, quando o puzzle é resolvido, as divs ."nonogramContainer"."colClues" e ."nonogramContainer"."gameArea"."rowClues" são "removidas" para que o usuário não veja mais as dicas. Quando isso acontece, devido às configurações do CSS, o "grid" é deslocado para o meio e o usuário vê o grid centralizado na tela, sem as dicas visíveis. Eu quero que essa transição (tanto o "desaparecimento" das dicas quanto o "deslocamento" do grid) seja suave, com uma animação de transição.

- [ ] Remover a mensagem de sucesso da sidebar quando o puzzle é resolvido. Ao invés disso, quero que a mensagem de sucesso seja exibida no "gameBoardArea", centralizada horizontalmente e, verticalmente, na parte superior da div "gameBoardArea". A mensagem deve estar em letras maiúsculas. A div em dela será transparente, exibindo apenas as letras. A mensagem deve ser: "{puzzle type} PUZZLE {puzzle id} SOLVED". Exemplo: "SUPER PUZZLE 2 SOLVED". Deverá haver uma animação de exibição semelhante à do item anterior.

- [ ] Fazer com que a função "getAvailablePuzzles", em puzzleUtils.ts, retorne uma array com os puzzles disponíveis na pasta "public/puzzles" - de acordo com o tipo - automaticamente, ao invés de retornar uma array fixa.

- [ ] No "zoomPanel" na sidebar, adicionar um botão de "Reset Zoom" que, quando clicado, redefine o zoom para o valor padrão (1.0) e atualiza a visualização do grid. Este botão deve ser minimalista, posicionado juntamente com os botões de zoom in e zoom out, sendo estilizado de forma consistente com o restante do painel.

- [ ] Quando o usuário clicar em "Clear Grid" exibir um modal simples peguntando se o usuário tem certeza que ele quer fazer isso. O modal deve ter dois botões: "Sim" e "Não". Se o usuário clicar em "Sim", o grid deve ser limpo. Se o usuário clicar em "Não", o modal deve ser fechado e nada deve acontecer.

- [ ] As "clueNumers" e "superClueNumer" dentro de "rowClueContainer" e "colClueContainer" estão com a animação de hover mas o click não está funcionando. A seguir, o código a seguir contém comentários que explicam o que está acontecendo e o que precisa ser corrigido:

``` tsx
if (isSuperCol) {
    if (typeof block === 'number') {
        clueElements.push(
          // Nesta parte do código, ainda não está sendo adicionada a classe "clueNumberClicked" como é feito para as colunas normais. Isso deve ser arrumado.
            <div key={blockIndex} className={`${styles.clueNumber} ${styles.superClueNumber}`}>
                {block}
            </div>
        );
    } else if (Array.isArray(block)) {
        clueElements.push(
            <div key={blockIndex} style={{ display: 'flex', flexDirection: 'row' }}>
                {(block as number[][]).map((line: number[], lineIndex: number) => (
                    <div key={lineIndex} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        minWidth: `${zoomConfig.cellSize}px`, 
                        alignItems: 'center' 
                    }}>
                        {!(Array.isArray(line) && line.length === 1 && line[0] === 0) && 
                            line.map((clue: number, clueIndex: number) => (
                                <div key={clueIndex} className={styles.clueNumber}>
                                    {clue}
                                </div>
                            ))
                        }
                    </div>
                ))}
            </div>
        );
    }
} else {
    const clueId = `col-${index}-${blockIndex}`;
    const isClicked = clickedColClues.has(clueId);
    clueElements.push(
        <div 
            key={blockIndex}
            // Nesta parte do código, está sendo adicionada a classe "clueNumberClicked". Porém, quando é superCol (isSuperCol), não adicionamos essa classe. Isso deve ser arrumado.
            className={`${styles.clueNumber} ${isClicked ? styles.clueNumberClicked : ''}`}
            onClick={(e) => handleColClueClick(e, index, blockIndex)}
        >
            {block}
        </div>
    );
}
```


Observações: Manter um estilo visual consistente com o restante do projeto, utilizando as cores e fontes já definidas.