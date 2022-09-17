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

const checkCrudentials = (crudentials, res) => {
  const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
  const emailFormat = /^([A-Za-z0-9_.-]+)@([\da-zA-Z.-]+)\.([a-z.]{2,5})$/;
  const alphaOnly = /^[A-Za-z]+$/;
  const alphaNumeric = /^[0-9a-zA-Z]+$/;

  // Checking correct lengths of inputs
  if (crudentials.first_name.length < 2 || crudentials.first_name.length > 50) {
    return res.status(400).json({
      msg: `first name length must be more than 2 and less than 50 characters,`,
    });
  }

  if (crudentials.first_name.match(alphaOnly) === null) {
    return res.status(400).json({
      msg: `first name must contain alpha characters only`,
    });
  }

  if (crudentials.last_name.length < 2 || crudentials.last_name.length > 50) {
    return res.status(400).json({
      msg: `last name length must be more than 2 and less than 50 characters,`,
    });
  }

  if (crudentials.last_name.match(alphaOnly) === null) {
    return res.status(400).json({
      msg: `last name must contain alpha characters only`,
    });
  }

  if (crudentials.email.match(emailFormat) === null) {
    return res.status(400).json({
      msg: `email must contain an @ special character & a second-level domain`,
    });
  }

  if (crudentials.username.length < 5 || crudentials.username.length > 10) {
    return res.status(400).json({
      msg: `username length must be more than 5 and less than 10 characters,`,
    });
  }

  if (crudentials.username.match(alphaNumeric) === null) {
    return res.status(400).json({
      msg: `username must contain alphanumeric characters only`,
    });
  }

  if (crudentials.password.length < 5 || crudentials.password.length > 12) {
    return res.status(400).json({
      msg: `password length must be more than 5 and less than 12 characters,`,
    });
  }

  if (crudentials.password.match(passwordFormat) === null) {
    return res.status(400).json({
      msg: `password must contain 1 numeric character & 1 special character`,
    });
  }

  if (crudentials.confirmPassword !== crudentials.password) {
    return res.status(400).json({
      msg: 'passwords do not match',
    });
  }

  if (crudentials.username !== crudentials.email.split('@')[0]) {
    return res.status(400).json({
      msg: 'email prefix must match username ',
    });
  }
};

export { lengthChecks, checkCharacterType, checkCrudentials };
