import NoteModel from  "./category.model.js";

export default class CategoryMongoRepository { 
    async save(categoryEntity) {
        const category = new CategoryModel({
            title: categoryEntity.title,
            content: categoryEntity.content,
            imageUrl: categoryEntity.imageUrl,
            isPrivate: categoryEntity.isPrivate,
            password: categoryEntity.password,
            userId: categoryEntity.userId
        });
        const savedCategory = await category.save();
        return savedCategory.toObject();
    }

    async findByUserId(userId) {
       return await CategoryModel.find({ userId });
    }
}