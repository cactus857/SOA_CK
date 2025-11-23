/* eslint-disable */

// Chatbot functionality
const chatbotContainer = document.getElementById('chatbot-container');
const messagesDiv = document.getElementById('chatbot-messages');
const inputField = document.getElementById('chatbot-input');
const sendBtn = document.getElementById('send-message');
const closeBtn = document.getElementById('close-chatbot');
const resizeHandleTL = document.querySelector('.chatbot-resize-handle-tl');

if (chatbotContainer) {
    console.log('🤖 Chatbot initialized');

    // Resizable functionality - Top Left corner
    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;

    resizeHandleTL.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = chatbotContainer.offsetWidth;
        startHeight = chatbotContainer.offsetHeight;
        startLeft = chatbotContainer.offsetLeft;
        startTop = chatbotContainer.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // Kéo từ trái: width tăng, left giảm
        const newLeft = startLeft + deltaX;
        const newWidth = startWidth - deltaX;

        // Kéo từ trên: height tăng, top giảm
        const newTop = startTop + deltaY;
        const newHeight = startHeight - deltaY;

        // Không có giới hạn kích thước
        if (newWidth > 0) {
            chatbotContainer.style.left = newLeft + 'px';
            chatbotContainer.style.width = newWidth + 'px';
        }

        if (newHeight > 0) {
            chatbotContainer.style.top = newTop + 'px';
            chatbotContainer.style.height = newHeight + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });

    // Close chatbot
    closeBtn.addEventListener('click', () => {
        chatbotContainer.style.display = 'none';
    });

    // Open chatbot
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && chatbotContainer.style.display === 'none') {
            chatbotContainer.style.display = 'flex';
        }
    });

    // Send message function
    const sendMessage = async () => {
        const message = inputField.value.trim();
        if (!message) return;

        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user';
        userMsg.textContent = message;
        messagesDiv.appendChild(userMsg);
        inputField.value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Show loading
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message loading';
        loadingMsg.textContent = 'Đang trả lời...';
        messagesDiv.appendChild(loadingMsg);
        sendBtn.disabled = true;

        try {
            const response = await fetch('/api/v1/chatbot/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            // Remove loading message
            messagesDiv.removeChild(loadingMsg);

            if (data.status === 'success') {
                // Add bot reply
                const botMsg = document.createElement('div');
                botMsg.className = 'message bot';
                botMsg.textContent = data.data.reply;
                messagesDiv.appendChild(botMsg);
            } else {
                // Error response
                const errorMsg = document.createElement('div');
                errorMsg.className = 'message bot';
                errorMsg.textContent = `Lỗi: ${data.message || 'Có sự cố xảy ra'}`;
                messagesDiv.appendChild(errorMsg);
            }

            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        } catch (err) {
            // Remove loading message
            if (messagesDiv.contains(loadingMsg)) {
                messagesDiv.removeChild(loadingMsg);
            }

            // Add error message
            const errorMsg = document.createElement('div');
            errorMsg.className = 'message bot';
            errorMsg.textContent = 'Xin lỗi, tôi gặp lỗi. Vui lòng thử lại.';
            messagesDiv.appendChild(errorMsg);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            console.error('Chatbot error:', err);
        } finally {
            sendBtn.disabled = false;
            inputField.focus();
        }
    };

    // Send button click
    sendBtn.addEventListener('click', sendMessage);

    // Enter key to send
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Add welcome message in Vietnamese
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'message bot';
    welcomeMsg.textContent = 'Xin chào! 👋 Tôi là trợ lý Natours của bạn. Hãy hỏi tôi bất cứ điều gì về các tour du lịch, giá cả hoặc đặt phòng!';
    messagesDiv.appendChild(welcomeMsg);

    console.log('✅ Chatbot ready');
}