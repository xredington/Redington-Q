import { CircleDollarSign, CirclePercent, Component, Cpu, HandCoins, MonitorPlay, Presentation, Route, SquareMousePointer, SquarePen } from 'lucide-react';

// Define the type for the components that may include specific fields like script attributes
interface ScriptAttributes {
  [key: string]: string;
}

// Define the type for component script configurations
interface ScriptConfig {
  src: string;
  charset: string;
}

// Define the main interface for each AI component
export interface AIComponent {
  id: string;
  name: string;
  type: "iframe" | "script";
  src: string;
  title: string;
  className: string;
  allow?: string;
  icon?: React.ComponentType;
  allowfullscreen?: boolean;
  attributes?: ScriptAttributes;
  defer?: boolean;
  script?: ScriptConfig;
  config?: {
    chatbotId: string;
    domain: string;
  };
  img_url: string;
  layout?: number[]
}

// Define the interface for each subcategory, which includes a name and description
interface AISubcategory {
  name: string;
  description?: string;
  components?: AIComponent[];
}


// Define the main interface for each category, which includes subcategories and components
export interface AICategory {
  category: string;
  components: AISubcategory[];

}

// Define the AI array using the interfaces
export const AI: AICategory[] = [
  {
    category: "QCall",
    components: [{
      name: "Aruba",
      description: "Aruba is an automated system that handles calls, allowing interaction via voice commands and providing responses based on pre-defined logic or AI-driven understanding.",
      components: [
        {
          name: "Superdash",
          id: "superdash",
          type: "iframe",
          src: "https://www.superdashhq.com/voiceembed?projectID=664dd3e618e528bdcdbb56c2",
          allow: "microphone",
          title: "Favorite AI Agent",
          className: "md:col-span-1",
          img_url: "/assets/ai/card-cover-1.png",
        },
        {
          name: "Amy Gorani",
          id: "amy",
          type: "iframe",
          src: "https://www.superdashhq.com/voiceembed?projectID=66866c0778158adf4c7b326a",
          allow: "microphone",
          title: "Sales Consultant for HPE GreenLake",
          className: "md:col-span-1",
          img_url: "/assets/ai/card-cover-2.png",
        },
        {
          name: "Nancy Khalil",
          id: "nancy",
          type: "iframe",
          src: "https://www.superdashhq.com/voiceembed?projectID=66879dbd3c40e9cdf374f891",
          allow: "microphone",
          title: "Pre-Sales Consultant for Aruba EdgeConnect",
          className: "md:col-span-1",
          img_url: "/assets/ai/card-cover-1.png",
        },
      ]
    },
    {
      name: "HP",
    },
    {
      name: "Fortinet",
    },
    {
      name: "Huawei",
    },
    ]

  },
  {
    category: "QLearn",
    components: [
      {
        name: "Aruba",
        description: "QLearn Aruba provides tools and resources for creating and delivering interactive learning experiences using AI to adapt and personalize the educational content.",
        components: [
          {
            name: "Redington Aruba",
            id: "course-content-ai",
            type: "iframe",
            icon: Presentation,
            src: "https://aruba-redington.unschooler.me/",
            title: "Course Content AI",
            className: 'md:col-span-1',
            img_url: "/assets/ai/card-cover-1.png",
          },
          {
            name: "Onetake",
            id: "bite-sized-video-ai",
            type: "iframe",
            src: "https://my.onetake.ai/4e26f8a0/a6ee6785/",
            title: "Byte Sized Video AI",
            allow: "autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen",
            allowfullscreen: true,
            icon: MonitorPlay,
            className: 'md:col-span-1',
            img_url: "/assets/ai/card-cover-2.png",
            layout: [23.4, 76.5]
          },
          {
            name: "Enles Labs",
            id: "mind-map-ai",
            type: "iframe",
            src: "https://mindmap.enleslabs.com/finn.html?m=7EJlP&app=embed&ro=1",
            title: "Mind Map AI",
            icon: Route,
            className: 'md:col-span-1',
            img_url: "/assets/ai/card-cover-1.png",
          },
          {
            name: "Sharefable",
            id: "interactive-demo",
            type: "iframe",
            src: "https://share.layerpath.com/e/clya0ry940012l90chpiq2hll/tour",
            title: "Interactive Demo",
            icon: SquareMousePointer,
            allowfullscreen: true,
            className: 'md:col-span-1',
            img_url: "/assets/ai/card-cover-2.png",

          }
        ]

      },
      {
        name: "HP",
      },
      {
        name: "Fortinet",
      },
      {
        name: "Huawei",
      },
    ]

  },
  {
    category: "QChat",
    components: [
      {
        name: "Aruba",
        description: "Aruba Agents are specialized AI tools designed for various tasks including sales, pricing, technical support, and more, each tailored to specific business functions.",
        components: [
          {
            name: "Answerly",
            id: "sales-ai",
            type: "script",
            src: "https://answerly.chat/c527df7d-35b5-4569-b17b-8de053eaa1cf",
            title: "Sales AI",
            icon: HandCoins,
            className: 'md:col-span-1',
            img_url: "/assets/ai/card-cover-1.png",
            attributes: {
              id: "c527df7d-35b5-4569-b17b-8de053eaa1cf",
              "data-company-id": "58ea11cb-e693-4327-9abb-355b3afad4d4",
              "data-product-name": "Chatbot",
              "data-product-iframe": "create"
            },
          },
          {
            name: "Use Mevo",
            id: "price-master-ai",
            type: "iframe",
            icon: CircleDollarSign,
            src: "https://bot.usemevo.com/664c918177f6b4fb78096956",
            title: "Price Master AI",
            className: 'md:col-span-1',
            img_url: "/assets/ai/card-cover-2.png",
          },
          {
            name: "Speakdaddy Tech",
            id: "tech-ai",
            type: "script",
            src: "https://chatbot.speakdaddy.com/chatbot-iframe/9ff8796d9d804e9db5e3aea6ce0dcbdf",
            title: "Tech AI",
            className: 'md:col-span-1',
            icon: Cpu,
            script: {
              src: "https://chatbot.speakdaddy.com/embed.iframe.js",
              charset: "utf-8"
            },
            config: {
              chatbotId: "9ff8796d9d804e9db5e3aea6ce0dcbdf",
              domain: "https://chatbot.speakdaddy.com"
            },
            img_url: "/assets/ai/card-cover-1.png",
          },
          {
            name: "Retune",
            id: "pre-sales-ai",
            type: "iframe",
            src: "https://retune.so/share/chat/11eed08b-ce12-9560-9f8a-13daa467f919/widget?thread=11ef3dbe-831a-d8b0-9157-4fae377d708a",
            title: "Pre-Sales AI",
            icon: CirclePercent,
            className: 'md:col-span-1',
            attributes: {
              "data-chat-frame": "11eed08b-ce12-9560-9f8a-13daa467f919"
            },
            defer: true,
            img_url: "/assets/ai/card-cover-2.png",
          },
          {
            name: "Speakdaddy Designer",
            id: "designer-ai",
            type: "script",
            src: "https://chatbot.speakdaddy.com/share/4cdf3becfd6a471b8621c96d8545896d",
            title: "Designer AI",
            icon: Component,
            className: 'md:col-span-1',
            script: {
              src: "https://chatbot.speakdaddy.com/embed.iframe.js",
              charset: "utf-8"
            },
            config: {
              chatbotId: "4cdf3becfd6a471b8621c96d8545896d",
              domain: "https://chatbot.speakdaddy.com"
            },
            img_url: "/assets/ai/card-cover-1.png",
          },
          {
            name: "Eraser",
            id: "diagram-ai",
            type: "iframe",
            src: "https://app.eraser.io/auth/sign-in",
            title: "Diagram AI",
            className: 'md:col-span-1',
            icon: SquarePen,
            img_url: "/assets/ai/card-cover-1.png",
          }
        ]
      },
      {
        name: "HP",
      },
      {
        name: "Fortinet",
      },
      {
        name: "Huawei",
      },
    ]

  }
];
