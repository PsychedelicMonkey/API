import express, { Application } from 'express';

const app: Application = express();

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
