import { IconProps } from "@/types/icon";

export const SearchIcon = ({ 
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
        d="M40.25 40.25L31.9125 31.9125M36.4167 21.0833C36.4167 29.5517 29.5517 36.4167 21.0833 36.4167C12.615 36.4167 5.75 29.5517 5.75 21.0833C5.75 12.615 12.615 5.75 21.0833 5.75C29.5517 5.75 36.4167 12.615 36.4167 21.0833Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};