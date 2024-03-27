const validateInput = (name, coordinates, labels) => {
  if (name === '' || coordinates.length < 2) {
    alert('Please fill out Name and Coordinate fields');

    return false;
  }

  return true;
};

export default validateInput;
