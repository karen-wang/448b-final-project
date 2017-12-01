import json
from pprint import pprint
import random
from collections import Counter

NUM_INSTANCES = 5000
OR_DELIM = '-or-'

tracknames = ["AI", "compeng", "theory", "systems", "info"]

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
        pprint(track_instance)
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

def generate_theory_systems_track_instances(d, track_name):
    counter = Counter()
    requirements = [".a", ".b", ".c", ".track_electives"]
    for _ in range(NUM_INSTANCES):
        track_instance = []
        for r in requirements:
            req = track_name + r
            options = set(d[req]) - set(track_instance)
            track_instance += random.sample(options, d[req+".quantity"])
        counter.update(track_instance)
    return counter

def generate_info_track_instances(d):
    counter = Counter()
    for _ in range(NUM_INSTANCES):
        track_instance = []
        #A
        track_instance += random.sample(set(d["info.a"]), d["info.a.quantity"])
        #B
        b_areas = random.sample(["i", "ii", "iii", "iv"], 2)
        for area in b_areas:
            options = set(d["info.b."+area]) - set(track_instance)
            track_instance += random.sample(options, d["info.b."+area+".quantity"])
        #elective
        options = set(d["info.track_electives"]) - set(track_instance)
        track_instance += random.sample(options, d["info.track_electives.quantity"])
        counter.update(track_instance)
    return counter

def load_data():
    global all_courses
    all_courses = []
    dict = {}
    buckets = json.load(open('requirements.json'))
    for bucket in buckets:
        if "name" not in bucket or "courses" not in bucket:
            print "Error: field not found."
            return
        courses = [x.encode('utf-8') for x in bucket["courses"]]
        dict[bucket["name"].encode('utf-8')] = courses
        all_courses += courses
        if "quantity" in bucket:
            dict[bucket["name"]+".quantity"] = bucket["quantity"]
    all_courses = list(set(all_courses))
    #pprint(dict)
    return dict

def get_scores_for_course(course):
    appearances = []
    for track in tracknames:
        appearances.append(all_sampled_tracks[track][course])

    #normalized_appearances = [round(x/float(sum(appearances)+.0001),3) for x in appearances]        
    normalized_appearances = [round(100*x/float(NUM_INSTANCES),3) for x in appearances]
    #print {course: appearances}
    print {course: normalized_appearances}
    return {"name": course,
            "count": appearances}

def main():
    global all_sampled_tracks
    dict = load_data()
    c1 = generate_AI_track_instances(dict)
    c2 = generate_compeng_track_instances(dict)
    pprint(c1 & c2)
    c3 = generate_theory_systems_track_instances(dict, "theory")
    c4 = generate_theory_systems_track_instances(dict, "systems")
    c5 = generate_info_track_instances(dict)
    pprint(c5)
    
    all_sampled_tracks = {}
    all_sampled_tracks["AI"] = c1
    all_sampled_tracks["compeng"] = c2
    all_sampled_tracks["theory"] = c3
    all_sampled_tracks["systems"] = c4
    all_sampled_tracks["info"] = c5

    data = []
    for course in all_courses:
        output = get_scores_for_course(course)
        pprint(output)
        data.append(output)
    pprint(data)

    with open('out.json', 'w') as outfile:
        json.dump(data, outfile)

main()