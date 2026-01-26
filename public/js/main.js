var Libros = [];
var usuarios = [];

const usuario = (nombre_completo, correo_electronico, nombre_usuario, contrasena) => {
    return {
        nombre_completo,
        correo_electronico,
        nombre_usuario,
        contrasena,
        informacion: function () {
            return `Nombre Completo: ${this.nombre_completo}, Correo Electrónico: ${this.correo_electronico}, Nombre de Usuario: ${this.nombre_usuario}, Contraseña: ${this.contrasena}`;
        }
    }
}

const libro = (titulo, autor, anio_publicacion, genero) => {
    return {
        titulo,
        autor,
        anio_publicacion,
        genero,
        informacion: function () {
            return `Título: ${this.titulo}, Autor: ${this.autor}, Año de Publicación: ${this.anio_publicacion}, Género: ${this.genero}`;
        }
    }
}

function inicializar() {
    usuarios = cargarDelStorage('usuariosData');
}

async function registroUsuario() {
    const nombreCompleto = document.getElementById('nombreCompleto');
    const correoElectronico = document.getElementById('correoElectronico');
    const nombreUsuario = document.getElementById('nombreUsuario');
    const contrasena = document.getElementById('contrasena');
    const confirmarContrasena = document.getElementById('confirmarContrasena');
    const terminosCondiciones = document.getElementById('terminosCondiciones').checked;
    if (!validarBotonUsuario(nombreCompleto, correoElectronico, nombreUsuario, contrasena, confirmarContrasena)) {
        return;
    } else if (!terminosCondiciones) {
        return;
    }
    const validarEnTiempoReal = await validarDuplicados(correoElectronico, nombreUsuario, usuarios);
    if (!validarEnTiempoReal) {
        return;
    }
    const nuevo_usuario = usuario(nombreCompleto.value, correoElectronico.value, nombreUsuario.value, contrasena.value);
    usuarios.push(nuevo_usuario);
    guardarEnStorage(usuarios, 'usuariosData');
    window.location.href = "login.html";
    console.log('Usuario registrado:', nuevo_usuario.informacion());
    alert('Usuario registrado exitosamente.');
}

function registroIniciarSesion() {
    const nombreUsuario = document.getElementById('inicioUsuario');
    const contrasena = document.getElementById('contraseña');
    if (!validarBotonInicioSesion(nombreUsuario, contrasena)) {
        return;
    }

    // Depuración sin .informacion()
    usuarios.forEach((v, index) => {
        console.log(`Usuario ${index + 1}:`, v);
    });

    const usuarioEncontrado = usuarios.find(user => user.nombre_usuario === nombreUsuario.value && user.contrasena === contrasena.value);

    if (usuarioEncontrado) {
        console.log('Inicio de sesión exitoso:', usuarioEncontrado);
        alert('Inicio de sesión exitoso.');
        window.location.href = "../index.html";
    } else {
        console.log('Credenciales inválidas.');
        alert('Credenciales inválidas.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    inicializar();
    var menuItems = document.querySelectorAll('nav.page-navigation li');
    menuItems.forEach(item => {
        item.addEventListener('click', function () {
            menuItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
        });
    });

    var btnRegistrarUsuario = document.getElementById('btnRegistrarUsuario');
    if (btnRegistrarUsuario) {
        btnRegistrarUsuario.addEventListener('click', function (e) {
            e.preventDefault();
            registroUsuario();
        });
    }

    var btnIniciarSesion = document.getElementById('btnIniciarSesion');
    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener('click', function (e) {
            e.preventDefault();
            registroIniciarSesion();
        });
    }

    // var btnAgregar = document.getElementById('btn_agregar');
    // if (btnAgregar) {
    //     btnAgregar.addEventListener('click', manejarRegistro);
    // }

});