import { IconProps } from "@/types/icon";

export const PlusIcon = ({ 
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
        d="M22.9997 9.58325V36.4166M9.58301 22.9999H36.4163"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};