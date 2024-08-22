import React, { useState } from 'react';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import ContributeQuestion from './ContributeQuestion';
import ContributeTestCase from './ContributeTestCase';

const Contribute = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Container>
      <Box>
        <Typography variant="h5" textAlign={'center'} sx={{margin: 2}}>
          Contribute
        </Typography>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="inherit" 
          indicatorColor="secondary" 
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              color: 'white', 
            },
            '& .Mui-selected': {
              color: 'light-gray', 
            },
          }}
        >
          <Tab label="Contribute a Question" />
          <Tab label="Contribute a Test Case" />
        </Tabs>
        <Box mt={3}>
          {selectedTab === 0 && <ContributeQuestion />}
          {selectedTab === 1 && <ContributeTestCase />}
        </Box>
      </Box>
    </Container>
  );
};

export default Contribute;
