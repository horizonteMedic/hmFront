import { faCube, faLayerGroup, faSquare, faThLarge } from '@fortawesome/free-solid-svg-icons';
import SubTabSelector from '../../../../../components/reusableComponents/SubTabSelector';
import Panel10D from './Panel10D/Panel10D';
import Panel2D from './Panel2D/Panel2D';
import Panel3D from './Panel3D/Panel3D';
import Panel4D from './Panel4D/Panel4D';
import Panel5D from './Panel5D/Panel5D';

export default function ToxicologiaSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      label: 'Panel 2D',
      permission: 'Panel 2D',
      icon: faSquare,
      component: Panel2D
    },
    {
      id: 1,
      label: 'Panel 3D',
      permission: 'Panel 3D',
      icon: faCube,
      component: Panel3D
    },
    {
      id: 2,
      label: 'Panel 4D',
      permission: 'Panel 4D',
      icon: faThLarge,
      component: Panel4D
    },
    {
      id: 3,
      label: 'Panel 5D',
      permission: 'Panel 5D',
      icon: faLayerGroup,
      component: Panel5D
    },
    {
      id: 4,
      label: 'Panel 10D',
      permission: 'Panel 10D',
      icon: faLayerGroup,
      component: Panel10D
    }
  ];
  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
