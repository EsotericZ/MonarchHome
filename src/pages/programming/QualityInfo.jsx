import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Snackbar, Alert, IconButton } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUserContext } from '../../context/UserContext';

import PuffLoader from 'react-spinners/PuffLoader';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

import getAllQCNotes from '../../services/qcinfo/getAllQCNotes';
import createQCNote from '../../services/qcinfo/createQCNote';
import updateQCInfo from '../../services/qcinfo/updateQCInfo';

export const QualityInfo = () => {
  const { cookieData } = useUserContext();
  const [searchedQC, setSearchedQC] = useState([]);
  const [searchedValueCustCode, setSearchedValueCustCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
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

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSave = async () => {
    try {
      await createQCNote(custCode, coc, matlCert, platCert, addInfo, notes);
      setShow(false);
      setCustCode('');
      setCOC(false);
      setMatlCert(false);
      setPlatCert(false);
      setAddInfo(false);
      setNotes('');
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
      setId(0);
      setCustCode('');
      setCOC(false);
      setMatlCert(false);
      setPlatCert(false);
      setAddInfo(false);
      setNotes('');
      setShowEdit(false);
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  }
  
  const handleCancel = () => {
    setId(0);
    setCustCode('');
    setCOC(false);
    setMatlCert(false);
    setPlatCert(false);
    setAddInfo(false);
    setNotes('');
    setShowEdit(false);
  }

  useEffect(() => {
    fetchData();
  }, [loading]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Quality Info</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Quality Info</Typography>

{/* Add Modal */}

          <Dialog open={show} onClose={handleClose} fullWidth>
            <DialogTitle>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
                Add New
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField label='Customer Code' fullWidth value={custCode} onChange={(e) => setCustCode(e.target.value)} sx={{ mb: 2, mt: 1 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormControlLabel
                  control={<Checkbox checked={coc} onChange={(e) => setCOC(e.target.checked)} />}
                  label='Certificate of Conformance Required'
                />
                <FormControlLabel
                  control={<Checkbox checked={matlCert} onChange={(e) => setMatlCert(e.target.checked)} />}
                  label='Material Certs Required'
                />
                <FormControlLabel
                  control={<Checkbox checked={platCert} onChange={(e) => setPlatCert(e.target.checked)} />}
                  label='Plating Certs Required'
                />
                <FormControlLabel
                  control={<Checkbox checked={addInfo} onChange={(e) => setAddInfo(e.target.checked)} />}
                  label='First Article'
                />
              </Box>
              <TextField
                label='Notes'
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
                <Button onClick={handleClose} variant='contained' color='error'>Cancel</Button>
                <Button onClick={handleSave} variant='contained' color='success'>Save</Button>
              </Box>
            </DialogActions>
          </Dialog>

{/* Edit Modal */}

          <Dialog open={showEdit} onClose={handleCancel} fullWidth>
            <DialogTitle>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
                Update Customer Requirements
              </Typography>  
            </DialogTitle>
            <DialogContent>
              <TextField label='Customer Code' fullWidth value={custCode} onChange={(e) => setCustCode(e.target.value)} sx={{ mb: 2, mt: 1 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FormControlLabel
                  control={<Checkbox checked={coc} onChange={(e) => setCOC(e.target.checked)} />}
                  label='Certificate of Conformance Required'
                />
                <FormControlLabel
                  control={<Checkbox checked={matlCert} onChange={(e) => setMatlCert(e.target.checked)} />}
                  label='Material Certs Required'
                />
                <FormControlLabel
                  control={<Checkbox checked={platCert} onChange={(e) => setPlatCert(e.target.checked)} />}
                  label='Plating Certs Required'
                />
                <FormControlLabel
                  control={<Checkbox checked={addInfo} onChange={(e) => setAddInfo(e.target.checked)} />}
                  label='First Article'
                />
              </Box>
              <TextField
                label='Notes'
                multiline
                rows={4}
                fullWidth
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
                <Button onClick={handleCancel} variant='contained' color='error'>Cancel</Button>
                <Button onClick={handleUpdate} variant='contained' color='success'>Save</Button>
              </Box>
            </DialogActions>
          </Dialog>

{/* Data Table */}

          <Box sx={{ padding: '12px' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Customer' value={searchedValueCustCode || ''} onChange={(e) => setSearchedValueCustCode(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>COC</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Material Certs</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>Plating Certs</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '10%', fontSize: '15px' }}>First Article</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '40%', fontSize: '15px' }}>Engineering Note</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedQC
                    .filter((row) =>
                      !searchedValueCustCode || row.custCode
                        .toString()
                        .toLowerCase()
                        .includes(searchedValueCustCode.toLowerCase())
                    )
                    .map((item, index) => (
                      <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                        <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }} onClick={() => handleOpenItem(item)}>{item.custCode}</TableCell>
                        <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>{item.coc && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</TableCell>
                        <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>{item.matlCert && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</TableCell>
                        <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>{item.platCert && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</TableCell>
                        <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>{item.addInfo && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</TableCell>
                        <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                          <CopyToClipboard text={item.notes} onCopy={() => { setShowToast(true); setCopy('Engineering Note Copied'); }}>
                            <Typography>{item.notes}</Typography>
                          </CopyToClipboard>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Snackbar open={showToast} autoHideDuration={3000} onClose={() => setShowToast(false)}>
            <Alert severity='success' onClose={() => setShowToast(false)}>{copy}</Alert>
          </Snackbar>

          <IconButton onClick={handleShow} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px','&:hover': { backgroundColor: '#374151', }, }}>
            <AddIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};