import { Modal } from 'antd'
import React from 'react'

function ModalComponent({title= 'modal', isOpen=false, children, ...rests }) {
  return (
      <Modal>
          {children}
    </Modal>
  )
}

export default ModalComponent