import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";

import logoImage from './assets/github-icon.png';

import api from './services/api';

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepositories(response.data);
    })
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const likedRepository = response.data;

    const repositoriesUpdated = repositories.map(repository => {
      if (repository.id === id) {
        return likedRepository;
      } else {
        return repository;
      }
    });

    setRepositories(repositoriesUpdated);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F0F5" />
      <SafeAreaView style={ styles.container }>
        <View>
          <Image 
            source={ logoImage } 
            style={
              { width: 180, 
                resizeMode: "contain", 
                marginLeft: 100}} />
        </View>

        <View >          
          <FlatList 
            data={ repositories } 
            keyExtractor={ repository => repository.id }
            renderItem={({ item: repository }) => (
              
              <View style={ styles.repositoryContainer }>
              <Text style={ styles.repository }>{ repository.title }</Text>

              <View style={ styles.techsContainer }>
                {repository.techs.map(tech => (
                  <Text key={tech} style={ styles.tech }>
                    {tech}
                  </Text>
                ))}
              </View>

              <View style={ styles.likesContainer }>
                <Text
                  style={ styles.likeText }
                  testID={`repository-likes-${ repository.id }`}
                >
                  { repository.likes } curtida{ repository.likes > 1 ? 's' : ''}
                </Text>
              </View>

              <TouchableOpacity
                style={ styles.button }
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${ repository.id }`}
              >
                <Text style={ styles.buttonText }>Curtir</Text>
              </TouchableOpacity>
            </View>
                            
            )} />          
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F5",
  },
  repositoryContainer: {
    marginBottom: 20,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20, 
    borderRadius: 20    
  },
  repository: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#615F5F"
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10
  },
  tech: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#CCC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
    borderRadius: 10
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  likeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#615F5F"
  },
  button: {
    marginTop: 20,
    width: 90
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5
  },
});
