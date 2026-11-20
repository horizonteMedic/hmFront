import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTriangleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";

const MENSAJES_ERROR = {
    sesion: "No se pudo iniciar sesión en el servidor",
    conexion: "Sin conexión con el servidor, mostrando la última información",
};

const formatoHora = new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

const LeyendaPantalla = ({ totalPacientes, pagina, totalPaginas, error, ultimaActualizacion }) => (
    <footer className="flex h-[56px] shrink-0 items-center justify-between px-12 text-[20px] font-medium text-[#0e4d8c]">
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
                Falta pasar algún examen
            </span>
            <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center text-[24px] font-bold text-gray-400">–</span>
                No incluida
            </span>
        </div>

        {error && (
            <span className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 text-[18px] font-semibold text-white">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                {MENSAJES_ERROR[error]}
            </span>
        )}

        <span className="text-[#0e4d8c]/80">
            {totalPacientes} pacientes
            {totalPaginas > 1 && ` · Página ${pagina} de ${totalPaginas}`}
            {ultimaActualizacion && ` · Actualizado ${formatoHora.format(ultimaActualizacion)}`}
        </span>
    </footer>
);

export default LeyendaPantalla;
