import FormLogin from './controller/FormLogin';
import '@tabler/core/dist/css/tabler.min.css';
export function LoginPage() {
    return (
        <>
        <div className="d-flex flex-column">
  <div className="page page-center">
    <div className="container-tight py-4">
      <div className="text-center mb-4">
        <img src="img/Logo.png" height="36" alt="" />
      </div>
      <div className="text-center mb-4">
        <a href="." className="navbar-brand navbar-brand-autodark"><img src="./static/logo.svg" height="36" alt="" /></a>
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
