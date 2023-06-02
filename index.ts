import express, { Express, Request, Response } from 'express';
import { sequelizeConnection, checkDatabase } from './src/models';
import authRouter from './src/routes/auth';
import blogPostRouter from './src/routes/blog-post';
import postsListRouter from './src/routes/posts-list';
import cdnRouter from './src/routes/cdn';
import handleErrors from './src/middlewares/handleErrors';


const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRouter);
app.use(blogPostRouter);
app.use(postsListRouter);
app.use(cdnRouter);
app.use(handleErrors);


(async () => {
    await checkDatabase(); 
    await sequelizeConnection.sync({ force: false });

    app.listen(port, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });
})();