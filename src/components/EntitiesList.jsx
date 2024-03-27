import { useState, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Group } from 'react-konva';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  createEntity,
  removeEntity,
  editEntity,
} from '../redux/entities/actionCreators.js';

const style = {
  entities: `flex flex-col justify-center gap-5 overflow-x-auto`,
  form: `flex gap-2`,
  entity: `flex justify-between gap-2`,
  input: `input input-bordered input- input-md w-full max-w-xs`,
  buttons: `flex gap-2`,
  button: `btn`,
  button__primary: `btn btn-primary self-end`,
  button__secondary: `btn btn-secondary self-end`,
  button__accent: `btn btn-accent self-end`,
  edit: `flex flex-col gap-4`,
  heading: `text-5xl font-bold m-auto`,
  subheading: `text-2xl font-bold`,
  input__group: `flex gap-2 align-middle`,
  form__edit: `flex flex-col gap-4`,
  label__container: `form-control flex flex-col justify-end w-full max-w-xs`,
  label__item: `label`,
  label__text: `label-text`,
};

const X_HEADING = 5;
const Y_HEADING = 5;
const X_TABLE = 5;
const Y_TABLE = 55;

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

  // State for Canvas
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth - 100,
  });

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

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth - 100,
      });
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handlers for adding, removing and editing entities
  const handleCreate = (e) => {
    e.preventDefault();

    const newEntity = {
      id: uuidv4(),
      name,
      coordinates: coordinates.split(',').map((item) => +item.trim()),
      labels: labels.split(',').map((item) => item.trim()),
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

    const entity = entities.find((item) => item.id === id);

    setEditId(entity.id);
    setEditName(entity.name);
    setEditCoordinates(entity.coordinates.join(', '));
    setEditLabels(entity.labels.join(', '));
  };

  const handleUpdate = () => {
    const updatedEntity = {
      name: editName,
      coordinates: editCoordinates.split(',').map((item) => +item.trim()),
      labels: editLabels.split(',').map((item) => item.trim()),
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
        <div className={style.edit}>
          <h2 className={style.subheading}>Edit Entity</h2>
          <form className={style.form__edit}>
            <div className={style.input__group}>
              <label className={style.label__container}>
                <div className={style.label__item}>
                  <span className={style.label__text}>Enter a new name</span>
                </div>
                <input
                  className={style.input}
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Entity5"
                />
              </label>
              <label className={style.label__container}>
                <div className={style.label__item}>
                  <span className={style.label__text}>
                    Enter new coordinates (comma-separated)
                  </span>
                </div>
                <input
                  className={style.input}
                  type="text"
                  value={editCoordinates}
                  onChange={(e) => setEditCoordinates(e.target.value)}
                  placeholder="e.g. -5, 5"
                />
              </label>
              <label className={style.label__container}>
                <div className={style.label__item}>
                  <span className={style.label__text}>
                    Enter new labels (comma-separated)
                  </span>
                </div>
                <input
                  className={style.input}
                  type="text"
                  value={editLabels}
                  onChange={(e) => setEditLabels(e.target.value)}
                  placeholder="e.g. labelQ, labelR"
                />
              </label>
            </div>
            <div className={style.buttons}>
              <button
                className={style.button__primary}
                type="submit"
                onClick={handleUpdate}
              >
                Update
              </button>
              <button
                className={style.button__accent}
                type="submit"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={style.entities}>
          <h1 className={style.heading}>Entities</h1>
          {/* Form for adding a new entity */}
          <h2 className={style.subheading}>Add New Entity</h2>
          <form className={style.form}>
            <label className={style.label__container}>
              <div className={style.label__item}>
                <span className={style.label__text}>Enter a name</span>
              </div>
              <input
                className={style.input}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Entity5"
              />
            </label>
            <label className={style.label__container}>
              <div className={style.label__item}>
                <span className={style.label__text}>
                  Enter coordinates (comma-separated)
                </span>
              </div>
              <input
                className={style.input}
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                placeholder="e.g. -5, 5"
              />
            </label>
            <label className={style.label__container}>
              <div className={style.label__item}>
                <span className={style.label__text}>
                  Enter labels (comma-separated)
                </span>
              </div>
              <input
                className={style.input}
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="e.g. labelQ, labelR"
              />
            </label>
            <button
              className={style.button__primary}
              type="submit"
              onClick={handleCreate}
            >
              Add Entity
            </button>
          </form>

          {/* List of entities */}
          <Stage
            width={dimensions.width}
            height={dimensions.height}
          >
            <Layer>
              <Group>
                <Rect
                  x={X_HEADING}
                  y={Y_HEADING}
                  width={100}
                  height={50}
                  stroke="black"
                  strokeWidth={2}
                />
                <Text
                  text="Name"
                  x={10 + X_HEADING}
                  y={20 + Y_HEADING}
                  fontSize={16}
                  align="center"
                  fontStyle="700"
                />
                <Rect
                  x={100 + X_HEADING}
                  y={Y_HEADING}
                  width={150}
                  height={50}
                  stroke="black"
                  strokeWidth={2}
                />
                <Text
                  text="Coordinates"
                  x={110 + X_HEADING}
                  y={20 + Y_HEADING}
                  fontSize={16}
                  align="center"
                  fontStyle="700"
                />
                <Rect
                  x={250 + X_HEADING}
                  y={Y_HEADING}
                  width={250}
                  height={50}
                  stroke="black"
                  strokeWidth={2}
                />
                <Text
                  text="Labels"
                  x={260 + X_HEADING}
                  y={20 + Y_HEADING}
                  fontSize={16}
                  align="center"
                  fontStyle="700"
                />
                <Rect
                  x={500 + X_HEADING}
                  y={Y_HEADING}
                  width={125}
                  height={50}
                  stroke="black"
                  strokeWidth={2}
                />
                <Text
                  text="Actions"
                  x={510 + X_HEADING}
                  y={20 + Y_HEADING}
                  fontSize={16}
                  align="center"
                  fontStyle="700"
                />
              </Group>
              {entities.map((entity, index) => (
                <Group key={entity.id}>
                  <Rect
                    x={X_TABLE}
                    y={Y_TABLE + index * 50}
                    width={100}
                    height={50}
                    stroke="black"
                    strokeWidth={1}
                  />
                  <Text
                    text={entity.name}
                    x={10 + X_TABLE}
                    y={20 + Y_TABLE + index * 50}
                    fontSize={16}
                    align="center"
                  />
                  <Rect
                    x={100 + X_TABLE}
                    y={Y_TABLE + index * 50}
                    width={150}
                    height={50}
                    stroke="black"
                    strokeWidth={1}
                  />
                  <Text
                    text={entity.coordinates.join(', ')}
                    x={110 + X_TABLE}
                    y={20 + Y_TABLE + index * 50}
                    fontSize={16}
                    align="center"
                  />
                  <Rect
                    x={250 + X_TABLE}
                    y={Y_TABLE + index * 50}
                    width={250}
                    height={50}
                    stroke="black"
                    strokeWidth={1}
                  />
                  <Text
                    text={entity.labels.join(', ')}
                    x={260 + X_TABLE}
                    y={20 + Y_TABLE + index * 50}
                    fontSize={16}
                    align="center"
                  />
                  <Rect
                    x={500 + X_TABLE}
                    y={Y_TABLE + index * 50}
                    width={125}
                    height={50}
                    stroke="black"
                    strokeWidth={1}
                  />
                  <Text
                    text="Edit"
                    fill="blue"
                    x={510 + X_TABLE}
                    y={20 + Y_TABLE + index * 50}
                    onTap={() => handleEdit(entity.id)}
                    onClick={() => handleEdit(entity.id)}
                    fontSize={16}
                    align="center"
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'pointer';
                    }}
                    onMouseLeave={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'default';
                    }}
                  />
                  <Text
                    text="Remove"
                    fill="red"
                    x={550 + X_TABLE}
                    y={20 + Y_TABLE + index * 50}
                    onTap={() => handleRemove(entity.id)}
                    onClick={() => handleRemove(entity.id)}
                    fontSize={16}
                    align="center"
                    onMouseEnter={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'pointer';
                    }}
                    onMouseLeave={(e) => {
                      const container = e.target.getStage().container();
                      container.style.cursor = 'default';
                    }}
                  />
                </Group>
              ))}
            </Layer>
          </Stage>
        </div>
      )}
    </>
  );
}

export default EntitiesList;
