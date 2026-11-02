import HistoriaOcupacional from "../../SistemaOcupacional/HistoriaOcupacional/HistoriaOcupacional";
import {
    ComboboxAlturaMulti,
    ComboboxAreaMulti,
    ComboboxCargoMulti,
    ComboboxEmpresasMulti,
} from "../../SistemaOcupacional/Admision/model/Combobox";

// Historia Ocupacional no pide sus listas de sugerencias (empresas, altitud, áreas y cargos): se las pasa
// SistemaOcupacional. Aquí se piden al abrir el examen, con los mismos combos y la misma sede ("T-NP").
export default function HistoriaOcupacionalConListas(props) {
    const listas = {
        EmpresasMulti: ComboboxEmpresasMulti("T-NP"),
        AlturaMulti: ComboboxAlturaMulti("T-NP"),
        AreaMulti: ComboboxAreaMulti("T-NP"),
        CargosMulti: ComboboxCargoMulti("T-NP"),
    };

    return <HistoriaOcupacional {...props} listas={listas} />;
}
