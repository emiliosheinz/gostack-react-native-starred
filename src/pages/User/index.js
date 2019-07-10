import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ActivityIndicator } from 'react-native'

import { TouchableOpacity } from 'react-native-gesture-handler'
import api from '../../services/api'

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  FavList,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles'

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  })

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  }

  state = {
    stars: [],
    loading: false,
    page: 1,
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const { page } = this.state
    const { navigation } = this.props
    const user = navigation.getParam('user')

    const response = await api.get(`/users/${user.login}/starred?page=${page}`)

    this.setState({
      stars: response.data,
      loading: false,
    })
  }

  loadMoreRepos = async () => {
    const { page, stars } = this.state
    const { navigation } = this.props
    const user = navigation.getParam('user')

    const response = await api.get(
      `/users/${user.login}/starred?page=${page + 1}`
    )

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
    })
  }

  render() {
    const { stars, loading } = this.state
    const { navigation } = this.props
    const user = navigation.getParam('user')

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 30 }} />
        ) : (
          <FavList
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMoreRepos}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Repository', {
                    url: item.html_url,
                    name: item.name,
                  })
                }
              >
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </TouchableOpacity>
            )}
          />
        )}
      </Container>
    )
  }
}
