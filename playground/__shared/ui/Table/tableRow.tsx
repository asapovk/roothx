import React from 'react';
import { Block } from '../Block';
import { Flexbox } from '../Flexbox';
import { Header } from '../Header';
import { Text } from '../Text';
import { Checkbox } from '../Checkbox';

export const TableRow = ({ ki }: { ki: string }) => (
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
      <Checkbox ki={ki} style={{ display: 'flex', alignItems: 'center' }}>
        <Text>Heloo</Text>
      </Checkbox>
    </Block>
    <Block
      p={'1rem'}
      style={{
        minWidth: '300px',
      }}
    >
      <Text size='s'>One</Text>
    </Block>
    <Block
      p={'1rem'}
      style={{
        minWidth: '300px',
      }}
    >
      <Text size='s'>One</Text>
    </Block>
    <Block
      p={'1rem'}
      style={{
        minWidth: '300px',
      }}
    >
      <Text size='s'>One</Text>
    </Block>
  </Flexbox>
);
