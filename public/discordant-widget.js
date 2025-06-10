/**
 * Discordant Widget Client Library
 * 
 * Easy integration of Discordant chat functionality into any website.
 * 
 * Usage:
 * <script src="/discordant-widget.js"></script>
 * <script>
 *   DiscordantWidget.init({
 *     discordantUrl: 'https://your-discordant.com',
 *     channelId: 'your-channel-id',
 *     apiToken: 'your-api-token',
 *     theme: 'light', // or 'dark'
 *     position: 'bottom-right' // bottom-left, bottom-right, etc.
 *   });
 * </script>
 */

(function(window) {
    'use strict';

    const DiscordantWidget = {
        // Default configuration
        config: {
            discordantUrl: '',
            channelId: '',
            apiToken: '',
            theme: 'light',
            position: 'bottom-right',
            title: 'Chat Support',
            placeholder: 'Type your message...',
            welcomeMessage: '👋 Hi! How can I help you today?',
            minimized: false,
            autoOpen: false,
            showOnPages: [], // Empty = show on all pages
            hideOnPages: [],
            visitorData: {
                name: '',
                email: '',
                page: window.location.href
            }
        },

        // Widget state
        state: {
            isOpen: false,
            isMinimized: false,
            isConnected: false,
            sessionId: null,
            socket: null,
            iframe: null,
            container: null,
            badge: null,
            unreadCount: 0
        },

        // Initialize the widget
        init: function(options) {
            // Merge configuration
            this.config = Object.assign({}, this.config, options);
            
            // Generate session ID
            this.state.sessionId = this.generateSessionId();
            
            // Check if widget should be shown on this page
            if (!this.shouldShowOnCurrentPage()) {
                return;
            }

            // Create widget container
            this.createWidget();
            
            // Auto-open if configured
            if (this.config.autoOpen) {
                setTimeout(() => this.open(), 1000);
            }

            // Listen for page visibility changes
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.handlePageHidden();
                } else {
                    this.handlePageVisible();
                }
            });

            // Track page view
            this.trackActivity('page-view', {
                url: window.location.href,
                title: document.title,
                referrer: document.referrer
            });

            console.log('[Discordant Widget] Initialized successfully');
        },

        // Check if widget should be shown on current page
        shouldShowOnCurrentPage: function() {
            const currentPath = window.location.pathname;
            
            // Check hide list first
            if (this.config.hideOnPages.length > 0) {
                for (let path of this.config.hideOnPages) {
                    if (currentPath.includes(path)) {
                        return false;
                    }
                }
            }
            
            // Check show list
            if (this.config.showOnPages.length > 0) {
                for (let path of this.config.showOnPages) {
                    if (currentPath.includes(path)) {
                        return true;
                    }
                }
                return false; // Not in show list
            }
            
            return true; // Show on all pages by default
        },

        // Create the widget UI
        createWidget: function() {
            // Create container
            this.state.container = document.createElement('div');
            this.state.container.id = 'discordant-widget';
            this.state.container.style.cssText = this.getContainerStyles();
            
            // Create toggle button
            const toggleButton = document.createElement('button');
            toggleButton.id = 'discordant-toggle';
            toggleButton.innerHTML = this.getToggleButtonHTML();
            toggleButton.style.cssText = this.getToggleButtonStyles();
            toggleButton.addEventListener('click', () => this.toggle());
            
            // Create badge for unread count
            this.state.badge = document.createElement('div');
            this.state.badge.id = 'discordant-badge';
            this.state.badge.style.cssText = this.getBadgeStyles();
            this.state.badge.style.display = 'none';
            
            // Create iframe container
            const iframeContainer = document.createElement('div');
            iframeContainer.id = 'discordant-iframe-container';
            iframeContainer.style.cssText = this.getIframeContainerStyles();
            iframeContainer.style.display = 'none';
            
            // Assemble widget
            this.state.container.appendChild(toggleButton);
            this.state.container.appendChild(this.state.badge);
            this.state.container.appendChild(iframeContainer);
            
            // Add to page
            document.body.appendChild(this.state.container);
        },

        // Open the widget
        open: function() {
            if (this.state.isOpen) return;
            
            this.state.isOpen = true;
            const iframeContainer = document.getElementById('discordant-iframe-container');
            
            if (!this.state.iframe) {
                this.createIframe();
            }
            
            iframeContainer.style.display = 'block';
            setTimeout(() => {
                iframeContainer.style.transform = 'translateY(0)';
                iframeContainer.style.opacity = '1';
            }, 10);
            
            this.trackActivity('widget-opened', {
                timestamp: new Date().toISOString()
            });
        },

        // Close the widget
        close: function() {
            if (!this.state.isOpen) return;
            
            this.state.isOpen = false;
            const iframeContainer = document.getElementById('discordant-iframe-container');
            
            iframeContainer.style.transform = 'translateY(100%)';
            iframeContainer.style.opacity = '0';
            
            setTimeout(() => {
                iframeContainer.style.display = 'none';
            }, 300);
            
            this.trackActivity('widget-closed', {
                timestamp: new Date().toISOString()
            });
        },

        // Toggle widget open/close
        toggle: function() {
            if (this.state.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        // Create the iframe
        createIframe: function() {
            const iframeContainer = document.getElementById('discordant-iframe-container');
            
            this.state.iframe = document.createElement('iframe');
            this.state.iframe.id = 'discordant-iframe';
            this.state.iframe.style.cssText = this.getIframeStyles();
            
            // Build iframe URL with parameters
            const params = new URLSearchParams({
                channelId: this.config.channelId,
                token: this.config.apiToken,
                theme: this.config.theme,
                sessionId: this.state.sessionId,
                page: window.location.href
            });
            
            // Add visitor data if available
            if (this.config.visitorData.name) {
                params.set('name', this.config.visitorData.name);
            }
            if (this.config.visitorData.email) {
                params.set('email', this.config.visitorData.email);
            }
            
            this.state.iframe.src = `${this.config.discordantUrl}/embed/chat?${params.toString()}`;
            iframeContainer.appendChild(this.state.iframe);

            // Listen for iframe messages
            window.addEventListener('message', (event) => {
                if (event.origin !== new URL(this.config.discordantUrl).origin) {
                    return;
                }
                
                this.handleIframeMessage(event.data);
            });
        },

        // Handle messages from iframe
        handleIframeMessage: function(data) {
            switch (data.type) {
                case 'message-sent':
                    this.handleMessageSent(data);
                    break;
                case 'message-received':
                    this.handleMessageReceived(data);
                    break;
                case 'connection-status':
                    this.handleConnectionStatus(data);
                    break;
                case 'resize':
                    this.handleResize(data);
                    break;
            }
        },

        // Handle message sent from widget
        handleMessageSent: function(data) {
            this.trackActivity('message-sent', {
                messageId: data.messageId,
                length: data.content ? data.content.length : 0
            });
        },

        // Handle message received in widget
        handleMessageReceived: function(data) {
            if (!this.state.isOpen) {
                this.incrementUnreadCount();
                this.showNotification(data.sender, data.content);
            }
        },

        // Handle connection status changes
        handleConnectionStatus: function(data) {
            this.state.isConnected = data.connected;
            this.updateToggleButton();
        },

        // Handle iframe resize requests
        handleResize: function(data) {
            if (data.height) {
                const iframeContainer = document.getElementById('discordant-iframe-container');
                iframeContainer.style.height = data.height + 'px';
            }
        },

        // Update toggle button appearance
        updateToggleButton: function() {
            const button = document.getElementById('discordant-toggle');
            if (this.state.isConnected) {
                button.classList.remove('disconnected');
            } else {
                button.classList.add('disconnected');
            }
        },

        // Increment unread count
        incrementUnreadCount: function() {
            this.state.unreadCount++;
            this.updateBadge();
        },

        // Reset unread count
        resetUnreadCount: function() {
            this.state.unreadCount = 0;
            this.updateBadge();
        },

        // Update unread badge
        updateBadge: function() {
            if (this.state.unreadCount > 0) {
                this.state.badge.textContent = this.state.unreadCount > 99 ? '99+' : this.state.unreadCount.toString();
                this.state.badge.style.display = 'block';
            } else {
                this.state.badge.style.display = 'none';
            }
        },

        // Show browser notification
        showNotification: function(sender, content) {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`New message from ${sender}`, {
                    body: content.slice(0, 100),
                    icon: `${this.config.discordantUrl}/favicon.ico`,
                    tag: 'discordant-message'
                });
            }
        },

        // Request notification permission
        requestNotificationPermission: function() {
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        },

        // Track visitor activity
        trackActivity: function(type, data) {
            if (!this.config.apiToken) return;

            fetch(`${this.config.discordantUrl}/api/external/visitor-activity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.apiToken}`
                },
                body: JSON.stringify({
                    sessionId: this.state.sessionId,
                    type: type,
                    data: data,
                    channelId: this.config.channelId,
                    visitorData: {
                        ...this.config.visitorData,
                        metadata: {
                            userAgent: navigator.userAgent,
                            language: navigator.language,
                            platform: navigator.platform,
                            cookieEnabled: navigator.cookieEnabled,
                            onLine: navigator.onLine
                        }
                    }
                })
            }).catch(error => {
                console.warn('[Discordant Widget] Failed to track activity:', error);
            });
        },

        // Handle page hidden
        handlePageHidden: function() {
            this.trackActivity('page-hidden', {
                timestamp: new Date().toISOString()
            });
        },

        // Handle page visible
        handlePageVisible: function() {
            this.trackActivity('page-visible', {
                timestamp: new Date().toISOString()
            });
            
            if (this.state.isOpen) {
                this.resetUnreadCount();
            }
        },

        // Generate session ID
        generateSessionId: function() {
            return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        },

        // Update visitor data
        setVisitorData: function(data) {
            this.config.visitorData = Object.assign({}, this.config.visitorData, data);
        },

        // CSS Styles
        getContainerStyles: function() {
            const position = this.config.position;
            let positionStyles = 'bottom: 20px; right: 20px;';
            
            if (position.includes('left')) {
                positionStyles = positionStyles.replace('right: 20px;', 'left: 20px;');
            }
            if (position.includes('top')) {
                positionStyles = positionStyles.replace('bottom: 20px;', 'top: 20px;');
            }
            
            return `
                position: fixed;
                ${positionStyles}
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            `;
        },

        getToggleButtonStyles: function() {
            return `
                width: 60px;
                height: 60px;
                border-radius: 50%;
                border: none;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                position: relative;
            `;
        },

        getBadgeStyles: function() {
            return `
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ff4757;
                color: white;
                border-radius: 10px;
                min-width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            `;
        },

        getIframeContainerStyles: function() {
            return `
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
                transform: translateY(100%);
                opacity: 0;
                transition: all 0.3s ease;
                overflow: hidden;
            `;
        },

        getIframeStyles: function() {
            return `
                width: 100%;
                height: 100%;
                border: none;
                border-radius: 12px;
            `;
        },

        getToggleButtonHTML: function() {
            return `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H16M8 8H16M8 16H16M21 12C21 16.4183 16.4183 21 12 21C7.58172 21 3 16.4183 3 12C3 7.58172 7.58172 3 12 3C16.4183 3 21 7.58172 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    };

    // Public API methods
    const PublicAPI = {
        init: function(options) {
            DiscordantWidget.init(options);
        },
        
        open: function() {
            DiscordantWidget.open();
        },
        
        close: function() {
            DiscordantWidget.close();
        },
        
        toggle: function() {
            DiscordantWidget.toggle();
        },
        
        setVisitorData: function(data) {
            DiscordantWidget.setVisitorData(data);
        },
        
        requestNotificationPermission: function() {
            DiscordantWidget.requestNotificationPermission();
        },
        
        getSessionId: function() {
            return DiscordantWidget.state.sessionId;
        },
        
        isOpen: function() {
            return DiscordantWidget.state.isOpen;
        },
        
        isConnected: function() {
            return DiscordantWidget.state.isConnected;
        }
    };

    // Expose to global scope
    window.DiscordantWidget = PublicAPI;

    // Auto-initialize if data attributes are present
    document.addEventListener('DOMContentLoaded', function() {
        const scriptTag = document.querySelector('script[src*="discordant-widget.js"]');
        if (scriptTag) {
            const dataset = scriptTag.dataset;
            if (dataset.discordantUrl && dataset.channelId && dataset.apiToken) {
                PublicAPI.init({
                    discordantUrl: dataset.discordantUrl,
                    channelId: dataset.channelId,
                    apiToken: dataset.apiToken,
                    theme: dataset.theme || 'light',
                    position: dataset.position || 'bottom-right',
                    autoOpen: dataset.autoOpen === 'true',
                    visitorData: {
                        name: dataset.visitorName || '',
                        email: dataset.visitorEmail || ''
                    }
                });
            }
        }
    });

})(window); 