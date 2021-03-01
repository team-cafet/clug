import React from 'react';
import { Notification } from './Notification';

interface IProps {
  children: any;
  delay?: number;
  onClose?: ()=>void
}

export const NotificationFailed = (props: IProps) => {
  return <Notification {...props} title="Erreur" variant='danger' onClose={props.onClose}/>;
};
