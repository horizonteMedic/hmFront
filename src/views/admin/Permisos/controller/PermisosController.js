import { SubmitData, getFetch, updateData, deleteData } from '../../../utils/apiHelpers';
import { useAuthStore } from '../../../../store/auth';

class PermisosController {
  constructor() {
    this.baseURL = '/api/v01';
  }

  // Método para obtener el token de autenticación
  getAuthToken() {
    return useAuthStore.getState().token;
  }

  // Nivel 0 - Autenticación (ya manejado por el sistema de auth)
  // Nivel 1 - Interfaces
  async obtenerTodasLasInterfaces() {
    try {
      const token = this.getAuthToken();
      const response = await getFetch(`${this.baseURL}/ct/opcionesInterfaz`, token);
      return response;
    } catch (error) {
      console.error('Error al obtener interfaces:', error);
      throw error;
    }
  }

  async crearNuevaInterfaz(interfazData) {
    try {
      const token = this.getAuthToken();
      // Formatear datos según la API
      const dataFormateada = {
        nombre: interfazData.nombre,
        rutaVista: interfazData.rutaVista || null,
        descripcion: interfazData.descripcion,
        estado: interfazData.estado !== undefined ? interfazData.estado : true,
        nivel: interfazData.nivel || 1,
        idPadre: interfazData.idPadre || null,
        fechaRegistro: new Date().toISOString().split('T')[0],
        userRegistro: "developer", // TODO: obtener del usuario actual
        fechaActualizacion: new Date().toISOString().split('T')[0],
        userActualizacion: "developer" // TODO: obtener del usuario actual
      };
      const response = await SubmitData(dataFormateada, `${this.baseURL}/ct/opcionesInterfaz`, token);
      return response;
    } catch (error) {
      console.error('Error al crear interfaz:', error);
      throw error;
    }
  }

  // Nivel 2 - Permisos
  async obtenerTodosLosPermisos() {
    try {
      const token = this.getAuthToken();
      const response = await getFetch(`${this.baseURL}/ct/permisosSistema/listadoTodosLosPermisos`, token);
      return response;
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      throw error;
    }
  }

  async registrarPermiso(permisoData) {
    try {
      const token = this.getAuthToken();
      // Formatear datos según la API
      const dataFormateada = {
        namePermiso: permisoData.namePermiso || permisoData.nombre,
        descripcion: permisoData.descripcion
      };
      const response = await SubmitData(dataFormateada, `${this.baseURL}/ct/permisosSistema`, token);
      return response;
    } catch (error) {
      console.error('Error al registrar permiso:', error);
      throw error;
    }
  }

  // Nivel 3 - Posibles Permisos
  async obtenerPosiblesPermisos() {
    try {
      const token = this.getAuthToken();
      const response = await getFetch(`${this.baseURL}/ct/posiblesPermisosSistema/listadoPosiblesPermisosAisgnadosEnTotal`, token);
      return response;
    } catch (error) {
      console.error('Error al obtener posibles permisos:', error);
      throw error;
    }
  }

  async registrarPosiblePermiso(posiblePermisoData) {
    try {
      const token = this.getAuthToken();
      // Formatear datos según la API
      const dataFormateada = {
        idOpcionInterfaz: posiblePermisoData.idOpcionInterfaz,
        namePermiso: posiblePermisoData.namePermiso || posiblePermisoData.nombre
      };
      const response = await SubmitData(dataFormateada, `${this.baseURL}/ct/posiblesPermisosSistema`, token);
      return response;
    } catch (error) {
      console.error('Error al registrar posible permiso:', error);
      throw error;
    }
  }

  // Métodos auxiliares para estructurar los datos del módulo ocupacional
  async obtenerEstructuraCompletaPermisos() {
    try {
      const [interfaces, permisos, posiblesPermisos] = await Promise.all([
        this.obtenerTodasLasInterfaces(),
        this.obtenerTodosLosPermisos(),
        this.obtenerPosiblesPermisos()
      ]);

      // Filtrar solo datos relacionados con el módulo ocupacional
      const interfacesOcupacionales = this.filtrarModuloOcupacional(interfaces);
      const permisosOcupacionales = this.filtrarPermisosOcupacionales(permisos);
      const posiblesPermisosOcupacionales = this.filtrarPosiblesPermisosOcupacionales(posiblesPermisos, interfacesOcupacionales);

      return {
        interfaces: interfacesOcupacionales,
        permisos: permisosOcupacionales,
        posiblesPermisos: posiblesPermisosOcupacionales,
        estructura: this.construirEstructuraJerarquica(interfacesOcupacionales, permisosOcupacionales, posiblesPermisosOcupacionales)
      };
    } catch (error) {
      console.error('Error al obtener estructura completa del módulo ocupacional:', error);
      throw error;
    }
  }

  // Filtrar interfaces del módulo ocupacional
  filtrarModuloOcupacional(interfaces) {
    return interfaces.filter(interfaz => {
      const nombre = (interfaz.nombre || '').toLowerCase();
      const descripcion = (interfaz.descripcion || '').toLowerCase();
      const rutaVista = (interfaz.rutaVista || '').toLowerCase();
      
      // Palabras clave para el módulo ocupacional
      const palabrasClave = [
        'ocupacional', 'medico', 'evaluacion', 'examen', 'exámen',
        'audiometria', 'audiometría', 'oftalmologia', 'oftalmología',
        'musculoesqueletica', 'musculoesquelética', 'odontologia', 'odontología',
        'laboratorio', 'radiologia', 'radiología', 'psicologia', 'psicología',
        'hemograma', 'bioquimico', 'bioquímico', 'inmunologia', 'inmunología',
        'toxicologia', 'toxicología', 'vdrl', 'parasitologia', 'parasitología',
        'hematologia', 'hematología', 'espirometria', 'espirometría',
        'electrocardiograma', 'ecg', 'ekg', 'rayos', 'rx', 'ultrasonido',
        'ecografia', 'ecografía', 'consentimiento', 'historia', 'clinica',
        'clínica', 'triaje', 'admission', 'admisión', 'hc', 'hcl',
        'manipulador', 'alimentos', 'altura', 'test', 'fatiga', 'nordico',
        'nórdico', 'oit', 'sucamec', 'covid', 'panel', 'anexo', 'formato',
        'reporte', 'certificado', 'informe', 'documento', 'ficha'
      ];
      
      // Verificar si alguna palabra clave está presente
      return palabrasClave.some(palabra => 
        nombre.includes(palabra) || 
        descripcion.includes(palabra) ||
        rutaVista.includes(palabra)
      );
    });
  }

  // Filtrar permisos del módulo ocupacional
  filtrarPermisosOcupacionales(permisos) {
    return permisos.filter(permiso => {
      const nombre = (permiso.namePermiso || permiso.descripcion || '').toLowerCase();
      
      // Palabras clave para permisos del módulo ocupacional
      const palabrasClave = [
        'ocupacional', 'medico', 'evaluacion', 'examen', 'exámen',
        'audiometria', 'audiometría', 'oftalmologia', 'oftalmología',
        'musculoesqueletica', 'musculoesquelética', 'odontologia', 'odontología',
        'laboratorio', 'radiologia', 'radiología', 'psicologia', 'psicología',
        'hemograma', 'bioquimico', 'bioquímico', 'inmunologia', 'inmunología',
        'toxicologia', 'toxicología', 'vdrl', 'parasitologia', 'parasitología',
        'hematologia', 'hematología', 'espirometria', 'espirometría',
        'electrocardiograma', 'ecg', 'ekg', 'rayos', 'rx', 'ultrasonido',
        'ecografia', 'ecografía', 'consentimiento', 'historia', 'clinica',
        'clínica', 'triaje', 'admission', 'admisión', 'hc', 'hcl',
        'manipulador', 'alimentos', 'altura', 'test', 'fatiga', 'nordico',
        'nórdico', 'oit', 'sucamec', 'covid', 'panel', 'anexo', 'formato',
        'reporte', 'certificado', 'informe', 'documento', 'ficha',
        'acceso', 'crear', 'editar', 'eliminar', 'ver', 'imprimir', 'exportar'
      ];
      
      return palabrasClave.some(palabra => nombre.includes(palabra));
    });
  }

  // Filtrar posibles permisos del módulo ocupacional
  filtrarPosiblesPermisosOcupacionales(posiblesPermisos, interfacesOcupacionales) {
    const idsInterfacesOcupacionales = interfacesOcupacionales.map(i => i.id);
    
    return posiblesPermisos.filter(posiblePermiso => {
      // Filtrar por interfaz asociada
      if (idsInterfacesOcupacionales.includes(posiblePermiso.idOpcionInterfaz)) {
        return true;
      }
      
      // También filtrar por nombre del permiso
      const nombre = (posiblePermiso.namePermiso || '').toLowerCase();
      
      const palabrasClave = [
        'ocupacional', 'medico', 'evaluacion', 'examen', 'exámen',
        'audiometria', 'audiometría', 'oftalmologia', 'oftalmología',
        'musculoesqueletica', 'musculoesquelética', 'odontologia', 'odontología',
        'laboratorio', 'radiologia', 'radiología', 'psicologia', 'psicología',
        'hemograma', 'bioquimico', 'bioquímico', 'inmunologia', 'inmunología',
        'toxicologia', 'toxicología', 'vdrl', 'parasitologia', 'parasitología',
        'hematologia', 'hematología', 'espirometria', 'espirometría',
        'electrocardiograma', 'ecg', 'ekg', 'rayos', 'rx', 'ultrasonido',
        'ecografia', 'ecografía', 'consentimiento', 'historia', 'clinica',
        'clínica', 'triaje', 'admission', 'admisión', 'hc', 'hcl',
        'manipulador', 'alimentos', 'altura', 'test', 'fatiga', 'nordico',
        'nórdico', 'oit', 'sucamec', 'covid', 'panel', 'anexo', 'formato',
        'reporte', 'certificado', 'informe', 'documento', 'ficha',
        'acceso', 'crear', 'editar', 'eliminar', 'ver', 'imprimir', 'exportar'
      ];
      
      return palabrasClave.some(palabra => nombre.includes(palabra));
    });
  }

  construirEstructuraJerarquica(interfaces, permisos, posiblesPermisos) {
    // Construir estructura jerárquica de 3 niveles: Interfaz -> Permisos -> Posibles Permisos
    const estructura = [];

    // 1. Construir árbol de interfaces con su jerarquía propia (idPadre)
    const interfacesMap = new Map();
    const interfacesRaiz = [];

    // Primero, crear todos los nodos de interfaces
    interfaces.forEach((interfaz, index) => {
      // Generar ID único si no existe
      const interfazId = interfaz.id || `temp_interfaz_${index}`;
      
      const interfazNode = {
        id: `interfaz_${interfazId}`,
        nombre: interfaz.nombre || `Interfaz ${index + 1}`,
        nivel: 'interfaz',
        tipo: 'interfaz',
        expandido: true,
        datos: interfaz,
        hijos: []
      };
      interfacesMap.set(interfaz.id || interfazId, interfazNode);
    });

    // Luego, construir la jerarquía basada en idPadre
    interfaces.forEach(interfaz => {
      const interfazId = interfaz.id || `temp_interfaz_${interfaces.indexOf(interfaz)}`;
      const nodo = interfacesMap.get(interfaz.id || interfazId);
      
      if (nodo) {
        if (interfaz.idPadre && interfacesMap.has(interfaz.idPadre)) {
          // Es un hijo, agregarlo al padre
          interfacesMap.get(interfaz.idPadre).hijos.push(nodo);
        } else {
          // Es una raíz
          interfacesRaiz.push(nodo);
        }
      }
    });

    // 2. Para cada interfaz (raíz y sus hijos), agregar sus permisos asociados
    const todasLasInterfaces = [...interfacesRaiz];
    interfacesRaiz.forEach(interfaz => {
      this.agregarInterfazYHijos(todasLasInterfaces, interfaz);
    });

    todasLasInterfaces.forEach(interfaz => {
      // Solo las interfaces de nivel 3 (las más específicas) deben tener permisos
      // Las interfaces de nivel 1 y 2 solo son contenedores
      if (this.esInterfazNivel3(interfaz, todasLasInterfaces)) {
        // Buscar posibles permisos asociados específicamente a esta interfaz
        const posiblesPermisosInterfaz = posiblesPermisos.filter(pp => 
          pp.idOpcionInterfaz === interfaz.datos.id
        );

        if (posiblesPermisosInterfaz.length > 0) {
          // Agrupar posibles permisos por nombre de permiso
          const permisosAgrupados = this.agruparPosiblesPermisosPorPermiso(posiblesPermisosInterfaz);

          // Crear nodos de permisos para esta interfaz
          Object.keys(permisosAgrupados).forEach(nombrePermiso => {
            const permisoNode = {
              id: `permiso_${interfaz.datos.id}_${nombrePermiso.replace(/\s+/g, '_')}`,
              nombre: nombrePermiso,
              nivel: 'permiso',
              tipo: 'permiso',
              expandido: false,
              datos: { namePermiso: nombrePermiso },
              hijos: []
            };

            // Agregar posibles permisos como hijos del permiso
            permisosAgrupados[nombrePermiso].forEach((posiblePermiso, ppIndex) => {
              const posiblePermisoId = posiblePermiso.id || `temp_posible_permiso_${ppIndex}`;
              
              // Buscar el nombre de la interfaz asociada
              const nombreInterfaz = this.obtenerNombreInterfaz(posiblePermiso.idOpcionInterfaz, interfaces);
              
              const posiblePermisoNode = {
                id: `posible_permiso_${posiblePermisoId}`,
                nombre: `Asociado a Interfaz (${nombreInterfaz} - ${posiblePermiso.idOpcionInterfaz})`,
                nivel: 'posible_permiso',
                tipo: 'posible_permiso',
                expandido: false,
                datos: posiblePermiso,
                hijos: []
              };
              permisoNode.hijos.push(posiblePermisoNode);
            });

            interfaz.hijos.push(permisoNode);
          });
        }
      }
    });

    // 3. Agregar interfaces con su estructura jerárquica completa
    estructura.push(...interfacesRaiz);

    return estructura;
  }

  // Método auxiliar para agregar interfaz y todos sus hijos a la lista
  agregarInterfazYHijos(todasLasInterfaces, interfaz) {
    if (!todasLasInterfaces.includes(interfaz)) {
      todasLasInterfaces.push(interfaz);
    }
    
    if (interfaz.hijos && interfaz.hijos.length > 0) {
      interfaz.hijos.forEach(hijo => {
        if (hijo.tipo === 'interfaz') {
          this.agregarInterfazYHijos(todasLasInterfaces, hijo);
        }
      });
    }
  }

  // Método auxiliar para obtener IDs de interfaz y todos sus hijos
  obtenerIdsInterfazYHijos(interfaz) {
    const ids = [interfaz.datos.id];
    
    const obtenerIdsHijos = (nodo) => {
      if (nodo.hijos && nodo.hijos.length > 0) {
        nodo.hijos.forEach(hijo => {
          if (hijo.datos && hijo.datos.id) {
            ids.push(hijo.datos.id);
          }
          obtenerIdsHijos(hijo);
        });
      }
    };
    
    obtenerIdsHijos(interfaz);
    return ids;
  }

  // Método auxiliar para determinar si una interfaz es de nivel 3 (la más específica)
  esInterfazNivel3(interfaz, todasLasInterfaces) {
    // Calcular el nivel real de la interfaz
    const nivel = this.calcularNivelInterfaz(interfaz, todasLasInterfaces);
    return nivel >= 3;
  }

  // Método auxiliar para calcular el nivel real de una interfaz
  calcularNivelInterfaz(interfaz, todasLasInterfaces) {
    let nivel = 1;
    let interfazActual = interfaz;
    
    // Subir por la jerarquía hasta encontrar la raíz
    while (interfazActual.datos && interfazActual.datos.idPadre) {
      const interfazPadre = todasLasInterfaces.find(i => 
        i.datos && i.datos.id === interfazActual.datos.idPadre
      );
      
      if (interfazPadre) {
        nivel++;
        interfazActual = interfazPadre;
      } else {
        break;
      }
    }
    
    return nivel;
  }

  // Método auxiliar para obtener el nombre de una interfaz por su ID
  obtenerNombreInterfaz(idInterfaz, interfaces) {
    const interfaz = interfaces.find(i => i.id === idInterfaz);
    return interfaz ? (interfaz.nombre || 'Interfaz sin nombre') : 'Interfaz no encontrada';
  }

  // Método auxiliar para agrupar posibles permisos por nombre de permiso
  agruparPosiblesPermisosPorPermiso(posiblesPermisos) {
    const agrupados = {};
    
    posiblesPermisos.forEach(pp => {
      const nombrePermiso = pp.namePermiso || 'Permiso sin nombre';
      if (!agrupados[nombrePermiso]) {
        agrupados[nombrePermiso] = [];
      }
      agrupados[nombrePermiso].push(pp);
    });
    
    return agrupados;
  }

  // Métodos para operaciones CRUD específicas
  async actualizarInterfaz(id, datos) {
    try {
      const token = this.getAuthToken();
      const response = await updateData(datos, `${this.baseURL}/ct/opcionesInterfaz/${id}`, token);
      return response;
    } catch (error) {
      console.error('Error al actualizar interfaz:', error);
      throw error;
    }
  }

  async eliminarInterfaz(id) {
    try {
      const token = this.getAuthToken();
      const response = await deleteData(`${this.baseURL}/ct/opcionesInterfaz/${id}`, token);
      return response;
    } catch (error) {
      console.error('Error al eliminar interfaz:', error);
      throw error;
    }
  }

  async actualizarPermiso(id, datos) {
    try {
      const token = this.getAuthToken();
      const response = await updateData(datos, `${this.baseURL}/ct/permisosSistema/${id}`, token);
      return response;
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      throw error;
    }
  }

  async eliminarPermiso(id) {
    try {
      const token = this.getAuthToken();
      const response = await deleteData(`${this.baseURL}/ct/permisosSistema/${id}`, token);
      return response;
    } catch (error) {
      console.error('Error al eliminar permiso:', error);
      throw error;
    }
  }

  async actualizarPosiblePermiso(id, datos) {
    try {
      const token = this.getAuthToken();
      const response = await updateData(datos, `${this.baseURL}/ct/posiblesPermisosSistema/${id}`, token);
      return response;
    } catch (error) {
      console.error('Error al actualizar posible permiso:', error);
      throw error;
    }
  }

  async eliminarPosiblePermiso(id) {
    try {
      const token = this.getAuthToken();
      const response = await deleteData(`${this.baseURL}/ct/posiblesPermisosSistema/${id}`, token);
      return response;
    } catch (error) {
      console.error('Error al eliminar posible permiso:', error);
      throw error;
    }
  }
}

export default new PermisosController();
