import FormLogin from './controller/FormLogin';

export function LoginPage() {
    return (
        <>
        <div className="d-flex flex-column w-full h-[90vh]">
  <div className="page page-center">
    <div className="container-tight py-4 mt-36 mb-auto">
      <div className="text-center mb-4 justify-center flex">
        <img src="img/Logo.png" height="36" width="50%" alt="Horizonte" />
      </div>
      
      <div className="card card-md">
        <div className="card-body">
          <h2 className="h2 text-center mb-4">¡Bienvenido!</h2>
          <FormLogin />
        </div>
      </div>
    </div>
  </div>
</div>
        </>
    );
}

export default LoginPage;
