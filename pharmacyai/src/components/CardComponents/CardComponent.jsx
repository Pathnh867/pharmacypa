
import React from 'react'
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText } from './style';
import { StarFilled } from '@ant-design/icons'
import logo from '../..'
import thuochome from '../../assets/img/thuocjpg.jpg'

const CardComponent = () => {
  return (
      <WrapperCardStyle
          hoverable
            
          style={{ width: '176.4px' }}
          styles={{
              head: { width: '176.4px', height: '176.4px' }, // Thay thế headStyle bằng styles.head
              body: { padding: '10px' } // Thay thế bodyStyle bằng styles.body
          }}
          cover={<img src={thuochome} alt="image small" preview={false}/>}
        >
          <StyleNameProduct>Panadol Extra</StyleNameProduct>
          <WrapperReportText>
              <span style={{marginRight:'4px'}}>
                  <span>4.96</span> <StarFilled style={{ fontSize: '12px', color: 'yellow' }} />
              </span>
              <span> | Đã bán 200+</span>
              
          </WrapperReportText>
          <WrapperPriceText><span style={{marginRight:'8px'}}>234.000vnđ/hộp</span>
                  <WrapperDiscountText>
                         -5%
                  </WrapperDiscountText> 
              </WrapperPriceText>
     </WrapperCardStyle>
  );
}

export default CardComponent