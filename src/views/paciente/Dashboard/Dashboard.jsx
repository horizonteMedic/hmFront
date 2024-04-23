
export default function Dashboard(){
    return (
        <>
        <Navbar/>
           <section className="relative mt-40">
            <div className="m-auto flex   items-center justify-center">
            <div className="col-sm-6 col-lg-3 flex ">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Sales</div>
                      <div className="ms-auto lh-1">
                        <div className="dropdown">
                          <a className="dropdown-toggle text-muted" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item active" href="#">Last 7 days</a>
                            <a className="dropdown-item" href="#">Last 30 days</a>
                            <a className="dropdown-item" href="#">Last 3 months</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="h1 mb-3">75%</div>
                    <div className="d-flex mb-2">
                      <div>Conversion rate</div>
                      <div className="ms-auto">
                        <span className="text-green d-inline-flex align-items-center lh-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 17l6 -6l4 4l8 -8"></path><path d="M14 7l7 0l0 7"></path></svg>
                        </span>
                      </div>
                    </div>
                    <div className="progress progress-sm">
                      <div className="progress-bar bg-primary w-[75%]"  role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" aria-label="75% Complete">
                        <span className="visually-hidden">75% Complete</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">Revenue</div>
                      <div className="ms-auto lh-1">
                        <div className="dropdown">
                          <a className="dropdown-toggle text-muted" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item active" href="#">Last 7 days</a>
                            <a className="dropdown-item" href="#">Last 30 days</a>
                            <a className="dropdown-item" href="#">Last 3 months</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-baseline">
                      <div className="h1 mb-0 me-2">$4,300</div>
                      <div className="me-auto">
                        <span className="text-green d-inline-flex align-items-center lh-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 17l6 -6l4 4l8 -8"></path><path d="M14 7l7 0l0 7"></path></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-lg-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div className="subheader">New clients</div>
                      <div className="ms-auto lh-1">
                        <div className="dropdown">
                          <a className="dropdown-toggle text-muted" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Last 7 days</a>
                          <div className="dropdown-menu dropdown-menu-end">
                            <a className="dropdown-item active" href="#">Last 7 days</a>
                            <a className="dropdown-item" href="#">Last 30 days</a>
                            <a className="dropdown-item" href="#">Last 3 months</a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-baseline">
                      <div className="h1 mb-3 me-2">6,782</div>
                      <div className="me-auto">
                        <span className="text-yellow d-inline-flex align-items-center lh-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M5 12l14 0"></path></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h3 className="card-title">Traffic summary</h3>
                  </div>
                </div>
              </div>
           </section>
        
        </>
    )
}