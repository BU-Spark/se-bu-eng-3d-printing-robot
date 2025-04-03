import { CSSProperties } from "react";
import { Box } from "@mui/material";
import NewExpTab from "@/src/components/Account/NewExpTab";

const containerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "80vh",
  padding: "20px",
  width: "100%",
};

export default function NewExpPage() {
  return (
    <Box sx={containerStyle}>
      <NewExpTab />
    </Box>
  );
}
