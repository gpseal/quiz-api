const fieldValidation = (fieldName, name, minLength, MaxLength, type, mssge) => {
  if (name.length <= minLength || name.length > MaxLength) {
    return `${fieldName} length must be more than ${minLength} and less than ${MaxLength} characters,`;
  }
  if (name.match(type) === null) {
    return `${fieldName} must contain ${mssge}`;
  }
};

const checkInputs = (inputs) => {
  const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
  const emailFormat = /^([A-Za-z0-9_.-]+)@([\da-zA-Z.-]+)\.([a-z.]{2,5})$/;
  const alphaOnly = /^[A-Za-z]+$/;
  const alphaNumeric = /^[0-9a-zA-Z]+$/;

  // Checking correct lengths of inputs
  if (inputs.first_name) {
    if (
      fieldValidation('first name', inputs.first_name, 2, 50, alphaOnly, 'alpha characters only')
    ) {
      return fieldValidation(
        'first name',
        inputs.first_name,
        2,
        50,
        alphaOnly,
        'alpha characters only',
      );
    }
  }

  if (inputs.last_name) {
    if (fieldValidation('last name', inputs.last_name, 2, 50, alphaOnly, 'alpha characters only')) {
      return fieldValidation(
        'last name',
        inputs.last_name,
        2,
        50,
        alphaOnly,
        'alpha characters only',
      );
    }
  }

  if (inputs.email) {
    if (
      fieldValidation(
        'email',
        inputs.email,
        0,
        50,
        emailFormat,
        'an @ special character & a second-level domain',
      )
    ) {
      return fieldValidation(
        'email',
        inputs.email,
        0,
        50,
        emailFormat,
        'an @ special character & a second-level domain',
      );
    }
  }

  if (inputs.username) {
    if (
      fieldValidation(
        'username',
        inputs.username,
        5,
        10,
        alphaNumeric,
        'alphanumeric characters only',
      )
    ) {
      return fieldValidation(
        'username',
        inputs.username,
        5,
        10,
        alphaNumeric,
        'alphanumeric characters only',
      );
    }
  }

  if (inputs.password) {
    if (
      fieldValidation(
        'password',
        inputs.password,
        5,
        12,
        passwordFormat,
        '1 numeric character & 1 special character',
      )
    ) {
      return fieldValidation(
        'password',
        inputs.password,
        5,
        12,
        passwordFormat,
        '1 numeric character & 1 special character',
      );
    }
  }

  if (inputs.confirmPassword) {
    if (inputs.confirmPassword !== inputs.password) {
      return 'passwords do not match';
    }
  }

  if (inputs.username) {
    if (inputs.username !== inputs.email.split('@')[0]) {
      return 'email prefix must match username ';
    }
  }
};

export { fieldValidation, checkInputs };
