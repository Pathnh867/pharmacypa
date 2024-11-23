import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox, Col, Rate, Row } from 'antd'

const NavBarComponent = () => {
    const onChange = () => {}
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <WrapperTextValue>{option}</WrapperTextValue>
                    )
                })
            case'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display:'flex', flexDirection:'column' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox value={option.value}>{option.lable}</Checkbox>
                            )
                        }
                        )} 
                            <Checkbox value="A">A</Checkbox>
                            <Checkbox value="B">B</Checkbox>
                 </Checkbox.Group>
                ) 
            case'rate':
                return options.map((option) => {
                    console.log('check',option)
                    return (
                        <div style={{display: 'flex', gap:'4px'}}>
                            
                            <Rate style={{ fontSize: '12px' }} disabled defaultValue={option} />
                            <span>{`Từ ${option} sao`}</span>
                        </div>
                    )
                })
            case'price':
                return options.map((option) => {
                    return (
                        <WrapperTextPrice>{option}</WrapperTextPrice>
                    )
                })
                           
            default:
                return {}
        }
    }
  return (
      <div>
          <WrapperLableText>NavBarComponent</WrapperLableText>
          <WrapperContent>
              {renderContent('text', ['Dược mỹ phẩm', 'Thiết bị y tế', 'Thực phẩm chức năng'])}
          </WrapperContent>
           
      </div>
  )
}

export default NavBarComponent