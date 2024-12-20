const express = require('express');
const AppDataSource = require('./config/database');
const Routes = require('./routes/routes');

require('dotenv').config();

const app = express();
app.use(express.json());

AppDataSource.initialize()
    .then(() => console.log('Banco de dados conectado!'))
    .catch((error) => console.error('Erro ao conectar ao banco de dados:', error));

app.use('/api', Routes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});