import { CSSProperties } from "react";
import { Box } from "@mui/material";
import NewExpTab from "@/app/components/Account/NewExpTab";

// Styles for the container 
const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "80vh",
  padding: "20px",
  width: "100%",
};

/**
 * NewExpPage component
 * 
 * This page acts as a wrapper for the NewExpTab component,
 * centering it on the screen using a styled MUI Box.
 *
 * @returns {JSX.Element} The rendered NewExpPage component
 */
export default function NewExpPage() {
  return (
    <Box sx={containerStyle}>
      <NewExpTab />
    </Box>
  );
}
