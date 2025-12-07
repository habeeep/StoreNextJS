import { IconProps } from "@/types/icon";

export const NewsIcon = ({ 
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
        d="M5.625 16.875H39.375M16.875 39.375V16.875M9.375 5.625H35.625C37.6961 5.625 39.375 7.30393 39.375 9.375V35.625C39.375 37.6961 37.6961 39.375 35.625 39.375H9.375C7.30393 39.375 5.625 37.6961 5.625 35.625V9.375C5.625 7.30393 7.30393 5.625 9.375 5.625Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};