import { useEffect, Suspense, lazy } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {
  createEntity,
  editEntity,
  clearEntity,
} from '../redux/entities/actionCreators.js';
// import EditEntity from './EditEntity.jsx';
// import InputEntity from './InputEntity.jsx';
// import CanvasTable from './CanvasTable.jsx';
import { setFormInputs } from '../redux/formInputs/actionCreators.js';
import { setEditForm } from '../redux/editForm/actionCreators.js';

const EditEntity = lazy(() => import('./EditEntity.jsx'));
const InputEntity = lazy(() => import('./InputEntity.jsx'));
const CanvasTable = lazy(() => import('./CanvasTable.jsx'));

const style = {
  entities: `flex flex-col justify-center gap-5 overflow-x-auto`,
  heading: `text-5xl font-bold m-auto`,
  loading: `text-4xl font-bold`,
};

function Entities() {
  const dispatch = useDispatch();

  const { name, coordinates, labels } = useSelector(
    (state) => state.formInputs,
  );
  const { isEdit, editId, editName, editCoordinates, editLabels } = useSelector(
    (state) => state.editForm,
  );

  // Fetch entities from the server
  useEffect(() => {
    dispatch(clearEntity());

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

    dispatch(setFormInputs('', '', ''));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

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
        dispatch(
          setEditForm(false, editId, editName, editCoordinates, editLabels),
        );
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleClose = () => {
    dispatch(setEditForm(false, editId, editName, editCoordinates, editLabels));
  };

  return (
    <Suspense fallback={<h2 className={style.loading}>Loading...</h2>}>
      {isEdit ? (
        <EditEntity
          handleUpdate={handleUpdate}
          handleClose={handleClose}
        />
      ) : (
        <div className={style.entities}>
          <h1 className={style.heading}>Entities</h1>
          <InputEntity handleCreate={handleCreate} />
          <CanvasTable />
        </div>
      )}
    </Suspense>
  );
}

export default Entities;
