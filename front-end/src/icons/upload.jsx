import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

// Define the hidden input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Define a styled Button with orange background
const OrangeButton = styled(Button)({
  backgroundColor: '#FFA500', // Orange color
  color: 'white', // Text color
  '&:hover': {
    backgroundColor: '#FF8C00', // Darker orange on hover
  },
});

export default function InputFileUpload({onClick}) {
  return (
    <OrangeButton
      component="label"
      role={undefined}
      variant="contained"
      startIcon={<CloudUploadIcon />}
      
    >
      Upload file
      <VisuallyHiddenInput type="file" onClick={onClick}/>
    </OrangeButton>
  );
}
