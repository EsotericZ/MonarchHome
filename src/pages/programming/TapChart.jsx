import { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, TextField, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import PuffLoader from 'react-spinners/PuffLoader';
import AddIcon from '@mui/icons-material/Add';

import createTap from '../../services/taps/createTap';
import getMetricTaps from '../../services/taps/getMetricTaps';
import getStandardTaps from '../../services/taps/getStandardTaps';
import updateTap from '../../services/taps/updateTap';

export const TapChart = () => {
  const { cookieData } = useUserContext();
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    try {
      await createTap(tapName, holeSize, type, notes);
      setShow(false);
      setTapName('');
      setHoleSize('');
      setType('Standard');
      setNotes('-');
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
      setId(0);
      setTapName('');
      setHoleSize('');
      setType('');
      setNotes('');
      setShowEdit(false);
    } catch (err) {
      console.error(err);
    } finally {
      fetchData();
    }
  }

  const handleCancel = () => {
    setTapName('');
    setHoleSize('');
    setType('');
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
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Tap Chart</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Tap Chart</Typography>

{/* Add Modal */}

          <Dialog open={show} onClose={handleClose} fullWidth>
            <DialogTitle>
              <Typography sx={{ fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
                Add Tap
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField label='Tap Name' fullWidth value={tapName} onChange={(e) => setTapName(e.target.value)} sx={{ mb: 2, mt: 1 }} />
              <TextField label='Hole Size' fullWidth value={holeSize} onChange={(e) => setHoleSize(e.target.value)} sx={{ mb: 2, mt: 1 }} />
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel id="tap-type-label">Type</InputLabel>
                <Select
                  labelId="tap-type-label"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="Metric">Metric</MenuItem>
                </Select>
              </FormControl>
              <TextField label='Notes' fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mb: 2, mt: 1 }} />
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
                Update Tap
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField label='Tap Name' fullWidth value={tapName} onChange={(e) => setTapName(e.target.value)} sx={{ mb: 2, mt: 1 }} />
              <TextField label='Hole Size' fullWidth value={holeSize} onChange={(e) => setHoleSize(e.target.value)} sx={{ mb: 2, mt: 1 }} />
              <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
                <InputLabel>Type</InputLabel>
                <Select value={type} onChange={(e) => setType(e.target.value)} label='Type'>
                  <MenuItem value='Standard'>Standard</MenuItem>
                  <MenuItem value='Metric'>Metric</MenuItem>
                </Select>
              </FormControl>
              <TextField label='Notes' fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ mb: 2, mt: 1 }} />
            </DialogContent>
            <DialogActions>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 2, paddingBottom: 2 }}>
                <Button onClick={handleCancel} variant='contained' color='error'>Cancel</Button>
                <Button onClick={handleUpdate} variant='contained' color='success'>Save</Button>
              </Box>
            </DialogActions>
          </Dialog>

{/* Data Table */}

          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Box sx={{ width: '45%' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align='center'><input type='text' placeholder='Tap' value={searchedValueTapStandard || ''} onChange={(e) => setSearchedValueTapStandard(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px' }}>Hole</TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px' }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchedStandard
                      .filter((row) =>
                        !searchedValueTapStandard || row.tapName
                          .toString()
                          .toLowerCase()
                          .includes(searchedValueTapStandard.toLowerCase())
                      )
                      .map((tap, index) => {
                        return (
                          <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                            <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }} onClick={() => handleOpenTap(tap)}>{tap.tapName}</TableCell>
                            <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{tap.holeSize}</TableCell>
                            <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{tap.notes}</TableCell>
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
                    <TableRow>
                      <TableCell align='center'><input type='text' placeholder='Tap' value={searchedValueTapMetric || ''} onChange={(e) => setSearchedValueTapMetric(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px' }}>Hole</TableCell>
                      <TableCell align='center' sx={{ fontWeight: 'bold', fontSize: '15px' }}>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchedMetric
                      .filter((row) =>
                        !searchedValueTapMetric || row.tapName
                          .toString()
                          .toLowerCase()
                          .includes(searchedValueTapMetric.toLowerCase())
                      )
                      .map((tap, index) => {
                        return (
                          <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                            <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }} onClick={() => handleOpenTap(tap)}>{tap.tapName}</TableCell>
                            <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{tap.holeSize}</TableCell>
                            <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{tap.notes}</TableCell>
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>

          <IconButton onClick={handleShow} sx={{ backgroundColor: '#111827', color: 'white', height: '52.5px', width: '52.5px', zIndex: 1000, position: 'fixed', bottom: '20px', right: '20px', '&:hover': { backgroundColor: '#374151', }, }}>
            <AddIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};