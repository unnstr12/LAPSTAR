package com.nah.backend.service;

import com.nah.backend.dto.order.OrderDTO;
import com.nah.backend.dto.order.OrderItemDTO;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.*;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    @Value("${invoice.output-dir:./uploads/invoices}")
    private String outputDir;

    public Path generateInvoicePdf(OrderDTO order) throws Exception {

        if (order == null || order.getOrderId() == null) {
            throw new IllegalArgumentException("Order is required");
        }

        Path dir = Paths.get(outputDir);
        Files.createDirectories(dir);

        String fileName = "invoice_" + order.getOrderId() + ".pdf";
        Path path = dir.resolve(fileName);

        try (PDDocument doc = new PDDocument()) {

            PDPage page = new PDPage(PDRectangle.A4);
            doc.addPage(page);

            PDPageContentStream cs = new PDPageContentStream(doc, page);

            PDFont font = loadFont(doc);
            PDFont bold = font;

            float margin = 50;
            float y = 780;

            // ===== LOGO =====
            try (InputStream logoStream = getClass().getResourceAsStream("/images/logo.png")) {
                if (logoStream != null) {
                    PDImageXObject logo = PDImageXObject.createFromByteArray(
                            doc,
                            logoStream.readAllBytes(),
                            "logo"
                    );
                    cs.drawImage(logo, margin, y - 40, 80, 40);
                }
            }

            // ===== HEADER =====
            y = drawText(cs, bold, 18, 150, y-=30, "LAPTOP STAR");
            y = drawText(cs, font, 12, 150, y, "Hotline: 0123 456 789");

            // LINE
            y -= 10;
            cs.moveTo(margin, y);
            cs.lineTo(550, y);
            cs.stroke();

            y -= 20;

            // ===== ORDER INFO =====
            y = drawText(cs, bold, 14, margin, y, "Thông tin đơn hàng");
            y = drawText(cs, font, 12, margin, y, "Mã đơn: " + order.getOrderId());
            y = drawText(cs, font, 12, margin, y, "Ngày: " + formatDate(order.getCreatedAt()));

            y -= 10;

            y = drawText(cs, bold, 14, margin, y, "Khách hàng");
            y = drawText(cs, font, 12, margin, y, "Tên: " + safe(order.getFullName()));
            y = drawText(cs, font, 12, margin, y, "SĐT: " + safe(order.getPhoneNumber()));
            y = drawText(cs, font, 12, margin, y, "Địa chỉ: " + buildAddress(order));

            y -= 20;

            // ===== TABLE =====
            float[] colWidths = {40, 200, 60, 90, 110};
            String[] headers = {"STT", "Sản phẩm", "SL", "Đơn giá", "Thành tiền"};

            y = drawTableRow(cs, bold, 12, margin, y, colWidths, headers);

            int index = 1;
            for (OrderItemDTO item : order.getItems()) {
                String[] row = {
                        String.valueOf(index++),
                        item.getProductName(),
                        String.valueOf(item.getQuantity()),
                        formatCurrency(item.getPrice()),
                        formatCurrency(item.getSubTotal())
                };

                y = drawTableRow(cs, font, 11, margin, y, colWidths, row);
            }

            y -= 20;

            // ===== TOTAL =====
            y = drawRight(cs, bold, 12, 550, y,
                    "Tạm tính: " + formatCurrency(order.getSubtotalAmount()));

            y = drawRight(cs, bold, 12, 550, y,
                    "Giảm giá: " + formatCurrency(order.getDiscountAmount()));

            y = drawRight(cs, bold, 14, 550, y,
                    "TỔNG: " + formatCurrency(order.getTotalAmount()));

            cs.close();
            doc.save(path.toFile());
        }

        return path;
    }

    // ===== FONT =====
    private PDFont loadFont(PDDocument doc) throws Exception {
        try (InputStream is = getClass().getResourceAsStream("/fonts/arial.ttf")) {
            if (is == null) {
                throw new RuntimeException("Missing font: /fonts/arial.ttf");
            }
            return PDType0Font.load(doc, is);
        }
    }

    // ===== TEXT =====
    private float drawText(PDPageContentStream cs, PDFont font, int size,
                           float x, float y, String text) throws Exception {
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(x, y);
        cs.showText(text == null ? "-" : text);
        cs.endText();
        return y - 18;
    }

    // ===== RIGHT TEXT =====
    private float drawRight(PDPageContentStream cs, PDFont font, int size,
                            float x, float y, String text) throws Exception {
        cs.beginText();
        cs.setFont(font, size);
        cs.newLineAtOffset(x - 200, y);
        cs.showText(text);
        cs.endText();
        return y - 18;
    }

    // ===== TABLE =====
    private float drawTableRow(PDPageContentStream cs, PDFont font, int size,
                               float startX, float y,
                               float[] colWidths, String[] texts) throws Exception {

        float x = startX;
        float height = 20;

        for (int i = 0; i < texts.length; i++) {

            cs.addRect(x, y, colWidths[i], height);
            cs.stroke();

            cs.beginText();
            cs.setFont(font, size);
            cs.newLineAtOffset(x + 5, y + 5);

            String text = texts[i] == null ? "-" : texts[i];

            if (text.length() > 25) {
                text = text.substring(0, 22) + "...";
            }

            cs.showText(text);
            cs.endText();

            x += colWidths[i];
        }

        return y - height;
    }

    // ===== FORMAT =====
    private String formatDate(LocalDateTime time) {
        if (time == null) return "-";
        return DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").format(time);
    }

    private String formatCurrency(Double amount) {
        if (amount == null) return "-";
        return String.format("%,.0f VND", amount);
    }

    private String buildAddress(OrderDTO o) {
        return String.join(", ",
                safe(o.getAddressDetail()),
                safe(o.getWard()),
                safe(o.getDistrict()),
                safe(o.getProvince())
        );
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}