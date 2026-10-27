import { createContext, useContext } from "react";
import RevertButton from "../../../../components/reusableComponents/RevertButton";

// Resaltado y reversión por campo para los exámenes físicos de la Evaluación Musculoesquelética.
// El formulario padre publica `isFieldEdited` / `revertField` (de useRegistroEditable) y cada grupo de radios
// los consume por su `name`, sin tener que hilar props por las decenas de grupos de cada examen.
// El bloqueo de edición va aparte: el padre envuelve los exámenes en un <fieldset disabled>.
export const EdicionContext = createContext({
    isFieldEdited: () => false,
    revertField: () => { },
});

// Props de un grupo de radios: clase de resaltado + botón de revertir (null si no cambió).
export const useCampoEdicion = (name) => {
    const { isFieldEdited, revertField } = useContext(EdicionContext);
    const edited = isFieldEdited(name);
    return {
        claseEditado: edited ? "bg-orange-100 rounded px-1" : "",
        botonRevertir: edited ? (
            <RevertButton onClick={() => revertField(name)} title="Revertir selección" />
        ) : null,
    };
};
