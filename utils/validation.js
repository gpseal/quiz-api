const fieldValidation = (fieldName, name, minLength, MaxLength, type, mssge) => {
  if (name.length < minLength || name.length > MaxLength) {
    return `${fieldName} length must be more than ${minLength} and less than ${MaxLength} characters,`;
  }
  if (name.match(type) === null) {
    return `${fieldName} must contain ${mssge}`;
  }
};

const checkCrudentials = (crudentials) => {
  const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/;
  const emailFormat = /^([A-Za-z0-9_.-]+)@([\da-zA-Z.-]+)\.([a-z.]{2,5})$/;
  const alphaOnly = /^[A-Za-z]+$/;
  const alphaNumeric = /^[0-9a-zA-Z]+$/;

  // Checking correct lengths of inputs
  if (
    fieldValidation('first name', crudentials.first_name, 2, 50, alphaOnly, 'alpha characters only')
  ) {
    return fieldValidation(
      'first name',
      crudentials.first_name,
      2,
      50,
      alphaOnly,
      'alpha characters only',
    );
  }

  if (
    fieldValidation('last name', crudentials.last_name, 2, 50, alphaOnly, 'alpha characters only')
  ) {
    return fieldValidation(
      'last name',
      crudentials.last_name,
      2,
      50,
      alphaOnly,
      'alpha characters only',
    );
  }

  if (
    fieldValidation(
      'email',
      crudentials.email,
      0,
      50,
      emailFormat,
      'an @ special character & a second-level domain',
    )
  ) {
    return fieldValidation(
      'email',
      crudentials.email,
      0,
      50,
      emailFormat,
      'an @ special character & a second-level domain',
    );
  }

  if (
    fieldValidation(
      'username',
      crudentials.username,
      5,
      10,
      alphaNumeric,
      'alphanumeric characters only',
    )
  ) {
    return fieldValidation(
      'username',
      crudentials.username,
      5,
      10,
      alphaNumeric,
      'alphanumeric characters only',
    );
  }

  if (
    fieldValidation(
      'password',
      crudentials.password,
      5,
      12,
      passwordFormat,
      '1 numeric character & 1 special character',
    )
  ) {
    return fieldValidation(
      'password',
      crudentials.password,
      5,
      12,
      passwordFormat,
      '1 numeric character & 1 special character',
    );
  }

  if (crudentials.confirmPassword !== crudentials.password) {
    return 'passwords do not match';
  }

  if (crudentials.username !== crudentials.email.split('@')[0]) {
    return 'email prefix must match username ';
  }
};

export { fieldValidation, checkCrudentials };
