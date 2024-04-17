import FormLogin from './controller/FormLogin';

export function LoginPage() {
    return (
        <>
            <div className='absolute bg-slate-100 inset-0 bg-cover bg-center' style={{backgroundImage: 'url(img/Fondo-login.jpg)'}}/>
            <section className="relative flex justify-center items-center h-screen"> 
                <div className='flex items-center bg-black bg-opacity-30 max-w-sm w-full p-8 rounded-lg'>
                    <div className='w-full'>
                        <h2 className='p-6 text-2xl text-white font-semibold'>Bienvenidos!</h2>
                        <FormLogin/>    
                    </div>
                </div>
            </section>
        </>
    );
}

export default LoginPage;
