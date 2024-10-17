import { act } from '@testing-library/react';

export const wait = async (duration: number = 0) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
};

export const actAndWait = async (waitValue?: number) => {
  return act(() => wait(waitValue));
};
