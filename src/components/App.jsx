import React, { Component, PropTypes } from 'react';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};

export default App;
