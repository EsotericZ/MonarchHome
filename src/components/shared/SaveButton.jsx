import { Button } from '@mui/material';

const SaveButton = ({ children, onClick, type = 'button', ...props }) => {
  return (
    <Button className='saveBtn' type={type} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default SaveButton;