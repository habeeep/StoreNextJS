import { IconProps } from "@/types/icon";

export const DotsIcon = ({ 
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
        d="M23.0003 24.375C24.0589 24.375 24.917 23.5355 24.917 22.5C24.917 21.4645 24.0589 20.625 23.0003 20.625C21.9418 20.625 21.0837 21.4645 21.0837 22.5C21.0837 23.5355 21.9418 24.375 23.0003 24.375Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M36.417 24.375C37.4755 24.375 38.3337 23.5355 38.3337 22.5C38.3337 21.4645 37.4755 20.625 36.417 20.625C35.3584 20.625 34.5003 21.4645 34.5003 22.5C34.5003 23.5355 35.3584 24.375 36.417 24.375Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path
        d="M9.58366 24.375C10.6422 24.375 11.5003 23.5355 11.5003 22.5C11.5003 21.4645 10.6422 20.625 9.58366 20.625C8.52511 20.625 7.66699 21.4645 7.66699 22.5C7.66699 23.5355 8.52511 24.375 9.58366 24.375Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};