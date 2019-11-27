import { useQuery } from '@apollo/react-hooks';
import { Box, Grid, Paper } from '@material-ui/core';
import * as React from 'react';
import { Markdown } from 'src/components/shared/Markdown';
import { Picture, TSource } from 'src/components/shared/Picture';
import { Separator } from 'src/components/shared/Separator';
import { maxWidth } from 'src/constants/layout/maxWidth';
import * as getHome from 'src/gql/home/getHome.gql';
import { TAsset, TData } from 'src/gql/home/TData';
import { useCss } from 'src/helpers/useCss';
import { Calendar } from './Calendar';

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
      srcSet: `{url[0]}?${focalPointPortrait}&fit=crop&h=700&w=${maxWidth.value}`,
      media: '(orientation: portrait)'
    },
    {
      srcSet: `{url[1]}?${focalPointLandscape}&fit=crop&h=500&w=${maxWidth.value}`,
      media: '(orientation: landscape)'
    }
  ];

  return (
    <Grid container={true}>
      <Grid item={true} xs={12}>
        <Box position="relative">
          <Picture assets={assets} sources={sources} />
          <Box
            position="absolute"
            fontSize={useCss('3vw', '2rem')}
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
          <Separator />
        </Box>
      </Grid>
      <Grid item={true} xs={12}>
        <Box position="relative">
          <Paper square={true}>
            <Box p={2} overflow="hidden">
              <Markdown source={data.home.content} />
            </Box>
          </Paper>
          <Separator flipped={true} />
        </Box>
      </Grid>
      <Grid item={true} xs={12}>
        <Paper square={true}>calendar</Paper>
      </Grid>
    </Grid>
  );
};

export { Home };
