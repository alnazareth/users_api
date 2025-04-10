
async function fetchAndDisplayUsers() {
    const userListElement = document.getElementById('user-list');
    
    try {
       
        const response = await fetch('https://localhost:7282/api/users');
        
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
       
        const users = await response.json();
        
        userListElement.innerHTML = '<button id="openModalBtn" class="modal-btn">Add New User</button>';
        document.getElementById('openModalBtn').onclick = function() {
    document.getElementById('userModal').style.display = 'block';
};
    
        if (users.length === 0) {
            userListElement.innerHTML = '<p>There are no users available..</p>';
            return;
        }
        
        
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            
          
            let userContent = '';
            for (const [key, value] of Object.entries(user)) {
                userContent += `<p><strong>${key}:</strong> ${value} </p>`;
            }
               userContent += `
                <span class='glyphicon glyphicon-remove delete-icon' 
                      style='position: relative; left: 100%; top: -80px; font-size: 1.2em; color: red; cursor: pointer;'
                      data-id="${user.id}">
                </span>`;



            userElement.innerHTML = userContent;
            userListElement.appendChild(userElement);
        });


            
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', async (e) => {
                const userId = e.target.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this user?')) {
                    await deleteUser(userId);
                }
            });
        });
        
        
    } catch (error) {
        console.error('Error :', error);
        userListElement.innerHTML = `<p class="error">Error ${error.message}</p>`;
    }
}

async function deleteUser(userId) {
    try {
        const response = await fetch(`https://localhost:7282/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

       
        await fetchAndDisplayUsers();
        
    
        showNotification(`Usuario con ID ${userId} eliminado correctamente`, 'success');
        
    } catch (error) {
        console.error('Error on delete ', error);
        showNotification(`Error al eliminar usuario: ${error.message}`, 'error');
    }
}



async function addUser(userName) {
    try {
        const response = await fetch('https://localhost:7282/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name: userName })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const newUser = await response.json();
        console.log('Usuario creado:', newUser);
    
        await fetchAndDisplayUsers();
        
    } catch (error) {
        console.error('Error al añadir usuario:', error);
    }
}



document.getElementById('userForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    const input = document.getElementById('userName');
    const userName = input.value.trim();
    
    if (userName) {
        await addUser(userName);
        input.value = ''; 
    } else {
        alert('Please enter a user name');
    }
});




document.addEventListener('DOMContentLoaded', fetchAndDisplayUsers);