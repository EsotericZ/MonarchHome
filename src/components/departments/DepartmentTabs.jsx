import { Tab, Tabs } from '@mui/material';

const DepartmentTabs = ({ selectedTab, handleTabChange, tabLabels }) => {
  return (
    <Tabs
      value={selectedTab}
      onChange={handleTabChange}
      centered
      TabIndicatorProps={{ style: { backgroundColor: 'red' } }}
    >
      {tabLabels.map((label, index) => (
        <Tab
          key={index}
          label={label}
          sx={{
            width: '15%',
            '&.Mui-selected': { color: 'red' },
            '&:focus': { outline: 'none' },
          }}
        />
      ))}
    </Tabs>
  );
};

export default DepartmentTabs;