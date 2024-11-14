import { useEffect, useState } from 'react';
import { Box, IconButton, Paper, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { format, parseISO } from 'date-fns';
import CheckIcon from '@mui/icons-material/Check';

import AddButton from '../../components/shared/AddButton';
import DataTableCell from '../../components/shared/DataTableCell';
import PageContainer from '../../components/shared/PageContainer';
import RefreshButton from '../../components/shared/RefreshButton';
import SearchTableCell from '../../components/shared/SearchTableCell';
import StandardTableCell from '../../components/shared/StandardTableCell';
import SuppliesModal from '../../components/inventory/SuppliesModal';

import getAllSupplies from '../../services/supplies/getAllSupplies';
import createSupplies from '../../services/supplies/createSupplies';
import updateSupplies from '../../services/supplies/updateSupplies';

export const Supplies = () => {
  const [searchedValueSupplies, setSearchedValueSupplies] = useState('');
  const [searchedValueArea, setSearchedValueArea] = useState('');
  const [searchedValueEmployee, setSearchedValueEmployee] = useState('');
  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  
  const [supplies, setSupplies] = useState('');
  const [department, setDepartment] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [notes, setNotes] = useState('');
  const [productLink, setProductLink] = useState('');
  const [jobNo, setJobNo] = useState('');
  const [id, setId] = useState(0);
  
  const [searchedSupplies, setSearchedSupplies] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const allSupplies = await getAllSupplies();
      setSearchedSupplies(allSupplies.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      await createSupplies(supplies, department, requestedBy, notes, productLink, jobNo)
      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShow = () => {
    setSupplies('');
    setDepartment('');
    setRequestedBy('');
    setNotes('');
    setProductLink('');
    setJobNo('');
    setShow(true);
  };

  const handleUpdateItem = (item) => {
    console.log('hi')
    setId(item.id);
    setSupplies(item.supplies);
    setDepartment(item.department);
    setRequestedBy(item.requestedBy);
    setNotes(item.notes);
    setProductLink(item.productLink);
    setJobNo(item.jobNo);
    setShow(true)
  };

  const handleUpdate = async () => {
    try {
      await updateSupplies(id, supplies, department, requestedBy, notes, productLink, jobNo);
      handleClose();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageContainer loading={loading} title='Supplies'>
      <SuppliesModal
        show={show}
        handleClose={handleClose}
        handleSave={id ? handleUpdate : handleSave}
        supplies={supplies}
        setSupplies={setSupplies}
        requestedBy={requestedBy}
        setRequestedBy={setRequestedBy}
        department={department}
        setDepartment={setDepartment}
        notes={notes}
        setNotes={setNotes}
        productLink={productLink}
        setProductLink={setProductLink}
        jobNo={jobNo}
        setJobNo={setJobNo}
        isEdit={!!id}
      />

      <Box sx={{ padding: '12px' }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <SearchTableCell
                  width='15%'
                  placeholder='Supplies'
                  value={searchedValueSupplies}
                  onChange={(e) => setSearchedValueSupplies(e.target.value)}
                />
                <SearchTableCell
                  width='15%'
                  placeholder='Area'
                  value={searchedValueArea}
                  onChange={(e) => setSearchedValueArea(e.target.value)}
                />
                <SearchTableCell
                  width='15%'
                  placeholder='Requested By'
                  value={searchedValueEmployee}
                  onChange={(e) => setSearchedValueEmployee(e.target.value)}
                />
                <StandardTableCell width='8%'>Created</StandardTableCell>
                <StandardTableCell width='15%'>Description</StandardTableCell>
                <StandardTableCell width='14%'>Link</StandardTableCell>
                <SearchTableCell
                  width='8%'
                  placeholder='Job No'
                  value={searchedValueJobNo}
                  onChange={(e) => setSearchedValueJobNo(e.target.value)}
                />
                <StandardTableCell width='8%'>Need</StandardTableCell>
                <StandardTableCell width='8%'>On Order</StandardTableCell>
                <StandardTableCell width='8%'>Expected</StandardTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchedSupplies
                .filter((row) =>
                  !searchedValueSupplies ||
                  row.supplies.toString().toLowerCase().includes(searchedValueSupplies.toString().toLowerCase())
                )
                .filter((row) =>
                  !searchedValueArea ||
                  row.department.toString().toLowerCase().includes(searchedValueArea.toString().toLowerCase())
                )
                .filter((row) =>
                  !searchedValueEmployee ||
                  row.requestedBy.toString().toLowerCase().includes(searchedValueEmployee.toString().toLowerCase())
                )
                .filter((row) =>
                  !searchedValueJobNo ||
                  row.jobNo.toString().toLowerCase().includes(searchedValueJobNo.toString().toLowerCase())
                )
                .map((item, index) => {
                  return (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                      <DataTableCell onClick={() => handleUpdateItem(item)}>{item.supplies}</DataTableCell>
                      <DataTableCell>{item.department}</DataTableCell>
                      <DataTableCell>{item.requestedBy}</DataTableCell>
                      <DataTableCell>{item.createdAt && format(parseISO(item.createdAt), 'MM/dd h:mmb')}</DataTableCell>
                      <DataTableCell>{item.notes}</DataTableCell>
                      <DataTableCell>{item.productLink}</DataTableCell>
                      <DataTableCell>{item.jobNo}</DataTableCell>
                      <DataTableCell padding={0}>
                        <IconButton>
                          {item.needSupplies && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                        </IconButton>
                      </DataTableCell>
                      <DataTableCell padding={0}>
                        <IconButton>
                          {item.onOrder && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}
                        </IconButton>
                      </DataTableCell>
                      <DataTableCell>{item.expected && format(parseISO(item.expected), 'MM/dd')}</DataTableCell>
                    </TableRow>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <AddButton onClick={handleShow} />
        <RefreshButton onClick={fetchData} />
      </Box>
    </PageContainer>
  );
};