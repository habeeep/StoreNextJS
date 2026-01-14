import { IconProps } from "@/types/icon";

export const BriefcaseIcon = ({ 
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
        d="M30.6663 40.25V9.58333C30.6663 8.56667 30.2625 7.59165 29.5436 6.87276C28.8247 6.15387 27.8497 5.75 26.833 5.75H19.1663C18.1497 5.75 17.1747 6.15387 16.4558 6.87276C15.7369 7.59165 15.333 8.56667 15.333 9.58333V40.25M7.66634 13.4167H38.333C40.4501 13.4167 42.1663 15.1329 42.1663 17.25V36.4167C42.1663 38.5338 40.4501 40.25 38.333 40.25H7.66634C5.54925 40.25 3.83301 38.5338 3.83301 36.4167V17.25C3.83301 15.1329 5.54925 13.4167 7.66634 13.4167Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};