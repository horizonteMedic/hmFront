import { useState, useEffect } from 'react';
import permisosService from '../services/permisosService';

export const usePermisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar todos los permisos
  const cargarPermisos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permisosService.obtenerTodosLosPermisos();
      
      // Transformar los datos de la API al formato del árbol
      const permisosTransformados = transformarPermisosParaArbol(response.data || response);
      setPermisos(permisosTransformados);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar permisos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Función para transformar los datos de la API al formato del árbol
  const transformarPermisosParaArbol = (permisosAPI) => {
    // Si no hay datos de la API, usar datos de ejemplo
    if (!permisosAPI || permisosAPI.length === 0) {
      return obtenerDatosDeEjemplo();
    }

    // Transformar los datos reales de la API
    // Aquí asumo que la API devuelve una estructura jerárquica
    // Ajustar según la estructura real de tu API
    return permisosAPI.map(permiso => ({
      id: permiso.id || Math.random(),
      nombre: permiso.nombre || permiso.descripcion,
      nivel: determinarNivel(permiso),
      expandido: false,
      hijos: permiso.hijos ? permiso.hijos.map(hijo => ({
        id: hijo.id || Math.random(),
        nombre: hijo.nombre || hijo.descripcion,
        nivel: 'hijo',
        expandido: false,
        hijos: hijo.subpermisos ? hijo.subpermisos.map(subpermiso => ({
          id: subpermiso.id || Math.random(),
          nombre: subpermiso.nombre || subpermiso.descripcion,
          nivel: 'subhijo',
          expandido: false,
          hijos: []
        })) : []
      })) : []
    }));
  };

  // Determinar el nivel del permiso basado en su estructura
  const determinarNivel = (permiso) => {
    if (permiso.padre_id === null || !permiso.padre_id) return 'padre';
    if (permiso.hijos && permiso.hijos.length > 0) return 'hijo';
    return 'subhijo';
  };

  // Datos de ejemplo para cuando no hay datos de la API
  const obtenerDatosDeEjemplo = () => [
    {
      id: 1,
      nombre: 'Sistema Ocupacional',
      nivel: 'padre',
      expandido: false,
      hijos: [
        {
          id: 2,
          nombre: 'Evaluaciones Médicas',
          nivel: 'hijo',
          expandido: false,
          hijos: [
            { id: 3, nombre: 'Audiometría', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 4, nombre: 'Electrocardiograma', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 5, nombre: 'Oftalmología', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 6, nombre: 'Evaluación Músculo-Esquelética', nivel: 'subhijo', expandido: false, hijos: [] }
          ]
        },
        {
          id: 7,
          nombre: 'Exámenes Complementarios',
          nivel: 'hijo',
          expandido: false,
          hijos: [
            { id: 8, nombre: 'Laboratorio Clínico', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 9, nombre: 'Radiografías', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 10, nombre: 'Espirometría', nivel: 'subhijo', expandido: false, hijos: [] }
          ]
        },
        {
          id: 11,
          nombre: 'Gestión de Pacientes',
          nivel: 'hijo',
          expandido: false,
          hijos: [
            { id: 12, nombre: 'Registro de Pacientes', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 13, nombre: 'Historial Médico', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 14, nombre: 'Citas Médicas', nivel: 'subhijo', expandido: false, hijos: [] }
          ]
        },
        {
          id: 15,
          nombre: 'Reportes y Documentos',
          nivel: 'hijo',
          expandido: false,
          hijos: [
            { id: 16, nombre: 'Certificados Médicos', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 17, nombre: 'Informes de Aptitud', nivel: 'subhijo', expandido: false, hijos: [] },
            { id: 18, nombre: 'Estadísticas', nivel: 'subhijo', expandido: false, hijos: [] }
          ]
        }
      ]
    }
  ];

  // Función para alternar el estado expandido de un nodo
  const toggleExpandir = (id) => {
    const actualizarNodos = (nodos) => {
      return nodos.map(nodo => {
        if (nodo.id === id) {
          return { ...nodo, expandido: !nodo.expandido };
        }
        if (nodo.hijos && nodo.hijos.length > 0) {
          return { ...nodo, hijos: actualizarNodos(nodo.hijos) };
        }
        return nodo;
      });
    };

    setPermisos(prevPermisos => actualizarNodos(prevPermisos));
  };

  // Cargar permisos al montar el componente
  useEffect(() => {
    cargarPermisos();
  }, []);

  return {
    permisos,
    loading,
    error,
    cargarPermisos,
    toggleExpandir
  };
};
