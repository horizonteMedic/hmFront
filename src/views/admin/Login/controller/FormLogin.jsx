import React, { useState } from "react";
import SubmitLogin from "../model/SubmitLogin";
import EstadoSolicitud from "./EstadoLogin";
import { useAuthStore } from "../../../../store/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "../../../components/Loading";
import Errors from "../../../components/Errors";
import Swal from "sweetalert2";
import { getFetch } from "../../panel-de-control/getFetch/getFetch";

export function FormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState("");
  const [inhabilitado, setInhabilitado] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);
  const setlistView = useAuthStore((state) => state.setlistView);
  const setlistAccesos = useAuthStore((state) => state.setlistAccesos);
  const setdatosFooter = useAuthStore((state) => state.setdatosFooter);
  const [loading, setloadign] = useState(false);
  const [errormess, setErrormess] = useState("");

  // Estilos para el Toast
  const toastStyles = {
    container: {
      fontSize: "13px",
      lineHeight: "1.5",
    },
    title: {
      textAlign: "center", // Centrado
      fontWeight: "bold",
      marginBottom: "10px",
    },
    paragraph: {
      textAlign: "justify", // Justificado
      marginBottom: "10px",
    },
    textStart: {
      textAlign: "start", // Alineado a la izquierda
      marginBottom: "5px",
    },
  };

  const Toast = Swal.mixin({
    toast: false,
    position: "center",
    showConfirmButton: true,
    confirmButtonText: "De Acuerdo!",
    confirmButtonColor: "#233245",
    showCloseButton: true,
    width: "600px",
    timerProgressBar: true,
    backdrop: `rgba(0, 0, 0, 0.6)`, // Fondo opaco
    customClass: {
      popup: "swal2-toast-style", // Clase personalizada para el popup
    },
    didOpen: (popup) => {
      popup.onmouseenter = Swal.stopTimer;
      popup.onmouseleave = Swal.resumeTimer;
    },
  });

  function Loginvnigate(token) {
    if (token !== null) {
      navigate("/panel-de-control");
      Toast.fire({
        html: `
          <div style="font-size: ${toastStyles.container.fontSize}; line-height: ${toastStyles.container.lineHeight};">
            <div style="text-align: center; margin-bottom: 10px;">
              <img src="/img/logo-color.png" alt="Horizonte Medic" style="width: 150px; margin-bottom: 15px;" />
            </div>
            <p style="text-align: ${toastStyles.title.textAlign}; font-weight: ${toastStyles.title.fontWeight}; margin-bottom: ${toastStyles.title.marginBottom};">
              COMUNICADO MATRIZ / MALLA OCOPACIONAL
            </p>
            <p style="text-align: ${toastStyles.textStart.textAlign}; font-weight: bold; margin-bottom: ${toastStyles.textStart.marginBottom};">
              Estimados usuarios:
            </p>
            <p style="text-align: ${toastStyles.paragraph.textAlign}; margin-bottom: ${toastStyles.paragraph.marginBottom};">
              Se les comunica que, a partir del 23 de enero del 2025, la matriz/malla ocupacional
              está disponible para visualización y descarga en el apartado de matriz. También
              indicarles que el manual de usuario está disponible para su descarga.
            </p>
            <p style="text-align: ${toastStyles.textStart.textAlign}; margin-bottom: ${toastStyles.textStart.marginBottom};">
              Estamos trabajando para brindar un mejor servicio.
            </p>
            <p style="text-align: ${toastStyles.textStart.textAlign}; margin-top: 15px; margin-bottom: ${toastStyles.textStart.marginBottom};">
              Atentamente,
            </p>
            <p style="text-align: ${toastStyles.textStart.textAlign}; margin-bottom: ${toastStyles.textStart.marginBottom};">
              Área de Sistemas Horizonte Medic
            </p>

          </div>
        `,
      });
    }
  }
  
  

  const decodeToken = async (token) => {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const UserLogued = JSON.parse(decodedPayload);
    const TokenResponse = UserLogued["id_rolUser"];
    const IDROL = TokenResponse[0].idRol;
    const ListaVistaAccesos = await getFetch(`/api/v01/ct/permisosAsignadosPorRol/listadoVistasYOpcionesAsigPorRol/${IDROL}`,token)
    const ListVistasxROL = await getFetch(`/api/v01/ct/opcionesInterfaz/vistasPorIdRol/${IDROL}`,token)
    const ListSedesxUser = await getFetch(`/api/v01/ct/sistemaArchivos/sedePorUsuario/${UserLogued.sub}`,token)
    const todosLosPermisos = ListaVistaAccesos.map(item => ({
      nombre: item.nombre,
      listaPermisos: item.listaPermisos
    }));
    const todasLasVistas = ListVistasxROL.flatMap(item => item.nombre);
    const userConSedes = {
      ...UserLogued,
      sedes: ListSedesxUser  // o usa el nombre que desees
    };
    const datosFooter=await getFetch(`/api/v01/st/registros/obtenerInformacionSedes`,token)
    // console.log("datosFooter",datosFooter)
    setdatosFooter(datosFooter)
    setlistView(todasLasVistas);
    setlistAccesos(todosLosPermisos)
    setuserlogued(userConSedes);
    setToken(token);
    Loginvnigate(token);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setloadign(true);
    localStorage.clear(); //AGREGADO NUEVO PV 02/10/2025
    SubmitLogin(username, password)
      .then((data) => {
        if (data.id === 1) {
          decodeToken(data.mensaje);
        } else if (data.id === 0) {
          setErrormess(data.mensaje);
          setInhabilitado(true);
        } else {
          setErrormess(data);
          setInhabilitado(true);
        }
      })
      .finally(() => {
        setloadign(false);
      })
      .catch(() => {
        setEstado("Error en el Servidor, intente más tarde");
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3 mt-6">
          <label className="form-label">
          </label>
          <input
            required
            type="text"
            className="form-control"
            placeholder="Usuario"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === " ") {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="mb-2">
          <label className="form-label d-flex justify-content-between align-items-center">
          </label>
          <div className="input-group left-0 input-group-flat">
            <input
              required
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Constraseña"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="input-group-text">
              <button
                type="button"
                className="link-secondary"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </span>
          </div>
        </div>
        <div className="flex justify-center pt-6">
          <button
            className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
            style={{ backgroundColor: "#fc6b03", borderColor: "#fc6b03" }}
          >
            ingresar
          </button>
        </div>
        <span className="text-center block mt-8">
          <strong>
            <a href="./forgot-password" style={{ color: "#084788" }}>
              Olvidé mi contraseña
            </a>
          </strong>
        </span>
      </form>
      {estado && EstadoSolicitud(estado)}
      {inhabilitado && <Errors error={errormess} />}
      {loading && <Loading />}
    </>
  );
}

export default FormLogin;
