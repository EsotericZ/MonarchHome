import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// import { useUserContext } from '../../context/UserContext';

import CustomTabs from '../../components/shared/CustomTabs';
import DataTableCell from '../../components/shared/DataTableCell';
import PageContainer from '../../components/shared/PageContainer';
import PurchasingTable from '../../components/inventory/PurchasingTable';
import SearchTableCell from '../../components/shared/SearchTableCell';
import StandardTableCell from '../../components/shared/StandardTableCell';
import RefreshButton from '../../components/shared/RefreshButton';

import addNewScaleLog from '../../services/scaleLogs/addNewScaleLog';
import deleteScaleLog from '../../services/scaleLogs/deleteScaleLog';
import getAllScales from "../../services/scales/getAllScales";
import getMMItems from '../../services/scales/getMMItems';
import getMMScaleLogs from '../../services/scaleLogs/getMMScaleLogs';
import getNewRFIDLogs from '../../services/rfid/getNewRFIDLogs';
import getScaleLogs from '../../services/scales/getScaleLogs';

export const Inventory = () => {
  // const { cookieData } = useUserContext();
  const [allScales, setAllScales] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [logData, setLogData] = useState([]);

  const [searchedValueName, setSearchedValueName] = useState('');
  const [searchedValueArea, setSearchedValueArea] = useState('');
  const [searchedValueRack, setSearchedValueRack] = useState('');
  const [searchedValueShelf, setSearchedValueShelf] = useState('');
  const [searchedValueEmployee, setSearchedValueEmployee] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('None');
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  // PAGINATION SETUP
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const generatePageNumbers = () => {
    const totalPages = Math.ceil(logData.length / rowsPerPage);
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handleSearchName = (e) => {
    setSearchedValueName(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchArea = (e) => {
    setSearchedValueArea(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchEmployee = (e) => {
    setSearchedValueEmployee(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = logData
    .filter((row) =>
      !searchedValueName || row.itemName
        .toString()
        .toLowerCase()
        .includes(searchedValueName.toString().toLowerCase())
    )
    .filter((row) =>
      !searchedValueArea || row.area
        .toString()
        .toLowerCase()
        .includes(searchedValueArea.toString().toLowerCase())
    )
    .filter((row) =>
      !searchedValueEmployee || row.EmployeeName
        .toString()
        .toLowerCase()
        .includes(searchedValueEmployee.toString().toLowerCase())
    );

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const handleDelete = async (record) => {
    try {
      await deleteScaleLog(record);
      fetchData();
    } catch (err) {
      console.error(err)
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchData = async () => {
    try {
      const [scales, mmItems, log, mmLog] = await Promise.all([getAllScales(), getMMItems(), getScaleLogs(), getMMScaleLogs()]);
      setAllScales(scales);

      const combinedData = scales.map(scale => {
        const matchingMMItem = mmItems.data.find(item => item.scaleId === scale.ScaleId);
        return { ...scale, ...matchingMMItem };
      });

      const combinedLogs = mmLog.data.map(scale => {
        const matchingItem = mmItems.data.find(item => item.itemLocation === scale.itemLocation);
        return { logid: scale.id, ...scale, ...matchingItem };
      });

      setCombinedData(combinedData);
      setLogData(combinedLogs);
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRFID = async () => {
    try {
      const [rfidLog, logs] = await Promise.all([getNewRFIDLogs(), getScaleLogs()]);
      const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);
      const filteredLogs = logs.filter(log => new Date(log.Timestamp) >= fiveMinutesAgo);

      if (rfidLog.data && rfidLog.data.length > 0 && filteredLogs.length > 0) {
        for (const log of filteredLogs) {
          if (new Date(log.Timestamp) > new Date(rfidLog.data[0].created)) {
            await addNewScaleLog(log);
          }
        };
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(fetchRFID, 150000); // 2.5 minutes
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <PageContainer loading={loading} title='Inventory Home'>
      <CustomTabs
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
        tabLabels={['All Items', 'Materials', 'Logs']}
      />

      {selectedTab == 0 && (
        <h1>1</h1>
      )}

      {selectedTab == 1 && (
        <h1>2</h1>
      )}

      {selectedTab == 2 && (
        <h1>3</h1>
      )}
      {/* <Box sx={{ padding: '12px' }}>
        <Typography>Under Construction</Typography>
      </Box> */}
    </PageContainer>
  );
};