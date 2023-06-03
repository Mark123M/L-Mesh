import {useEffect, useState, useCallback} from "react";
import { Button, TextField, IconButton, Collapse, FormControlLabel, Checkbox, Drawer, Alert, Select, MenuItem, FormControl} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { v4 as uuidv4 } from "uuid";
import "@fontsource/open-sans";
import React from 'react'
import Render from "./Render";
import { allPresets } from "./Presets";
import { TestProps } from "./Test";

const AxiomInput = ({axiom, setAxiom}) => {
    return(
        <TextField
            id="outlined-basic"
            label="Symbols"
            value={axiom}
            onChange={(e)=>setAxiom(e.target.value)}
            size="small"
            style={{width:"150px", marginRight: "8px"}}
            required
        />
    )
}

const ConstantInput = ({name, val, index, handleConstantInputChange}) => {
    return (
        <>
        <TextField
            key={`const-name-${index}`}
            id="outlined-basic"
            label="Name"
            value={name}
            onChange={(e)=>handleConstantInputChange(e.target.value, index, 0)}
            size="small"
            style={{width:"150px", marginRight: "8px"}}
            required
        />
        <TextField
            key={`const-val-${index}`}
            id="outlined-basic"
            label="Value"
            value={val}
            onChange={(e)=>handleConstantInputChange(e.target.value, index, 1)}
            size="small"
            style={{width:"150px"}}
            required
        />
        </>
    )
}

const ProductionSymbolInput = ({name, index, handleProductionSymbolChange}) => {
    return(
        <TextField
            key={`prod-symbol-name-${index}`}
            id="outlined-basic"
            label="Symbol"
            value={name}
            onChange={(e)=>handleProductionSymbolChange(e.target.value.replaceAll(' ', ''), index)}
            size="small"
            style={{width:"150px"}}
            required
        />
    )
}

const ProductionConditionInput = ({condition, index, index2, handleProductionConditionChange}) => {
    return (
        <TextField
            key={`prod-symbol-condition-${index}-${index2}`}
            id="outlined-basic"
            label="Condition"
            value={condition}
            onChange={(e)=>handleProductionConditionChange(e.target.value, index, index2)}
            size="small"
            style={{width:"150px"}}
            required
        />
    )
}

const ProductionRuleInput = ({rule, prob, index, index2, index3, handleProductionRuleChange}) => {
    return (
        <>
        <TextField
            key={`prod-rule-name-${index}-${index2}-${index3}`}
            id="outlined-textarea"
            label="rule"
            value={rule}
            onChange={(e)=>handleProductionRuleChange(e.target.value, index, index2, index3, 0)}
            size="small"
            style={{width:"100%",marginTop: "8px", marginBottom: "8px"}}
            multiline
            required
        />
        <TextField
            key={`prod-rule-prob-${index}-${index2}-${index3}`}
            id="outlined-basic"
            label="p"
            value={prob}
            onChange={(e)=>handleProductionRuleChange(e.target.value, index, index2, index3, 1)}
            size="small"
            style={{width:"100%"}}
            required
        />
        
        </>
    )
}

const ButtonIcon = ({icon, onClick}) => {
    return(
        <div style={{width: "25px", height: "25px", marginLeft: "5px", marginTop: "3px"}}>
            <IconButton onClick={onClick} size="small">
                {icon}
            </IconButton>
        </div>
    )
}

const EditorForm = ({init_axiom, init_constants, init_productions, setGlobalAxiom, setGlobalConstants, setGlobalProductions, error, setError, showGridHelper, setShowGridHelper, dpr, setDpr}) => {
    const [axiom, setAxiom] = useState(init_axiom);
    const [constants, setConstants] = useState(init_constants);
    const [productions, setProductions] = useState(init_productions);
    const [drawerWidth, setDrawerWidth] = useState(650);
    const [productionsSymbolExpand, setProductionsSymbolExpand] = useState(true);
    const [productionsRuleExpand, setProductionsRuleExpand] = useState([])
    const [constantsExpand, setConstantsExpand] = useState(true);
    const [preset, setPreset] = useState("");
    const [animation, setAnimation] = useState(true);
    const [menuOpened, setMenuOpened] = useState(false);
    
    const minDrawerWidth = 30;

    useEffect(()=>{
        console.log("CURRENT PRODUCTIONS ARE", productions);
        const newProductionsExpand = [...productionsRuleExpand];
        while(newProductionsExpand.length < productions.length) {
            newProductionsExpand.push(true);
        }
        setProductionsRuleExpand(newProductionsExpand);
    }, [axiom, constants, productions])

    useEffect(()=>{
        console.log('CURRENT EXPANSION', productionsRuleExpand)
    }, [productionsRuleExpand])

    const handleConstantInputChange = (val, index, type) =>{
        const new_constants = JSON.parse(JSON.stringify(constants));
        new_constants[index][type] = val;
        setConstants(new_constants);
    }

    const addConstant = () =>{
        const new_constants = JSON.parse(JSON.stringify(constants));
        new_constants.push(["", ""]);
        setConstants(new_constants);
        setConstantsExpand(true);
    }

    const removeConstant = (index) =>{
        const new_constants = JSON.parse(JSON.stringify(constants));
        for(let i = index; i < constants.length - 1; i++) {
            new_constants[i] = new_constants[i+1]; //2 3 4 5 6
        }
        new_constants.pop();
        setConstants(new_constants);
    }

    const handleProductionSymbolChange = (val, index) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        new_productions[index][0] = val;
        setProductions(new_productions);
    }

    const handleProductionConditionChange = (val, index, index2) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        new_productions[index][1][index2][0] = val;
        setProductions(new_productions);
    }

    const handleProductionRuleChange = (val, index, index2, index3, type) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        console.log(val, index, index2, index3, type, new_productions[index][1][index2][1][index3]);
        new_productions[index][1][index2][1][index3][type] = val;
        setProductions(new_productions);
    }

    const addProductionSymbol = () => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        new_productions.push(["", [["*",[["", ""]]]]]);
        setProductions(new_productions);
        setProductionsSymbolExpand(true);
    }

    const addProductionRuleset = (index) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        const newProductionsExpand = [...productionsRuleExpand];
        new_productions[index][1].push(["*", [["", ""]]]);
        newProductionsExpand[index] = true;

        setProductions(new_productions);
        setProductionsRuleExpand(newProductionsExpand);
    }
    

    const addProductionRule = (index, index2) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        const newProductionsExpand = [...productionsRuleExpand];
        //console.log(new_productions[index]);
        new_productions[index][1][index2][1].push(["", ""]);
        newProductionsExpand[index] = true;

        setProductions(new_productions);
        setProductionsRuleExpand(newProductionsExpand);
    } 

    const removeProductionSymbol = (index) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        const newProductionsExpand = [...productionsRuleExpand]; //shallow copy
        for(let i = index; i < productions.length - 1; i++) {
            new_productions[i] = new_productions[i+1]; //2 3 4 5 6
            newProductionsExpand[i] = newProductionsExpand[i+1];
        }
        new_productions.pop();
        newProductionsExpand.pop();
        setProductions(new_productions);
        setProductionsRuleExpand(newProductionsExpand);
    }

    const removeProductionRuleset = (index, index2) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        for(let i = index2; i < productions[index][1].length - 1; i++) {
            new_productions[index][1][i] = new_productions[index][1][i+1];
        }
        new_productions[index][1].pop();
        setProductions(new_productions);
    }

    const removeProductionRule = (index, index2, index3) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        for(let i = index3; i < productions[index][1][index2][1].length - 1; i++) {
            new_productions[index][1][index2][1][i] = new_productions[index][1][index2][1][i+1];
        }
        new_productions[index][1][index2][1].pop();
        setProductions(new_productions);
    }


    const handleSubmit = (e) =>{ //trigger rerender everytime by setting a random state from render component
        e.preventDefault();
        setError("");
        setGlobalAxiom(axiom);
        setGlobalConstants(constants);
        setGlobalProductions(productions);
    }

    const handleMouseDown = (e) => {
        document.addEventListener("mouseup", handleMouseUp, true);
        document.addEventListener("mousemove", handleMouseMove, true);
    };
    const handleMouseUp = () => {
        document.removeEventListener("mouseup", handleMouseUp, true);
        document.removeEventListener("mousemove", handleMouseMove, true);
    };
    const handleMouseMove = useCallback(e => {
        const newWidth = e.clientX - document.body.offsetLeft;
        if (newWidth > minDrawerWidth) {
          setDrawerWidth(newWidth);
        }
    }, []);
    const handleProductionsExpand = (index) => {
        //console.log("INDEX CLICKED", index, "NEW STATE", productionsRuleExpand.splice(index, 1, !productionsRuleExpand[index]));
        const newProductionsExpand = [...productionsRuleExpand];
        newProductionsExpand[index] = !newProductionsExpand[index];
        setProductionsRuleExpand(newProductionsExpand);
    }
    const toggleConstantsExpand = () => {
        setConstantsExpand(!constantsExpand);
    }
    const toggleProductionsSymbolExpand = () => {
        setProductionsSymbolExpand(!productionsSymbolExpand);
    }

    const openMenu = () => {
        setMenuOpened(true);
    }
    const closeMenu = () => {
        setMenuOpened(false);
    }
    const toggleGridHelper = () => {
        setShowGridHelper(!showGridHelper);
    }

    useEffect(() => {
        console.log("PRESET VALUE IS", preset, allPresets);
        if(preset != "") {
            setAxiom(allPresets[preset].axiom);
            setConstants(allPresets[preset].constants);
            setProductions(allPresets[preset].productions);
        } 
        
    }, [preset]);
    useEffect(()=> {
        console.log(menuOpened ? "menu is opened" : "menu is not opened");
    }, [menuOpened])
    

    return(
        <div style={{height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden"}}>
            <div style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "50px", zIndex: 99999, background: "white",display: "flex", flexDirection: "row", alignItems: "center", borderWidth: "2px", borderColor: "gray", borderStyle: "none none solid none"}}>
                <div style={{display:"flex", fontFamily: "Open Sans", color: "black", fontSize: "22px", fontWeight: 600, marginLeft: "10px"}}> {`L-Mesh`}</div>
                
                <div style={{marginLeft: "8px"}}>
                    <FormControl fullWidth>
                        <Select
                            id="demo-simple-select"
                            placeholder="Select preset"
                            value={preset}
                            onChange={e=>setPreset(e.target.value)}
                            size="small"
                            sx={{width: "200px", height: "37px"}}
                            displayEmpty
                        >
                            <MenuItem value="">
                                <em>Select Preset</em>
                            </MenuItem>
                            <MenuItem value={1}>Bush</MenuItem>
                            <MenuItem value={2}>Flower Plant</MenuItem>
                            <MenuItem value={3}>Koch curve 1</MenuItem>
                            <MenuItem value={4}>Koch curve 2</MenuItem>
                            <MenuItem value={5}>Koch curve 3</MenuItem>
                            <MenuItem value={6}>Koch curve 4</MenuItem>
                            <MenuItem value={7}>Dragon Curve</MenuItem>
                            <MenuItem value={8}>Sierpiński triangle</MenuItem>
                            <MenuItem value={9}>Monopodial tree</MenuItem>
                            <MenuItem value={10}>Sympodial tree</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <FormControlLabel control={<Checkbox />} label="Animation" />
                <FormControlLabel control={<Checkbox onClick={toggleGridHelper} defaultChecked />} label="Show Grid" />
                <TextField
                    id="outlined-basic"
                    label="res"
                    defaultValue={dpr}
                    //onChange={(e)=>setLocalDpr(e.target.value)}
                    onBlur={e=>setDpr(e.target.value)}
                    size="small"
                    sx={{width: "80px"}}
                    //style={{height: "30px"}}
                    required
                />
                <div style={{width: "160px"}} className="camera-reset-button"> <Button sx={{width: "100%"}} variant="outlined" >Center Camera</Button> </div>
                <div style={{width: "110px"}} className="reference-button"> <Button sx={{width: "100%"}} variant="contained" >Reference</Button> </div>
                <div style={{display: "flex", flexDirection: "column", marginTop: menuOpened ? "70px" : "0px"}}>
                    <div style={{width: "90px"}} onMouseEnter={openMenu} onMouseLeave={closeMenu}> <Button sx={{width: "100%"}} variant="contained" >EXPORT</Button> </div>
                    <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{display: menuOpened? "inline" : "none", flexDirection: "column", zIndex:  999999, background: "white", borderColor: "gray", borderStyle: "solid solid solid solid", borderWidth: "1px"}}>
                        <div className="scene-export-obj-button"> <MenuItem>Export as OBJ</MenuItem> </div>
                        <div className="scene-export-gltf-button">  <MenuItem>Export as GLTF</MenuItem> </div>
                    </div>
                </div>
       
            </div>
            
            <form onSubmit={(e)=>handleSubmit(e)} style={{marginLeft: "10px"}}>
                <Drawer
                    sx={{
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                > 
                    <div style={{display: "flex", flexDirection: "row", overflow: "hidden"}}>
                        <div style={{display: "flex", flexDirection: "column", marginLeft: "10px", width: "100%", overflowX: "hidden", overflowY: "auto"}}>

                            <div style={{marginBottom: "8px", marginTop: "50px"}}>
                                {error !="" && <Alert severity="error"> {error} </Alert>}
                            </div>
                            
                            <div style={{marginBottom: "8px"}}>
                                <div style={{fontFamily: "Open Sans", fontWeight: 500, marginBottom: "10px"}}> {`Axiom (starting symbols)`}</div>
                                <AxiomInput axiom={axiom} setAxiom={setAxiom}/>
                            </div>

                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{fontFamily: "Open Sans", fontWeight: 500, marginBottom: "10px", marginTop: "8px"}}> {`Constants`}</div>
                                {constantsExpand ? 
                                <ButtonIcon icon={<ExpandMore />} onClick = {toggleConstantsExpand}/>
                                : 
                                <ButtonIcon icon={<ExpandLess />} onClick = {toggleConstantsExpand}/>} 
                                <ButtonIcon icon={<AddCircleOutlineIcon/>} onClick = {addConstant}/>
                            </div>
                            
                            <div style={{display: "flex", flexDirection: "column", marginBottom: "8px"}}>
                                <div>
                                    <Collapse in={constantsExpand} timeout="auto" unmountOnExit>
                                        {constants.map((c, index)=>(
                                            <div key={`const-div-${index}`} style={{display: "flex", flexDirection: "row", marginBottom: "8px"}}>
                                                <ConstantInput name={c[0]} val={c[1]} index={index} handleConstantInputChange={handleConstantInputChange}/>
                                                <ButtonIcon icon={<CloseIcon/>} onClick={e=>removeConstant(index)} key={`const-button-${index}`}/>
                                            </div>
                                        ))}
                                    </Collapse>
                                </div>
                            </div>
                            
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{fontFamily: "Open Sans", fontWeight: 500, marginBottom: "10px", marginTop: "8px"}}> {`Production Rules`}</div>
                                <div style={{width: "100px", display: "flex", flexDirection: "row"}}>
                                    {productionsSymbolExpand ? 
                                        <ButtonIcon icon={<ExpandMore/>} onClick={toggleProductionsSymbolExpand}/>
                                        : 
                                        <ButtonIcon icon={<ExpandLess/>} onClick={toggleProductionsSymbolExpand}/>} 
                        
                                    <ButtonIcon icon={<AddCircleOutlineIcon/>} onClick={addProductionSymbol}/>
                                </div>
                            </div>

                            <div style={{display: "flex", flexDirection: "column", marginBottom: "20px"}}>
                                <div>
                                    <Collapse in={productionsSymbolExpand} timeout="auto" unmountOnExit>
                                        {productions.map((p, index)=>(
                                            <div key={`prod-div-${index}`} style={{display: "flex", flexDirection: "column", marginBottom: index == productions.length - 1 ? "-2px" : "8px"}}>
                                                <div key={`prod-symbol-div-${index}`} style={{display: "flex", flexDirection: "row", marginBottom: "8px"}}>
                                                    <ProductionSymbolInput name={p[0]} index={index} handleProductionSymbolChange={handleProductionSymbolChange}/>
                                                    {productionsRuleExpand[index] ? 
                                                    <ButtonIcon icon = {<ExpandMore/>} onClick = {e=>handleProductionsExpand(index)}/>
                                                    : 
                                                    <ButtonIcon icon = {<ExpandLess/>} onClick = {e=>handleProductionsExpand(index)}/>}
                                                    <ButtonIcon icon={<AddCircleOutlineIcon/>} onClick={(e)=>{addProductionRuleset(index)}}/>
                                                    <ButtonIcon key={`prod-symbol-button-${index}`} icon = {<CloseIcon/>} onClick={e=>removeProductionSymbol(index)}/>
                                                </div>
                                                <Collapse sx={{marginLeft: 2}} in={productionsRuleExpand[index]} timeout="auto" unmountOnExit>
                                                    {p[1].map((rs, index2)=>{
                                                        //console.log(p, r);
                                                        return(
                                                        <div key={`prod-ruleset-div-${index}-${index2}`} style={{display: "flex", flexDirection: "column", marginBottom: "8px", width: "100%"}}>
                                                            <div style={{display: "flex", flexDirection: "row"}}>
                                                                <ProductionConditionInput condition = {rs[0]} index = {index} index2 = {index2} handleProductionConditionChange = {handleProductionConditionChange}/>
                                                                <ButtonIcon icon={<AddCircleOutlineIcon/>} onClick={(e)=>addProductionRule(index, index2)}/>
                                                                <ButtonIcon icon={<CloseIcon/>} onClick={(e)=>removeProductionRuleset(index, index2)}/>
                                                            </div>
                                                            
                                                            {rs[1].map((r, index3)=>(
                                                                <div key = {`prod-rule-div-${index}-${index2}-${index3}`} style={{display: "flex", width: "100%", flexDirection: "row"}}>
                                                                    <div key = {`prod-rule-inner-div-${index}-${index2}-${index3}`} style={{display: "flex", flexDirection: "column", marginLeft: "18px", width: "100%"}}>
                                                                        <ProductionRuleInput rule={r[0]} prob={r[1]} index={index} index2 = {index2} index3={index3} handleProductionRuleChange={handleProductionRuleChange}/>
                                                                    </div>
                                                                    <ButtonIcon icon={<CloseIcon/>} onClick={(e)=>removeProductionRule(index, index2, index3)}/>
                                                                </div>
                                                            ))}
                                                        </div>)
                                                    })}
                                                </Collapse>
                                            </div>
                                        ))}
                                    </Collapse>
                                </div>
                            </div>
                            <div style={{width: "200px"}}> <Button variant="contained" type="submit" >Generate Model</Button> </div>
                        </div>

                        <div onMouseDown={e => handleMouseDown(e)} style={{display: "flex", flexDirection: "column", cursor: "ew-resize", width: "4px", height: "100vh", borderStyle: "none double none none", borderColor: "gray", borderWidth: "4px"}}/>
                         
                
                    </div>
                </Drawer>
                
            </form>
        </div>
    )
}

const Editor = () =>{
    const [axiom, setAxiom] = useState("!(0.1) A(0)");
    const [constants, setConstants] = useState([["num_gens", 15], ["col_rate", 0.2]]);
    const [productions, setProductions] = useState([
        ["A(k)", 
            [["k<5", 
                [["F(1) A(k+1)", "1.0"],]
            ],
            ["k>5", 
                [["F(1) [ +(30) A(k+1) ] [ -(30) A(k+1) ]", "1.0"],]
            ],
            ["*",
                [["F(1) L A(k+1)", "1.0"],]
            ]]
        ], 
        ["L",
            [["*",
                [["[ ^(30) ^(30) { . -(30) f(1) . +(30) f(1) . +(30) f(1) . -(30) | -(30) f(1) . +(30) f(1) . +(30) f(1) } ]", "1.0"]]
            ]],
        ]
    ]); //forgor to separate AA's with spaces
    const [error, setError] = useState("");
    const [showGridHelper, setShowGridHelper] = useState(true);
    const [dpr, setDpr] = useState(1);

    useEffect(() => {
        console.log("ERROR IS" ,error);
    }, [error]);

    const getConstants = (constants) => {
        let constantsObj = {};
        for(let i = 0; i < constants.length; i++) {
            constantsObj[constants[i][0]] = JSON.parse(constants[i][1]);
        }
        return constantsObj;
    }

    const getProductions = (productions) => {
        let productionsObj = {};
        for(let i = 0; i < productions.length; i++) {
            let rulesetArray = [];
            for(let j = 0; j < productions[i][1].length; j++) {
                //rulesetArray.push({condition: productions[i][1][j][0], prob: productions[i][1][j][1]});
                //ruleObj[productions[i][1][j][0]] = productions[i][1][j][1];
                let ruleArray = [];
                for(let k = 0; k < productions[i][1][j][1].length; k++) {
                    ruleArray.push({rule: productions[i][1][j][1][k][0], prob: productions[i][1][j][1][k][1]});
                }
                rulesetArray.push({condition: productions[i][1][j][0], ruleset: ruleArray});
            }
            productionsObj[productions[i][0]] = rulesetArray;
        }
        return productionsObj;
    }
    
    useEffect(()=>{
        /*console.log("THE GLOBAL STATES ARE: ");
        console.log(axiom);
        console.log(constants);
        console.log(productions);
        console.log("REAL CONSTANTS ARE", getConstants(constants));
        console.log("REAL PRODUCTIONS ARE", getProductions(productions)); */
    },[axiom, constants, productions])

    return(
        <div style={{position: "absolute", top: "0", left: "0", bottom: "0", right: "0", overflow: "hidden"} }>
            <div style={{display: "flex", flexDirection: "row"}}>
                <EditorForm init_axiom={axiom} init_constants={constants} init_productions={productions} setGlobalAxiom={setAxiom} setGlobalConstants={setConstants} setGlobalProductions={setProductions} error={error} setError={setError} showGridHelper={showGridHelper} setShowGridHelper={setShowGridHelper} dpr={dpr} setDpr={setDpr} />
                {<Render axiom = {axiom} constants = {getConstants(constants)} productions = {getProductions(productions)} setError={setError} showGridHelper={showGridHelper} dpr={dpr}/> }
                {/*<Render axiom = {TestProps.axiom} constants = {TestProps.constants} productions = {TestProps.productions} setError = {setError} showGridHelper = {showGridHelper} dpr = {dpr}/> */}
            </div>
        </div>
    )
}

export default Editor;
