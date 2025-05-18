import React from 'react';
import Layout from './Layout';

export default function withLayout(ScreenComponent) {
  return function Wrapped(props) {
    return (
      <Layout>
        <ScreenComponent {...props} />
      </Layout>
    );
  };
}
