import { useState } from "react";
import InputsRegister from "./Inputregister"
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";

export function RegisterPacientes() {
    const [startDate, setStartDate] = useState(new Date());

    const Fecha = () => {
        return(
            <>
                <div className="flex m-2">
                    <label >Fecha de nacimiento:    </label>
                    <ReactDatePicker selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showYearDropdown
                    dateFormatCalendar="MMMM"
                    yearDropdownItemNumber={35}
                    scrollableYearDropdown
                    className="text-black p-1 ml-2"/>
                </div>
            </>
            
        )
    }

    return(
        <>
        <div className="flex">
            <InputsRegister label="DNI" type="text"/>
            
        </div>
            <InputsRegister label="Nombres" type="text"/>
            <InputsRegister label="Apellidos" type="text"/>
            <Fecha/>
            
            <InputsRegister label="email" type="text"/>
            <InputsRegister label="Lugar de Nacimiento" type="text"/>
            <InputsRegister label="Direccion Habitual"/>
            <div className="flex">
                <InputsRegister label="Casa" type="text"/>
                <InputsRegister label="Celular" type="number"/>
            </div>
        </>
    )
}

