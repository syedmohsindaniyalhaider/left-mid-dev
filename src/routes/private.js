import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';

// dashboard routing
const AssessmentTable = Loadable(lazy(() => import('views/dashboard/AssessmentTable')));
const AssessmentDetail = Loadable(lazy(
  () => import('views/dashboard/AssessmentDetail')));
const PlayerDetail = Loadable(lazy(() => import('views/dashboard/PlayerDetail')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      element: <AssessmentTable />,
    },
    {
      path: 'dashboard/assessment',
      element: <AssessmentTable/>
    },
    {
      path: 'dashboard/assessment/assessment_id=:assessmentId/event_id=:eventId',
      element: <AssessmentDetail/>
    },
    {
      path: 'dashboard/assessment/assessment_id=:assessmentId/event_id=:eventId/player_id=:playerId',
      element: <PlayerDetail/>
    }
  ]
};

export default MainRoutes;
