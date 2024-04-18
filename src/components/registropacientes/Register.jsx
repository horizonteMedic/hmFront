import { RegisterPacientes } from "./FormRegister";

export function RegistroPaciente(){

    return(
        <section className="relative ">
            <div className="absolute flex-col top-[50%] left-[30%] bg-zinc-400 flex border-8 border-black">
                <h1>Datos</h1>
                <div className="flex flex-col">
                    <RegisterPacientes/>
                    
                </div>
            </div>
        </section>
    )
}

export default RegistroPaciente