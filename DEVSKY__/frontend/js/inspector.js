// frontend/js/inspector.js
// Logic for the inspector view: view tasks and assign new tasks.
// Fully commented for easy understanding.

document.addEventListener('DOMContentLoaded', () => {
  const tareasList = document.getElementById('tareasList');
  const asignarForm = document.getElementById('asignarForm');
  const tecnicoSelect = document.getElementById('tecnico');
  const asignarMsg = document.getElementById('asignarMsg');

  // Load all technicians from the database
  async function cargarTecnicos() {
    try {
      const resp = await fetch('http://localhost:3000/api/usuarios/tecnicos');
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.tecnicos)) {
        tecnicoSelect.innerHTML = '';
        if (data.tecnicos.length === 0) {
          tecnicoSelect.innerHTML = '<option value="">No technicians available</option>';
        } else {
          data.tecnicos.forEach(tecnico => {
            const opt = document.createElement('option');
            opt.value = tecnico.id;
            opt.textContent = tecnico.nombre_usuario;
            tecnicoSelect.appendChild(opt);
          });
        }
      } else {
  tecnicoSelect.innerHTML = '<option value="">No technicians available</option>';
      }
    } catch (err) {
  tecnicoSelect.innerHTML = '<option value="">Error loading technicians</option>';
    }
  }

  // List all tasks
  async function cargarTareas() {
  tareasList.innerHTML = '<div class="cargando">Loading tasks...</div>';
    try {
      const resp = await fetch('http://localhost:3000/api/tareas');
      const data = await resp.json();
      if (data && data.success && Array.isArray(data.tareas)) {
        if (!data.tareas || data.tareas.length === 0) {
          tareasList.innerHTML = '<div class="vacio">No tasks registered.</div>';
        } else {
          tareasList.innerHTML = '';
          // Get technicians for the edit selector
          let tecnicos = [];
          try {
            const respTec = await fetch('http://localhost:3000/api/usuarios/tecnicos');
            const dataTec = await respTec.json();
            if (dataTec && dataTec.success && Array.isArray(dataTec.tecnicos)) {
              tecnicos = dataTec.tecnicos;
            }
          } catch {}
          for (const tarea of data.tareas) {
            const div = document.createElement('div');
            div.className = 'tarea-card';
            let verifHtml = '';
            if (tarea.para_verificar && !tarea.verificada) {
              verifHtml = `<button class="btn-verificar">Verificar</button> <span class="msg-verif"></span>`;
            } else if (tarea.verificada) {
              verifHtml = `<span class="tarea-verificada">✅ Verificada</span>`;
            }
            // Botones editar y eliminar
            let actionHtml = `<button class="btn-editar">✏️</button> <button class="btn-eliminar">🗑️</button>`;
            div.innerHTML = `
              <div class="tarea-desc">${tarea.descripcion}</div>
              <div class="tarea-detalles">
                <span class="tarea-tecnico">👨‍🔧 Technician: <b>${tarea.tecnico_nombre || 'Sin asignar'}</b></span>
                <span class="tarea-estado estado-${(tarea.estado||'').replace(/\s/g, '').toLowerCase()}">Status: ${tarea.estado||'Sin estado'}</span>
                ${verifHtml}
                <span class="tarea-actions">${actionHtml}</span>
              </div>
              <div class="msg-edicion"></div>
            `;
            // Botón verificar
            if (tarea.para_verificar && !tarea.verificada) {
              const btn = div.querySelector('.btn-verificar');
              const msg = div.querySelector('.msg-verif');
              btn.addEventListener('click', async () => {
                btn.disabled = true;
                msg.textContent = 'Verificando...';
                try {
                  const resp = await fetch(`http://localhost:3000/api/tareas/${tarea.id}/verificar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ verificada: true })
                  });
                  const result = await resp.json();
                  if (result && result.success) {
                    msg.textContent = '✅ Verificada';
                    cargarTareas();
                  } else {
                    msg.textContent = (result && result.message) || 'Error al verificar.';
                  }
                } catch (err) {
                  msg.textContent = 'No se pudo conectar con el servidor.';
                }
                btn.disabled = false;
              });
            }
            // Botón eliminar
            const btnEliminar = div.querySelector('.btn-eliminar');
            const msgEdicion = div.querySelector('.msg-edicion');
            btnEliminar.addEventListener('click', async () => {
              if (!confirm('¿Seguro que deseas eliminar esta tarea?')) return;
              btnEliminar.disabled = true;
              msgEdicion.textContent = 'Eliminando...';
              try {
                const resp = await fetch(`http://localhost:3000/api/tareas/${tarea.id}`, {
                  method: 'DELETE'
                });
                const result = await resp.json();
                if (result && result.success) {
                  msgEdicion.textContent = '✅ Eliminada';
                  cargarTareas();
                } else {
                  msgEdicion.textContent = (result && result.message) || 'Error al eliminar.';
                }
              } catch (err) {
                msgEdicion.textContent = 'No se pudo conectar con el servidor.';
              }
              btnEliminar.disabled = false;
            });
            // Botón editar
            const btnEditar = div.querySelector('.btn-editar');
            btnEditar.addEventListener('click', () => {
              // Reemplazar contenido por formulario de edición
              div.innerHTML = `
                <form class="form-editar">
                  <textarea class="edit-desc">${tarea.descripcion}</textarea>
                  <select class="edit-tecnico">
                    ${tecnicos.map(t => `<option value="${t.id}" ${t.id===tarea.id_tecnico?'selected':''}>${t.nombre_usuario}</option>`).join('')}
                  </select>
                  <button type="submit" class="btn-guardar">Save</button>
                  <button type="button" class="btn-cancelar">Cancel</button>
                  <div class="msg-edicion"></div>
                </form>
              `;
              const form = div.querySelector('.form-editar');
              const descInput = div.querySelector('.edit-desc');
              const tecSelect = div.querySelector('.edit-tecnico');
              const msgEdit = div.querySelector('.msg-edicion');
              form.addEventListener('submit', async (e) => {
                e.preventDefault();
                msgEdit.textContent = 'Guardando...';
                try {
                  const resp = await fetch(`http://localhost:3000/api/tareas/${tarea.id}/editar`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ descripcion: descInput.value.trim(), id_tecnico_asignado: tecSelect.value })
                  });
                  const result = await resp.json();
                  if (result && result.success) {
                    msgEdit.textContent = '✅ Guardado';
                    cargarTareas();
                  } else {
                    msgEdit.textContent = (result && result.message) || 'Error al guardar.';
                  }
                } catch (err) {
                  msgEdit.textContent = 'No se pudo conectar con el servidor.';
                }
              });
              div.querySelector('.btn-cancelar').addEventListener('click', cargarTareas);
            });
            tareasList.appendChild(div);
          }
        }
      } else {
        tareasList.innerHTML = '<div class="error">Error al cargar tareas.</div>';
      }
    } catch (err) {
      tareasList.innerHTML = '<div class="error">No se pudo conectar con el servidor.</div>';
    }
  }

  // Asignar nueva tarea
  asignarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    asignarMsg.textContent = '';
    const descripcion = document.getElementById('descripcion').value.trim();
    const id_tecnico_asignado = tecnicoSelect.value;
    if (!descripcion || !id_tecnico_asignado) {
      asignarMsg.textContent = 'Completa todos los campos.';
      return;
    }
    try {
      const resp = await fetch('http://localhost:3000/api/tareas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion, id_tecnico_asignado })
      });
      const data = await resp.json();
      if (data && data.success) {
        asignarMsg.textContent = '✅ Tarea asignada correctamente.';
        asignarForm.reset();
        cargarTareas();
      } else {
        asignarMsg.textContent = (data && data.message) || 'Error al asignar tarea.';
      }
    } catch (err) {
      asignarMsg.textContent = 'No se pudo conectar con el servidor.';
    }
  });

  // Inicializar
  cargarTecnicos();
  cargarTareas();
});
