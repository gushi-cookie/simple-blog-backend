import { DataTypes, Model, Sequelize } from 'sequelize';


export class User extends Model {
    declare id: number;
    declare nickname: string;
    declare passHash: string;
};


function defineModel(sequelize: Sequelize) {
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true, 
            autoIncrement: true,
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        passHash: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'users',
        timestamps: false,
    });
};


export default {
    defineModel,
};