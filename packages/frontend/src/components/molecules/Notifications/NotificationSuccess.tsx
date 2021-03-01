import React from 'react';
import { Notification } from './Notification';

interface IProps {
  children: any;
  delay?: number;
  onClose?: ()=>void
}

export const NotificationSuccess = (props: IProps) => {
  return <Notification {...props} title="Succès" variant='success' onClose={props.onClose}/>;
};
