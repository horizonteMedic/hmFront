import { useAuthStore } from "../../store/auth"
import { faMoon, faBell, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export function Navbar() {

    const setToken = useAuthStore(state => state.setToken)
    return (
        <>
    <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href="#">
              <img src="img/Logo.png" width="110" height="32" alt="Tabler" className="navbar-brand-image"/>
            </a>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <div className="d-none d-md-flex">
              <a href="?theme=dark" className="nav-link px-0 hide-theme-dark" data-bs-toggle="tooltip" data-bs-placement="bottom" aria-label="Enable dark mode" data-bs-original-title="Enable dark mode">
              <FontAwesomeIcon icon={faMoon}  />              
              </a>
              <a href="?theme=light" className="nav-link px-0 hide-theme-light" data-bs-toggle="tooltip" data-bs-placement="bottom" aria-label="Enable light mode" data-bs-original-title="Enable light mode">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path></svg>
              </a>
              <div className="nav-item dropdown d-none d-md-flex me-3">
                <a href="#" className="nav-link px-0" data-bs-toggle="dropdown" tabindex="-1" aria-label="Show notifications">
                <FontAwesomeIcon icon={faBell} />
                <span className="badge bg-red"></span>
                </a>
                <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title">Last updates</h3>
                    </div>
                    <div className="list-group list-group-flush list-group-hoverable">
                      <div className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-auto"><span className="status-dot status-dot-animated bg-red d-block"></span></div>
                          <div className="col text-truncate">
                            <a href="#" className="text-body d-block">Example 1</a>
                            <div className="d-block text-muted text-truncate mt-n1">
                              Change deprecated html tags to text decoration classNamees (#29604)
                            </div>
                          </div>
                          <div className="col-auto">
                            <a href="#" className="list-group-item-actions">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-auto"><span className="status-dot d-block"></span></div>
                          <div className="col text-truncate">
                            <a href="#" className="text-body d-block">Example 2</a>
                            <div className="d-block text-muted text-truncate mt-n1">
                              justify-content:between ⇒ justify-content:space-between (#29734)
                            </div>
                          </div>
                          <div className="col-auto">
                            <a href="#" className="list-group-item-actions show">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon text-yellow" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-auto"><span className="status-dot d-block"></span></div>
                          <div className="col text-truncate">
                            <a href="#" className="text-body d-block">Example 3</a>
                            <div className="d-block text-muted text-truncate mt-n1">
                              Update change-version.js (#29736)
                            </div>
                          </div>
                          <div className="col-auto">
                            <a href="#" className="list-group-item-actions">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="list-group-item">
                        <div className="row align-items-center">
                          <div className="col-auto"><span className="status-dot status-dot-animated bg-green d-block"></span></div>
                          <div className="col text-truncate">
                            <a href="#" className="text-body d-block">Example 4</a>
                            <div className="d-block text-muted text-truncate mt-n1">
                              Regenerate package-lock.json (#29730)
                            </div>
                          </div>
                          <div className="col-auto">
                            <a href="#" className="list-group-item-actions">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="nav-item dropdown">
              <a href="#" className="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
                <span className="avatar avatar-sm" >Foto</span>
                <div className="d-none d-xl-block ps-2">
                  <div>Paweł Kuna</div>
                  <div className="mt-1 small text-muted">UI Designer</div>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow ">
                <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModal" className="dropdown-item hover:!bg-gray-100 "><span>Perfil</span></a>
                <a href="./profile.html" className="dropdown-item hover:!bg-gray-100">#</a>
                <div className="dropdown-divider"></div>
                <a onClick={()=>{
                  setToken(null)
                }} className="dropdown-item hover:!bg-gray-100">Cerrar Sesión</a>
              </div>
            </div>
          </div>
          <div className="collapse md:visible navbar-collapse" style={{}} id="navbar-menu">
              <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
                <ul className="navbar-nav">
                  <li className="nav-item active">
                    <a className="nav-link" href="./#">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                      </span>
                      <span className="nav-link-title">
                        First
                      </span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="./#">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                      </span>
                      <span className="nav-link-title">
                        Second
                      </span>
                      <span className="badge badge-sm bg-red">2</span>
                    </a>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#navbar-third" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                      </span>
                      <span className="nav-link-title">
                        Third
                      </span>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="./#">
                        First
                      </a>
                      <a className="dropdown-item" href="./#">
                        Second
                      </a>
                      <a className="dropdown-item" href="./#">
                        Third
                      </a>
                    </div>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link disabled" href="./#">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path></svg>
                      </span>
                      <span className="nav-link-title">
                        Disabled
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          
        </div>
      </header>
      <div className="modal" id="exampleModal" tabindex="-1">
  <div className="modal-dialog modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Mi Perfil</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="mb-3 flex justify-center items-center">
          <label className="form-label mb-0">Nombre:   </label>
          <input type="text" className="form-control mx-2" name="example-text-input" placeholder="Your report name" />
          <label className="form-label mb-0">DNI:   </label>
          <input type="text" className="form-control mx-2" name="example-text-input" placeholder="Your report name" />
          
        </div>
        <div className="mb-3 flex justify-center items-center">
          <label className="form-label mb-0">Usuario:   </label>
          <input type="text" className="form-control mx-2" name="example-text-input" placeholder="Your report name" />
          <label className="form-label mb-0">Contraseña:   </label>
          <input type="text" className="form-control mx-2" name="example-text-input" placeholder="Your report name" />
          
        </div>
        <div className="mb-3 flex justify-center items-center">
          <label className="form-label mb-0">Sexo:   </label>
          <input type="text" className="form-control mx-2" name="example-text-input" placeholder="Your report name" />
          <label className="form-label mb-0">Edad:   </label>
          <input type="text" className="form-control mx-2" name="example-text-input" placeholder="Your report name" />
          
        </div>

      </div>
      <div className="modal-body">
        <div className="row">
          <div className="col-lg-6">
            <div className="mb-3">
              <label className="form-label">Client name</label>
              <input type="text" className="form-control" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label className="form-label">Reporting period</label>
              <input type="date" className="form-control" />
            </div>
          </div>
          <div className="col-lg-12">
            <div>
              <label className="form-label">Additional information</label>
              <textarea className="form-control" rows="3"></textarea>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <a href="#" className="btn btn-link link-secondary" data-bs-dismiss="modal">
          Cancel
        </a>
        <a href="#" className="btn btn-primary ms-auto" data-bs-dismiss="modal">
        <FontAwesomeIcon icon={faPlus} style={{color: "#ffffff",}} />
           Create new report
        </a>
      </div>
    </div>
  </div>
</div>
        </>
    )
}

export default Navbar