import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  Paper, 
  TableContainer, 
  Table, TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TablePagination,
  Box,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';

import AddAssessment from './AddAssessment';
import FilterTeamButton from './TeamFilterButton';
import ViewDetails from './ViewAssessmentDetail';
import { convertDate } from 'utils/helper';
import { ASSESSMENT_TABLE_COLUMNS } from 'utils/constant/style';

const AssessmentTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const { isLoading, assessment } = useSelector(({assessment}) => ({
    isLoading: assessment.isLoading,
    assessment: assessment.assessment
  }));

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box 
        sx={{
          height: 80,
          ml: 1,
        }}
      >
        <FilterTeamButton/>
      </Box>
      <Divider sx={{ borderBottomWidth: 2 }} />
      {
        isLoading 
          ? 
          <Box textAlign='center' sx={{height: 800, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress/>
          </Box>
          : 
          <>
            <TableContainer sx={{height: '69vh', overflow: 'auto'}}>
              <Table stickyHeader aria-label='sticky table'>
                <TableHead>
                  <TableRow>
                    {
                      ASSESSMENT_TABLE_COLUMNS.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))
                    }
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessment
                    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    ?.map((row) => {
                      return (
                        <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>

                          <TableCell align='center'>
                            {row.name}
                          </TableCell>

                          <TableCell align='center'>
                            {row.coachName}
                          </TableCell>

                          <TableCell align='center'>
                            {row?.eventName?.map((item, index) => (
                              <Typography key={index}>
                                {item}
                              </Typography>
                            ))}
                          </TableCell>

                          <TableCell align='center'>
                            <ViewDetails
                              assessmentId={row.id} 
                              eventId={row.eventID}
                            />
                          </TableCell>

                          <TableCell align='center'>
                            {convertDate(row?.createdAt?.seconds)}
                          </TableCell>

                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pl: 3,
              }}
            >
              <AddAssessment/>
              <TablePagination
                rowsPerPageOptions={[10, 50, 100, { label: 'All', value: -1 }]}
                component='div'
                count={assessment?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </>
      }
    </Paper>
  );
};

export default AssessmentTable;