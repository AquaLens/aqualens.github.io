/**
 * Froggy Chat Website Script
 */

class FroggyChat {
    constructor() {
      this.USER_MESSAGE_CLASS = 'froggy-message froggy-user';
      this.AI_MESSAGE_CLASS = 'froggy-message froggy-froggy';
      this.API_ENDPOINT = 'https://aqualens-froggy-backend.hf.space/api/ask';
      this.RESET_ENDPOINT = 'https://aqualens-froggy-backend.hf.space/api/reset_conversation';
      this.HEALTH_ENDPOINT = 'https://aqualens-froggy-backend.hf.space/health';
      
      // Check if on the standalone froggy page
      this.isStandalonePage = document.body.classList.contains('froggy-standalone-page');
      
      // Initialize conversation tracking
      this.conversationContext = {
        sessionIds: [],
        messages: []
      };
      
      // Initialize session ID from localStorage if available
      this.sessionId = localStorage.getItem('froggy_session_id') || null;
      
      // If there is a session ID, add it to tracking
      if (this.sessionId) {
        this.conversationContext.sessionIds.push(this.sessionId);
      }
      
      this.hasAgreedToTerms = localStorage.getItem('froggy_terms_agreed') === 'true';
      
      this.init();
    }
    
    init() {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupElements();
        this.setupEventListeners();
        
        if (this.isStandalonePage) {
          this.setupStandalonePage();
        } else {
          this.setupResetButton();
        }
        
        // Check if conversation is empty and add welcome message if needed
        if (this.messages && this.messages.children.length === 0) {
          this.addMessageToConversation('Hello! I\'m Froggy, your guide to water quality initiatives and research. How can I help you today?', 'ai');
        }
      });
    }
    
    setupElements() {
      this.froggyBtn = document.getElementById('froggy-button');
      this.froggyPopup = document.getElementById('froggy-popup');
      this.froggyClose = document.getElementById('froggy-close');
      this.sendBtn = document.getElementById('froggy-send');
      this.textarea = document.getElementById('froggy-question');
      this.messages = document.getElementById('froggy-messages');
      this.disclaimerModal = document.getElementById('froggy-disclaimer-modal');
      this.agreeBtn = document.getElementById('froggy-agree');
      this.declineBtn = document.getElementById('froggy-decline');
    }
    
    setupStandalonePage() {
      // On standalone page, show disclaimer immediately if not agreed
      if (!this.hasAgreedToTerms) {
        this.showDisclaimer();
        // Hide the chat until terms are agreed
        if (this.froggyPopup) {
          this.froggyPopup.style.opacity = '0.3';
          this.froggyPopup.style.pointerEvents = 'none';
        }
      } else {
        // Show chat normally
        if (this.froggyPopup) {
          this.froggyPopup.style.opacity = '1';
          this.froggyPopup.style.pointerEvents = 'auto';
        }
      }
      
      // Remove close button on standalone page or replace with back functionality
      if (this.froggyClose) {
        this.froggyClose.style.display = 'none';
      }
      
      // Setup reset button for standalone page
      this.setupResetButtonStandalone();
    }
    
    setupEventListeners() {
      if (this.froggyBtn && !this.isStandalonePage) {
        this.froggyBtn.addEventListener('click', () => {
          if (!this.hasAgreedToTerms) {
            this.showDisclaimer();
          } else {
            this.openChat();
          }
        });
      }
      
      if (this.sendBtn) {
        this.sendBtn.addEventListener('click', () => this.handleSendMessage());
      }
      
      if (this.textarea) {
        this.textarea.addEventListener('keypress', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
          }
        });
      }
      
      // Disclaimer modal events
      if (this.agreeBtn) {
        this.agreeBtn.addEventListener('click', () => {
          this.agreeToTerms();
        });
      }
      
      if (this.declineBtn) {
        this.declineBtn.addEventListener('click', () => {
          this.declineTerms();
        });
      }
      
      // Close disclaimer on backdrop click (only for popup version)
      if (this.disclaimerModal && !this.isStandalonePage) {
        this.disclaimerModal.addEventListener('click', (e) => {
          if (e.target === this.disclaimerModal) {
            this.declineTerms();
          }
        });
      }
      
      // Close button functionality for popup version
      if (this.froggyClose && !this.isStandalonePage) {
        this.froggyClose.addEventListener('click', () => {
          this.froggyPopup.style.display = 'none';
        });
      }
    }
    
    setupResetButton() {
      const header = document.querySelector('.froggy-chat-header');
      if (header && this.froggyClose) {
        // Create reset button
        const resetBtn = document.createElement('button');
        resetBtn.id = 'froggy-reset';
        resetBtn.className = 'froggy-reset-button';
        resetBtn.textContent = 'New Chat';
        resetBtn.addEventListener('click', () => this.resetConversation());
        
        // Create container for header buttons
        const headerButtons = document.createElement('div');
        headerButtons.className = 'froggy-header-buttons';
        
        // Clone the close button (we'll remove the original)
        const newCloseBtn = this.froggyClose.cloneNode(true);
        newCloseBtn.addEventListener('click', () => {
          this.froggyPopup.style.display = 'none';
        });
        
        // Add buttons to container
        headerButtons.appendChild(resetBtn);
        headerButtons.appendChild(newCloseBtn);
        
        // Remove the original close button if it exists
        if (this.froggyClose.parentNode) {
          this.froggyClose.parentNode.removeChild(this.froggyClose);
        }
        
        // Add container to header
        header.appendChild(headerButtons);
      }
    }
    
    setupResetButtonStandalone() {
      const existingResetBtn = document.getElementById('froggy-reset');
      if (existingResetBtn) {
        existingResetBtn.addEventListener('click', () => this.resetConversation());
      }
    }
    
    showDisclaimer() {
      if (this.disclaimerModal) {
        this.disclaimerModal.style.display = 'flex';
      }
    }
    
    agreeToTerms() {
      this.hasAgreedToTerms = true;
      localStorage.setItem('froggy_terms_agreed', 'true');
      if (this.disclaimerModal) {
        this.disclaimerModal.style.display = 'none';
      }
      
      if (this.isStandalonePage) {
        // Enable the chat on standalone page
        if (this.froggyPopup) {
          this.froggyPopup.style.opacity = '1';
          this.froggyPopup.style.pointerEvents = 'auto';
        }
      } else {
        this.openChat();
      }
    }
    
    declineTerms() {
      if (this.disclaimerModal) {
        this.disclaimerModal.style.display = 'none';
      }
      
      if (this.isStandalonePage) {
        // Redirect away from the page
        if (document.referrer) {
          // Go back to previous page
          window.history.back();
        } else {
          // Fallback to home page
          window.location.href = '/';
        }
      }
    }
    
    openChat() {
      if (this.froggyPopup && !this.isStandalonePage) {
        this.froggyPopup.style.display = 'flex';
      }
    }
    
    async handleSendMessage() {
      const text = this.textarea.value.trim();
      if (!text) return;
      
      // Clear input field
      this.textarea.value = '';
      
      // Add user message to conversation
      this.addMessageToConversation(text, 'user');
      
      // Store message in context
      this.conversationContext.messages.push({
        role: 'user',
        content: text,
        timestamp: new Date().toISOString()
      });
      
      // Add typing indicator
      const typingMsgId = 'typing-msg-' + Date.now();
      this.addTypingIndicator(typingMsgId);
      
      // Scroll to bottom of conversation
      this.messages.scrollTop = this.messages.scrollHeight;
      
      // Show a "waking up" hint after 3s, then count down the expected wake-up time
      const WAKEUP_HINT_DELAY_MS = 3000;
      const WAKEUP_SECONDS = 90;
      let wakeupIntervalId = null;

      // Ping the health check: if it answers, the server is awake and a slow reply is just Froggy thinking
      let serverAwake = false;
      fetch(this.HEALTH_ENDPOINT, { mode: 'cors', credentials: 'omit', cache: 'no-store' })
        .then(res => res.json())
        .then(data => { if (data.status === 'ok') serverAwake = true; })
        .catch(() => {});

      // AbortController times out when the wake-up countdown runs out (HF cold starts can take 30-60s)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WAKEUP_HINT_DELAY_MS + WAKEUP_SECONDS * 1000);

      const wakeupTimeoutId = setTimeout(() => {
        const typingMsg = document.getElementById(typingMsgId);
        if (!typingMsg || serverAwake) return;
        let secondsLeft = WAKEUP_SECONDS;
        typingMsg.innerHTML = '<div class="froggy-typing"><span></span><span></span><span></span></div><em>I haven\'t been asked a question in a while — just waking up. This might take a moment...<br>Expected wake-up time: <span class="froggy-wakeup-countdown">' + secondsLeft + '</span>s</em>';
        const countdownEl = typingMsg.querySelector('.froggy-wakeup-countdown');
        wakeupIntervalId = setInterval(() => {
          if (secondsLeft > 1) {
            secondsLeft--;
            countdownEl.textContent = secondsLeft;
          } else {
            clearInterval(wakeupIntervalId);
          }
        }, 1000);
      }, WAKEUP_HINT_DELAY_MS);

      try {
        // Send request to backend with all known session IDs
        const response = await fetch(this.API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'omit',
          body: JSON.stringify({
            question: text,
            session_id: this.sessionId,
            previous_sessions: this.conversationContext.sessionIds,
            message_history: this.conversationContext.messages.slice(-5)
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        clearTimeout(wakeupTimeoutId);
        clearInterval(wakeupIntervalId);

        // Remove typing indicator
        const typingMsg = document.getElementById(typingMsgId);
        if (typingMsg) {
          this.messages.removeChild(typingMsg);
        }

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Save session ID if provided
        if (data.session_id) {
          this.conversationContext.sessionIds.push(data.session_id);
          this.sessionId = data.session_id;
          localStorage.setItem('froggy_session_id', data.session_id);
        } else if (!this.sessionId && data.id) {
          this.conversationContext.sessionIds.push(data.id);
          this.sessionId = data.id;
          localStorage.setItem('froggy_session_id', data.id);
        }

        const froggyResponse = data.answer || 'Sorry, I couldn\'t find an answer to that question.';

        // Add AI response to conversation
        this.addMessageToConversation(froggyResponse, 'ai');

        // Store AI response in context
        this.conversationContext.messages.push({
          role: 'assistant',
          content: froggyResponse,
          timestamp: new Date().toISOString()
        });

        this.messages.scrollTop = this.messages.scrollHeight;

      } catch (error) {
        clearTimeout(timeoutId);
        clearTimeout(wakeupTimeoutId);
        clearInterval(wakeupIntervalId);

        // Remove typing indicator if it still exists
        const typingMsg = document.getElementById(typingMsgId);
        if (typingMsg) {
          this.messages.removeChild(typingMsg);
        }

        if (error.name === 'AbortError') {
          this.addMessageToConversation('It\'s taking longer than expected to get a response — the server might be waking up from sleep. Please try sending your question again in a moment.', 'ai');
        } else if (error.message && error.message.includes('Failed to fetch')) {
          this.addMessageToConversation('I can\'t reach the server right now. This might be because the backend is waking up from sleep mode. Please wait a few seconds and try again.', 'ai');
        } else {
          this.addMessageToConversation('Sorry, something went wrong on my end. Please try again in a moment.', 'ai');
        }

        this.messages.scrollTop = this.messages.scrollHeight;
      }
    }
    
    addMessageToConversation(message, sender) {
      const messageElement = document.createElement('div');
      messageElement.className = sender === 'user' ? this.USER_MESSAGE_CLASS : this.AI_MESSAGE_CLASS;
      
      // Add message content with markdown parsing for AI responses
      if (sender === 'ai') {
        // Parse markdown (basic implementation)
        let formattedMessage = message
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
          .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
          .replace(/\n\n/g, '<br><br>') // Paragraphs
          .replace(/\n/g, '<br>'); // Line breaks
        
        messageElement.innerHTML = formattedMessage;
      } else {
        messageElement.textContent = message;
      }
      
      // Add timestamp
      const timestampElement = document.createElement('div');
      timestampElement.className = 'froggy-timestamp';
      const now = new Date();
      timestampElement.textContent = now.toLocaleTimeString();
      messageElement.appendChild(timestampElement);
      
      // Add to container
      this.messages.appendChild(messageElement);
    }
    
    addTypingIndicator(id) {
      const msg = document.createElement('div');
      msg.id = id;
      msg.className = 'froggy-message froggy-froggy froggy-typing';
      msg.innerHTML = '<span>Thinking</span><span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>';
      this.messages.appendChild(msg);
    }
    
    resetConversation() {
      // Clear conversation display
      if (this.messages) {
        this.messages.innerHTML = '';
      }
      
      // Reset conversation context
      this.conversationContext = {
        sessionIds: [],
        messages: []
      };
      
      // Clear session ID
      this.sessionId = null;
      localStorage.removeItem('froggy_session_id');
      
      // API call to reset conversation on backend
      fetch(this.RESET_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({})
      })
      .then(response => response.json())
      .then(data => {
        console.log('Conversation reset:', data);
        
        // Add welcome message
        const welcomeMessage = 'Hello! I\'m Froggy, your guide to water quality initiatives and research. How can I help you today?';
        this.addMessageToConversation(welcomeMessage, 'ai');
        
        // Store welcome message in context
        this.conversationContext.messages.push({
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date().toISOString()
        });
        
        // If reset gives us a new session ID, store it
        if (data && data.session_id) {
          this.sessionId = data.session_id;
          this.conversationContext.sessionIds.push(data.session_id);
          localStorage.setItem('froggy_session_id', data.session_id);
        }
      })
      .catch(error => {
        console.error('Error resetting conversation:', error);
        // Add welcome message anyway
        const welcomeMessage = 'Hello! I\'m Froggy, your guide to water quality initiatives and research. How can I help you today?';
        this.addMessageToConversation(welcomeMessage, 'ai');
        
        // Store welcome message in context
        this.conversationContext.messages.push({
          role: 'assistant',
          content: welcomeMessage,
          timestamp: new Date().toISOString()
        });
      });
    }
}

// Initialize Froggy Chat when the script loads
new FroggyChat();