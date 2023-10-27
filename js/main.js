const servicioSelect = document.getElementById('servicio')
const servicios = []
const nombreUsuarioElement = document.getElementById('nombreUsuario')
const usernameInput = document.getElementById('username')
const errorMensaje = document.getElementById('errorMensaje')
const logoutButton = document.getElementById('logoutButton')
let serviciosBarberia

async function fetchServiciosBarberia() {
    try {
        const response = await fetch('/api/servicios.json') 
        if (!response.ok) {
            throw new Error('Error al obtener los servicios.') 
        }
        const data = await response.json()

        return data
    } catch (error) {
        Swal.fire('Error', error.message, 'error') 
        return null
    }
}

async function main() {
    serviciosBarberia = await fetchServiciosBarberia()

    if (!serviciosBarberia) {
        Swal.fire('Error', 'No se pudo obtener la informacion', 'error')
        return
    }

    const usuario = localStorage.getItem('usuario')

    if (usuario) {
        mostrarBarberia(usuario)
    } else {
        document.getElementById('loginForm').style.display = 'block'
        document.getElementById('barberiaForm').style.display = 'none'

        document.getElementById('loginButton').addEventListener('click', function () {
            const nombreUsuario = usernameInput.value.trim()

            if (nombreUsuario === '') {
                errorMensaje.style.display = 'block'
            } else {
                localStorage.setItem('usuario', nombreUsuario)
                mostrarBarberia(nombreUsuario)
                usernameInput.value = ''
            }
        })
    }

    document.getElementById('nombreUsuario').textContent = usuario

    for (const servicioKey in serviciosBarberia) {
        if (serviciosBarberia.hasOwnProperty(servicioKey)) {
            const servicio = serviciosBarberia[servicioKey]
            const option = document.createElement('option')
            option.value = servicioKey
            option.textContent = `${servicio.nombre} - $${servicio.precio}`
            servicioSelect.appendChild(option)
        }
    }

    const categoriaCheckboxes = document.querySelectorAll('input[name="categoria"]')

    categoriaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarSelect)
    })

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('usuario')
        document.getElementById('loginForm').style.display = 'block'
        document.getElementById('barberiaForm').style.display = 'none'
        nombreUsuarioElement.textContent = ''
        errorMensaje.style.display = 'none'
        usernameInput.value = ''
    })
}

function mostrarBarberia(nombreUsuario) {
    document.getElementById('loginForm').style.display = 'none'
    document.getElementById('barberiaForm').style.display = 'block'
    nombreUsuarioElement.textContent = nombreUsuario
}

function agregarServicio() {
    const servicio = servicioSelect.value

    servicios.push(servicio)

    const li = document.createElement('li')
    li.textContent = servicioSelect.options[servicioSelect.selectedIndex].text
    document.getElementById('serviciosSeleccionados').appendChild(li)

    servicioSelect.selectedIndex = 0
}

function actualizarSelect() {
    servicioSelect.innerHTML = ''

    const categoriaCheckbox = document.getElementsByName('categoria')
    const categoriasSeleccionadas = Array.from(categoriaCheckbox)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value)

    for (const servicioKey in serviciosBarberia) {
        if (
            serviciosBarberia.hasOwnProperty(servicioKey) &&
            (!categoriasSeleccionadas.length || categoriasSeleccionadas.includes(serviciosBarberia[servicioKey].categoria))
        ) {
            const servicio = serviciosBarberia[servicioKey]
            const option = document.createElement('option')
            option.value = servicioKey
            option.textContent = `${servicio.nombre} - $${servicio.precio}`
            servicioSelect.appendChild(option)
        }
    }
}

function calcularPrecioTotal() {
    if (servicios.length === 0) {
        Swal.fire('Error', 'No has agregado ningún producto para calcular.', 'error')
        return 
    }

    let total = 0

    servicios.forEach(servicio => {
        if (servicio in serviciosBarberia) {
            total += serviciosBarberia[servicio].precio
        }
    })

    const codigoDescuento = document.getElementById('codigoDescuento').value

    if (codigoDescuento === '') {
        Swal.fire('Total', `Total: $${total}`, 'success')
    } else if (codigoDescuento.toUpperCase() === 'DESC15') {
        total = total * 0.85
        Swal.fire('Total con Descuento', `Total con descuento: $${total}`, 'success')
    } else {
        Swal.fire('Total', `Total: $${total}`, 'success')
    }
}


function limpiarFormulario() {
    Swal.fire({
        title: 'Limpiar formulario',
        text: '¿Estás seguro de que deseas limpiar el formulario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            servicios.length = 0
            document.getElementById('serviciosSeleccionados').innerHTML = ''
            document.getElementById('total').textContent = ''
            Swal.fire('Formulario limpiado', '', 'success')
        }
    })
}

main()