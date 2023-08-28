import React from 'react'
import { Button, TextField, FormControlLabel, Checkbox, Select, MenuItem, FormControl} from '@mui/material';
import "@fontsource/open-sans";

export function Navbar({preset, setPreset, toggleGridHelper, dpr, setDpr, menuOpened, openMenu, closeMenu, setIsLoginModalOpen}) {
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
                    sx={{width: "200px", height: "37px", marginLeft: "8px"}}
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
                    <MenuItem value={10}>Monopodial tree 2</MenuItem>
                    <MenuItem value={11}>Monopodial tree 3</MenuItem>
                    <MenuItem value={12}>Sympodial tree</MenuItem>
                    <MenuItem value={13}>Natural tree</MenuItem>
                    <MenuItem value={14}>Natural tree w/ leaves</MenuItem>
                    <MenuItem value={15}>Natural tree w/ leaves 2</MenuItem>
                    <MenuItem value={16}>gravity test</MenuItem>
                    <MenuItem value={17}>Weeping Willow</MenuItem>
                    <MenuItem value={18}>Weeping Willow 2</MenuItem>
                </Select>
            </FormControl>
        </div>
        {/*<FormControlLabel control={<Checkbox />} label="Animation" /> */}
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
        <div style={{width: "160px", marginLeft: "10px"}} className="camera-reset-button"> <Button sx={{width: "100%"}} variant="outlined" >Center Camera</Button> </div>
        <div style={{display: "flex", flexDirection: "column", marginTop: menuOpened ? "70px" : "0px", marginLeft: "5px"}}>
            <div style={{width: "90px"}} onMouseEnter={openMenu} onMouseLeave={closeMenu}> <Button sx={{width: "100%"}} variant="contained" >EXPORT</Button> </div>
            <div onMouseEnter={openMenu} onMouseLeave={closeMenu} style={{display: menuOpened? "inline" : "none", flexDirection: "column", zIndex:  999999, background: "white", borderColor: "gray", borderStyle: "solid solid solid solid", borderWidth: "1px"}}>
                <div className="scene-export-obj-button"> <MenuItem>Export as OBJ</MenuItem> </div>
                <div className="scene-export-gltf-button">  <MenuItem>Export as GLTF</MenuItem> </div>
            </div>
        </div>
        <div style={{marginLeft: "auto", marginRight: "5px"}}> 
            <Button sx={{marginRight: "5px"}} variant="contained" onClick={()=>setIsLoginModalOpen(true)}> Login </Button> 
            <Button variant="outlined"> Register </Button> 
        </div>

    </div>
    )
}
