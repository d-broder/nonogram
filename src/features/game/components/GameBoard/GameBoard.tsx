import React, { useRef, useEffect } from "react";
import iconX from "../../../../assets/icon-x.png";
import iconO from "../../../../assets/icon-o.png";
import type {
  Puzzle,
  CellState,
  CellPosition,
  ClueElement,
} from "../../../../shared/types";
import {
  useGameBoardInteraction,
  useGameBoardState,
  useGameBoardZoom,
  useBoardControls,
} from "./hooks";
import styles from "./GameBoard.module.css";

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
    clueFontSize: number;
    clueRadius: number;
    playerIndicatorSize: number;
  };
  // Optional clue click handlers for multiplayer sync
  onRowClueClick?: (rowIndex: number, clueIndex: number | string) => void;
  onColClueClick?: (colIndex: number, clueIndex: number | string) => void;
  clickedRowClues?: Set<string>;
  clickedColClues?: Set<string>;
  // Mobile sticky toggle
  stickyClues?: boolean;
  // Multiplayer cell authorship
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

export function GameBoard({
  puzzle,
  grid,
  showSolution,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
  isComplete,
  zoomConfig,
  onRowClueClick,
  onColClueClick,
  clickedRowClues: externalClickedRowClues,
  clickedColClues: externalClickedColClues,
  stickyClues = true,
  cellAuthors = {},
  players = {},
  showPlayerIndicators = true,
}: GameBoardProps) {
  const colCluesRef = useRef<HTMLDivElement>(null);
  const rowCluesRef = useRef<HTMLDivElement>(null);

  // Use hooks for state and interactions
  const {
    clickedRowClues,
    clickedColClues,
    handleRowClueClick,
    handleColClueClick,
  } = useGameBoardState({
    externalClickedRowClues,
    externalClickedColClues,
    onRowClueClick,
    onColClueClick,
  });

  const {
    handleCellMouseDown,
    handleCellMouseEnter,
    handleCellTouchStart,
    handleCellTouchMove,
    handleCellTouchEnd,
    handleContextMenu,
  } = useGameBoardInteraction({
    isComplete,
    showSolution,
    onCellMouseDown,
    onCellMouseEnter,
    onCellMouseUp,
  });

  const { boardStyle } = useGameBoardZoom({
    zoomConfig,
    stickyClues,
  });

  const { handleGridTouchStart, handleGridTouchMove, handleGridTouchEnd } =
    useBoardControls();

  // Add global mouse up listener
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      onCellMouseUp();
    };

    const handleGlobalTouchEnd = () => {
      onCellMouseUp();
    };

    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.addEventListener("touchend", handleGlobalTouchEnd);
    document.addEventListener("touchcancel", handleGlobalTouchEnd);

    return () => {
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
      document.removeEventListener("touchcancel", handleGlobalTouchEnd);
    };
  }, [onCellMouseUp]);

  // Prevent page scroll on mobile during touch interactions within the grid only
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      // Check if the touch started specifically on the grid element
      const target = e.target as Element;
      if (target && target.closest("." + styles.grid)) {
        e.preventDefault();
      }
    };

    // Add passive: false to allow preventDefault
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

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

    return classes.join(" ");
  };

  const getCellContent = (row: number, col: number) => {
    if (showSolution) return null;

    const cellState = grid[row][col];
    const iconClass = isComplete
      ? `${styles.cellIcon} ${styles.fadeOut}`
      : styles.cellIcon;
    const cellId = `${row}-${col}`;
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

  const renderVisualClues = () => {
    const colClues = puzzle.colClues;
    const rowClues = puzzle.rowClues;

    // Detect super columns for super puzzles
    const superCols: number[] = [];
    if (puzzle.type === "super") {
      for (let i = 0; i < colClues.length; i++) {
        const clues = colClues[i];
        if (clues && clues.includes("super")) {
          superCols.push(i - 1);
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
          if (typeof block === "number") {
            const clueId = `col-${index}-${blockIndex}`;
            const isClicked = clickedColClues.has(clueId);
            clueElements.push(
              <div
                key={blockIndex}
                className={`${styles.clueNumber} ${styles.superClueNumber} ${
                  isClicked ? styles.clueNumberClicked : ""
                }`}
                onClick={(e) => handleColClueClick(e, index, blockIndex)}
              >
                {block}
              </div>
            );
          } else if (Array.isArray(block)) {
            // Handle nested array structure for super clues
            clueElements.push(
              <div
                key={blockIndex}
                style={{ display: "flex", flexDirection: "row" }}
              >
                {(block as number[][]).map(
                  (line: number[], lineIndex: number) => (
                    <div
                      key={lineIndex}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: `${zoomConfig.cellSize}px`,
                        alignItems: "center",
                        gap: "var(--clue-number-margin)",
                      }}
                    >
                      {!(
                        Array.isArray(line) &&
                        line.length === 1 &&
                        line[0] === 0
                      ) &&
                        line.map((clue: number, clueIndex: number) => {
                          const nestedClueId = `col-${index}-${blockIndex}-${lineIndex}-${clueIndex}`;
                          const isNestedClicked =
                            clickedColClues.has(nestedClueId);
                          return (
                            <div
                              key={clueIndex}
                              className={`${styles.clueNumber} ${
                                isNestedClicked ? styles.clueNumberClicked : ""
                              }`}
                              onClick={(e) =>
                                handleColClueClick(
                                  e,
                                  index,
                                  `${blockIndex}-${lineIndex}-${clueIndex}` as string
                                )
                              }
                            >
                              {clue}
                            </div>
                          );
                        })}
                    </div>
                  )
                )}
              </div>
            );
          }
        } else {
          const clueId = `col-${index}-${blockIndex}`;
          const isClicked = clickedColClues.has(clueId);
          clueElements.push(
            <div
              key={blockIndex}
              className={`${styles.clueNumber} ${
                isClicked ? styles.clueNumberClicked : ""
              }`}
              onClick={(e) => handleColClueClick(e, index, blockIndex)}
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
            width: isSuperCol
              ? `${zoomConfig.cellSize * 2}px`
              : `${zoomConfig.cellSize}px`,
          }}
        >
          {clueElements}
        </div>
      );
    }

    // Detect super rows for super puzzles
    const superRows: number[] = [];
    if (puzzle.type === "super") {
      for (let i = 0; i < rowClues.length; i++) {
        const clues = rowClues[i];
        if (clues && clues.includes("super")) {
          superRows.push(i - 1);
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
          if (typeof block === "number") {
            const clueId = `row-${index}-${blockIndex}`;
            const isClicked = clickedRowClues.has(clueId);
            clueElements.push(
              <div
                key={blockIndex}
                className={`${styles.clueNumber} ${styles.superClueNumber} ${
                  isClicked ? styles.clueNumberClicked : ""
                }`}
                onClick={(e) => handleRowClueClick(e, index, blockIndex)}
              >
                {block}
              </div>
            );
          } else if (Array.isArray(block)) {
            // Handle nested array structure for super clues
            clueElements.push(
              <div
                key={blockIndex}
                style={{ display: "flex", flexDirection: "column" }}
              >
                {(block as number[][]).map(
                  (line: number[], lineIndex: number) => (
                    <div
                      key={lineIndex}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        minHeight: `${zoomConfig.cellSize}px`,
                        alignItems: "center",
                      }}
                    >
                      {!(
                        Array.isArray(line) &&
                        line.length === 1 &&
                        line[0] === 0
                      ) &&
                        line.map((clue: number, clueIndex: number) => {
                          const nestedClueId = `row-${index}-${blockIndex}-${lineIndex}-${clueIndex}`;
                          const isNestedClicked =
                            clickedRowClues.has(nestedClueId);
                          return (
                            <div
                              key={clueIndex}
                              className={`${styles.clueNumber} ${
                                isNestedClicked ? styles.clueNumberClicked : ""
                              }`}
                              onClick={(e) =>
                                handleRowClueClick(
                                  e,
                                  index,
                                  `${blockIndex}-${lineIndex}-${clueIndex}` as string
                                )
                              }
                            >
                              {clue}
                            </div>
                          );
                        })}
                    </div>
                  )
                )}
              </div>
            );
          }
        } else {
          const clueId = `row-${index}-${blockIndex}`;
          const isClicked = clickedRowClues.has(clueId);
          clueElements.push(
            <div
              key={blockIndex}
              className={`${styles.clueNumber} ${
                isClicked ? styles.clueNumberClicked : ""
              }`}
              onClick={(e) => handleRowClueClick(e, index, blockIndex)}
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
            height: isSuperRow
              ? `${zoomConfig.cellSize * 2}px`
              : `${zoomConfig.cellSize}px`,
          }}
        >
          {clueElements}
        </div>
      );
    }

    return { colClueElements, rowClueElements };
  };

  const { colClueElements, rowClueElements } = renderVisualClues();

  return (
    <div className={styles.nonogramContainer} style={boardStyle}>
      {/* Corner space */}
      <div
        className={`${styles.cornerSpace} ${
          !stickyClues ? styles.noSticky : ""
        }`}
      ></div>

      {/* Column clues */}
      <div
        ref={colCluesRef}
        className={`${styles.colClues} ${isComplete ? styles.hidden : ""} ${
          !stickyClues ? styles.noSticky : ""
        }`}
      >
        {colClueElements}
      </div>

      {/* Row clues */}
      <div
        ref={rowCluesRef}
        className={`${styles.rowClues} ${isComplete ? styles.hidden : ""} ${
          !stickyClues ? styles.noSticky : ""
        }`}
      >
        {rowClueElements}
      </div>

      {/* Grid container */}
      <div
        className={styles.grid}
        onTouchStart={handleGridTouchStart}
        onTouchMove={handleGridTouchMove}
        onTouchEnd={handleGridTouchEnd}
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
              onTouchStart={(e) => handleCellTouchStart(e, rowIndex, colIndex)}
              onTouchMove={handleCellTouchMove}
              onTouchEnd={handleCellTouchEnd}
              onContextMenu={handleContextMenu}
              disabled={isComplete || showSolution}
              data-row={rowIndex}
              data-col={colIndex}
              type="button"
            >
              {getCellContent(rowIndex, colIndex)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
