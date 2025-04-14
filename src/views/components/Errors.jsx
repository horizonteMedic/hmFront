const Errors = (error) => {
    if (error.error === 500) {
        return(
        <div className="text-red-800 bg-pink-100 text-lg p-2 mt-3 rounded-lg transition duration-100 ease-in-out flex justify-center items-center">
            <p>
                Usuario o Contraseña Incorrecta
            </p>
        </div>
        )
    } else {
        return(
            <div className="text-red-800 bg-pink-100 text-lg p-2 mt-3 rounded-lg transition duration-100 ease-in-out flex justify-center items-center">
                <p>
                    {error.error}
                </p>
            </div>
            )
    }
}

export default Errors