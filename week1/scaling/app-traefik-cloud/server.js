const express = require('express');
const app = express();


const PORT = process.env.PORT || 4000; 


app.get('/', (req, res) => { 
    res.send(`Handled by worker: ${process.pid}\n`);    
}       
);

app.listen(PORT, () => {
    console.log(`Server running on port 4000 - PID: ${process.pid}`);
});