import { useEffect, useState } from 'react';
import { Alert, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Snackbar  } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

import PuffLoader from 'react-spinners/PuffLoader';
import CheckIcon from '@mui/icons-material/Check';

import getAllJobs from '../../services/forming/getAllJobs';

export const Forming = () => {
  const cookies = new Cookies();
  let cookieData
  try {
    cookieData = jwtDecode(cookies.get('jwt'));
  } catch {
    cookieData = {
      'name': '',
      'role': 'employee',
      'forming': false,
    };
  }

  const [searchedValueJobNo, setSearchedValueJobNo] = useState('');
  const [searchedValuePartNo, setSearchedValuePartNo] = useState('');
  const [searchedValueCustomer, setSearchedValueCustomer] = useState('');
  const [searchedValueType, setSearchedValueType] = useState('');
  const [searchedValueTooling, setSearchedValueTooling] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [partCopy, setPartCopy] = useState('');

  const [searchedForming, setSearchedForming] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [allJobs] = await Promise.all([
        getAllJobs(),
      ]);

      setSearchedForming(allJobs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [loading]);

  return (
    <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh' }}>
      {loading ? (
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Forming</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <PuffLoader color='red' />
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Forming</Typography>
          <Box sx={{ padding: '12px' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' sx={{ width: '8%' }}><input type='text' placeholder='Job No' value={searchedValueJobNo || ''} onChange={(e) => setSearchedValueJobNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                    <TableCell align='center' sx={{ width: '15%' }}><input type='text' placeholder='Part No' value={searchedValuePartNo || ''} onChange={(e) => setSearchedValuePartNo(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Revision</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '7%', fontSize: '15px' }}>Qty</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '8%', fontSize: '15px' }}>Due Date</TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Customer' value={searchedValueCustomer || ''} onChange={(e) => setSearchedValueCustomer(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                    <TableCell align='center' sx={{ width: '10%' }}><input type='text' placeholder='Type' value={searchedValueType || ''} onChange={(e) => setSearchedValueType(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>S2</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>S3</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold', width: '5%', fontSize: '15px' }}>AP</TableCell>
                    <TableCell align='center' sx={{ width: '20%' }}><input type='text' placeholder='Tooling' value={searchedValueTooling || ''} onChange={(e) => setSearchedValueTooling(e.target.value)} style={{ width: '100%', fontWeight: 'bold', fontSize: '15px', border: 'none', outline: 'none', background: 'transparent', color: '#000', textAlign: 'center' }} /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchedForming
                    .filter(row => typeof row.JobNo !== 'undefined')
                    .filter((row) => 
                      !searchedValueJobNo || row.JobNo
                        .toString()
                        .toLowerCase()
                        .includes(searchedValueJobNo.toString().toLowerCase())
                    )
                    .filter((row) => 
                      !searchedValuePartNo || row.PartNo
                        .toString()
                        .toLowerCase()
                        .includes(searchedValuePartNo.toString().toLowerCase())
                    )
                    .filter((row) => 
                      !searchedValueCustomer || row.CustCode
                        .toString()
                        .toLowerCase()
                        .includes(searchedValueCustomer.toString().toLowerCase())
                    )
                    .filter((row) => 
                      !searchedValueType || row.User_Text3
                        .toString()
                        .toLowerCase()
                        .includes(searchedValueType.toString().toLowerCase())
                    )
                    .filter((row) => 
                      !searchedValueTooling || row.Descrip
                        .toString()
                        .toLowerCase()
                        .includes(searchedValueTooling.toString().toLowerCase())
                    )
                    .map((job, index) => {
                      return (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#fff' }}>
                          <TableCell align='center' sx={{ fontSize: '15px', fontWeight: 'bold', p: 1.25 }}>{job.JobNo}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                            <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                              <span>{job.PartNo}</span>
                            </CopyToClipboard>
                          </TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.Revision}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.EstimQty}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.CustCode}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>{job.User_Text3}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>{job.DrawNum && job.DrawNum.includes('S2') && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>{job.DrawNum && job.DrawNum.includes('S3') && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 0 }}>{job.DrawNum && job.DrawNum.includes('AP') && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</TableCell>
                          <TableCell align='center' sx={{ fontSize: '15px', p: 1.25 }}>
                            <CopyToClipboard text={job.Descrip} onCopy={() => { setShowToast(true); setPartCopy(`${job.Descrip}`); }}>
                              <span>{job.Descrip}</span>
                            </CopyToClipboard>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Snackbar
            open={showToast}
            autoHideDuration={3000}
            onClose={() => setShowToast(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            sx={{ marginRight: '100px' }}
          >
            <Alert
              onClose={() => setShowToast(false)}
              severity='success'
              sx={{ width: '100%' }}
            >
              <strong>{partCopy} Copied To Clipboard</strong>
            </Alert>
          </Snackbar>
        </Box>
      )}
    </Box>
  );
};