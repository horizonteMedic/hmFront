import { useState, useEffect } from 'react';
import PermisosController from './controller/PermisosController';
import { Loading } from '../../components/Loading';
import Errors from '../../components/Errors';

const Permisos = () => {
  // Estados principales
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interfaces, setInterfaces] = useState([]);
  const [permisosSistema, setPermisosSistema] = useState([]);
  const [posiblesPermisos, setPosiblesPermisos] = useState([]);

  // Estados para modales y formularios
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'interfaz', 'permiso', 'posible_permiso'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const estructuraCompleta = await PermisosController.obtenerEstructuraCompletaPermisos();
      
      setPermisos(estructuraCompleta.estructura);
      setInterfaces(estructuraCompleta.interfaces);
      setPermisosSistema(estructuraCompleta.permisos);
      setPosiblesPermisos(estructuraCompleta.posiblesPermisos);
      
    } catch (err) {
      setError('Error al cargar los datos de permisos: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para alternar el estado expandido de un nodo
  const toggleExpandir = (id) => {
    const actualizarNodo = (nodos) => {
      return nodos.map(nodo => {
        if (nodo.id === id) {
          return { ...nodo, expandido: !nodo.expandido };
        }
        if (nodo.hijos && nodo.hijos.length > 0) {
          return { ...nodo, hijos: actualizarNodo(nodo.hijos) };
        }
        return nodo;
      });
    };
    setPermisos(actualizarNodo(permisos));
  };

  // Funciones para manejar formularios y modales
  const abrirModal = (tipo, item = null, parentItem = null) => {
    setModalType(tipo);
    setEditingItem(item);
    
    // Si se está creando un nuevo elemento, inicializar con datos del padre si es necesario
    if (!item) {
      if (tipo === 'interfaz' && parentItem) {
        // Al crear interfaz hija, calcular el nivel correcto
        const nivelPadre = calcularNivelInterfaz(parentItem, permisos);
        const nuevoNivel = nivelPadre + 1;
        
        // Crear un objeto con el nombre y ID de la interfaz padre
        const interfazPadre = {
          id: parentItem.datos.id,
          nombre: parentItem.datos.nombre || parentItem.datos.name || 'Interfaz Padre',
          display: `${parentItem.datos.nombre || parentItem.datos.name || 'Interfaz Padre'} - (${parentItem.datos.id})`
        };
        
        setFormData({ 
          idPadre: interfazPadre,
          nivel: nuevoNivel
        });
      } else if (tipo === 'posible_permiso' && parentItem) {
        // Al crear posible permiso, establecer el permiso asociado y la interfaz
        const interfazAsociada = parentItem.datos.interfazAsociada || 'Interfaz Asociada';
        setFormData({ 
          namePermiso: parentItem.datos.namePermiso,
          interfazAsociada: interfazAsociada
        });
      } else {
        setFormData({});
      }
    } else {
      setFormData({ ...item.datos });
    }
    
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const manejarCambioFormulario = (campo, valor) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const guardarItem = async () => {
    try {
      setLoading(true);
      
      if (modalType === 'interfaz') {
        if (editingItem) {
          // Extraer el ID real para actualización
          let idReal = editingItem.id;
          if (editingItem.id.startsWith('interfaz_')) {
            idReal = editingItem.id.replace('interfaz_', '');
          }
          await PermisosController.actualizarInterfaz(idReal, formData);
        } else {
          // Al crear interfaz, extraer el ID real del objeto idPadre
          const datosInterfaz = {
            ...formData,
            idPadre: formData.idPadre?.id || formData.idPadre, // Extraer el ID real
            estado: formData.estado !== undefined ? formData.estado : true
          };
          await PermisosController.crearNuevaInterfaz(datosInterfaz);
        }
      } else if (modalType === 'permiso') {
        if (editingItem) {
          // Extraer el ID real para actualización
          let idReal = editingItem.id;
          if (editingItem.id.startsWith('permiso_')) {
            idReal = editingItem.id.replace('permiso_', '');
          }
          await PermisosController.actualizarPermiso(idReal, formData);
        } else {
          await PermisosController.registrarPermiso(formData);
        }
      } else if (modalType === 'posible_permiso') {
        if (editingItem) {
          // Extraer el ID real para actualización
          let idReal = editingItem.id;
          if (editingItem.id.startsWith('posible_permiso_')) {
            idReal = editingItem.id.replace('posible_permiso_', '');
          }
          await PermisosController.actualizarPosiblePermiso(idReal, formData);
        } else {
          // Al crear posible permiso, usar solo los campos necesarios
          const datosPosiblePermiso = {
            namePermiso: formData.namePermiso,
            idOpcionInterfaz: formData.idOpcionInterfaz
          };
          await PermisosController.registrarPosiblePermiso(datosPosiblePermiso);
        }
      }
      
      cerrarModal();
      await cargarDatos(); // Recargar datos
      
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarItem = async (tipo, id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este elemento?')) {
      return;
    }

    try {
      setLoading(true);
      
      // Extraer el ID real del ID visual
      let idReal = id;
      if (tipo === 'interfaz' && id.startsWith('interfaz_')) {
        idReal = id.replace('interfaz_', '');
      } else if (tipo === 'permiso' && id.startsWith('permiso_')) {
        idReal = id.replace('permiso_', '');
      } else if (tipo === 'posible_permiso' && id.startsWith('posible_permiso_')) {
        idReal = id.replace('posible_permiso_', '');
      }
      
      if (tipo === 'interfaz') {
        await PermisosController.eliminarInterfaz(idReal);
      } else if (tipo === 'permiso') {
        await PermisosController.eliminarPermiso(idReal);
      } else if (tipo === 'posible_permiso') {
        await PermisosController.eliminarPosiblePermiso(idReal);
      }
      
      await cargarDatos(); // Recargar datos
      
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el icono según el nivel
  const obtenerIcono = (nivel) => {
    switch (nivel) {
      case 'interfaz':
        return 'fas fa-folder-open text-primary';
      case 'permiso':
        return 'fas fa-folder text-warning';
      case 'posible_permiso':
        return 'fas fa-file text-success';
      default:
        return 'fas fa-file text-secondary';
    }
  };

  // Función para obtener el icono de expandir/colapsar
  const obtenerIconoExpandir = (expandido) => {
    return expandido ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
  };

  // Función para calcular el nivel real de una interfaz
  const calcularNivelInterfaz = (interfaz, todasLasInterfaces) => {
    let nivel = 1;
    let interfazActual = interfaz;
    
    // Subir por la jerarquía hasta encontrar la raíz
    while (interfazActual.datos && interfazActual.datos.idPadre) {
      const interfazPadre = todasLasInterfaces.find(i => 
        i.tipo === 'interfaz' && i.datos && i.datos.id === interfazActual.datos.idPadre
      );
      
      if (interfazPadre) {
        nivel++;
        interfazActual = interfazPadre;
      } else {
        break;
      }
    }
    
    return nivel;
  };

  // Función para renderizar un nodo del árbol
  const renderizarNodo = (nodo, nivel = 0) => {
    const tieneHijos = nodo.hijos && nodo.hijos.length > 0;
    const margenIzquierdo = nivel * 20;

    return (
      <div key={nodo.id} className="tree-node">
        <div 
          className="d-flex align-items-center py-2 px-3 border-bottom hover-bg-light"
          style={{ marginLeft: `${margenIzquierdo}px` }}
        >
          {tieneHijos && (
            <button
              className="btn btn-sm btn-link p-0 me-2"
              onClick={() => toggleExpandir(nodo.id)}
              style={{ width: '20px', height: '20px' }}
            >
              <i className={obtenerIconoExpandir(nodo.expandido)}></i>
            </button>
          )}
          {!tieneHijos && <div style={{ width: '20px' }}></div>}
          
          <i className={`${obtenerIcono(nodo.nivel)} me-2`}></i>
          
          <span className={`fw-bold text-${nodo.nivel === 'interfaz' ? 'primary' : nodo.nivel === 'permiso' ? 'warning' : 'success'}`}>
            {nodo.nombre}
          </span>
          
          <span className="badge bg-secondary ms-auto me-2">
            {nodo.nivel.toUpperCase()}
          </span>

          {/* Botones de acción */}
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => abrirModal(nodo.tipo, nodo)}
              title="Editar"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => {
                if (nodo.tipo === 'interfaz') {
                  // Calcular el nivel real de la interfaz
                  const nivelInterfaz = calcularNivelInterfaz(nodo, permisos);
                  
                  if (nivelInterfaz >= 3) {
                    // Es interfaz de nivel 3 o superior, crear permiso
                    abrirModal('permiso', null, nodo);
                  } else {
                    // Es interfaz de nivel 1 o 2, crear interfaz hija
                    abrirModal('interfaz', null, nodo);
                  }
                } else if (nodo.tipo === 'permiso') {
                  // Para permisos, crear posible permiso
                  abrirModal('posible_permiso', null, nodo);
                }
              }}
              title="Agregar hijo"
            >
              <i className="fas fa-plus"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => eliminarItem(nodo.tipo, nodo.id)}
              title="Eliminar"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        {tieneHijos && nodo.expandido && (
          <div className="tree-children">
            {nodo.hijos.map(hijo => renderizarNodo(hijo, nivel + 1))}
          </div>
        )}
      </div>
    );
  };

    if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Errors message={error} onRetry={cargarDatos} />;
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className="fas fa-user-md me-2"></i>
                Gestión de Permisos - Módulo Ocupacional
              </h3> 
            </div>
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-8">
                  <p className="text-muted">
                    Gestiona los permisos específicos del Módulo Ocupacional, incluyendo evaluaciones médicas, exámenes complementarios y gestión de pacientes.
                  </p>
                </div>
                <div className="col-md-4 text-end">
                  <button 
                    className="btn btn-outline-primary me-2"
                    onClick={() => abrirModal('interfaz')}
                  >
                    <i className="fas fa-plus me-1"></i>
                    Nueva Interfaz
                  </button>
                  <button 
                    className="btn btn-outline-info"
                    onClick={cargarDatos}
                  >
                    <i className="fas fa-sync me-1"></i>
                    Actualizar
                  </button>
                </div>
              </div>

              {/* Leyenda de niveles */}
              <div className="alert alert-light mb-4">
                <h6 className="alert-heading">
                  <i className="fas fa-info-circle me-2"></i>
                  Estructura de Permisos - Módulo Ocupacional
                </h6>
                <div className="row">
                  <div className="col-md-4">
                    <i className="fas fa-folder-open text-primary me-2"></i>
                    <strong>INTERFACES:</strong> Evaluaciones médicas, laboratorios, exámenes
                  </div>
                  <div className="col-md-4">
                    <i className="fas fa-folder text-warning me-2"></i>
                    <strong>PERMISOS:</strong> Accesos específicos (VDRL, Hemograma, etc.)
                  </div>
                  <div className="col-md-4">
                    <i className="fas fa-file text-success me-2"></i>
                    <strong>ASOCIACIONES:</strong> Vinculación de permisos con interfaces
                  </div>
                </div>
              </div>

              {/* Árbol de permisos */}
              <div className="card border">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="fas fa-tree me-2"></i>
                    Estructura de Permisos
                  </h5>
                </div>
                <div className="card-body p-0">
                  <div className="tree-container">
                    {permisos.map(permiso => renderizarNodo(permiso))}
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className="row mt-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-user-md fa-2x mb-2"></i>
                      <h4>{interfaces.length}</h4>
                      <small>Interfaces Médicas</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-stethoscope fa-2x mb-2"></i>
                      <h4>{permisosSistema.length}</h4>
                      <small>Permisos de Acceso</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-clipboard-check fa-2x mb-2"></i>
                      <h4>{posiblesPermisos.length}</h4>
                      <small>Asociaciones</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body text-center">
                      <i className="fas fa-hospital fa-2x mb-2"></i>
                      <h4>{interfaces.length + permisosSistema.length + posiblesPermisos.length}</h4>
                      <small>Total Ocupacional</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para crear/editar elementos */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingItem ? 'Editar' : 'Crear'} {modalType === 'interfaz' ? 'Interfaz' : modalType === 'permiso' ? 'Permiso' : 'Posible Permiso'}
                </h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <form>
                  {modalType === 'interfaz' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Nombre de la Interfaz</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.nombre || ''}
                          onChange={(e) => manejarCambioFormulario('nombre', e.target.value)}
                          placeholder="Ej: Evaluación Médica Ocupacional"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.descripcion || ''}
                          onChange={(e) => manejarCambioFormulario('descripcion', e.target.value)}
                          placeholder="Ej: Módulo para evaluaciones médicas ocupacionales"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Ruta Vista</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.rutaVista || ''}
                          onChange={(e) => manejarCambioFormulario('rutaVista', e.target.value)}
                          placeholder="/evaluacion-medica"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Nivel</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.nivel || 1}
                          onChange={(e) => manejarCambioFormulario('nivel', parseInt(e.target.value))}
                          min="1"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Interfaz Padre</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          value={formData.idPadre?.display || formData.idPadre || ''}
                          placeholder="Ej: Antecedentes de Altura - (552)"
                          readOnly
                        />
                        <div className="form-text">
                          Este campo se establece automáticamente basándose en la interfaz seleccionada
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.estado !== false}
                            onChange={(e) => manejarCambioFormulario('estado', e.target.checked)}
                          />
                          <label className="form-check-label">
                            Estado Activo
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {modalType === 'permiso' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Nombre del Permiso</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.namePermiso || formData.nombre || ''}
                          onChange={(e) => manejarCambioFormulario('namePermiso', e.target.value)}
                          placeholder="Ej: Acceso VDRL"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={formData.descripcion || ''}
                          onChange={(e) => manejarCambioFormulario('descripcion', e.target.value)}
                          placeholder="Ej: Laboratorio - Inmunologia"
                        />
                      </div>
                    </>
                  )}

                  {modalType === 'posible_permiso' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Permiso Asociado</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          value={formData.namePermiso || ''}
                          placeholder="Ej: Acceso VDRL"
                          readOnly
                        />
                        <div className="form-text">
                          Este campo se establece automáticamente basándose en el permiso seleccionado
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Interfaz Asociada</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          value={formData.interfazAsociada || ''}
                          placeholder="Ej: Análisis Bioquímico - (203)"
                          readOnly
                        />
                        <div className="form-text">
                          Esta interfaz se establece automáticamente basándose en la selección
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={guardarItem}>
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permisos;
