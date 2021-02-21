import React, { useState } from 'react';
import { Toast } from 'react-bootstrap';
import './Notification.scss';

interface IProps {
  title?: string;
  children: any;
  delay?: number;
  smallMessage?: string;
  variant?: 'default' | 'warning' | 'danger' | 'success';
  onClose?: ()=>void
}

export const Notification = (props: IProps) => {
  const DEFAULT_DELAY = 5000;
  const DEFAULT_VARIANT = 'default';

  const { title, children, smallMessage, delay, variant } = props;
  const [show, setShow] = useState(true);
    
  const variantClassName = 'notification-' + (variant ? variant : DEFAULT_VARIANT)

  return (
    <Toast
      onClose={() => {
        setShow(false); 
        props.onClose && props.onClose();
      }}
      show={show}
      delay={delay ? delay : DEFAULT_DELAY}
      autohide
      className={`notification ${variantClassName}`}
    >
      <Toast.Header>
        {title && <strong className="mr-auto">{title}</strong>}
        {smallMessage && <small>{smallMessage}</small>}
      </Toast.Header>
      <Toast.Body>{children}</Toast.Body>
    </Toast>
  );
};
