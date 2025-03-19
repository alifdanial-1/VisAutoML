import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Button, 
  ButtonGroup, 
  Tooltip, 
  useMediaQuery, 
  IconButton, 
  Menu, 
  MenuItem, 
  Container,
  Paper,
  useTheme
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BiNetworkChart } from "react-icons/bi";
import { RiHomeLine } from "react-icons/ri";
import { FaDatabase } from "react-icons/fa";
import { BsEyeglasses } from "react-icons/bs";
import { GoSettings } from "react-icons/go";
import { MdOutlineVisibility } from "react-icons/md";
import { ArrowForwardIos } from "@mui/icons-material";
import MenuIcon from '@mui/icons-material/Menu';
import { useDispatch, useSelector } from "react-redux";
import { withStyles } from "@mui/styles";

const CustomTooltip = withStyles({
  tooltip: {
    minWidth: "450px",
    textAlign: "center",
  }
})(Tooltip);

// Custom Switch Component
const DevModeSwitch = ({ isChecked, onChange, isTablet }) => {
  return (
    <div className={`dev-mode-switch ${isTablet ? 'tablet' : ''}`}>
      <span className="switch-container">
        <input 
          type="checkbox"
          id="devModeToggle"
          checked={isChecked}
          onChange={onChange}
          className="switch-input"
        />
        <label 
          htmlFor="devModeToggle" 
          className="switch-label"
        >
          <span className="switch-button"></span>
          <span className={`switch-text guide ${!isChecked ? 'active' : ''}`}>Guide</span>
          <span className={`switch-text free ${isChecked ? 'active' : ''}`}>Free</span>
        </label>
      </span>
    </div>
  );
};

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [devMode, setDevMode] = useState();
  const [tooltipId, setTooltipId] = useState(-2);
  const [anchorElNav, setAnchorElNav] = useState(null);

  const { mode } = useSelector(state => state.model);
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // Adjust icon sizes based on screen size
  const getIconSize = () => {
    if (isTablet) {
      return "1rem";
    }
    return "1.3rem";
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <RiHomeLine size={getIconSize()} />, path: '/home' },
    { id: 'dataset', label: 'Import', icon: <FaDatabase size={getIconSize()} />, path: '/dataset' },
    { id: 'review', label: 'Preprocessing', icon: <BsEyeglasses size={getIconSize()} />, path: '/review' },
    { id: 'select', label: 'Training', icon: <GoSettings size={getIconSize()} />, path: '/select' },
    { id: 'model', label: 'Evaluation', icon: <MdOutlineVisibility size={getIconSize()} />, path: '/model' },
  ];

  useEffect(() => {
    switch (location.pathname) {
      case "":
        setActive("landing");
        break;
      case "/home":
        setActive("home");
        break;
      case "/dataset":
        setActive("dataset");
        break;
      case "/select":
        setActive("select");
        break;
      case "/review":
        setActive("review");
        break;
      case "/model":
        setActive("model");
        break;
      default:
        break;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (mode < 0) setDevMode(true);
    else setDevMode(false);
    setTooltipId(mode);
    console.log("Mode changed to:", mode, "Setting tooltipId to:", mode);
  }, [mode]);

  // Additional useEffect to handle tooltipId changes
  useEffect(() => {
    console.log("Current tooltipId:", tooltipId);
    // Force re-render when tooltipId changes to ensure tooltip visibility updates
    if (tooltipId === 2) {
      console.log("Tooltip 2 should be visible now");
    }
  }, [tooltipId]);

  const onClick = (link) => { };

  const handleOpen = () => {
    // Keep the tooltip open when it's triggered
    console.log("Tooltip opened with ID:", tooltipId);
  };

  const handleClose = () => {
    // Only close tooltips that should auto-close
    // Don't close tooltips that need to stay open based on tooltipId
    console.log("Tooltip close requested for ID:", tooltipId);
    if (tooltipId !== -1 && tooltipId !== 2 && tooltipId !== 3) {
      dispatch({ type: "TOGGLE_MODE", payload: -2 });
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleDevModeChange = (e) => {
    const newDevMode = e.target.checked;
    let payload = -1;
    
    if (!newDevMode) {
      switch (active) {
        case 'home':
          payload = 2;
          break;
        case 'dataset':
          payload = 10;
          break;
        case 'review':
          payload = 15;
          break;
        case 'select':
          payload = 23;
          break;
        case 'model':
          payload = 34;
          break;
        default:
          payload = 2; // Default to 2 if active page is not recognized
          break;
      }
      console.log("Switching to guide mode, setting tooltipId to:", payload);
    } else {
      console.log("Switching to free mode, setting tooltipId to -1");
    }
    
    // Update Redux state
    dispatch({ type: "TOGGLE_MODE", payload: payload });
    
    // Also update local state immediately for faster UI response
    setTooltipId(payload);
    setDevMode(newDevMode);
  };

  return (
    <>
      <AppBar position="static" sx={{ 
        backgroundColor: 'white', 
        color: 'black',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        height: '80px',
        '@media (max-width: 990px)': {
          width: '990px',
          maxWidth: '990px'
        }
      }}>
        <Container maxWidth="xl" sx={{ 
          height: '100%',
          '@media (max-width: 990px)': {
            width: '990px',
            maxWidth: '990px'
          }
        }}>
          <Toolbar disableGutters sx={{ 
            minHeight: '64px !important',
            height: '100%',
            justifyContent: 'space-between'
          }}>
            {/* Logo for desktop */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center',
              pl: 2
            }}>
              <BiNetworkChart size={isTablet ? "1.5rem" : "1.8rem"} color="#1a97f5" />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/home"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: isTablet ? "1rem" : "1.3rem",
                  color: 'black',
                  textDecoration: 'none',
                }}
              >
                VisAutoML
              </Typography>
            </Box>

            {/* Mobile menu */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem 
                    key={item.id} 
                    onClick={handleCloseNavMenu}
                    disabled
                    selected={active === item.id}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                      <Typography sx={{ 
                        ml: 1, 
                        fontSize: { 
                          xs: '0.8rem', 
                          sm: '0.85rem', 
                          md: '0.9rem',
                          lg: '1rem'
                        } 
                      }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo for mobile */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              alignItems: 'center',
              flexGrow: 1 
            }}>
              <BiNetworkChart size="1.5rem" color="#1a97f5" />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/home"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: "1.1rem",
                  color: 'black',
                  textDecoration: 'none',
                }}
              >
                VisAutoML
              </Typography>
            </Box>

            {/* Navigation items for desktop */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              gap: 1,
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  disabled
                  sx={{
                    color: active === item.id ? 'white' : '#d1d1d1',
                    backgroundColor: active === item.id ? '#1a97f5' : 'transparent',
                    borderRadius: '8px',
                    my: 2,
                    px: isTablet ? 1 : 2,
                    display: 'flex',
                    flexDirection: isTablet ? 'column' : 'row',
                    alignItems: 'center',
                    fontSize: isTablet ? '0.65rem' : '0.85rem',
                    fontWeight: 'bold',
                    fontFamily: "'SF Pro Display', sans-serif",
                    '&:hover': {
                      backgroundColor: active === item.id ? '#1a97f5' : 'rgba(26, 151, 245, 0.1)',
                    },
                    '&.Mui-disabled': {
                      color: active === item.id ? 'white' : '#d1d1d1',
                      backgroundColor: active === item.id ? '#1a97f5' : 'transparent',
                    }
                  }}
                >
                  {item.icon}
                  <Box component="span" sx={{ ml: isTablet ? 0 : 1, mt: isTablet ? 0.5 : 0 }}>
                    {item.label}
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Development Mode Toggle */}
            <Box sx={{ 
              flexGrow: 0,
              pr: 2
            }}>
              <CustomTooltip
                open={tooltipId === -1 ? true : false}
                onOpen={handleOpen}
                onClose={handleClose}
                title={
                  <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                    <Typography>Activate 'Easy Mode' for guided assistance</Typography>
                    <Box style={{ textAlign: "end" }}>
                      <Button variant="contained" onClick={() => dispatch({ type: "TOGGLE_MODE", payload: -2 })}>OKAY</Button>
                    </Box>
                  </Box>
                }
                placement="bottom"
                arrow
              >
              <CustomTooltip
                    open={tooltipId === 2}
                    onOpen={handleOpen}
                    onClose={handleClose}
                    title={
                      <Box padding="10px" display="flex" flexDirection="column" gap="10px">
                        <Typography>Switch between 'Easy' and 'Expert' modes depending on
                          your comfort level. New? Start with Easy!</Typography>
                        <Box style={{ textAlign: "end" }}>
                          <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => dispatch({ type: "TOGGLE_MODE", payload: 3 })}>NEXT</Button>
                        </Box>
                      </Box>
                    }
                    placement="bottom"
                    arrow
                  >
                <Box>
                  
                    <DevModeSwitch 
                      isChecked={devMode} 
                      onChange={handleDevModeChange}
                      isTablet={isTablet}
                    />                
                </Box>
                </CustomTooltip>
              </CustomTooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;
