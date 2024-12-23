import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';

import AddButtonBottom from '../../components/shared/AddButtonBottom';
import AddTapModal from '../../components/programming/AddTapModal';
import CustomHeader from '../../components/programming/CustomHeader';
import DataTableCell from '../../components/shared/DataTableCell';
import EditTapModal from '../../components/programming/EditTapModal';
import PageContainer from '../../components/shared/PageContainer';

import createTap from '../../services/taps/createTap';
import getMetricTaps from '../../services/taps/getMetricTaps';
import getStandardTaps from '../../services/taps/getStandardTaps';
import updateTap from '../../services/taps/updateTap';

export const TapChart = () => {
  const [searchedValueTapStandard, setSearchedValueTapStandard] = useState('');
  const [searchedValueTapMetric, setSearchedValueTapMetric] = useState('');
  const [searchedStandard, setSearchedStandard] = useState([]);
  const [searchedMetric, setSearchedMetric] = useState([]);
  const [tapName, setTapName] = useState('');
  const [holeSize, setHoleSize] = useState('');
  const [type, setType] = useState('Standard');
  const [notes, setNotes] = useState('-');
  const [id, setId] = useState(0);
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [standardRes, metricRes] = await Promise.all([
        getStandardTaps(),
        getMetricTaps(),
      ]);

      setSearchedStandard(standardRes.data);
      setSearchedMetric(metricRes.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      await createTap(tapName, holeSize, type, notes);
      setShow(false);
      resetFields();
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  }

  const handleOpenTap = (tap) => {
    setId(tap.id);
    setTapName(tap.tapName);
    setHoleSize(tap.holeSize);
    setType(tap.type);
    setNotes(tap.notes);
    setShowEdit(true)
  }

  const handleUpdate = async () => {
    try {
      await updateTap(id, tapName, holeSize, type, notes);
      setShowEdit(false);
      resetFields();
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  }

  const handleCancel = () => {
    setShowEdit(false);
    setShow(false);
    resetFields();
  }

  const resetFields = () => {
    setTapName('');
    setHoleSize('');
    setType('Standard');
    setNotes('-');
    setId(0);
  };

  useEffect(() => {
    fetchData();
  }, [loading]);

  const standardConfig = [
    { label: 'Tap Name', width: '28%', isSearchable: true, value: searchedValueTapStandard, onChange: (e) => setSearchedValueTapStandard(e.target.value), placeholder: 'Tap Name' },
    { label: 'Hole', width: '28%', isSearchable: false },
    { label: 'Notes', width: '44%', isSearchable: false },
  ];

  const metricConfig = [
    { label: 'Tap Name', width: '28%', isSearchable: true, value: searchedValueTapMetric, onChange: (e) => setSearchedValueTapMetric(e.target.value), placeholder: 'Tap Name' },
    { label: 'Hole', width: '28%', isSearchable: false },
    { label: 'Notes', width: '44%', isSearchable: false },
  ];

  return (
    <PageContainer loading={loading} title='Tap Chart'>

      {/* MODALS */}

      <AddTapModal
        open={show}
        onClose={handleCancel}
        tapName={tapName}
        setTapName={setTapName}
        holeSize={holeSize}
        setHoleSize={setHoleSize}
        type={type}
        setType={setType}
        notes={notes}
        setNotes={setNotes}
        onSave={handleSave}
      />

      <EditTapModal
        open={showEdit}
        onClose={handleCancel}
        tapName={tapName}
        setTapName={setTapName}
        holeSize={holeSize}
        setHoleSize={setHoleSize}
        type={type}
        setType={setType}
        notes={notes}
        setNotes={setNotes}
        onUpdate={handleUpdate}
      />

      {/* DATA TABLES */}

      <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <Box sx={{ width: '45%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <CustomHeader columns={standardConfig} />
              </TableHead>
              <TableBody>
                {searchedStandard
                  .filter((row) =>
                    !searchedValueTapStandard || row.tapName.toString().toLowerCase().includes(searchedValueTapStandard.toLowerCase())
                  )
                  .map((tap, index) => {
                    return (
                      <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                        <DataTableCell onClick={() => handleOpenTap(tap)}>{tap.tapName}</DataTableCell>
                        <DataTableCell>{tap.holeSize}</DataTableCell>
                        <DataTableCell>{tap.notes}</DataTableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ width: '45%' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <CustomHeader columns={metricConfig} />
              </TableHead>
              <TableBody>
                {searchedMetric
                  .filter((row) =>
                    !searchedValueTapMetric || row.tapName.toString().toLowerCase().includes(searchedValueTapMetric.toLowerCase())
                  )
                  .map((tap, index) => {
                    return (
                      <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                        <DataTableCell onClick={() => handleOpenTap(tap)}>{tap.tapName}</DataTableCell>
                        <DataTableCell>{tap.holeSize}</DataTableCell>
                        <DataTableCell>{tap.notes}</DataTableCell>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      <AddButtonBottom onClick={handleShow} />
    </PageContainer>
  );
};