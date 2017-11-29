import json
from pprint import pprint
import random
from collections import Counter

NUM_INSTANCES = 1000
OR_DELIM = '-or-'

def generate_AI_track_instances(d):
    counter = Counter()
    b_keys = [k for k, v in d.items() if k.startswith('ai.b')]
    #print(b_keys)
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

    #pprint(counter)
    return counter

def generate_compeng_track_instances(d):
    counter = Counter()
    for _ in range(NUM_INSTANCES):
        track_instance = []
        courses = random.sample(d["compeng.b"], 2)
        track_instance += courses
        concentration = random.randint(1, 3)
        if concentration == 1:
            trio = ["cs 140", "cs 140e", "cs 143"]
            track_instance.append(random.choice(trio))
            track_instance.append("ee 109")
            track_instance.append("ee 271")

            courses = random.sample(d["compeng.conc.1.choose"], 2)
            for course in courses:
                if OR_DELIM in course:
                    options = course.split(OR_DELIM)
                    options = list(set(options) - set(track_instance))
                    course = random.choice(options)
                track_instance.append(course)
        elif concentration == 2:
            track_instance += d["compeng.conc.2.req"]
            track_instance.append(random.choice(d["compeng.conc.2.choose"]))
        elif concentration == 3:
            duo = ["cs 140", "cs 140e"]
            track_instance.append(random.choice(duo))
            track_instance.append("cs 144")
            track_instance += random.sample(d["compeng.conc.3.choose"], 3)

        #pprint(track_instance)
        counter.update(track_instance)

    #pprint(counter)
    return counter

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
    c1 = generate_AI_track_instances(dict)
    c2 = generate_compeng_track_instances(dict)
    pprint(c1 & c2)

main()