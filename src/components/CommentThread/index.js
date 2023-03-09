import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Stack, IconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { boxStyle, style } from 'utils/constant/style';
import { convertDate } from 'utils/helper';

const CommentThread = ({ toggleQuickAdd, setContent }) => {
  const trainingNote = useSelector(({player}) => player.trainingNote);
  const eventList = useSelector(({assessment}) => assessment.eventList);

  const handleCopyNote = useCallback((note) => {
    setContent(prev => prev + ' ' + note);
  }, [setContent]);

  return (
    <Box 
      sx={{
        ...style,
        boxShadow: 0,
        minHeight: '80vh',
        height: 'auto',
        maxHeight: '80vh',
        width: '20vw',
        transform: toggleQuickAdd ? 'translate(-210%, -50%)' : 'translate(-235%, -50%)',
        overflow: 'auto'
      }}
    >
      <Typography variant='h2'>
				Training Notes
      </Typography>
      <Stack>
        {
          trainingNote?.map((item, index) => (
            <Box 
              key={index}
              sx={{
                ...boxStyle,
                mt: 1,
                p: 1,
                maxHeight: '500px',
                overflow: 'auto',
              }}
            >
              <Stack 
                direction='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography variant='h4'>
										Manager name: {item?.coachName || 
										'Old note so no name show, please make new one and everything is fine'}
                  <br />
										Updated at: {convertDate(item?.createdAt.seconds)}
                  <br />
                  {eventList
                    ?.filter(event => event.id === item?.eventID)
                    ?.map(event => event.eventName)[0] || 'Event: Add later'}
                </Typography>
                <IconButton color='info' onClick={() => handleCopyNote(item.content)}>
                  <ContentCopyIcon/>
                </IconButton>
              </Stack>
              <Typography
                sx={{
                  bgcolor: 'background.paper',
                  width: '100%',
                  wordWrap: 'break-word',
                  mt: 2,
                  fontSize: 15,
                  color: 'black'
                }}
              >
                {item?.content}
              </Typography>
            </Box>
          ))
        }
      </Stack>
    </Box>
  );
};

export default CommentThread;