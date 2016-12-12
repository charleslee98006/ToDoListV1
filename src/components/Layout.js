// src/components/Layout.js
import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="app-container">
        <header>
          <Link to="/">
          </Link>
        </header>
        <div className="app-content">{this.props.children}</div>
        <footer>
          <p>This is a To Do App v1</p>
        </footer>
      </div>
    );
  }
}