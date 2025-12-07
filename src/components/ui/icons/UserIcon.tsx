import { IconProps } from "@/types/icon";

export const UserIcon = ({ 
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
        d="M38.3337 39.375V35.625C38.3337 33.6359 37.5259 31.7282 36.0881 30.3217C34.6504 28.9152 32.7003 28.125 30.667 28.125H15.3337C13.3003 28.125 11.3503 28.9152 9.91251 30.3217C8.47473 31.7282 7.66699 33.6359 7.66699 35.625V39.375M30.667 13.125C30.667 17.2671 27.2345 20.625 23.0003 20.625C18.7661 20.625 15.3337 17.2671 15.3337 13.125C15.3337 8.98286 18.7661 5.625 23.0003 5.625C27.2345 5.625 30.667 8.98286 30.667 13.125Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
