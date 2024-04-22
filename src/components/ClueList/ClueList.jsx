import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { Clue } from 'components/Clue/Clue';


import css from './ClueList.scss';


class ClueList extends React.Component {
  constructor(props) {
    super(props);
    this.clues = {};
  }

  componentDidUpdate() {
    if (this.list) {
      this.list.scrollTop = this.clues[this.props.activeClueNumber].offsetTop - this.list.offsetTop;
    }
  }

  render() {
    const {direction, clues, puzzleName} = this.props;

    return (
      <div className={css.clueListContainer}>
        <div className={css.directionName}>
          {direction}
        </div>
        <ol className={css.clueList} ref={list => { this.list = list}}>
          {_.map(clues, (clue, clueNumberString) => {
            const clueNumber = Number(clueNumberString);
            return (
              <Clue
                key={clueNumber}
                puzzleName={puzzleName}
                clueNumber={clueNumber}
                direction={direction}
                clueRef={clue => {this.clues[clueNumber] = clue}}
              />
            )
          })}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let {clues, activeCellNumber, cells} = state.puzzle[ownProps.puzzleName] || {};
  let {direction} = ownProps;
  if (state.modal.activeModal === 'start') {
    return {
      clues: clues[direction]
    };
  }

  let activeCell = cells[activeCellNumber];
  while (!activeCell.open) {
    activeCellNumber += 1;
    activeCell = cells[activeCellNumber];
  }
  if (!activeCell.cellClues[direction]) {
    direction = activeCell.cellClues.across ? 'across' : 'down';
  }
  return {
    activeClueNumber: clues[direction][activeCell.cellClues[direction]].clueNumber,
    clues: clues[direction],
  }
};

const connectedClueList = connect(mapStateToProps)(ClueList);

export {
  connectedClueList as ClueList
};

