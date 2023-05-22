import { DataTypes, Model, Sequelize } from 'sequelize';


export class File extends Model {
    declare id: number;
    declare postId: number;
    declare name: string;
    declare extension: string;
    declare data: Buffer;
};


function defineModel(sequelize: Sequelize) {
    File.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        extension: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        data: {
            type: DataTypes.BLOB('long'),
            allowNull: false,
        },
    }, {
        sequelize,
        tableName: 'files',
        timestamps: false,
    });
};


export default {
    defineModel,
};