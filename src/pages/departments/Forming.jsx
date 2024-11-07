import { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import Cookies from 'universal-cookie';
import { jwtDecode } from 'jwt-decode';

import CheckIcon from '@mui/icons-material/Check';

import CopySnackbar from '../../components/shared/CopySnackbar';
import DataTableCell from '../../components/shared/DataTableCell';
import PageContainer from '../../components/shared/PageContainer';
import SearchTableCell from '../../components/shared/SearchTableCell';
import StandardTableCell from '../../components/shared/StandardTableCell';

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
    <PageContainer loading={loading} title='Forming'>
      <Box sx={{ padding: '12px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <SearchTableCell 
                  width='8%'
                  placeholder='Job No'
                  value={searchedValueJobNo}
                  onChange={(e) => setSearchedValueJobNo(e.target.value)}
                />
                <SearchTableCell 
                  width='15%'
                  placeholder='Part No'
                  value={searchedValuePartNo}
                  onChange={(e) => setSearchedValuePartNo(e.target.value)}
                />
                <StandardTableCell width='7%'>Revision</StandardTableCell>
                <StandardTableCell width='7%'>Qty</StandardTableCell>
                <StandardTableCell width='8%'>Due</StandardTableCell>
                <SearchTableCell 
                  width='10%'
                  placeholder='Customer'
                  value={searchedValueCustomer}
                  onChange={(e) => setSearchedValueCustomer(e.target.value)}
                />
                <SearchTableCell 
                  width='10%'
                  placeholder='Type'
                  value={searchedValueType}
                  onChange={(e) => setSearchedValueType(e.target.value)}
                />
                <StandardTableCell width='5%'>S2</StandardTableCell>
                <StandardTableCell width='5%'>S3</StandardTableCell>
                <StandardTableCell width='5%'>AP</StandardTableCell>
                <SearchTableCell 
                  width='10%'
                  placeholder='Tooling'
                  value={searchedValueTooling}
                  onChange={(e) => setSearchedValueTooling(e.target.value)}
                />
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
                      <DataTableCell sx={{ fontWeight: 'bold' }}>{job.JobNo}</DataTableCell>
                      <DataTableCell>
                        <CopyToClipboard text={job.PartNo} onCopy={() => { setShowToast(true); setPartCopy(`${job.PartNo}`); }}>
                          <span>{job.PartNo}</span>
                        </CopyToClipboard>
                      </DataTableCell>
                      <DataTableCell>{job.Revision}</DataTableCell>
                      <DataTableCell>{job.EstimQty}</DataTableCell>
                      <DataTableCell>{(job.DueDate).split('-')[1] + '/' + ((job.DueDate).split('-')[2]).split('T')[0]}</DataTableCell>
                      <DataTableCell>{job.CustCode}</DataTableCell>
                      <DataTableCell>{job.User_Text3}</DataTableCell>
                      <DataTableCell padding={0}>{job.DrawNum && job.DrawNum.includes('S2') && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</DataTableCell>
                      <DataTableCell padding={0}>{job.DrawNum && job.DrawNum.includes('S3') && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</DataTableCell>
                      <DataTableCell padding={0}>{job.DrawNum && job.DrawNum.includes('AP') && <CheckIcon sx={{ fontSize: '20px', fontWeight: 'bold' }} />}</DataTableCell>
                      <DataTableCell>
                        <CopyToClipboard text={job.Descrip} onCopy={() => { setShowToast(true); setPartCopy(`${job.Descrip}`); }}>
                          <span>{job.Descrip}</span>
                        </CopyToClipboard>
                      </DataTableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <CopySnackbar
        show={showToast}
        onClose={() => setShowToast(false)}
        message={`${partCopy} Copied To Clipboard`}
      />
    </PageContainer>
  );
};