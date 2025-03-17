
"use client";

import { useUser, useSession } from "@clerk/nextjs";
import { CSSProperties, useState } from "react";

// Material UI components
import { Box, Tabs, Tab, Typography } from "@mui/material";

// Components
import InfoTab from "@/src/components/Account/InfoTab";
import StatusTab from "@/src/components/Account/StatusTab";
import NewExpTab from "@/src/components/Account/NewExpTab";

/**********************************************************************************/
// Styling
const containerStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "80vh",
	padding: "20px",
	width: "100%"
};
/**********************************************************************************/

// TabPanel component
interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			style={{ width: "100%", display: "flex", justifyContent: "center" }}
			{...other}
		>
			{value === index && (
				<Box sx={{ pt: 3, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
					{children}
				</Box>
			)}
		</div>
	);
}

export default function AccountPage() {
  const { user } = useUser();
  const { session } = useSession();
  const [tabValue, setTabValue] = useState(0);

  // Handle tab changes
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
			<Box sx={containerStyle}>
				<Typography variant="h6">Please sign in to view your account.</Typography>
			</Box>
		);
  } 

  return (
    <Box sx={containerStyle}>
      <Box sx={{ width: '100%', maxWidth: '1000px', mb: 4, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'center' }}>
				<Tabs 
					value={tabValue} 
					onChange={handleTabChange} 
					centered
					textColor="primary"
					indicatorColor="primary"
				>
					<Tab label="INFO" />
					<Tab label="STATUS" />
					<Tab label="NEW EXP" />
				</Tabs>
			</Box>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <InfoTab user={user} session={session} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <StatusTab />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <NewExpTab />
      </TabPanel>
    </Box>
  );
}
