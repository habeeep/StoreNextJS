import { IconProps } from "@/types/icon";

export const HomeIcon = ({ 
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
        d="M17.25 41.25V22.5H28.75V41.25M5.75 16.875L23 3.75L40.25 16.875V37.5C40.25 38.4946 39.8461 39.4484 39.1272 40.1516C38.4084 40.8549 37.4333 41.25 36.4167 41.25H9.58333C8.56667 41.25 7.59165 40.8549 6.87276 40.1516C6.15387 39.4484 5.75 38.4946 5.75 37.5V16.875Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};