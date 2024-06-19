import React from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, NavLink } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';
import { useAppDispatch } from "../state/hook";
import { User } from "../api";

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => {
    return <NavLink style={{ textDecoration: 'none', color: 'white', letterSpacing: "10px" }} to={to}>
        <MenuItem style={{ letterSpacing: "1px", fontWeight: "bold" }}>{label}</MenuItem>
    </NavLink>;
}

export default function TopBar() {
    const dispatch = useAppDispatch();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Link style={{ color: 'inherit', textDecoration: 'inherit', flexGrow: 1, display: "flex", gap: "20px", alignItems: "center" }} to="/">
                        <img src="../../public/pgcil.png" style={{ width: "50px", height: "50px" }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            POWERGRID BILL UTILITY
                        </Typography>
                    </Link>
                    <NavItem to="/history" label="Bills" />
                    <NavItem to="/nodes" label="Network" />
                    <NavItem to="/service" label="Services" />

                    <div>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={() => { setAnchorEl(null); }}
                        >
                            <MenuItem onClick={() => { setAnchorEl(null); }}>Profile</MenuItem>
                            <MenuItem onClick={() => { setAnchorEl(null); dispatch(User.logout()) }}>Logout</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
