import SubTabSelector from '../../../../../components/reusableComponents/SubTabSelector';
import Coproparasitologia from './Coproparasitologia/Coproparasitologia';
import Coprocultivo from './Coprocultivo/Coprocultivo';
import { faDroplet, faPrescriptionBottle, faSpider } from '@fortawesome/free-solid-svg-icons';
import ExamenOrina from './ExamenOrina/ExamenOrina';

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
    },
    {
      id: 2,
      label: 'Examen de Orina',
      permission: 'Examen Orina',
      icon: faDroplet,
      component: ExamenOrina
    }
  ];

  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
