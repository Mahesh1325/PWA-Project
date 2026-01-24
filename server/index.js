

const express = require('express');
const cors = require('cors');
const { timeStamp } = require('console');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//Simple API
app.get('/api/data', (req, res) => {
    res.json({message: 'Hello from Backend', timestamp: Date.now()})
});

app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);
});



