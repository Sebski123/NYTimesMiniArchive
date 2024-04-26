#!/usr/bin/python3

import json
import os
import logging
from datetime import datetime

from tools.ConvertPuzzles import convert_puzzle
from tools.GetData import fetch_puzzle


logger = logging.getLogger(__name__)
logging.basicConfig(filename='FetchAndCommit.log', level=logging.DEBUG, format='%(asctime)s %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')


def fetch_convert_and_commit(date: datetime):
    logger.info("Fetching puzzle")
    original_filename = fetch_puzzle(date)
    logger.info("Extracting name")
    puzzle_name = original_filename.split("/")[-1]
    logger.info("Converting puzzle")
    # Convert the puzzle
    converted_puzzle = convert_puzzle(original_filename)
    logger.info("Constructing filepath")
    converted_filename = f"crossword_data/Converted/{puzzle_name}"
    logger.info("Saving converted puzzle")
    with open(converted_filename, 'w') as f:
        json.dump(converted_puzzle, f, indent=4)
    logger.info("Commit and push changes")
    # Commit and push the changes
    os.system(f"git add {original_filename}")
    os.system(f"git add {converted_filename}")
    os.system(f'git commit -m "Added puzzle for {date}"')
    os.system("git push --no-verify") #Skip this Warning: the ECDSA host key for 'github.com' differs from the key for the IP address '140.82.121.3'


if __name__ == "__main__":
    # Fetch the puzzle of the day, convert it, place in the correct directory, and commit the changes to the repository and push

    # Fetch the puzzle
    date_today = datetime.now()
    logger.info("Starting script")
    fetch_convert_and_commit(date_today)
    logger.info("Finished script")
