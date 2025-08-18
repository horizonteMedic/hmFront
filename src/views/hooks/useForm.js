import { useState } from "react";

export const useForm = (initialFormState) => {
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value.toUpperCase() }));
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

  const handleClear = () => {
    setForm(initialFormState);
  };

  const handleClearnotO = () => {
    setForm((prev) => ({ ...initialFormState, norden: prev.norden }));
  };

  const handleInputChangeChecked = (e) => {
      const { name, checked } = e.target;
      setForm(prev => ({
          ...prev,
          [name]: checked
      }));
  }

  return {
    form,
    setForm,
    handleChange,
    handleChangeNumber,
    handleRadioButton,
    handleClear,
    handleClearnotO,
    handleInputChangeChecked
  };
};
