import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize';
import UserModel, { User } from './user.model';
import BlogPostModel, { BlogPost } from './blog-post.model';


const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPort = Number(process.env.DB_PORT);
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT as Dialect;

const sequelizeConnection = new Sequelize({
    database: dbName, 
    username: dbUser,
    password: dbPass,
    port: dbPort,
    host: dbHost,
    dialect: dbDialect,
});

UserModel.defineModel(sequelizeConnection);
BlogPostModel.defineModel(sequelizeConnection);
BlogPost.belongsTo(User, { foreignKey: 'userId' });


export default sequelizeConnection;