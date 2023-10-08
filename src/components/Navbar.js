import React from 'react'
import { Button, TextField, FormControlLabel, Checkbox, Select, MenuItem, FormControl, Divider, Snackbar} from '@mui/material';
import "@fontsource/open-sans";
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux'
import { login, logout } from '../reducers/userSlice'
import { apiService } from '../services/apiService';
import { publicPresets } from '../Presets';

export function Navbar({axiom, constants, productions, meshImports, userPresets, setUserPresets, preset, setPreset, toggleGridHelper, dpr, setDpr, menuOpened, openMenu, closeMenu, setIsLoginModalOpen, setIsRegisterModalOpen, setIsDeleteModalOpen, setIsSaveAsModalOpen, setSuccessToast, setFailToast, user}) {
    const dispatch = useDispatch();

    const logoutUser = () => {
        apiService.post('/users/logout').then((res) => {
            setSuccessToast('See you later!');
            window.location.reload();
        });
    }

    const updateLSystem = (lsystem_id, data) => {
        // console.log(data);
        if(!user) {
            setIsLoginModalOpen(true);
        }
        else if(lsystem_id) {
            apiService.put(`/lsystems/${lsystem_id}`, data)
            .then((res)=> {
                // console.log(res);
                const newUserPresets = [...userPresets];
                newUserPresets.splice(preset, 1, data);
                setUserPresets(newUserPresets);
                // window.location.reload();
                if(res.data.severity=="ERROR"){
                    setFailToast(`Failed to update ${data.name}: ${res.data.detail}`);
                } else {
                    setSuccessToast(`Successfully updated ${data.name}`);
                }
            })
            .catch((err) => {
                setFailToast(`Failed to update ${data.name}: ${err.response.data}`);
                // console.log("update failed", err);
            })
        } else {
            setFailToast(`Failed to update ${data.name}: Can't edit public presets!`);
        }

        
    }

    return (
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
                    MenuProps={{style: {maxHeight: '95vh'}}}
                    sx={{width: "200px", marginLeft: "8px"}}
                    displayEmpty
                >
                    {userPresets.map((p, index) => {
                        if (index < userPresets.length - publicPresets.length) {
                            return <MenuItem key={`user-preset-${index}`} value={index}>
                            {p.name}
                            </MenuItem>
                        }
                    })}
                    <Divider> <Typography variant="caption"> Public </Typography></Divider>
                    {userPresets.map((p, index) => {
                        if (index >= userPresets.length - publicPresets.length) {
                            return <MenuItem key={`user-preset-${index}`} value={index}>
                            {p.name}
                            </MenuItem>
                        }
                    })}

                </Select>
            </FormControl>
        </div>
        {/*<FormControlLabel control={<Checkbox />} label="Animation" /> */}
        <div style={{marginLeft: "10px"}}> <Button variant="contained" color='success' onClick={()=>updateLSystem(userPresets[preset].lsystem_id, {lsystem_id: userPresets[preset].lsystem_id, name: userPresets[preset].name, axiom: axiom, constants: constants, productions: productions, imports: meshImports})} >Save </Button> </div>
        <div style={{marginLeft: "5px"}}> <Button variant="contained" onClick={()=>{
            if(!user) {
                setIsLoginModalOpen(true);
                return;
            }
            setIsSaveAsModalOpen(true);}} >Save as </Button> </div>
        <div style={{marginLeft: "5px"}}> <Button variant="contained" color='error' onClick={()=>{
            if(!user) {
                setIsLoginModalOpen(true);
                return;
            }setIsDeleteModalOpen(true);}} >Delete </Button> </div>
        <FormControlLabel sx={{marginLeft: "8px"}} control={<Checkbox onClick={toggleGridHelper} defaultChecked />} label="Show Grid" />
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
        <div style={{width: "160px", marginLeft: "5px"}} className="camera-reset-button"> <Button sx={{width: "100%"}} variant="outlined" >Center Camera</Button> </div>
        <div style={{display: "flex", flexDirection: "column", marginTop: menuOpened ? "70px" : "0px", marginLeft: "5px"}}>
            <div style={{width: "90px"}} onMouseEnter={openMenu} onMouseLeave={closeMenu}> <Button sx={{width: "100%"}} variant="contained" >EXPORT</Button> </div>
            <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{display: menuOpened? "inline" : "none", flexDirection: "column", zIndex:  999999, background: "white", borderColor: "gray", borderStyle: "solid solid solid solid", borderWidth: "1px"}}>
                <div className="scene-export-obj-button"> <MenuItem>Export as OBJ</MenuItem> </div>
                <div className="scene-export-gltf-button">  <MenuItem>Export as GLTF</MenuItem> </div>
            </div>
        </div>
        <div style={{marginLeft: "auto", marginRight: "10px"}}> 
            {user ? (
                    <>
                        <div style={{display: 'flex'}}>    
                            <Typography sx={{marginRight: '5px'}}>Logged in as {user.username}</Typography>
                            <Button variant="contained" color='error' onClick={()=>{ logoutUser(); dispatch(logout());}} >Logout</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Button sx={{ marginRight: "5px" }} variant="contained" onClick={() => {setIsLoginModalOpen(true); setIsRegisterModalOpen(false);}}> Login </Button>
                        <Button variant="outlined" onClick={() => {setIsRegisterModalOpen(true); setIsLoginModalOpen(false);}}> Register </Button>
                    </>
                )}
        </div>

    </div>
    )
}
