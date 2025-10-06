import { faChevronLeft, faChevronRight, faFileArrowDown, faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useForm } from "../../../../hooks/useForm"
import { useEffect, useState } from "react";
import { getFetch } from "../../../../utils/apiHelpers";
import { usePagination } from "../../../../utils/listUtils";
import { LoadingDefault } from "../../../../utils/functionUtils";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Visualer from "./Visualer";

const date = new Date();
const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
  2,
  "0"
)}-${String(date.getDate()).padStart(2, "0")}`;

const prevMonthDate = new Date(date);
prevMonthDate.setMonth(prevMonthDate.getMonth() - 3);

const fechaInicio = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}-${String(prevMonthDate.getDate()).padStart(2, "0")}`;

const InitialForm = {
    fechaInicio: fechaInicio,
    fechaFin: today
}

const Historial = ({closeModal,token,user}) => {
    
    const { form, handleChangeSimple } = useForm(InitialForm)
    const [data, setData] = useState([])
    const [pdf, setPdf] = useState({});
    const [openVIsualer, setOpenVisualer] = useState(false)

    useEffect(() => {
        getFetch(`/api/v01/ct/archivos/listadoArchivosPorFechas?fechaInicio=${form.fechaInicio}&fechaFin=${form.fechaFin}`,token)
        .then((res) => {
            setData(res)
            console.log(res)
        })
    },[form])

    const {
        currentPage,
        setCurrentPage,
        recordsPerPage,
        totalPages,
        visiblePages,
        paginatedData,
        handleChangeRecordsPerPage,
    } = usePagination(data, 10);
    
    const ButtonPag = () => {
        return(
             <div className="flex justify-center mt-4">
                <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-1 px-3 py-1 !bg-[#fc6b03] text-white rounded-md disabled:opacity-50"
                >
                <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                {visiblePages.map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`mx-1 px-3 py-1 rounded-md ${
                    currentPage === page
                        ? "!bg-[#233245] text-white"
                        : "bg-gray-200"
                    }`}
                >
                    {page}
                </button>
                ))}

                <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-1 px-3 py-1 !bg-[#fc6b03] text-white rounded-md disabled:opacity-50"
                >
                <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        )
    }

    const DownloadHistory = (item) => {
        LoadingDefault("Generando PDF")
        getFetch(`/api/v01/ct/archivos/listadoArchivosCargaMasivaPorIndice/${item.idHistorialCarga}`,token)
        .then((res) => {
            console.log(res)
            GeneratePDF(res,item)
        })
    }

    const GeneratePDF = (res,item) => {
       const doc = new jsPDF();
         const imgUrl = "/img/logo-color.png";
        // Separar errores y subidos solo de `res`
        const errores = res.filter((item) => item.id === 0);
        const subidos = res.filter((item) => item.id === 1);

        // Agregar logo si existe
        if (imgUrl) {
            doc.addImage(imgUrl, "PNG", 10, 10, 50, 15);
        }

        let yPos = 30;
        const fechaActual = new Date();
        const fecha = fechaActual.toLocaleDateString();
        const hora = fechaActual.toLocaleTimeString();

        // Título
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Reporte de Datos Cargados", 10, yPos);
        yPos += 10;

        doc.setFontSize(10);
        const leftColX = 10;
        const rightColX = 100;

        // Índice
        doc.setFont("helvetica", "bold");
        doc.text("Índice:", leftColX, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(`${item.idHistorialCarga}`, leftColX + 20, yPos);

        // Fecha
        doc.setFont("helvetica", "bold");
        doc.text("Fecha:", rightColX, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(`${item.fechaRegistro}`, rightColX + 15, yPos);
        yPos += 10;

        // Usuario
        doc.setFont("helvetica", "bold");
        doc.text("Usuario:", leftColX, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(`${item.usuarioRegistro}`, leftColX + 25, yPos);

        // Hora
        doc.setFont("helvetica", "bold");
        doc.text("Hora:", rightColX, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(`${item.horaRegistro}`, rightColX + 12, yPos);
        yPos += 10;

        // Total de archivos
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 0, 0);
        doc.text(`Cantidad Total de Archivos: ${res.length}`, leftColX, yPos);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        yPos += 10;

        // Tabla de errores
        if (errores.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Archivos subidos con error:", leftColX, yPos);
            doc.setFont("helvetica", "normal");
            yPos += 5;

            const errorTable = errores.map((file, index) => [
            index + 1,
            file.mensaje || "Nombre no disponible",
            "Error",
            ]);

            autoTable(doc, {
            startY: yPos + 5,
            head: [["#", "Nombre del Archivo", "Estado"]],
            body: errorTable,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [255, 99, 132], textColor: 255 },
            });

            yPos = doc.lastAutoTable.finalY + 10;
        }

        // Tabla de archivos correctos
        if (subidos.length > 0) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Archivos Subidos Correctamente:", leftColX, yPos);
            doc.setFont("helvetica", "normal");
            yPos += 5;

            const successTable = subidos.map((file, index) => [
            index + 1,
            file.mensaje || file.nombre || "Nombre no disponible",
            "Subido Correctamente",
            ]);

            autoTable(doc, {
            startY: yPos + 5,
            head: [["#", "Nombre del Archivo", "Estado"]],
            body: successTable,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [75, 192, 192], textColor: 255 },
            });
        }

        // Numeración de páginas
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.text(`Página ${i} de ${totalPages}`, 105, 290, { align: "center" });
        }

        const today = fechaActual.toISOString().split("T")[0];
        doc.save(`Reporte_${today}.pdf`);
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setPdf({uri: pdfUrl, name: `Reporte_${today}.pdf`})
        setOpenVisualer(true)
        Swal.close()
    }
    
    return(
        <>
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
                <div className="mx-auto bg-white rounded-lg overflow-hidden shadow-md w-[700px] relative">
                <FontAwesomeIcon icon={faTimes} className="absolute top-0 right-0 m-3 cursor-pointer text-gray-400" onClick={closeModal} />
                <div className="p azuloscurobackground flex justify-between p-3.5">
                    <h1 className="text-start font-bold color-azul text-white">Historial de Carga Masiva</h1>
                </div>
                <div className='container p-4'>
                    <div className="bg-white rounded-lg z-50">
                        <div className='flex w-full justify-around gap-4 my-3'>
                            <div className="flex justify-center items-center gap-2">
                                <label className="font-semibold text-lg" htmlFor="">Fecha Inicio:</label>
                                <input value={form.fechaInicio} onChange={handleChangeSimple} name="fechaInicio" type="date" id="" className=" h-10 rounded-md border border-[#e7efee] bg-[#fafafa] px-3 py-2 text-lg ring-[#fafafa] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233245] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10" />
                            </div>
                            <div className="flex justify-center items-center gap-2">
                                <label className="font-semibold text-lg" htmlFor="">Fecha Final:</label>
                                <input value={form.fechaFin} type="date" onChange={handleChangeSimple} name="fechaFin" id="" className=" h-10 rounded-md border border-[#e7efee] bg-[#fafafa] px-3 py-2 text-lg ring-[#fafafa] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#233245] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10" />
                            </div>
                        </div>
                        <div className="mx-3 mb-2 mt-4 w-full">
                            <div className="overflow-auto w-full rounded-xl border border-gray-300">
                                <table className="w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-[#F8FAFA] text-[#233245] ">
                                            <th className="border border-gray-300 px-3 py-2">Usuario</th>
                                            <th className="border border-gray-300 px-3 py-2">Fecha y Hora</th>
                                            <th className="border border-gray-300 px-3 py-2">Cantidad Total de Arch.</th>
                                            <th className="border border-gray-300 px-3 py-2">Archivos Correctos</th>
                                            <th className="border border-gray-300 px-3 py-2">Archivos Fallidos</th>
                                            <th className="border border-gray-300 px-3 py-2">Descargar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(paginatedData) && paginatedData?.map((item, index) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 px-3 py-2">{item.usuarioRegistro}</td>
                                                <td className="border border-gray-300 px-3 py-2">Fecha: {item.fechaRegistro} <br />  Hora: {item.horaRegistro}</td>
                                                <td className="border border-gray-300 px-3 py-2 text-center text-xl font-semibold ">{item.totalArchivos}</td>
                                                <td className="border border-gray-300 px-3 py-2 text-center text-xl font-semibold text-green-500">{item.archivosSubidos}</td>
                                                <td className="border border-gray-300 px-3 py-2 text-center text-xl font-semibold text-red-600">{item.noSubidos}</td>
                                                <td className="border border-gray-300 px-3 py-2 text-center">
                                                    <FontAwesomeIcon onClick={() => {DownloadHistory(item)}} icon={faFileArrowDown} className="text-green-500 cursor-pointer" size="xl" />
                                                </td>
                                            </tr>
                                        )) }
                                        
                                    </tbody>
                                </table>
                            </div>
                            {Array.isArray(paginatedData) && paginatedData.length > 0 ? <ButtonPag/> : ""}
                        </div>
                    </div>
                </div>
                </div>
                {openVIsualer && <Visualer closeModal={() => {setOpenVisualer(false)}} file={pdf} />}
            </div>
        </>
    )
}

export default Historial