import React, { Component } from 'react'
import { StatusBar } from 'react-native'

import OneSignal from 'react-native-onesignal'

import Routes from './routes'

import './config/ReactotronConfig'

class App extends Component {
  constructor(props) {
    super(props)

    OneSignal.init('7e54c1c4-ab92-4069-8773-8a0804bede51')
    OneSignal.addEventListener('received', this.onReceived)
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('ids', this.onIds)
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived)
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  onReceived = data => {}

  onOpened = notification => {}

  onIds = id => {}

  render() {
    return (
      <>
        <StatusBar barStyle='light-content' backgroundColor='#7159c1' />
        <Routes />
      </>
    )
  }
}

export default App
