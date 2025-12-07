import { IconProps } from "@/types/icon";

export const EyeIcon = ({ 
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
        d="M1.875 22.5C1.875 22.5 9.375 7.5 22.5 7.5C35.625 7.5 43.125 22.5 43.125 22.5C43.125 22.5 35.625 37.5 22.5 37.5C9.375 37.5 1.875 22.5 1.875 22.5Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M22.5 28.125C25.6066 28.125 28.125 25.6066 28.125 22.5C28.125 19.3934 25.6066 16.875 22.5 16.875C19.3934 16.875 16.875 19.3934 16.875 22.5C16.875 25.6066 19.3934 28.125 22.5 28.125Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};