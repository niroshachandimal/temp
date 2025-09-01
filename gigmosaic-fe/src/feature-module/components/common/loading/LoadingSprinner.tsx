import { Spinner } from '@heroui/react';

interface LoadingProps {
  label?: string;
  variant?: 'default' | 'simple' | 'gradient' | 'wave' | 'spinner' | 'dots';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({
  label = 'Loading...',

  color = 'success',
  size = 'md',
}: LoadingProps) => {
  return (
    <>
      {/* <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm"> */}
      <div className="flex items-center justify-center w-full h-screen backdrop-blur-sm">
        <Spinner
          classNames={{ label: 'text-foreground text-sm' }}
          label={label}
          color={color}
          size={size}
        />
      </div>
    </>
  );
};

export default LoadingSpinner;
