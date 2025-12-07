import { IconProps } from "@/types/icon";

export const CrossIcon = ({ 
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
        d="M33.75 11.25L11.25 33.75M11.25 11.25L33.75 33.75" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
