import React, {createContext, useState} from 'react';

export const UserContext = createContext();

export const UserTypeProvider = ({children}) => {
  const [userType, setUserType] = useState('guest');

  return (
    <UserContext.Provider value={{userType, setUserType}}>
      {children}
    </UserContext.Provider>
  );
};
