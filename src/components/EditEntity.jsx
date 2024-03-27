import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setEditForm } from '../redux/editForm/actionCreators';

const style = {
  input: `input input-bordered input- input-md w-full max-w-xs`,
  buttons: `flex gap-2`,
  button__primary: `btn btn-primary self-end`,
  button__accent: `btn btn-accent self-end`,
  edit: `flex flex-col gap-4`,
  subheading: `text-2xl font-bold`,
  input__group: `flex gap-2 align-middle`,
  form__edit: `flex flex-col gap-4`,
  label__container: `form-control flex flex-col justify-end w-full max-w-xs`,
  label__item: `label`,
  label__text: `label-text`,
};

const EditEntity = ({ handleUpdate, handleClose }) => {
  const dispatch = useDispatch();
  const { isEdit, editId, editName, editCoordinates, editLabels } = useSelector(
    (state) => state.editForm,
  );

  return (
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
              onChange={(e) =>
                dispatch(
                  setEditForm(
                    isEdit,
                    editId,
                    e.target.value,
                    editCoordinates,
                    editLabels,
                  ),
                )
              }
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
              onChange={(e) =>
                dispatch(
                  setEditForm(
                    isEdit,
                    editId,
                    editName,
                    e.target.value,
                    editLabels,
                  ),
                )
              }
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
              onChange={(e) =>
                dispatch(
                  setEditForm(
                    isEdit,
                    editId,
                    editName,
                    editCoordinates,
                    e.target.value,
                  ),
                )
              }
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
  );
};

EditEntity.propTypes = {
  handleUpdate: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EditEntity;
