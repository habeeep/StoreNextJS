import { IconProps } from "@/types/icon";

export const GridIcon = ({ 
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
        d="M19.1667 5.625H5.75V18.75H19.1667V5.625Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M40.25 5.625H26.8333V18.75H40.25V5.625Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M40.25 26.25H26.8333V39.375H40.25V26.25Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M19.1667 26.25H5.75V39.375H19.1667V26.25Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};