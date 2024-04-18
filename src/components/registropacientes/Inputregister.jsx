export const InputsRegister = ({label, type}) => {
    return(
        <>
            <div className="flex m-2">
                <span>{label}: </span><input type={type} className=" text-black p-1 ml-2"/>
            </div>
        </>
    )
}

export default InputsRegister