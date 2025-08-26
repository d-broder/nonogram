import React from "react";
import type { CellState, Puzzle } from "../../../../../shared/types";
import { getCellClass, getCellId } from "../utils/cellCalculations";
import iconX from "../../../../../assets/icon-x.png";
import iconO from "../../../../../assets/icon-o.png";

interface GridContainerProps {
  puzzle: Puzzle;
  grid: CellState[][];
  showSolution: boolean;
  isComplete: boolean;
  styles: Record<string, string>;
  // Event handlers
  onCellMouseDown: (e: React.MouseEvent, row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellTouchStart: (e: React.TouchEvent, row: number, col: number) => void;
  onCellTouchMove: (e: React.TouchEvent) => void;
  onCellTouchEnd: (e: React.TouchEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  // Grid touch handlers
  onGridTouchStart: (e: React.TouchEvent) => void;
  onGridTouchMove: (e: React.TouchEvent) => void;
  onGridTouchEnd: (e: React.TouchEvent) => void;
  // Multiplayer props
  cellAuthors?: { [cellId: string]: string };
  players?: {
    [playerId: string]: {
      id: string;
      name: string;
      color: string;
      isCreator: boolean;
    };
  };
  showPlayerIndicators?: boolean;
}

/**
 * Componente que renderiza o grid principal de células do nonogram
 * Separado do GameBoard para melhor organização e performance
 */
export function GridContainer({
  puzzle,
  grid,
  showSolution,
  isComplete,
  styles,
  onCellMouseDown,
  onCellMouseEnter,
  onCellTouchStart,
  onCellTouchMove,
  onCellTouchEnd,
  onContextMenu,
  onGridTouchStart,
  onGridTouchMove,
  onGridTouchEnd,
  cellAuthors = {},
  players = {},
  showPlayerIndicators = true,
}: GridContainerProps) {
  const getCellContent = (row: number, col: number) => {
    if (showSolution) return null;

    const cellState = grid[row][col];
    const iconClass = isComplete
      ? `${styles.cellIcon} ${styles.fadeOut}`
      : styles.cellIcon;
    const cellId = getCellId(row, col);
    const authorId = cellAuthors[cellId];
    const author = authorId ? players[authorId] : null;

    return (
      <>
        {/* Main cell content (X or O icons) */}
        {cellState === "x" && (
          <img src={iconX} alt="X mark" className={iconClass} />
        )}
        {cellState === "o" && (
          <img src={iconO} alt="O mark" className={iconClass} />
        )}

        {/* Player indicator for multiplayer mode */}
        {author &&
          cellState !== "white" &&
          !isComplete &&
          showPlayerIndicators && (
            <div
              className={styles.playerIndicator}
              style={{ backgroundColor: author.color }}
              title={`Filled by ${author.name}`}
            />
          )}
      </>
    );
  };

  return (
    <div
      className={styles.grid}
      onTouchStart={onGridTouchStart}
      onTouchMove={onGridTouchMove}
      onTouchEnd={onGridTouchEnd}
      style={{
        gridTemplateColumns: `repeat(${puzzle.size.width}, var(--cell-size))`,
        gridTemplateRows: `repeat(${puzzle.size.height}, var(--cell-size))`,
      }}
    >
      {Array.from({ length: puzzle.size.height }, (_, row) =>
        Array.from({ length: puzzle.size.width }, (_, col) => (
          <button
            key={`${row}-${col}`}
            className={getCellClass(
              row,
              col,
              puzzle,
              grid,
              showSolution,
              styles
            )}
            data-row={row}
            data-col={col}
            onMouseDown={(e) => onCellMouseDown(e, row, col)}
            onMouseEnter={() => onCellMouseEnter(row, col)}
            onTouchStart={(e) => onCellTouchStart(e, row, col)}
            onTouchMove={onCellTouchMove}
            onTouchEnd={onCellTouchEnd}
            onContextMenu={onContextMenu}
            aria-label={`Cell ${row + 1}, ${col + 1}`}
            disabled={showSolution}
          >
            {getCellContent(row, col)}
          </button>
        ))
      )}
    </div>
  );
}
