import { Button } from '@mui/material';

const CancelButton = ({ children, onClick, type = 'button', ...props }) => {
  return (
    <Button className='cancelBtn' type={type} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default CancelButton;