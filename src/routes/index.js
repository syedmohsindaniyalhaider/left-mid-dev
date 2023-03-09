import { useRoutes } from 'react-router-dom';

// routes
import privateRoute from './private';
import publicRoute from './public';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
  return useRoutes([publicRoute, privateRoute , ]);
}
