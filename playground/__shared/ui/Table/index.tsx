import React from 'react';
import { Block } from '../Block';
import { Flexbox } from '../Flexbox';
import { Header } from '../Header';
import { TableRow } from './tableRow';
import { TableHeader } from './tableHeader';

export const Table = () => (
  <Block
    m='1rem'
    border
    style={{
      maxWidth: '1400px',
      width: 'min-content',
    }}
  >
    <TableHeader />
    <TableRow ki='12323' />
    <TableRow ki='2233' />
    <TableRow ki='32323' />
    <TableRow ki='42323' />
  </Block>
);
