const express = require('express');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

const clientBuildPath = path.join(__dirname, '../client/dist');

app.use(express.static(clientBuildPath));

app.get('*', (_, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});