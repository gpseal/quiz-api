const lengthChecks = (fieldName, name, minLength, MaxLength, res) => {
  if (name.length < minLength || name.length > MaxLength) {
    return res.status(400).json({
      msg: `${fieldName} length must be more than ${minLength} and less than ${MaxLength} characters,`,
    });
  }
};

const checkCharacterType = (fieldName, name, type, mssge, res) => {
  if (name.match(type) === null) {
    return res.status(400).json({
      msg: `${fieldName} must contain ${mssge}`,
    });
  }
};

export { lengthChecks, checkCharacterType };
