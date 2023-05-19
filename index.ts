import express, { Express, Request, Response } from 'express';
import sequelizeConnection from './src/models';
import authenticateToken from './src/middlewares/authenticateToken';


const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


(async () => {
    await sequelizeConnection.sync({ force: true });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})();