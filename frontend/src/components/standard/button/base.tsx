import { Button as RawButton, ButtonProps as RawButtonProps } from "@mantine/core"

export interface ButtonProps extends RawButtonProps {
}

export default function Button(props: ButtonProps){
  return <RawButton
    type="button"
    {...props}
  />
}