// Funciones para manejar el almacenamiento en localStorage
function guardarEnStorage(usuarios,nombreData) {
    if(nombreData==='usuariosData'){
        localStorage.setItem('usuariosData', JSON.stringify(usuarios || []));
    }else if(nombreData==='librosData'){
        localStorage.setItem('librosData', JSON.stringify(usuarios || []));
    }
}

// Función para cargar estudiantes desde localStorage
function cargarDelStorage(nombreData) {
    var datos = localStorage.getItem(nombreData);
    if (!datos) {
        return [];
    }

    try {
        var parsed = JSON.parse(datos);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.warn('No se pudo leer datos desde storage', e);
        return [];
    }
}
