import datetime

import requests

url = "https://www.nytimes.com/svc/crosswords/v6/puzzle/mini.json"


headers = {
    # Add your own cookie here in the format: SIDNY={your cookie}; (you can find this in the network tab of the developer tools)
    'Cookie': 'SIDNY=CBcSMQjy9cWtBhCgko-xBhoSMS1bLMe5bSs5-e_fV_NSlxp6IPH6yEoqAh53ONaVnv8FQgAaQBy4V4Ak8BSxDNwyyBtUi6oMLUVnO0Yhd4unbrojhY2JS6siU1LQAYIRW6y8yN6dRf1fXb_X4CR24Dx1kYZysQA=;',
    "x-games-auth-bypass": "true",
}


def fetch_old_puzzles():
    # for each day between august 21 2014 and april 20 2024
    start_date = datetime.datetime(2015, 3, 20)
    end_date = datetime.datetime(2024, 4, 20)
    delta = end_date - start_date

    for i in range(delta.days + 1):
        print(i + 1, "of", delta.days + 1)
        date = start_date + datetime.timedelta(days=i)
        fetch_puzzle(date)


def fetch_puzzle(date: datetime.datetime):
    year = date.year
    month = date.month
    day = date.day

    # generate the url in the format: base_url + 2024-04-01.json
    # url = base_url + f"{year}-{month:02d}-{day:02d}.json"

    # Fetch the data from the url
    response = requests.request("GET", url, headers=headers)

    # Save the data to a file
    filename = f"crossword_data/Original/{year}-{month:02d}-{day:02d}.json"
    with open(filename, "w", encoding="utf8") as f:
        f.write(response.text)

    return filename
