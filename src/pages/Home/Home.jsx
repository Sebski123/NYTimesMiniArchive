import React from "react";

import { Page } from "components/Page/Page";

import classNames from "classnames";
import css from "./Home.scss";

export class Home extends React.Component {
  state = {
    puzzles: [],
    startedPuzzles:
      JSON.parse(localStorage.getItem("startedPuzzles")) || [],
    finishedPuzzles:
      JSON.parse(localStorage.getItem("finishedPuzzles")) || [],
  };

  componentDidMount() {
    fetch("./puzzles/puzzles.json")
      .then((response) => response.json())
      .then((puzzles) => this.setState({ puzzles }));
  }

  handlePuzzleClick(puzzle) {
    this.setState((prevState) => {
      const startedPuzzles = [...prevState.startedPuzzles];
      if (!prevState.startedPuzzles.includes(puzzle)) {
        startedPuzzles.push(puzzle);
        localStorage.setItem(
          "startedPuzzles",
          JSON.stringify(startedPuzzles)
        );
      }
      return { startedPuzzles };
    });
    window.location.href = "/?puzzleName=" + puzzle + "#/puzzle";
  }

  render() {
    return (
      <Page>
        <h1>Homepage</h1>
        <ul>
          {this.state.puzzles.map((puzzle) => (
            <li key={puzzle} className={css.bulletLessList}>
              <p
                className={classNames(
                  css.puzzleLink,
                  this.state.finishedPuzzles.includes(puzzle)
                    ? css.finished
                    : this.state.startedPuzzles.includes(puzzle)
                    ? css.played
                    : ""
                )}
                onClick={() => this.handlePuzzleClick(puzzle)}
              >
                {puzzle}
              </p>
            </li>
          ))}
        </ul>
      </Page>
    );
  }
}
