import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const LoginIcon = ({ 
  size = 24,
  strokeWidth = 3,
  color = 'currentColor', 
  ...props 
}: IconProps) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 45 45"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      {...props}
    >
      <path 
        d="M28.75 5.625H36.4167C37.4333 5.625 38.4084 6.02009 39.1272 6.72335C39.8461 7.42661 40.25 8.38044 40.25 9.375V35.625C40.25 36.6196 39.8461 37.5734 39.1272 38.2766C38.4084 38.9799 37.4333 39.375 36.4167 39.375H28.75M19.1667 31.875L28.75 22.5M28.75 22.5L19.1667 13.125M28.75 22.5H5.75"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
