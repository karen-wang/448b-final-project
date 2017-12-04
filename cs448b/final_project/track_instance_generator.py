import json
from pprint import pprint
import random
from collections import Counter
import math
import numpy as np
from numpy import linalg
import scipy as sp
from scipy import spatial
import csv

NUM_INSTANCES = 5000
OR_DELIM = '-or-'

tracknames = ["AI", "compeng", "info", "theory", "systems"]

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

def generate_theory_systems_track_instances(d, track_name):
    counter = Counter()
    requirements = [".a", ".b", ".c", ".track_electives"]
    for _ in range(NUM_INSTANCES):
        track_instance = []
        for r in requirements:
            req = track_name + r
            options = set(d[req]) - set(track_instance)
            track_instance += random.sample(options, d[req+".quantity"])
        for i, course in enumerate(track_instance):
            if OR_DELIM in course:
                options = course.split(OR_DELIM)
                new_c = random.choice(options)
                track_instance[i] = new_c
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
        
        for i, course in enumerate(track_instance):
            if OR_DELIM in course:
                options = course.split(OR_DELIM)
                new_c = random.choice(options)
                track_instance[i] = new_c

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
    all_courses = sorted(list(set(all_courses)))
    # pprint(all_courses)
    return dict, all_courses

def get_scores_for_course(course):
    appearances = []
    # pprint(tracknames)
    for track in tracknames:
        appearances.append(all_sampled_tracks[track][course])

    #normalized_appearances = [round(x/float(sum(appearances)+.0001),3) for x in appearances]        
    normalized_appearances = [round(100*x/float(NUM_INSTANCES),3) for x in appearances]
    # print {course: appearances}
    print {course: normalized_appearances}
    return {"name": course,
            "count": normalized_appearances}


# Note: all vectors have sum and length.
    # output length is 149 (for all classes)
    # sum is 7 (number of classes/track) * NUM_SAMPLES 
def convert_track_to_vector(track, all_courses): 
    all_courses = sorted(all_courses, reverse=True) # Z to A
    # pprint(all_courses)
    track_vec = []
    for course in all_courses:
        track_vec.append(track[course])
    # pprint(track_vec)
    return track_vec

#http://dataaspirant.com/2015/04/11/five-most-popular-similarity-measures-implementation-in-python/
def get_track_distance(track1, track2):
    t1 = np.array(track1)
    t2 = np.array(track2)

    # Euclidean distance
    euc_dist = np.linalg.norm(t1-t2)

    # Cosine similarity
    cos_dist = round(1 - sp.spatial.distance.cosine(t1, t2), 4)

    #Manhattan distance
    manh_dist = sp.spatial.distance.cityblock(t1, t2)
    
    return cos_dist

def get_all_track_distances(tracks):

    tracknames = tracks.keys()
    dist_dict = {}
    for i in range(len(tracknames)):
        for j in range(i+1, len(tracknames)):
            t1 = tracknames[i]
            t2 = tracknames[j]
            dist_dict[t1+ ' and ' +t2] = get_track_distance(tracks[t1], tracks[t2])
    return dist_dict

def print_dists_sorted(dists):
    dists_view = [ (v, k) for k, v in dists.iteritems() ]
    dists_view.sort(reverse=True)
    for (v, k) in dists_view:
        print '%s: %.4f' % (k, v)

def outputCSV():
    with open('out.csv', 'wb') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        writer.writerow(['deptCode','classNo',
                         'scoreAI','scoreCompeng',
                         'scoreInfo','scoreSystems',
                         'scoreTheory'])
        for course in all_courses:
            output = get_scores_for_course(course)
            # print(output)
            dept_code_class_no = output['name'].split()
            dept_code = dept_code_class_no[0]
            class_no = dept_code_class_no[1]
            track_scores = output['count']
            score_ai = track_scores[tracknames.index('AI')]
            score_compeng = track_scores[tracknames.index('compeng')]
            score_info = track_scores[tracknames.index('info')]
            score_systems = track_scores[tracknames.index('systems')]
            score_theory = track_scores[tracknames.index('theory')]
            writer.writerow([dept_code, class_no, score_ai, score_compeng, score_info, score_systems, score_theory])

def outputJSON():
    data = []
    for course in all_courses:
        output = get_scores_for_course(course)
        # pprint(output)
        data.append(output)
    # pprint(data)

    with open('out.json', 'w') as outfile:
        json.dump(data, outfile)

def main():
    global all_sampled_tracks
    dict, all_courses = load_data()
    c1 = generate_AI_track_instances(dict)
    ai2 = generate_AI_track_instances(dict)
    c2 = generate_compeng_track_instances(dict)
    ce2 = generate_compeng_track_instances(dict)
    # pprint(c1 & c2)
    c3 = generate_theory_systems_track_instances(dict, "theory")

    c4 = generate_theory_systems_track_instances(dict, "systems")
    c5 = generate_info_track_instances(dict)
    # pprint(c5)

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

    classes_by_track = {}
    classes_by_track["AI"] = convert_track_to_vector(c1, all_courses)
    classes_by_track["compeng"] = convert_track_to_vector(c2, all_courses)
    classes_by_track["theory"] = convert_track_to_vector(c3, all_courses)
    classes_by_track["systems"] = convert_track_to_vector(c4, all_courses)
    classes_by_track["info"] = convert_track_to_vector(c5, all_courses)

    dists = get_all_track_distances(classes_by_track)
    print_dists_sorted(dists)

    outputCSV()

main()