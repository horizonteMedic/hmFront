import './Loading.css'

export function Loading() {
    return(
        <>
            <div className='absolute inset-0 flex justify-center items-center bg-zinc-500 bg-opacity-20'>
            <div className="spinner"></div>
            </div>       
        </>
        
    )
}