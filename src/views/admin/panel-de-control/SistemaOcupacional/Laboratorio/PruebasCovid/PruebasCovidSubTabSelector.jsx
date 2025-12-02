import { faHashtag, faVialVirus } from '@fortawesome/free-solid-svg-icons';
import SubTabSelector from '../../../../../components/reusableComponents/SubTabSelector';
import PruebaCualitativaDeAntigenos from './PruebaCualitativaDeAntigenos/PruebaCualitativaDeAntigenos';
import PruebaCuantitativaDeAntigenos from './PruebaCuantitativaDeAntigenos/PruebaCuantitativaDeAntigenos';

export default function PruebasCovidSubTabSelector({ tieneVista }) {
  const tabsConfig = [
    {
      id: 0,
      label: 'Prueba Cualitativa de Antígenos',
      permission: 'Prueba Cualitativa de Antígenos',
      icon: faVialVirus,
      component: PruebaCualitativaDeAntigenos,
    },
    {
      id: 1,
      label: 'Prueba Cuantitativa de Antígenos',
      permission: 'Prueba Cuantitativa de Antígenos',
      icon: faHashtag,
      component: PruebaCuantitativaDeAntigenos,
    },
  ];

  return (
    <SubTabSelector
      tieneVista={tieneVista}
      tabsConfig={tabsConfig}
    />
  );
}
