import categoryService from '../../src/application/use-cases/category.service.js';
import {jest} from '@jest/globals';

const mockcategoryRepository = { 
save: jest.fn(), 
findByUserId: jest.fn() 
};

describe('CategoryService - Pruebas Unitarias', () => {
let categoryService;

beforeEach(() => {
jest.clearAllMocks();
categoryService = new CategoryService(mockcategoryRepository);
});
test('Crear: debería crear y guardar una nota correctamente', async () => {
const data = { name: 'Categoría 1', content: 'Info', userId: 'user_123' };
mockcategoryRepository.save.mockResolvedValue({ id: 1, ...data });

const result = await categoryService.createCategory(data);

expect(mockcategoryRepository.save).toHaveBeenCalledTimes(1);
expect(result.name).toBe('Categoría 1');
expect(result.userId).toBe('user_123');
});

test('Crear: debería fallar al crear una nota sin título', async () => {
const data = { content: 'Sin titulo' };
await expect(categoryService.createCategory(data)).rejects.toThrow("El nombre es obligatorio");
});

test('Leer: debería devolver las notas de un usuario específico', async () => {
const mockcategories = [{ name: 'Categoría 1' }, { name: 'Categoría 2' }];
mockcategoryRepository.findByUserId.mockResolvedValue(mockcategories);

const result = await categoryService.getCategoriesByUser('user_123');

expect(mockcategoryRepository.findByUserId).toHaveBeenCalledWith('user_123');
expect(result.length).toBe(2);
});
});