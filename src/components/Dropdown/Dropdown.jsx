import classNames from "classnames";
import React from "react";

import { MenuButton } from "components/Buttons/MenuButton";

import css from "./Dropdown.scss";

export class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  toggleOpen = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    document.removeEventListener("click", this.closeDropdown);
    document.removeEventListener("touchstart", this.closeDropdown);

    this.setState(
      (prevState) => ({
        open: !prevState.open,
      }),
      () => {
        if (this.state.open) {
          document.addEventListener("click", this.closeDropdown);
          document.addEventListener("touchstart", this.closeDropdown);
        }
      },
    );
  };

  closeDropdown = () => {
    document.removeEventListener("click", this.closeDropdown);
    document.removeEventListener("touchstart", this.closeDropdown);
    this.setState({ open: false });
  };

  onClick = (optionKey) => (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    this.props.onClick(optionKey);
    this.closeDropdown();
  };

  render() {
    const buttonClasses = classNames({
      [css.button_open]: this.state.open,
    });

    const dropdownContentClasses = classNames(css.dropdownContent, {
      [css.dropdownContent_open]: this.state.open,
    });

    return (
      <div className={css.dropdownContainer}>
        <MenuButton className={buttonClasses} onClick={this.toggleOpen}>
          {this.props.title}
        </MenuButton>
        <ul className={dropdownContentClasses}>
          {this.props.options.map((option) => {
            const [optionKey, optionValue] = option;

            return (
              <li
                className={css.dropdownItem}
                key={optionKey}
                onClick={this.onClick(optionKey)}
                onTouchEnd={this.onClick(optionKey)}
              >
                {optionValue}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
