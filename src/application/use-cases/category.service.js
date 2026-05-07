import categoryEntity from "../../domain/entities/category.entity.js";

export default class categoryService {
    constructor(categoryRepository, mailService) {
        this.categoryRepository = categoryRepository;
        this.mailService = mailService;

    }

    // canAccess (category, currentUser) {
    //     return category.userId === currentUser.id || currentUser.role === 'admin';
    //}
    async createCategory(data) {
        if (!data.name) throw new Error("Name is required");
        const category = new categoryEntity(data);
        return await this.categoryRepository.save(category);
    }

    async getCategoriesByUserId(userId){
        return await this.categoryRepository.findByUserId(userId);
    }

    async getCategoryById(id, currentUser) {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error("Category not found");
        if (!this.canAccess(category, currentUser)) {
            throw new Error("Unauthorized: You do not have access to this category");
        }
        return category;
    }

    async updateCategory(id, data,) {
        const category = await this.categoryRepository.update(id, data);
        if (!category) throw new Error("Category not found");

        return category;
    }

    async deleteCategory(id) {
        const category = await this.categoryRepository.delete(id);
        if (!category) throw new Error("Category not found");
        return { message: "Category deleted successfully" };
    }

    async shareCategoryByEmail(categoryId, targetEmail, currentUserId) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) throw new Error("Category not found");
        
        // RESTRICCIÓN: Solo el dueño puede compartirla
        if (category.userId !== currentUserId) {
            throw new Error("Unauthorized: You can only share your own categories");
        }

        return await this.mailService.sendCategoryEmail(targetEmail, category);
    }
}