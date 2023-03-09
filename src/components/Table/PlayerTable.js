import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Checkbox,
  TableContainer,
  TablePagination,
  Avatar,
  Stack,
  Tooltip,
  Box
} from '@mui/material';

import { CustomTableHeader, CustomTableToolBar, stableSort, getComparator } from './TableFunction';
import { CUSTOM_PLAYER_COLUMNS } from 'utils/constant/style';
import NameSearch from 'components/SearchBar/NameSearch';

const PlayerTable = ({data, selected, setSelected}) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [searchContent, setSearchContent] = useState(''); 
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const showPlayer = data.map(item => {
    return {
      ...item,
      fullName: item.firstName + ' ' + item.lastName
    };
  }).filter(item => item.fullName.toLowerCase().includes(searchContent));

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleResetSelected = () => {
    setSelected([]);
  };

  const handleClick = (event, name) => {
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
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  return (
    <Paper sx={{ width: '100%', height: '700px', border: '1px solid black' }}>
      <CustomTableToolBar 
        numSelected={selected?.length} 
        handleReset={handleResetSelected} 
        label={'Pick players'}
      />
      <TableContainer sx={{height: '75%', mb: 3}}>
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
            rowCount={showPlayer?.length}
            cols={CUSTOM_PLAYER_COLUMNS}
          />
          <TableBody>
            {stableSort(showPlayer, getComparator(order, orderBy))
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
                      cursor: 'pointer'
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
                    <TableCell
                      component='th'
                      id={labelId}
                      scope='row'
                      padding='none'
                    >
                      <Stack direction='row' alignItems='center' justifyContent='flex-start' gap={2}> 
                        <Avatar src={row?.profilePhoto}/> 
                        {`${row?.firstName} ${row?.lastName}`}
                      </Stack>   
                    </TableCell>
                    <TableCell align='left'>{row?.preferredPosition || 'None'}</TableCell>
                    <TableCell align='left'>{row?.height || 'None'}</TableCell>
                    <TableCell align='left'>{row?.weight || 'None'}</TableCell>
                    <TableCell align='left'>{row?.preferredFoot || 'None'}</TableCell>
                    <TableCell align='center'>
                      <Tooltip arrow title={row?.country?.name}>
                        <Avatar src={row?.country?.flag}/> 
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (53) * emptyRows,
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
          height: '80px',
          pl: 2,
          pr: 2,
          borderTop: '1px solid black'
        }}
      >
        <NameSearch searchContent={searchContent} setSearchContent={setSearchContent}/>
        <TablePagination
          rowsPerPageOptions={[10, 50, 100, { label: 'All', value: -1 }]}
          component='div'
          count={showPlayer?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
};

PlayerTable.propTypes = {
  data: PropTypes.array,
  selected: PropTypes.array,
  setSelected: PropTypes.func
};

export default PlayerTable;