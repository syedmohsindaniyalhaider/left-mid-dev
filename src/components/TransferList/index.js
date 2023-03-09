import React, { useState, useEffect } from 'react';
import PropsTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {  
  Grid, 
  List, 
  ListItem, 
  Checkbox, 
  Button, 
  Paper, 
  Typography, 
  Divider,
  Box
} from '@mui/material';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { selectPlayerToNotify } from 'global/redux/assessment/slice';

const not = (a, b) => {
  return a.filter((value) => b.indexOf(value) === -1);
};

const intersection = (a, b) => {
  return a.filter((value) => b.indexOf(value) !== -1);
};

const TransferList = ({ selectedPlayer, right, setRight }) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(selectedPlayer);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items)?.length;

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  useEffect(() => {
    dispatch(selectPlayerToNotify(right));
  }, [right, dispatch]);

  const customList = (label, items) => (
    <Paper 
      sx={{ 
        width: {
          lg: 200,
          xl: 230,
          xxl: 280,
        }, 
        height: 300, 
        overflow: 'auto', 
        borderRadius: 0,
        border: '1px solid black',
        p: 1 
      }}
    >
      <Box
        sx={{
          bgcolor: 'orange.light',
          p: 2
        }}
      >
        <Typography variant='h4'>
          {label}
        </Typography>
        <Typography>
          {`${numberOfChecked(items)}/${items?.length} selected`}
        </Typography>
      </Box>
      <Divider/>
      <List dense component='div' role='list'>
        {items.map((value) => {
          const labelId = `transfer-list-item-${value.id}-label`;
          return (
            <ListItem
              key={value.id}
              role='listitem'
              onClick={handleToggle(value)}
              sx={{
                cursor: 'pointer', 
              }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.firstName} ${value.lastName}`}/>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={3} justifyContent='center' alignItems='center'>
      <Grid item>{customList('Chosen players', left)}</Grid>
      <Grid item>
        <Grid container direction='column' alignItems='center'>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            onClick={handleAllRight}
            disabled={left?.length === 0}
            aria-label='move all right'
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            onClick={handleCheckedRight}
            disabled={leftChecked?.length === 0}
            aria-label='move selected right'
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            onClick={handleCheckedLeft}
            disabled={rightChecked?.length === 0}
            aria-label='move selected left'
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant='outlined'
            size='small'
            onClick={handleAllLeft}
            disabled={right?.length === 0}
            aria-label='move all left'
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Notify to coaches', right)}</Grid>
    </Grid>
  );
};

TransferList.propsTypes = {
  selectedPlayer: PropsTypes.array,
  right: PropsTypes.array,
  setRight: PropsTypes.string
};

export default TransferList;