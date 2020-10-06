import React, { useState } from 'react';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import './Home.css';
import { Auth } from 'aws-amplify';
import { useUserContext } from '../libs/contextLib';
import { useHistory } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../libs/errorLib';
import { useFormFields } from '../libs/hooksLib';

export default () => {
  const { userHasAuthenticated } = useUserContext();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: ''
  });

  const validateForm = () => {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(fields.email, fields.password);
      userHasAuthenticated(true);
      history.push("/");
    } catch (err) {
      onError(err);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
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
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
          />
        </FormGroup>
        <LoaderButton
          block
          bsSize="large"
          disabled={!validateForm()}
          type="submit"
          isLoading={isLoading}
        >
          Login
        </LoaderButton>
      </form>
    </div>
  )
}