# react-wallet-selector

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-wallet-selector.svg)](https://www.npmjs.com/package/react-wallet-selector) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-wallet-selector
```

## Usage

```jsx
import React, { Component } from 'react'

import { SelectWallet, SendTransactionZkapp, SendWallet, SignWallet, methods } from "react-wallet-selector";
import "../node_modules/react-wallet-selector/dist/index.min.css";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class Example extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row mt-5">
          <div className="col-4">
            <SelectWallet />
          </div>
          <div className="col-4">
            <SignWallet />
            <br />
            <SendTransactionZkapp zkAppAddress="" />
          </div>
          <div className="col-4">
            <SendWallet />
          </div>
        </div>
      </div>
    )
  }
}
```

## License

MIT © [Sotatek-HoangNguyen7](https://github.com/Sotatek-HoangNguyen7)
