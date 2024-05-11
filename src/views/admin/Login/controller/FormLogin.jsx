import React, { useState } from "react";
import SubmitLogin from "../model/SubmitLogin";
import EstadoSolicitud from "./EstadoLogin";
import { useAuthStore } from "../../../../store/auth";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faL } from "@fortawesome/free-solid-svg-icons";
import { Loading } from "../../../components/Loading";

export function FormLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [estado, setEstado] = useState("");
  const [inhabilitado, setInhabilitado] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setuserlogued = useAuthStore((state) => state.setuserlogued);
  const setlistView = useAuthStore((state) => state.setlistView);
  const [loading, setloadign] = useState(false);

  function Loginvnigate(token) {
    if (token !== null) {
      navigate("/panel-de-control");
    }
  }

  const decodeToken = (token) => {
    const payloadBase64 = token.split('.')[1]; 
    const decodedPayload = atob(payloadBase64); 
    const UserLogued = JSON.parse(decodedPayload); 
    const listadoVistas = UserLogued['listado vistas'];
    setlistView(listadoVistas)
    setuserlogued(UserLogued)
    setToken(token)
    Loginvnigate(token);

  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    setloadign(true)
    SubmitLogin(username, password)
      .then((data) => {
        if (data.id === 1) {
          decodeToken(data.mensaje)
        } else {
          setInhabilitado(true)
        }
      })
      .finally(()=> {setloadign(false)})
      .catch((data) => {
        setEstado('Error en el Servidor, intente mas tarde');
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3 mt-6">
          <label className="form-label"><strong>Usuario</strong></label>
          <input
            required
            type="text"
            className="form-control"
            placeholder="Tu Usuario"
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
            <strong>Password</strong>
           
          </label>
          <div className="input-group left-0 input-group-flat">
            <input
              required
              type={showPassword ? "text" : "password"} 
              className="form-control"
              placeholder="Tu password"
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
        <div className="flex justify-center  pt-6">
            <button
              className=" text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit} style={{ backgroundColor: "#fc6b03", borderColor: "#fc6b03",  }}
            >
              ingresar
            </button>
          </div>
          <span className="text-center block mt-8">
            <strong><a href="./forgot-password" style={{ color: "#084788" }}>Olvidé mi contraseña</a></strong>
          </span>

      </form>
      {estado && EstadoSolicitud(estado)}
      {inhabilitado && <div className="text-red-800 bg-pink-100 text-lg p-2 mt-3 rounded-lg transition duration-100 ease-in-out flex justify-center items-center">
                <p>
                Usuario inhabilitado o sin rol, contactar con un administrador!!
                </p>
            </div>}
      {loading && <Loading/>}
    </>
  );
}

export default FormLogin;
