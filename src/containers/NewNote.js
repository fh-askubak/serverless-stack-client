import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import { onError } from '../libs/errorLib';
import './Home.css';
import { API } from 'aws-amplify';

export default () => {
  const history = useHistory();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    return content.length > 0;
  }

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    const createNote = note => {
      return API.post("notes", "/notes", {
        body: note
      });
    }
    try {
      await createNote({ content });
      history.push("/");
    } catch (err) {
      onError(err);
      setIsLoading(false);
    }
  }

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="content">
          <ControlLabel>Content</ControlLabel>
          <FormControl
            value={content}
            componentClass="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          bsStyle="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create Note
          </LoaderButton>
      </form>
    </div>
  )
}