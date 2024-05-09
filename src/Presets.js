export const publicPresets = [
    {
        name: "Bush",
        axiom: "A(edge,init_wid,[0,80,0],[128,83,51])",
        constants: [
            ["num_gens", 6], 
            ["delta", 22.5],
            ["edge", 0.4],
            ["init_wid", 0.04],
            ["hr", 0.707],
            ["col_rate", "[0, 15, 0]"],
        ],
        productions: [
            ["A(len,wid,lcol,bcol)", 
                [["*",
                    [
                        ["[ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ] /(delta) /(delta) /(delta) /(delta) /(delta) [ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ] /(delta) /(delta) /(delta) /(delta) /(delta) /(delta) /(delta) [ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ]", "1.0"], 
                    ]
                ]]
            ], 
            ["F(len,lcol)", 
                [["*",
                    [
                        ["K(lcol) /(delta) /(delta) /(delta) /(delta) /(delta) F(len,lcol)", "1.0"], 
                    ]
                ]]
            ],
            ["K(lcol)", 
                [["*",
                    [
                        ["F(edge,lcol) '(lcol) L", "1.0"],
                    ]
                ]]
            ],
            ["L", 
                [["*",
                    [
                        ["[ ^(delta) ^(delta) { . -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) . -(delta) | -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) } ]", "1.0"],
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Flower Plant",
        axiom: "!(wid) plant", 
        constants: [
            ["num_gens", 5],
            ["delta", 18],
            ["len", 0.2],
            ["wid", 0.01],
            ["lcol", "[29,131,72]"],
            ["fcol", "[255,160,57]"],
        ],
        productions: [
            ["plant", 
                [["*",
                    [
                        ["internode +(delta) [ plant +(delta) flower ] -(delta) -(delta) /(delta) /(delta) [ -(delta) -(delta) leaf ] internode [ +(delta) +(delta) leaf ] -(delta) [ plant flower ] +(delta) +(delta) plant flower", "1.0"],
                    ]
                ]]
            ],
            ["internode", 
                [["*",
                    [
                        ["F(len) seg [ /(delta) /(delta) &(delta) &(delta) leaf ] [ /(delta) /(delta) ^(delta) ^(delta) leaf ] F(len) seg", "1.0"]
                    ]
                ]]
            ],
            ["seg", 
                [["*",
                    [
                        ["seg F(len) seg", "1.0"]
                    ]
                ]]
            ],
            ["leaf", 
                [["*",
                    [
                        ["[ '(lcol) { . +(delta) f(len) . -(delta) f(len) f(len) . -(delta) f(len) . +(delta) | +(delta) f(len) . -(delta) f(len) f(len) . -(delta) f(len) . } ]", "1.0"]
                    ]
                ]]
            ],
            ["flower", 
                [["*",
                    [
                        ["[ ^(delta) ^(delta) ^(delta) pedicel /(delta) wedge /(delta) /(delta) /(delta) /(delta) wedge /(delta) /(delta) /(delta) /(delta) wedge /(delta) /(delta) /(delta) /(delta) wedge /(delta) /(delta) /(delta) /(delta) wedge ]", "1.0"]
                    ]
                ]]
            ],
            ["pedicel", 
                [["*",
                    [
                        ["'([255,255,255]) F(len) F(len)", "1.0"]
                    ]
                ]]
            ],
            ["wedge", 
                [["*",
                    [
                        ["[ ^(delta) F(len) ] [ '(fcol) { &(delta) &(delta) &(delta) &(delta) . -(delta*2) f(len*2) . +(delta*2) f(len*2) . | -(delta*2) f(len*2) . +(delta*2) f(len*2) . } ]", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Ash Tree",
        axiom: "t(0.02) T([0, -1, 0]) A(1.2, 0.15, 1)",
        constants: [
            ["num_gens", 10],
            ["r1", 0.95],
            ["r2", 0.80],
            ["a1", 30],
            ["a2", 45],
            ["h", 0.707],
            ["i0", 137.5],
            ["TURN_T", 12],
            ["PITCH_T", 12],
            ["ROLL_T", 20],
        ],
        productions: [
            ["A(len,wid,level)",
                [["level==1",
                    [
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) B(len*r2, wid*h, level+1) ] /(random(-TURN_T*2, TURN_T*2)) [ ^(a1+random(-PITCH_T, PITCH_T)) B(len*r2, wid*h, level+1) ] /(i0+random(-TURN_T, TURN_T)) A(len*r1, wid*h, level+1)", "1.0"],
                    ]
                ],["*",
                    [
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) B(len*r2, wid*h, level+1) ] /(random(-TURN_T*2, TURN_T*2)) [ ^(a1+random(-PITCH_T, PITCH_T)) B(len*r2, wid*h, level+1) ] /(i0+random(-TURN_T, TURN_T)) A(len*r1, wid*h, level+1)", "0.2"],
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) B(len*r2, wid*h, level+1) ] /(i0+random(-TURN_T, TURN_T)) A(len*r1, wid*h, level+1)", "0.4"],
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) C(len*r2, wid*h, level+1) ] /(i0+random(-TURN_T, TURN_T)) A(len*r1, wid*h, level+1)", "0.4"]
                    ]
                ]]
            ],
            ["B(len,wid,level)",
                [["*",
                    [
                        ["!(wid) F(len) [ leaves(level,wid) -(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) C(len*r2, wid*h, level+1) ] /(random(-ROLL_T, ROLL_T)) C(len*r1, wid*h, level+1)", "0.7"],
                        ["!(wid) F(len) [ leaves(level,wid) +(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) C(len*r2, wid*h, level+1) ] /(random(-ROLL_T, ROLL_T)) C(len*r1, wid*h, level+1)", "0.3"],
                    ]
                ]]
            ],
            ["C(len,wid,level)",
                [["*",
                    [
                        ["!(wid) F(len) [ leaves(level,wid) +(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) B(len*r2, wid*h, level+1) ] /(random(-ROLL_T, ROLL_T)) B(len*r1, wid*h, level+1)", "0.7"],
                        ["!(wid) F(len) [ leaves(level,wid) -(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) B(len*r2, wid*h, level+1) ] /(random(-ROLL_T, ROLL_T)) B(len*r1, wid*h, level+1)", "0.3"]
                    ]
                ]]
            ],
            ["leaves(level,wid)", 
                [["*",
                    [
                        ["[ &(random(-60,60)) /(random(-45, 45)) +(random(-30, 30)) '([125,120,60]) !(min(0.005,wid*h)) L(level/num_gens) F(0.1*(level/num_gens)) /(180) L(level/num_gens) F(0.1*(level/num_gens)) /(180) L(level/num_gens) F(0.1*(level/num_gens)) /(180) L(level/num_gens) F(0.1*(level/num_gens)) /(180) L(level/num_gens) F(0.1*(level/num_gens)) /(180) L(level/num_gens) +(60) L(level/num_gens) ]", "level/num_gens"],
                        ["[]", "1-level/num_gens"],
                    ]
                ]]
            ],
            ["L(sz)",
                [["*", 
                    [
                        ["[ /(random(-30, 30)) -(45) '([125,177,60]) { . -(20) f(0.2*sz) . +(20) f(0.2*sz) . +(20) f(0.2*sz) . -(20) | -(20) f(0.2*sz) . +(20) f(0.2*sz) . +(20) f(0.2*sz) } ]", "1.0"]
                    ]
                ]]
            
            ]
        ]
    },
    {
        name: "Animated Tree",
        axiom: "Animation controls coming soon!",
        constants: [],
        productions: []
    },
    {
        name: "Monopodial tree",
        axiom: "A(2,0.2)",
        constants: [
            ["num_gens", 10],
            ["r1", 0.9],
            ["r2", 0.8],
            ["a0", 45],
            ["a2", 45],
            ["d", 137.5],
            ["h", 0.707]
        ],
        productions: [
            ["A(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ &(a0) B(l*r2,w*h) ] /(d) A(l*r1,w*h)", "1.0"]
                    ]
                ]]
            ],
            ["B(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ -(a2) $ C(l*r2,w*h) ] C(l*r1,w*h)", "1.0"] 
                    ]
                ]]
            ],
            ["C(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ +(a2) $ B(l*r2,w*h) ] B(l*r1,w*h)", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Monopodial tree 2",
        axiom: "A(2,0.2)",
        constants: [
            ["num_gens", 10],
            ["r1", 0.9],
            ["r2", 0.7],
            ["a0", 30],
            ["a2", -30],
            ["d", 137.5],
            ["h", 0.707]
        ],
        productions: [
            ["A(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ &(a0) B(l*r2,w*h) ] /(d) A(l*r1,w*h)", "1.0"]
                    ]
                ]]
            ],
            ["B(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ -(a2) $ C(l*r2,w*h) ] C(l*r1,w*h)", "1.0"] 
                    ]
                ]]
            ],
            ["C(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ +(a2) $ B(l*r2,w*h) ] B(l*r1,w*h)", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Monopodial tree 3",
        axiom: "A(2,0.2)",
        constants: [
            ["num_gens", 10],
            ["r1", 0.9],
            ["r2", 0.6],
            ["a0", 45],
            ["a2", 45],
            ["d", 137.5],
            ["h", 0.707]
        ],
        productions: [
            ["A(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ &(a0) B(l*r2,w*h) ] /(d) A(l*r1,w*h)", "1.0"]
                    ]
                ]]
            ],
            ["B(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ -(a2) $ C(l*r2,w*h) ] C(l*r1,w*h)", "1.0"] 
                    ]
                ]]
            ],
            ["C(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ +(a2) $ B(l*r2,w*h) ] B(l*r1,w*h)", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Sympodial tree",
        axiom: "A(2,0.2)",
        constants: [
            ["num_gens", 10],
            ["r1", 0.9],
            ["r2", 0.7],
            ["a1", 10],
            ["a2", 60],
            ["h", 0.707]
        ],
        productions: [
            ["A(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ &(a1) B(l*r1,w*h) ] /(180) [ &(a2) B(l*r2,w*h) ]", "1.0"]
                    ]
                ]]
            ],
            ["B(l,w)",
                [["*",
                    [
                        ["!(w) F(l) [ +(a1) $ B(l*r1,w*h) ] [ -(a2) $ B(l*r2,w*h) ]", "1.0"] 
                    ]
                ]]
            ],
        ]
    },
    {
        name: "Natural tree",
        axiom: "A(1, 0.15)",
        constants: [
            ["num_gens", 10],
            ["r1", 0.95],
            ["r2", 0.80],
            ["a1", 30],
            ["a2", 45],
            ["h", 0.707],
            ["i", 137.5],
            ["TURN_T", 12],
            ["PITCH_T", 12],
            ["ROLL_T", 20],
        ],
        productions: [
            ["A(len,wid)",
                [["*",
                    [
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) B(len*r2, wid*h) ] /(i+random(-TURN_T, TURN_T)) A(len*r1, wid*h)", "0.5"],
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) C(len*r2, wid*h) ] /(i+random(-TURN_T, TURN_T)) A(len*r1, wid*h)", "0.5"]
                    ]
                ]]
            ],
            ["B(len,wid)",
                [["*",
                    [
                        ["!(wid) F(len) [ -(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) C(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) C(len*r1, wid*h)", "0.7"],
                        ["!(wid) F(len) [ +(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) C(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) C(len*r1, wid*h)", "0.3"],
                    ]
                ]]
            ],
            ["C(len,wid)",
                [["*",
                    [
                        ["!(wid) F(len) [ +(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) B(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) B(len*r1, wid*h)", "0.7"],
                        ["!(wid) F(len) [ -(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) B(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) B(len*r1, wid*h)", "0.3"]
                    ]
                ]]
            ],
            ["L",
                [["*", 
                    [
                        ["[ '([125,177,60]) ^(20) ^(20) { . -(20) f(0.15) . +(20) f(0.15) . +(20) f(0.15) . -(20) | -(20) f(0.15) . +(20) f(0.15) . +(20) f(0.15) } ]", "1.0"]
                    ]
                ]]
            
            ]
        ]
    },
    {
        name: "Natural tree w/ leaves",
        axiom: "A(1, 0.15)",
        constants: [
            ["num_gens", 10],
            ["r1", 0.95],
            ["r2", 0.80],
            ["a1", 30],
            ["a2", 45],
            ["h", 0.707],
            ["i", 137.5],
            ["TURN_T", 12],
            ["PITCH_T", 12],
            ["ROLL_T", 20],
        ],
        productions: [
            ["A(len,wid)",
                [["*",
                    [
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) B(len*r2, wid*h) ] /(i+random(-TURN_T, TURN_T)) A(len*r1, wid*h)", "0.5"],
                        ["!(wid) F(len) [ &(a1+random(-PITCH_T, PITCH_T)) C(len*r2, wid*h) ] /(i+random(-TURN_T, TURN_T)) A(len*r1, wid*h)", "0.5"]
                    ]
                ]]
            ],
            ["B(len,wid)",
                [["*",
                    [
                        ["!(wid) F(len) [ L -(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) C(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) C(len*r1, wid*h)", "0.7"],
                        ["!(wid) F(len) [ +(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) C(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) C(len*r1, wid*h)", "0.3"],
                    ]
                ]]
            ],
            ["C(len,wid)",
                [["*",
                    [
                        ["!(wid) F(len) [ L +(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) B(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) B(len*r1, wid*h)", "0.7"],
                        ["!(wid) F(len) [ -(a2+random(-TURN_T, TURN_T)) $ &(random(-PITCH_T, PITCH_T)) B(len*r2, wid*h) ] /(random(-ROLL_T, ROLL_T)) B(len*r1, wid*h)", "0.3"]
                    ]
                ]]
            ],
            ["L",
                [["*", 
                    [
                        ["[ &(random(-30, 90)) '([125,177,60]) ^(20) ^(20) { . -(20) f(0.2) . +(20) f(0.2) . +(20) f(0.2) . -(20) | -(20) f(0.2) . +(20) f(0.2) . +(20) f(0.2) } ]", "1.0"]
                    ]
                ]]
            
            ]
        ]
    },
    {
        name: "Koch curve 1",
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants: [
            ["num_gens", 3],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", 
                [["*",
                    [
                        ["F(l) -(d) F(l) +(d) F(l) +(d) F(l) F(l) -(d) F(l) -(d) F(l) +(d) F(l)", "1.0"],
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Koch curve 2",
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants:[
            ["num_gens", 4],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", 
                [["*",
                    [
                        ["F(l) F(l) -(d) F(l) -(d) F(l) -(d) F(l) -(d) F(l) F(l)", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Koch curve 3",
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants:[
            ["num_gens", 4],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", 
                [["*",
                    [
                        ["F(l) F(l) -(d) F(l) -(d) F(l) -(d) F(l) -(d) F(l) -(d) F(l) +(d) F(l)", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Koch curve 4",
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants:[
            ["num_gens", 3],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", 
                [["*",
                    [
                        ["F(l) F(l) -(d) F(l) +(d) F(l) -(d) F(l) -(d) F(l) F(l)", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "Dragon Curve",
        axiom: "!(0.1) F(l) X",
        constants:[
            ["num_gens", 10],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["X", 
                [["*",
                    [
                        ["X +(d) Y F(l) +(d)", "1.0"]
                    ]
                ]]
            ],
            ["Y", 
                [["*",
                    [
                        ["-(d) F(l) X -(d) Y", "1.0"]
                    ]
                ]]
            ],
        ]
    },
    {
        name: "Sierpiński triangle",
        axiom: "!(0.1) F(l) X",
        constants:[
            ["num_gens", 7],
            ["l", 1],
            ["d", 60],
        ],
        productions: [
            ["X", 
                [["*",
                    [
                        ["+(d) F(l) Y -(d) F(l) X -(d) F(l) Y +(d)", "1.0"]
                    ]
                ]]
            ],
            ["Y", 
                [["*",
                    [
                        ["-(d) F(l) X +(d) F(l) Y +(d) F(l) X -(d)", "1.0"]
                    ]
                ]]
            ],
            ["F(len)", 
                [["*",
                    [
                        ["Z", "1.0"]
                    ]
                ]]
            ]
        ]
    },
    {
        name: "gravity test",
        axiom: "!(0.03) F(len) A(len)",
        constants: [
            ["num_gens", 10],
            ["len", 5],
            ["tt", "[0, -1, 0]"],
            ["ee", 0.2], 
            ["angle",45],
        ],
        productions: [
            ["A(size)",
                [["*",
                    [
                        ["T(tt) t(ee) [ &(angle) F(size/1.7) A(size/1.7) ] /(angle) /(angle) /(angle) /(angle) [ &(angle) F(size/1.7) A(size/1.7) ]", "1.0"],
                    ]
                ]]
            ],
        ]
    },
    {
        name: "Weeping Willow",
        axiom: "T(T) t(e) !(0.07) F(1) /(45) A",
        constants: [
            ["num_gens", 8],
            ["d1", 112.5],
            ["d2", 157.5],
            ["a", 22.5],
            ["lr", 1.4],
            ["T", "[-0.02, -1.00, 0.00]"],
            ["e", 0.27],
            ["vr", 1.3]
        ],
        productions: [
            ["A",
                [["*",
                    [
                        ["!(0.05) F(0.5) [ &(a) F(0.5) A ] /(d1) [ &(a) F(0.5) A ] /(d2) [ &(a) F(0.5) A ]", "1.0"],
                    ]
                ]]
            ],
            ["F(len)",
                [["*",
                    [
                        ["F(len*lr)", "1.0"],
                    ]
                ]]
            ],
            ["!(wid)",
                [["*",
                    [
                        ["!(wid*vr)", "1.0"],
                    ]
                ]]
            ],
        ]
    },
    {
        name: "Weeping Willow 2",
        axiom: "T(T) t(e) !(0.02) F(0.5) A",
        constants: [
            ["num_gens", 8],
            ["d1", 112.5],
            ["d2", 157.5],
            ["a", 22.5],
            ["lr", 1.356],
            ["T", "[-0.2, -1.00, 0.00]"],
            ["e", 0.27],
            ["vr", 1.653]
        ],
        productions: [
            ["A",
                [["*",
                    [
                        ["!(0.02) F(0.5) [ &(a) F(0.5) A ] /(d1) [ &(a) F(0.5) A ] /(d2) [ &(a) F(0.5) A ]", "1.0"],
                    ]
                ]]
            ],
            ["F(len)",
                [["*",
                    [
                        ["F(len*lr)", "1.0"],
                    ]
                ]]
            ],
            ["!(wid)",
                [["*",
                    [
                        ["!(wid*vr)", "1.0"],
                    ]
                ]]
            ],
        ]
    },


]