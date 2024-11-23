import React from "react";
import { SearchOutlined } from '@ant-design/icons'
import InputComponents from "../InputComponents/InputComponents";
import ButtonComponent from "../ButtonComponents/ButtonComponent";

const ButtonInputSearch = (props) => {
    const {size, placeholder, textButton, bordered, backgroundColorInput= '#fff' , backgroundColorButton = '#309c3e', colorButton='#fff'} = props
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <InputComponents
                size={size}
                placeholder={placeholder}
                variant="borderless"
                style={{ backgroundColor: backgroundColorInput }}
            />
            <ButtonComponent
                size={size}
                styleButton={{background: backgroundColorButton, border: !bordered && 'none'}}
                icon={<SearchOutlined color={colorButton} style={{color:'#fff'}} />}
                textButton={textButton}
                styleTextButton= {{color: colorButton}}
            />
                

        </div>
    )
}
export default ButtonInputSearch