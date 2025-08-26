import type { ClueElement } from "../../../../../shared/types";
import styles from "../GameBoard.module.css";

interface ClueRendererProps {
  clues: ClueElement[][];
  orientation: "row" | "col";
  clickedClues: Set<string>;
  onClueClick: (
    e: React.MouseEvent,
    index: number,
    clueIndex: number | string
  ) => void;
  zoomConfig: {
    clueWidth: number;
    clueHeight: number;
    clueGap: number;
    superClueWidth: number;
    superClueHeight: number;
    clueFontSize: number;
  };
  stickyClues?: boolean;
}

export function ClueRenderer({
  clues,
  orientation,
  clickedClues,
  onClueClick,
  zoomConfig,
  stickyClues = true,
}: ClueRendererProps) {
  const isRow = orientation === "row";
  const clueStyle = {
    "--clue-width": `${zoomConfig.clueWidth}px`,
    "--clue-height": `${zoomConfig.clueHeight}px`,
    "--clue-gap": `${zoomConfig.clueGap}px`,
    "--super-clue-width": `${zoomConfig.superClueWidth}px`,
    "--super-clue-height": `${zoomConfig.superClueHeight}px`,
    "--clue-font-size": `${zoomConfig.clueFontSize}px`,
  } as React.CSSProperties;

  return (
    <div
      className={`${isRow ? styles.rowClues : styles.colClues} ${
        stickyClues ? styles.stickyClues : ""
      }`}
      style={clueStyle}
    >
      {clues.map((clueRow, index) => (
        <div key={index} className={isRow ? styles.rowClue : styles.colClue}>
          {clueRow.map((clue, clueIndex) => {
            const clueId = `${orientation}-${index}-${clueIndex}`;
            const isClicked = clickedClues.has(clueId);

            return (
              <span
                key={clueIndex}
                className={`${styles.clueNumber} ${
                  isClicked ? styles.clickedClue : ""
                }`}
                onClick={(e) => onClueClick(e, index, clueIndex)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {typeof clue === "number"
                  ? clue
                  : typeof clue === "string"
                  ? clue
                  : JSON.stringify(clue)}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
