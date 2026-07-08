import json
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data" / "education.json"


def get_all_topics():
    with open(DATA_FILE, "r") as file:
        return json.load(file)


def get_topic_by_id(topic_id: int):
    topics = get_all_topics()

    for topic in topics:
        if topic["id"] == topic_id:
            return topic

    return None