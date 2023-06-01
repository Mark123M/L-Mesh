import Render from "./Render";

export const Test = {
    axiom: "A(0)",
    constants: {
        "num_gens": 5,
    },
    productions: {
        "A(k)" : [
            {"rule" : "F(1) A(k+1)", "prob" : "1.0"}
        ]
    },
};