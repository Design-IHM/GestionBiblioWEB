import React from 'react';
import {CrossIcon, SidebarCloseIcon, XIcon} from "lucide-react";
import {BiExit} from "react-icons/bi";
import {IoMdExit} from "react-icons/io";

const colors = {
  'primary-blue': '#005FFE',
  'secondary-blue': '#54A6FF',
  'whitish-background': '#F6F7F9',
  'primary-text': '#083A50',
  'secondary-text': '#90A3BF',
  'blue-text': '#1BA0E2',
  'green-text': '#0EAD69',
  'orange-text': '#F49A47',
  'red-text': '#FF5D47',
  'blue-background': '#dcfbff',
  'green-background': '#DCFAED',
  'orange-background': '#FFE5A1',
  'red-background': '#FDE2E2',
  'toogle-yellow': '#EFBB3B',
  'toggle-yellow-background': '#F2E2AB',
  'toggle-blue': '#1BA0E2',
  'toggle-blue-background': '#092D3E',
};

export const CustomAlert = ({ type, message, customBgColor, customTextColor, open, onClose }) => {
  let bgColor, textColor;

  // If the alert is closed, return null (no rendering)
  if (!open) return null;

  // Check for custom colors first
  if (customBgColor && customTextColor) {
    bgColor = customBgColor;
    textColor = customTextColor;
  } else {
    switch (type) {
      case 'success':
        bgColor = colors['green-background'];
        textColor = colors['green-text'];
        break;
      case 'error':
        bgColor = colors['red-background'];
        textColor = colors['red-text'];
        break;
      case 'info':
        bgColor = colors['blue-background'];
        textColor = colors['blue-text'];
        break;
      default:
        bgColor = colors['whitish-background'];
        textColor = colors['primary-text'];
        break;
    }
  }

  return (
    <div
    //   style={{backgroundColor: bgColor, color: textColor, margin: '10px', padding: '10px', borderRadius: '5px'
    // }}
      style={{
        backgroundColor: bgColor,
        width: '75%',
        color: textColor,
        padding: '10px',
        borderRadius: '5px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', // Optional, to vertically align the items in the center
        justifyContent: 'space-between', // Optional, to space out the content
        margin: 'auto',
        marginTop: '10px',
      }}
    >
        <p>{message}</p>
        <button onClick={onClose}><XIcon/></button>

    </div>
  );
};

export default CustomAlert;
