import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  HelpBlock,
  FormGroup,
  FormControl,
  ControlLabel, Button
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { useUserContext } from '../libs/contextLib';
import { useFormFields } from '../libs/hooksLib';
import { onError } from '../libs/errorLib';
import './Home.css';
import { Auth } from 'aws-amplify';

export default () => {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  });
  const history = useHistory();
  const [newUser, setNewUser] = useState(null);
  const { userHasAuthenticated } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0
    );
  }

  const validateConfirmationCode = () => {
    return fields.confirmationCode.length > 0;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    const newUser = await Auth.signUp({
      username: fields.email,
      password: fields.password,
    });
    try {
      setIsLoading(false);
      setNewUser(newUser);
    } catch (error) {
      if (error.name === 'UsernameExistsException') {
        Auth.resendSignUp(newUser);
      }
      onError(error);
      setIsLoading(false);
    }
  }

  const handleConfirmation = async event => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode);
      await Auth.signIn(fields.email, fields.password);

      userHasAuthenticated(true);
      history.push('/');
    } catch (err) {
      onError(err);
      setIsLoading(false);
    }
  }

  const renderConfirmationForm = () => {
    return (
      <form onSubmit={handleConfirmation}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <HelpBlock>Please check your email for code</HelpBlock>
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateConfirmationCode}
        >
          Verify
        </LoaderButton>
      </form>
    )
  }

  const renderSignupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl
            autoFocus
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            autoFocus
            type="password"
            value={fields.confirmPassword}
            onChange={handleFieldChange}
          />
        </FormGroup>
        <Button
          block
          type="submit"
          bsSize="large"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Sign Up
        </Button>
      </form>
    )
  }

  return (
    <div className="Signup">
      {newUser === null ? renderSignupForm() : renderConfirmationForm()}
    </div>
  );
}