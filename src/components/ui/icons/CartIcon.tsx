import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const CartIcon = ({ 
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
        d="M1.91699 1.91675H9.58366L14.7203 27.5809C14.8956 28.4633 15.3756 29.256 16.0765 29.8202C16.7773 30.3843 17.6542 30.684 18.5537 30.6667H37.1837C38.0832 30.684 38.9601 30.3843 39.6609 29.8202C40.3617 29.256 40.8417 28.4633 41.017 27.5809L44.0837 11.5001H11.5003M19.167 40.2501C19.167 41.3086 18.3089 42.1667 17.2503 42.1667C16.1918 42.1667 15.3337 41.3086 15.3337 40.2501C15.3337 39.1915 16.1918 38.3334 17.2503 38.3334C18.3089 38.3334 19.167 39.1915 19.167 40.2501ZM40.2503 40.2501C40.2503 41.3086 39.3922 42.1667 38.3337 42.1667C37.2751 42.1667 36.417 41.3086 36.417 40.2501C36.417 39.1915 37.2751 38.3334 38.3337 38.3334C39.3922 38.3334 40.2503 39.1915 40.2503 40.2501Z"
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};