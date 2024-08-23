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
    collapsedMonths: {}, // Add state to track collapsed status
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
    window.location.href = window.location.pathname + "?puzzleName=" + puzzle + "#/puzzle";
  }

  groupPuzzlesByMonth(puzzles) {
    const grouped = puzzles.reduce((acc, puzzle) => {
      const month = puzzle.slice(0, 7); // Extract "YYYY-MM"
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(puzzle);
      return acc;
    }, {});

    // Convert the grouped object to an array of [month, puzzles] pairs and sort by month in descending order
    return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a));
  }

  toggleMonthCollapse = (month) => {
    this.setState((prevState) => ({
      collapsedMonths: {
        ...prevState.collapsedMonths,
        [month]: !prevState.collapsedMonths[month],
      },
    }));
  };

  collapseAll = () => {
    const collapsedMonths = this.groupPuzzlesByMonth(this.state.puzzles)
      .reduce((acc, [month]) => {
        acc[month] = true;
        return acc;
      }, {});
    this.setState({ collapsedMonths });
  };

  expandAll = () => {
    this.setState({ collapsedMonths: {} });
  };

  render() {
    const groupedPuzzles = this.groupPuzzlesByMonth(this.state.puzzles.filter((puzzle) => puzzle !== "puzzles"));

    return (
      <Page>
        <h1>Homepage</h1>
        <div className={css.controls}>
          <button onClick={this.collapseAll}>Collapse all</button>
          <button onClick={this.expandAll}>Expand all</button>
        </div>
        {groupedPuzzles.map(([month, puzzles]) => (
          <div key={month} className={css.monthSection}>
            <h2 onClick={() => this.toggleMonthCollapse(month)} className={css.monthHeader}>
              {month} {this.state.collapsedMonths[month] ? "▼" : "▲"}
            </h2>
            {!this.state.collapsedMonths[month] && (
              <div className={css.grid}>
                {puzzles.map((puzzle) => (
                  <div key={puzzle} className={css.gridItem}>
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
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </Page>
    );
  }
}
