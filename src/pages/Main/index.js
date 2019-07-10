import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-community/async-storage'
import { Keyboard, ActivityIndicator } from 'react-native'

import api from '../../services/api'

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  PofileButtonText,
  ProfileButton,
  Name,
  Avatar,
  User,
  Bio,
} from './styles'

export default class Main extends Component {
  static navigationOptions = {
    title: 'Usuários',
  }

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  }

  state = {
    newUser: '',
    users: [],
    loading: false,
  }

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users')

    if (JSON.parse(users)) {
      this.setState({
        users: JSON.parse(users),
      })
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users))
    }
  }

  handleSubmit = async () => {
    const { users, newUser } = this.state
    console.tron.log(users)
    this.setState({ loading: true })

    const response = await api.get(`/users/${newUser}`)

    const { name, login, bio, avatar_url } = response.data
    const data = {
      name,
      login,
      bio,
      avatar: avatar_url,
    }

    this.setState({
      users: [...users, data],
      newUser: '',
      loading: false,
    })

    Keyboard.dismiss()
  }

  handleNavigate = user => {
    const { navigation } = this.props

    navigation.navigate('User', { user })
  }

  render() {
    const { users, newUser, loading } = this.state

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize='none'
            placeholder='Adicionar usuário'
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType='send'
            onSubmitEditing={this.handleSubmit}
          />
          <SubmitButton loading={loading} onPress={this.handleSubmit}>
            {loading ? (
              <ActivityIndicator color='#FFF' />
            ) : (
              <Icon name='add' size={20} color='#fff' />
            )}
          </SubmitButton>
        </Form>
        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>
              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <PofileButtonText>Ver Perfil</PofileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    )
  }
}
