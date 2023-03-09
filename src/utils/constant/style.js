const PLAYER_TABLE_COLUMNS = [
  { 
    id: 'player',
    label: 'Player',
    minWidth: 200, 
    align: 'center' 
  },
  {
    id: 'position',
    label: 'Position',
    minWidth: 110,
    align: 'center',
  },
  {
    id: 'training-note',
    label: 'Training Note',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'psychology',
    label: 'Psychology',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'coaches-reflection',
    label: 'Coaches Reflection',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'coach-feedbacks',
    label: 'Coach Feedbacks',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'player-development-goal',
    label: 'Player Development Goal',
    minWidth: 170,
    align: 'center',
  },
  {
    id: 'player-action-plans',
    label: 'Player Action Plans',
    minWidth: 170,
    align: 'center',
  },
  //{
  //  id: 'notifyCoaches',
  //  label: 'Notify other coaches of assessment',
  //  minWidth: 150,
  //  align: 'center',
  //}
];

const CUSTOM_PLAYER_COLUMNS = [
  {
    id: 'name',
    align: 'left',
    disablePadding: true,
    label: 'Player Name',
    minWidth: 150
  },
  {
    id: 'position',
    align: '	',
    disablePadding: false,
    label: 'Position',
    minWidth: 150
  },
  {
    id: 'height',
    align: 'left',
    disablePadding: false,
    label: 'Height (cm)',
    minWidth: 150
  },
  {
    id: 'weight',
    align: 'left',
    disablePadding: false,
    label: 'Weight (kg)',
    minWidth: 150
  },
  {
    id: 'preferredFoot',
    align: 'left',
    disablePadding: false,
    label: 'Preferred Foot',
    minWidth: 150
  },
  {
    id: 'country',
    align: 'left',
    disablePadding: false,
    label: 'Country',
    minWidth: 150
  },
];

const EVENT_COLUMNS = [
  {
    id: 'type',
    align: 'left',
    disablePadding: false,
    label: 'Type',
    minWidth: 150
  },
  {
    id: 'eventName',
    align: 'left',
    disablePadding: false,
    label: 'Event Name',
    minWidth: 200
  },
  {
    id: 'status',
    align: 'left',
    disablePadding: false,
    label: 'Status',
    minWidth: 150
  },
  {
    id: 'time',
    align: 'left',
    disablePadding: false,
    label: 'Time To Play',
    minWidth: 150
  },
];

const ASSESSMENT_TABLE_COLUMNS = [
  {
    id: 'name',
    label: 'Assessment Name',
    minWidth: 150,
    align: 'center'
  },
  {
    id: 'coachName',
    label: 'Coach Name',
    minWidth: 150,
    align: 'center'
  },
  {
    id: 'event',
    label: 'Event Name',
    minWidth: 300,
    align: 'center'
  },
  {
    id: 'details',
    label: 'Details',
    minWidth: 200,
    align: 'center'
  },
  {
    id: 'date',
    label: 'Create Date',
    minWidth: 150,
    align: 'center'
  },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50vw',
  height: '70vh',
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 15,
  p: 3
};

const boxStyle = {
  position: 'relative',
  bgcolor: 'background.paper',
  mt: 3,
  p: 2,
  height: 'auto',
  maxHeight: '50vh',
  border: '1px solid black',
  borderRadius: '10px',
  overflow: 'auto'
};

export { 
  ASSESSMENT_TABLE_COLUMNS, 
  CUSTOM_PLAYER_COLUMNS, 
  EVENT_COLUMNS, 
  PLAYER_TABLE_COLUMNS, 
  boxStyle, 
  style
};