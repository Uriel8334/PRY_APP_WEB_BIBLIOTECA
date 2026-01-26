// const usuario = (nombre_completo,correo_electronico,nombre_usuario,contrasena) => {
//     return {
//         nombre_completo,
//         correo_electronico,
//         nombre_usuario,
//         contrasena,
//         informacion: function() {
//             return `Nombre Completo: ${this.nombre_completo}, Correo Electrónico: ${this.correo_electronico}, Nombre de Usuario: ${this.nombre_usuario}, Contraseña: ${this.contrasena}`;
//         }
//     }
// }

// let usuarios = [];
// const btnRegistrarUsuario = document.getElementById('btnRegistrarUsuario');
// if (btnRegistrarUsuario) {
// btnRegistrarUsuario.addEventListener('click', (e) => {
//     e.preventDefault();
//     const nombreCompleto = document.getElementById('nombreCompleto');
//     const correoElectronico = document.getElementById('correoElectronico');
//     const nombreUsuario = document.getElementById('nombreUsuario');
//     const contrasena = document.getElementById('contrasena');
//     const confirmarContrasena = document.getElementById('confirmarContrasena');
//     const terminosCondiciones = document.getElementById('terminosCondiciones').checked;
//     if (!nombreCompleto.value || !correoElectronico.value || !nombreUsuario.value || !contrasena.value || !confirmarContrasena.value || !terminosCondiciones) {
//         return;
//     }
//     if(!validarEntradaDatos(nombreCompleto, correoElectronico, nombreUsuario, contrasena,confirmarContrasena)){
//         return;
//     }
//     const nuevo_usuario = usuario(nombreCompleto.value, correoElectronico.value, nombreUsuario.value, contrasena.value);
//     usuarios.push(nuevo_usuario);
//     window.location.href = "login.html";
//     console.log('Usuario registrado:', nuevo_usuario.informacion());
//     alert('Usuario registrado exitosamente.');
// });
// }

// const btnIniciarSesion = document.getElementById('btnIniciarSesion');
// if (btnIniciarSesion) {
// btnIniciarSesion.addEventListener('click', (e) => {
//     e.preventDefault();
//     const nombreUsuario = document.getElementById('nombreUsuario').value;
//     const contrasena = document.getElementById('contraseña').value;
//     if (!nombreUsuario || !contrasena) {
//         return;
//     }
//     usuarios.forEach((v, index) => {
//         console.log(`\nUsuario ${index + 1}:`);
//         console.log(v.informacion());
//     });
//     const usuarioEncontrado = usuarios.find(user => user.nombre_usuario === nombreUsuario && user.contrasena === contrasena);
//     if (usuarioEncontrado) {
//         console.log('Inicio de sesión exitoso:', usuarioEncontrado.informacion());
//         window.location.href = "../index.html";
//         alert('Inicio de sesión exitoso.');
//     } else {
//         console.log('Credenciales inválidas.');
//         alert('Credenciales inválidas. Por favor, verifica tu correo electrónico y contraseña.');
//     }
// });
// }

