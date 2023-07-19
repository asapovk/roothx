import React from 'react';
import { Block } from '../Block';
import { Flexbox } from '../Flexbox';
import { Header } from '../Header';
import { Text } from '../Text';

export const TableHeader = () => (
  <Block backgoundColor='panel'>
    <Flexbox
      justifyContent='space-between'
      style={{ height: '100px', textAlign: 'center' }}
    >
      <Block
        p={'1rem'}
        style={{
          minWidth: '300px',
        }}
      >
        <Header size='s'>One</Header>
      </Block>
      <Block
        p={'1rem'}
        style={{
          minWidth: '300px',
        }}
      >
        <Header size='s'>One</Header>
      </Block>
      <Block
        p={'1rem'}
        style={{
          minWidth: '300px',
        }}
      >
        <Header size='s'>One</Header>
      </Block>
      <Block
        p={'1rem'}
        style={{
          minWidth: '300px',
        }}
      >
        <Header size='s'>One</Header>
      </Block>
    </Flexbox>
  </Block>
);
