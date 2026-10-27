import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";

const MENSAJES_ERROR = {
    sesion: "Sesión no válida: inicie sesión en este equipo",
    conexion: "Sin conexión con el servidor, mostrando la última información",
};

const LeyendaPantalla = ({ totalPacientes, pagina, totalPaginas, error }) => (
    <footer className="flex h-[56px] shrink-0 items-center justify-between px-12 text-[20px] font-medium text-white">
        <div className="flex items-center gap-10">
            <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-[15px]">
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                Área completa
            </span>
            <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-[17px]">
                    <FontAwesomeIcon icon={faXmark} />
                </span>
                Falta pasar (se indica qué)
            </span>
            <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center text-[24px] font-bold text-white/60">–</span>
                No incluida
            </span>
        </div>

        {error && (
            <span className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 text-[18px] font-semibold">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                {MENSAJES_ERROR[error]}
            </span>
        )}

        <span className="text-white/80">
            {totalPacientes} pacientes
            {totalPaginas > 1 && ` · Página ${pagina} de ${totalPaginas}`}
        </span>
    </footer>
);

export default LeyendaPantalla;
