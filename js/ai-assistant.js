// AI助手功能实现
class AIAssistant {
    constructor() {
        this.assistantButton = null;
        this.chatWindow = null;
        this.isOpen = false;
        this.messages = [];
        this.apiKey = ''; // 将从loadAPIKey方法中加载
        this.selectedModel = 'DeepSeek'; // 默认使用DeepSeek模型
        this.initialize();
    }

    // 初始化AI助手
    initialize() {
        console.log('AI助手初始化开始...');
        // 直接执行初始化代码，因为脚本是在页面底部加载的
        // DOM已经加载完成
        try {
            this.createAssistantButton();
            this.createChatWindow();
            this.setupEventListeners();
            this.loadAPIKey();
            this.loadSelectedModel(); // 加载选择的模型
            console.log('AI助手初始化完成');
        } catch (error) {
            console.error('AI助手初始化失败:', error);
        }
    }

    // 创建悬浮AI助手按钮
    createAssistantButton() {
        console.log('创建AI助手按钮...');
        // 检查按钮是否已存在
        if (document.getElementById('ai-assistant-button')) {
            console.log('AI助手按钮已存在');
            return;
        }

        this.assistantButton = document.createElement('div');
        this.assistantButton.id = 'ai-assistant-button';
        this.assistantButton.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--color-primary, #3b82f6), var(--color-secondary, #6366f1));
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transition: all 0.3s ease;
            display: block !important;
            padding: 0;
            margin: 0;
            border: none;
            outline: none;
        `;
        
        // 创建内部容器来确保图标完美居中
        const iconContainer = document.createElement('div');
        iconContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
        `;
        
        // 创建图标元素
        const icon = document.createElement('i');
        icon.className = 'fas fa-robot';
        icon.style.cssText = `
            font-size: 24px;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            margin: 0;
            padding: 0;
        `;
        
        // 组装按钮结构
        iconContainer.appendChild(icon);
        this.assistantButton.appendChild(iconContainer);

        document.body.appendChild(this.assistantButton);
        console.log('AI助手按钮创建完成');
    }

    // 创建聊天窗口
    createChatWindow() {
        // 检查聊天窗口是否已存在
        if (document.getElementById('ai-chat-window')) return;

        this.chatWindow = document.createElement('div');
        this.chatWindow.id = 'ai-chat-window';
        this.chatWindow.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 2rem;
            width: min(600px, 95vw);
            min-width: 320px;
            height: min(700px, 85vh);
            min-height: 400px;
            background-color: var(--color-background);
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            display: none;
            flex-direction: column;
            font-family: var(--font-sans);
            resize: both;
            overflow: hidden;
        `;

        // 聊天窗口头部
        const chatHeader = document.createElement('div');
        chatHeader.className = 'chat-header';
        chatHeader.style.cssText = `
            padding: 1.5rem;
            background-color: var(--color-primary);
            color: white;
            border-top-left-radius: 15px;
            border-top-right-radius: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        chatHeader.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-robot" style="font-size: 1.5rem;"></i>
                <div>
                    <h3 style="margin: 0; font-family: var(--font-display);">C++学习助手</h3>
                    <div style="font-size: 0.7rem; opacity: 0.8;">拖拽右下角可调整窗口大小</div>
                </div>
            </div>
            <div id="chat-close" style="cursor: pointer; font-size: 1.5rem;">&times;</div>
        `;

        // 聊天内容区域
        const chatContent = document.createElement('div');
        chatContent.id = 'chat-content';
        chatContent.style.cssText = `
            flex: 1;
            padding: 1.5rem;
            overflow-y: auto;
            overflow-x: auto;
            background-color: var(--color-light);
            word-wrap: break-word;
            line-height: 1.6;
        `;

        // 默认欢迎消息
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'ai-message';
        welcomeMessage.style.cssText = `
            margin-bottom: 1rem;
            display: flex;
            gap: 0.75rem;
        `;
        welcomeMessage.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-robot"></i>
            </div>
            <div style="background-color: var(--color-background); padding: 1rem; border-radius: 15px; max-width: 75%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <div style="margin: 0; color: var(--color-text);">
                    <p style="margin: 0 0 0.75rem 0;">👋 <strong>您好！我是您的C++学习导师</strong></p>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <button class="quick-question-btn" data-question="什么是C++？">🔤 C++简介</button>
                        <button class="quick-question-btn" data-question="如何学习面向对象？">🏗️ 面向对象</button>
                        <button class="quick-question-btn" data-question="STL容器有哪些？">📦 STL容器</button>
                        <button class="quick-question-btn" data-question="如何管理内存？">🧠 内存管理</button>
                    </div>
                    <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-light);">💡 点击上方话题快速开始，或直接输入您的问题</p>
                </div>
            </div>
        `;
        chatContent.appendChild(welcomeMessage);

        // 添加快速问题按钮的样式和事件
        const quickBtnStyle = document.createElement('style');
        quickBtnStyle.textContent = `
            .quick-question-btn {
                background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
                color: white;
                border: none;
                padding: 0.4rem 0.8rem;
                border-radius: 15px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            .quick-question-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
        `;
        document.head.appendChild(quickBtnStyle);

        // 提示消息 - 告知用户已配置好DeepSeek API
        const tipMessage = document.createElement('div');
        tipMessage.className = 'ai-message';
        tipMessage.style.cssText = `
            margin-bottom: 1rem;
            display: flex;
            gap: 0.75rem;
        `;
        tipMessage.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-robot"></i>
            </div>
            <div style="background-color: var(--color-background); padding: 1rem; border-radius: 15px; max-width: 75%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <p style="margin: 0; color: var(--color-text);">💡 小贴士：我已配置好DeepSeek AI，您可以直接提问，无需设置任何API密钥！</p>
            </div>
        `;
        chatContent.appendChild(tipMessage);

        // 提示消息 - 告知用户可以提问的内容
        const helpMessage = document.createElement('div');
        helpMessage.className = 'ai-message';
        helpMessage.style.cssText = `
            margin-bottom: 1rem;
            display: flex;
            gap: 0.75rem;
        `;
        helpMessage.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-robot"></i>
            </div>
            <div style="background-color: var(--color-background); padding: 1rem; border-radius: 15px; max-width: 75%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <p style="margin: 0; color: var(--color-text);">您可以问我关于C++语法、面向对象编程、STL、内存管理等方面的问题。</p>
            </div>
        `;
        chatContent.appendChild(helpMessage);

        // 输入区域
        const chatInput = document.createElement('div');
        chatInput.className = 'chat-input';
        chatInput.style.cssText = `
            padding: 1rem;
            background-color: var(--color-background);
            border-top: 1px solid var(--color-border);
            display: flex;
            gap: 0.75rem;
            align-items: flex-end;
        `;
        chatInput.innerHTML = `
            <textarea id="message-input" placeholder="输入您的问题...&#10;提示：Enter发送，Shift+Enter换行" style="
                flex: 1;
                padding: 0.75rem 1rem;
                border: 1px solid var(--color-border);
                border-radius: 15px;
                font-family: var(--font-sans);
                font-size: 1rem;
                transition: border-color 0.3s ease;
                background-color: var(--color-background);
                color: var(--color-text);
                resize: none;
                min-height: 40px;
                max-height: 120px;
                overflow-y: auto;
                line-height: 1.4;
            "></textarea>
            <button id="send-button" style="
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: var(--color-secondary);
                color: white;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-paper-plane"></i>
            </button>
        `;

        // 添加API密钥配置按钮
        const apiConfigButton = document.createElement('button');
        apiConfigButton.id = 'api-config-button';
        apiConfigButton.innerHTML = '<i class="fas fa-cog"></i>';
        apiConfigButton.style.cssText = `
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
        `;
        chatHeader.appendChild(apiConfigButton);

        // 添加到聊天窗口
        this.chatWindow.appendChild(chatHeader);
        this.chatWindow.appendChild(chatContent);
        this.chatWindow.appendChild(chatInput);

        document.body.appendChild(this.chatWindow);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 助手按钮点击事件
        if (this.assistantButton) {
            this.assistantButton.addEventListener('click', () => {
                this.toggleChatWindow();
            });
        }

        // 聊天窗口内的事件监听器需要延迟添加，确保元素已创建
        setTimeout(() => {
            // 关闭按钮点击事件
            const closeButton = document.getElementById('chat-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.closeChatWindow();
                });
            }

            // 发送按钮点击事件
            const sendButton = document.getElementById('send-button');
            if (sendButton) {
                sendButton.addEventListener('click', () => {
                    this.sendMessage();
                });
            }

            // 输入框键盘事件
            const messageInput = document.getElementById('message-input');
            if (messageInput) {
                messageInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        if (e.shiftKey) {
                            // Shift+Enter：允许换行，不阻止默认行为
                            return;
                        } else {
                            // 单独Enter：发送消息
                            e.preventDefault();
                            this.sendMessage();
                        }
                    }
                });

                // 添加自动调整高度功能
                messageInput.addEventListener('input', () => {
                    this.adjustTextareaHeight(messageInput);
                });
            }

            // API配置按钮点击事件
            const apiConfigButton = document.getElementById('api-config-button');
            if (apiConfigButton) {
                apiConfigButton.addEventListener('click', () => {
                    this.showAPIConfigModal();
                });
            }

            // 快速问题按钮事件监听器
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('quick-question-btn')) {
                    const question = e.target.getAttribute('data-question');
                    if (question) {
                        document.getElementById('message-input').value = question;
                        this.sendMessage();
                    }
                }
            });

            // 代码复制按钮事件监听器
            document.addEventListener('click', (e) => {
                if (e.target.classList.contains('code-copy-btn')) {
                    const codeId = e.target.getAttribute('data-code-id');
                    if (codeId) {
                        this.copyCode(codeId);
                    }
                }
            });
        }, 100);

        // 添加深色主题监听
        document.addEventListener('DOMContentLoaded', () => {
            this.updateDarkThemeStyles();
        });
        
        // 添加代码高亮和消息操作样式
        this.addCustomStyles();
    }
    
    // 添加自定义样式
    addCustomStyles() {
        const customStyle = document.createElement('style');
        customStyle.id = 'ai-assistant-custom-styles';
        customStyle.textContent = `
            /* 代码块样式 */
            .code-block {
                margin: 1rem 0;
                border-radius: 8px;
                overflow: hidden;
                background-color: #2d3748;
                border: 1px solid #4a5568;
            }
            
            .code-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem 1rem;
                background-color: #1a202c;
                border-bottom: 1px solid #4a5568;
                font-size: 0.8rem;
            }
            
            .code-lang {
                color: #81c784;
                font-weight: bold;
            }
            
            .code-copy-btn {
                background: var(--color-primary);
                color: white;
                border: none;
                padding: 0.25rem 0.5rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.7rem;
                transition: background-color 0.2s;
            }
            
            .code-copy-btn:hover {
                background: var(--color-secondary);
            }
            
            .code-block pre {
                margin: 0;
                padding: 1rem;
                overflow-x: auto;
                overflow-y: auto;
                max-height: 400px;
                background-color: #2d3748;
                color: #e2e8f0;
                line-height: 1.5;
                font-family: 'Fira Code', 'Consolas', monospace;
                font-size: 0.9rem;
                white-space: pre;
                word-wrap: normal;
            }
            
            /* 行内代码样式 */
            .inline-code {
                background-color: rgba(59, 130, 246, 0.1);
                color: var(--color-primary);
                padding: 0.2rem 0.4rem;
                border-radius: 4px;
                font-family: 'Fira Code', 'Consolas', monospace;
                font-size: 0.9em;
                border: 1px solid rgba(59, 130, 246, 0.2);
            }
            
            /* 消息操作按钮样式 */
            .action-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.2s ease;
                font-size: 1rem;
            }
            
            .action-btn:hover {
                background-color: rgba(59, 130, 246, 0.1);
                transform: scale(1.1);
            }
            
            /* 列表样式优化 */
            .ai-message ul {
                margin: 0.5rem 0;
                padding-left: 1.5rem;
                list-style-type: none;
            }
            
            .ai-message li {
                margin: 0.25rem 0;
                position: relative;
            }
            
            .ai-message li::before {
                content: '▶';
                color: var(--color-primary);
                position: absolute;
                left: -1.2rem;
                top: 0;
            }
            
            /* 深色主题下的代码块 */
            body.dark-theme .code-block {
                background-color: #1a1a1a;
                border-color: #333;
            }
            
            body.dark-theme .code-header {
                background-color: #0f0f0f;
                border-bottom-color: #333;
            }
            
            body.dark-theme .code-block pre {
                background-color: #1a1a1a;
            }
            
            body.dark-theme .inline-code {
                background-color: rgba(100, 100, 100, 0.2);
                border-color: rgba(100, 100, 100, 0.3);
            }
            
            /* 移动端适配 */
            @media screen and (max-width: 768px) {
                #ai-chat-window {
                    bottom: 80px !important;
                    right: 1rem !important;
                    left: 1rem !important;
                    width: auto !important;
                    min-width: auto !important;
                    height: min(650px, 80vh) !important;
                    max-height: 80vh !important;
                }
                
                .code-block pre {
                    font-size: 0.8rem !important;
                    padding: 0.75rem !important;
                }
                
                .chat-header h3 {
                    font-size: 1rem !important;
                }
                
                .chat-header > div:first-child > div > div {
                    font-size: 0.6rem !important;
                }
            }
            
            @media screen and (max-width: 480px) {
                #ai-chat-window {
                    height: min(600px, 75vh) !important;
                }
                
                .code-block pre {
                    font-size: 0.75rem !important;
                    padding: 0.5rem !important;
                }
                
                .ai-message, .user-message {
                    margin-bottom: 0.75rem !important;
                }
                
                .ai-message div:nth-child(2), .user-message div:nth-child(2) {
                    max-width: 90% !important;
                    min-width: 150px !important;
                }
            }
        `;
        document.head.appendChild(customStyle);
    }

    // 切换聊天窗口显示/隐藏
    toggleChatWindow() {
        if (this.isOpen) {
            this.closeChatWindow();
        } else {
            this.openChatWindow();
        }
    }

    // 打开聊天窗口
    openChatWindow() {
        this.chatWindow.style.display = 'flex';
        this.assistantButton.style.transform = 'scale(1.1)';
        this.isOpen = true;
    }

    // 关闭聊天窗口
    closeChatWindow() {
        this.chatWindow.style.display = 'none';
        this.assistantButton.style.transform = 'scale(1)';
        this.isOpen = false;
    }

    // 打开AI助手并预设消息（用于题库功能）
    openWithPresetMessage(message) {
        // 打开聊天窗口
        this.openChatWindow();
        
        // 预设消息到输入框
        const input = document.getElementById('message-input');
        if (input) {
            input.value = message;
            // 调整输入框高度以适应内容
            this.adjustTextareaHeight(input);
            // 聚焦到输入框
            input.focus();
            
            // 自动发送消息，无需用户手动点击
            setTimeout(() => {
                this.sendMessage();
            }, 100); // 短暂延迟确保UI更新完成
        }
    }

    // 发送消息
    sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();

        if (!message) return;

        // API密钥会自动从配置中加载，无需手动检查
        if (!this.apiKey && (!this.selectedModel || this.selectedModel !== 'mock')) {
            // 如果没有加载到API密钥，使用模拟回复
            this.selectedModel = 'mock';
        }

        // 添加用户消息到聊天
        this.addMessageToChat(message, 'user');

        // 清空输入框并重置高度
        input.value = '';
        this.adjustTextareaHeight(input);

        // 显示"正在输入"状态
        this.showTypingIndicator();

        // 调用AI模型获取回复
        this.getAIResponse(message).then(response => {
            // 移除"正在输入"状态
            this.removeTypingIndicator();
            // 添加AI回复到聊天
            this.addMessageToChat(response, 'ai');
        }).catch(error => {
            this.removeTypingIndicator();
            
            // 根据错误类型提供更友好的提示
            let errorMessage = '';
            if (error.message.includes('网络') || error.message.includes('fetch')) {
                errorMessage = '🌐 **网络连接问题**\n\n抱歉，当前网络连接不稳定。请检查您的网络连接后重试。\n\n💡 **建议**：\n• 检查网络连接\n• 稍后重试\n• 或者切换到内置智能回复模式';
            } else if (error.message.includes('401') || error.message.includes('API密钥')) {
                errorMessage = '🔐 **API认证问题**\n\n看起来API密钥可能有问题。不过没关系，我已经为您自动切换到内置智能回复模式！\n\n💡 **提示**：您可以继续正常提问，我会尽力为您解答C++相关问题。';
            } else if (error.message.includes('429')) {
                errorMessage = '⏰ **请求过于频繁**\n\n为了保证服务质量，请稍等片刻再提问。\n\n💡 **建议**：等待30秒后重试，或者切换到内置智能回复模式。';
            } else {
                errorMessage = '🤖 **服务暂时不可用**\n\n很抱歉，AI服务暂时遇到了一些技术问题。\n\n💡 **解决方案**：\n• 我可以为您切换到内置智能回复模式\n• 您也可以稍后重试\n• 基本的C++问题我依然可以帮您解答！';
            }
            
            this.addMessageToChat(errorMessage, 'ai');
            
            // 如果是API相关错误，自动切换到mock模式
            if (error.message.includes('401') || error.message.includes('fetch') || 
                error.message.includes('429') || error.message.includes('API')) {
                this.selectedModel = 'mock';
                this.showToast('已自动切换到内置智能回复模式', 'info');
            } else {
                this.showToast('AI服务暂时不可用，建议切换到内置模式', 'warning');
            }
            
            console.error('AI API error:', error);
        });
    }

    // 调用AI模型获取回复
    async getAIResponse(message) {
        try {
            // 检查是否有API密钥和选择的模型
            if (this.apiKey && this.selectedModel && this.selectedModel !== 'mock') {
                // 调用相应的国产大模型API
                switch(this.selectedModel) {
                    case 'ERNIE-Bot':
                        // 文心一言API调用示例
                        return await this.callERNIEBotAPI(message);
                    case 'Tongyi Qianwen':
                        // 通义千问API调用示例
                        return await this.callTongyiQianwenAPI(message);
                    case 'SparkDesk':
                        // 讯飞星火API调用示例
                        return await this.callSparkDeskAPI(message);
                    case 'DeepSeek':
                        // 深度求索API调用示例
                        return await this.callDeepSeekAPI(message);
                    default:
                        // 默认使用模拟回复
                        return await this.getMockResponse(message);
                }
            } else {
                // 使用模拟回复
                return await this.getMockResponse(message);
            }
        } catch (error) {
            console.error('AI API error:', error);
            throw error;
        }
    }
    
    // 获取模拟回复
    async getMockResponse(message) {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // 根据常见问题类型提供更精确的模拟回复
        // 将消息转为小写以便匹配关键词
        const lowerMessage = message.toLowerCase();
        
        // 根据问题类型分类的模拟回复
        const mockResponses = {
            // 基础语法
            basic: [
                "📚 **C++基础数据类型**：\n• **整数类型**：int(4字节)、short(2字节)、long(8字节)\n• **浮点类型**：float(4字节)、double(8字节)\n• **字符类型**：char(1字节)、wchar_t(宽字符)\n• **布尔类型**：bool(true/false)\n\n💡 **小贴士**：使用auto关键字可以让编译器自动推导类型！",
                "🔧 **C++程序基本结构**：\n```cpp\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // 您的代码\n    return 0;\n}\n```\n📝 **要点**：头文件包含、命名空间、main函数是C++程序的三要素。",
                "✨ **变量声明与初始化**：\n```cpp\nint age = 25;           // 直接初始化\nint weight{70};         // 列表初始化(推荐)\nint height = {180};     // 列表初始化\nauto price = 99.9;      // 自动类型推导\n```\n💡 **建议**：使用列表初始化{}可以避免类型转换问题！",
                "📖 **C++注释最佳实践**：\\n• **单行注释**：双斜杠（//）用于简短说明\\n• **多行注释**：斜杠星号对用于详细文档\\n• **文档注释**：双星号注释用于生成API文档\\n\\n🎯 **技巧**：好的注释解释原因，而不只是描述代码！"
            ],
            // 面向对象
            oop: [
                "🎯 **面向对象三大特性详解**：\n• **封装**：将数据和操作数据的方法绑定在一起，隐藏内部实现细节\n• **继承**：子类可以继承父类的属性和方法，实现代码复用\n• **多态**：同一接口可以有多种不同的实现形式\n\n💡 **记忆技巧**：封装像胶囊，继承像家族，多态像变形金刚！",
                "🏗️ **类与对象的关系**：\n• **类(Class)**：是对象的模板/蓝图，定义了属性和行为\n• **对象(Object)**：是类的实例，具有具体的属性值\n\n```cpp\nclass Student {     // 类定义\nprivate:\n    string name;\npublic:\n    void study();\n};\nStudent stu1;       // 创建对象\n```",
                "⚙️ **构造函数详解**：\n• **默认构造函数**：Student() {}\n• **参数化构造函数**：Student(string n) : name(n) {}\n• **拷贝构造函数**：Student(const Student& other)\n• **移动构造函数**：Student(Student&& other)\n\n🎯 **建议**：使用初始化列表提高性能！",
                "🔄 **继承的威力**：\n```cpp\nclass Animal {          // 基类\nprotected:\n    string name;\npublic:\n    virtual void makeSound() = 0;\n};\n\nclass Dog : public Animal {  // 派生类\npublic:\n    void makeSound() override { cout << \"汪汪！\"; }\n};\n```\n✨ **要点**：使用virtual实现多态，override确保正确重写！"
            ],
            // STL相关
            stl: [
                "🎯 **STL四大组件**：\n• **容器(Containers)**：存储数据的结构\n• **迭代器(Iterators)**：访问容器元素的工具\n• **算法(Algorithms)**：处理数据的函数\n• **函数对象(Function Objects)**：可调用的对象\n\n💡 **STL的哲学**：将数据结构与算法分离，通过迭代器连接！",
                "📦 **常用STL容器选择指南**：\n• **vector**：动态数组，支持随机访问 O(1)\n• **list**：双向链表，插入删除快 O(1)\n• **deque**：双端队列，两端操作快\n• **map**：有序键值对，查找快 O(log n)\n• **unordered_map**：哈希表，查找最快 O(1)\n• **set**：有序集合，自动去重\n\n🎯 **选择原则**：根据操作频率选择合适的容器！",
                "🔍 **STL算法精选**：\n```cpp\n#include <algorithm>\nvector<int> v = {3,1,4,1,5};\nsort(v.begin(), v.end());        // 排序\nauto it = find(v.begin(), v.end(), 4);  // 查找\nint count = count_if(v.begin(), v.end(), \n    [](int x){ return x > 2; });     // 条件计数\n```\n✨ **现代C++**：配合lambda表达式，算法更强大！",
                "🚀 **vector使用技巧**：\n```cpp\nvector<int> v;\nv.reserve(1000);     // 预分配内存，避免多次重分配\nv.emplace_back(42);  // 直接构造，比push_back更高效\nv.shrink_to_fit();   // 释放多余内存\n```\n⚡ **性能优化**：合理使用reserve和emplace系列函数！"
            ],
            // 内存管理
            memory: [
                "⚠️ **C++内存管理三原则**：\n1. **每个new都要有对应的delete**\n2. **数组用new[]，释放用delete[]**\n3. **不要delete同一块内存两次**\n\n```cpp\nint* p = new int(42);    // 分配单个对象\nint* arr = new int[10];  // 分配数组\ndelete p;                // 释放单个对象\ndelete[] arr;            // 释放数组\n```",
                "🛡️ **智能指针：现代C++的内存管理神器**：\n• **unique_ptr**：独占所有权，不可复制\n• **shared_ptr**：共享所有权，引用计数\n• **weak_ptr**：弱引用，避免循环引用\n\n```cpp\nauto ptr = std::make_unique<int>(42);\nauto shared = std::make_shared<std::vector<int>>(10);\n```\n✨ **最佳实践**：优先使用智能指针，让RAII为你管理内存！",
                "🔴 **内存泄漏的常见原因**：\n• 忘记delete new出来的内存\n• 异常导致delete未执行\n• 容器中存储指针但未释放\n• 循环引用（A指向B，B也指向A）\n\n🔧 **检测工具**：Valgrind、AddressSanitizer\n💡 **预防方法**：使用智能指针和RAII原则！",
                "🎯 **RAII(资源获取即初始化)**：\n```cpp\nclass FileHandler {\n    FILE* file;\npublic:\n    FileHandler(const char* filename) {\n        file = fopen(filename, \"r\");  // 构造时获取资源\n    }\n    ~FileHandler() {\n        if(file) fclose(file);         // 析构时释放资源\n    }\n};\n```\n🌟 **RAII的好处**：异常安全、自动清理、代码更简洁！"
            ],
            // 函数相关
            function: [
                "📋 **函数声明与定义**：\n```cpp\n// 声明(通常在.h文件中)\nint add(int a, int b);\n\n// 定义(通常在.cpp文件中)\nint add(int a, int b) {\n    return a + b;\n}\n```\n🎯 **分离的好处**：编译速度快，接口清晰！",
                "🔄 **函数重载(Overloading)**：\n```cpp\nvoid print(int x);           // 打印整数\nvoid print(double x);        // 打印浮点数\nvoid print(const string& s); // 打印字符串\n```\n⚡ **重载决议**：编译器根据参数类型和数量选择最佳匹配！\n⚠️ **注意**：返回类型不能作为重载的区分标准！",
                "⚡ **内联函数(inline)**：\n```cpp\ninline int square(int x) {\n    return x * x;  // 建议编译器在调用处展开\n}\n```\n🎯 **使用场景**：短小、频繁调用的函数\n💡 **现代替代**：编译器很智能，通常会自动优化！",
                "🔧 **默认参数的智慧**：\n```cpp\nvoid greet(const string& name, \n          const string& greeting = \"Hello\",\n          const string& punctuation = \"!\") {\n    cout << greeting << \", \" << name << punctuation;\n}\n\n// 调用方式\ngreet(\"Alice\");                    // Hello, Alice!\ngreet(\"Bob\", \"Hi\");               // Hi, Bob!\ngreet(\"Carol\", \"Hey\", \"!!!\");      // Hey, Carol!!!\n```\n✨ **规则**：默认参数必须从右向左连续设置！"
            ],
            // 模板和泛型
            template: [
                "🎭 **C++模板：泛型编程的魅力**：\n```cpp\ntemplate<typename T>\nT max(T a, T b) {\n    return (a > b) ? a : b;\n}\n\nint result1 = max(10, 20);      // T = int\ndouble result2 = max(3.14, 2.71); // T = double\n```\n🌟 **优势**：一次编写，多种类型复用！",
                "🏗️ **类模板示例**：\n```cpp\ntemplate<typename T, size_t N>\nclass Array {\nprivate:\n    T data[N];\npublic:\n    T& operator[](size_t index) { return data[index]; }\n    size_t size() const { return N; }\n};\n\nArray<int, 10> intArray;\nArray<string, 5> stringArray;\n```\n💡 **类型安全**：编译时检查，运行时无额外开销！"
            ],
            // 现代C++特性
            modern: [
                "🆕 **现代C++特性概览**：\n• **C++11**：auto、lambda、智能指针、范围for\n• **C++14**：泛型lambda、make_unique\n• **C++17**：if constexpr、结构化绑定、std::optional\n• **C++20**：概念(Concepts)、协程、模块\n\n🚀 **建议**：拥抱现代C++，代码更简洁、更安全！",
                "✨ **Lambda表达式：函数式编程利器**：\n```cpp\nauto lambda = [](int x, int y) -> int {\n    return x + y;\n};\n\nvector<int> v = {1,2,3,4,5};\nauto sum = accumulate(v.begin(), v.end(), 0,\n    [](int acc, int val) { return acc + val; });\n```\n🎯 **语法**：[捕获](参数) -> 返回类型 { 函数体 }"
            ],
            // 常见问题和欢迎
            common: [
                "👋 **欢迎来到C++学习助手！** 我是您的专属编程导师，可以帮助您：\n\n📚 **基础学习**：语法、数据类型、控制流\n🏗️ **面向对象**：类、继承、多态、封装\n📦 **STL使用**：容器、算法、迭代器\n🧠 **内存管理**：指针、智能指针、RAII\n⚡ **性能优化**：最佳实践、现代C++特性\n\n❓ 有什么C++问题想要探讨吗？",
                "🎯 **学习C++的建议路径**：\n1. **基础语法** → 变量、函数、控制流\n2. **面向对象** → 类、继承、多态\n3. **内存管理** → 指针、智能指针\n4. **STL掌握** → 容器、算法、迭代器\n5. **现代特性** → C++11/14/17/20新特性\n6. **项目实践** → 实际项目巩固知识\n\n📈 **记住**：编程是实践的艺术，多写代码才能真正掌握！",
                "💡 **C++学习小贴士**：\n• 📖 **理论与实践并重**：看书+写代码\n• 🐛 **拥抱错误**：每个错误都是学习机会\n• 🔍 **阅读优秀代码**：GitHub上的开源项目\n• 👥 **加入社区**：Stack Overflow、Reddit\n• 🎯 **设定目标**：制定明确的学习计划\n\n🚀 **相信自己**：C++虽然复杂，但掌握后威力无穷！",
                "🤝 **我是您的C++学习伙伴！** 无论您是：\n\n🌱 **完全新手**：从零开始学习C++\n📚 **进阶学习者**：想要深入理解高级特性\n💼 **专业开发者**：寻求最佳实践和性能优化\n\n我都会根据您的水平提供个性化的指导。请随时提出您的问题，我会用最清晰的方式为您解答！\n\n✨ **今天想学什么呢？**"
            ]
        };
        
        // 确定问题类型并返回相应回复
        let responseType = 'common'; // 默认回复类型
        
        // 根据关键词判断问题类型（按优先级排序）
        if (lowerMessage.includes('模板') || lowerMessage.includes('template') || lowerMessage.includes('泛型') || 
            lowerMessage.includes('typename') || lowerMessage.includes('特化')) {
            responseType = 'template';
        } else if (lowerMessage.includes('现代') || lowerMessage.includes('c++11') || lowerMessage.includes('c++14') || 
                   lowerMessage.includes('c++17') || lowerMessage.includes('c++20') || lowerMessage.includes('lambda') || 
                   lowerMessage.includes('auto') || lowerMessage.includes('移动语义') || lowerMessage.includes('右值引用')) {
            responseType = 'modern';
        } else if (lowerMessage.includes('stl') || lowerMessage.includes('容器') || lowerMessage.includes('vector') || 
                   lowerMessage.includes('map') || lowerMessage.includes('list') || lowerMessage.includes('set') || 
                   lowerMessage.includes('算法') || lowerMessage.includes('迭代器')) {
            responseType = 'stl';
        } else if (lowerMessage.includes('内存') || lowerMessage.includes('指针') || lowerMessage.includes('new') || 
                   lowerMessage.includes('delete') || lowerMessage.includes('泄漏') || lowerMessage.includes('智能指针') || 
                   lowerMessage.includes('raii') || lowerMessage.includes('shared_ptr') || lowerMessage.includes('unique_ptr')) {
            responseType = 'memory';
        } else if (lowerMessage.includes('类') || lowerMessage.includes('对象') || lowerMessage.includes('继承') || 
                   lowerMessage.includes('多态') || lowerMessage.includes('封装') || lowerMessage.includes('构造函数') || 
                   lowerMessage.includes('析构函数') || lowerMessage.includes('虚函数') || lowerMessage.includes('重写')) {
            responseType = 'oop';
        } else if (lowerMessage.includes('函数') || lowerMessage.includes('参数') || lowerMessage.includes('返回') || 
                   lowerMessage.includes('重载') || lowerMessage.includes('内联') || lowerMessage.includes('默认参数')) {
            responseType = 'function';
        } else if (lowerMessage.includes('数据类型') || lowerMessage.includes('变量') || lowerMessage.includes('语句') || 
                   lowerMessage.includes('注释') || lowerMessage.includes('基础') || lowerMessage.includes('语法') ||
                   lowerMessage.includes('int') || lowerMessage.includes('char') || lowerMessage.includes('double') || 
                   lowerMessage.includes('if') || lowerMessage.includes('for') || lowerMessage.includes('while')) {
            responseType = 'basic';
        }
        
        // 从对应类型的回复中随机选择一个
        const responses = mockResponses[responseType];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // 调用文心一言API
    async callERNIEBotAPI(message) {
        try {
            // 注意：实际使用时需要根据百度官方文档配置正确的API地址和参数
            // 这里仅作为示例，具体实现需要参考百度云官方文档
            /*
            const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    messages: [{role: "user", content: message}],
                    temperature: 0.7
                })
            });
            const data = await response.json();
            return data.result;
            */
            
            // 由于是前端直接调用，可能存在跨域问题
            // 这里返回一个示例响应
            await new Promise(resolve => setTimeout(resolve, 1500));
            return `[文心一言示例回复] ${message} 这是一个关于C++的问题。在C++中，您可以通过...`;
        } catch (error) {
            console.error('文心一言API调用失败:', error);
            throw error;
        }
    }
    
    // 调用通义千问API
    async callTongyiQianwenAPI(message) {
        try {
            // 注意：实际使用时需要根据阿里云官方文档配置正确的API地址和参数
            // 这里仅作为示例，具体实现需要参考阿里云官方文档
            
            // 由于是前端直接调用，可能存在跨域问题
            // 这里返回一个示例响应
            await new Promise(resolve => setTimeout(resolve, 1500));
            return `[通义千问示例回复] 您好！关于C++的问题，${message} 我可以为您提供详细解答...`;
        } catch (error) {
            console.error('通义千问API调用失败:', error);
            throw error;
        }
    }
    
    // 调用讯飞星火API
    async callSparkDeskAPI(message) {
        try {
            // 注意：实际使用时需要根据讯飞官方文档配置正确的API地址和参数
            // 这里仅作为示例，具体实现需要参考讯飞官方文档
            
            // 由于是前端直接调用，可能存在跨域问题
            // 这里返回一个示例响应
            await new Promise(resolve => setTimeout(resolve, 1500));
            return `[讯飞星火示例回复] 感谢您的提问！针对${message}，在C++编程中...`;
        } catch (error) {
            console.error('讯飞星火API调用失败:', error);
            throw error;
        }
    }
    
    // 调用深度求索(DeepSeek)API
    async callDeepSeekAPI(message) {
        try {
            // DeepSeek API调用实现
            console.log('调用DeepSeek API...');
            
            // 添加系统提示，使AI更好地扮演C++学习助手
            const systemPrompt = {
                role: "system",
                content: `你是一位经验丰富的C++编程导师，具有以下特点：

🎯 **专业领域**：
- C++语法基础（变量、类型、控制流）
- 面向对象编程（类、继承、多态、封装）
- STL容器和算法
- 内存管理和智能指针
- 模板编程和泛型
- 异常处理和错误管理
- 现代C++特性（C++11/14/17/20）
- 性能优化和最佳实践

💡 **回答风格**：
- 用通俗易懂的语言解释复杂概念
- 提供具体的代码示例
- 指出常见陷阱和注意事项
- 给出实际应用场景
- 建议进一步学习方向

📚 **教学方法**：
- 循序渐进，从简单到复杂
- 理论结合实践
- 鼓励提问和探索
- 提供相关学习资源建议

请始终保持耐心、友好的态度，用中文回答问题。如果问题不够明确，请礼貌地询问更多细节。`
            };
            
            // 构建消息历史，包含系统提示和当前用户消息
            const messages = [
                systemPrompt,
                {role: "user", content: message}
            ];
            
            // 智能选择上下文消息，最多5条，优先保留重要对话
            if (this.messages.length > 0) {
                // 获取最近的消息，最多5条
                const recentMessages = this.messages.slice(-5);
                
                // 过滤掉过于简短或无关的消息，保持上下文相关性
                const relevantMessages = recentMessages.filter(msg => {
                    const content = msg.message.toLowerCase();
                    // 保留包含技术词汇或问题的消息
                    return msg.message.length > 10 && 
                           (content.includes('c++') || 
                            content.includes('代码') || 
                            content.includes('?') || 
                            content.includes('？') || 
                            content.includes('如何') || 
                            content.includes('什么') || 
                            content.includes('怎么') || 
                            content.includes('为什么') ||
                            content.includes('class') ||
                            content.includes('template') ||
                            content.includes('指针') ||
                            content.includes('函数') ||
                            msg.sender === 'user' // 保留所有用户消息
                           );
                });
                
                // 将历史消息转换为API所需格式，并插入到系统提示和当前消息之间
                relevantMessages.forEach(msg => {
                    messages.splice(-1, 0, {
                        role: msg.sender === 'user' ? 'user' : 'assistant',
                        content: msg.message
                    });
                });
            }
            
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.5,
                    stream: false
                })
            });
            
            // 检查响应状态
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API请求失败: ${response.status} ${errorText}`);
            }
            
            const data = await response.json();
            
            // 检查响应数据格式
            if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
                throw new Error('API响应格式不正确');
            }
            
            return data.choices[0].message.content;
        } catch (error) {
            console.error('DeepSeek API调用失败:', error);
            // 更友好的错误提示
            if (error.message.includes('Failed to fetch')) {
                throw new Error('无法连接到DeepSeek API，可能是网络问题或跨域限制');
            } else if (error.message.includes('401')) {
                throw new Error('API密钥无效，请检查您的API密钥');
            }
            throw error;
        }
    }

    // 添加消息到聊天
    addMessageToChat(message, sender) {
        const chatContent = document.getElementById('chat-content');
        const messageElement = document.createElement('div');
        messageElement.className = sender === 'user' ? 'user-message' : 'ai-message';

        let avatar, alignment;
        if (sender === 'user') {
            avatar = '<i class="fas fa-user"></i>';
            alignment = 'flex-direction: row-reverse;';
        } else {
            avatar = '<i class="fas fa-robot"></i>';
            alignment = '';
        }

        messageElement.style.cssText = `
            margin-bottom: 1rem;
            display: flex;
            gap: 0.75rem;
            ${alignment}
        `;

        // 格式化消息内容，支持代码高亮和Markdown基本语法
        const formattedMessage = this.formatMessage(message);
        
        messageElement.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background-color: ${sender === 'user' ? 'var(--color-secondary)' : 'var(--color-primary)'}; color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                ${avatar}
            </div>
            <div style="background-color: var(--color-background); padding: 1rem; border-radius: 15px; max-width: 85%; min-width: 200px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <div style="margin: 0; color: var(--color-text); line-height: 1.6; word-wrap: break-word; overflow-wrap: anywhere;">${formattedMessage}</div>
                ${sender === 'ai' ? `<div class="message-actions" style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                    <button class="action-btn copy-btn" title="复制回答">📋</button>
                    <button class="action-btn like-btn" title="有帮助">👍</button>
                    <button class="action-btn dislike-btn" title="需要改进">👎</button>
                </div>` : ''}
            </div>
        `;

        chatContent.appendChild(messageElement);
        chatContent.scrollTop = chatContent.scrollHeight;

        // 添加消息操作按钮事件监听器
        if (sender === 'ai') {
            setTimeout(() => {
                const copyBtn = messageElement.querySelector('.copy-btn');
                const likeBtn = messageElement.querySelector('.like-btn');
                const dislikeBtn = messageElement.querySelector('.dislike-btn');
                
                if (copyBtn) {
                    copyBtn.addEventListener('click', () => {
                        navigator.clipboard.writeText(message).then(() => {
                            this.showToast('回答已复制到剪贴板', 'success');
                        });
                    });
                }
                
                if (likeBtn) {
                    likeBtn.addEventListener('click', () => {
                        likeBtn.innerHTML = '👍✨';
                        this.showToast('感谢您的反馈！', 'success');
                        // 这里可以记录用户反馈数据
                    });
                }
                
                if (dislikeBtn) {
                    dislikeBtn.addEventListener('click', () => {
                        dislikeBtn.innerHTML = '👎💭';
                        this.showToast('感谢反馈，我会继续改进', 'info');
                        // 这里可以记录需要改进的数据
                    });
                }
            }, 100);
        }

        // 保存消息历史
        this.messages.push({ sender, message, timestamp: new Date() });
        this.saveChatHistory();
    }

    // 自动调整textarea高度
    adjustTextareaHeight(textarea) {
        // 重置高度以获取正确的scrollHeight
        textarea.style.height = 'auto';
        
        // 获取内容高度
        const scrollHeight = textarea.scrollHeight;
        const minHeight = 40; // 最小高度
        const maxHeight = 120; // 最大高度
        
        // 设置新高度
        if (scrollHeight <= maxHeight) {
            textarea.style.height = Math.max(scrollHeight, minHeight) + 'px';
        } else {
            textarea.style.height = maxHeight + 'px';
        }
    }

    // 格式化消息内容，支持代码高亮和基本Markdown
    formatMessage(message) {
        let formatted = message;
        
        // 处理代码块 ```cpp ... ```
        formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, lang, code) => {
            const language = lang || 'cpp';
            const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
            const escapedCode = this.escapeHtml(code);
            
            return `<div class="code-block">
                <div class="code-header">
                    <span class="code-lang">${language.toUpperCase()}</span>
                    <button class="code-copy-btn" data-code-id="${codeId}">复制</button>
                    <span id="${codeId}-feedback" class="copy-feedback" style="display: none; color: var(--color-success); font-size: 0.8rem;">已复制!</span>
                </div>
                <pre id="${codeId}"><code class="language-${language}">${escapedCode}</code></pre>
            </div>`;
        });
        
        // 处理行内代码 `code`
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // 处理粗体文本 **text**
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // 处理列表项 •
        formatted = formatted.replace(/^• (.+)$/gm, '<li>$1</li>');
        
        // 处理换行符
        formatted = formatted.replace(/\n/g, '<br>');
        
        // 如果有列表项，包装在ul标签中
        if (formatted.includes('<li>')) {
            formatted = formatted.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
            // 合并相邻的ul标签
            formatted = formatted.replace(/<\/ul><ul>/g, '');
        }
        
        return formatted;
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 复制代码功能
    copyCode(codeId) {
        const codeElement = document.getElementById(codeId);
        const feedbackElement = document.getElementById(codeId + '-feedback');
        
        if (codeElement) {
            const codeText = codeElement.textContent || codeElement.innerText;
            navigator.clipboard.writeText(codeText).then(() => {
                if (feedbackElement) {
                    feedbackElement.style.display = 'inline';
                    setTimeout(() => {
                        feedbackElement.style.display = 'none';
                    }, 2000);
                }
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }
    }

    // 显示"正在输入"状态
    showTypingIndicator() {
        const chatContent = document.getElementById('chat-content');
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.className = 'ai-message';
        typingIndicator.style.cssText = `
            margin-bottom: 1rem;
            display: flex;
            gap: 0.75rem;
        `;
        typingIndicator.innerHTML = `
            <div style="width: 36px; height: 36px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <i class="fas fa-robot"></i>
            </div>
            <div style="background-color: var(--color-background); padding: 1rem; border-radius: 15px; max-width: 75%; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        // 添加打字动画样式
        const style = document.createElement('style');
        style.textContent = `
            .typing-dots {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                background-color: var(--color-text-light);
                border-radius: 50%;
                animation: typing 1.4s infinite ease-in-out both;
            }
            .typing-dots span:nth-child(1) {
                animation-delay: 0s;
            }
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes typing {
                0%, 80%, 100% {
                    transform: scale(0);
                }
                40% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        chatContent.appendChild(typingIndicator);
        chatContent.scrollTop = chatContent.scrollHeight;
    }

    // 移除"正在输入"状态
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // 显示API配置模态框
    showAPIConfigModal() {
        // 检查模态框是否已存在
        let modal = document.getElementById('api-config-modal');
        if (modal) {
            modal.style.display = 'block';
            return;
        }

        // 创建模态框
        modal = document.createElement('div');
        modal.id = 'api-config-modal';
        modal.className = 'modal';
        modal.style.cssText = `
            display: block;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
            transition: all 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="
                background-color: var(--color-background);
                margin: 15% auto;
                padding: 2rem;
                border-radius: 10px;
                width: 90%;
                max-width: 450px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                position: relative;
            ">
                <span id="close-api-modal" style="
                    color: var(--color-text-light);
                    position: absolute;
                    top: 1rem;
                    right: 1.5rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: color 0.3s ease;
                ">&times;</span>
                <h2 style="
                    color: var(--color-primary);
                    text-align: center;
                    margin-bottom: 1.5rem;
                    font-family: var(--font-display);
                    font-weight: 700;
                ">AI模型配置</h2>
                
                <!-- 状态提示 -->
                <div id="status-indicator" style="
                    background-color: rgba(80, 116, 151, 0.1);
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                    border-left: 4px solid var(--color-success);
                ">
                    <p style="margin: 0; color: var(--color-text);"><strong>✓ 当前状态：</strong>已默认启用内置智能回复功能，您可以直接开始使用！</p>
                    <p style="margin: 0.5rem 0 0 0; color: var(--color-text-light); font-size: 0.875rem;">如需更强大的AI能力，可配置第三方AI模型API密钥。</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label for="ai-model" style="
                        display: block;
                        margin-bottom: 0.5rem;
                        color: var(--color-text);
                        font-weight: 500;
                    ">选择AI模型</label>
                    <select id="ai-model" style="
                        width: 100%;
                        padding: 0.75rem 1rem;
                        border: 1px solid var(--color-border);
                        border-radius: 5px;
                        font-family: var(--font-sans);
                        font-size: 1rem;
                        transition: border-color 0.3s ease;
                        background-color: var(--color-background);
                        color: var(--color-text);
                    ">
                        <option value="mock">内置智能回复（无需API密钥）</option>
                        <option value="DeepSeek">深度求索 (DeepSeek)</option>
                    </select>
                </div>
                

                
                <div id="api-info" style="
                    margin-top: 1rem;
                    padding: 1rem;
                    background-color: rgba(80, 116, 151, 0.1);
                    border-radius: 5px;
                    font-size: 0.85rem;
                    color: var(--color-text-light);
                ">
                    <p>提示：</p>
                    <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                        <li>您正在使用内置智能回复模式</li>
                        <li>此模式无需API密钥，可直接使用</li>
                        <li>回复内容为预设的示例回答</li>
                    </ul>
                </div>
                
                <button id="save-api-key" style="
                    width: 100%;
                    margin-top: 1.5rem;
                    padding: 0.75rem;
                    background-color: var(--color-secondary);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-family: var(--font-display);
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">保存配置</button>
            </div>
        `;

        document.body.appendChild(modal);

        // 获取DOM元素
        const aiModelSelect = document.getElementById('ai-model');
        const apiInfo = document.getElementById('api-info');
        const statusIndicator = document.getElementById('status-indicator');
        if (this.selectedModel) {
            aiModelSelect.value = this.selectedModel;
        } else {
            // 默认选择模拟回复
            this.selectedModel = 'mock';
            aiModelSelect.value = 'mock';
        }
        
        // 更新状态提示
        const updateStatusIndicator = () => {
            if (aiModelSelect.value === 'mock') {
                statusIndicator.innerHTML = `
                    <p style="margin: 0; color: var(--color-text);"><strong>✓ 当前状态：</strong>已启用内置智能回复功能，您可以直接开始使用！</p>
                    <p style="margin: 0.5rem 0 0 0; color: var(--color-text-light); font-size: 0.875rem;">如需更强大的AI能力，可切换至深度求索模型。</p>
                `;
            } else {
                statusIndicator.innerHTML = `
                    <p style="margin: 0; color: var(--color-text);"><strong>✓ 当前状态：</strong>已启用深度求索 (DeepSeek) 模型！</p>
                    <p style="margin: 0.5rem 0 0 0; color: var(--color-text-light); font-size: 0.875rem;"><span style="color: var(--color-success); font-weight: bold;">✓ API已自动配置！</span> 您可以直接开始使用。</p>
                `;
            }
        };
        
        // 立即更新状态提示，确保默认选择DeepSeek时显示正确状态
        updateStatusIndicator();
        
        // 更新API信息显示
        const updateApiInfo = () => {
            updateStatusIndicator(); // 同时更新状态提示
            
            if (aiModelSelect.value === 'mock') {
                apiInfo.innerHTML = `
                    <p>提示：</p>
                    <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                        <li>您正在使用内置智能回复模式</li>
                        <li>此模式无需API密钥，可直接使用</li>
                        <li>回复内容为预设的示例回答</li>
                    </ul>
                `;
            } else {
                apiInfo.innerHTML = `
                    <p>提示：</p>
                    <ul style="margin: 0.5rem 0 0 1rem; padding: 0;">
                        <li>您选择了深度求索 (DeepSeek) 模型</li>
                        <li><span style="color: var(--color-success); font-weight: bold;">✓ API已自动配置！</span></li>
                        <li>系统将自动使用内置的API密钥</li>
                    </ul>
                `;
            }
        };
        
        // 初始更新
        updateApiInfo();
        
        // 监听模型选择变化
        aiModelSelect.addEventListener('change', updateApiInfo);

        // 添加关闭事件
        document.getElementById('close-api-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // 点击外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // 保存模型配置
        document.getElementById('save-api-key').addEventListener('click', () => {
            const selectedModel = aiModelSelect.value;
            
            this.selectedModel = selectedModel;
            // API密钥已自动配置，无需用户输入
            
            this.saveSelectedModel();
            this.showToast('AI模型配置已保存', 'success');
            modal.style.display = 'none';
        });
    }
    
    // 保存选择的模型到本地存储
    saveSelectedModel() {
        localStorage.setItem('aiAssistantSelectedModel', this.selectedModel);
    }
    
    // 从本地存储加载选择的模型
    loadSelectedModel() {
        const savedModel = localStorage.getItem('aiAssistantSelectedModel');
        // 只有在本地存储中有保存的模型时才覆盖默认值
        if (savedModel) {
            this.selectedModel = savedModel;
        }
        // 否则保留构造函数中设置的默认值（DeepSeek）
    }

    // 保存API密钥到本地存储
    saveAPIKey() {
        localStorage.setItem('aiAssistantAPIKey', this.apiKey);
    }

    // 从本地存储加载API密钥，优先尝试从文件加载
    loadAPIKey() {
        // 首先从本地存储获取API密钥
        this.apiKey = localStorage.getItem('aiAssistantAPIKey') || '';
        
        // 如果本地存储中没有密钥，直接使用默认API密钥（无论什么协议）
        if (!this.apiKey) {
            try {
                // 在实际生产环境中，应该通过后端服务来安全地提供API密钥
                // 这里使用文件中的密钥作为默认值
                const defaultApiKey = 'sk-6ee47b55a52c48c79f6a18c80c5fd00f';
                this.apiKey = defaultApiKey;
                console.log('已加载默认API密钥');
            } catch (error) {
                console.log('加载默认API密钥失败:', error);
            }
        }
    }

    // 保存聊天历史
    saveChatHistory() {
        // 只保存最近20条消息
        const recentMessages = this.messages.slice(-20);
        localStorage.setItem('aiAssistantChatHistory', JSON.stringify(recentMessages));
    }

    // 加载聊天历史
    loadChatHistory() {
        const savedHistory = localStorage.getItem('aiAssistantChatHistory');
        if (savedHistory) {
            this.messages = JSON.parse(savedHistory);
            // 重新显示聊天历史
            const chatContent = document.getElementById('chat-content');
            chatContent.innerHTML = ''; // 清空现有内容
            
            // 添加欢迎消息
            this.addMessageToChat('您好！我是C++学习助手，请问有什么可以帮助您的？', 'ai');
            
            // 添加保存的历史消息
            this.messages.forEach(msg => {
                if (!(msg.sender === 'ai' && msg.message === '您好！我是C++学习助手，请问有什么可以帮助您的？')) {
                    this.addMessageToChat(msg.message, msg.sender);
                }
            });
        }
    }

    // 显示提示消息
    showToast(message, type = 'info') {
        // 检查是否已有toast元素
        let toast = document.getElementById('ai-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ai-toast';
            toast.style.cssText = `
                position: fixed;
                top: 2rem;
                right: 2rem;
                padding: 1rem 1.5rem;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1002;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
                font-family: var(--font-sans);
            `;
            document.body.appendChild(toast);
        }

        // 设置消息内容和类型
        toast.textContent = message;
        toast.className = 'toast';
        
        // 设置背景颜色
        if (type === 'success') {
            toast.style.backgroundColor = 'var(--color-success)';
            toast.style.color = 'white';
        } else if (type === 'error') {
            toast.style.backgroundColor = 'var(--color-error)';
            toast.style.color = 'white';
        } else if (type === 'warning') {
            toast.style.backgroundColor = 'var(--color-warning)';
            toast.style.color = 'var(--color-dark)';
        } else {
            toast.style.backgroundColor = 'var(--color-dark)';
            toast.style.color = 'white';
        }

        // 显示提示消息
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';

        // 3秒后隐藏提示消息
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
        }, 3000);
    }

    // 更新深色主题样式
    updateDarkThemeStyles() {
        const styleId = 'ai-assistant-dark-theme';
        let style = document.getElementById(styleId);
        
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        
        style.textContent = `
            /* 深色主题下的AI助手样式 */
            body.dark-theme #ai-chat-window {
                background-color: var(--color-background);
            }
            
            body.dark-theme #chat-content {
                background-color: var(--color-light);
            }
            
            body.dark-theme .ai-message div:last-child,
            body.dark-theme .user-message div:last-child {
                background-color: var(--color-background);
                color: var(--color-text);
            }
            
            body.dark-theme #message-input {
                background-color: var(--color-light);
                color: var(--color-text);
                border-color: var(--color-border);
            }
            
            body.dark-theme #message-input:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px rgba(80, 116, 151, 0.3);
            }
            
            body.dark-theme #api-config-modal div {
                background-color: var(--color-background);
                color: var(--color-text);
            }
            
            body.dark-theme #api-config-modal h2 {
                color: var(--color-text);
            }
            
            body.dark-theme #api-key {
                background-color: var(--color-light);
                color: var(--color-text);
                border-color: var(--color-border);
            }
            
            body.dark-theme #api-key:focus {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 3px rgba(80, 116, 151, 0.3);
            }
            
            body.dark-theme #api-config-modal p {
                color: var(--color-text-light);
            }
            
            body.dark-theme #close-api-modal {
                color: var(--color-text-light);
            }
            
            body.dark-theme #close-api-modal:hover {
                color: var(--color-text);
            }
        `;
    }
}

// 初始化AI助手
const aiAssistant = new AIAssistant();

// 导出AI助手实例供其他文件使用（如果需要）
if (typeof window !== 'undefined') {
    window.aiAssistant = aiAssistant;
}