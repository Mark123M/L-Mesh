# L-Mesh
Try it out: https://mark123m.github.io/L-Mesh/

## Intro
L-Mesh is a 3D procedural generation tool for self similar structures. It utilizes the principles of stochastic, parametric L-Systems along with 3D turtle graphics. 
L-Systems can be used to generate anything from trees, herbaceous plants, plant organs, snowflakes, to even city layouts with a great degree of accuracy and organic feel.

Fundamentally, L-Systems consists of an **Alphabet**, an **Axiom**, and **Production Rules**. An Alphabet is a set of symbols containing elements that can be replaced and those that couldn't. An Axiom is the initial set of symbols used for the next generations. Production rules dictate how each symbol of the current generation (predecessors) is replaced in the next generation by new symbols (successors).

Given the following:  <br/>
Axiom: A <br/>
Production rules: <br/>
  A -> A B <br/>
  B -> B B <br/>
The next generations of symbols are: {A B} -> {A B B B} -> {A B B B B B B B} -> {A B B B B B B B B B B B B B B B}... <br/>

## Graphics Interpreter
To generate 3D structures from a set of symbols, some symbols need to be interpreted with graphics commands. L-Mesh uses a 3D turtle graphics system described in the Algorithmic Beauty of Plants. A "turtle" is similar to a pen that stores it's current position, heading vector (H), left vector (L), up vector (U) where H = L x U. It also stores the stroke width, color, whether or not the "pen" is down, and whether or not to create a vertex. 

```
F (len)                Move len units from its current position with direction vector H while drawing a line. 
f (len)                Move len units from its current position with direction vector H.
+ (angle)              Turn left (rotate along the U axis)
- (angle)              Turn right (rotate along the U axis)
^ (angle)              Pitch up (rotate along the L axis)
& (angle)              Pitch down (rotate along the L axis)
\ (angle)              Roll left (rotate along the H axis)
/ (angle)              Roll right (rotate along the H axis)
|                      "Turn around", or turn by 180 degrees
$                      Rotate to vertical (rotates turtle so the up vector is [0 1 0]<sup>T</sup>
[                      Push the current state into a stack (start a branch)
]                      Pop a state from the stack (finish a branch)
{                      Start a polygon
.                      Record a vertex in the current polygon
}                      Complete a polygon
! (wid)                Change the width of line
` (col)                Change the color
T (vector)             Change the tropism vector
t (e)                  Change the tropism constant 
~                      TODO
%                      TODO
```

## Stochastic Systems
For natural looking models, each rule can be assigned a weighted probability. 
TODO

## Parametric Systems
Each symbol can be assigned parameters in the production rules. These parameters can then be used for the rule (successor symbols) and the weighted probability. Parameters can also be used for conditions to choose the next successor symbols or send development signals to other parts of your model. <br/>

New parameters can be derived using mathematical expressions: [MathJS Expressions](https://mathjs.org/docs/expressions/)
TODO

## Techniques (open to other ideas)
1. Node rewriting
2. Edge rewriting
3. Controlled parameters (gradually increase/decrease a param)
4. Developmental signals (ex. after 5 generations, render a flower)
5. Dynamic probability (ex. the smaller the branch, the greater its tropism constant)
6. Monopodial Branching
7. Sympodial Branching
8. Merging mesh for performance
9. Randomize values (ex. the next branch should turn by a random value within (16, 30))
10. Modularizing
11. Assigning to primitives
12. Simulating tropisms (gravity, light, wind) 

## Sources
Prusinkiewicz, Przemyslaw; Lindenmayer, Aristid (1990). The Algorithmic Beauty of Plants. Springer-Verlag. pp. 101–107. ISBN 978-0-387-97297-8. <br/>
[Houdini Kitchen ](https://www.houdinikitchen.net/wp-content/uploads/2019/12/L-systems.pdf) <br/>
[Algorithmic Botany ](https://algorithmicbotany.org/) <br/>
[React Three Fiber (Three Js) Docs](https://docs.pmnd.rs/) 
