var NUM_INSTANCES = 1

var d = new Map();

Set.prototype.difference = function(setB) {
    var difference = new Set(this);
    for (var elem of setB) {
        difference.delete(elem);
    }
    return difference;
}

function generateAiTrackInstances() {
    for (var i = 0; i < NUM_INSTANCES; i++) {
        let trackInstance = [];
        trackInstance.push("cs 221");
        let bList = d["ai.b.ai_methods"].concat(d["ai.b.nlp"])
            .concat(d["ai.b.vision"].concat("ai.b.robotics"));
        //console.log(bList);
        let s = randomSelect(bList, 2);
        console.log(s);
        trackInstance.concat(randomSelect(bList, 2));
        let cSet = new Set(bList.concat(d["ai.c"]));
        let trackSet = new Set(trackInstance);
        let cList = Array.from(cSet.difference(trackSet));
        //console.log(cList);
        trackInstance.concat(randomSelect(cList, 1));
        let electSet = new Set(cList.concat(d["general_cs_electives"]));
        trackSet = new Set(trackInstance);
        let elecList = Array.from(electSet.difference(trackSet));
        trackInstance.concat(randomSelect(elecList, 3));
        console.log(trackInstance);
    }
}

function randomSelect(list, count) {
    let bucket = [];
    let selected = [];

    for (var i = 0; i < list.length; i++) {
        bucket.push(i);
    }

    for (var i = 0; i < count; i++) {
        bucketIdx = getRandomInt(0, bucket.length);
        selected.push(list[bucket[bucketIdx]]);
        bucket.splice(bucketIdx, 1);
    }

    console.log(selected);

    return selected;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function main() {
    loadRequirements();
    //console.log(d);

    //let setA = new Set([1, 2, 3]);
    //let setB = new Set([1]);
    //console.log(setA.difference(setB));

    generateAiTrackInstances();
}

main();

function loadRequirements() {
    var reqs = [
  {
    name: "general_cs_electives",
    courses: ["cs 108", "cs 124", "cs 131", "cs 140", "cs 140e", "cs 142", "cs 143", "cs 144", "cs 145", "cs 147", "cs 148", "cs 149", "cs 154", "cs 155", "cs 157", "phil 151", "cs 164", "cs 166", "cs 167", "cs 168", "cs 190", "cs 205a", "cs 205b", "cs 210a", "cs 223a", "cs 224n", "cs 224s", "cs 224u", "cs 224w", "cs 225a", "cs 227b", "cs 228", "cs 229", "cs 229t", "cs 231a", "cs 231b", "cs 231m", "cs 231n", "cs 232", "cs 233", "cs 234", "cs 238", "cs 240", "cs 240h", "cs 242", "cs 243", "cs 244", "cs 244b", "cs 245", "cs 246", "cs 247", "cs 248", "cs 249a", "cs 251", "cs 254", "cs 255", "cs 261", "cs 262", "cs 263", "cs 264", "cs 265", "cs 266", "cs 267", "cs 269i", "cs 270", "cs 272", "cs 273a", "cs 273b", "cs 274", "cs 276", "cs 279", "cs 348b", "cs 348c", "cs 352", "ee 282", "ee 364a", "cme 108", "ee 180"]
  },
  {
    name: "ai.b.ai_methods",
    courses: ["cs 228", "cs 229", "cs 234", "cs 238"]
  },
  {
    name: "ai.b.nlp",
    courses: ["cs 124", "cs 224n", "cs 224s", "cs 224u"]
  },
  {
    name: "ai.b.vision",
    courses: ["cs 131", "cs 231a", "cs 231n"]
  },
  {
    name: "ai.b.robotics",
    courses: ["cs 223a"]
  },
  {
    name: "ai.c",
    courses: ["cs 157", "cs 205a", "stats 315a", "stats 315b",
    "cs 231b", "cs 231m", "cs 331a",
      "cs 262", "cs 279", "cs 371", "cs 374",
    "cs 276", "cs 224w", "cs 227b", "cs 277", "cs 379",
    "cs 327a", "cs 329", "engr 205", "ee 209", "ms&e 251",
    "ms&e 351"]
  },
    {
    name: "ai.track_electives",
    courses: ["cs 238", "cs 275", "cs 326", "cs 334a", "ee 364a", "cs 428",
    "ee 278", "ee 364b", "econ 286", "ms&e 252", "ms&e 352", "ms&e 355",
    "phil 152", "psych 202", "psych 204a", "psych 204b", "psych 209",
    "stats 200", "stats 202", "stats 205"]
  },
    {
    name: "biocomp.a",
      courses: ["cs 221", "cs 228", "cs 229", "cs 231a"]
    },
    {
    name: "biocomp.b",
      courses: ["cs 262", "cs 270", "cs 273a", "cs 274", "cs 275", "cs 279"]
    },
    {
    name: "biocomp.c",
      courses: ["cs 221", "cs 228", "cs 229", "cs 231a", "cs 262",
      "cs 270", "cs 273a", "cs 274", "cs 275", "cs 279", "cs 124",
      "cs 145", "cs 147", "cs 148", "cs 248"]
    },
    {
    name: "biocomp.restricted_elective.3",
    courses: ["cs 108", "cs 124", "cs 131", "cs 140", "cs 140e", "cs 142", "cs 143", "cs 144", "cs 145", "cs 147", "cs 148", "cs 149", "cs 154", "cs 155", "cs 157", "phil 151", "cs 164", "cs 166", "cs 167", "cs 168", "cs 190", "cs 205a", "cs 205b", "cs 210a", "cs 221", "cs 223a", "cs 224n", "cs 224s", "cs 224u", "cs 224w", "cs 225a", "cs 227b", "cs 228", "cs 229", "cs 229t", "cs 231a", "cs 231b", "cs 231m", "cs 231n", "cs 232", "cs 233", "cs 234", "cs 238", "cs 240", "cs 240h", "cs 242", "cs 243", "cs 244", "cs 244b", "cs 245", "cs 246", "cs 247", "cs 248", "cs 249a", "cs 251", "cs 254", "cs 255", "cs 261", "cs 262", "cs 263", "cs 264", "cs 265", "cs 266", "cs 267", "cs 269i", "cs 270", "cs 272", "cs 273a", "cs 273b", "cs 274", "cs 275", "cs 276", "cs 279", "cs 348b", "cs 348c", "cs 371", "cs 374", "cme 108", "ee 180", "ee 263", "ee 282", "ee 364a", "bioe 101", "ms&e 152", "ms&e 252", "stats 206", "stats 315a", "stats 315b", "bmi 231", "bmi 260", "gene 211"]
  }, {
  name : "compeng.b",
  courses: ["ee 101a", "ee 101b", "ee 102a", "ee 102b"]
  }, {
  name: "compeng.conc.1.req",
  courses: ["cs 140", "cs 140e", "cs 143", "ee 109", "ee 271"]
}, {
  name: "compeng.conc.1.choose",
  courses: ["cs 140", "cs 140e", "cs 143", "cs 144", "cs 149", "cs 190", "cs 240e", "cs 244", "ee 273", "ee 282"]
}, {
  name: "compeng.conc.2.req",
  courses: ["cs 205a", "cs 223a", "me 210", "engr 105"]
}, {
  name: "compeng.conc.2.choose",
  courses: ["cs 225a", "cs 231a", "engr 205", "engr 207b"]
}, {
  name: "compeng.conc.3.req",
  courses: ["cs 140", "cs 140e", "cs 144"]
}, {
  name: "compeng.conc.3.choose",
  courses: ["cs 240", "cs 240e", "cs 241", "cs 244", "cs 244b", "cs 244e", "ee 179"]
}, {
  name: "theory.a",
  "quantity": 1,
  courses: ["cs 154"]
}, {
  name: "theory.b",
  "quantity": 1,
  courses: ["cs 167", "cs 168", "cs 255", "cs 261", "cs 265", "cs 268"]
}, {
  name: "theory.c",
  "quantity": 2,
  courses: ["cs 167", "cs 168", "cs 255", "cs 261", "cs 265", "cs 268",
    "cs 143", "cs 155", "cs 157", "phil 151", "cs 166", "cs 205a", "cs 228",
    "cs 233", "cs 242", "cs 250", "cs 251", "cs 254", "cs 259", "cs 262",
    "cs 263", "cs 266", "cs 267", "cs 269i", "cs 352", "cs 254", "cs 355",
    "cs 357", "cs 358", "cs 359", "cs 364a", "cs 367", "cs 369", "cs 374",
    "ms&e 310"]
}, {
  name: "theory.track_electives",
  "quantity": 3,
  courses: ["cs 167", "cs 168", "cs 255", "cs 261", "cs 265", "cs 268",
    "cs 143", "cs 155", "cs 157", "phil 151", "cs 166", "cs 205a", "cs 228",
    "cs 233", "cs 242", "cs 250", "cs 251", "cs 254", "cs 259", "cs 262",
    "cs 263", "cs 266", "cs 267", "cs 269i", "cs 352", "cs 254", "cs 355",
    "cs 357", "cs 358", "cs 359", "cs 364a", "cs 367", "cs 369", "cs 374",
    "ms&e 310", "cs 269g", "cme 302", "cme 305", "phil 152","cs 108", "cs 124",
    "cs 131", "cs 140" ,"cs 140e", "cs 142", "cs 143", "cs 144", "cs 145",
    "cs 147", "cs 148", "cs 149", "cs 154", "cs 155", "cs 157", "phil 151",
    "cs 164", "cs 166", "cs 167", "cs 168", "cs 190", "cs 205a", "cs 205b",
    "cs 210a", "cs 223a", "cs 224n", "cs 224s", "cs 224u", "cs 224w", "cs 225a",
    "cs 227b", "cs 228", "cs 229", "cs 229t", "cs 231a", "cs 231b", "cs 231m",
    "cs 231n", "cs 232", "cs 233", "cs 234", "cs 238", "cs 240", "cs 240h",
    "cs 242", "cs 243", "cs 244", "cs 244b", "cs 245", "cs 246", "cs 247", "cs 248",
    "cs 249a", "cs 251", "cs 254", "cs 255", "cs 261", "cs 262", "cs 263", "cs 264",
    "cs 265", "cs 266", "cs 267", "cs 269i", "cs 270", "cs 272", "cs 273a",
    "cs 273b", "cs 274", "cs 276", "cs 279", "cs 348b", "cs 348c", "cs 352",
    "ee 282", "ee 364a", "cme 108", "ee 180", "cs 221"]
}, {
  name: "systems.a",
  "quantity": 1,
  courses: ["cs 140", "cs 140e"]
}, {
  name: "systems.b",
  "quantity": 1,
  courses: ["cs 143", "ee 180"]
}, {
  name: "systems.c",
  "quantity": 2,
  courses: ["cs 143", "ee 180", "cs 144", "cs 145", "cs 149", "cs 155", "cs 190",
    "cs 240", "cs 242", "cs 243", "cs 244", "cs 245", "ee 271", "ee 282"]
}, {
  name: "systems.track_electives",
  "quantity": 3,
  courses: ["cs 143", "ee 180", "cs 144", "cs 145", "cs 149", "cs 155", "cs 190",
    "cs 240", "cs 242", "cs 243", "cs 244", "cs 245", "ee 271", "ee 282", "cs 269g",
    "cme 302", "cme 305", "phil 152", "cs 108", "cs 124",
    "cs 131", "cs 140" ,"cs 140e", "cs 142", "cs 143", "cs 144", "cs 145",
    "cs 147", "cs 148", "cs 149", "cs 154", "cs 155", "cs 157", "phil 151",
    "cs 164", "cs 166", "cs 167", "cs 168", "cs 190", "cs 205a", "cs 205b",
    "cs 210a", "cs 223a", "cs 224n", "cs 224s", "cs 224u", "cs 224w", "cs 225a",
    "cs 227b", "cs 228", "cs 229", "cs 229t", "cs 231a", "cs 231b", "cs 231m",
    "cs 231n", "cs 232", "cs 233", "cs 234", "cs 238", "cs 240", "cs 240h",
    "cs 242", "cs 243", "cs 244", "cs 244b", "cs 245", "cs 246", "cs 247", "cs 248",
    "cs 249a", "cs 251", "cs 254", "cs 255", "cs 261", "cs 262", "cs 263", "cs 264",
    "cs 265", "cs 266", "cs 267", "cs 269i", "cs 270", "cs 272", "cs 273a",
    "cs 273b", "cs 274", "cs 276", "cs 279", "cs 348b", "cs 348c", "cs 352",
    "ee 282", "ee 364a", "cme 108", "ee 180", "cs 221"]
}, {
  name: "info.a",
  "quantity": 2,
  courses: ["cs 124", "cs 145"]
}, {
  name: "info.b.i",
  "quantity": 1,
  courses: ["cs 224n", "cs 224s", "cs 229", "cs 233", "cs 234"]
}, {
  name: "info.b.ii",
  "quantity": 1,
  courses: ["cs 140", "cs 140e", "cs 142", "cs 245", "cs 246", "cs 341",
    "cs 345", "cs 346", "cs 347"]
}, {
  name: "info.b.iii",
  "quantity": 1,
  courses: ["cs 262", "cs 270", "cs 274"]
}, {
  name: "info.b.iv",
  "quantity": 1,
  courses: ["cs 224w", "cs 276"]
}, {
  name: "info.track_electives",
  "quantity": 3,
  courses: ["cs 224n", "cs 224s", "cs 229", "cs 233", "cs 234",
   "cs 108", "cs 124", "cs 140", "cs 140e", "cs 142", "cs 245", "cs 246", "cs 341",
    "cs 345", "cs 346", "cs 347", "cs 262", "cs 270", "cs 274",
    "cs 224w", "cs 276",
    "cs 131", "cs 140" ,"cs 140e", "cs 142", "cs 143", "cs 144", "cs 145",
    "cs 147", "cs 148", "cs 149", "cs 154", "cs 155", "cs 157", "phil 151",
    "cs 164", "cs 166", "cs 167", "cs 168", "cs 190", "cs 205a", "cs 205b",
    "cs 210a", "cs 223a", "cs 224n", "cs 224s", "cs 224u", "cs 224w", "cs 225a",
    "cs 227b", "cs 228", "cs 229", "cs 229t", "cs 231a", "cs 231b", "cs 231m",
    "cs 231n", "cs 232", "cs 233", "cs 234", "cs 238", "cs 240", "cs 240h",
    "cs 242", "cs 243", "cs 244", "cs 244b", "cs 245", "cs 246", "cs 247", "cs 248",
    "cs 249a", "cs 251", "cs 254", "cs 255", "cs 261", "cs 262", "cs 263", "cs 264",
    "cs 265", "cs 266", "cs 267", "cs 269i", "cs 270", "cs 272", "cs 273a",
    "cs 273b", "cs 274", "cs 276", "cs 279", "cs 348b", "cs 348c", "cs 352",
    "ee 282", "ee 364a", "cme 108", "ee 180", "cs 221"
  ]
}

];
    reqs.forEach(function(req) {
        d[req.name] = req.courses
    })
}

