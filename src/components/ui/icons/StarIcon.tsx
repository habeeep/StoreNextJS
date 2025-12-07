import { IconProps } from "@/types/icon";

export const StarIcon = ({ 
  size = 24,
  strokeWidth = 3,
  color = 'currentColor', 
  isFilled = false ,
  ...props 
}: IconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45"
      fill={isFilled ? color : 'none'}
      xmlns="http://www.w3.org/2000/svg" 
      {...props}
    >
      <path
        d="M22.5 3.83325L28.2938 15.8316L41.25 17.7674L31.875 27.1016L34.0875 40.2883L22.5 34.0591L10.9125 40.2883L13.125 27.1016L3.75 17.7674L16.7062 15.8316L22.5 3.83325Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};