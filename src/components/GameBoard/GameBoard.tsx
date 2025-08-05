import { useCallback, useEffect, useRef, useState } from 'react';
import type { Puzzle, CellState, CellPosition, ClueElement } from '../../types';
import iconX from '../../assets/icon-x.png';
import iconO from '../../assets/icon-o.png';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  puzzle: Puzzle;
  grid: CellState[][];
  showSolution: boolean;
  onCellMouseDown: (position: CellPosition, button: number) => void;
  onCellMouseEnter: (position: CellPosition) => void;
  onCellMouseUp: () => void;
  isComplete: boolean;
  zoomConfig: {
    cellSize: number;
    clueWidth: number;
    clueHeight: number;
    clueGap: number;
    superClueWidth: number;
    superClueHeight: number;
  };
}

export function GameBoard({ 
  puzzle, 
  grid, 
  showSolution, 
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  isComplete,
  zoomConfig
}: GameBoardProps) {
  const colCluesRef = useRef<HTMLDivElement>(null);
  const rowCluesRef = useRef<HTMLDivElement>(null);
  
  // State to track which clues are clicked/highlighted
  const [clickedRowClues, setClickedRowClues] = useState<Set<string>>(new Set());
  const [clickedColClues, setClickedColClues] = useState<Set<string>>(new Set());

  // Handle clue clicking
  const handleRowClueClick = useCallback((rowIndex: number, clueIndex: number) => {
    const clueId = `row-${rowIndex}-${clueIndex}`;
    setClickedRowClues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clueId)) {
        newSet.delete(clueId);
      } else {
        newSet.add(clueId);
      }
      return newSet;
    });
  }, []);

  const handleColClueClick = useCallback((colIndex: number, clueIndex: number) => {
    const clueId = `col-${colIndex}-${clueIndex}`;
    setClickedColClues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(clueId)) {
        newSet.delete(clueId);
      } else {
        newSet.add(clueId);
      }
      return newSet;
    });
  }, []);

  const handleCellMouseDown = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (isComplete || showSolution) return;
    onCellMouseDown({ row, col }, e.button);
  }, [onCellMouseDown, isComplete, showSolution]);

  const handleCellMouseEnter = useCallback((row: number, col: number) => {
    if (isComplete || showSolution) return;
    onCellMouseEnter({ row, col });
  }, [onCellMouseEnter, isComplete, showSolution]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent right-click menu
  }, []);

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      onCellMouseUp();
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [onCellMouseUp]);

  // Calculate proper cornerSpace dimensions after render
  useEffect(() => {
    if (colCluesRef.current && rowCluesRef.current) {
      const cornerSpace = colCluesRef.current.querySelector(`.${styles.cornerSpace}`) as HTMLElement;
      if (cornerSpace) {
        const rowClueContainers = rowCluesRef.current.querySelectorAll(`.${styles.rowClueContainer}`);
        const colClueContainers = colCluesRef.current.querySelectorAll(`.${styles.colClueContainer}`);
        
        let maxRowWidth = 0;
        rowClueContainers.forEach(container => {
          const width = (container as HTMLElement).scrollWidth;
          if (width > maxRowWidth) maxRowWidth = width;
        });
        
        let maxColHeight = 0;
        colClueContainers.forEach(container => {
          const height = (container as HTMLElement).scrollHeight;
          if (height > maxColHeight) maxColHeight = height;
        });
        
        // Set cornerSpace dimensions to match reference project logic
        cornerSpace.style.width = `${maxRowWidth + 2}px`;
        cornerSpace.style.height = `${maxColHeight}px`;
        
        // Ensure all column containers have the same height
        colClueContainers.forEach(container => {
          (container as HTMLElement).style.height = `${maxColHeight}px`;
        });
        
        // Ensure all row containers have the same width
        rowClueContainers.forEach(container => {
          (container as HTMLElement).style.width = `${maxRowWidth}px`;
        });
      }
    }
  }, [puzzle]);

  const getCellClass = (row: number, col: number) => {
    const classes = [styles.cell];
    
    // Add thick borders for multiples of 5 (from reference)
    if ((col + 1) % 5 === 0 && col + 1 < puzzle.size.width) {
      classes.push(styles.thickRight);
    }
    if (col % 5 === 0 && col > 0) {
      classes.push(styles.thickLeft);
    }
    if ((row + 1) % 5 === 0 && row + 1 < puzzle.size.height) {
      classes.push(styles.thickBottom);
    }
    if (row % 5 === 0 && row > 0) {
      classes.push(styles.thickTop);
    }
    
    if (showSolution) {
      // Show solution
      if (puzzle.solution[row][col] === 1) {
        classes.push(styles.solutionFilled);
      }
    } else {
      // Show current state
      const cellState = grid[row][col];
      classes.push(styles[cellState]);
    }

    return classes.join(' ');
  };

  const getCellContent = (row: number, col: number) => {
    if (showSolution) return null;
    
    const cellState = grid[row][col];
    switch (cellState) {
      case 'x':
        return <img src={iconX} alt="X mark" className={styles.cellIcon} />;
      case 'o':
        return <img src={iconO} alt="O mark" className={styles.cellIcon} />;
      default:
        return null;
    }
  };

  const renderVisualClues = () => {
    const colClues = puzzle.colClues;
    const rowClues = puzzle.rowClues;

    // Detect super columns for super puzzles
    const superCols: number[] = [];
    if (puzzle.type === 'super') {
      for (let i = 0; i < colClues.length; i++) {
        const clues = colClues[i];
        if (clues && (clues.includes('super') || clues.some(block => Array.isArray(block) && Array.isArray(block[0])))) {
          superCols.push(i);
        }
      }
    }

    // Render column clues with proper super handling
    const colClueElements: React.ReactElement[] = [];
    for (let index = 0; index < colClues.length; index++) {
      const clues = colClues[index];
      const isSuperCol = superCols.includes(index);

      if (isSuperCol) {
        // Skip next index for super columns (they take double space)
        index++;
      }

      const clueElements: React.ReactElement[] = [];
      clues.forEach((block: ClueElement, blockIndex: number) => {
        if (isSuperCol) {
          if (typeof block === 'number') {
            clueElements.push(
              <div key={blockIndex} className={`${styles.clueNumber} ${styles.superClueNumber}`}>
                {block}
              </div>
            );
          } else if (Array.isArray(block)) {
            // Handle nested array structure for super clues
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
                    ))}
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
              className={`${styles.clueNumber} ${isClicked ? styles.clueNumberClicked : ''}`}
              onClick={() => handleColClueClick(index, blockIndex)}
            >
              {block}
            </div>
          );
        }
      });

      colClueElements.push(
        <div
          key={index}
          className={styles.colClueContainer}
          style={{ 
            width: isSuperCol ? `${zoomConfig.cellSize * 2}px` : `${zoomConfig.cellSize}px`
          }}
          onClick={isSuperCol ? () => handleColClueClick(index, 0) : undefined}
        >
          {clueElements}
        </div>
      );
    }

    // Detect super rows for super puzzles
    const superRows: number[] = [];
    if (puzzle.type === 'super') {
      for (let i = 0; i < rowClues.length; i++) {
        const clues = rowClues[i];
        if (clues && (clues.includes('super') || clues.some(block => Array.isArray(block) && Array.isArray(block[0])))) {
          superRows.push(i);
        }
      }
    }

    // Render row clues with proper super handling
    const rowClueElements: React.ReactElement[] = [];
    for (let index = 0; index < rowClues.length; index++) {
      const clues = rowClues[index];
      const isSuperRow = superRows.includes(index);

      if (isSuperRow) {
        // Skip next index for super rows (they take double space)
        index++;
      }

      const clueElements: React.ReactElement[] = [];
      clues.forEach((block: ClueElement, blockIndex: number) => {
        if (isSuperRow) {
          if (typeof block === 'number') {
            clueElements.push(
              <div key={blockIndex} className={`${styles.clueNumber} ${styles.superClueNumber}`}>
                {block}
              </div>
            );
          } else if (Array.isArray(block)) {
            // Handle nested array structure for super clues
            clueElements.push(
              <div key={blockIndex} style={{ display: 'flex', flexDirection: 'column' }}>
                {(block as number[][]).map((line: number[], lineIndex: number) => (
                  <div key={lineIndex} style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    minHeight: `${zoomConfig.cellSize}px`, 
                    alignItems: 'center' 
                  }}>
                    {!(Array.isArray(line) && line.length === 1 && line[0] === 0) && 
                     line.map((clue: number, clueIndex: number) => (
                      <div key={clueIndex} className={styles.clueNumber}>
                        {clue}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            );
          }
        } else {
          const clueId = `row-${index}-${blockIndex}`;
          const isClicked = clickedRowClues.has(clueId);
          clueElements.push(
            <div 
              key={blockIndex} 
              className={`${styles.clueNumber} ${isClicked ? styles.clueNumberClicked : ''}`}
              onClick={() => handleRowClueClick(index, blockIndex)}
            >
              {block}
            </div>
          );
        }
      });

      rowClueElements.push(
        <div
          key={index}
          className={styles.rowClueContainer}
          style={{ 
            height: isSuperRow ? `${zoomConfig.cellSize * 2}px` : `${zoomConfig.cellSize}px`
          }}
          onClick={isSuperRow ? () => handleRowClueClick(index, 0) : undefined}
        >
          {clueElements}
        </div>
      );
    }

    return { colClueElements, rowClueElements };
  };

  const { colClueElements, rowClueElements } = renderVisualClues();

  return (
    <div 
      className={styles.nonogramContainer}
      style={{
        '--cell-size': `${zoomConfig.cellSize}px`,
        '--clue-width': `${zoomConfig.clueWidth}px`,
        '--clue-height': `${zoomConfig.clueHeight}px`,
        '--clue-gap': `${zoomConfig.clueGap}px`,
        '--super-clue-width': `${zoomConfig.superClueWidth}px`,
        '--super-clue-height': `${zoomConfig.superClueHeight}px`,
        '--icon-size': `${Math.round(zoomConfig.cellSize * 0.6)}px`
      } as React.CSSProperties}
    >
      {/* Column clues */}
      <div ref={colCluesRef} className={styles.colClues}>
        <div className={styles.cornerSpace}></div>
        {colClueElements}
      </div>

      {/* Game area with row clues and grid */}
      <div className={styles.gameArea}>
        <div ref={rowCluesRef} className={styles.rowClues}>
          {rowClueElements}
        </div>

        <div 
          className={styles.grid}
          style={{
            gridTemplateColumns: `repeat(${puzzle.size.width}, ${zoomConfig.cellSize}px)`,
            gridTemplateRows: `repeat(${puzzle.size.height}, ${zoomConfig.cellSize}px)`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((_, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={getCellClass(rowIndex, colIndex)}
                onMouseDown={(e) => handleCellMouseDown(e, rowIndex, colIndex)}
                onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                onContextMenu={handleContextMenu}
                disabled={isComplete || showSolution}
                type="button"
              >
                {getCellContent(rowIndex, colIndex)}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
