import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  createEntity,
  removeEntity,
  editEntity,
} from '../redux/entities/actionCreators.js';
// import EditEntityModal from './EditEntityModal';

const style = {
  entities: `flex flex-col justify-center gap-5`,
  form: `flex gap-2`,
  entity: `flex justify-between gap-2`,
  input: `input input-bordered w-full max-w-xs`,
  buttons: `flex gap-2`,
  button: `btn`,
  button__primary: `btn btn-primary`,
  button__secondary: `btn btn-secondary`,
  button__accent: `btn btn-accent`,
  modal: `flex flex-col bg-red justify-center z-50 gap-4`,
  heading: `text-5xl font-bold`,
  subheading: `text-3xl font-bold`,
};

function EntitiesList() {
  const entities = useSelector((state) => state.entities);
  const dispatch = useDispatch();

  // State for the form inputs
  const [name, setName] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [labels, setLabels] = useState('');

  // State for the edit form
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCoordinates, setEditCoordinates] = useState('');
  const [editLabels, setEditLabels] = useState('');

  // Fetch entities from the server
  useEffect(() => {
    fetch('http://localhost:5000/entities')
      .then((response) => response.json())
      .then((data) => {
        // Dispatch the createEntity action for each entity
        data.forEach((entity) => {
          dispatch(createEntity(entity));
        });
      })
      .catch((error) => {
        console.error('Error fetching entities:', error);
      });
  }, [dispatch]);

  // Handlers for adding, removing and editing entities
  const handleCreate = (e) => {
    e.preventDefault();

    const newEntity = {
      name,
      coordinates: coordinates.split(','),
      labels: labels.split(','),
    };
    fetch('http://localhost:5000/entities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntity),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(createEntity(data));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setName('');
    setCoordinates('');
    setLabels('');
  };

  const handleRemove = (id) => {
    fetch(`http://localhost:5000/entities/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        dispatch(removeEntity(id));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEdit = (id) => {
    setIsEdit(true);
    const entity = entities.find((entity) => entity.id === id);
    setEditId(entity.id);
    setEditName(entity.name);
    setEditCoordinates(entity.coordinates.join(', '));
    setEditLabels(entity.labels.join(', '));
  };

  const handleUpdate = () => {
    const updatedEntity = {
      name: editName,
      coordinates: editCoordinates.split(', ').map(Number), // ?
      labels: editLabels.split(', '),
    };
    fetch(`http://localhost:5000/entities/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEntity),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(editEntity(editId, data));
        setIsEdit(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleClose = () => {
    setIsEdit(false);
  };

  return (
    <>
      {/* Modal for editing an entity */}
      {isEdit ? (
        <div className={style.modal}>
          <h2 className={style.subheading}>Edit Entity</h2>
          <form className={style.form}>
            <input
              className={style.input}
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
            />
            <input
              className={style.input}
              type="text"
              value={editCoordinates}
              onChange={(e) => setEditCoordinates(e.target.value)}
              placeholder="Coordinates (comma-separated)"
            />
            <input
              className={style.input}
              type="text"
              value={editLabels}
              onChange={(e) => setEditLabels(e.target.value)}
              placeholder="Labels (comma-separated)"
            />
            <button
              className={style.button__primary}
              type="button"
              onClick={handleUpdate}
            >
              Update Entity
            </button>
            <button
              className={style.button__accent}
              type="button"
              onClick={handleClose}
            >
              Close
            </button>
          </form>
        </div>
      ) : (
        <div className={style.entities}>
          <h1 className={style.heading}>Entities</h1>
          {/* Form for adding a new entity */}
          <h2 className={style.subheading}>Add New Entity</h2>
          <form className={style.form}>
            <input
              className={style.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            <input
              className={style.input}
              type="text"
              value={coordinates}
              onChange={(e) => setCoordinates(e.target.value)}
              placeholder="Coordinates (comma-separated)"
            />
            <input
              className={style.input}
              type="text"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="Labels (comma-separated)"
            />
            <button
              className={style.button__primary}
              type="submit"
              onClick={handleCreate}
            >
              Add Entity
            </button>
          </form>

          {/* List of entities */}
          {entities.map((entity) => (
            <div
              key={entity.id}
              className={style.entity}
            >
              <h2>{entity.name}</h2>
              <p>Coordinates: {entity.coordinates}</p> {/* ? */}
              <p>Labels: {entity.labels.join(', ')}</p>
              <div className={style.buttons}>
                <button
                  className={style.button__secondary}
                  onClick={() => handleEdit(entity.id)}
                >
                  Edit
                </button>
                <button
                  className={style.button__accent}
                  onClick={() => handleRemove(entity.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default EntitiesList;
