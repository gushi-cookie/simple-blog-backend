import express, { Express, Request, Response } from 'express';
import sequelizeConnection from './src/models';
import authRouter from './src/routes/auth';
import blogPostRouter from './src/routes/blog-post';


const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRouter);
app.use(blogPostRouter);


(async () => {
    await sequelizeConnection.sync({ force: true });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})();