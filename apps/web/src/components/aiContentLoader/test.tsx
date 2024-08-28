import React, { useEffect } from 'react';

const CustomChatbotLoader: React.FC = () => {
  useEffect(() => {
    // Configuration script
    const configScript = document.createElement('script');
    configScript.text = `
      window.newoaksIframeConfig = {
        chatbotId: "9ff8796d9d804e9db5e3aea6ce0dcbdf",
        domain: "https://chatbot.speakdaddy.com"
      };
    `;
    document.body.appendChild(configScript);

    // External script that uses the configuration
    const script = document.createElement('script');
    script.src = "https://chatbot.speakdaddy.com/embed.iframe.js";
    script.charset = "utf-8";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(configScript);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full h-full">
      <iframe
        src="https://chatbot.speakdaddy.com/chatbot-iframe/9ff8796d9d804e9db5e3aea6ce0dcbdf"
        id="chatbot-iframe"
        style={{ border: '1px solid #e5e7eb', width: '100%', height: '100%' }}
        frameBorder="0"
      />
    </div>
  );
};

export default CustomChatbotLoader;
