// import { useState } from "react";
// import Swal from "sweetalert2";

// export const useForm = (initialFormState) => {
//   const [form, setForm] = useState(initialFormState);

//   const handleChangeSimple = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const handleChange = (e) => {
//     const { name, value, selectionStart, selectionEnd } = e.target;

//     setForm((f) => {
//       const upper = value.toUpperCase();
//       return { ...f, [name]: upper };
//     });

//     // Restaurar posición del cursor en el próximo ciclo
//     requestAnimationFrame(() => {
//       e.target.setSelectionRange(selectionStart, selectionEnd);
//     });
//   };

//   const handleChangeNumber = (e) => {
//     const { name, value } = e.target;
//     if (/^[\d/]*$/.test(value)) {
//       setForm((f) => ({ ...f, [name]: value }));
//     }
//   };

//   const handleRadioButton = (e, value) => {
//     const { name } = e.target;
//     setForm((f) => ({
//       ...f,
//       [name]: value.toUpperCase(),
//     }));
//   };

//   const handleRadioButtonBoolean = (e, value) => {
//     const { name } = e.target;
//     setForm((f) => ({
//       ...f,
//       [name]: value,
//     }));
//   };

//   const handleClear = () => {
//     setForm(initialFormState);
//   };

//   const handleClearnotO = () => {
//     setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
//   };

//   const handleInputChangeChecked = (e) => {
//     handleCheckBoxChange(e);
//   }
//   const handleCheckBoxChange = (e) => {
//     const { name, checked } = e.target;
//     setForm((f) => ({
//       ...f,
//       [name]: checked,
//     }));
//   };
//   const handlePrintDefault = (confirmarImpresion = () => { }) => {
//     if (!form.norden)
//       return Swal.fire("Error", "Debe colocar un N° Orden", "error");
//     Swal.fire({
//       title: "¿Desea Imprimir Reporte?",
//       html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Sí, Imprimir",
//       cancelButtonText: "Cancelar",
//       customClass: {
//         title: "swal2-title",
//         confirmButton: "swal2-confirm",
//         cancelButton: "swal2-cancel",
//       },
//     }).then((result) => {
//       if (result.isConfirmed) {
//         confirmarImpresion();
//       }
//     });
//   };

//   return {
//     form,
//     setForm,
//     handleChangeSimple,
//     handleChange,
//     handleChangeNumber,
//     handleRadioButton,
//     handleInputChangeChecked,
//     handleCheckBoxChange,
//     handleClear,
//     handleClearnotO,
//     handlePrintDefault,
//     handleRadioButtonBoolean
//   };
// };
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export const useForm = (initialFormState, options = {}) => {
  const { storageKey } = options;
  const [form, setForm] = useState(() => {
    if (typeof window !== "undefined" && storageKey) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...initialFormState, ...parsed };
        }
      } catch (err) {
        console.warn("useForm: error leyendo localStorage", err);
      }
    }
    return initialFormState;
  });

  useEffect(() => {
    if (typeof window !== "undefined" && storageKey) {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem(storageKey, JSON.stringify(form));
          console.log("guardado en localStorage");
        } catch (err) {
          console.warn("useForm: error guardando en localStorage", err);
        }
      }, 1000); // Debounce de 1 segundos

      return () => clearTimeout(timeoutId);
    }
  }, [form, storageKey]);

  const handleChangeSimple = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value, selectionStart, selectionEnd } = e.target;

    setForm((f) => {
      const upper = value.toUpperCase();
      return { ...f, [name]: upper };
    });

    // Restaurar posición del cursor en el próximo ciclo
    requestAnimationFrame(() => {
      e.target.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    if (/^[\d/]*$/.test(value)) {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleRadioButton = (e, value) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value.toUpperCase(),
    }));
  };

  const handleRadioButtonBoolean = (e, value) => {
    const { name } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  const handleClear = () => {
    setForm(initialFormState);
    if (typeof window !== "undefined" && storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (err) {
        console.warn("useForm: error removiendo localStorage en clear", err);
      }
    }
  };

  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
    if (typeof window !== "undefined" && storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ ...initialFormState, norden: form.norden }));
      } catch (err) {
        console.warn("useForm: error guardando localStorage en clearnotO", err);
      }
    }
  };

  const handleInputChangeChecked = (e) => {
    handleCheckBoxChange(e);
  }
  const handleCheckBoxChange = (e) => {
    const { name, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: checked,
    }));
  };

  const handleCheckBoxWriteOnText = (e, textInput, mapText) => {
    const { name, checked } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: checked };
      // Obtenemos las líneas existentes
      const existentes = (prev[textInput] || "")
        .split(/\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      // Texto asociado al checkbox
      const texto = mapText[name];
      let nuevasLineas = [...existentes];
      if (checked) {
        // Si se marca y aún no está, lo agregamos al final
        if (!nuevasLineas.includes(texto)) {
          nuevasLineas.push(texto);
        }
      } else {
        // Si se desmarca, lo quitamos
        nuevasLineas = nuevasLineas.filter((l) => l !== texto);
      }
      const nuevoTexto = nuevasLineas.join("\n");
      return { ...next, [textInput]: nuevoTexto };
    });
  };

  const handlePrintDefault = (confirmarImpresion = () => { }) => {
    if (!form.norden)
      return Swal.fire("Error", "Debe colocar un N° Orden", "error");
    Swal.fire({
      title: "¿Desea Imprimir Reporte?",
      html: `<div style='font-size:1.1em;margin-top:8px;'><b style='color:#5b6ef5;'>N° Orden: ${form.norden}</b></div>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Imprimir",
      cancelButtonText: "Cancelar",
      customClass: {
        title: "swal2-title",
        confirmButton: "swal2-confirm",
        cancelButton: "swal2-cancel",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        confirmarImpresion();
      }
    });
  };

  return {
    form,
    setForm,
    handleChangeSimple,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleInputChangeChecked,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButtonBoolean,
    handleCheckBoxWriteOnText
  };
};
