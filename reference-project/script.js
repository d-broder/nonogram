// Exibe modal de sucesso e anima fundo
function showSuccessMessage(message = 'Congratulations! Puzzle solved!') {
    const modal = document.getElementById('successModal');
    const msgSpan = document.getElementById('successMessage');
    if (!modal || !msgSpan) return;
    msgSpan.textContent = message;
    modal.style.display = 'block';
    let flashes = 0;
    const maxFlashes = 10;
    const originalBg = document.body.style.backgroundColor || '';
    const green = '#b6f5c1';
    // Garante que a transição será suave
    document.body.style.transition = 'background-color 1s cubic-bezier(.4,1.3,.5,1)';
    let flashInterval = setInterval(() => {
        document.body.style.backgroundColor = (flashes % 2 === 0) ? green : originalBg;
        flashes++;
        if (flashes > maxFlashes) {
            clearInterval(flashInterval);
            document.body.style.backgroundColor = originalBg;
        }
    }, 500);
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.backgroundColor = originalBg;
    }, 5000);
}

// Valida se o puzzle foi resolvido corretamente
function checkPuzzleSolved() {
    if (!currentPuzzle || !currentPuzzle.solution) return false;
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const cell = getCellAt(row, col);
            const expected = currentPuzzle.solution[row][col] === 1 ? STATE_BLACK : STATE_WHITE;
            if (cell.dataset.state !== expected) {
                return false;
            }
        }
    }
    return true;
}
// Compatibilidade com Node.js
let SIZE = 15; // Variável global para tamanho do grid

// Definir variáveis globais para Node.js se não existirem
if (typeof document === 'undefined') {
    global.document = {
        getElementById: () => null,
        createElement: () => ({ appendChild: () => {}, style: {}, innerHTML: '' }),
        addEventListener: () => {}
    };
}

if (typeof window === 'undefined') {
    global.window = {};
}

const grid = document.getElementById('grid');

// Tipos de puzzle
const PUZZLE_TYPES = {
    CLASSIC: 'classic',
    MEGA: 'mega'
};

// Estados possíveis
const STATE_WHITE = 'white';
const STATE_BLACK = 'black';
const STATE_X = 'x';
const STATE_O = 'o';

// Tipo atual do jogo
let currentGameType = PUZZLE_TYPES.CLASSIC;

// Estrutura de dados para puzzles
// Puzzle structure based on new JSON format
function createPuzzleFromJson(json) {
    // Defensive copy
    const puzzle = JSON.parse(JSON.stringify(json));
    // Add helper methods
    puzzle.getId = function() {
        return this.id.toString();
    };
    puzzle.getDescription = function() {
        // Map puzzle type to display name
        const typeNames = {
            'classic': 'Classic',
            'mega': 'Mega'
        };
        const typeName = typeNames[this.type] || this.type;
        const width = this.size.width;
        const height = this.size.height;
        return `Nonogram ${typeName} ${width}x${height} (ID:${this.id})`;
    };
    return puzzle;
}

// Puzzle atual
let currentPuzzle = null;

// Puzzle bank using new JSON format
const puzzleBank = {
    // Classic Nonogram 10x10
    'classic_001': createPuzzleFromJson({
        id: 1,
        type: 'classic',
        size: { width: 10, height: 10 },
        rowClues: [
            [6], [2, 4], [2, 1, 1, 2], [1, 2, 1], [1, 2, 1],
            [1, 3, 1], [1, 4, 1], [2, 2, 3], [2, 4], [6]
        ],
        colClues: [
            [6], [2, 2], [2, 2], [1, 1, 1], [1, 2, 1],
            [2, 5], [7, 2], [2, 7], [2, 2], [6]
        ],
        solution: [
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,0,1,1,1,1,0],
            [1,1,0,1,0,0,1,0,1,1],
            [1,0,0,0,0,0,1,1,0,1],
            [1,0,0,0,0,0,1,1,0,1],
            [1,0,0,0,0,1,1,1,0,1],
            [1,0,0,0,1,1,1,1,0,1],
            [1,1,0,0,1,1,0,1,1,1],
            [0,1,1,0,0,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,0,0]
        ]
    }),
    // Classic Nonogram 5x5
    'classic_002': createPuzzleFromJson({
        id: 2,
        type: 'classic',
        size: { width: 5, height: 5 },
        rowClues: [ [5], [1,1,1], [5], [1,1,1], [5] ],
        colClues: [ [5], [1,1,1], [5], [1,1,1], [5] ],
        solution: [
            [1,1,1,1,1],
            [1,0,1,0,1],
            [1,1,1,1,1],
            [1,0,1,0,1],
            [1,1,1,1,1]
        ]
    }),
    // Mega Nonogram 15x15 atualizado
    'mega_001': createPuzzleFromJson({
        id: 1,
        type: 'mega',
        size: { width: 15, height: 15 },
        rowClues: [
            [1,4],
            [[[1],[1]],6,4],
            ["mega"],
            [1,6,2],
            [[[1],[1]],8,[[1],[0]],3,3],
            ["mega"],
            [1,4,3,1],
            [4,3,1],
            [2,1,1,3,2],
            [1,1,4,2],
            [2,5,2],
            [3,2,2],
            [3,2,2],
            [5,2],
            [6]
        ],
        colClues: [
            [1,4],
            [1,2,3],
            [1,2,3],
            [1,5,3],
            [1,4,1,2],
            [1,4,1,1,3],
            [1,4,6],
            [4,3,1],
            [4,3,2],
            [2,2,3,2],
            [3,[[1],[0]],8,4],
            ["mega"],
            [2,1,2],
            [2,1,2],
            [6]
        ],
        solution: [
            [0,0,0,0,0,0,1,0,1,1,1,1,0,0,0],
            [0,0,0,0,0,1,0,1,1,1,0,1,1,0,0],
            [0,0,0,0,1,0,1,1,1,0,0,0,1,1,0],
            [0,0,0,1,0,1,1,1,1,1,1,0,0,1,1],
            [0,0,1,0,1,1,1,1,0,1,0,1,0,0,1],
            [0,1,0,1,1,1,1,0,0,0,1,1,0,1,1],
            [1,0,1,1,1,1,0,0,0,0,1,1,1,0,1],
            [0,1,1,1,1,0,0,0,0,1,1,1,0,0,1],
            [1,1,0,1,0,1,0,0,1,1,1,0,0,1,1],
            [1,0,0,1,0,0,1,1,1,1,0,0,1,1,0],
            [1,1,0,0,1,1,1,1,1,0,0,1,1,0,0],
            [1,1,1,0,0,0,1,1,0,0,1,1,0,0,0],
            [0,1,1,1,0,1,1,0,0,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,0,1,1,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,0,0,0,0,0,0]
        ]
    })
};

// Variáveis para controle do arraste
let isDragging = false;
let dragStartCell = null;
let dragDirection = null; // 'horizontal' ou 'vertical'
let dragButton = null; // 0 para esquerdo, 2 para direito
let dragStartState = null;
let modifiedCells = new Set(); // Para controlar células já modificadas

// Paint mode for left mouse button (default: black)
let leftPaintMode = STATE_BLACK;

// Atualiza visual do botão selecionado
function updatePaintModeButtons() {
    const modes = ['black', 'x', 'o'];
    modes.forEach(mode => {
        const btn = document.getElementById('paintMode' + mode.charAt(0).toUpperCase() + mode.slice(1));
        if (btn) {
            if (leftPaintMode === mode) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        }
    });
}

// Chamada ao trocar modo
function setPaintMode(mode) {
    leftPaintMode = mode;
    updatePaintModeButtons();
}

// Inicializa seleção visual ao carregar
if (typeof document !== 'undefined') {
    window.addEventListener('DOMContentLoaded', updatePaintModeButtons);
}

// Função para criar/recriar o grid baseado no tamanho atual
function createGrid() {
    // Limpar grid existente
    grid.innerHTML = '';
    
    // Ajustar CSS do grid
    grid.style.gridTemplateColumns = `repeat(${SIZE}, 40px)`;
    grid.style.gridTemplateRows = `repeat(${SIZE}, 40px)`;
    
    // Criar células
    for (let i = 0; i < SIZE * SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.state = STATE_WHITE;
        cell.dataset.row = Math.floor(i / SIZE);
        cell.dataset.col = i % SIZE;
        
        const row = Math.floor(i / SIZE);
        const col = i % SIZE;
        
        // Add thick borders for multiples of 5
        if ((col + 1) % 5 === 0 && col + 1 < SIZE) {
            cell.classList.add('thick-right');
        }
        if (col % 5 === 0 && col > 0) {
            cell.classList.add('thick-left');
        }
        if ((row + 1) % 5 === 0 && row + 1 < SIZE) {
            cell.classList.add('thick-bottom');
        }
        if (row % 5 === 0 && row > 0) {
            cell.classList.add('thick-top');
        }
        
        cell.addEventListener('mousedown', (e) => handleCellMouseDown(e, cell));
        cell.addEventListener('mouseenter', (e) => handleCellMouseEnter(e, cell));
        cell.addEventListener('mouseup', (e) => handleCellMouseUp(e, cell));
        // Previne menu do botão direito
        cell.addEventListener('contextmenu', e => e.preventDefault());
        grid.appendChild(cell);
    }
}

// Função para carregar um puzzle
function loadPuzzle(puzzleId) {
    const puzzle = puzzleBank[puzzleId];
    if (!puzzle) {
        return;
    }
    currentPuzzle = puzzle;
    SIZE = puzzle.size.width; // Atualizar tamanho global
    // Recriar grid com novo tamanho
    createGrid();
    // Limpar grid
    clearGrid();
    // Atualizar pistas visuais
    createVisualClues();
    // Atualizar interface
    updatePuzzleInfo();
}

// Cria o grid inicial (apenas no browser)
if (typeof document !== 'undefined' && document.getElementById && document.getElementById('grid')) {
    createGrid();
}

// Eventos globais para controlar o arraste (apenas no browser)
if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('mouseup', () => {
        isDragging = false;
        dragStartCell = null;
        dragDirection = null;
        dragButton = null;
        dragStartState = null;
        modifiedCells.clear();
    });
}

function handleCellMouseDown(e, cell) {
    e.preventDefault();
    isDragging = true;
    dragStartCell = cell;
    dragButton = e.button;
    dragStartState = cell.dataset.state;
    dragDirection = null;
    modifiedCells.clear();
    
    // Aplica a mudança na célula inicial imediatamente
    applyCellChange(cell);
}

function handleCellMouseEnter(e, cell) {
    if (!isDragging) return;
    
    const currentRow = parseInt(cell.dataset.row);
    const currentCol = parseInt(cell.dataset.col);
    const startRow = parseInt(dragStartCell.dataset.row);
    const startCol = parseInt(dragStartCell.dataset.col);
    
    // Define a direção se ainda não foi definida
    if (!dragDirection && (currentRow !== startRow || currentCol !== startCol)) {
        if (currentRow === startRow) {
            dragDirection = 'horizontal';
        } else if (currentCol === startCol) {
            dragDirection = 'vertical';
        } else {
            // Se não está na mesma linha nem coluna, define baseado na maior diferença
            const rowDiff = Math.abs(currentRow - startRow);
            const colDiff = Math.abs(currentCol - startCol);
            dragDirection = rowDiff > colDiff ? 'vertical' : 'horizontal';
        }
    }
    
    // Interpreta a célula baseada na direção definida
    let targetCell = cell;
    if (dragDirection === 'horizontal') {
        // Se estamos no modo horizontal, interpreta como se fosse da mesma linha da célula inicial
        if (currentRow !== startRow) {
            const targetCol = currentCol;
            targetCell = getCellAt(startRow, targetCol);
        }
    } else if (dragDirection === 'vertical') {
        // Se estamos no modo vertical, interpreta como se fosse da mesma coluna da célula inicial
        if (currentCol !== startCol) {
            const targetRow = currentRow;
            targetCell = getCellAt(targetRow, startCol);
        }
    }
    
    // Aplica mudanças na célula interpretada
    if (targetCell) {
        applyCellChange(targetCell);
    }
}

// Função auxiliar para encontrar uma célula específica
function getCellAt(row, col) {
    // Verifica se a posição é válida
    if (row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
        return null;
    }
    
    const index = row * SIZE + col;
    return grid.children[index];
}

function handleCellMouseUp(e, cell) {
    // Função para compatibilidade, mas o controle principal é no evento global
}

function getNextState(mode, startState, currentState) {
    // Define as transições para cada modo
    const transitions = {
        [STATE_BLACK]: {
            [STATE_WHITE]: { [STATE_WHITE]: STATE_BLACK, [STATE_O]: STATE_BLACK },
            [STATE_BLACK]: { [STATE_BLACK]: STATE_WHITE },
            [STATE_X]: { [STATE_WHITE]: STATE_BLACK, [STATE_X]: STATE_BLACK, [STATE_O]: STATE_BLACK },
            [STATE_O]: { [STATE_WHITE]: STATE_BLACK, [STATE_O]: STATE_BLACK }
        },
        [STATE_X]: {
            [STATE_WHITE]: { [STATE_WHITE]: STATE_X, [STATE_O]: STATE_X },
            [STATE_BLACK]: { [STATE_WHITE]: STATE_X, [STATE_BLACK]: STATE_X },
            [STATE_X]: { [STATE_X]: STATE_WHITE },
            [STATE_O]: { [STATE_O]: STATE_X }
        },
        [STATE_O]: {
            [STATE_WHITE]: { [STATE_WHITE]: STATE_O },
            [STATE_BLACK]: { [STATE_WHITE]: STATE_O, [STATE_BLACK]: STATE_O },
            [STATE_X]: { [STATE_X]: STATE_O },
            [STATE_O]: { [STATE_O]: STATE_WHITE }
        }   
    };
    // Retorna o novo estado ou o atual se não houver transição
    return (transitions[mode]?.[startState]?.[currentState]) || currentState;
}

function applyCellChange(cell) {
    const cellId = `${cell.dataset.row}-${cell.dataset.col}`;
    // Verifica se esta célula já foi modificada neste arraste
    if (modifiedCells.has(cellId)) return;
    const currentState = cell.dataset.state;
    // Determina o novo estado baseado nas regras
    let newState = currentState;
    if (dragButton === 0) { // Botão esquerdo
        newState = getNextState(leftPaintMode, dragStartState, currentState);
    } else if (dragButton === 1) { // Botão meio
        newState = getNextState(STATE_O, dragStartState, currentState);
    } else if (dragButton === 2) { // Botão direito
        // Botão direito sempre segue a lógica original para X
        newState = getNextState(STATE_X, dragStartState, currentState);
    }
    // Aplica o novo estado se houve mudança
    if (newState !== currentState) {
        setCellState(cell, newState);
        modifiedCells.add(cellId);
        // Checa se resolveu após cada alteração
        if (checkPuzzleSolved()) {
            showSuccessMessage();
        }
    }
}

function setCellState(cell, state) {
    cell.dataset.state = state;
    cell.classList.remove('black', 'x', 'o');
    cell.textContent = '';
    if (state === STATE_BLACK) {
        cell.classList.add('black');
    } else if (state === STATE_X) {
        cell.classList.add('x');
        cell.textContent = '⨯';
    } else if (state === STATE_O) {
        cell.classList.add('o');
        cell.textContent = '●';
    }
}

// Função para definir o grid baseado numa matriz
function setGridFromMatrix(matrix) {
    if (matrix.length !== SIZE || matrix[0].length !== SIZE) {
        return;
    }
    
    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const cell = getCellAt(row, col);
            if (cell) {
                const newState = matrix[row][col] === 1 ? STATE_BLACK : STATE_WHITE;
                setCellState(cell, newState);
            }
        }
    }
}

// Função para limpar o grid (todas as células ficam brancas)
function clearGrid() {
    const emptyMatrix = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
    setGridFromMatrix(emptyMatrix);
}

// Função para mostrar a solução do puzzle atual
function showSolution() {
    if (!currentPuzzle) {
        return;
    }
    
    // Exibe diretamente a solução do puzzle
    if (currentPuzzle.solution) {
        setGridFromMatrix(currentPuzzle.solution);
    }
}

// Função para criar as pistas visuais
function createVisualClues() {
    if (!currentPuzzle) {
        return;
    }
    
    const colCluesContainer = document.getElementById('colClues');
    const rowCluesContainer = document.getElementById('rowClues');
    
    // Limpar containers
    colCluesContainer.innerHTML = '';
    rowCluesContainer.innerHTML = '';
    
    // Criar espaço vazio no canto superior esquerdo (cornerSpace)
    const cornerSpace = document.createElement('div');

    // Adicionar ao container, mas definir width/height depois
    colCluesContainer.appendChild(cornerSpace);
    
    // Obter as clues normais
    const colCluesForDisplay = currentPuzzle.colClues;
    const rowCluesForDisplay = currentPuzzle.rowClues;
    
    const colClueContainers = [];
    // Detect mega columns for 'mega' puzzles
    let megaCols = [];
    if (currentPuzzle.type === 'mega') {
        // Mega clues are usually marked by the string 'mega' or by clues with nested arrays
        for (let i = 0; i < colCluesForDisplay.length; i++) {
            const clues = colCluesForDisplay[i];
            if (clues && (clues.includes('mega') || clues.some(block => Array.isArray(block) && Array.isArray(block[0])))) {
                megaCols.push(i);
            }
        }
    }
    for (let index = 0; index < colCluesForDisplay.length; index++) {
        const clues = colCluesForDisplay[index];
        const colClueContainer = document.createElement('div');
        colClueContainer.className = 'col-clue-container';

        const isMegaCol = megaCols.includes(index);
        if (isMegaCol) {
            colClueContainer.style.width = '80px';
            index++;
        } else {
            colClueContainer.style.width = '40px';
        }

        clues.forEach(block => {
            const blockDiv = document.createElement('div');
            if (isMegaCol) {
                if (typeof block === 'number') {
                    blockDiv.classList.add('clue-number', 'mega-clue-number');
                    blockDiv.textContent = block;
                } else {
                    blockDiv.style.display = 'flex';
                    blockDiv.style.flexDirection = 'row';

                    block.forEach(line => {
                        const lineDiv = document.createElement('div');
                        lineDiv.style.display = 'flex';
                        lineDiv.style.flexDirection = 'column';
                        lineDiv.style.minWidth = '40px';
                        lineDiv.style.alignItems = 'center';

                        if (!(Array.isArray(line) && line.length === 1 && line[0] === 0)) {
                            line.forEach(clue => {
                                const clueDiv = document.createElement('div');
                                clueDiv.classList.add('clue-number');
                                clueDiv.textContent = clue;
                                lineDiv.appendChild(clueDiv);
                            });
                        }
                        blockDiv.appendChild(lineDiv);
                    });
                }
            } else {
                blockDiv.classList.add('clue-number');
                blockDiv.textContent = block;
            }
            colClueContainer.appendChild(blockDiv);
        });

        colCluesContainer.appendChild(colClueContainer);
        colClueContainers.push(colClueContainer);
    }

    let maxHeight = 0;
    colClueContainers.forEach(div => {
        const h = div.scrollHeight;
        if (h > maxHeight) maxHeight = h;
    });
    colClueContainers.forEach(div => {
        div.style.height = maxHeight + 'px';
    });
    
    // Criar pistas das linhas e armazenar os containers para ajuste posterior
    const rowClueContainers = [];
    // Detect mega rows for 'mega' puzzles
    let megaRows = [];
    if (currentPuzzle.type === 'mega') {
        for (let i = 0; i < rowCluesForDisplay.length; i++) {
            const clues = rowCluesForDisplay[i];
            if (clues && (clues.includes('mega') || clues.some(block => Array.isArray(block) && Array.isArray(block[0])))) {
                megaRows.push(i);
            }
        }
    }
    for (let index = 0; index < rowCluesForDisplay.length; index++) {
        const clues = rowCluesForDisplay[index];
        const rowClueContainer = document.createElement('div');
        rowClueContainer.className = 'row-clue-container';

        const isMegaRow = megaRows.includes(index);
        if (isMegaRow) {
            rowClueContainer.style.height = '80px';
            index++;
        } else {
            rowClueContainer.style.height = '40px';
        }

        clues.forEach(block => {
            const blockDiv = document.createElement('div');
            if (isMegaRow) {
                if (typeof block === 'number') {
                    blockDiv.classList.add('clue-number', 'mega-clue-number');
                    blockDiv.textContent = block;
                } else {
                    blockDiv.style.display = 'flex';
                    blockDiv.style.flexDirection = 'column';

                    block.forEach(line => {
                        const lineDiv = document.createElement('div');
                        lineDiv.style.display = 'flex';
                        lineDiv.style.flexDirection = 'row';
                        lineDiv.style.minHeight = '40px';
                        lineDiv.style.alignItems = 'center';

                        if (!(Array.isArray(line) && line.length === 1 && line[0] === 0)) {
                            line.forEach(clue => {
                                const clueDiv = document.createElement('div');
                                clueDiv.classList.add('clue-number');
                                clueDiv.textContent = clue;
                                lineDiv.appendChild(clueDiv);
                            });
                        }
                        blockDiv.appendChild(lineDiv);
                    });
                }
            } else {
                blockDiv.classList.add('clue-number');
                blockDiv.textContent = block;
            }
            rowClueContainer.appendChild(blockDiv);
        });

        rowCluesContainer.appendChild(rowClueContainer);
        rowClueContainers.push(rowClueContainer);
    }

    let maxWidth = 0;
    rowClueContainers.forEach(div => {
        const w = div.scrollWidth;
        if (w > maxWidth) maxWidth = w;
    });
    rowClueContainers.forEach(div => {
        div.style.width = maxWidth + 'px';
    });

    // Agora, definir o tamanho do cornerSpace para alinhar perfeitamente
    cornerSpace.style.width = maxWidth + 2 + 'px';
    cornerSpace.style.height = maxHeight + 'px';
}

// Funções da interface HTML
function loadSelectedPuzzle() {
    const select = document.getElementById('puzzleSelect');
    const puzzleId = select.value;
    
    if (puzzleId) {
        loadPuzzle(puzzleId);
    }
}

function updatePuzzleSelect() {
    const select = document.getElementById('puzzleSelect');
    const currentValue = select.value;
    // Limpar opções atuais
    select.innerHTML = '<option value="">Select a puzzle...</option>';
    // Adicionar puzzles do tipo atual
    Object.keys(puzzleBank)
        .filter(id => puzzleBank[id].type === currentGameType)
        .forEach(id => {
            const puzzle = puzzleBank[id];
            const option = document.createElement('option');
            option.value = id;
            option.textContent = puzzle.getDescription();
            select.appendChild(option);
        });
    // Restaurar seleção se ainda existir e for do tipo correto
    if (currentValue && puzzleBank[currentValue] && puzzleBank[currentValue].type === currentGameType) {
        select.value = currentValue;
    }
}

function updatePuzzleInfo() {
    const infoElement = document.getElementById('currentPuzzleInfo');
    if (currentPuzzle) {
        infoElement.textContent = `${currentPuzzle.getId()} - ${currentPuzzle.getDescription()}`;
    } else {
        infoElement.textContent = 'No puzzle loaded';
    }
}

// Função para mudar o tipo de jogo
function changeGameType() {
    const gameTypeSelect = document.getElementById('gameTypeSelect');
    currentGameType = gameTypeSelect.value;
    
    // Atualizar lista de puzzles baseada no tipo
    updatePuzzleSelect();
    
    // Limpar seleção atual
    const puzzleSelect = document.getElementById('puzzleSelect');
    puzzleSelect.value = '';
    
    // Limpar puzzle atual
    currentPuzzle = null;
    clearGrid();
    
    // Atualizar interface
    updatePuzzleInfo();
}

// Função para definir o modo de pintura
// Função para definir o modo de pintura e atualizar visual
function setPaintMode(mode) {
    if (mode === 'black') {
        leftPaintMode = STATE_BLACK;
    } else if (mode === 'x') {
        leftPaintMode = STATE_X;
    } else if (mode === 'o') {
        leftPaintMode = STATE_O;
    }
    updatePaintModeButtons();
}

// Inicializar quando a página carregar (apenas no browser)
if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', () => {
        // Configurar tipo padrão
        const gameTypeSelect = document.getElementById('gameTypeSelect');
        gameTypeSelect.value = currentGameType;
        // Atualizar lista de puzzles
        updatePuzzleSelect();
        // Carregar puzzle padrão
        loadPuzzle('classic_001');
        // Selecionar no dropdown   
        const select = document.getElementById('puzzleSelect');
        select.value = 'classic_001';
        // Disponibilizar funções de interface
        window.loadSelectedPuzzle = loadSelectedPuzzle;
        window.updatePuzzleSelect = updatePuzzleSelect;
        window.changeGameType = changeGameType;
        window.setPaintMode = setPaintMode;
        // Atualizar visual do botão selecionado
        updatePaintModeButtons();
    });
}

// Exports para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Puzzle,
        PuzzleId,
        PUZZLE_TYPES,
        STATE_WHITE,
        STATE_BLACK,
        STATE_X
    };
}
