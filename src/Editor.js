/* eslint-disable react-hooks/rules-of-hooks */
import {useEffect, useState, useCallback} from "react";
import { Button, TextField, IconButton, Collapse, Divider, FormControlLabel, Checkbox, Drawer, Alert, Select, MenuItem, FormControl, Typography, Modal, Box, Snackbar} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { v4 as uuidv4 } from "uuid";
import "@fontsource/open-sans";
import React from 'react'
import Render from "./Render";
import { publicPresets } from "./Presets";
import { TestProps } from "./Test";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { Mesh } from "three";
import { Navbar } from "./components/Navbar";
import { apiService, getCookie } from "./services/apiService";
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from './reducers/userSlice'

const initPreset = {
    name: "Select a preset",
    axiom: "",
    constants: [["num_gens", 4],],
    productions: [
        ["", 
            [["*", 
                [["", "1.0"],]
            ],]
        ],
    ],
    meshImports: []
}

const AxiomInput = ({axiom, setAxiom}) => {
    return(
        <TextField
            key = {axiom}
            variant="outlined"
            label="Symbols"
            defaultValue={axiom}
            onBlur={(e)=>setAxiom(e.target.value)}
            size="small"
            style={{width:"100%", marginRight: "8px"}}
            required
        />
    )
}

const ConstantInput = ({name, val, index, handleConstantInputChange}) => {
    return (
        <>
        <TextField
            key={`const-name-${index}-${name}`}
            variant="outlined"
            label="Name"
            defaultValue={name}
            onBlur={(e)=>handleConstantInputChange(e.target.value, index, 0)}
            size="small"
            style={{width:"150px", marginRight: "8px"}}
            required
        />
        <TextField
            key={`const-val-${index}-${val}`}
            variant="outlined"
            label="Value"
            defaultValue={val}
            onBlur={(e)=>handleConstantInputChange(e.target.value, index, 1)}
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
            key={`prod-symbol-name-${index}-${name}`}
            variant="outlined"
            label="Symbol"
            defaultValue={name}
            onBlur={(e)=>handleProductionSymbolChange(e.target.value.replaceAll(' ', ''), index)}
            size="small"
            style={{width:"250px"}}
            required
        />
    )
}

const ProductionConditionInput = ({condition, index, index2, handleProductionConditionChange}) => {
    return (
        <TextField
            key={`prod-symbol-condition-${index}-${index2}-${condition}`}
            variant="outlined"
            label="Condition"
            defaultValue={condition}
            onBlur={(e)=>handleProductionConditionChange(e.target.value, index, index2)}
            size="small"
            style={{width:"234px"}}
            required
        />
    )
}

const ProductionRuleInput = ({rule, prob, index, index2, index3, handleProductionRuleChange}) => {
    return (
        <>
        <TextField
            key={`prod-rule-name-${index}-${index2}-${index3}-${rule}`}
            variant="outlined"
            label="rule"
            defaultValue={rule}
            onBlur={(e)=>handleProductionRuleChange(e.target.value, index, index2, index3, 0)}
            size="small"
            style={{width:"100%",marginTop: "8px", marginBottom: "8px"}}
            multiline
            required
        />
        <TextField
            key={`prod-rule-prob-${index}-${index2}-${index3}-${prob}`}
            variant="outlined"
            label="p"
            defaultValue={prob}
            onBlur={(e)=>handleProductionRuleChange(e.target.value, index, index2, index3, 1)}
            size="small"
            style={{width:"100%"}}
            required
        />
        
        </>
    )
}

const MeshImportInput = ({name, file, index, handleMeshImportChange}) => {
    return (
        <>
        <TextField
            key={`mesh-name-${index}-${name}`}
            variant="outlined"
            label="Name"
            defaultValue={name}
            onBlur={(e)=>handleMeshImportChange(e.target.value, index, 0)}
            size="small"
            style={{width:"150px", marginRight: "8px"}}
            required
        />
        <input 
            type="file" 
            id={`custom-mesh-input-${index}`} 
            accept=".obj, .gltf, .glb, .fbx, .stl" 
            onChange={(e) => handleMeshImportChange( [URL.createObjectURL(e.target.files[0]), e.target.files[0].name] , index, 1)}
            hidden
        />
        <label htmlFor={`custom-mesh-input-${index}`}>
            <Button variant="outlined" component="span" >
                Upload
            </Button>
        </label>
        <Typography>
            {file[1]}
        </Typography>
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

const EditorForm = ({init_axiom, init_constants, init_productions, init_mesh_imports, setGlobalAxiom, setGlobalConstants, setGlobalProductions, setGlobalMeshImports, error, setError, showGridHelper, setShowGridHelper, dpr, setDpr, seed, setSeed}) => {
    const [axiom, setAxiom] = useState(init_axiom);
    const [constants, setConstants] = useState(init_constants);
    const [productions, setProductions] = useState(init_productions);
    const [meshImports, setMeshImports] = useState(init_mesh_imports);
    const [drawerWidth, setDrawerWidth] = useState(650);
    const [productionsSymbolExpand, setProductionsSymbolExpand] = useState(true);
    const [productionsRuleExpand, setProductionsRuleExpand] = useState([])
    const [constantsExpand, setConstantsExpand] = useState(true);
    const [meshImportsExpand, setMeshImportsExpand] = useState(true);
    const [preset, setPreset] = useState(0);
    const [animation, setAnimation] = useState(true);
    const [menuOpened, setMenuOpened] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loginError, setLoginError] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [saveAsError, setSaveAsError] = useState(null);
    const [userPresets, setUserPresets] = useState([]);
    const [successToast, setSuccessToast] = useState();
    const [failToast, setFailToast] = useState();

    const user = useSelector((state) => state.user.value);
    const dispatch = useDispatch();
    const minDrawerWidth = 30;

    useEffect(()=>{
        //console.log("CURRENT PRODUCTIONS ARE", productions);
        //console.log("CURRENT CONSTANTS ARE", constants);
        //console.log("CURRENT MESH IMPORTS ARE", meshImports);
        const newProductionsExpand = [...productionsRuleExpand];
        while(newProductionsExpand.length < productions.length) {
            newProductionsExpand.push(true);
        }
        setProductionsRuleExpand(newProductionsExpand);
    }, [axiom, constants, productions, meshImports])

    useEffect(()=>{
        apiService.get('/users/me').then((res) => {
            if (res) { 
                // console.log(res);
                dispatch(login(res.data));
            }
        })
    }, [dispatch]);

    useEffect(() => {
        if(user) {
            // console.log(user.username);
            setSuccessToast(`Hello, ${user.username}!`);
        }
        apiService.get('/lsystems').then((res) => {
            // console.log([initPreset].concat(res.data.concat(publicPresets)));
            setUserPresets([initPreset].concat(res.data.concat(publicPresets)));
        }).catch((err) => {
            setUserPresets([initPreset].concat(publicPresets));
        })
    }, [user]);

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

    const handleMeshImportChange = (val, index, type) => {
        // console.log("CHANGING MESH FILE",val);
        const new_mesh_imports = JSON.parse(JSON.stringify(meshImports));
        new_mesh_imports[index][type] = val;
        // console.log(new_mesh_imports);
        setMeshImports(new_mesh_imports);
    }

    const addMeshImport = () => {
        const new_mesh_imports = JSON.parse(JSON.stringify(meshImports));
        new_mesh_imports.push(["", ""]);
        setMeshImports(new_mesh_imports);
    }

    const removeMeshImport = (index) => {
        const new_mesh_imports = JSON.parse(JSON.stringify(meshImports));
        for(let i = index; i < meshImports.length - 1; i++) {
            new_mesh_imports[i] = new_mesh_imports[i+1]; //2 3 4 5 6
        }
        new_mesh_imports.pop();
        setMeshImports(new_mesh_imports);
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
        //console.log(val, index, index2, index3, type, new_productions[index][1][index2][1][index3]);
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
        setGlobalMeshImports(meshImports);
        setSeed(Math.random());
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
    const toggleMeshImportExpand = () => {
        setMeshImportsExpand(!meshImportsExpand);
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
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError(null);
        const data = {username: e.target[1].value, password: e.target[3].value}
        apiService.post('/users/login', data)
        .then((res) => {
            // console.log(res);
            dispatch(login(res.data.token));
            setIsLoginModalOpen(false);
        }).catch((err) => {
            // console.log(err);
            setLoginError("Invalid credentials.");
        })
    }

    const handleRegister = (e) => {
        e.preventDefault();
        setRegisterError(null);
        const data = {username: e.target[1].value, password: e.target[3].value, confirm: e.target[5].value};
        if(data.password != data.confirm) {
            setRegisterError('Passwords don\'t match');
            return;
        }
        // console.log(data);
        apiService.post('/users', data)
        .then((res) => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
            setSuccessToast(`Welcome, ${data.username}!`)
        }).catch((err) => {
            setRegisterError("Invalid credentials.");
        })
    }

    const handleDelete = (e) => {
        e.preventDefault();
        apiService.delete(`/lsystems/${userPresets[preset].lsystem_id}`).then((res) => {
            setIsDeleteModalOpen(false);
            const newUserPresets = [...userPresets];
            newUserPresets.splice(preset, 1);
            setSuccessToast(`${userPresets[preset].name} has been deleted.`)
            setUserPresets(newUserPresets);
        }).catch((err) => {
            setIsDeleteModalOpen(false);
            // console.log("Failed to delete preset.");
        })
    }

    const handleSaveAs = (e) => {
        setSaveAsError(null);
        const name = e.target[1].value;
        const newPreset = {name: name, axiom: axiom, constants: constants, productions: productions, imports: meshImports};
        // console.log(name);
        apiService.post(`/lsystems`, newPreset).then((res) => {
            setIsSaveAsModalOpen(false);
            newPreset.lsystem_id = res.data.rows[0].lsystem_id;
            const newUserPresets = [...userPresets];
            newUserPresets.splice(1, 0, newPreset);
            setPreset(1);
            setUserPresets(newUserPresets);
            setSuccessToast(`Successfully created ${name}`)
        }).catch((err) => {
            setSaveAsError(err.response.data);
        })
        e.preventDefault();

    }

    useEffect(() => {
        //console.log("PRESET VALUE IS", preset, publicPresets);
        if (userPresets.length > 0) {
            // console.log("current preset", userPresets[preset]);
            setAxiom(userPresets[preset].axiom);
            setConstants(userPresets[preset].constants);
            setProductions(userPresets[preset].productions);
        }
    }, [preset, userPresets]);
    useEffect(()=> {
        //console.log(menuOpened ? "menu is opened" : "menu is not opened");
    }, [menuOpened])
    

    return(
        <div style={{height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden"}}>

            <Navbar axiom={axiom} constants={constants} productions={productions} meshImports={meshImports} userPresets={userPresets} setUserPresets={setUserPresets} preset={preset} setPreset={setPreset} toggleGridHelper={toggleGridHelper} dpr={dpr} setDpr={setDpr} menuOpened={menuOpened} openMenu={openMenu} closeMenu={closeMenu} setIsLoginModalOpen={setIsLoginModalOpen} setIsRegisterModalOpen={setIsRegisterModalOpen} setIsDeleteModalOpen={setIsDeleteModalOpen} setIsSaveAsModalOpen={setIsSaveAsModalOpen} setSuccessToast={setSuccessToast} setFailToast={setFailToast} user={user}/>
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
                                <div style={{display: 'flex', flexDirection: 'row'}}>
                                    <AxiomInput axiom={axiom} setAxiom={setAxiom}/>
                                    <div style={{width: "15px", marginLeft: "5px", marginTop: "3px"}}></div>
                                </div>
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
                            <div style={{width: "200px", marginBottom: "20px"}}> <Button variant="contained" type="submit">Generate Model</Button> </div>

                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{fontFamily: "Open Sans", fontWeight: 500, marginBottom: "10px", marginTop: "8px"}}> {`Mesh Import`}</div>
                                {meshImportsExpand ? 
                                <ButtonIcon icon={<ExpandMore />} onClick = {toggleMeshImportExpand}/>
                                : 
                                <ButtonIcon icon={<ExpandLess />} onClick = {toggleMeshImportExpand}/>} 
                                <ButtonIcon icon={<AddCircleOutlineIcon/>} onClick = {addMeshImport}/>
                            </div>
                            <div style={{display: "flex", flexDirection: "column", marginBottom: "20px"}}>
                                <Collapse in={meshImportsExpand} timeout="auto" unmountOnExit>
                                    {meshImports.map((m, index) => (
                                        <div key={`mesh-import-div-${index}`} style={{display: "flex", flexDirection: "row", marginBottom: "8px"}}>
                                            <MeshImportInput name={m[0]} file = {m[1]} index = {index} handleMeshImportChange={handleMeshImportChange}/>
                                            <ButtonIcon icon={<CloseIcon/>} onClick={e=>removeMeshImport(index)} key={`mesh-import-button-${index}`}/>
                                        </div>
                                    ))}
                                </Collapse>
                            </div>
                            
                        </div>

                        <div onMouseDown={e => handleMouseDown(e)} style={{display: "flex", flexDirection: "column", cursor: "ew-resize", width: "4px", height: "100vh", borderStyle: "none double none none", borderColor: "gray", borderWidth: "4px"}}/>
                         
                
                    </div>
                </Drawer>
                
            </form>
            <Modal open={isLoginModalOpen} onClose={()=>setIsLoginModalOpen(false)}>
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', padding: "3px 10px 20px 10px", borderRadius: '7px'}}>
                    <form onSubmit={handleLogin}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{width: "25px", height: "25px", marginLeft: 'auto', marginBottom: "5px"}}>
                            <IconButton onClick={()=>setIsLoginModalOpen(false)} size="small">
                                <CloseIcon style={{ fontSize: 20 }}/>
                            </IconButton>
                        </div>
                        {loginError && <Alert severity="error" sx={{marginBottom: "15px"}} > {loginError} </Alert>}
                            <TextField
                                variant="outlined"
                                label="Username"
                                size="small"
                                style={{width:"250px", marginBottom: '8px'}}
                                required
                            />
                            <TextField
                                variant="outlined"
                                type="password"
                                label="Password"
                                size="small"
                                style={{width:"250px", marginBottom: '15px'}}
                                required
                            />
                            <Button variant="contained" type='submit'> Login </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
            <Modal open={isRegisterModalOpen} onClose={()=>setIsRegisterModalOpen(false)}>
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', padding: "3px 10px 20px 10px", borderRadius: '7px'}}>
                    <form onSubmit={handleRegister}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{width: "25px", height: "25px", marginLeft: 'auto', marginBottom: "5px"}}>
                            <IconButton onClick={()=>setIsRegisterModalOpen(false)} size="small">
                                <CloseIcon style={{ fontSize: 20 }}/>
                            </IconButton>
                        </div>
                        {registerError && <Alert severity="error" sx={{marginBottom: "15px"}} > {registerError} </Alert>}
                            <TextField
                                variant="outlined"
                                label="Username"
                                size="small"
                                style={{width:"250px", marginBottom: '8px'}}
                                required
                            />
                            <TextField
                                variant="outlined"
                                type="password"
                                label="Password"
                                size="small"
                                style={{width:"250px", marginBottom: '15px'}}
                                required
                            />
                            <TextField
                                variant="outlined"
                                type="password"
                                label="Confirm Password"
                                size="small"
                                style={{width:"250px", marginBottom: '15px'}}
                                required
                            />
                            <Button variant="contained" type='submit'> Register </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
            <Modal open={isDeleteModalOpen} onClose={()=>setIsDeleteModalOpen(false)}>
                <Box sx={{width:"300px", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', padding: "3px 10px 20px 10px", borderRadius: '7px'}}>
                    <form onSubmit={handleDelete}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{display: 'flex', flexDirection: 'row', marginBottom: "5px"}}>
                                <Typography variant="h6">Delete preset? </Typography>
                                <div style={{width: "25px", height: "25px", marginLeft: 'auto', marginBottom: "5px"}}>
                                    <IconButton onClick={()=>setIsDeleteModalOpen(false)} size="small">
                                        <CloseIcon style={{ fontSize: 20 }}/>
                                    </IconButton>
                                </div>
                            </div>
                            <Divider></Divider>
                            <Typography variant="body1"> Are you sure you want to delete <b>{userPresets[preset]?.name}</b>?</Typography>
                        
                            <div style={{marginTop: "10px"}}>
                                <Button type="submit" variant="contained" color='error' >Delete</Button>
                                <Button sx={{marginLeft: "10px"}} variant="outlined" onClick={()=>setIsDeleteModalOpen(false)} >Cancel</Button>
                            </div>
                        
                        </div>
                    </form>
                </Box>

            </Modal>
            <Modal open={isSaveAsModalOpen} onClose={()=>setIsSaveAsModalOpen(false)}>
                <Box sx={{width:"300px", position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'white', padding: "3px 10px 20px 10px", borderRadius: '7px'}}>
                    <form onSubmit={handleSaveAs}>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div style={{display: 'flex', flexDirection: 'row', marginBottom: "5px"}}>
                                <Typography variant="h6">New preset: </Typography>
                                <div style={{width: "25px", height: "25px", marginLeft: 'auto', marginBottom: "5px"}}>
                                    <IconButton onClick={()=>setIsSaveAsModalOpen(false)} size="small">
                                        <CloseIcon style={{ fontSize: 20 }}/>
                                    </IconButton>
                                </div>
                            </div>
                            <Divider></Divider>
                            {saveAsError && <Alert severity="error" sx={{marginBottom: "15px"}} > {saveAsError} </Alert>}
                            <TextField
                                variant="outlined"
                                label="Preset name"
                                size="small"
                                style={{marginTop: "10px", width:"250px", marginBottom: '8px'}}
                                required
                            />
                        
                            <div style={{marginTop: "10px"}}>
                                <Button type="submit" variant="contained" >Create</Button>
                                <Button sx={{marginLeft: "10px"}} variant="outlined" onClick={()=>setIsSaveAsModalOpen(false)} >Cancel</Button>
                            </div>
                        
                        </div>
                    </form>
                </Box>

            </Modal>
            <Snackbar open={successToast?true:false} autoHideDuration={6000} onClose={()=>setSuccessToast(null)}>
                <Alert onClose={()=>setSuccessToast(null)} severity="success" variant="filled">
                    {successToast}
                </Alert>
            </Snackbar>
            <Snackbar open={failToast?true:false} autoHideDuration={6000} onClose={()=>setFailToast(null)}>
                <Alert onClose={()=>setFailToast(null)} severity="error" variant="filled">
                    {failToast}
                </Alert>
            </Snackbar>
        </div>
    )
}

const Editor = () =>{
    const [axiom, setAxiom] = useState(initPreset.axiom);
    const [constants, setConstants] = useState(initPreset.constants);
    const [productions, setProductions] = useState(initPreset.productions); //forgor to separate AA's with spaces
    const [meshImports, setMeshImports] = useState(initPreset.meshImports)
    const [error, setError] = useState("");
    const [showGridHelper, setShowGridHelper] = useState(true);
    const [dpr, setDpr] = useState(1);
    const [seed, setSeed] = useState(0);

    useEffect(() => {
        //console.log("ERROR IS" ,error);
    }, [error]);

    const getConstants = (constants) => {
        let constantsObj = {};
        for(let i = 0; i < constants.length; i++) {
            constantsObj[constants[i][0]] = constants[i][1];
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

    const getMeshImports = (meshImports) => {
        //console.log("UNPROCESSED MESH IMPORTS", meshImports);
        let meshImportsObj = {};
        for(let i = 0; i < meshImports.length; i++) {
            if(meshImports[i][1] == ""){
                continue;
            } 
            const link = meshImports[i][1][0];
            const name = meshImports[i][1][1];
            //meshImportsObj[meshImports[i][0]] = [null, name];
            const extension = name.substring(name.lastIndexOf('.'));
            //console.log("LINK", link, "NAME", name, "EXTENSION", extension);
            if(extension == ".obj") {
                meshImportsObj[meshImports[i][0]] = useLoader(OBJLoader, ""+link);
            }
            else if (extension == ".gltf" || extension == ".glb") {
                //console.log(""+link);
                meshImportsObj[meshImports[i][0]] = useLoader(GLTFLoader, ""+link).scene;
            }
            else if(extension == ".fbx") {
                meshImportsObj[meshImports[i][0]] = useLoader(FBXLoader, ""+link);
            }
            else if(extension == ".stl") {
                meshImportsObj[meshImports[i][0]] = new Mesh(useLoader(STLLoader, ""+link));
          
                //console.log(meshImportsObj[meshImports[i][0]]);
            }
            else {
                meshImportsObj[meshImports[i][0]] = null;
                setError(`Invalid file extension for ${name}`);
            } 
        }
        //console.log("PROCESSED MESH IMPORTS", meshImportsObj);
        return meshImportsObj;
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
                <EditorForm init_axiom={axiom} init_constants={constants} init_productions={productions} init_mesh_imports={meshImports} setGlobalAxiom={setAxiom} setGlobalConstants={setConstants} setGlobalProductions={setProductions} setGlobalMeshImports = {setMeshImports} error={error} setError={setError} showGridHelper={showGridHelper} setShowGridHelper={setShowGridHelper} dpr={dpr} setDpr={setDpr} seed={seed} setSeed={setSeed} />
                {<Render axiom = {axiom} constants = {getConstants(constants)} productions = {getProductions(productions)} meshImports = {getMeshImports(meshImports)} setError={setError} showGridHelper={showGridHelper} dpr={dpr} seed={seed}/> }
                {/*<Render axiom = {TestProps.axiom} constants = {TestProps.constants} productions = {TestProps.productions} setError = {setError} showGridHelper = {showGridHelper} dpr = {dpr}/> */}
            </div>
        </div>
    )
}

export default Editor;
