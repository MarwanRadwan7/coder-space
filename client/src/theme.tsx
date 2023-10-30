import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';
import React from 'react';

export const theme = extendTheme(
  {
    colors: {
      brand: {
        50: '#e4d2cc',
        100: '#d9bdb4',
        200: '#c9a093',
        300: '#c08472',
        400: '#a95b43',
        500: '#92462f',
        600: '#85361d',
        700: '#6d230c',
        800: '#4c1707',
        900: '#310c01',
      },
    },
    config: {
      initialColorMode: 'light', // Default color mode (light mode)
    },
    styles: {
      global: (props: any) => ({
        body: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white', // Set background color for dark mode
          color: props.colorMode === 'dark' ? 'white' : 'gray.800', // Set text color for dark mode
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: 'brand' })
);
