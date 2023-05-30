# L-Mesh
Try it out: https://mark123m.github.io/L-Mesh/

## Reference
L-Mesh is a 3D procedural generation tool for self similar structures. It utilizes the principles of stochastic, parametric L-Systems along with 3D turtle graphics. 
L-Systems can be used to generate anything from trees, herbaceous plants, plant organs, snowflakes, to even city layouts with a great degree of accuracy and organic feel.

Fundamentally, L-Systems consists of an **Alphabet**, an **Axiom**, and **Production Rules**. An Alphabet is a set of symbols containing elements that can be replaced and those that couldn't. An Axiom is the initial set of symbols used for the next generations. Production rules dictate how each symbol of the current generation (predecessors) is replaced in the next generation by new symbols (successors).

Given the following: 
Axiom: A
Production rules: 
  A -> A B
  B -> B B
The next generations of symbols are: {A B} -> {A B B B} -> {A B B B B B B B} -> {A B B B B B B B B B B B B B B B}...

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
~                      TODO
%                      TODO
```

### Stochastic Systems
The current system can already generate
