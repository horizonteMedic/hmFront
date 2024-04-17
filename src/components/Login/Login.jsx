import FormLogin from './controller/FormLogin'

export function LoginPage() {
    
    return(
        <>
        <div className='absolute bg-slate-100 inset-0 bg-cover bg-center' style={{backgroundImage: 'url(img/Fondo-login.jpg)'}}/>
        <section className="relative px-4 mt-40 "> 
            <div className='flex items-center justify-center  bg-black bg-opacity-30 w-[912px] m-auto'>
                <div className='flex items-center justify-center bg-cover bg-center w-full ' >
                    <img src="img/Logo.png" alt="" className='w-auto h-auto object-cover' />
                </div>
                <div className='relative w-full'>
                    <div className='flex flex-col w-auto p-12 items-center justify-center'>
                        <h2 className='flex p-6 bg text-2xl text-white font-semibold'>Bienvenidos!</h2>
                        <FormLogin/>    
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}


export default LoginPage