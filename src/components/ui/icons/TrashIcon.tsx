import { IconProps } from "@/types/icon";

export const TrashIcon = ({ 
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
        d="M5.75 11.4999H9.58333M9.58333 11.4999H40.25M9.58333 11.4999V38.3333C9.58333 39.3499 9.9872 40.3249 10.7061 41.0438C11.425 41.7627 12.4 42.1666 13.4167 42.1666H32.5833C33.6 42.1666 34.575 41.7627 35.2939 41.0438C36.0128 40.3249 36.4167 39.3499 36.4167 38.3333V11.4999H9.58333ZM15.3333 11.4999V7.66659C15.3333 6.64992 15.7372 5.6749 16.4561 4.95601C17.175 4.23712 18.15 3.83325 19.1667 3.83325H26.8333C27.85 3.83325 28.825 4.23712 29.5439 4.95601C30.2628 5.6749 30.6667 6.64992 30.6667 7.66659V11.4999M19.1667 21.0833V32.5833M26.8333 21.0833V32.5833"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};