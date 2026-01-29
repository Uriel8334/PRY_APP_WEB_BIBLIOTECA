function loadPage(event, pageUrl) {
    // Prevenir el comportamiento por defecto del enlace
    event.preventDefault();

    // Obtener el contenedor principal
    const mainContent = document.querySelector('.main-content');
    
    if (!mainContent) {
        console.error('No se encontró el contenedor .main-content');
        return;
    }

    mainContent.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';

    // Realizar la solicitud fetch
    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const mainElement = doc.querySelector('main') || doc.body;
            
            mainContent.innerHTML = mainElement.innerHTML;

            loadPageStyles(pageUrl);
            executeScripts(mainElement);
            updatePageTitle(doc);
        })
        .catch(error => {
            console.error('Error:', error);
            mainContent.innerHTML = `<div class="alert alert-danger m-5" role="alert">Error al cargar la página: ${error.message}</div>`;
        });
}

function loadPageStyles(pageUrl) {
    // Obtener el nombre del archivo sin extensión
    const pageName = pageUrl.split('/').pop().replace('.html', '');
    const cssUrl = `./public/css/${pageName}.css`;

    // Verificar si el CSS ya está cargado
    const existingLink = document.querySelector(`link[href="${cssUrl}"]`);
    if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssUrl;
        document.head.appendChild(link);
    }
}

function executeScripts(element) {
    const scripts = element.querySelectorAll('script');
    scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
            newScript.src = script.src;
        } else {
            newScript.innerHTML = script.innerHTML;
        }
        document.body.appendChild(newScript);
    });
}

function updatePageTitle(doc) {
    const pageTitle = doc.querySelector('title');
    if (pageTitle) {
        document.title = pageTitle.textContent;
    }
}

// Cargar la página de inicio (home) cuando se carga el index
document.addEventListener('DOMContentLoaded', () => {
    loadPage({ preventDefault: () => {} }, './view/home.html');
});
