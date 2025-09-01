import { Input } from '@heroui/react';
import { ReactNode } from 'react';

interface CustomInputProps {
  id?: string;
  label?: string;
  name?: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
  labelPlacement?: 'inside' | 'outside' | 'outside-left';
  errorMessage?: string;
  description?: string;
  defaultValue?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  endContent?: ReactNode;
  startContent?: ReactNode;
  onValueChange?: (value: string) => void;
  value?: string;
  className?: string;
}

const CustomInput = ({
  id,
  label = '',
  placeholder = 'Enter placeholder',
  size = 'md',
  radius = 'none',
  type = 'text',
  color = 'default',
  variant = 'bordered',
  labelPlacement = 'outside',
  description = '',
  errorMessage = '',
  isDisabled = false,
  isInvalid = false,
  defaultValue = '',
  name = '',
  startContent,
  endContent,
  onValueChange,
  value,
  className,
  ...props
}: CustomInputProps) => {
  return (
    <Input
      id={id}
      label={label}
      type={type}
      name={name}
      placeholder={placeholder}
      size={size}
      radius={radius}
      color={color}
      variant={variant}
      defaultValue={defaultValue}
      labelPlacement={labelPlacement}
      isDisabled={isDisabled}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      value={value}
      onValueChange={onValueChange}
      startContent={startContent}
      endContent={endContent}
      className={className}
      minLength={5}
      maxLength={150}
      {...props}
    />
  );
};

export default CustomInput;
