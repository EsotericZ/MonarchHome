import { useEffect, useState } from 'react';
import { Box, Button, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import DeleteIcon from '@mui/icons-material/Delete';

import CopySnackbar from '../../components/shared/CopySnackbar';
import CustomTabs from '../../components/shared/CustomTabs';
import DataTableCell from '../../components/shared/DataTableCell';
import PageContainer from '../../components/shared/PageContainer';
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
      !searchedValueName || (row.scaleName || '').toString().toLowerCase().includes(searchedValueName.toLowerCase())
    )
    .filter((row) =>
      !searchedValueArea || (row.itemLocation || '').toString().toLowerCase().includes(searchedValueArea.toLowerCase())
    )
    .filter((row) =>
      !searchedValueEmployee || (row.employee || '').toString().toLowerCase().includes(searchedValueEmployee.toLowerCase())
    );

  const currentRows = filteredData.slice(indexOfFirstRow, Math.min(indexOfLastRow, filteredData.length));
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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
        <Box sx={{ padding: '12px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <SearchTableCell
                    width='30%'
                    placeholder='E2 Part No'
                    value={searchedValueName}
                    onChange={(e) => setSearchedValueName(e.target.value)}
                  />
                  <StandardTableCell width='10%'>Qty</StandardTableCell>
                  <StandardTableCell width='10%'>Alert</StandardTableCell>
                  <SearchTableCell
                    width='20%'
                    placeholder='Area'
                    value={searchedValueArea}
                    onChange={(e) => setSearchedValueArea(e.target.value)}
                  />
                  <SearchTableCell
                    width='10%'
                    placeholder='Rack'
                    value={searchedValueRack}
                    onChange={(e) => setSearchedValueRack(e.target.value)}
                  />
                  <SearchTableCell
                    width='10%'
                    placeholder='Shelf'
                    value={searchedValueShelf}
                    onChange={(e) => setSearchedValueShelf(e.target.value)}
                  />
                  <StandardTableCell width='10%'>Bin</StandardTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {combinedData
                  .filter((row) =>
                    !searchedValueName ||
                    row.itemName.toString().toLowerCase().includes(searchedValueName.toString().toLowerCase())
                  )
                  .filter((row) =>
                    !searchedValueArea ||
                    row.area.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase())
                  )
                  .filter((row) =>
                    !searchedValueRack ||
                    row.rack.toString().toLowerCase().includes(searchedValueRack.toString().toLowerCase())
                  )
                  .filter((row) =>
                    !searchedValueShelf ||
                    row.shelf.toString().toLowerCase().includes(searchedValueShelf.toString().toLowerCase())
                  )
                  .map((scale, index) => {
                    if (scale.area != 'Material') {
                      const rowClass = (scale.Quantity <= scale.alert) ? 'expedite-row' : '';
                      return (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
                          <DataTableCell padding={1.5}>
                            <CopyToClipboard text={scale.itemName} onCopy={() => { setShowToast(true); setPartCopy(`${scale.itemName}`); }}>
                              <span>{scale.itemName}</span>
                            </CopyToClipboard>
                          </DataTableCell>
                          <DataTableCell padding={1.5}>{scale.Quantity}</DataTableCell>
                          <DataTableCell padding={1.5}>{scale.alert}</DataTableCell>
                          <DataTableCell padding={1.5}>{scale.area}</DataTableCell>
                          <DataTableCell padding={1.5}>{scale.rack}</DataTableCell>
                          <DataTableCell padding={1.5}>{scale.shelf}</DataTableCell>
                          <DataTableCell padding={1.5}>{scale.bin}</DataTableCell>
                        </TableRow>
                      )
                    }
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>

          <RefreshButton onClick={fetchData} />
          <CopySnackbar
            show={showToast}
            onClose={() => setShowToast(false)}
            message={`${partCopy} Copied To Clipboard`}
          />
        </Box>
      )}

      {selectedTab == 1 && (
        <Box sx={{ padding: '12px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <SearchTableCell
                    width='40%'
                    placeholder='Material'
                    value={searchedValueName}
                    onChange={(e) => setSearchedValueName(e.target.value)}
                  />
                  <StandardTableCell width='20%'>Qty</StandardTableCell>
                  <StandardTableCell width='20%'>Alert</StandardTableCell>
                  <SearchTableCell
                    width='20%'
                    placeholder='Rack'
                    value={searchedValueRack}
                    onChange={(e) => setSearchedValueRack(e.target.value)}
                  />
                </TableRow>
              </TableHead>
              <TableBody>
                {combinedData
                  .filter((row) =>
                    !searchedValueName ||
                    row.itemName.toString().toLowerCase().includes(searchedValueName.toString().toLowerCase())
                  )
                  .filter((row) =>
                    !searchedValueRack ||
                    row.rack.toString().toLowerCase().includes(searchedValueRack.toString().toLowerCase())
                  )
                  .map((scale, index) => {
                    if (scale.area === 'Material') {
                      const rowClass = (scale.Quantity <= scale.alert && scale.Quantity >= 0) ? 'expedite-row' : '';
                      return (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }} className={`${rowClass}`}>
                          <DataTableCell padding={1.5}>
                            <CopyToClipboard text={scale.itemName} onCopy={() => { setShowToast(true); setPartCopy(`${scale.itemName}`); }}>
                              <span>{scale.itemName}</span>
                            </CopyToClipboard>
                          </DataTableCell>
                          {scale.Quantity < 0 ?
                            <DataTableCell padding={1.5}>Pallet Removed</DataTableCell>
                            :
                            <DataTableCell padding={1.5}>{scale.Quantity}</DataTableCell>
                          }
                          <DataTableCell padding={1.5}>{scale.alert}</DataTableCell>
                          <DataTableCell padding={1.5}>{scale.rack}</DataTableCell>
                        </TableRow>
                      )
                    }
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>

          <RefreshButton onClick={fetchData} />
          <CopySnackbar
            show={showToast}
            onClose={() => setShowToast(false)}
            message={`${partCopy} Copied To Clipboard`}
          />
        </Box>
      )}

      {selectedTab == 2 && (
        <Box sx={{ padding: '12px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <SearchTableCell
                    width='25%'
                    placeholder='E2 Part No'
                    value={searchedValueName}
                    onChange={handleSearchName}
                  />
                  <StandardTableCell width='10%'>Old Qty</StandardTableCell>
                  <StandardTableCell width='10%'>New Qty</StandardTableCell>
                  <StandardTableCell width='10%'>Alert</StandardTableCell>
                  <SearchTableCell
                    width='20%'
                    placeholder='Area'
                    value={searchedValueArea}
                    onChange={handleSearchArea}
                  />
                  <SearchTableCell
                    width='20%'
                    placeholder='Employee'
                    value={searchedValueEmployee}
                    onChange={handleSearchEmployee}
                  />
                  <StandardTableCell width='5%'></StandardTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows
                  .map((scale, index) => {
                    return (
                      <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                        <DataTableCell padding={0.5}>
                          <CopyToClipboard text={scale.scaleName} onCopy={() => { setShowToast(true); setPartCopy(`${scale.scaleName}`); }}>
                            <span>{scale.scaleName}</span>
                          </CopyToClipboard>
                        </DataTableCell>
                        <DataTableCell padding={0.5}>{scale.oldQty}</DataTableCell>
                        <DataTableCell padding={0.5}>{scale.newQty}</DataTableCell>
                        <DataTableCell padding={0.5}>{format(parseISO(scale.timeStamp), 'MM/dd/yy hh:mm a')}</DataTableCell>
                        <DataTableCell padding={0.5}>{scale.itemLocation}</DataTableCell>
                        <DataTableCell padding={0.5}>{scale.employee}</DataTableCell>
                        <DataTableCell padding={0.5}>
                          <IconButton onClick={() => handleDelete(scale)} style={{ cursor: 'pointer' }}>
                            <DeleteIcon />
                          </IconButton>
                        </DataTableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div className="pagination-container">
                <Button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-arrow"
                >
                  &larr; Previous
                </Button>

                {generatePageNumbers().map((page, index) => (
                  <Button
                    key={index}
                    onClick={() => page !== '...' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`pagination-number ${page === currentPage ? 'selected' : ''}`}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === Math.ceil(logData.length / rowsPerPage)}
                  className="pagination-arrow"
                >
                  Next &rarr;
                </Button>
              </div>
            </div>
          )}

          <RefreshButton onClick={fetchData} />
          <CopySnackbar
            show={showToast}
            onClose={() => setShowToast(false)}
            message={`${partCopy} Copied To Clipboard`}
          />
        </Box>
      )}
    </PageContainer>
  );
};