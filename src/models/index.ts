import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize';
import UserModel, { User } from './user.model';
import BlogPostModel, { BlogPost } from './blog-post.model';
import FileModel, { File } from './file.model';


const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPort = Number(process.env.DB_PORT);
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbDialect = process.env.DB_DIALECT as Dialect;

export const sequelizeConnection = new Sequelize({
    database: dbName, 
    username: dbUser,
    password: dbPass,
    port: dbPort,
    host: dbHost,
    dialect: dbDialect,
});

UserModel.defineModel(sequelizeConnection);
BlogPostModel.defineModel(sequelizeConnection);
FileModel.defineModel(sequelizeConnection);
BlogPost.belongsTo(User, { foreignKey: 'userId' });
File.belongsTo(BlogPost, { foreignKey: 'postId' });


export async function checkDatabase() {
    let connection = new Sequelize({
        username: dbUser,
        password: dbPass,
        port: dbPort,
        host: dbHost,
        dialect: dbDialect,
    });

    await connection.sync();
    
    try {
        await connection.query(`CREATE DATABASE ${dbName}`);
    } catch(error: any) {
        if(error.original.code !== '42P04') throw error;
    }

    await connection.close();
};