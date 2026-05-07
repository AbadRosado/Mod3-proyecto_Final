import { DataTypes } from "sequelize";
import sequelize from "./connection.js";

const categoryModel = sequelize.define("Category", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: true });  

export default class CategoryMySQLRepository {
    async save(categoryEntity) {
          const category = await categoryModel.create({
            name: categoryEntity.name,
            description: categoryEntity.description,
            userId: categoryEntity.userId
        });
        return category.toJSON();
    }
    
    async findByUserId(userId) {
        return await categoryModel.findAll({ where: { userId } });
    }

    async findById(id) {
        const category = await categoryModel.findByPk(id);
        return category ? category.toJSON() : null;
    }

    async update(id, data) {
        const category = await categoryModel.findByPk(id);
        if (!category) return null;
        await category.update(data);
        return category.toJSON();
    }

    async delete(id) {
        const category = await categoryModel.findByPk(id);
        if (!category) return null;
        await category.destroy();
        return true;
    }
}