// Service para manejar las APIs de permisos y sistema ocupacional
import { URLAzure } from '../views/config/config';
import { useAuthStore } from '../store/auth';

class PermisosService {
  constructor() {
    this.baseURL = URLAzure;
  }

  // Método para obtener el token de autenticación
  getAuthToken() {
    const token = useAuthStore.getState().token;
    return token;
  }

  // Método genérico para hacer peticiones HTTP
  async makeRequest(endpoint, options = {}) {
    const token = this.getAuthToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...defaultOptions,
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la petición:', error);
      throw error;
    }
  }

  // Obtener todos los permisos del sistema
  async obtenerTodosLosPermisos() {
    return await this.makeRequest('/api/v01/ct/permisosSistema/listadoTodosLosPermisos');
  }

  // Obtener permisos por ID
  async obtenerPermisoPorId(id) {
    return await this.makeRequest(`/api/v01/ct/permisosSistema/obtenerPermisoPorId/${id}`);
  }

  // Crear nuevo permiso
  async crearPermiso(permisoData) {
    return await this.makeRequest('/api/v01/ct/permisosSistema/crearPermiso', {
      method: 'POST',
      body: JSON.stringify(permisoData)
    });
  }

  // Actualizar permiso
  async actualizarPermiso(id, permisoData) {
    return await this.makeRequest(`/api/v01/ct/permisosSistema/actualizarPermiso/${id}`, {
      method: 'PUT',
      body: JSON.stringify(permisoData)
    });
  }

  // Eliminar permiso
  async eliminarPermiso(id) {
    return await this.makeRequest(`/api/v01/ct/permisosSistema/eliminarPermiso/${id}`, {
      method: 'DELETE'
    });
  }

  // Obtener roles del sistema
  async obtenerRoles() {
    return await this.makeRequest('/api/v01/ct/roles/listadoRoles');
  }

  // Obtener usuarios
  async obtenerUsuarios() {
    return await this.makeRequest('/api/v01/ct/usuarios/listadoUsuarios');
  }

  // Obtener módulos del sistema
  async obtenerModulos() {
    return await this.makeRequest('/api/v01/ct/modulos/listadoModulos');
  }

  // Obtener permisos por rol
  async obtenerPermisosPorRol(rolId) {
    return await this.makeRequest(`/api/v01/ct/permisosSistema/obtenerPermisosPorRol/${rolId}`);
  }

  // Asignar permisos a rol
  async asignarPermisosARol(rolId, permisosIds) {
    return await this.makeRequest(`/api/v01/ct/permisosSistema/asignarPermisosARol/${rolId}`, {
      method: 'POST',
      body: JSON.stringify({ permisosIds })
    });
  }

  // Obtener permisos por usuario
  async obtenerPermisosPorUsuario(usuarioId) {
    return await this.makeRequest(`/api/v01/ct/permisosSistema/obtenerPermisosPorUsuario/${usuarioId}`);
  }

  // Asignar permisos a usuario
  async asignarPermisosAUsuario(usuarioId, permisosIds) {
    return await this.makeRequest(`/api/v01/ct/permisosSistema/asignarPermisosAUsuario/${usuarioId}`, {
      method: 'POST',
      body: JSON.stringify({ permisosIds })
    });
  }
}

// Exportar una instancia del servicio
export default new PermisosService();
