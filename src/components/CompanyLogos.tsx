import React from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function OpenAILogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>OpenAI</title>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1635a.0804.0804 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4018-.6863zm2.0059-4.5428l-.142-.0852-4.7735-2.7819a.7759.7759 0 0 0-.7854 0L8.809 7.7101V5.3777a.071.071 0 0 1 .0331-.0615l4.9977-2.886a4.5087 4.5087 0 0 1 6.6023 4.2386zm-8.8872.4877l-2.7346-1.5761 2.7346-1.5761 2.7346 1.5761z" />
    </svg>
  );
}

export function GoogleDeepMindLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Google DeepMind</title>
      <rect x="2" y="2" width="8.5" height="8.5" rx="2" opacity="0.95" />
      <rect x="13.5" y="2" width="8.5" height="8.5" rx="2" opacity="0.75" />
      <rect x="2" y="13.5" width="8.5" height="8.5" rx="2" opacity="0.6" />
      <rect x="13.5" y="13.5" width="8.5" height="8.5" rx="2" opacity="0.95" />
      <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function AnthropicLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Anthropic</title>
      <path d="M13.827 3.5h3.693L24 20.5h-3.693l-1.89-4.52h-7.652l1.642-3.865h4.63l-2.42-5.787zm-7.654 0L0 20.5h3.693l1.89-4.52h7.652l-1.642-3.865H6.963l2.42-5.787H6.173z" />
    </svg>
  );
}

export function NvidiaLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>NVIDIA</title>
      <path d="M8.948 7.375c-.328 0-.646.04-.964.088-.06.009-.099.043-.11.103a8.91 8.91 0 0 0-.154 1.637c0 4.148 3.09 7.03 6.944 7.03 2.11 0 3.73-.787 5.234-2.28 0-.012.012-.023.012-.035.034-.047.034-.082 0-.129l-1.657-1.393c-.046-.035-.094-.035-.14 0-1.123.95-2.292 1.454-3.565 1.454-2.467 0-4.08-1.888-4.14-4.218h9.832c.07 0 .117-.035.129-.105a8.777 8.777 0 0 0 .153-1.647c0-4.149-3.418-7.51-7.85-7.51-.598 0-1.253.07-1.878.212-.07.012-.094.047-.094.106v1.946c0 .047.024.082.083.07a8.79 8.79 0 0 1 1.889-.2c2.89 0 5.128 2.03 5.374 4.793H8.948v.077zm-.035 11.453c-4.887 0-8.913-4.022-8.913-8.948a8.88 8.88 0 0 1 2.374-6.073c.036-.036.083-.036.118 0l1.643 1.63c.036.035.036.082 0 .117-1.255 1.255-1.89 2.766-1.89 4.326 0 3.693 3.02 6.697 6.668 6.697 2.146 0 3.824-.763 5.432-2.316.035-.035.07-.035.105 0l1.655 1.572c.035.035.035.082 0 .117-1.923 1.877-4.137 2.878-7.194 2.878zm.212 5.172c-7.744 0-14.125-6.38-14.125-14.12 0-3.353 1.233-6.52 3.486-8.948.035-.035.082-.035.117 0l1.63 1.63c.035.036.035.083 0 .118a11.97 11.97 0 0 0-2.98 7.2c0 6.474 5.27 11.745 11.743 11.745 3.754 0 7.234-1.748 9.544-4.78.035-.046.082-.046.117-.011l1.83 1.488c.036.036.036.083 0 .118-2.652 3.518-6.738 5.56-11.365 5.56z" />
    </svg>
  );
}

export function MetaLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Meta</title>
      <path d="M12.0004 8.7618c-1.393 0-2.6395.7334-3.4837 1.8797-1.0772 1.464-1.6865 3.4074-1.6865 5.3785 0 2.4552.9237 4.0957 2.4079 4.0957 1.2582 0 2.2195-1.1685 3.0116-2.5857.2917-.5214.5663-1.0927.8427-1.6749-1.092-2.148-1.092-7.0933-1.092-7.0933zm0 0c1.393 0 2.6396.7334 3.4838 1.8797 1.0772 1.464 1.6864 3.4074 1.6864 5.3785 0 2.4552-.9236 4.0957-2.4078 4.0957-1.2583 0-2.2196-1.1685-3.0117-2.5857-.2917-.5214-.5663-1.0927-.8427-1.6749 1.092-2.148 1.092-7.0933 1.092-7.0933zm6.3984-4.881c-2.3168 0-4.471 1.2804-5.6984 3.3276-1.2274-2.0472-3.3816-3.3276-5.6984-3.3276C2.697 3.8808 0 7.2346 0 12.015c0 5.433 3.6558 8.1042 6.8973 8.1042 2.6105 0 4.3644-1.6444 5.1027-2.684.7383 1.0396 2.4922 2.684 5.1027 2.684C20.3442 20.1192 24 17.448 24 12.015c0-4.7804-2.697-8.1342-6.0016-8.1342zM12 14.5368c-.682 1.439-1.643 3.12-3.136 3.12-1.306 0-2.37-1.328-2.37-3.637 0-1.897.664-3.793 1.815-5.267.892-1.144 2.115-1.81 3.691-1.81v7.594zm6.002.517c0 2.309-1.064 3.637-2.37 3.637-1.493 0-2.454-1.681-3.136-3.12v-7.594c1.576 0 2.799.666 3.691 1.81 1.151 1.474 1.815 3.37 1.815 5.267z" />
    </svg>
  );
}

export function NetflixLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Netflix</title>
      <path d="M5.398 0v24h3.996V8.135L14.6 24h4.002V0h-3.996v15.865L9.395 0z" />
    </svg>
  );
}

export function DiscordLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Discord</title>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

export function VercelLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Vercel</title>
      <path d="M24 22.525H0l12-21.05 12 21.05z" />
    </svg>
  );
}

export function HuggingFaceLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Hugging Face</title>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 2.22.724 4.27 1.95 5.932l-.46 2.76 2.76-.46A9.954 9.954 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-3.5 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-7.234 6.643a.75.75 0 0 1 1.042-.215c1.037.692 2.308 1.072 3.692 1.072 1.384 0 2.655-.38 3.692-1.072a.75.75 0 1 1 .828 1.25C14.186 17.96 13.125 18.5 12 18.5s-2.186-.54-3.522-1.429a.75.75 0 0 1-.212-1.028z" />
    </svg>
  );
}

export function UberLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Uber</title>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489v-4.526H6.5v-2.963h2.339V12c0-2.317 1.379-3.597 3.493-3.597.712 0 1.455.053 2.167.158v2.41h-1.22c-1.127 0-1.479.7-1.479 1.417v1.575h2.64l-.42 2.963h-2.22V21.5C18.146 20.25 22 16.57 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

export function StripeLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Stripe</title>
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.5 12.521.5 6.056.5 1.76 3.966 1.76 9.388c0 7.828 10.748 6.549 10.748 9.94 0 .979-.854 1.4-2.062 1.4-2.298 0-5.145-1.185-7.291-2.418L2.2 23.774C4.249 24.966 7.643 25.5 10.82 25.5c6.708 0 11.42-3.34 11.42-8.995 0-8.31-10.748-6.904-10.748-9.844 0-.75.642-1.2 1.745-1.2.98 0 2.45.362 3.86.993l.879-5.304z" />
    </svg>
  );
}

export function AirbnbLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Airbnb</title>
      <path d="M12.001 0C5.373 0 0 5.373 0 12c0 2.76 1.026 5.307 2.784 7.284l8.28-18.06c.216-.47.697-.774 1.217-.774.52 0 1.001.304 1.217.774l8.28 18.06C22.974 17.307 24 14.76 24 12c0-6.627-5.373-12-11.999-12zm.004 8.794a3.21 3.21 0 1 1 0 6.42 3.21 3.21 0 0 1 0-6.42z" />
    </svg>
  );
}

export function CloudflareLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Cloudflare</title>
      <path d="M18.244 9.35A6.002 6.002 0 0 0 12.5 5a6.002 6.002 0 0 0-5.744 4.35A5.002 5.002 0 0 0 2 14c0 2.761 2.239 5 5 5h11c2.761 0 5-2.239 5-5a5.002 5.002 0 0 0-4.756-4.65z" />
    </svg>
  );
}

export function SpotifyLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Spotify</title>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export function PinterestLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>Pinterest</title>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12.004-5.379 12.004-12.004C24.01 5.367 18.643 0 12.017 0z" />
    </svg>
  );
}

export function GitHubLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>GitHub</title>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function LinkedInLogo({ className = "w-6 h-6", size, ...props }: LogoProps) {
  return (
    <svg role="img" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} className={className} {...props}>
      <title>LinkedIn</title>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function CompanyLogo({ slug, className = "w-6 h-6", size }: { slug: string; className?: string; size?: number }) {
  switch (slug.toLowerCase()) {
    case "openai":
      return <OpenAILogo className={className} size={size} />;
    case "deepmind":
      return <GoogleDeepMindLogo className={className} size={size} />;
    case "anthropic":
      return <AnthropicLogo className={className} size={size} />;
    case "nvidia":
      return <NvidiaLogo className={className} size={size} />;
    case "meta":
      return <MetaLogo className={className} size={size} />;
    case "netflix":
      return <NetflixLogo className={className} size={size} />;
    case "uber":
      return <UberLogo className={className} size={size} />;
    case "stripe":
      return <StripeLogo className={className} size={size} />;
    case "airbnb":
      return <AirbnbLogo className={className} size={size} />;
    case "cloudflare":
      return <CloudflareLogo className={className} size={size} />;
    case "discord":
      return <DiscordLogo className={className} size={size} />;
    case "vercel":
      return <VercelLogo className={className} size={size} />;
    case "huggingface":
      return <HuggingFaceLogo className={className} size={size} />;
    case "spotify":
      return <SpotifyLogo className={className} size={size} />;
    case "pinterest":
      return <PinterestLogo className={className} size={size} />;
    case "github":
      return <GitHubLogo className={className} size={size} />;
    case "linkedin":
      return <LinkedInLogo className={className} size={size} />;
    default:
      return null;
  }
}
