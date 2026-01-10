import { IconProps } from "@/types/icon";

export const EditIcon = ({ 
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
        d="M21.083 7.50006H7.66634C6.64968 7.50006 5.67465 7.89515 4.95576 8.59841C4.23688 9.30167 3.83301 10.2555 3.83301 11.2501V37.5001C3.83301 38.4946 4.23688 39.4484 4.95576 40.1517C5.67465 40.855 6.64968 41.2501 7.66634 41.2501H34.4997C35.5163 41.2501 36.4914 40.855 37.2102 40.1517C37.9291 39.4484 38.333 38.4946 38.333 37.5001V24.3751M35.458 4.68756C36.2205 3.94164 37.2547 3.52258 38.333 3.52258C39.4113 3.52258 40.4455 3.94164 41.208 4.68756C41.9705 5.43348 42.3989 6.44517 42.3989 7.50006C42.3989 8.55495 41.9705 9.56664 41.208 10.3126L22.9997 28.1251L15.333 30.0001L17.2497 22.5001L35.458 4.68756Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
