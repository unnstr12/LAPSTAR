package com.nah.backend.service.impl;

import com.nah.backend.dto.brand.BrandDTO;
import com.nah.backend.dto.category.CategoryDTO;
import com.nah.backend.dto.product.ProductDTO;
import com.nah.backend.dto.product.ProductImageDTO;
import com.nah.backend.dto.product.ProductAttributeValueDTO;
import com.nah.backend.dto.product.request.CreateProductRequest;
import com.nah.backend.dto.product.request.UpdateProductRequest;
import com.nah.backend.dto.common.PageResponse;
import com.nah.backend.model.Brand;
import com.nah.backend.model.Category;
import com.nah.backend.model.Product;
import com.nah.backend.model.ProductAttributeValue;
import com.nah.backend.repository.BrandRepository;
import com.nah.backend.repository.CategoryRepository;
import com.nah.backend.repository.ProductRepository;
import com.nah.backend.repository.ProductAttributeValueRepository;
import com.nah.backend.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductAttributeValueRepository productAttributeValueRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return mapProductListToDtoListWithAttributes(products);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductDTO> getAllProductsPaged(int pageNo, int pageSize, String sortBy, String sortDir, String searchKeyword) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        PageRequest pageable = PageRequest.of(pageNo, pageSize, sort);
        
        Page<Product> productPage;
        
        if (searchKeyword != null && !searchKeyword.isEmpty()) {
            productPage = productRepository.searchByName(searchKeyword, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }
        
        Page<ProductDTO> productDTOPage = mapProductPageToDtoPageWithAttributes(productPage);
        return PageResponse.fromPage(productDTOPage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCategory(Integer categoryId) {
        List<Product> products = productRepository.findByCategoryCategoryId(categoryId);
        return mapProductListToDtoListWithAttributes(products);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ProductDTO> getProductsByRootCategory(Integer rootCategoryId, int pageNo, int pageSize, 
                                                            String sortBy, String sortDir, String searchKeyword,
                                                            List<Integer> brandIds, List<Integer> categoryIds, 
                                                            BigDecimal minPrice, BigDecimal maxPrice) {
        if (!categoryRepository.existsById(rootCategoryId)) {
            throw new EntityNotFoundException("Không tìm thấy danh mục với id: " + rootCategoryId);
        }
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        PageRequest pageable = PageRequest.of(pageNo, pageSize, sort);
        
        Page<Product> productPage;
        
        // Kiểm tra các điều kiện lọc
        boolean hasFilters = (brandIds != null && !brandIds.isEmpty()) 
                            || (categoryIds != null && !categoryIds.isEmpty()) 
                            || minPrice != null 
                            || maxPrice != null
                            || (searchKeyword != null && !searchKeyword.isEmpty());
                            
        if (hasFilters) {
            // Tìm tất cả sản phẩm theo danh mục gốc và áp dụng bộ lọc
            List<Integer> subCategoryIds = categoryRepository.findSubCategoryIds(rootCategoryId);
            if (subCategoryIds == null) {
                subCategoryIds = new ArrayList<>();
            }
            subCategoryIds.add(rootCategoryId); // Thêm cả danh mục gốc
            
            // Nếu có categoryIds cụ thể thì lọc theo categoryIds
            if (categoryIds != null && !categoryIds.isEmpty()) {
                subCategoryIds.retainAll(categoryIds);
                if (subCategoryIds.isEmpty()) {
                    // Nếu không có danh mục phù hợp sau khi lọc
                    return PageResponse.empty();
                }
            }
            
            // Xây dựng truy vấn dựa trên các điều kiện
            if (searchKeyword != null && !searchKeyword.isEmpty()) {
                productPage = productRepository.findFilteredProducts(
                    subCategoryIds, 
                    brandIds, 
                    minPrice, 
                    maxPrice, 
                    searchKeyword, 
                    pageable
                );
            } else {
                productPage = productRepository.findFilteredProducts(
                    subCategoryIds, 
                    brandIds, 
                    minPrice, 
                    maxPrice, 
                    pageable
                );
            }
        } else {
            // Nếu không có bộ lọc, sử dụng truy vấn hiện có
            if (searchKeyword != null && !searchKeyword.isEmpty()) {
                productPage = productRepository.searchByNameAndRootCategory(rootCategoryId, searchKeyword, pageable);
            } else {
                productPage = productRepository.findByRootCategoryId(rootCategoryId, pageable);
            }
        }
        
        Page<ProductDTO> productDTOPage = mapProductPageToDtoPageWithAttributes(productPage);
        return PageResponse.fromPage(productDTOPage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByBrand(Integer brandId) {
        List<Product> products = productRepository.findByBrandBrandId(brandId);
        return mapProductListToDtoListWithAttributes(products);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + id));
        return convertToDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO createProduct(CreateProductRequest request) {
        // Kiểm tra xem SKU đã tồn tại chưa
        if (productRepository.existsBySku(request.getSku())) {
            throw new IllegalArgumentException("Mã SKU '" + request.getSku() + "' đã tồn tại. Vui lòng sử dụng mã SKU khác.");
        }
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với id: " + request.getCategoryId()));
        
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thương hiệu với id: " + request.getBrandId()));

        Product product = new Product();
        product.setProductName(request.getProductName());
        product.setSku(request.getSku());
        product.setCategory(category);
        product.setBrand(brand);
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStockQuantity(request.getStockQuantity());
        product.setIsEnabled(true);
        
        // Kiểm tra và thiết lập giá khuyến mãi
        if (request.getDiscountPrice() != null) {
            if (request.getDiscountPrice().compareTo(request.getPrice()) >= 0) {
                throw new IllegalArgumentException("Giá khuyến mãi phải nhỏ hơn giá gốc");
            }
            product.setDiscountPrice(request.getDiscountPrice());
        }
        
        Product savedProduct = productRepository.save(product);
        return convertToDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Integer id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + id));

        // Kiểm tra xem SKU đã tồn tại cho sản phẩm khác chưa
        if (!request.getSku().equals(product.getSku()) && productRepository.existsBySkuAndProductIdNot(request.getSku(), id)) {
            throw new IllegalArgumentException("Mã SKU '" + request.getSku() + "' đã tồn tại. Vui lòng sử dụng mã SKU khác.");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy danh mục với id: " + request.getCategoryId()));
        
        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thương hiệu với id: " + request.getBrandId()));

        product.setProductName(request.getProductName());
        product.setSku(request.getSku());
        product.setCategory(category);
        product.setBrand(brand);
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setStockQuantity(request.getStockQuantity());
        product.setIsEnabled(request.getIsEnabled());
        
        // Kiểm tra và thiết lập giá khuyến mãi
        if (request.getDiscountPrice() != null) {
            if (request.getDiscountPrice().compareTo(request.getPrice()) >= 0) {
                throw new IllegalArgumentException("Giá khuyến mãi phải nhỏ hơn giá gốc");
            }
            product.setDiscountPrice(request.getDiscountPrice());
        } else {
            product.setDiscountPrice(null);
            product.setDiscountPercent(null);
        }
        
        product.setUpdatedAt(LocalDateTime.now());
        
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }

    @Override
    @Transactional
    public void enableProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + id));
        
        product.setIsEnabled(true);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void disableProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + id));
        
        product.setIsEnabled(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getLatestProducts() {
        org.springframework.data.domain.PageRequest pageRequest = org.springframework.data.domain.PageRequest.of(0, 8);
        List<Product> latestProducts = productRepository.findLatestProducts(pageRequest);
        return mapProductListToDtoListWithAttributes(latestProducts);
    }
    
    @Override
    @Transactional
    public ProductDTO updateStockQuantity(Integer productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + productId));
        
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Số lượng nhập vào không hợp lệ.");
        }
        
        product.setStockQuantity(product.getStockQuantity() + quantity);
        product.setUpdatedAt(LocalDateTime.now());
        
        Product updatedProduct = productRepository.save(product);
        return convertToDTO(updatedProduct);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsWithSameName(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + productId));
        
        String productName = product.getProductName();
        
        List<Product> similarProducts = productRepository.findByProductNameAndIdNot(productName, productId);
        
        return mapProductListToDtoListWithAttributes(similarProducts);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getRelatedProductsByCategoryAndPrice(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy sản phẩm với id: " + productId));
        
        Integer categoryId = product.getCategory().getCategoryId();
        BigDecimal targetPrice = product.getPrice();
        
        List<Product> relatedProducts = productRepository.findRelatedProductsByCategoryAndPrice(
                categoryId, productId, targetPrice);
        
        return mapProductListToDtoListWithAttributes(relatedProducts);
    }

    private Page<ProductDTO> mapProductPageToDtoPageWithAttributes(Page<Product> productPage) {
        List<Product> products = productPage.getContent();
        if (products.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), productPage.getPageable(), productPage.getTotalElements());
        }

        List<Integer> productIds = products.stream().map(Product::getProductId).collect(Collectors.toList());
        Map<Integer, List<ProductAttributeValue>> attributesMap = productAttributeValueRepository.findByProductIdIn(productIds)
                .stream()
                .collect(Collectors.groupingBy(pav -> pav.getProduct().getProductId()));


        List<ProductDTO> dtos = products.stream()
            .map(product -> convertToDTOInternal(product, attributesMap.getOrDefault(product.getProductId(), Collections.emptyList())))
            .collect(Collectors.toList());
        return new PageImpl<>(dtos, productPage.getPageable(), productPage.getTotalElements());
    }

    private List<ProductDTO> mapProductListToDtoListWithAttributes(List<Product> products) {
        if (products.isEmpty()) {
            return Collections.emptyList();
        }
        List<Integer> productIds = products.stream().map(Product::getProductId).collect(Collectors.toList());
        // Lưu ý: Cần tạo phương thức này trong ProductAttributeValueRepository: List<ProductAttributeValue> findAllByProductProductIdIn(List<Integer> productIds);
        Map<Integer, List<ProductAttributeValue>> attributesMap = productAttributeValueRepository.findByProductIdIn(productIds)
                .stream()
                .collect(Collectors.groupingBy(pav -> pav.getProduct().getProductId()));

        return products.stream()
            .map(product -> convertToDTOInternal(product, attributesMap.getOrDefault(product.getProductId(), Collections.emptyList())))
            .collect(Collectors.toList());
    }
    
    // Phương thức này được sử dụng bởi các hàm lấy một sản phẩm duy nhất
    private ProductDTO convertToDTO(Product product) {
        // Lấy thuộc tính cho một sản phẩm duy nhất
        List<ProductAttributeValue> attributeValues = productAttributeValueRepository.findByProductId(product.getProductId());
        return convertToDTOInternal(product, attributeValues);
    }
    
    // Phương thức nội bộ để chuyển đổi, nhận thuộc tính đã được fetch
    private ProductDTO convertToDTOInternal(Product product, List<ProductAttributeValue> attributeValues) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setSku(product.getSku());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setDiscountPercent(product.getDiscountPercent());
        dto.setDescription(product.getDescription());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setIsEnabled(product.getIsEnabled());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        
        if (product.getBrand() != null) {
            BrandDTO brandDTO = new BrandDTO();
            brandDTO.setBrandId(product.getBrand().getBrandId());
            brandDTO.setBrandName(product.getBrand().getBrandName());
            brandDTO.setDescription(product.getBrand().getDescription());
            brandDTO.setImage(product.getBrand().getImage());
            dto.setBrand(brandDTO);
        }
        
        if (product.getCategory() != null) {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setCategoryId(product.getCategory().getCategoryId());
            categoryDTO.setCategoryName(product.getCategory().getCategoryName());
            if (product.getCategory().getParent() != null) {
                categoryDTO.setParentId(product.getCategory().getParent().getCategoryId());
            }
            dto.setCategory(categoryDTO);
        }
        
        if (product.getImages() != null) {
            List<ProductImageDTO> imageDTOs = product.getImages().stream()
                    .map(image -> {
                        ProductImageDTO imageDTO = new ProductImageDTO();
                        imageDTO.setProductImageId(image.getProductImageId());
                        imageDTO.setImageUrl(image.getImageUrl());
                        return imageDTO;
                    })
                    .collect(Collectors.toList());
            dto.setImages(imageDTOs);
        }

        // Sử dụng attributeValues đã được truyền vào
        if (attributeValues != null && !attributeValues.isEmpty()) {
            List<ProductAttributeValueDTO> attributeValueDTOs = new ArrayList<>();
            for (ProductAttributeValue attributeValue : attributeValues) {
                ProductAttributeValueDTO attributeValueDTO = new ProductAttributeValueDTO();
                attributeValueDTO.setProductAttributeValueId(attributeValue.getProductAttributeValueId());
                if (attributeValue.getAttribute() != null) {
                    attributeValueDTO.setAttributeName(attributeValue.getAttribute().getAttributeName());
                    attributeValueDTO.setAttributeUnit(attributeValue.getAttribute().getAttributeUnit());
                }
                attributeValueDTO.setValue(attributeValue.getValue());
                attributeValueDTOs.add(attributeValueDTO);
            }
            dto.setAttributeValues(attributeValueDTOs);
        } else {
            dto.setAttributeValues(Collections.emptyList());
        }
        
        return dto;
    }
}