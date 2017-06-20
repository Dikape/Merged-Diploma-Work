import React from 'react';

export default function NotFound() {
  require('./NotFound.scss');
  return (
    <div className="container not-found">
      <h1>404!</h1>
      <h2>Даної сторінки не знайдено.</h2>
    </div>
  );
}
