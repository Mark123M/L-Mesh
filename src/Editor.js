import {useRef, useEffect, useState, useCallback} from "react";
import { Button, TextField, IconButton, List, ListItem, Collapse, Divider, InputLabel, OutlinedInput, InputAdornment, Drawer, ListItemButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { v4 as uuidv4 } from "uuid";
import "@fontsource/open-sans";
import React from 'react'
import ReactDOM from 'react-dom'
import Render from "./Render";


const ParamInput = ({name, val, idx, constants, setConstants}) => { 
 
    return(
        <OutlinedInput></OutlinedInput>
    )
}

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
            onChange={(e)=>handleProductionSymbolChange(e.target.value, index)}
            size="small"
            style={{width:"150px"}}
            required
        />
    )
}

const ProductionRuleInput = ({rule, prob, index, index2, handleProductionRuleChange}) => {
    return (
        <>
        <TextField
            key={`prod-rule-name-${index}-${index2}`}
            id="outlined-textarea"
            label="rule"
            value={rule}
            onChange={(e)=>handleProductionRuleChange(e.target.value, index, index2, 0)}
            size="small"
            style={{width:"100%", marginRight: "8px"}}
            multiline
            required
        />
        <TextField
            key={`prod-rule-prob-${index}-${index2}`}
            id="outlined-basic"
            label="p"
            value={prob}
            onChange={(e)=>handleProductionRuleChange(e.target.value, index, index2, 1)}
            size="small"
            style={{width:"80px"}}
            required
        />
        
        </>
    )
}

const EditorForm = ({init_axiom, init_constants, init_productions, setGlobalAxiom, setGlobalConstants, setGlobalProductions}) => {
    const [axiom, setAxiom] = useState(init_axiom);
    const [constants, setConstants] = useState(init_constants);
    const [productions, setProductions] = useState(init_productions);
    const [drawerWidth, setDrawerWidth] = useState(700);
    const [productionsSymbolExpand, setProductionsSymbolExpand] = useState(true);
    const [productionsRuleExpand, setProductionsRuleExpand] = useState([])
    const [constantsExpand, setConstantsExpand] = useState(true);
    const minDrawerWidth = 30;

    useEffect(()=>{
        //console.log("CURRENT PRODUCTIONS ARE", productions);
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

    const handleProductionRuleChange = (val, index, index2, type) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        new_productions[index][1][index2][type] = val;
        setProductions(new_productions);
    }

    const addProductionSymbol = () => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        new_productions.push(["", [["", ""]]]);
        setProductions(new_productions);
        setProductionsSymbolExpand(true);
    }
    const addProductionRule = (index) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        const newProductionsExpand = [...productionsRuleExpand];
        //console.log(new_productions[index]);
        new_productions[index][1].push(["", ""]);
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
    const removeProductionRule = (index, index2) => {
        const new_productions = JSON.parse(JSON.stringify(productions));
        for(let i = index2; i < productions[index][1].length - 1; i++) {
            new_productions[index][1][i] = new_productions[index][1][i+1];
        }
        new_productions[index][1].pop();
        setProductions(new_productions);
    }


    const handleSubmit = (e) =>{
        e.preventDefault();
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

    return(
        <div style={{height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden"}}>
            <div style={{position: "fixed", top: 0, left: 0, width: "100vw", zIndex: 99999, background: "#27a243",display: "flex", flexDirection: "row", alignItems: "center"}}>
                <div style={{display:"flex", fontFamily: "Open Sans", color: "white", fontSize: "22px", fontWeight: 500, marginBottom: "10px", marginLeft: "10px"}}> {`L-Mesh`}</div>
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
                        <div style={{display: "flex", flexDirection: "column", marginLeft: "10px", width: "100%", overflow: "auto"}}>
                            <div style={{marginBottom: "8px", marginTop: "50px"}}>
                                <div style={{fontFamily: "Open Sans", fontWeight: 500, marginBottom: "10px"}}> {`Axiom (starting symbols)`}</div>
                                <AxiomInput axiom={axiom} setAxiom={setAxiom}/>
                            </div>

                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{fontFamily: "Open Sans", fontWeight: 500, marginBottom: "10px", marginTop: "10px"}}> {`Constants`}</div>
                                <div style={{width: "25px", height: "25px"}}>
                                    {constantsExpand ? 
                                    <IconButton onClick={toggleConstantsExpand}>
                                        <ExpandMore /> 
                                    </IconButton>: 
                                    <IconButton onClick={toggleConstantsExpand}>
                                        <ExpandLess /> 
                                    </IconButton>} 
                                </div>
                            </div>
                            
                            <div style={{display: "flex", flexDirection: "column", marginBottom: "12px"}}>
                                <div>
                                    <Collapse in={constantsExpand} timeout="auto" unmountOnExit>
                                        {constants.map((c, index)=>(
                                            <div key={`const-div-${index}`} style={{display: "flex", flexDirection: "row", marginBottom: "8px"}}>
                                                <ConstantInput name={c[0]} val={c[1]} index={index} handleConstantInputChange={handleConstantInputChange}/>
                                                <IconButton sx={{width: "25px", height: "25px"}} key={`const-button-${index}`} size="small" onClick={e=>removeConstant(index)}>
                                                    <CloseIcon/>
                                                </IconButton>
                                            </div>
                                        ))}
                                    </Collapse>
                                </div>
                                <div style={{width: "200px"}}> <Button variant="outlined" size="small" onClick={addConstant}>+ Constant</Button> </div>
                            </div>
                            
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{fontFamily: "Open Sans", fontWeight: 500, marginBottom: "10px", marginTop: "10px"}}> {`Production Rules`}</div>
                                <div style={{width: "25px", height: "25px"}}>
                                    {productionsSymbolExpand ? 
                                    <IconButton onClick={toggleProductionsSymbolExpand}>
                                        <ExpandMore /> 
                                    </IconButton>: 
                                    <IconButton onClick={toggleProductionsSymbolExpand}>
                                        <ExpandLess /> 
                                    </IconButton>} 
                                </div>
                            </div>

                            <div style={{display: "flex", flexDirection: "column", marginBottom: "20px"}}>
                                <div>
                                    <Collapse in={productionsSymbolExpand} timeout="auto" unmountOnExit>
                                        {productions.map((p, index)=>(
                                            <div key={`prod-div-${index}`} style={{display: "flex", flexDirection: "column", marginBottom: "8px"}}>
                                                <div key={`prod-symbol-div-${index}`} style={{display: "flex", flexDirection: "row", marginBottom: "8px"}}>
                                                    <ProductionSymbolInput name={p[0]} index={index} handleProductionSymbolChange={handleProductionSymbolChange}/>
                                                    <IconButton key={`prod-symbol-button-${index}`} size="small" onClick={e=>removeProductionSymbol(index)}>
                                                        <CloseIcon/>
                                                    </IconButton>
                                                    {productionsRuleExpand[index] ? 
                                                    <IconButton onClick={e=>handleProductionsExpand(index)}>
                                                        <ExpandMore /> 
                                                    </IconButton>: 
                                                    <IconButton onClick={e=>handleProductionsExpand(index)}>
                                                        <ExpandLess /> 
                                                    </IconButton>}
                                            
                                                </div>
                                                <Collapse sx={{marginLeft: 2}} in={productionsRuleExpand[index]} timeout="auto" unmountOnExit>
                                                    {p[1].map((r, index2)=>{
                                                        //console.log(p, r);
                                                        return(
                                                        <div key={`prod-rule-div-${index}-${index2}`} style={{display: "flex", flexDirection: "row", marginBottom: "8px"}}>
                                                            <ProductionRuleInput rule = {r[0]} prob = {r[1]} index = {index} index2 = {index2} handleProductionRuleChange = {handleProductionRuleChange}/>
                                                            <IconButton sx={{width: "25px", height: "25px"}} key={`prod-rule-button-${index}-${index2}`} size="small" onClick={e=>removeProductionRule(index, index2)}>
                                                                <CloseIcon/>
                                                            </IconButton>
                                                        </div>)
                                                    })}
                                                </Collapse>
                                                <div style={{width: "200px", marginBottom:"10px"}}> <Button variant="outlined" size="small" onClick={e=>addProductionRule(index)}>+ Rule</Button> </div>
                                            </div>
                                        ))}
                                    </Collapse>
                                </div>
                                <div style={{width: "200px"}}> <Button variant="outlined" size="small" onClick={addProductionSymbol}>+ Production</Button> </div>
                            </div>
                            <div style={{width: "200px"}}> <Button variant="outlined" type="submit" >Generate Model</Button> </div>
                        </div>

                        <div onMouseDown={e => handleMouseDown(e)} style={{display: "flex", flexDirection: "column", cursor: "ew-resize", width: "4px", height: "100vh", borderStyle: "none double none none", borderColor: "gray", borderWidth: "4px"}}/>
                         
                
                    </div>
                </Drawer>
                
            </form>
        </div>
    )
}

const Editor = () =>{
    const [axiom, setAxiom] = useState("A");
    const [constants, setConstants] = useState([["num_gens", 5], ["col_rate", 0.2]]);
    const [productions, setProductions] = useState([["A", [["A A", 0.5], ["A", 0.5]] ], ["B", [["B B", 0.5], ["B", 0.5]]]]); //forgor to separate AA's with spaces

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
            let ruleArray = [];
            for(let j = 0; j < productions[i][1].length; j++) {
                ruleArray.push({rule: productions[i][1][j][0], prob: productions[i][1][j][1]});
                //ruleObj[productions[i][1][j][0]] = productions[i][1][j][1];
            }
            productionsObj[productions[i][0]] = ruleArray;
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
                <EditorForm init_axiom={axiom} init_constants={constants} init_productions={productions} setGlobalAxiom={setAxiom} setGlobalConstants={setConstants} setGlobalProductions={setProductions}/>
                {<Render axiom = {axiom} constants = {getConstants(constants)} productions = {getProductions(productions)}/> }
            </div>
        </div>
    )
}

export default Editor;
