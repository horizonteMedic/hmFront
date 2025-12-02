import SubTabSelector from '../../../../../components/reusableComponents/SubTabSelector';
import Coproparasitologia from './Coproparasitologia/Coproparasitologia';
import Coprocultivo from './Coprocultivo/Coprocultivo';
import { faPrescriptionBottle, faSpider } from '@fortawesome/free-solid-svg-icons';

export default function ManipuladoresSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      label: 'Coprocultivo',
      permission: 'Coprocultivo',
      icon: faPrescriptionBottle,
      component: Coprocultivo
    },
    {
      id: 1,
      label: 'Parasitología',
      permission: 'Parasitología',
      icon: faSpider,
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
