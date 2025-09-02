# Aeronautical Maintenance Management System- DevSky

## Description
This project develops an information system that enables the management, planning, and control of aircraft maintenance activities, optimizing resources, ensuring operational safety, and facilitating decision-making. This is due to the fact that aeronautical organizations currently face difficulties in maintenance control due to manual and dispersed processes, which generate risks to operational safety, loss of information, planning delays, and a lack of traceability. A technological solution is needed to centralize, organize, and automate aircraft maintenance management.

frontend deployment:
http://devsky-front.vercel.app/

backend deployment:
https://devsky-back.vercel.app/


## Project Information
**Name**: DevSky
**Clan**: Lovelace y Hopper
**Members**:
- Salome Gonzalez Gomez 
- Anamaría Carmona Muñoz 
- Jeronimo Parra 
- David Estevan Rendon 
- Juan Pablo Rojas 

## Project Structure
```
DevSky/
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tareas.js
│   ├── db.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── inspector.html
│   ├── login.html
│   ├── tecnico.html
│   ├── css/
│   │   ├──styles.css
│   └── js/
│   │   ├──inspector.js
│   │   ├──login.js
│   │   ├──tecnico.js
├── database/
│   ├── schema.sql           
├── docs/
│   ├── Modelo relacional
│   ├── diagrama de componentes 
│   ├── diagrama de navegacion 
│   └──MER
└── README.md
```
## Technologies Used
- **Backend**: Node.js with Express.js
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript 
- **API Testing**: Postman
- **Database Design**: Draw.io

### Installation
1. Clone the repository:
    ```bash
    git clone ´link repositorio´ 
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Configure the database:
   - Create MySQL database:´GMA´ 
   - Run the schema.sql file
4. Start the server:
   ```bash
   node server.js
   ```
5. Open frontend/index.html in your browser

### Entity relationship model (MER)

<img src="Entity relationship model.jpeg" alt="Entity relationship model (MER)" />

### Entity relationship diagram (DER)

<img src="Entity relationship diagram.jpeg" alt="Entity relationship diagram (DER)" />

### Component diagram

<img src="Component diagram.jpeg" alt="Component diagram" />

### Navigation diagram

<img src="Navigation diagram.jpeg" alt="Navigation diagram" />




