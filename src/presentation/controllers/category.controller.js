import { use } from "react";

export default class categoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req, res) => {
        const data = { ...req.body, userId: req.user.id };
            try {
                const category = await this.categoryService.createCategory(data);
                res.status(201).json(category); // 201 Created
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    getCategoriesByUserId = async (req, res) => {
        const userId = req.user.id;
        try {
            const categories = await this.categoryService.getCategoriesByUserId(userId);
            res.status(200).json(categories); // 200 OK
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    updateCategory = async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        if (req.file) data.imageUrl = '/uploads/' + req.file.filename;
        
        try {
            const category = await this.categoryService.updateCategory(id, data);
            res.status(200).json(category);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    deleteCategory = async (req, res) => {
        const { id } = req.params;
        try {
            const result = await this.categoryService.deleteCategory(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    shareCategory = async (req, res) => {
        const { id } = req.params;
        const { email } = req.body;
        const currentUserId = req.user.id;

        if (!email) return res.status(400).json({ error: "Target email is required" });

        try {
            const result = await this.categoryService.shareCategoryByEmail(id, email, currentUserId);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}