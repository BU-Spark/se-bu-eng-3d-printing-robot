// src/components/Admin/AdminDashboard.tsx
'use client';

import React, { useState, ReactNode } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Drawer, 
  List, 
  ListItemButton,
  ListItemIcon, 
  ListItemText,
  Container,
  Paper,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider
} from "@mui/material";

// Material-UI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TokenIcon from "@mui/icons-material/Token";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ListAltIcon from "@mui/icons-material/ListAlt";

// Define the simplified user type
interface SimplifiedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string;
}

// Update the props interface to use the simplified user
interface AdminDashboardProps {
  user: SimplifiedUser;
  children?: ReactNode;
}

// Color scheme - matching your existing NavBar
const colorScheme = {
  primary: "#CC0000",
  secondary: "#FFFFFF",
  hover: "#E53935",
  white: "#FFFFFF",
  black: "#000000",
  lightGray: "#f5f5f5",
  menuBackground: "#f9f9f9",
};

// Sidebar width
const drawerWidth = 240;

export default function AdminDashboard({ user, children }: AdminDashboardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/pages/admin" },
    { text: "User Management", icon: <PeopleIcon />, path: "/pages/admin/users" },
    { text: "Manage Approvals", icon: <AssignmentTurnedInIcon />, path: "/pages/admin/approvals" },
    { text: "Token Management", icon: <TokenIcon />, path: "/pages/admin/tokens" },
    { text: "System Logs", icon: <ListAltIcon />, path: "/pages/admin/dblogs" },
  ];

  const drawer = (
    <Box sx={{ backgroundColor: colorScheme.menuBackground, height: '100%' }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        backgroundColor: colorScheme.primary, 
        color: colorScheme.white 
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
        <Typography variant="body2" component="div">
          {user.firstName} {user.lastName}
        </Typography>
      </Box>
      <Divider />
      {!isMobile && (
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      )}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text} 
            component={Link} 
            href={item.path}
            selected={selectedPage === item.text}
            onClick={() => {
              setSelectedPage(item.text);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              backgroundColor: selectedPage === item.text ? colorScheme.lightGray : 'transparent',
              '&:hover': {
                backgroundColor: colorScheme.lightGray,
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: colorScheme.primary,
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                opacity: open ? 1 : 0,
                display: open ? 'block' : 'none' 
              }} 
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  // Calculate extra top margin to account for the regular navbar
  const navbarHeight = 64; // This should match your regular navbar height

  return (
    <>
      {/* Your existing navbar would be rendered at the app level */}
      <Box sx={{ display: 'flex' }}>
        {/* Admin Sidebar - Drawer */}
        <Box
          component="nav"
          sx={{ 
            width: { md: open ? drawerWidth : 72 }, 
            flexShrink: { md: 0 },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        >
          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          
          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: open ? drawerWidth : 72,
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.sharp,
                  duration: theme.transitions.duration.enteringScreen,
                }),
                borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                mt: `${navbarHeight}px` // This accounts for the regular navbar height
              },
            }}
            open={open}
          >
            {drawer}
          </Drawer>
        </Box>
        
        {/* Main content area */}
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { 
              xs: '100%',
              md: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 72px)` 
            },
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            mt: `${navbarHeight}px` // Match the regular navbar height
          }}
        >
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ border: '1px solid #ddd', borderRadius: 1 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          
          {children ? children : (
            <Container maxWidth="lg">
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                  {selectedPage}
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  <Typography variant="body1">
                    Welcome to the admin panel, {user.firstName || 'Admin'}. 
                    You now have access to manage the Experimental Mechanics Challenge platform.
                  </Typography>
                </Box>
              </Paper>
            </Container>
          )}
        </Box>
      </Box>
    </>
  );
}