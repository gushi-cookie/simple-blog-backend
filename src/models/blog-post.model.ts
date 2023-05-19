import { DataTypes, Model, Sequelize } from 'sequelize';


export class BlogPost extends Model {
    declare id: number;
    declare userId: number;
    declare message: string;
    declare date: Date;
};


function defineModel(sequelize: Sequelize) {
    BlogPost.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'posts',
        timestamps: false,
    });
};


export default {
    defineModel,
};