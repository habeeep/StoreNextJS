import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const CrossIcon = ({ 
  size = 24, 
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
        d="M33.75 11.25L11.25 33.75M11.25 11.25L33.75 33.75" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};