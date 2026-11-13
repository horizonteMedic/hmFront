import Swal from "sweetalert2";
import { LoadingDefault, MostrarOpcionesImpresion } from "../../../../../utils/functionUtils";
import { formatearFechaHora } from "../../../../../utils/formatDateUtils";
import { obtenerCmpMedico, obtenerDigitalizacionMedico, obtenerRegistroPorTicket } from "../../../../../utils/registroAsistencialUtils";
import { ordenarInventarios } from "../../Inventario/Catalogo/Inventarios/controllerInventarios";
import { consultarInventario, enviarInventario, escaparHtml, etiquetaMedicamento, inventarioUrl, limpiarTexto } from "../../Inventario/Compartido/inventarioUtils";

// Recetas (reserva de medicamentos) del ticket (RecetaAsistencialDTO). La comparten las Historias Clínicas del
// módulo: solo se muestra en tickets de La Arena (esArena) y se guarda junto con la Historia Clínica (su botón
// Guardar), no por separado (ver controllerComplementos). Solo RESERVA el stock: farmacia la entrega (o la anula)
// desde Inventario > Entrega por Ticket. Una vez guardada se imprime desde el mensaje de éxito o desde el botón
// IMPRIMIR N° TICKET, junto al Descanso Médico y al Informe de Accidente (ver ImprimirRecetaPorTicket).
//
// Un ticket puede tener VARIAS recetas, una detrás de otra (p. ej. la de Medicina y la de Odontología), pero solo una
// pendiente (ni entregada ni anulada) a la vez. El formulario trabaja con la receta ACTUAL (la pendiente o, si no hay,
// la última entregada) y, cuando esa ya fue entregada, ofrece «Nueva receta»: el guardado envía entonces
// `nuevaReceta: true` (sin él, el backend no abre otra receta sobre un ticket que ya tuvo una entregada).
//   GET  /asistencial/recetas/ticket/{numeroTicket}            -> receta actual (404 / id null si todavía no hay).
//   GET  /asistencial/recetas/ticket/{numeroTicket}/historial  -> todas las recetas del ticket (entregadas, pendientes y
//                                                                 anuladas), de la más reciente a la más antigua.
//   POST /asistencial/recetas?usuario=               -> { numeroTicket, inventarioId?, nuevaReceta?, detalles: [{ medicamentoId,
//                                                       cantidad, indicacion }] } (crea o edita la pendiente y reserva el stock).
//   GET  /asistencial/inventario/medicamentos?inventarioId=&activo=true -> medicamentos con stockDisponible.
// El DTO NO declara el inventario como escribible (inventarioId es de solo lectura): la sección ofrece un combo con los
// inventarios activos, el CENTRAL por defecto (sin importar la sede del ticket), y muestra el stock del elegido; el POST
// envía además `inventarioId` por si el backend lo toma. Con la receta ya registrada el campo muestra, bloqueado, el
// inventario que registró el backend.
//
// Campos del formulario que usa (cada Historia Clínica los toma de RECETA_ESTADO_INICIAL):
//   n_hcl, pacienteId, ticketSede, esArena, y todos los `receta*` de abajo.
const recetasUrl = "/asistencial/recetas";

// Reporte Jasper. El glob debe ser un literal para que Vite pueda resolverlo en build; por eso se
// declara aquí (en el controller).
const jasperModules = import.meta.glob("../../../../../jaspers/ModuloAsistencial/Receta/Receta.jsx");
const rutaJasper = "../../../../../jaspers/ModuloAsistencial/Receta/Receta.jsx";

// Estado de la sección dentro del formulario de la Historia Clínica. recetaItems es la lista de la receta
// ({ uid, medicamentoId, medicamento, cantidad, indicacion, cantidadFaltante, registrado, entregado, fechaEntrega }) y
// recetaMedicamento*/recetaCantidad/
// recetaIndicacion son la línea que se está armando antes de pulsar "Agregar".
export const RECETA_LINEA_VACIA = {
    recetaMedicamentoTexto: "",
    recetaMedicamentoId: "",
    recetaCantidad: "",
    recetaIndicacion: "",
};

export const RECETA_ESTADO_INICIAL = {
    recetaId: null,
    // Todas las recetas del ticket (más reciente primero): alimentan el historial y deciden si se ofrece «Nueva receta».
    recetaHistorial: [],
    // true mientras se arma una receta NUEVA sobre un ticket cuya última receta ya fue entregada (el guardado envía nuevaReceta).
    recetaNueva: false,
    // true mientras se corrige la receta PENDIENTE del ticket (el guardado la edita; no se envía nuevaReceta).
    recetaEditando: false,
    // "" (sin receta), "pendiente", "entregada" o "anulada".
    recetaEstado: "",
    recetaItems: [],
    recetaUsuario: "",
    recetaFechaRegistro: "",
    // Nombre del inventario de la receta ya registrada (lo entrega el backend, solo lectura).
    recetaInventario: "",
    // Id (texto) del inventario elegido en el combo para la receta nueva; la sección lo deja en el central si está vacío.
    recetaInventarioId: "",
    recetaConFaltante: false,
    recetaMotivoAnulacion: "",
    ...RECETA_LINEA_VACIA,
};

let contadorItems = 0;

// ===== Medicamentos del inventario =====
// Inventarios activos para el combo, con el central (el que no tiene inventario padre) primero, como en el resto del
// módulo de Inventario. { ok, inventarios } o { ok: false, mensaje }.
export const CargarInventariosReceta = async (token) => {
    const res = await consultarInventario(`${inventarioUrl}/inventarios`, token, "No se pudo cargar el inventario de medicamentos.");
    if (!res.ok) return res;

    const inventarios = (Array.isArray(res.resultado) ? res.resultado : [])
        .filter((inventario) => inventario.activo !== false)
        .sort(ordenarInventarios);
    if (!inventarios.length) return { ok: false, mensaje: "No hay un inventario activo del que reservar medicamentos." };
    return { ok: true, inventarios };
};

// El inventario elegido (por id) si sigue en la lista; si no hay elección, el central (la lista lo trae primero).
export const inventarioElegido = (inventarios, inventarioId) =>
    inventarios.find((inventario) => String(inventario.id) === String(inventarioId ?? "")) ?? inventarios[0] ?? null;

// { ok, medicamentos } o { ok: false, mensaje }: los medicamentos del inventario con su stock en él. Cada uno trae su
// stockDisponible (lo que ya no está reservado por otras recetas) y `medicamentoId` (alias de `id`, que es lo que lee
// BuscadorMedicamentoStock).
export const CargarMedicamentosReceta = async (inventarioId, token) => {
    const query = new URLSearchParams({ inventarioId, activo: "true" });
    const res = await consultarInventario(`${inventarioUrl}/medicamentos?${query}`, token, "No se pudo cargar la lista de medicamentos.");
    if (!res.ok) return res;

    const medicamentos = (Array.isArray(res.resultado) ? res.resultado : [])
        .map((medicamento) => ({ ...medicamento, medicamentoId: medicamento.id }))
        .sort((a, b) => etiquetaMedicamento(a).localeCompare(etiquetaMedicamento(b), "es"));
    return { ok: true, medicamentos };
};

// Cantidad de stock para mostrar: "—" si el backend no la trajo (no es lo mismo que 0).
export const cantidadStock = (valor) => (valor == null ? "—" : valor);

// Saldo del medicamento en el buscador. Disponible = físico − reservado por recetas pendientes: se muestran los tres
// para que se entienda un "0" cuando sí hay stock físico (todo reservado, o lotes vencidos).
export const detalleStockReceta = (medicamento) =>
    `Disp. ${cantidadStock(medicamento.stockDisponible)} (Físico ${cantidadStock(medicamento.stockActual)} · Reserv. ${cantidadStock(medicamento.stockReservado)})`;

// Explicación cuando hay stock físico pero nada disponible; "" si no aplica.
export const avisoSinDisponible = (medicamento) => {
    const fisico = Number(medicamento?.stockActual);
    const reservado = Number(medicamento?.stockReservado) || 0;
    if (medicamento?.stockDisponible == null || Number(medicamento.stockDisponible) > 0 || !(fisico > 0)) return "";

    return reservado >= fisico
        ? `Hay ${fisico} unidades físicas, pero todas están reservadas por recetas pendientes (se liberan al entregarlas o anularlas).`
        : `Hay ${fisico} unidades físicas, pero ninguna está disponible (${reservado} reservadas; el resto puede estar en lotes vencidos).`;
};

// ===== Lectura =====
// Receta actual del ticket (la pendiente; si no hay, la última entregada), o null si todavía no tiene (o el servicio falla).
export const ObtenerReceta = (numeroTicket, token) => obtenerRegistroPorTicket(recetasUrl, numeroTicket, token);

// Todas las recetas del ticket, de la más reciente a la más antigua ([] si no tiene). Si el historial no responde se
// cae a la receta actual, para no dejar la Historia sin receta.
export const ObtenerRecetas = async (numeroTicket, token) => {
    const res = await consultarInventario(`${recetasUrl}/ticket/${numeroTicket}/historial`, token, "No se pudo cargar el historial de recetas.");
    if (res.ok && Array.isArray(res.resultado)) return res.resultado;

    const actual = await ObtenerReceta(numeroTicket, token);
    return actual ? [actual] : [];
};

// Estado de una receta: "pendiente", "entregada" o "anulada".
export const estadoDeReceta = (receta) => (receta.anulada ? "anulada" : receta.entregado ? "entregada" : "pendiente");

// La receta con la que trabaja el formulario: la pendiente o, si no hay, la última entregada. Las anuladas no cuentan.
export const recetaActualDe = (historial = []) =>
    historial.find((receta) => estadoDeReceta(receta) === "pendiente") ?? historial.find((receta) => estadoDeReceta(receta) === "entregada") ?? null;

// N° de orden de una receta dentro del ticket (1 = la más antigua): el historial viene de la más reciente a la más antigua.
export const numeroDeReceta = (historial, receta) => historial.length - historial.findIndex((r) => r.id === receta.id);

// RecetaAsistencialDTO -> campos del formulario. Una receta ANULADA ya no reserva nada: se avisa en pantalla pero se
// parte de una lista vacía (se puede armar otra). Una PENDIENTE o ENTREGADA queda de solo lectura (ver recetaBloqueada).
export const formFromReceta = (receta) => {
    if (!receta) return { ...RECETA_ESTADO_INICIAL };

    const estado = estadoDeReceta(receta);
    return {
        ...RECETA_ESTADO_INICIAL,
        recetaId: receta.id ?? null,
        recetaEstado: estado,
        recetaItems:
            estado === "anulada"
                ? []
                : (receta.detalles ?? []).map((detalle) => ({
                    uid: ++contadorItems,
                    medicamentoId: String(detalle.medicamentoId),
                    medicamento: etiquetaMedicamento({ nombre: detalle.medicamentoNombre, presentacion: detalle.presentacion }),
                    cantidad: detalle.cantidad,
                    indicacion: detalle.indicacion ?? "",
                    cantidadFaltante: detalle.cantidadFaltante ?? 0,
                    registrado: true,
                    // Con la receta entregada completa todo salió; si no, cada detalle dice si ya se entregó (entrega parcial).
                    entregado: estado === "entregada" || Boolean(detalle.entregado),
                    fechaEntrega: detalle.fechaEntrega ?? "",
                })),
        recetaUsuario: receta.usuarioRegistro ?? "",
        recetaFechaRegistro: receta.fechaRegistro ?? "",
        recetaInventario: receta.inventarioNombre ?? "",
        recetaConFaltante: Boolean(receta.conFaltante),
        recetaMotivoAnulacion: receta.motivoAnulacion ?? "",
    };
};

// Recetas del ticket (ver ObtenerRecetas) -> campos del formulario: la receta actual más el historial completo.
export const formFromRecetas = (historial) => {
    const lista = Array.isArray(historial) ? historial : [];
    return { ...formFromReceta(recetaActualDe(lista)), recetaHistorial: lista };
};

// ===== Nueva receta =====
// ¿Se puede abrir otra receta? Solo cuando la actual ya fue entregada: mientras haya una pendiente solo puede haber esa.
export const puedeAbrirNuevaReceta = (form) => form.recetaEstado === "entregada" && !form.recetaNueva;

// Campos para empezar una receta nueva: lista y línea en blanco; el historial se conserva para seguir viendo lo entregado.
export const formNuevaReceta = (form) => ({ ...RECETA_ESTADO_INICIAL, recetaHistorial: form.recetaHistorial ?? [], recetaNueva: true });

// Descarta lo armado (una receta nueva, una edición o lo escrito sin guardar) y vuelve a lo que tiene el ticket.
export const formSinCambiosReceta = (form) => formFromRecetas(form.recetaHistorial);

// ===== Editar la receta pendiente =====
// El backend deja corregir la pendiente (POST de nuevo: la edita, no crea otra) mientras ninguna de sus líneas se haya
// entregado (entrega parcial). Se pide con un botón explícito para no reenviarla ni re-reservar stock en cada Guardar.
export const puedeEditarPendiente = (receta) =>
    estadoDeReceta(receta) === "pendiente" && !receta.entregaParcial && !(receta.detalles ?? []).some((detalle) => detalle.entregado);

// Campos para empezar a editar la pendiente: sus medicamentos pasan a la lista editable y el inventario queda en el que
// la reservó. No lleva `recetaNueva`: al editar una pendiente no se envía nuevaReceta.
export const formEditarPendiente = (form) => ({
    recetaEditando: true,
    recetaItems: (form.recetaItems ?? []).map((item) => ({ ...item, registrado: false })),
    recetaInventarioId: String(recetaActualDe(form.recetaHistorial)?.inventarioId ?? form.recetaInventarioId ?? ""),
});

// ===== Armado de la lista =====
// Una receta ya registrada no se vuelve a editar por sí sola: la pendiente tiene el stock reservado y la entregada ya
// lo descontó. Solo la anulada (ya no reserva nada) deja armar una nueva, y la pendiente se abre con «Editar receta»
// (`recetaEditando`).
export const recetaBloqueada = (form) => (form.recetaEstado === "pendiente" && !form.recetaEditando) || form.recetaEstado === "entregada";

// ¿Queda algo escrito en la línea que todavía no se agregó a la receta?
export const hayLineaSinAgregar = (form) =>
    Boolean(form.recetaMedicamentoId || limpiarTexto(form.recetaMedicamentoTexto) || String(form.recetaCantidad ?? "").trim() || limpiarTexto(form.recetaIndicacion));

// { campo: mensaje } solo con lo que falta o es inválido para agregar la línea. Pedir más de lo disponible no se
// bloquea aquí (la pantalla lo avisa): el backend lo rechaza al guardar con "Stock insuficiente en <inventario>", y
// lo valida contra SU inventario, que puede no ser el que muestra el combo. El "con faltante" que entrega el backend
// aparece después, cuando un lote reservado vence.
export const validarLineaReceta = (form, medicamento, items) => {
    const errores = {};
    const cantidad = String(form.recetaCantidad ?? "").trim();

    if (!form.recetaMedicamentoId || !medicamento) {
        errores.medicamento = "Seleccione el medicamento de la lista";
    } else if (items.some((item) => String(item.medicamentoId) === String(form.recetaMedicamentoId))) {
        errores.medicamento = "Ese medicamento ya está en la receta. Quítelo y agréguelo con la cantidad total";
    }

    if (!cantidad) {
        errores.cantidad = "Ingrese la cantidad";
    } else if (!/^\d+$/.test(cantidad) || Number(cantidad) < 1) {
        errores.cantidad = "Ingrese un número entero (1 o más)";
    }

    return errores;
};

// Línea de la receta a partir del medicamento elegido. `uid` identifica la fila para poder quitarla.
export const crearItemReceta = (form, medicamento) => ({
    uid: ++contadorItems,
    medicamentoId: String(medicamento.id),
    medicamento: etiquetaMedicamento(medicamento),
    cantidad: Number(form.recetaCantidad),
    indicacion: limpiarTexto(form.recetaIndicacion).toUpperCase(),
    cantidadFaltante: 0,
    registrado: false,
    entregado: false,
    fechaEntrega: "",
});

// Estado de una línea de la receta para la tabla: "entregado", "pendiente" (ya registrada, falta que farmacia la
// entregue) o "porGuardar" (todavía no se guardó con la Historia Clínica).
export const estadoItemReceta = (item) => (item.entregado ? "entregado" : item.registrado ? "pendiente" : "porGuardar");

// ===== Guardado (lo dispara el Guardar de la Historia Clínica, ver controllerComplementos) =====
// ¿La receta trae medicamentos para guardar? Una ya registrada (pendiente o entregada) no se vuelve a enviar.
export const hayReceta = (form) => !recetaBloqueada(form) && (form.recetaItems ?? []).length > 0;

// Mensaje del primer problema de la receta (o null): un medicamento escrito pero sin agregar se avisaría solo al
// perderse, así que se pide agregarlo o borrarlo antes de guardar nada.
export const validarReceta = (form) => {
    if (recetaBloqueada(form)) return null;
    if (hayLineaSinAgregar(form)) return "Hay un medicamento de la receta sin agregar. Presione «Agregar» o borre lo escrito antes de guardar.";
    // Una pendiente sin medicamentos no se guardaría (no hay nada que enviar) y quedaría igual: se avisa en vez de ignorarlo.
    if (form.recetaEditando && !(form.recetaItems ?? []).length) {
        return "La receta pendiente quedaría sin medicamentos. Agregue al menos uno o cancele la edición (para anularla use Inventario > Entrega por Ticket).";
    }
    return null;
};

// Registra (crea o edita) la receta del ticket y reserva el stock: POST. true si quedó guardada; si no, muestra el
// motivo que da el backend (p. ej. medicamento inactivo) y devuelve false (la Historia Clínica no se guarda).
export const GuardarReceta = async (form, token, userlogued) => {
    // inventarioId figura de solo lectura en el DTO: se envía el elegido en el combo por si el backend lo toma; el
    // inventario que realmente registra se ve al volver a cargar la receta (campo Inventario).
    const inventarioId = Number(form.recetaInventarioId);
    const body = {
        numeroTicket: Number(form.n_hcl),
        ...(inventarioId ? { inventarioId } : {}),
        // Obligatorio cuando el ticket ya tuvo una receta entregada: sin esto el backend no abre otra.
        ...(form.recetaNueva ? { nuevaReceta: true } : {}),
        detalles: form.recetaItems.map((item) => ({
            medicamentoId: Number(item.medicamentoId),
            cantidad: item.cantidad,
            indicacion: item.indicacion,
        })),
    };
    const url = `${recetasUrl}?${new URLSearchParams({ usuario: userlogued ?? "" })}`;

    LoadingDefault("Registrando Receta");
    const res = await enviarInventario(url, body, token, "Ocurrió un error al registrar la receta.");
    Swal.close();

    if (!res.ok) {
        await Swal.fire("Error", `No se pudo registrar la receta, por eso no se guardó la Historia Clínica: ${res.mensaje}`, "error");
        return false;
    }
    return true;
};

// ===== Impresión =====
// Imprime las Recetas GUARDADAS de un ticket. Los datos del paciente, del ticket y de la Historia Clínica (edad, sexo,
// empresa, diagnóstico, médico asignado) los entrega cada Historia con `obtenerDatosHC(numeroTicket, token)`, que
// devuelve un objeto con los nombres de campo del formulario (n_hcl, numeroHistoriaClinica, nombres, dni, edad, sexo,
// diagnostico, nombre_medico, ticket*...) o null si el ticket no existe. A diferencia del Informe de Accidente no
// exige Historia Clínica guardada: la receta se imprime con lo que haya (el diagnóstico sale en blanco si no hay).
// Una receta anulada ya no reserva nada, así que no se imprime. Con más de una receta imprimible el ticket pregunta
// cuál (cada una sale en su propio formato, p. ej. la de Medicina y la de Odontología).

// Texto corto de los medicamentos de una receta para reconocerla en la lista (recortado si es largo).
const resumenMedicamentos = (receta) => {
    const texto = (receta.detalles ?? []).map((detalle) => detalle.medicamentoNombre).filter(Boolean).join(", ");
    return texto.length > 70 ? `${texto.slice(0, 67)}...` : texto;
};

// Formato de impresión de UNA receta ya cargada.
const imprimirReceta = async (receta, hc, token, datosFooter) => {
    LoadingDefault("Cargando Formato a Imprimir");

    try {
        const modulo = await jasperModules[rutaJasper]();
        if (typeof modulo.default !== "function") {
            console.error(`El módulo ${rutaJasper} no exporta una función por defecto`);
            await Swal.fire("Error", "No se pudo cargar el formato de impresión.", "error");
            return;
        }

        const [digitalizacion, cmp] = await Promise.all([
            obtenerDigitalizacionMedico(hc.nombre_medico, token),
            obtenerCmpMedico(hc.nombre_medico, token),
        ]);
        await modulo.default({
            numeroTicket: hc.n_hcl,
            // El N° de historia clínica también viene (solo lectura) en la receta: respaldo si la Historia no lo trae.
            numeroHistoriaClinica: hc.numeroHistoriaClinica || receta.numeroHistoriaClinica || "",
            sede: hc.ticketSede,
            fecha: hc.ticketFecha || hc.fecha_apertura_hcl,
            fechaEmision: receta.fechaRegistro,
            // "nombres" ya viene como "Nombres Apellidos".
            nombres: hc.nombres,
            apellidos: "",
            dni: hc.dni,
            edad: hc.edad,
            sexo: hc.sexo,
            empresa: hc.ticketEmpresa || hc.empresa,
            diagnostico: hc.diagnostico,
            medico: hc.nombre_medico,
            cmp,
            medicamentos: (receta.detalles ?? []).map((detalle) => ({
                nombre: detalle.medicamentoNombre,
                presentacion: detalle.presentacion,
                cantidad: detalle.cantidad,
                indicacion: detalle.indicacion,
            })),
            digitalizacion,
            ...datosFooter,
        });
        Swal.close();
    } catch (e) {
        console.error("Error al generar el reporte:", e);
        await Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};

export const ImprimirRecetaPorTicket = async (numeroTicket, token, datosFooter, obtenerDatosHC) => {
    LoadingDefault("Cargando Formato a Imprimir");

    try {
        const [hc, historial] = await Promise.all([obtenerDatosHC(numeroTicket, token), ObtenerRecetas(numeroTicket, token)]);
        Swal.close();

        if (!hc) {
            await Swal.fire("No encontrado", `No existe un ticket registrado con el N° ${numeroTicket}.`, "error");
            return;
        }
        if (!historial.length) {
            await Swal.fire("Sin receta", `El ticket N° ${numeroTicket} todavía no tiene una receta registrada.`, "warning");
            return;
        }

        const vigentes = historial.filter((receta) => !receta.anulada);
        if (!vigentes.length) {
            const motivo = historial[0].motivoAnulacion ? ` (motivo: ${historial[0].motivoAnulacion})` : "";
            const texto = historial.length > 1 ? "Todas las recetas" : "La receta";
            await Swal.fire("Receta anulada", `${texto} del ticket N° ${numeroTicket} fue anulada${motivo}: no se puede imprimir.`, "warning");
            return;
        }

        const conMedicamentos = vigentes.filter((receta) => (receta.detalles ?? []).length > 0);
        if (!conMedicamentos.length) {
            await Swal.fire("Receta vacía", `La receta del ticket N° ${numeroTicket} no tiene medicamentos.`, "warning");
            return;
        }

        // Una sola receta: se imprime directo, como siempre.
        if (conMedicamentos.length === 1) {
            await imprimirReceta(conMedicamentos[0], hc, token, datosFooter);
            return;
        }

        const opciones = conMedicamentos.map((receta) => {
            const estado = estadoDeReceta(receta) === "entregada" ? "Entregada" : "Pendiente";
            const fecha = receta.fechaRegistro ? ` · ${formatearFechaHora(receta.fechaRegistro)}` : "";
            return {
                etiqueta: `Receta ${numeroDeReceta(historial, receta)}${fecha} · ${estado}<br><small>${escaparHtml(resumenMedicamentos(receta))}</small>`,
                accion: () => imprimirReceta(receta, hc, token, datosFooter),
            };
        });
        await MostrarOpcionesImpresion(`<b>Ticket N° ${numeroTicket}</b><br>Tiene ${conMedicamentos.length} recetas.`, opciones, {
            titulo: "Recetas del ticket",
            icono: "question",
        });
    } catch (e) {
        console.error("Error al generar el reporte:", e);
        await Swal.fire("Error", "Ocurrió un error al generar el reporte.", "error");
    }
};
