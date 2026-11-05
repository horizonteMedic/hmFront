import { OPCIONES_MENU } from "./estadosOdontograma";

const ALTO_ITEM = 46; // alto aproximado de cada opción del menú (px)
const ANCHO_MENU = 200;
const ANCHO_SUBMENU = 190;

// Posición del menú junto al diente donde se hizo click derecho: los dientes inferiores lo abren hacia arriba, los
// superiores hacia abajo si cabe, y nunca se sale de la ventana. `submenuIzquierda` = no hay lugar a la derecha para
// los submenús (Resina, Amalgama).
export const posicionMenu = (event, diente) => {
  const alto = OPCIONES_MENU.length * ALTO_ITEM;
  const esInferior = diente >= 17 && diente <= 32;

  let y = event.clientY - 4;
  if (esInferior || event.clientY + alto > window.innerHeight) y = event.clientY - alto - 10;
  y = Math.max(y, 10);

  const x = Math.max(Math.min(event.clientX - 2, window.innerWidth - ANCHO_MENU - 10), 10);

  return { mouseX: x, mouseY: y, diente, submenuIzquierda: x + ANCHO_MENU + ANCHO_SUBMENU > window.innerWidth };
};

const Opcion = ({ opcion, onElegir }) => (
  <div className="context-menu-item" onClick={() => onElegir(opcion.label)}>
    <span className={`${opcion.color} text-xl`}>{opcion.simbolo}</span>
    <span>{opcion.label}</span>
  </div>
);

// Menú del click derecho para cambiar el estado de un diente. Las opciones con `opciones` (Resina, Amalgama) abren
// un submenú al pasar el mouse. `menu` es lo que devuelve posicionMenu; `onElegir` recibe el nombre del estado.
export default function MenuContextualOdontograma({ menu, onElegir }) {
  if (!menu) return null;

  return (
    <div className="context-menu" style={{ top: menu.mouseY, left: menu.mouseX }}>
      {OPCIONES_MENU.map((opcion) =>
        opcion.opciones ? (
          <div key={opcion.label} className="context-menu-item context-menu-grupo">
            <span className={`${opcion.color} text-xl`}>{opcion.simbolo}</span>
            <span>{opcion.label}</span>
            <span className="ml-auto text-gray-400">{menu.submenuIzquierda ? "◂" : "▸"}</span>
            <div className={`context-submenu ${menu.submenuIzquierda ? "context-submenu-izquierda" : ""}`}>
              {opcion.opciones.map((sub) => (
                <Opcion key={sub.label} opcion={sub} onElegir={onElegir} />
              ))}
            </div>
          </div>
        ) : (
          <Opcion key={opcion.label} opcion={opcion} onElegir={onElegir} />
        )
      )}
    </div>
  );
}
