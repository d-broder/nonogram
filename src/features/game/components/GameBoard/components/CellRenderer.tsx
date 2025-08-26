import type { CellState } from "../../../../../shared/types";
import iconX from "../../../../../assets/icon-x.png";
import iconO from "../../../../../assets/icon-o.png";
import styles from "../GameBoard.module.css";

interface CellRendererProps {
  grid: CellState[][];
  showSolution: boolean;
  solution: number[][];
  isComplete: boolean;
  cellSize: number;
  onCellMouseDown: (e: React.MouseEvent, row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
  // Multiplayer features
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

export function CellRenderer({
  grid,
  showSolution,
  solution,
  isComplete,
  cellSize,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  cellAuthors = {},
  players = {},
  showPlayerIndicators = true,
}: CellRendererProps) {
  const getCellContent = (row: number, col: number) => {
    const cellState = grid[row][col];
    const solutionValue = solution[row][col];

    if (showSolution) {
      return solutionValue === 1 ? "●" : "";
    }

    switch (cellState) {
      case "black":
        return "●";
      case "x":
        return <img src={iconX} alt="X" className={styles.cellIcon} />;
      case "o":
        return <img src={iconO} alt="O" className={styles.cellIcon} />;
      case "white":
      default:
        return "";
    }
  };

  const getCellClasses = (row: number, col: number) => {
    const cellState = grid[row][col];
    const solutionValue = solution[row][col];
    const classes = [styles.cell];

    if (showSolution) {
      classes.push(solutionValue === 1 ? styles.black : styles.white);
    } else {
      classes.push(styles[cellState] || styles.white);
    }

    if (isComplete) {
      classes.push(styles.complete);
    }

    return classes.join(" ");
  };

  const getCellAuthorIndicator = (row: number, col: number) => {
    if (!showPlayerIndicators) return null;

    const cellId = `${row}-${col}`;
    const authorId = cellAuthors[cellId];
    if (!authorId || !players[authorId]) return null;

    const author = players[authorId];
    return (
      <div
        className={styles.cellAuthor}
        style={{ backgroundColor: author.color }}
        title={`Painted by ${author.name}`}
      />
    );
  };

  return (
    <div
      className={styles.gameGrid}
      style={
        {
          "--cell-size": `${cellSize}px`,
        } as React.CSSProperties
      }
      onMouseUp={onCellMouseUp}
    >
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.gridRow}>
          {row.map((_, colIndex) => (
            <div
              key={colIndex}
              className={getCellClasses(rowIndex, colIndex)}
              onMouseDown={(e) => onCellMouseDown(e, rowIndex, colIndex)}
              onMouseEnter={() => onCellMouseEnter(rowIndex, colIndex)}
              onContextMenu={(e) => e.preventDefault()}
            >
              {getCellContent(rowIndex, colIndex)}
              {getCellAuthorIndicator(rowIndex, colIndex)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
