
export const Error = ({children}) =>{
        return( 
            <div className="text-red-800 bg-pink-100 text-lg p-2 mt-3 rounded-lg transition duration-100 ease-in-out flex justify-center items-center">
                <p>
                   {children}
                </p>
            </div>
        )
    }

export const Entro = ({children}) => {
        return(
            <div className="text-green-800 bg-green-100 text-lg p-2 mt-3 rounded-lg transition duration-100 ease-in-out flex justify-center items-center">
                <p>
                    {children}
                </p>
            </div>
        )
    }

