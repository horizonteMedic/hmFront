import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint, faSquare, faCube, faLayerGroup, faThLarge, faFlask, faPrint, faCannabis } from '@fortawesome/free-solid-svg-icons';
import SubTabSelector from '../../../../../components/reusableComponents/SubTabSelector';
import Panel10D from './Panel10D/Panel10D';
import Panel5D from './Panel5D/Panel5D';
import Panel4D from './Panel4D/Panel4D';
import Panel3D from './Panel3D/Panel3D';
import Panel2D from './Panel2D/Panel2D';
import MuestraDeSangre from './MuestraDeSangre/MuestraDeSangre';
import ConsMarihuana from './ConsMarihuana/ConsMarihuana';
import Boro from './Boro/Boro';
import { PrintHojaRMasivo } from './Controller/ControllerC';
import { useSessionData } from '../../../../../hooks/useSessionData';

export default function ConsentimientosSubTabSelector({ tieneVista }) {
  const { token, } = useSessionData();
  const [norden, setNorden] = useState('');

  const tabsConfig = [
    { id: 0, label: 'Muestra Sangre', permission: 'Consentimiento Muestra Sangre', icon: faTint, component: MuestraDeSangre },
    { id: 1, label: 'Panel 2D', permission: 'Consentimiento Panel 2D', icon: faSquare, component: Panel2D },
    { id: 2, label: 'Panel 3D', permission: 'Consentimiento Panel 3D', icon: faCube, component: Panel3D },
    { id: 3, label: 'Panel 4D', permission: 'Consentimiento Panel 4D', icon: faThLarge, component: Panel4D },
    { id: 4, label: 'Panel 5D', permission: 'Consentimiento Panel 5D', icon: faLayerGroup, component: Panel5D },
    { id: 5, label: 'Panel 10D', permission: 'Consentimiento Panel 10D', icon: faLayerGroup, component: Panel10D },
    { id: 6, label: 'Cons. Marihuana', permission: 'Consentimiento Cons. Marihuana', icon: faCannabis, component: ConsMarihuana },
    { id: 7, label: 'BORO', permission: 'Consentimiento BORO', icon: faFlask, component: Boro },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-end space-x-2 px-4">
        <span className="font-semibold text-lg">Impresión Masiva</span>
        <input
          className="border rounded px-2 py-1 w-32 text-base"
          value={norden}
          onChange={(e) => { setNorden(e.target.value); }}
          name="norden"
        />
        <button
          type="button"
          onClick={() => { PrintHojaRMasivo(norden, token); }}
          className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded border border-blue-700 flex items-center shadow-md transition-colors"
        >
          <FontAwesomeIcon icon={faPrint} />
        </button>
      </div>
      <SubTabSelector tieneVista={tieneVista} tabsConfig={tabsConfig} />


    </div>
  );
};

