'use client';

import React, { useState } from "react";
import Link from "next/link";
import {
  Box, Drawer, List,
  ListItemButton, ListItemIcon, ListItemText,
  Typography, IconButton, useMediaQuery,
  useTheme, Avatar, Tooltip,
  Badge, Paper,
} from "@mui/material";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TokenIcon from "@mui/icons-material/Token";
import ListAltIcon from "@mui/icons-material/ListAlt";

// Simplified user type
interface SimplifiedUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  imageUrl: string;
}

interface AdminNavbarProps {
  user: SimplifiedUser;
}

const colorScheme = {
  primary: "#CC0000",
  primaryLight: "rgba(204, 0, 0, 0.1)",
  primaryDark: "#990000",
  white: "#FFFFFF",
  lightGray: "#f8f9fa",
  menuBackground: "rgba(255, 255, 255, 0.95)",
  textPrimary: "#2D3748",
  textSecondary: "#718096",
  hoverBg: "rgba(237, 242, 247, 0.8)",
  activeBg: "rgba(204, 0, 0, 0.08)",
  divider: "rgba(226, 232, 240, 0.8)",
  cardShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
  navShadow: "10px 0 25px -5px rgba(0, 0, 0, 0.05)",
};

const drawerWidth = 280;
const collapsedDrawerWidth = 84;
const globalNavHeight = 64;

export default function AdminNavbar({ user }: AdminNavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [selectedPage, setSelectedPage] = useState("Dashboard");

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/pages/admin", notifications: 0 },
    { text: "User Management", icon: <PeopleIcon />, path: "/pages/admin/users", notifications: 3 },
    { text: "Manage Approvals", icon: <AssignmentTurnedInIcon />, path: "/pages/admin/approvals", notifications: 5 },
    { text: "Token Management", icon: <TokenIcon />, path: "/pages/admin/tokens", notifications: 0 },
    { text: "System Logs", icon: <ListAltIcon />, path: "/pages/admin/syslogs", notifications: 0 },
  ];

  const getInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const drawerContent = (
    <Box sx={{ 
      backgroundColor: colorScheme.menuBackground, 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(10px)',
    }}>
      <Box sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        color: colorScheme.textPrimary,
        borderBottom: `1px solid ${colorScheme.divider}`,
      }}>
        {open ? (
          <>
            <Paper 
              elevation={0}
              sx={{
                p: 1,
                borderRadius: '20px',
                backgroundColor: colorScheme.lightGray,
                mb: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                boxShadow: colorScheme.cardShadow,
              }}
            >
              <Avatar 
                src={user.imageUrl} 
                alt={`${user.firstName} ${user.lastName}`}
                sx={{ 
                  width: 70, 
                  height: 70, 
                  mb: 1.5,
                  border: `3px solid ${colorScheme.white}`,
                  boxShadow: '0 0 0 2px rgba(204, 0, 0, 0.2)',
                }}
              >
                {getInitials()}
              </Avatar>
              <Typography variant="subtitle1" fontWeight="600" sx={{ mb: 0.5 }}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography 
                variant="caption" 
                color={colorScheme.textSecondary} 
                sx={{ 
                  mb: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  backgroundColor: colorScheme.primaryLight,
                  color: colorScheme.primary,
                  fontWeight: 500,
                }}
              >
                Administrator
              </Typography>
            </Paper>
            <Typography 
              variant="h6" 
              fontWeight="700" 
              sx={{ 
                mb: 0.5, 
                letterSpacing: '-0.5px',
                fontSize: '1.35rem',
              }}
            >
              Admin Portal
            </Typography>
          </>
        ) : (
          <Tooltip title={`${user.firstName} ${user.lastName}`} placement="right">
            <Avatar 
              src={user.imageUrl} 
              alt={`${user.firstName} ${user.lastName}`}
              sx={{ 
                width: 48, 
                height: 48,
                border: `2px solid ${colorScheme.white}`,
                boxShadow: '0 0 0 2px rgba(204, 0, 0, 0.2)',
              }}
            >
              {getInitials()}
            </Avatar>
          </Tooltip>
        )}
      </Box>

      {!isMobile && (
        <Box 
          display="flex" 
          justifyContent="center" 
          sx={{ 
            borderBottom: `1px solid ${colorScheme.divider}`,
            py: 1.5,
          }}
        >
          <IconButton 
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            sx={{ 
              borderRadius: '14px',
              backgroundColor: colorScheme.lightGray,
              color: colorScheme.primary,
              p: 1,
              '&:hover': {
                backgroundColor: colorScheme.primaryLight,
              },
              transition: 'all 0.2s ease',
            }}
            size="small"
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>
      )}

      <List sx={{ mt: 2, px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected = selectedPage === item.text;
          
          return (
            <Tooltip 
              key={item.text}
              title={open ? "" : item.text} 
              placement="right"
              arrow
            >
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isSelected}
                onClick={() => setSelectedPage(item.text)}
                sx={{
                  justifyContent: open ? 'initial' : 'center',
                  my: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: '16px',
                  backgroundColor: isSelected ? colorScheme.activeBg : 'transparent',
                  color: isSelected ? colorScheme.primary : colorScheme.textPrimary,
                  '&:hover': {
                    backgroundColor: isSelected ? colorScheme.activeBg : colorScheme.hoverBg,
                    transform: 'translateY(-2px)',
                    boxShadow: isSelected ? '0 4px 12px rgba(204, 0, 0, 0.1)' : 'none',
                  },
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isSelected ? colorScheme.primary : colorScheme.textSecondary,
                    minWidth: 0,
                    mr: open ? 2.5 : 'auto',
                    justifyContent: 'center',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.notifications > 0 ? (
                    <Badge 
                      badgeContent={item.notifications} 
                      color="error"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.6rem',
                          height: '18px',
                          minWidth: '18px',
                          padding: '0 4px',
                        }
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: '0.95rem',
                  }}
                  sx={{
                    opacity: open ? 1 : 0,
                    display: open ? 'block' : 'none',
                  }}
                />
                {isSelected && (
                  <Box 
                    sx={{
                      width: open ? '4px' : '100%',
                      height: open ? '70%' : '4px',
                      backgroundColor: colorScheme.primary,
                      position: 'absolute',
                      right: open ? 0 : 'auto',
                      bottom: open ? 'auto' : 0,
                      borderRadius: open ? '4px 0 0 4px' : '4px 4px 0 0',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
      
      {open && (
        <Paper
          elevation={0}
          sx={{ 
            m: 2, 
            p: 2, 
            borderRadius: '16px', 
            backgroundColor: colorScheme.lightGray,
            border: `1px solid ${colorScheme.divider}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color={colorScheme.textSecondary} sx={{ display: 'block', mb: 1 }}>
            Admin Portal · 2025
          </Typography>
        </Paper>
      )}
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: open ? drawerWidth : collapsedDrawerWidth }, flexShrink: 0 }}>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: `${globalNavHeight}px`,
            height: `calc(100% - ${globalNavHeight}px)`,
            borderRight: 'none',
            boxShadow: colorScheme.navShadow,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedDrawerWidth,
            overflowX: 'hidden',
            boxSizing: 'border-box',
            top: `${globalNavHeight}px`,
            height: `calc(100% - ${globalNavHeight}px)`,
            borderRight: 'none',
            boxShadow: open ? colorScheme.navShadow : 'none',
            transition: theme.transitions.create(['width', 'box-shadow'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
