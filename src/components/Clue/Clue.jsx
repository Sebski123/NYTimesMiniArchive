import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { clueClick } from 'reducers/puzzle';
import { clueRange } from 'utils/puzzle';

import css from './Clue.scss';


class Clue extends React.Component {
  render() {
    const {isActiveClue, isActiveDirection, isFilled, clue, obscured} = this.props;

    const clueClasses = classNames(css.clue, {
      [css.clue_active]: isActiveClue && isActiveDirection,
      [css.clue_selected]: isActiveClue && !isActiveDirection,
      [css.clue_filled]: isFilled,
    });

    const clueValueClasses =classNames(css.clueValue, {
      [css.clueValue_obscured]: obscured,
    });

    return (
      <li className={clueClasses} onClick={this.props.clueClick} ref={this.props.clueRef}>
        <span className={css.clueNumber}>{clue ? clue.clueNumber:0}</span>
        <span className={clueValueClasses}>{clue ? clue.value:''}</span>
      </li>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {activeCellNumber, activeDirection, cells, clues, width} = state.puzzle[ownProps.puzzleName] || {};
  const {clueNumber, direction} = ownProps;
  if (state.modal.activeModal === 'start') {
    return {
      clue: clues[direction][clueNumber],
      obscured: true,
    }
  }
  const activeCell = cells[activeCellNumber];
  const activeClueNumber = activeCell.cellClues[direction];
  const clue = clues[direction][clueNumber];
  return {
    isActiveClue: activeClueNumber === clueNumber,
    isActiveDirection: activeDirection === direction,
    isFilled: clueRange(clue, direction, width).every(cellNumber => cells[cellNumber].guess),
    clue: clues[direction][clueNumber],
    obscured: state.modal.activeModal === 'start',
  }
};

const mapDispatchToProps = dispatch => {
  return {
    clueClick: (puzzleName, direction, clueNumber) => () => dispatch(clueClick(puzzleName, direction, clueNumber)),
  }
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    clueClick: dispatchProps.clueClick(ownProps.puzzleName, ownProps.direction, ownProps.clueNumber),
  }
};

const connectedClue = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Clue);

export {
  connectedClue as Clue
};

