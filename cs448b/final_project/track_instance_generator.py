import json
from pprint import pprint
import random
from collections import Counter

NUM_INSTANCES = 100
OR_DELIM = '-or-'

def generate_AI_track_instances(d):
    counter = Counter()
    b_keys = [k for k, v in d.items() if k.startswith('ai.b')]
    print(b_keys)
    for _ in range(NUM_INSTANCES):
        track_instance = []
        # A requirements
        track_instance.append("cs 221")

        # B requirements
        selected_areas = random.sample(b_keys, 2)
        for area in selected_areas:
            track_instance.append(random.choice(d[area]))

        # C requirements
        c_courses = list(set(d["ai.b.ai_methods"] + d["ai.b.nlp"] + d["ai.b.vision"] \
                    + d["ai.b.robotics"] + d["ai.c"]) \
                    - set(track_instance))
        #print c_courses
        track_instance.append(random.choice(c_courses))

        # Elective requirements
        electives = list(set(d["general_cs_electives"] + c_courses)
                         - set(track_instance))
        courses = random.sample(electives, 3)
        for course in courses:
            if OR_DELIM in course:
                options = course.split(OR_DELIM)
                course = random.choice(options)
            track_instance.append(course)
        #pprint(track_instance)
        counter.update(track_instance)

    pprint(counter)

def load_data():
    dict = {}
    buckets = json.load(open('requirements.json'))
    for bucket in buckets:
        if "name" not in bucket or "courses" not in bucket:
            print "Error: field not found."
            return
        courses = [x.encode('utf-8') for x in bucket["courses"]]
        dict[bucket["name"].encode('utf-8')] = courses
    #pprint(dict)
    return dict

def main():
    dict = load_data()
    generate_AI_track_instances(dict)

main()