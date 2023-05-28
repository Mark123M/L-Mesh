export const allPresets = [
    {},
    {
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
            ["A(len,wid,lcol,bcol)", [
                ["[ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ] /(delta) /(delta) /(delta) /(delta) /(delta) [ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ] /(delta) /(delta) /(delta) /(delta) /(delta) /(delta) /(delta) [ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ]", "1.0"], 
            ]], 
            ["F(len,lcol)", [
                ["S(lcol) /(delta) /(delta) /(delta) /(delta) /(delta) F(len,lcol)", "1.0"], 
            ]],
            ["S(lcol)", [
                ["F(edge,lcol) '(lcol) L", "1.0"],
            ]],
            ["L", [
                ["[ ^(delta) ^(delta) { . -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) . -(delta) | -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) } ]", "1.0"],
            ]]
        ]
    },
    {
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants: [
            ["num_gens", 3],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", [
                ["F(l) -(d) F(l) +(d) F(l) +(d) F(l) F(l) -(d) F(l) -(d) F(l) +(d) F(l)", "1.0"],
            ]]
        ]
    },
    {
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants:[
            ["num_gens", 4],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", [
                ["F(l) F(l) -(d) F(l) -(d) F(l) -(d) F(l) -(d) F(l) F(l)", "1.0"]
            ]]
        ]
    },
    {
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants:[
            ["num_gens", 4],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", [
                ["F(l) F(l) -(d) F(l) -(d) F(l) -(d) F(l) -(d) F(l) -(d) F(l) +(d) F(l)", "1.0"]
            ]]
        ]
    },
    {
        axiom: "!(0.1) F(l) -(d) F(l) -(d) F(l) -(d) F(l)",
        constants:[
            ["num_gens", 3],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["F(len)", [
                ["F(l) F(l) -(d) F(l) +(d) F(l) -(d) F(l) -(d) F(l) F(l)", "1.0"]
            ]]
        ]
    },
    {
        axiom: "!(0.1) F(l) X",
        constants:[
            ["num_gens", 10],
            ["l", 1],
            ["d", 90],
        ],
        productions: [
            ["X", [
                ["X +(d) Y F(l) +(d)", "1.0"]
            ]],
            ["Y", [
                ["-(d) F(l) X -(d) Y", "1.0"]
            ]],
        ]
    },
    {
        axiom: "!(0.1) F(l) X",
        constants:[
            ["num_gens", 7],
            ["l", 1],
            ["d", 60],
        ],
        productions: [
            ["X", [
                ["+(d) F(l) Y -(d) F(l) X -(d) F(l) Y +(d)", "1.0"]
            ]],
            ["Y", [
                ["-(d) F(l) X +(d) F(l) Y +(d) F(l) X -(d)", "1.0"]
            ]],
            ["F(len)", [
                ["Z", "1.0"]
            ]]
        ]
    },


]