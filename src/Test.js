export const TestProps = {
    axiom: "!(0.1) A(0)",
    constants: {
        "num_gens": 15,
        "edge": 1,
        "delta": 45,
    },
    productions: {
        "A(k)" : [
            {
                "condition": "k<5",
                "ruleset": [{"rule" : "F(1) A(k+1)", "prob" : "1.0"}],
            },
            {
                "condition": "k>5",
                "ruleset": [{"rule" : "F(1) [ +(30) A(k+1) ] [ -(30) A(k+1) ]", "prob" : "1.0"}],
            },
            {
                "condition": "*",
                "ruleset": [{"rule": "F(1) L A(k+1)", "prob" : "1.0"}],
            }  
        ],
        "L" : [
            {
                "condition": "*",
                "ruleset": [{"rule": "[ ^(delta) ^(delta) { . -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) . -(delta) | -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) } ]", "prob": "1.0"}],
            }
        ]
    },
};