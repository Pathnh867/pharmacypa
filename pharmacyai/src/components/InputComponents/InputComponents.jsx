import { Input } from 'antd'
import React from 'react'

const InputComponents = ({size, placeholder, variant, style, ...rests}) => {
  return (
    <Input
                size={size}
                placeholder={placeholder}
                variant={variant}
                style={ style }
                {...rests}
            />
  )
}

export default InputComponents
