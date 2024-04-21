const Modalregister = ()=> {
    return(
        <>
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

        <div class="modal-dialog modal-xl modal-dialog-centered">
                <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Registro de Usuario</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
            <form>
            <div class="mb-5 input-group">
                <label for="recipient-name" class="col-form-label ">Nro Doc:</label>
                <input type="text" class="form-control" id="recipient-name"/>
                <label for="message-text" class="col-form-label">Apellidos y Nombres:</label>
                <input class="form-control" id="message-text"></input>
            </div>
            <div class="mb-3 input-group">
                <label for="recipient-name" class="col-form-label ">Username:</label>
                <input type="text" class="form-control" id="recipient-name"/>
                <select class="form-select" aria-label="Default select example">
                    <option selected>Open this select menu</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </select>
            </div>
            <div class="mb-5 input-group">
                <label for="recipient-name" class="col-form-label ">Nro Doc:</label>
                <input type="text" class="form-control" id="recipient-name"/>
                <label for="message-text" class="col-form-label">Apellidos y Nombres:</label>
                <input class="form-control" id="message-text"></input>
            </div>
            </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary">Save changes</button>
            </div>
            </div>

            </div>
        </div>
        </>
    )
}

export default Modalregister