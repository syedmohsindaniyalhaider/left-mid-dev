import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Checkbox,
  TableContainer,
  TablePagination,
  CircularProgress,
  Box,
} from '@mui/material';

import {
  CustomTableHeader,
  CustomTableToolBar,
  stableSort,
  getComparator,
} from './TableFunction';
import { EVENT_COLUMNS } from 'utils/constant/style';
import { convertDate, toCappitalize } from 'utils/helper';
import EventSearch from 'components/SearchBar/EventSearch';

const CustomTable = ({ data, selected, setSelected }) => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [searchContent, setSearchContent] = useState('');
  const isLoading = useSelector(({ auth }) => auth.isLoading);
  const showEvent = data.filter((item) =>
    item.eventName.toLowerCase().includes(searchContent)
  );

  const isSelected = useCallback(
    (name) => selected.indexOf(name) !== -1,
    [selected]
  );

  const handleRequestSort = useCallback(
    (event, property) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    },
    [order, orderBy]
  );

  const handleSelectAllClick = useCallback(
    (event) => {
      if (event.target.checked) {
        const newSelected = data.map((n) => n.id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    },
    [data, setSelected]
  );

  const handleResetSelected = useCallback(() => {
    setSelected([]);
  }, [setSelected]);

  const handleClick = useCallback(
    (event, name) => {
      const selectedIndex = selected.indexOf(name);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected?.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      setSelected(newSelected);
    },
    [selected, setSelected]
  );

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  return (
    <Paper
      sx={{
        width: '100%',
        height: '500',
        minHeight: '800',
        border: '1px solid black',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <CustomTableToolBar
            numSelected={selected?.length}
            handleReset={handleResetSelected}
            label={'Select Events'}
          />
          <TableContainer
            sx={{
              height: 550,
            }}
          >
            <Table
              sx={{ width: '100%' }}
              aria-labelledby='tableTitle'
              size={'medium'}
            >
              <CustomTableHeader
                numSelected={selected?.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={showEvent?.length}
                cols={EVENT_COLUMNS}
              />
              <TableBody>
                {stableSort(showEvent, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell align='left'>{row?.type}</TableCell>
                        <TableCell align='left'>{row?.eventName}</TableCell>
                        <TableCell align='left'>
                          {toCappitalize(row?.status)}
                        </TableCell>
                        <TableCell align='left'>
                          {convertDate(row?.time?.seconds)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 100,
              pl: 2,
              pr: 2,
              borderTop: '1px solid black',
            }}
          >
            <EventSearch
              searchContent={searchContent}
              setSearchContent={setSearchContent}
            />
            <TablePagination
              rowsPerPageOptions={[10, 50, 100, { label: 'All', value: -1 }]}
              component='div'
              count={showEvent?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      )}
    </Paper>
  );
};

CustomTable.propTypes = {
  data: PropTypes.array,
  selected: PropTypes.array,
  setSelected: PropTypes.func,
};

export default CustomTable;
