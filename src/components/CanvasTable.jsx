import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stage, Layer, Group, Rect, Text } from 'react-konva';
import { removeEntity } from '../redux/entities/actionCreators.js';
import { setEditForm } from '../redux/editForm/actionCreators.js';
import { setDimensions } from '../redux/canvas/actionCreators.js';

const X_HEADING = 5;
const Y_HEADING = 5;
const X_TABLE = 5;
const Y_TABLE = 55;

const CanvasTable = () => {
  const dispatch = useDispatch();
  const entities = useSelector((state) => state.entities);
  const { editId, editName, editCoordinates, editLabels } = useSelector(
    (state) => state.editForm,
  );
  const dimensions = useSelector((state) => state.canvas);

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
    dispatch(setEditForm(true, editId, editName, editCoordinates, editLabels));

    const entity = entities.find((item) => item.id === id);

    dispatch(
      setEditForm(
        true,
        entity.id,
        entity.name,
        entity.coordinates.join(', '),
        entity.labels.join(', '),
      ),
    );
  };

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      dispatch(setDimensions(window.innerWidth - 100, window.innerHeight));
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dispatch]);

  return (
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
            text="Coordinate"
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
  );
};

export default CanvasTable;
