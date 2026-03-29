/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    "dotlottie-wc": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        autoplay?: boolean;
        loop?: boolean;
        layout?: string;
      },
      HTMLElement
    >;
  }
}

interface ImportMetaEnv {
  readonly VITE_HERO_VIDEO_URL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
