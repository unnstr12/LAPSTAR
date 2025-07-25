import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../../utils/axiosConfig';
import './chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    
    // Khởi tạo messages từ localStorage hoặc message mặc định
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatbot_messages');
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Chuyển đổi timestamp string thành Date object
                return parsed.map(msg => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            } catch (error) {
                console.error('Lỗi khi parse messages từ localStorage:', error);
            }
        }
        
        // Message mặc định nếu không có dữ liệu trong localStorage
        return [
            {
                id: 1,
                text: "Xin chào! Tôi là trợ lý ảo của LapVN. Tôi có thể giúp bạn tìm hiểu về các sản phẩm laptop. Bạn có câu hỏi gì không?",
                isBot: true,
                timestamp: new Date()
            }
        ];
    });

    // Lưu messages vào localStorage
    const saveMessagesToStorage = (newMessages) => {
        try {
            localStorage.setItem('chatbot_messages', JSON.stringify(newMessages));
        } catch (error) {
            console.error('Lỗi khi lưu messages vào localStorage:', error);
        }
    };

    // Cuộn xuống tin nhắn mới nhất
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Xóa lịch sử chat
    const clearChatHistory = () => {
        const defaultMessage = {
            id: 1,
            text: "Xin chào! Tôi là trợ lý ảo của LapVN. Tôi có thể giúp bạn tìm hiểu về các sản phẩm laptop. Bạn có câu hỏi gì không?",
            isBot: true,
            timestamp: new Date()
        };
        setMessages([defaultMessage]);
        saveMessagesToStorage([defaultMessage]);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Lưu messages vào localStorage mỗi khi messages thay đổi
    useEffect(() => {
        saveMessagesToStorage(messages);
    }, [messages]);

    // Gửi tin nhắn
    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputMessage;
        setInputMessage('');
        setIsLoading(true);

        try {
            // Lấy 5 câu hỏi gần nhất (bao gồm câu hiện tại)
            const recentMessages = [...messages, userMessage];
            const last5Questions = recentMessages
                .filter(msg => !msg.isBot) // Chỉ lấy tin nhắn của user
                .slice(-5) // Lấy 5 tin nhắn cuối
                .map(msg => msg.text);

            console.log('Sending context with last 5 questions:', last5Questions);

            const response = await axios.post('/api/chatbot/ask', {
                question: currentInput,
                previousQuestions: last5Questions
            });

            console.log('Chatbot response:', response.data);

            const botResponse = {
                id: Date.now() + 1,
                text: response.data.data.answer,
                isBot: true,
                timestamp: new Date(),
                relatedProducts: response.data.data.relatedProducts || []
            };

            console.log('Related products:', botResponse.relatedProducts);

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Lỗi khi gửi tin nhắn:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Xin lỗi, tôi đang gặp sự cố kỹ thuật. Vui lòng thử lại sau.",
                isBot: true,
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Xử lý nhấn Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Format thời gian
    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Format giá tiền
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Hàm tạo đường dẫn ảnh đầy đủ (tham khảo từ product-page.js)
    const getImageUrl = (imageUrl) => {
        const baseUrl = 'http://localhost:8082';
        // Nếu không có ảnh, trả về ảnh mặc định
        if (!imageUrl) {
            return null;
        }

        // Nếu imageUrl bắt đầu bằng dấu /, bỏ dấu / để tránh lặp
        const imagePath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

        return `${baseUrl}/${imagePath}`;
    };

    // Render text với markdown formatting
    const renderMessageText = (text) => {
        if (!text) return text;

        // Tách text thành các dòng để xử lý
        const lines = text.split('\n');
        let formattedText = '';
        let inList = false;
        let listItems = [];
        let paragraphText = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line === '') {
                // Dòng trống - kết thúc paragraph hiện tại
                if (paragraphText.trim()) {
                    formattedText += `<p>${paragraphText.trim()}</p>`;
                    paragraphText = '';
                }
                // Kết thúc list nếu đang trong list
                if (inList) {
                    formattedText += `<ul class="message-list">${listItems.join('')}</ul>`;
                    listItems = [];
                    inList = false;
                }
                continue;
            }

            // Xử lý tiêu đề ##
            if (line.startsWith('## ')) {
                // Kết thúc paragraph và list trước khi thêm tiêu đề
                if (paragraphText.trim()) {
                    formattedText += `<p>${paragraphText.trim()}</p>`;
                    paragraphText = '';
                }
                if (inList) {
                    formattedText += `<ul class="message-list">${listItems.join('')}</ul>`;
                    listItems = [];
                    inList = false;
                }
                const title = line.substring(3);
                formattedText += `<h3 class="message-heading">${title}</h3>`;
                continue;
            }

            // Xử lý danh sách - hỗ trợ cả dấu - và *
            if (line.startsWith('- ') || line.startsWith('* ')) {
                // Kết thúc paragraph trước khi bắt đầu list
                if (paragraphText.trim()) {
                    formattedText += `<p>${paragraphText.trim()}</p>`;
                    paragraphText = '';
                }
                const item = line.substring(2);
                // Xử lý text in đậm trong item
                const formattedItem = item.replace(/\*\*(.*?)\*\*/g, '<strong class="message-bold">$1</strong>');
                listItems.push(`<li class="message-list-item">${formattedItem}</li>`);
                inList = true;
                continue;
            }

            // Xử lý thông số kỹ thuật với dấu +
            if (line.startsWith('+ ')) {
                // Kết thúc paragraph trước khi bắt đầu list
                if (paragraphText.trim()) {
                    formattedText += `<p>${paragraphText.trim()}</p>`;
                    paragraphText = '';
                }
                const item = line.substring(2);
                // Xử lý text in đậm trong item
                const formattedItem = item.replace(/\*\*(.*?)\*\*/g, '<strong class="message-bold">$1</strong>');
                listItems.push(`<li class="message-list-item spec-item ml-2">${formattedItem}</li>`);
                inList = true;
                continue;
            }

            // Xử lý trường hợp đặc biệt: dòng bắt đầu bằng tên sản phẩm in đậm (không có dấu -)
            // Pattern: **Tên sản phẩm**: Mô tả...
            if (line.match(/^\*\*[^*]+\*\*:/)) {
                // Kết thúc paragraph trước khi bắt đầu list
                if (paragraphText.trim()) {
                    formattedText += `<p>${paragraphText.trim()}</p>`;
                    paragraphText = '';
                }
                // Xử lý text in đậm trong item
                const formattedItem = line.replace(/\*\*(.*?)\*\*/g, '<strong class="message-bold">$1</strong>');
                listItems.push(`<li class="message-list-item">${formattedItem}</li>`);
                inList = true;
                continue;
            }

            // Xử lý trường hợp dòng bắt đầu bằng tên thương hiệu + model (không có ** và :)
            // Pattern: MSI GF63 Thin: Mô tả... hoặc Dell G15: Mô tả...
            if (line.match(/^[A-Z][a-zA-Z0-9\s]+:/)) {
                // Kết thúc paragraph trước khi bắt đầu list
                if (paragraphText.trim()) {
                    formattedText += `<p>${paragraphText.trim()}</p>`;
                    paragraphText = '';
                }
                // Tách tên sản phẩm và mô tả
                const colonIndex = line.indexOf(':');
                const productName = line.substring(0, colonIndex).trim();
                const description = line.substring(colonIndex + 1).trim();
                const formattedItem = `<strong class="message-bold">${productName}</strong>: ${description}`;
                listItems.push(`<li class="message-list-item">${formattedItem}</li>`);
                inList = true;
                continue;
            }
            
            // Dòng text thường
            if (inList) {
                formattedText += `<ul class="message-list">${listItems.join('')}</ul>`;
                listItems = [];
                inList = false;
            }
            
            // Xử lý text in đậm và thêm vào paragraph
            const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="message-bold">$1</strong>');
            paragraphText += (paragraphText ? ' ' : '') + formattedLine;
        }

        // Kết thúc paragraph cuối cùng
        if (paragraphText.trim()) {
            formattedText += `<p>${paragraphText.trim()}</p>`;
        }

        // Kết thúc list nếu text kết thúc bằng list
        if (inList) {
            formattedText += `<ul class="message-list">${listItems.join('')}</ul>`;
        }

        return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
    };

    // Render sản phẩm liên quan
    const renderRelatedProducts = (products) => {
        if (!products || products.length === 0) return null;

        return (
            <div className="related-products">
                <div className="related-products-title">
                    <i className="fas fa-laptop"></i>
                    Sản phẩm liên quan:
                </div>
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            <a 
                                href={product.link} 
                                className="product-card-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="chatbot-product-image">
                                    <img 
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                    />
                                </div>
                                <div className="product-info">
                                    <h4 className="chatbot-product-name">{product.name}</h4>
                                    <p className="chatbot-product-brand">{product.brand}</p>
                                    <p className="chatbot-product-price">{formatPrice(product.price)}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {/* Nút mở chatbot */}
            <div 
                className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`}
                onClick={() => setIsOpen(true)}
            >
                <i className="fas fa-comments"></i>
                <span className="toggle-text">Hỗ trợ</span>
            </div>

            {/* Cửa sổ chat */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="chatbot-header">
                    <div className="header-info">
                        <div className="bot-avatar">
                            <i className="fas fa-laptop"></i>
                        </div>
                        <div className="bot-details">
                            <h3>Trợ lý LapVN</h3>
                            <span className="status">
                                <span className="status-dot"></span>
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="action-btn"
                            onClick={clearChatHistory}
                            title="Xóa lịch sử chat"
                        >
                            <i className="fas fa-trash-alt"></i>
                        </button>
                        <button 
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                            title="Đóng chat"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* Tin nhắn */}
                <div className="chatbot-messages">
                    {messages.map(message => (
                        <div 
                            key={message.id} 
                            className={`message ${message.isBot ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}
                        >
                            <div className="message-content">
                                <div className="message-text">
                                    {message.isBot ? renderMessageText(message.text) : message.text}
                                </div>
                                {message.relatedProducts && renderRelatedProducts(message.relatedProducts)}
                                <div className="message-time">
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="message bot">
                            <div className="message-content">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="chatbot-input">
                    <div className="input-container">
                        <textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Nhập câu hỏi của bạn..."
                            disabled={isLoading}
                            rows="1"
                        />
                        <button 
                            onClick={sendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="send-btn"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div className="input-hint">
                        Nhấn Enter để gửi, Shift + Enter để xuống dòng
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot; 