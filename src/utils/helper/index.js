import { toast } from 'react-toastify';

const showNoti = (type, message, position = 'top-right') =>
  toast?.[type](message, { containerId: position });

const convertDate = (time) => {
  //time should be server timestamp seconds only
  const dateInMillis = time * 1000;
  const date = new Date(dateInMillis);
  let myDate = date.toLocaleDateString();
  const myTime = date.toLocaleTimeString();
  myDate = myDate.replaceAll('/', '-');
  const newDateFormat = myDate.split('-');
  return `${newDateFormat[1]}-${newDateFormat[0]}-${newDateFormat[2]} ${myTime}`;
};

const getCurrentDate = (type) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();
  const time =  today.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  if (type === 'seconds') {
    return Math.round(Date.now() / 1000); 
  } else {
    return `${mm}-${dd}-${yyyy} ${time}`;
  }
};

const toCappitalize = (word) => {
  return word?.charAt(0).toUpperCase() + word?.slice(1);
};

export { convertDate, getCurrentDate, showNoti, toCappitalize };