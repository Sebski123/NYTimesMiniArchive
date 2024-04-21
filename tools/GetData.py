import datetime

import requests

base_url = "https://www.nytimes.com/svc/crosswords/v6/puzzle/mini/"


payload = {}
headers = {
    # Add your own cookie here in the format: SIDNY={your cookie}; (you can find this in the network tab of the developer tools)
    'Cookie': 'SIDNY='
}

# for each day between august 21 2014 and april 20 2024
start_date = datetime.datetime(2015, 3, 20)
end_date = datetime.datetime(2024, 4, 20)
delta = end_date - start_date

url = ""
for i in range(delta.days + 1):
    print(i + 1, "of", delta.days + 1)
    date = start_date + datetime.timedelta(days=i)
    year = date.year
    month = date.month
    day = date.day

    # generate the url in the format: base_url + 2024-04-01.json
    url = base_url + f"{year}-{month:02d}-{day:02d}.json"

    # Fetch the data from the url
    response = requests.request("GET", url, headers=headers, data=payload)

    # Save the data to a file
    with open(f"crossword_data/{year}-{month:02d}-{day:02d}.json", "w", encoding="utf8") as f:
        f.write(response.text)
