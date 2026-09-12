import classNames from "classnames";
import React from "react";
import { connect } from "react-redux";

import { ActiveClue } from "components/ActiveClue/ActiveClue";
import { ClueList } from "components/ClueList/ClueList";
import { Grid } from "components/Grid/Grid";
import { Header } from "components/Header/Header";
import { Keyboard } from "components/Keyboard/Keyboard";
import { Modal } from "components/Modal/Modal";
import { Toolbar } from "components/Toolbar/Toolbar";

import { across, down } from "constants/clue";
import {
  CODE_ARROW_DOWN,
  CODE_ARROW_LEFT,
  CODE_BACKSPACE,
  CODE_DELETE,
  CODE_ENTER,
  CODE_LETTER_A,
  CODE_LETTER_Z,
  CODE_TAB,
} from "constants/keys";
import { closeModal, openModal } from "reducers/modal";
import {
  fetchPuzzle,
  guessCell,
  moveActiveCell,
  moveActiveClue,
  removeGuess,
  startTimer,
  stopTimer,
} from "reducers/puzzle";
import { STATUS_404 } from "utils/fetcher";

import css from "./Puzzle.scss";

const isMobileOrTablet = () => {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 1024 || "ontouchstart" in window;
};

class Puzzle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interval: null,
      showKeyboard: isMobileOrTablet(),
    };
  }

  componentWillMount() {
    this.props.fetchPuzzle();
    this.props.openModal("start");
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.solved && !this.props.solved) {
      this.pausePuzzle();
      this.props.openModal("done");
    } else if (nextProps.filled && !this.props.filled) {
      this.pausePuzzle();
      this.props.openModal("incorrect");
    }
  }

  openPauseModal = () => {
    this.pausePuzzle();
    this.props.openModal("pause");
  };

  pausePuzzle = () => {
    this.props.stopTimer();
  };

  startPuzzle = () => {
    this.props.startTimer();
    this.props.closeModal();
  };

  finishPuzzle = () => {
    this.props.closeModal();
  };

  resetPuzzle = () => {
    this.props.startTimer();
  };

  toggleKeyboard = () => {
    this.setState((prevState) => ({
      showKeyboard: !prevState.showKeyboard,
    }));
  };

  showKeyboard = () => {
    if (!this.state.showKeyboard) {
      this.setState({ showKeyboard: true });
    }
  };

  handleKeyboardKeyPress = (key) => {
    if (this.props.activeModal) {
      return;
    }
    this.props.guessCell(key);
  };

  handleKeyboardBackspace = () => {
    if (this.props.activeModal) {
      return;
    }
    this.props.removeGuess();
  };

  handleKeyboardPrevClue = () => {
    if (this.props.activeModal) {
      return;
    }
    this.props.moveActiveClue(false);
  };

  handleKeyboardNextClue = () => {
    if (this.props.activeModal) {
      return;
    }
    this.props.moveActiveClue(true);
  };

  handleKeyDown = (evt) => {
    if (evt.ctrlKey || evt.altKey || evt.metaKey) {
      return;
    }

    const { keyCode } = evt;

    if (this.props.activeModal) {
      return;
    }

    if (keyCode >= CODE_ARROW_LEFT && keyCode <= CODE_ARROW_DOWN) {
      evt.preventDefault();
      this.props.moveActiveCell(evt.keyCode);
    } else if (keyCode === CODE_TAB || keyCode === CODE_ENTER) {
      evt.preventDefault();

      if (evt.shiftKey) {
        this.props.moveActiveClue(false);
      } else {
        this.props.moveActiveClue(true);
      }
    } else if (keyCode >= CODE_LETTER_A && keyCode <= CODE_LETTER_Z) {
      this.props.guessCell(evt.key);
    } else if (keyCode === CODE_BACKSPACE || keyCode === CODE_DELETE) {
      evt.preventDefault();
      this.props.removeGuess();
    }
  };

  render() {
    const { puzzleIs404, puzzleIsLoading } = this.props;
    if (puzzleIsLoading) {
      return <div>loading...</div>;
    }

    if (puzzleIs404) {
      return <div>not found...</div>;
    }

    // const { puzzleName } = this.props.match.params;
    let params = new URLSearchParams(window.location.search);
    let puzzleName = params.get("puzzleName");

    const puzzleContainerClasses = classNames(css.puzzleContainer, {
      [css.hasKeyboard]: this.state.showKeyboard,
    });

    return (
      <div className={css.app}>
        <div className={puzzleContainerClasses}>
          <Header puzzleName={puzzleName} />
          <div className={css.gameContainer}>
            <Toolbar
              puzzleName={puzzleName}
              openPauseModal={this.openPauseModal}
              resetPuzzle={this.resetPuzzle}
              toggleKeyboard={this.toggleKeyboard}
              showKeyboard={this.state.showKeyboard}
            />
            <div className={css.playArea}>
              <div
                className={css.gridContainer}
                onClick={this.showKeyboard}
              >
                <ActiveClue puzzleName={puzzleName} />
                <Grid puzzleName={puzzleName} />
              </div>
              <div className={css.cluesContainer}>
                <ClueList direction={across} puzzleName={puzzleName} />
                <ClueList direction={down} puzzleName={puzzleName} />
              </div>
            </div>
            {this.state.showKeyboard && (
              <Keyboard
                onKeyPress={this.handleKeyboardKeyPress}
                onBackspace={this.handleKeyboardBackspace}
                onPrevClue={this.handleKeyboardPrevClue}
                onNextClue={this.handleKeyboardNextClue}
              />
            )}
          </div>
        </div>
        <Modal
          type="start"
          activeModal={this.props.activeModal}
          style="absolute"
          closeModal={this.startPuzzle}
        />
        <Modal
          type="pause"
          activeModal={this.props.activeModal}
          closeModal={this.startPuzzle}
          overlayClick
        />
        <Modal
          type="done"
          activeModal={this.props.activeModal}
          closeModal={this.finishPuzzle}
          puzzleName={puzzleName}
          overlayClick
        />
        <Modal
          type="incorrect"
          activeModal={this.props.activeModal}
          closeModal={this.startPuzzle}
          overlayClick
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let params = new URLSearchParams(window.location.search);
  let puzzleName = params.get("puzzleName");
  const puzzle = state.puzzle[puzzleName];
  const puzzleIsLoading = !puzzle;
  const puzzleIs404 = puzzle === STATUS_404;
  return {
    puzzleIs404,
    puzzleIsLoading,
    solved: puzzle && puzzle.solved,
    filled: puzzle && puzzle.availableCells === puzzle.filledCells,
    activeModal: state.modal.activeModal,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchPuzzle: (puzzleName) => () => dispatch(fetchPuzzle(puzzleName)),
  guessCell: (puzzleName) => (guess) =>
    dispatch(guessCell(puzzleName, guess)),
  moveActiveCell: (puzzleName) => (move) =>
    dispatch(moveActiveCell(puzzleName, move)),
  moveActiveClue: (puzzleName) => (move) =>
    dispatch(moveActiveClue(puzzleName, move)),
  removeGuess: (puzzleName) => () => dispatch(removeGuess(puzzleName)),
  openModal: (modalName) => dispatch(openModal(modalName)),
  closeModal: () => dispatch(closeModal()),
  startTimer: (puzzleName) => () => dispatch(startTimer(puzzleName)),
  stopTimer: (puzzleName) => () => dispatch(stopTimer(puzzleName)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  let params = new URLSearchParams(window.location.search);
  let puzzleName = params.get("puzzleName");
  // const { puzzleName } = ownProps.match.params;
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    guessCell: dispatchProps.guessCell(puzzleName),
    fetchPuzzle: dispatchProps.fetchPuzzle(puzzleName),
    moveActiveCell: dispatchProps.moveActiveCell(puzzleName),
    moveActiveClue: dispatchProps.moveActiveClue(puzzleName),
    removeGuess: dispatchProps.removeGuess(puzzleName),
    startTimer: dispatchProps.startTimer(puzzleName),
    stopTimer: dispatchProps.stopTimer(puzzleName),
  };
};

const connectedPuzzle = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Puzzle);

export { connectedPuzzle as Puzzle };
