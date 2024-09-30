import { showNotification } from '@mantine/notifications';
import { UseFormReturn, UseFormSetError } from 'react-hook-form';
import Colors from '../constants/colors';

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

export function handleErrorFn<T extends (...args: any) => any>(fn: T): T {
  return (async function (...args: any[]) {
    try {
      const result = await fn(...args);
      return result;
    } catch (e: any){
      console.error(e);
      if (e.message){
        showNotification({
          message: e.message.toString(),
          color: Colors.Sentiment.Error,
        });
      } else {
        showNotification({
          message: "An error has occurred during the submission of this form.",
          color: Colors.Sentiment.Error,
        });
      }
    }
  }) as T;
}

export function handleFormSubmission<T extends (...args: any) => any>(fn: T, form: UseFormReturn<any>) {
  return form.handleSubmit((async (...args: any[]) => {
    try {
      const result = await fn(...args);
      return result;
    } catch (e: any){
      console.error(e);
      if (e.message){
        showNotification({
          message: e.message.toString(),
          color: Colors.Sentiment.Error,
        });
      } else {
        showNotification({
          message: "An error has occurred during the submission of this form.",
          color: Colors.Sentiment.Error,
        });
      }
      if (e.errors){
        formSetErrors(e.errors, form.setError);
      }
    }
  }), (error) => {
    console.error(error);
  }) as any
}