import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { AppDispatch } from '../../services/store';
import { updateUserThunk } from '../../features/user/userSlice';
import { useDispatch } from 'react-redux';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const { user } = useSelector((store: RootState) => store.user);
  const dispatch: AppDispatch = useDispatch();

  if (!user) {
    return null;
  }

  const [formValue, setFormValue] = useState({
    ...user,
    password: ''
  });

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      updateUserThunk({
        email: formValue.email,
        password: formValue.password,
        name: formValue.name
      })
    ).then(() => {
      setFormValue((prevState) => ({
        ...prevState,
        password: ''
      }));
    });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
