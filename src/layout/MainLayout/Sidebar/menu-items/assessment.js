// assets
import AssessmentIcon from '@mui/icons-material/Assessment';

// constant
const icons = { AssessmentIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const assessment = {
  id: 'assessment',
  title: 'Assessment',
  type: 'group',
  children: [
    {
      id: 'assessment',
      title: 'Assessment',
      type: 'item',
      url: '/dashboard/assessment',
      icon: icons.AssessmentIcon,
      breadcrumbs: false
    },
  ]
};

export default assessment;
