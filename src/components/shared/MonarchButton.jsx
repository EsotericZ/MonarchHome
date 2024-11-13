import { Button } from '@mui/material';

const MonarchButton = ({ children, onClick, type = 'button', ...props }) => {
  return (
    <Button className="mmBtn" type={type} onClick={onClick} {...props}>
      {children}
    </Button>
  );
};

export default MonarchButton;