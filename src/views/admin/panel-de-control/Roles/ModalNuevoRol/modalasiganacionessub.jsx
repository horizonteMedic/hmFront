import React, { useState } from 'react';
import { useEffect } from 'react';
import { DeletePermiso, NewPermiso } from './model';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../../../store/auth';

const ModalAsignacionesSub = ({ open, onClose, nombre, get, IDView, token, ListPerm, ListPermCheck, ID_ROL }) => {
  if (!open) return null;
  console.log(ListPermCheck)
  const [permisos, setPermisos] = useState(ListPerm)
  const [checkedPermisos, setCheckedPermisos] = useState(ListPermCheck);
  const listAccesos = useAuthStore((state) => state.listAccesos);
  const setlistAccesos = useAuthStore((state) => state.setlistAccesos);
  
  //GLOBAL
  const eliminarPermisoGlobal = (vistaNombre, accion) => {
    const nuevaLista = listAccesos.map((item) => {
      if (item.nombre === vistaNombre) {
        const nuevaListaPermisos = item.listaPermisos.filter(p => p !== accion);
        return {
          ...item,
          listaPermisos: nuevaListaPermisos
        };
      }
      return item;
    }).filter(item => item.listaPermisos.length > 0); // elimina entradas vacías

    setlistAccesos(nuevaLista);
  };

  const agregarPermisoGlobal = (vistaNombre, accion) => {
    const existeVista = listAccesos.find(item => item.nombre === vistaNombre);

    let nuevaLista;
    if (existeVista) {
      const yaExisteAccion = existeVista.listaPermisos.includes(accion);
      nuevaLista = listAccesos.map((item) => {
        if (item.nombre === vistaNombre) {
          return {
            ...item,
            listaPermisos: yaExisteAccion
              ? item.listaPermisos
              : [...item.listaPermisos, accion]
          };
        }
        return item;
      });
    } else {
      nuevaLista = [
        ...listAccesos,
        { nombre: vistaNombre, listaPermisos: [accion] }
      ];
    }
    console.log(nuevaLista)
    setlistAccesos(nuevaLista);
  };
  //FIN GLOBAL

  const agregarPermiso = (accion) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas asignar esta vista a este Rol?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#233245',
      cancelButtonColor: '#fc6b03',
      confirmButtonText: 'Sí, asignar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      },
      backdrop: `rgba(44,62,80,0.7)`
    }).then((result) => {
      if (result.isConfirmed) {
        NewPermiso(IDView,accion,ID_ROL,token)
        .then((res) => {
          Swal.fire({
            title: '¡Asignado!',
            text: 'Se ha asignado correctamente.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#f8f9fa',
            color: '#233245'
          });
          setCheckedPermisos([...checkedPermisos, accion]);
        })
      }
    })}
  ;

  const quitarPermiso = (accion) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas quitar esta vista al Rol?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      },
      backdrop: `rgba(44,62,80,0.7)`
    }).then((result) => {
      if (result.isConfirmed) {
        DeletePermiso(IDView,accion,ID_ROL,token)
        .then((res) => {
          console.log(res)
          Swal.fire({
            title: '¡Eliminado!',
            text: 'Se ha quitado la asignación.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#f8f9fa',
            color: '#233245'
          });
          const nuevosPermisos = checkedPermisos.filter((perm) => perm !== accion);
          setCheckedPermisos(nuevosPermisos);
        })
      }
    })
    
  };

  const handleCheckboxChange = (accion, isChecked) => {
    console.log(accion)
    if (isChecked) {
      if (!checkedPermisos.includes(accion)) {
        agregarPermiso(accion);
         
      }
    } else {
      quitarPermiso(accion);
    }
  };
  console.log(checkedPermisos)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md w-[350px] relative p-6">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-center">Asignar acciones a: <span className="text-blue-700">{nombre}</span></h2>
        <div className="flex flex-col gap-2">
            {permisos.namePermiso?.map((accion, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={checkedPermisos.includes(accion)}
                  onChange={(e) => handleCheckboxChange(accion, e.target.checked)}
                />
                {accion}
              </label>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ModalAsignacionesSub; 