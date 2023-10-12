const serviciosBarberia = {
    corte: {
        nombre: 'Corte de pelo',
        precio: 2000,
        categoria: 'hombre'
    },
    afeitado: {
        nombre: 'Afeitado',
        precio: 1500,
        categoria: 'hombre'
    },
    barba: {
        nombre: 'Arreglo de barba',
        precio: 1000,
        categoria: 'hombre'
    },
    cejas: {
        nombre: 'Arreglo de cejas',
        precio: 1000,
        categoria: 'mujer'
    },
    manicura: {
        nombre: 'Manicuria clasica',
        precio: 5000,
        categoria: 'mujer'
    },
    pedicura: {
        nombre: 'Pedicuria moderna',
        precio: 4000,
        categoria: 'mujer'
    }
    
}

const servicioSelect = document.getElementById('servicio')
const servicios = []

const loginForm = document.getElementById('loginForm')
const barberiaForm = document.getElementById('barberiaForm')
const nombreUsuarioElement = document.getElementById('nombreUsuario')
const usernameInput = document.getElementById('username');
const logoutButton = document.getElementById('logoutButton')

const usuario = localStorage.getItem('usuario', nombreUsuario)

if (usuario) {
    mostrarBarberia(usuario);
} else {
    loginForm.style.display = 'block';
    barberiaForm.style.display = 'none';

    document.getElementById('loginButton').addEventListener('click', function() {
        const nombreUsuario = document.getElementById('username').value.trim();

        if (nombreUsuario === '') {
            errorMensaje.style.display = 'block';
        } else {
            localStorage.setItem('usuario', nombreUsuario);
            mostrarBarberia(nombreUsuario);
            usernameInput.value = ''
        }
    });
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

const form = document.getElementById('barberiaForm')
const serviciosSeleccionados = document.getElementById('serviciosSeleccionados')
const totalElement = document.getElementById('total')
const codigoDescuentoInput = document.getElementById('codigoDescuento')
const categoriaCheckboxes = document.querySelectorAll('input[name="categoria"]')

categoriaCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', actualizarSelect)
})

logoutButton.addEventListener('click', function() {
    localStorage.removeItem('usuario');
    loginForm.style.display = 'block';
    barberiaForm.style.display = 'none';
    nombreUsuarioElement.textContent = '';
    errorMensaje.style.display = 'none'
    usernameInput.value = ''
});

function mostrarBarberia(nombreUsuario) {
    loginForm.style.display = 'none';
    barberiaForm.style.display = 'block';
    nombreUsuarioElement.textContent = nombreUsuario;
}

function agregarServicio() {
    const servicio = servicioSelect.value

    servicios.push(servicio)

    const li = document.createElement('li')
    li.textContent = servicioSelect.options[servicioSelect.selectedIndex].text
    serviciosSeleccionados.appendChild(li)

    servicioSelect.selectedIndex = 0
}

function actualizarSelect() {
    servicioSelect.innerHTML = ""

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

categoriaCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', actualizarSelect)
})

function calcularPrecioTotal() {
    let total = 0

    servicios.forEach(servicio => {
        if (servicio in serviciosBarberia) {
            total += serviciosBarberia[servicio].precio
        }
    })

    const codigoDescuento = codigoDescuentoInput.value

    if (codigoDescuento === '') {
        totalElement.textContent = `Total: $${total}`
    } else if (codigoDescuento.toUpperCase() === 'DESC15') {
        total = total * 0.85
        totalElement.textContent = `Total con descuento: $${total}`
    } else {
        totalElement.textContent = `Total: $${total}`
    }
}

function limpiarFormulario() {
    servicios.length = 0
    serviciosSeleccionados.innerHTML = ""
    totalElement.textContent = ""
}
