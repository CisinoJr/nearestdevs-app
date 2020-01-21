import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, KeyboardAvoidingView, Keyboard } from "react-native";
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import DevsService from '../../services/devs.service';
import SocketService from '../../services/socket';

function Main({ navigation }) {
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');
  const [currentRegion, setCurrentRegion] = useState(null);
  const devsService = new DevsService();
  const socketService = new SocketService();

  useEffect(() => {
    async function loadInitialLocation() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });
      }

    }

    loadInitialLocation();
  }, []);

  useEffect(() => {
    socketService.subscribeToNewDevs(dev => setDevs([...devs, dev]));
  }, [devs]);

  async function loadDevs() {
    const { latitude, longitude } = currentRegion;
    const filter = {
      latitude,
      longitude,
      techs
    };

    const result = await devsService.search(filter);
    setDevs(result);
    setUpWebsocket();
  }

  function setUpWebsocket() {
    socketService.disconnect();

    const { latitude, longitude } = currentRegion;

    socketService.connect(latitude, longitude, techs);
  }

  async function handleRegionChange(region) {
    setCurrentRegion(region);
  }

  if (!currentRegion) {
    return null;
  }

  return (
    <>
      <MapView
        onRegionChangeComplete={handleRegionChange}
        initialRegion={currentRegion}
        style={styles.map}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        {devs.map(dev => (
          <Marker
            key={dev._id}
            coordinate={{
              longitude: dev.location.coordinates[0],
              latitude: dev.location.coordinates[1],
            }}
          >
            <Image
              style={styles.avatar}
              source={{ uri: dev.avatar_url }}
            />
            <Callout onPress={() => {
              navigation.navigate('Profile', { github_username: dev.github_username })
            }}>
              <View style={styles.callout}>
                <Text style={styles.devName}>{dev.name}</Text>
                <Text style={styles.devBio}>{dev.bio}</Text>
                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <KeyboardAvoidingView behavior="position" enabled >
        <View style={styles.searchForm}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar Devs por tecnologias..."
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={techs}
            onChangeText={setTechs}
          />

          <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
            <MaterialIcons name="my-location" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  callout: {
    width: 260,
  },
  devName: {
    fontWeight: 'bold',
    fontSize: 16
  },
  devBio: {
    color: '#666',
    marginTop: 5,
  },
  devTechs: {
    marginTop: 5,
  },
  searchForm: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row'
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4
    },
    elevation: 2,
  },
  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4Dff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  container: {
    flex: 1
  }
});


export default Main;
