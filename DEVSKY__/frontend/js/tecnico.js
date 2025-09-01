
// frontend/js/tecnico.js
// Logic for the technician view: view and update the status of their tasks.
// Fully commented for easy understanding.

document.addEventListener('DOMContentLoaded', () => {
  const misTareasList = document.getElementById('misTareasList');

  // Get the technician's id from sessionStorage (saved on login)
  const tecnicoId = sessionStorage.getItem('tecnicoId');
  if (!tecnicoId) {
    misTareasList.innerHTML = '<div class="error">Technician ID not found. Please log in again.</div>';
    return;
  }

  // List tasks assigned to the technician
  async function cargarMisTareas() {
  misTareasList.innerHTML = '<div class="cargando">Loading your tasks...</div>';
    try {
      const resp = await fetch(`http://localhost:3000/api/tareas/tecnico/${tecnicoId}`);
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.tareas)) {
        if (!data.tareas || data.tareas.length === 0) {
          misTareasList.innerHTML = '<div class="vacio">You have no assigned tasks.</div>';
        } else {
          misTareasList.innerHTML = '';
          data.tareas.forEach(tarea => {
            const div = document.createElement('div');
            div.className = 'tarea-card';
            let verifHtml = '';
            if (!tarea.verificada) {
              if (!tarea.para_verificar) {
                verifHtml = `<button class="btn-verif">Mandar a verificar</button> <span class="msg-verif"></span>`;
              } else {
                verifHtml = `<span class="tarea-pendiente">⏳ Pendiente de verificación</span>`;
              }
            } else {
              verifHtml = `<span class="tarea-verificada">✅ Verificada</span>`;
            }
            div.innerHTML = `
              <div class="tarea-desc">${tarea.descripcion}</div>
              <div class="tarea-detalles">
                <span class="tarea-estado estado-${(tarea.estado||'').replace(/\s/g, '').toLowerCase()}">Status: ${tarea.estado||'Sin estado'}</span>
                <select class="estado-select">
                  <option value="En Progreso" ${tarea.estado==="En Progreso"?"selected":''}>En Progreso</option>
                  <option value="Realizado" ${tarea.estado==="Realizado"?"selected":''}>Realizado</option>
                  <option value="No Realizado" ${tarea.estado==="No Realizado"?"selected":''}>No Realizado</option>
                </select>
                <button class="btn-actualizar">Actualizar</button>
                <span class="msg-estado"></span>
                ${verifHtml}
              </div>
            `;
            // Logic to update status
            const select = div.querySelector('.estado-select');
            const btn = div.querySelector('.btn-actualizar');
            const msg = div.querySelector('.msg-estado');
            btn.addEventListener('click', async () => {
              const nuevoEstado = select.value;
              try {
                const resp = await fetch(`http://localhost:3000/api/tareas/${tarea.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ estado: nuevoEstado })
                });
                const result = await resp.json();
                if (result && result.success) {
                  msg.textContent = '✅ Status actualizado';
                  cargarMisTareas();
                } else {
                  msg.textContent = (result && result.message) || 'Error al actualizar.';
                }
              } catch (err) {
                msg.textContent = 'No se pudo conectar con el servidor.';
              }
            });
            // Botón mandar a verificar
            if (!tarea.verificada && !tarea.para_verificar) {
              const btnVerif = div.querySelector('.btn-verif');
              const msgVerif = div.querySelector('.msg-verif');
              btnVerif.addEventListener('click', async () => {
                btnVerif.disabled = true;
                msgVerif.textContent = 'Enviando...';
                try {
                  const resp = await fetch(`http://localhost:3000/api/tareas/${tarea.id}/para-verificar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ para_verificar: true })
                  });
                  const result = await resp.json();
                  if (result && result.success) {
                    msgVerif.textContent = '⏳ Enviada para verificación';
                    cargarMisTareas();
                  } else {
                    msgVerif.textContent = (result && result.message) || 'Error al enviar.';
                  }
                } catch (err) {
                  msgVerif.textContent = 'No se pudo conectar con el servidor.';
                }
                btnVerif.disabled = false;
              });
            }
            misTareasList.appendChild(div);
          });
        }
      } else {
        misTareasList.innerHTML = '<div class="error">Error al cargar tus tareas.</div>';
      }
    } catch (err) {
      misTareasList.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  }

  cargarMisTareas();
});

 
