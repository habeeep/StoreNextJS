import { IconProps } from "@/types/icon";

export const CommentIcon = ({ 
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
        d="M40.25 28.125C40.25 29.1196 39.8461 30.0734 39.1272 30.7766C38.4084 31.4799 37.4333 31.875 36.4167 31.875H13.4167L5.75 39.375V9.375C5.75 8.38044 6.15387 7.42661 6.87276 6.72335C7.59165 6.02009 8.56667 5.625 9.58333 5.625H36.4167C37.4333 5.625 38.4084 6.02009 39.1272 6.72335C39.8461 7.42661 40.25 8.38044 40.25 9.375V28.125Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};