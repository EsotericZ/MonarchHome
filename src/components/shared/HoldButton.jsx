import { Button } from '@mui/material';

const HoldButton = ({ children, onClick, type = 'button', ...props }) => {
  return (
    <Button className='holdBtn' type={type} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default HoldButton;