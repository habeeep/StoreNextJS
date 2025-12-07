import { IconProps } from "@/types/icon";

export const CatalogIcon = ({ 
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
        d="M5.75 11.4999L11.5 3.83325H34.5L40.25 11.4999M5.75 11.4999V38.3333C5.75 39.3499 6.15387 40.3249 6.87276 41.0438C7.59165 41.7627 8.56667 42.1666 9.58333 42.1666H36.4167C37.4333 42.1666 38.4084 41.7627 39.1272 41.0438C39.8461 40.3249 40.25 39.3499 40.25 38.3333V11.4999M5.75 11.4999H40.25M30.6667 19.1666C30.6667 21.1999 29.8589 23.15 28.4212 24.5877C26.9834 26.0255 25.0333 26.8333 23 26.8333C20.9667 26.8333 19.0166 26.0255 17.5788 24.5877C16.1411 23.15 15.3333 21.1999 15.3333 19.1666"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};