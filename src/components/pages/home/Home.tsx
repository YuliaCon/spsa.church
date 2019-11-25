import { useQuery } from '@apollo/react-hooks';
import { Box, Grid } from '@material-ui/core';
import * as React from 'react';
import { Img, TSource } from 'src/components/shared/Img';
import * as getHome from 'src/gql/home/getHome.gql';
import { TAsset, TData } from 'src/gql/home/TData';

/**
 * Home page component.
 *
 * Renders the home page with its Main Photo, Overlay text, content, etc.
 */
const Home: () => JSX.Element | null = (): JSX.Element | null => {
  // get the home data
  const { loading, data } = useQuery<TData>(getHome);

  // in case the gql is loading or there is no data, do not show the page
  // TODO: add loader
  if (loading || !data) {
    return null;
  }

  const focalPointPortrait: string = 'fp-x=0.35&fp-y=0.35&fp-z=1';
  const focalPointLandscape: string = 'fp-x=0.5&fp-y=0.5&fp-z=1';
  const assets: TAsset[] = [data.home.photoPortrait, data.home.photoLandscape];

  const sources: TSource[] = [
    {
      srcSet: `{url[0]}?${focalPointPortrait}&fit=crop&h=700&w=1024`,
      media: '(orientation: portrait)'
    },
    {
      srcSet: `{url[1]}?${focalPointLandscape}&fit=crop&h=500&w=1024`,
      media: '(orientation: landscape)'
    }
  ];

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Box maxWidth="100%" position="relative">
          <Img assets={assets} sources={sources} />
          <Box
            position="absolute"
            fontSize="2rem"
            maxWidth="45%"
            bottom="5%"
            right={0}
            p={1}
            textAlign="right"
            color="white"
            bgcolor="rgba(0, 0, 0, 0.5)"
          >
            {data.home.overlay}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export { Home };