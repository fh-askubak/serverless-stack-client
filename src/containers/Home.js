import React, { useState, useEffect } from 'react';
import './Home.css';
import Encryption from '../components/Encryption';
import { PageHeader, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useUserContext } from '../libs/contextLib';
import { onError } from '../libs/errorLib';
import { API } from 'aws-amplify';
import { LinkContainer } from 'react-router-bootstrap';

export default () => {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useUserContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getNotes = async () => {
      if (!isAuthenticated) {
        return;
      }
      try {
        const notes = await API.get("notes", "/notes");
        setNotes(notes);
      } catch (err) {
        onError(err);
      }
      setIsLoading(false);
    }
    getNotes();
  }, [isAuthenticated]);

  const renderNotesList = () => {
    //always return blank array with create note button and any notes if available
    return [{}].concat(notes).map((note, index) =>
      index !== 0 ? (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleDateString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/notes/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new note
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    )
  }

  const renderLandingPage = () => {
    return (
      <div className="lander">
        <h2>Lambda</h2>
        <p>simple lambda note taking example</p>
        <Encryption />
      </div>
    )
  }
  const renderNotes = () => {
    return (
      <div className="notes">
        <PageHeader>Notes</PageHeader>
        <ListGroup>
          {!isLoading && renderNotesList(notes)}
        </ListGroup>
      </div>
    )
  }
  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLandingPage()}
    </div>
  );
}