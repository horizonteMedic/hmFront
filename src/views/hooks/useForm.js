import { useState } from "react";
import Swal from "sweetalert2";

export const useForm = (initialFormState) => {
  const [form, setForm] = useState(initialFormState);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setForm((f) => ({ ...f, [name]: value.toUpperCase() }));
  // };
  
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
  };

  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
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
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleInputChangeChecked,
    handleCheckBoxChange,
    handleClear,
    handleClearnotO,
    handlePrintDefault,
    handleRadioButtonBoolean
  };
};
