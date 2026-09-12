import classNames from "classnames";
import React from "react";
import css from "./Keyboard.scss";

const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];

const BackspaceIcon = () => (
  <svg
    width="22"
    height="18"
    viewBox="0 0 24 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: "block", margin: "auto" }}
  >
    <path d="M21 2H8L1 10L8 18H21C22.1 18 23 17.1 23 16V4C23 2.9 22.1 2 21 2Z" />
    <line x1="18" y1="7" x2="12" y2="13" />
    <line x1="12" y1="7" x2="18" y2="13" />
  </svg>
);

export class Keyboard extends React.Component {
  lastTouchTime = 0;

  handleTouchStart = (key, e) => {
    if (e) {
      e.preventDefault();
    }
    this.lastTouchTime = Date.now();
    this.processKey(key);
  };

  handleMouseDown = (key, e) => {
    if (e) {
      e.preventDefault();
    }
    if (this.lastTouchTime && Date.now() - this.lastTouchTime < 400) {
      return;
    }
    this.processKey(key);
  };

  processKey = (key) => {
    const { onKeyPress, onBackspace, onPrevClue, onNextClue } = this.props;

    if (key === "BACKSPACE") {
      if (onBackspace) onBackspace();
    } else if (key === "PREV_CLUE") {
      if (onPrevClue) onPrevClue();
    } else if (key === "NEXT_CLUE") {
      if (onNextClue) onNextClue();
    } else {
      if (onKeyPress) onKeyPress(key);
    }
  };

  renderKey = (key, displayLabel, extraClass) => {
    const keyClasses = classNames(css.key, extraClass);
    return (
      <button
        key={key}
        className={keyClasses}
        type="button"
        onMouseDown={(e) => this.handleMouseDown(key, e)}
        onTouchStart={(e) => this.handleTouchStart(key, e)}
        onClick={(e) => e.preventDefault()}
      >
        {displayLabel || key}
      </button>
    );
  };

  render() {
    if (this.props.hidden) {
      return null;
    }

    return (
      <div className={css.keyboardContainer}>
        <div className={css.keyboardRow}>
          {ROW_1.map((key) => this.renderKey(key))}
        </div>
        <div className={css.keyboardRow}>
          {ROW_2.map((key) => this.renderKey(key))}
        </div>
        <div className={css.keyboardRow}>
          {this.renderKey("PREV_CLUE", "‹", css.actionKey)}
          {ROW_3.map((key) => this.renderKey(key))}
          {this.renderKey(
            "BACKSPACE",
            <BackspaceIcon />,
            css.backspaceKey,
          )}
          {this.renderKey("NEXT_CLUE", "›", css.actionKey)}
        </div>
      </div>
    );
  }
}
