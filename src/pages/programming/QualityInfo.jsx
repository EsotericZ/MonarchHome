import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Snackbar, Alert, IconButton } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import AddButtonBottom from '../../components/shared/AddButtonBottom';
import AddQualityInfoModal from '../../components/programming/AddQualityInfoModal';
import CheckIcon from '@mui/icons-material/Check';
import CopySnackbar from '../../components/shared/CopySnackbar';
import CustomHeader from '../../components/programming/CustomHeader';
import DataTableCell from '../../components/shared/DataTableCell';
import EditQualityInfoModal from '../../components/programming/EditQualityInfoModal';
import PageContainer from '../../components/shared/PageContainer';

import createQCNote from '../../services/qcinfo/createQCNote';
import getAllQCNotes from '../../services/qcinfo/getAllQCNotes';
import updateQCInfo from '../../services/qcinfo/updateQCInfo';

export const QualityInfo = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [searchedQC, setSearchedQC] = useState([]);
  const [searchedValueCustCode, setSearchedValueCustCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [copy, setCopy] = useState('');

  const [id, setId] = useState(0);
  const [custCode, setCustCode] = useState('');
  const [coc, setCOC] = useState(false);
  const [matlCert, setMatlCert] = useState(false);
  const [platCert, setPlatCert] = useState(false);
  const [addInfo, setAddInfo] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchData = async () => {
    try {
      const results = await getAllQCNotes();
      setSearchedQC(results.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => {
    setShowAdd(false);
    resetFields();
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    resetFields();
  };

  const resetFields = () => {
    setId(0);
    setCustCode('');
    setCOC(false);
    setMatlCert(false);
    setPlatCert(false);
    setAddInfo(false);
    setNotes('');
  };

  const handleSave = async () => {
    try {
      await createQCNote(custCode, coc, matlCert, platCert, addInfo, notes);
      handleCloseAdd();
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  }

  const handleOpenItem = (item) => {
    setId(item.id);
    setCustCode(item.custCode);
    setCOC(item.coc);
    setMatlCert(item.matlCert);
    setPlatCert(item.platCert);
    setAddInfo(item.addInfo);
    setNotes(item.notes);
    setShowEdit(true);
  }

  const handleUpdate = async () => {
    try {
      await updateQCInfo(id, custCode, coc, matlCert, platCert, addInfo, notes);
      handleCloseEdit();
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  }

  useEffect(() => {
    fetchData();
  }, [loading]);

  let rowIndex = 1;

  const columnConfig = [
    { label: 'Customer', width: '20%', isSearchable: true, value: searchedValueCustCode, onChange: (e) => setSearchedValueCustCode(e.target.value), placeholder: 'Customer' },
    { label: 'COC', width: '10%', isSearchable: false },
    { label: 'Material Certs', width: '10%', isSearchable: false },
    { label: 'Plating Certs', width: '10%', isSearchable: false },
    { label: 'First Article', width: '10%', isSearchable: false },
    { label: 'Engineering Note', width: '40%', isSearchable: false },
  ];

  return (
    <PageContainer loading={loading} title='QC Info'>

      {/* MODALS */}

      <AddQualityInfoModal
        open={showAdd}
        onClose={handleCloseAdd}
        custCode={custCode}
        setCustCode={setCustCode}
        coc={coc}
        setCOC={setCOC}
        matlCert={matlCert}
        setMatlCert={setMatlCert}
        platCert={platCert}
        setPlatCert={setPlatCert}
        addInfo={addInfo}
        setAddInfo={setAddInfo}
        notes={notes}
        setNotes={setNotes}
        onSave={handleSave}
      />

      <EditQualityInfoModal
        open={showEdit}
        onClose={handleCloseEdit}
        custCode={custCode}
        setCustCode={setCustCode}
        coc={coc}
        setCOC={setCOC}
        matlCert={matlCert}
        setMatlCert={setMatlCert}
        platCert={platCert}
        setPlatCert={setPlatCert}
        addInfo={addInfo}
        setAddInfo={setAddInfo}
        notes={notes}
        setNotes={setNotes}
        onSave={handleUpdate}
      />

      {/* Data Table */}

      <Box sx={{ padding: '12px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <CustomHeader columns={columnConfig} />
            </TableHead>
            <TableBody>
              {searchedQC
                .filter((row) =>
                  !searchedValueCustCode || row.custCode.toString().toLowerCase().includes(searchedValueCustCode.toLowerCase())
                )
                .map((item, index) => {
                  rowIndex++;
                  return (
                    <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                      <DataTableCell onClick={() => handleOpenItem(item)}>{item.custCode}</DataTableCell>
                      <DataTableCell padding={0}>{item.coc && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</DataTableCell>
                      <DataTableCell padding={0}>{item.matlCert && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</DataTableCell>
                      <DataTableCell padding={0}>{item.platCert && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</DataTableCell>
                      <DataTableCell padding={0}>{item.addInfo && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</DataTableCell>
                      <DataTableCell>
                        <CopyToClipboard text={item.notes} onCopy={() => { setShowToast(true); setCopy('Engineering Note'); }}>
                          <Typography>{item.notes}</Typography>
                        </CopyToClipboard>
                      </DataTableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <AddButtonBottom onClick={handleShowAdd} />
      <CopySnackbar
        show={showToast}
        onClose={() => setShowToast(false)}
        message={`${copy} Copied To Clipboard`}
      />
    </PageContainer>
  );
};