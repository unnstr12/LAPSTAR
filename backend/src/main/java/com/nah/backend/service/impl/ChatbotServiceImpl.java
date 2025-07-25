package com.nah.backend.service.impl;

import com.nah.backend.model.Attribute;
import com.nah.backend.model.Product;
import com.nah.backend.model.ProductAttributeValue;
import com.nah.backend.repository.ProductAttributeValueRepository;
import com.nah.backend.repository.ProductRepository;
import com.nah.backend.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements ChatbotService {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotServiceImpl.class);

    private final ProductRepository productRepository;
    private final ProductAttributeValueRepository productAttributeValueRepository;
    private final RestTemplate restTemplate;

    private static final String GEMINI_API_URL = "http://localhost:8001/ask";

    @Override
    public Map<String, Object> processQuestion(String question) {
        return processQuestion(question, null);
    }

    @Override
    public Map<String, Object> processQuestion(String question, List<String> previousQuestions) {
        try {
            // Lấy thông tin tất cả sản phẩm làm context
            String productContext = getProductContext();

            // Tạo request gửi đến FastAPI Gemini service
            Map<String, Object> geminiRequest = new HashMap<>();
            geminiRequest.put("question", question);
            geminiRequest.put("context", productContext);
            
            // Thêm context từ các câu hỏi trước đó
            if (previousQuestions != null && !previousQuestions.isEmpty()) {
                String conversationContext = buildConversationContext(previousQuestions);
                geminiRequest.put("conversationHistory", conversationContext);
                logger.info("Thêm conversation context với {} câu hỏi trước đó", previousQuestions.size());
            }

            // Gọi FastAPI service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(geminiRequest, headers);

            @SuppressWarnings("unchecked")
            Map<String, String> geminiResponse = restTemplate.postForObject(GEMINI_API_URL, entity, Map.class);

            if (geminiResponse == null || geminiResponse.get("answer") == null) {
                throw new RuntimeException("Không nhận được phản hồi từ AI service");
            }

            String aiAnswer = geminiResponse.get("answer");
            logger.info("AI response gốc: {}", aiAnswer);

            // Extract product IDs từ AI response
            List<Map<String, Object>> relatedProducts = extractProductsFromAIResponse(aiAnswer);
            
            // Cắt bỏ phần PRODUCT_ID khỏi message
            String cleanedAnswer = removeProductIdsFromMessage(aiAnswer);
            logger.info("AI response sau khi cắt ID: {}", cleanedAnswer);

            // Tạo response với câu trả lời đã được làm sạch và link sản phẩm
            Map<String, Object> chatbotResponse = new HashMap<>();
            chatbotResponse.put("answer", cleanedAnswer);
            chatbotResponse.put("relatedProducts", relatedProducts);
            chatbotResponse.put("timestamp", System.currentTimeMillis());
            chatbotResponse.put("totalProductsFound", relatedProducts.size());

            logger.info("Xử lý thành công câu hỏi: '{}', tìm thấy {} sản phẩm liên quan",
                    question, relatedProducts.size());

            return chatbotResponse;

        } catch (Exception e) {
            logger.error("Lỗi khi xử lý câu hỏi: {}", question, e);
            throw new RuntimeException("Không thể xử lý câu hỏi: " + e.getMessage(), e);
        }
    }

    @Override
    public String getProductContext() {
        try {
            // Lấy tất cả sản phẩm đang kích hoạt
            List<Product> enabledProducts = productRepository.findByIsEnabled(true);

            if (enabledProducts.isEmpty()) {
                logger.warn("Không có sản phẩm nào đang được kích hoạt");
                return "Hiện tại không có sản phẩm nào có sẵn.";
            }

            StringBuilder result = new StringBuilder();

            for (Product product : enabledProducts) {
                // Lấy tất cả thuộc tính của sản phẩm
                List<ProductAttributeValue> attributeValues = productAttributeValueRepository
                        .findByProductId(product.getProductId());

                // Tạo map để lưu thuộc tính: tên thuộc tính -> giá trị
                Map<String, String> attributeMap = new HashMap<>();
                for (ProductAttributeValue attributeValue : attributeValues) {
                    Attribute attribute = attributeValue.getAttribute();
                    String attributeName = attribute.getAttributeName();
                    String value = attributeValue.getValue();
                    if (attribute.getAttributeUnit() != null && !attribute.getAttributeUnit().isEmpty()) {
                        value += " " + attribute.getAttributeUnit();
                    }
                    attributeMap.put(attributeName, value);
                }

                // Xây dựng chuỗi thông tin cho sản phẩm (bao gồm ID để hệ thống có thể extract)
                result.append("Sản phẩm ").append(product.getProductName())
                        .append(" (ID: ").append(product.getProductId()).append(")")
                        .append(", thuộc hãng ").append(product.getBrand().getBrandName())
                        .append(", có giá là ").append(product.getPrice()).append(" VNĐ")
                        .append(", có mô tả: ").append(product.getDescription())
                        .append(product.getStockQuantity() > 0 ? ", còn hàng trong kho" : ", hết hàng");

                // Thêm tất cả thuộc tính
                if (!attributeMap.isEmpty()) {
                    result.append(", thông số kỹ thuật: ");
                    for (Map.Entry<String, String> entry : attributeMap.entrySet()) {
                        result.append(entry.getKey()).append(" là ").append(entry.getValue()).append(", ");
                    }
                }

                result.append("; ");
            }

            logger.info("Tạo context cho {} sản phẩm", enabledProducts.size());
            return result.toString();

        } catch (Exception e) {
            logger.error("Lỗi khi tạo product context", e);
            return "Có lỗi khi lấy thông tin sản phẩm.";
        }
    }

    /**
     * Tạo thông tin sản phẩm để trả về frontend
     */
    private Map<String, Object> createProductInfo(Product product) {
        Map<String, Object> productInfo = new HashMap<>();
        productInfo.put("id", product.getProductId());
        productInfo.put("name", product.getProductName());
        productInfo.put("price", product.getPrice());
        productInfo.put("brand", product.getBrand().getBrandName());
        productInfo.put("description", product.getDescription());
        productInfo.put("stockQuantity", product.getStockQuantity());

        // Lấy ảnh đầu tiên của sản phẩm
        String imageUrl = "";
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            imageUrl = product.getImages().get(0).getImageUrl();
        }
        productInfo.put("image", imageUrl);
        productInfo.put("link", "/product-details/" + product.getProductId());

        return productInfo;
    }

    /**
     * Extract product IDs từ AI response và tạo thông tin sản phẩm
     */
    private List<Map<String, Object>> extractProductsFromAIResponse(String aiResponse) {
        List<Map<String, Object>> relatedProducts = new ArrayList<>();
        
        if (aiResponse == null || aiResponse.trim().isEmpty()) {
            return relatedProducts;
        }

        logger.info("Extracting product IDs from AI response");

        // Pattern để tìm [PRODUCT_ID: số]
        Pattern productIdPattern = Pattern.compile("\\[PRODUCT_ID:\\s*(\\d+)\\]", Pattern.CASE_INSENSITIVE);
        Matcher matcher = productIdPattern.matcher(aiResponse);
        
        Set<Integer> foundIds = new HashSet<>();
        
        while (matcher.find()) {
            try {
                Integer productId = Integer.parseInt(matcher.group(1));
                foundIds.add(productId);
                logger.info("Tìm thấy PRODUCT_ID: {}", productId);
            } catch (NumberFormatException e) {
                logger.warn("ID không hợp lệ: {}", matcher.group(1));
            }
        }

        // Fallback: Nếu không tìm thấy PRODUCT_ID, thử tìm theo tên sản phẩm
        if (foundIds.isEmpty()) {
            logger.warn("Không tìm thấy PRODUCT_ID trong AI response, thử fallback tìm theo tên sản phẩm");
            foundIds = findProductsByName(aiResponse);
        }

        logger.info("Tổng cộng tìm thấy {} product IDs: {}", foundIds.size(), foundIds);

        // Lấy thông tin chi tiết của các sản phẩm
        for (Integer productId : foundIds) {
            try {
                Optional<Product> productOpt = productRepository.findById(productId);
                if (productOpt.isPresent() && productOpt.get().getIsEnabled()) {
                    Product product = productOpt.get();
                    
                    Map<String, Object> productInfo = createProductInfo(product);
                    relatedProducts.add(productInfo);
                    
                    logger.info("Thêm sản phẩm: {} (ID: {})", product.getProductName(), product.getProductId());
                } else {
                    logger.warn("Sản phẩm ID {} không tồn tại hoặc đã bị vô hiệu hóa", productId);
                }
            } catch (Exception e) {
                logger.error("Lỗi khi lấy thông tin sản phẩm ID {}: {}", productId, e.getMessage());
            }
        }

        logger.info("Trả về {} sản phẩm liên quan", relatedProducts.size());
        return relatedProducts;
    }

    /**
     * Fallback method: Tìm sản phẩm theo tên khi AI không trả về PRODUCT_ID
     */
    private Set<Integer> findProductsByName(String text) {
        Set<Integer> foundIds = new HashSet<>();
        String textLower = text.toLowerCase();
        
        List<Product> allProducts = productRepository.findByIsEnabled(true);
        
        // Tìm theo tên sản phẩm được đề cập trong text
        for (Product product : allProducts) {
            String productName = product.getProductName().toLowerCase();
            String brandName = product.getBrand().getBrandName().toLowerCase();
            
            // Tìm tên sản phẩm đầy đủ
            if (textLower.contains(productName)) {
                foundIds.add(product.getProductId());
                logger.info("Fallback: Tìm thấy sản phẩm theo tên: {} (ID: {})", product.getProductName(), product.getProductId());
                continue;
            }
            
            // Tìm theo thương hiệu + keyword
            if (textLower.contains(brandName)) {
                String[] keywords = productName.split("[\\s\\-_]+");
                for (String keyword : keywords) {
                    if (keyword.length() > 3 && textLower.contains(keyword)) {
                        foundIds.add(product.getProductId());
                        logger.info("Fallback: Tìm thấy sản phẩm theo thương hiệu + keyword: {} (ID: {})", product.getProductName(), product.getProductId());
                        break;
                    }
                }
            }
        }
        
        // Giới hạn tối đa 4 sản phẩm
        if (foundIds.size() > 4) {
            Set<Integer> limitedIds = foundIds.stream().limit(4).collect(LinkedHashSet::new, LinkedHashSet::add, LinkedHashSet::addAll);
            logger.info("Fallback: Giới hạn từ {} sản phẩm xuống 4 sản phẩm", foundIds.size());
            return limitedIds;
        }
        
        return foundIds;
    }

    /**
     * Cắt bỏ phần [PRODUCT_ID: số] khỏi message
     */
    private String removeProductIdsFromMessage(String message) {
        if (message == null || message.trim().isEmpty()) {
            return message;
        }

        // Pattern để tìm và xóa [PRODUCT_ID: số]
        Pattern productIdPattern = Pattern.compile("\\[PRODUCT_ID:\\s*\\d+\\]\\s*", Pattern.CASE_INSENSITIVE);
        String cleanedMessage = productIdPattern.matcher(message).replaceAll("");
        
        // Xóa các dòng trống thừa
        cleanedMessage = cleanedMessage.replaceAll("\\n\\s*\\n\\s*\\n", "\n\n");
        cleanedMessage = cleanedMessage.trim();
        
        return cleanedMessage;
    }

    /**
     * Xây dựng context từ các câu hỏi trước đó
     */
    private String buildConversationContext(List<String> previousQuestions) {
        if (previousQuestions == null || previousQuestions.isEmpty()) {
            return "";
        }

        StringBuilder context = new StringBuilder();
        context.append("Lịch sử cuộc trò chuyện gần đây:\n");
        
        for (int i = 0; i < previousQuestions.size(); i++) {
            context.append(String.format("Câu hỏi %d: %s\n", i + 1, previousQuestions.get(i)));
        }
        
        return context.toString();
    }
}