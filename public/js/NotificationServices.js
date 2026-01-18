// js/services/NotificationService.js

const NotificationService = {
    containerId: 'notification-area', // cambiar segun se cree el id 

    mostrarNotificacion: function(mensaje, tipo = 'info') {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo}`; // Clases CSS modulares
        alerta.innerText = mensaje;

        container.appendChild(alerta);

        // Eliminar la alerta automáticamente después de 3 segundos
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    },

    //simulacion de recordatorio
    programarRecordatorio: function(libro, segundos) {
        console.log(`Recordatorio programado para: ${libro}`);
        
        // setTimeout uso de asincronía básica 
        setTimeout(() => {
            this.mostrarNotificacion(`Recordatorio: Debes devolver el libro "${libro}" pronto.`, 'warning');
        }, segundos * 1000);
    }
};

export default NotificationService;