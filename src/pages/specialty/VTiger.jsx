import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

import { useUserContext } from '../../context/UserContext';

import getAllCustomers from '../../services/vtiger/getAllCustomers';
import getOneCustomer from '../../services/vtiger/getOneCustomer';
import getAllContacts from '../../services/vtiger/getAllContacts';
import getOneContact from '../../services/vtiger/getOneContact';
import getAllQuotes from '../../services/vtiger/getAllQuotes';

import MonarchButton from '../../components/shared/MonarchButton';
import PageContainer from '../../components/shared/PageContainer';

const headers = [
  { label: 'Customer Code', key: 'CustCode' },
  { label: 'Organization Name', key: 'CustName' },
  { label: 'Customer Status', key: 'Active' },
  { label: 'Assigned To', key: 'SalesID' },
  { label: 'Date Open', key: 'DateOpen' },
  { label: 'Website', key: 'Website' },
  { label: 'Billing Address', key: 'BAddr1' },
  { label: 'Billing City', key: 'BCity' },
  { label: 'Billing State', key: 'BState' },
  { label: 'Billing Postal Code', key: 'BZIPCode' },
  { label: 'Primary Phone', key: 'Phone' },
  { label: 'Customer End Use', key: 'WorkCode' },
  { label: 'Date Last Activity', key: 'DateLast' },
  { label: 'YTD Sales', key: 'YTDSales' },
];

const headersContact = [
  { label: 'Organization Name', key: 'CustName' },
  { label: 'Customer Code', key: 'Code' },
  { label: 'Active', key: 'Active' },
  { label: 'First Name', key: 'Contact' },
  { label: 'Last Name', key: 'Contact' },
  { label: 'Title', key: 'Title' },
  { label: 'Office Phone', key: 'Phone' },
  { label: 'Phone Ext', key: 'Extension' },
  { label: 'Primary Email', key: 'EMail' },
  { label: 'Mobile Phone', key: 'Cell_Phone' },
  { label: 'Fax', key: 'FAX' },
  { label: 'Secondary Email', key: 'Mobile' },
  { label: 'Comments', key: 'Comments' },
  { label: 'Mailing Street', key: 'BAddr1' },
  { label: 'Mailing City', key: 'BCity' },
  { label: 'Mailing State', key: 'BState' },
  { label: 'Mailing Zip', key: 'BZIPCode' },
];

const headersQuote = [
  { label: 'Organization Name', key: 'CustDesc' },
  { label: 'Customer Code', key: 'CustCode' },
  { label: 'Opportunity Name', key: 'QuoteNo' },
  { label: 'Amount', key: 'TotalAmount' },
  { label: 'Quote Date', key: 'DateEnt' },
  { label: 'Followup Date', key: 'FollowUpDate' },
  { label: 'Expected Close Date', key: 'ExpireDate' },
  { label: 'Sales Stage', key: 'Stage' },
  { label: 'Assigned To', key: 'QuotedBy' },
  { label: 'Contact Name', key: 'Contact' },
];

const employees = [
  { number: 0, name: 'Unknown' },
  { number: 12, name: 'Brent' },
  { number: 13, name: 'Stan' },
  { number: 98, name: 'Ken' },
  { number: 120, name: 'Brandon' },
  { number: 206, name: 'CJ' },
];

export const VTiger = () => {
  const { cookieData } = useUserContext();
  const [custCode, setCustCode] = useState('');

  const fetchAllExportCSV = async () => {
    try {
      const res = await getAllCustomers();

      const csvData = res.map(item => {
        const dateOpen = item.DateOpen ? item.DateOpen.split('T')[0] : '';
        const dateLast = item.DateLast ? item.DateLast.split('T')[0] : '';
        const active = item.Active == 'N' ? 'Inactive' : 'Active';

        return {
          CustCode: item.CustCode,
          CustName: item.CustName,
          Active: active,
          SalesID: item.SalesID,
          DateOpen: dateOpen,
          Website: item.Website,
          BAddr1: item.BAddr1,
          BCity: item.BCity,
          BState: item.BState,
          BZIPCode: item.BZIPCode,
          Phone: item.Phone,
          WorkCode: item.WorkCode,
          DateLast: dateLast,
          YTDSales: item.YTDSales,
        }
      });

      const csvContent = [
        headers.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AllCustomers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOneExportCSV = async () => {
    try {
      const res = await getOneCustomer(custCode);

      const csvData = res.map(item => {
        const dateOpen = item.DateOpen ? item.DateOpen.split('T')[0] : '';
        const dateLast = item.DateLast ? item.DateLast.split('T')[0] : '';
        const active = item.Active == 'N' ? 'Inactive' : 'Active';

        return {
          CustCode: item.CustCode,
          CustName: item.CustName,
          Active: active,
          SalesID: item.SalesID,
          DateOpen: dateOpen,
          Website: item.Website,
          BAddr1: item.BAddr1,
          BCity: item.BCity,
          BState: item.BState,
          BZIPCode: item.BZIPCode,
          Phone: item.Phone,
          WorkCode: item.WorkCode,
          DateLast: dateLast,
          YTDSales: item.YTDSales,
        }
      });

      const csvContent = [
        headers.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${custCode}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllContactCSV = async () => {
    try {
      const res = await getAllContacts();

      const csvData = res.map(item => {
        const firstName = item.Contact ? item.Contact.split(' ')[0] : '';
        const lastName = item.Contact ? item.Contact.split(' ')[1] : '';
        const active = item.Active[1] == 'N' ? 'False' : 'True';

        return {
          CustName: item.CustName,
          Code: item.Code,
          Active: active,
          firstName: firstName,
          lastName: lastName,
          Title: item.Title,
          Phone: item.Phone[1],
          Extension: item.Extension,
          EMail: item.EMail,
          Cell_Phone: item.Cell_Phone,
          FAX: item.FAX[1],
          Mobile: item.Mobile,
          Comments: item.Comments,
          BAddr1: item.BAddr1,
          BCity: item.BCity,
          BState: item.BState,
          BZIPCode: item.BZIPCode,
        }
      });

      const csvContent = [
        headersContact.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AllCustomersContacts.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOneContactCSV = async () => {
    try {
      const res = await getOneContact(custCode);

      const csvData = res.map(item => {
        const firstName = item.Contact ? item.Contact.split(' ')[0] : '';
        const lastName = item.Contact ? item.Contact.split(' ')[1] : '';
        const active = item.Active[1] == 'N' ? 'False' : 'True';

        return {
          CustName: item.CustName,
          Code: item.Code,
          Active: active,
          firstName: firstName,
          lastName: lastName,
          Title: item.Title,
          Phone: item.Phone[1],
          Extension: item.Extension,
          EMail: item.EMail,
          Cell_Phone: item.Cell_Phone,
          FAX: item.FAX[1],
          Mobile: item.Mobile,
          Comments: item.Comments,
          BAddr1: item.BAddr1,
          BCity: item.BCity,
          BState: item.BState,
          BZIPCode: item.BZIPCode,
        }
      });

      const csvContent = [
        headersContact.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${custCode} CONTACT.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllQuotesCSV = async () => {
    try {
      const res = await getAllQuotes();

      const csvData = res.map(item => {
        const dateEnt = item.DateEnt ? item.DateEnt.split('T')[0] : '';
        const dateFollow = item.FollowUpDate ? item.FollowUpDate.split('T')[0] : '';
        const dateExpire = item.ExpireDate ? item.ExpireDate.split('T')[0] : '';
        const empNumber = parseInt(item.QuotedBy);
        const emp = employees.find(e => e.number === empNumber);
        const empName = emp ? emp.name : 'Unknown';
        const custDesc = item.CustDesc.replace(/,/g, '');

        return {
          CustDesc: custDesc,
          CustCode: item.CustCode,
          QuoteNo: `QUOTE ${item.QuoteNo}`,
          TotalAmount: item.TotalAmount,
          DateEnt: dateEnt,
          FollowUpDate: dateFollow,
          ExpireDate: dateExpire,
          Stage: 'Proposal or Price Quote',
          QuotedBy: empName,
          Contact: 'Looking For This',
        }
      });

      const csvContent = [
        headersQuote.map(header => header.label).join(','),
        ...csvData.map(item => Object.values(item).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'AllQuotes.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageContainer title='VTiger'>
      {cookieData.specialty ? (
        <Box sx={{ padding: '12px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '30vh' }}>
            <Box sx={{ width: 'fit-content', marginTop: '20px' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Company Info</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <TextField
                  variant='outlined'
                  label='Customer Code'
                  onChange={(e) => setCustCode(e.target.value)}
                  sx={{ marginRight: '20px' }}
                />
                <MonarchButton onClick={fetchOneExportCSV}>
                  Submit
                </MonarchButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MonarchButton onClick={fetchAllExportCSV}>
                  Get All
                </MonarchButton>
              </Box>
            </Box>
        
            <Box sx={{ width: 'fit-content', marginTop: '40px' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Contact Info</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <TextField
                  variant='outlined'
                  label='Customer Code'
                  onChange={(e) => setCustCode(e.target.value)}
                  sx={{ marginRight: '20px' }}
                />
                <MonarchButton onClick={fetchOneContactCSV}>
                  Submit
                </MonarchButton>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MonarchButton onClick={fetchAllContactCSV}>
                  Get All
                </MonarchButton>
              </Box>
            </Box>
      
            <Box sx={{ width: 'fit-content', marginTop: '40px' }}>
              <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>Quotes</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MonarchButton onClick={fetchAllQuotesCSV}>
                  Get All
                </MonarchButton>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: '100%', textAlign: 'center', overflowY: 'auto', height: '100vh', paddingTop: '25vh' }}>
          <Typography variant='h4' sx={{ fontWeight: 'bold', margin: '16px' }}>You Don't Have Access To This Page</Typography>
        </Box>
      )}
    </PageContainer>
  );
};