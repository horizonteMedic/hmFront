import SubTabSelector from '../../../../../components/reusableComponents/SubTabSelector';
import Panel10D from './Panel10D/Panel10D';
import Panel2D from './Panel2D/Panel2D';
import Panel3D from './Panel3D/Panel3D';
import Panel4D from './Panel4D/Panel4D';
import Panel5D from './Panel5D/Panel5D';

export default function ToxicologiaSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      label: 'Panel 2D',
      permission: 'Panel 2D',
      component: Panel2D
    },
    {
      label: 'Panel 3D',
      permission: 'Panel 3D',
      component: Panel3D
    },
    {
      label: 'Panel 4D',
      permission: 'Panel 4D',
      component: Panel4D
    },
    {
      label: 'Panel 5D',
      permission: 'Panel 5D',
      component: Panel5D
    },
    {
      label: 'Panel 10D',
      permission: 'Panel 10D',
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
