import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setFormInputs } from '../redux/formInputs/actionCreators';

const style = {
  form: `flex gap-2`,
  input: `input input-bordered input- input-md w-full max-w-xs`,
  button__primary: `btn btn-primary self-end`,
  subheading: `text-2xl font-bold`,
  label__container: `form-control flex flex-col justify-end w-full max-w-xs`,
  label__item: `label`,
  label__text: `label-text`,
};

const InputEntity = ({ handleCreate }) => {
  const dispatch = useDispatch();
  const { name, coordinates, labels } = useSelector(
    (state) => state.formInputs,
  );

  return (
    <>
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
            onChange={(e) =>
              dispatch(setFormInputs(e.target.value, coordinates, labels))
            }
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
            onChange={(e) =>
              dispatch(setFormInputs(name, e.target.value, labels))
            }
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
            onChange={(e) =>
              dispatch(setFormInputs(name, coordinates, e.target.value))
            }
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
    </>
  );
};

InputEntity.propTypes = {
  handleCreate: PropTypes.func.isRequired,
};

export default InputEntity;
