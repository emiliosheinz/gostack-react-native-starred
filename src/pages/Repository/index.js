import React from 'react'
import PropTypes from 'prop-types'
import { WebView } from 'react-native-webview'

export default function Repository(props) {
  const { navigation } = props

  return <WebView source={{ uri: navigation.getParam('url') }} />
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('name'),
})
