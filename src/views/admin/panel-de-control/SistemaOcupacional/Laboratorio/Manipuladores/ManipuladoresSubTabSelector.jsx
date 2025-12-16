import SubTabSelector from '../../../../../components/reusableComponents/SubTabSelector';
import Coproparasitologia from './Coproparasitologia/Coproparasitologia';
import Coprocultivo from './Coprocultivo/Coprocultivo';

export default function ManipuladoresSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      label: 'Coprocultivo',
      permission: 'Coprocultivo',
      component: Coprocultivo
    },
    {
      id: 1,
      label: 'Parasitología',
      permission: 'Parasitología',
      component: Coproparasitologia
    }
  ];

  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
