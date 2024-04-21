import json
import os

import chardet


def convert_puzzle(file_path: str):
    # Detect the file encoding
    with open(file_path, 'rb') as f:
        result = chardet.detect(f.read())

    # Use the detected encoding to read the file
    with open(file_path, 'r', encoding=result['encoding']) as f:
        nytimes_puzzle = json.load(f)

    converted_puzzle = {}

    # Extract the metadata
    converted_puzzle["puzzle_id"] = nytimes_puzzle["id"]
    converted_puzzle["promo_id"] = None
    converted_puzzle["version"] = 3

    metadata = {}
    metadata["formatType"] = "Normal"
    metadata["publishType"] = "Daily"
    metadata["title"] = "The Mini Crossword"
    metadata["printDate"] = nytimes_puzzle["publicationDate"]
    metadata["printDotw"] = 0
    metadata["editor"] = nytimes_puzzle.get("editor", "")
    metadata["height"] = nytimes_puzzle["body"][0]["dimensions"]["height"]
    metadata["width"] = nytimes_puzzle["body"][0]["dimensions"]["width"]
    metadata["author"] = nytimes_puzzle["constructors"][0]

    converted_puzzle["puzzle_meta"] = metadata
    converted_puzzle["print_date"] = nytimes_puzzle["publicationDate"]
    converted_puzzle["enhanced_tier_date"] = None

    # Convert the main puzzle data
    puzzle_data = {}

    # Extract the clues
    clues = {}
    across_clues = []
    down_clues = []

    for clue in nytimes_puzzle["body"][0]["clues"]:
        converted_clue = {}
        converted_clue["clueStart"] = clue["cells"][0]
        converted_clue["clueNum"] = int(clue["label"])
        converted_clue["clueEnd"] = clue["cells"][-1]
        converted_clue["value"] = clue["text"][0]["plain"]

        if clue["direction"] == "Across":
            across_clues.append(converted_clue)
        else:
            down_clues.append(converted_clue)

    clues["A"] = across_clues
    clues["D"] = down_clues
    puzzle_data["clues"] = clues

    # Extract the answers
    answers: list[str | None] = []

    for cell in nytimes_puzzle["body"][0]["cells"]:
        if cell:
            answers.append(cell["answer"])
        else:
            answers.append(None)

    puzzle_data["answers"] = answers

    # Extract the layout
    # We're cheating a bit here by assuming that the layout is always a square
    # and the simply using the anwers as a key
    layout = []

    for val in answers:
        if val:
            layout.append(1)
        else:
            layout.append(0)

    puzzle_data["layout"] = layout

    converted_puzzle["puzzle_data"] = puzzle_data
    return [converted_puzzle]


if __name__ == "__main__":
    # For each file in the puzzles directory, convert the puzzle and write it to the output directory
    count = 1
    total = len(os.listdir("crossword_data/Original"))
    for file in os.listdir("crossword_data/Original"):
        if file.endswith(".json"):
            print(f"Converting {file} ({count}/{total})")
            count += 1
            converted_puzzle = convert_puzzle(f"crossword_data/Original/{file}")
            with open(f"crossword_data/Converted/{file}", 'w') as f:
                json.dump(converted_puzzle, f, indent=4)
