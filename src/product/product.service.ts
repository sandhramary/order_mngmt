import { ProductQueryDto } from "./product.dto.js"
import { productRepository } from "./product.repository.js"

export const productService = {
    async getProducts(query: ProductQueryDto) {
        return productRepository.getProducts(query)
    }
}