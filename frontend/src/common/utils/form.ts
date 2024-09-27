import { UseFormSetError } from 'react-hook-form';

export function formSetErrors(
  errors: { [key: string]: any },
  setError: UseFormSetError<any>,
  parentKey?: string,
) {
  Object.entries(errors).forEach((error) => {
    if (error[1] == null) {
      return;
    }
    if (typeof error[1] === 'object') {
      formSetErrors(
        error[1],
        setError,
        `${parentKey ? parentKey + '.' : ''}${error[0]}`,
      );
    } else {
      if (parentKey) {
        setError(`${parentKey}.${error[0]}`, {
          type: 'manual',
          message: error[1],
        });
      } else {
        setError(error[0], {
          type: 'manual',
          message: error[1],
        });
      }
    }
  });
};