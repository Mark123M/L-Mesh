import {useRef, useEffect, useState} from "react";
import { Button, TextField, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { v4 as uuidv4 } from "uuid";
import "@fontsource/open-sans";
import React from 'react'
import ReactDOM from 'react-dom'

const Axiom_Input = ({val, setAxiom}) => {
    return(
        <div style={{display: "flex", flexDirection: "row"}}>
        </div>
    )
}

const Const_Input = ({name, val, idx, constants, setConstants}) => { 
    const[nameState, setNameState] = useState(name);
    const [valState, setValState] = useState(val);
    
    useEffect(()=>{
        console.log(name, val, idx, constants);
    },[]);  
    
    //updates the constants array of the parent component
    const update_constants = (e, type) =>{
        console.log("getting updated", e.target, type);
        const cur_array = JSON.parse(JSON.stringify(constants));
        cur_array[idx][type] = e.target.value;
        setConstants(cur_array);
    }
 
    return(
        <div style={{display: "flex", flexDirection: "row", marginBottom: "10px"}}>
            <TextField
                id="outlined-basic"
                className="const-name"
                label="Name"
                value={nameState}
                onChange={(e)=>setNameState(e.target.value)}
                onBlur={(e)=>update_constants(e, 0)}
                size="small"
                style={{width:"150px", marginRight: "10px"}}
            />
            <TextField
                id="outlined-basic"
                className="const-value"
                label="Value"
                value={valState}
                onChange={(e)=>setValState(e.target.value)}
                onBlur={(e)=>update_constants(e, 1)}
                size="small"
                style={{width:"120px"}}
            />
            <IconButton>
                <CloseIcon/>
            </IconButton>
        </div>
    )
}

const Prod_Input = ({name, val, idx, productions, setProductions}) => {

}

const EditorForm = ({init_axiom, init_constants, init_productions, setGlobalAxiom, setGlobalConstants, setGlobalProductions}) => {
    const [axiom, setAxiom] = useState(init_axiom);
    const [constants, setConstants] = useState(init_constants);
    const [productions, setProductions] = useState(init_productions);

    useEffect(()=>{
        console.log("CURRENT CONSTANTS ARE", constants);
    }, [constants])

    const handleConstantInputChange = (val, index, type) =>{
        const new_constants = JSON.parse(JSON.stringify(constants));
        new_constants[index][type] = val;
        setConstants(new_constants);
    }

    const addConstant = () =>{
        const new_constants = JSON.parse(JSON.stringify(constants));
        new_constants.push(["", ""]);
        setConstants(new_constants);
    }

    const removeConstant = (index) =>{
        const new_constants = JSON.parse(JSON.stringify(constants));
        for(let i = index; i < constants.length - 1; i++) {
            new_constants[i] = new_constants[i+1]; //2 3 4 5 6
        }
        new_constants.pop();
        setConstants(new_constants);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
    }

    return(
        <form onSubmit={(e)=>handleSubmit(e)}>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{fontFamily: "Open Sans", marginBottom: "10px"}}> {`Axiom (starting symbols)`}</div>
                <div style={{fontFamily: "Open Sans", marginBottom: "15px", marginTop: "20px"}}> {`Constants`}</div>
                
                {constants.map((c, index)=>(
                    <div key={`const-div-${index}`} style={{display: "flex", flexDirection: "row", marginBottom: "10px"}}>
                        <TextField
                            key={`const-name-${index}`}
                            id="outlined-basic"
                            label="Name"
                            value={c[0]}
                            onChange={(e)=>handleConstantInputChange(e.target.value, index, 0)}
                            size="small"
                            style={{width:"150px", marginRight: "10px"}}
                        />
                        <TextField
                            key={`const-val-${index}`}
                            id="outlined-basic"
                            label="Value"
                            value={c[1]}
                            onChange={(e)=>handleConstantInputChange(e.target.value, index, 1)}
                            size="small"
                            style={{width:"120px"}}
                        />
                         <IconButton size="small" onClick={e=>removeConstant(index)}>
                            <CloseIcon/>
                        </IconButton>
                    </div>
                ))}
                
                <div style={{width: "200px"}}> <Button variant="outlined" onClick={addConstant}>Add Constant</Button> </div>
                
                <div style={{fontFamily: "Open Sans", marginBottom: "15px", marginTop: "20px"}}> {`Production Rules`}</div>
                <div style={{width: "200px"}}> <Button variant="outlined" >Add Rule</Button> </div>

                <div style={{width: "200px"}}> <Button variant="outlined" >Generate Model</Button> </div>
            </div>
        </form>
    )
}

const Editor = () =>{
    const [axiom, setAxiom] = useState("");
    const [constants, setConstants] = useState([["num_gens", 5], ["col_rate", 0.2]]);
    const [productions, setProductions] = useState([[]]);
    
    return(
        <div>
            <h1 style={{fontFamily: "Open Sans"}}> Three Turtle </h1> 
            <Axiom_Input/>
            {/*constants.map((c, index) =>{
                console.log(c[0], ":", c[1]);
                return <Const_Input key={uuidv4()} name = {c[0]} val = {c[1]} idx = {index} constants = {constants} setConstants = {setConstants}/> 
            }) */}
            <EditorForm init_axiom={axiom} init_constants={constants} init_productions={productions} setGlobalAxiom={setAxiom} setGlobalConstants={setConstants} setGlobalProductions={setProductions}/>
            <Const_Input/>
        </div>
    )
}

export default Editor;
