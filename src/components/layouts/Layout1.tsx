import { useQuery } from '@apollo/react-hooks';
import * as React from 'react';
import * as getTheme from 'src/gql/theme/getTheme.gql';
import { TData } from 'src/gql/theme/TData';

const Layout1: () => JSX.Element = (): JSX.Element => {
  const { loading, data } = useQuery<TData>(getTheme);

  return (
    <div>
      spsa.church
      <div>{loading && 'loading'}</div>
      <div>{data?.theme.headerMenu.label}</div>
    </div>
  );
};

export { Layout1 };