import React, { useEffect } from 'react';
import { AIComponent } from '@/constants/AiComponents';

interface AIDynamicLoaderProps {
  component: AIComponent;
}

const AiContentLoader: React.FC<AIDynamicLoaderProps> = ({ component }) => {
  const { type, src, allow, allowfullscreen, attributes, className, title, script, config } = component;

  useEffect(() => {
    if (type === 'script' && config && script) {
      // Set configuration in window object
      const configScript = document.createElement('script');
      configScript.text = `
        window.newoaksIframeConfig = {
          chatbotId: "${config.chatbotId}",
          domain: "${config.domain}"
        };
      `;
      document.body.appendChild(configScript);

      // Load external script
      const externalScript = document.createElement('script');
      Object.entries(attributes || {}).forEach(([key, value]) => {
        externalScript.setAttribute(key, value);
      });
      externalScript.src = script.src;
      externalScript.charset = script.charset;
      externalScript.defer = true;
      document.body.appendChild(externalScript);

      return () => {
        document.body.removeChild(configScript);
        document.body.removeChild(externalScript);
      };
    }
  }, [type, src, config, script, attributes]);

  return (
    <div className="w-full !h-full ">
      {type === 'iframe' && (
        <iframe
          src={src}
          title={title}
          className={`w-full h-full ${className} object-cover`}
          allow={allow}
          allowFullScreen={allowfullscreen}
          style={{ border: 'none' }}
        />
      )}
      {type === 'script' && (
        <iframe
          src={src}
          title={title}
          id="chatbot-iframe"
          className={`w-full h-full ${className} object-cover`}
          frameBorder="0"
          allowFullScreen={allowfullscreen}
          style={{ border: 'none' }}
        />
      )}
    </div>
  );
};

export default AiContentLoader;
