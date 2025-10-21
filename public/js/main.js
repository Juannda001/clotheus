// Manejo del Login y Selección de Rol
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const roleModal = document.getElementById('roleModal');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simular validación (acepta cualquier credencial)
            if (username && password) {
                // Mostrar modal de selección de rol
                roleModal.style.display = 'flex';
                
                // Guardar usuario en sessionStorage
                sessionStorage.setItem('currentUser', username);
                
                // Mostrar mensaje de éxito
                alert('¡Login exitoso! Selecciona tu rol.');
            } else {
                alert('Por favor completa todos los campos');
            }
        });
    }
    
    // Manejar selección de rol
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            redirectToRole(role);
        });
    });
    
    function redirectToRole(role) {
        // Guardar rol en sessionStorage
        sessionStorage.setItem('userRole', role);
        
        switch(role) {
            case 'cliente':
                window.location.href = '/cliente';
                break;
            case 'vendedor':
                window.location.href = '/vendedor';
                break;
            case 'admin':
                window.location.href = '/admin';
                break;
        }
    }
    
    // Cerrar modal si se hace click fuera
    window.addEventListener('click', function(e) {
        if (e.target === roleModal) {
            roleModal.style.display = 'none';
        }
    });
});