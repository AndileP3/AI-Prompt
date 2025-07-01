import React, { useState } from 'react';
import styled from 'styled-components';
import AuthenticationPopup from './AuthenticationPopup';

const LoginButton = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  return (
    <>
      <Button onClick={() => setShowAuthPopup(true)}>
        Log In
      </Button>
      
      {showAuthPopup && (
        <AuthenticationPopup onClose={() => setShowAuthPopup(false)} />
      )}
    </>
  );
};

const Button = styled.button`
  background-color: transparent;
  color: #4a6bff;
  border: 1px solid #4a6bff;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 15px;

  &:hover {
    background-color: #4a6bff;
    color: white;
  }
`;

export default LoginButton;