import json
import os
from datetime import datetime

from tools.ConvertPuzzles import convert_puzzle
from tools.GetData import fetch_puzzle


def fetch_convert_and_commit(date: datetime):
    original_filename = fetch_puzzle(date)
    puzzle_name = original_filename.split("/")[-1]

    # Convert the puzzle
    converted_puzzle = convert_puzzle(original_filename)
    converted_filename = f"crossword_data/Converted/{puzzle_name}"
    with open(converted_filename, 'w') as f:
        json.dump(converted_puzzle, f, indent=4)

    # Commit and push the changes
    os.system(f"git add {original_filename}")
    os.system(f"git add {converted_filename}")
    os.system(f'git commit -m "Added puzzle for {date}"')
    # os.system("git push")


if __name__ == "__main__":
    # Fetch the puzzle of the day, convert it, place in the correct directory, and commit the changes to the repository and push

    # Fetch the puzzle
    date_today = datetime.now()
    fetch_convert_and_commit(date_today)
