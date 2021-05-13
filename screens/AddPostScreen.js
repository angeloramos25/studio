import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ActionSheet from 'react-native-actionsheet';
import * as ImagePicker from 'expo-image-picker';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default class AddPostScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      image: null,
      isSaving: false,
      errorMessage: '',
    }
    this.addPost = this.addPost.bind(this);
    this.handleActionSheet = this.handleActionSheet.bind(this);
  }

  async handleActionSheet(index) {
    if (index === 0) { // camera
      let { status } = await ImagePicker.getCameraPermissionsAsync();

      if (status === 'denied') {
        return;
      } else if (status === 'undetermined') {
        const newPermission = await ImagePicker.requestCameraPermissionsAsync();
        status = newPermission.status;
      }

      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        if (!result.cancelled) {
          this.setState({ image: result.uri });
        }
      }
    } else if (index === 1) { // camera roll
      let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

      if (status === 'denied') {
        return;
      } else if (status === 'undetermined') {
        const newPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        status = newPermission.status;
      }

      if (status === 'granted') {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        if (!result.cancelled) {
          this.setState({ image: result.uri });
        }
      }
    }
  }

  async addPost() {

    let errorMessage;
    if (this.state.title === '') {
      errorMessage = 'Please input a title.';
    } else if (this.state.description === '') {
      errorMessage = 'Please input a description.';
    }

    if (errorMessage) {
      this.setState({ errorMessage });
      return;
    }

    const userDoc = (await firestore().collection('Clients').doc(auth().currentUser.uid).get())._data;

    const postObj = {
      userID: auth().currentUser.uid,
      title: this.state.title,
      description: this.state.description,
      timestamp: (new Date()).getTime(),
      comments: [],
      likes: [],
      hasImage: this.state.image !== null,
    };

    this.setState({ isSaving: true });

    const newPostID = (await firestore().collection('Challenges/' + this.props.route.params.challengeID + '/Feed').add(postObj)).id;

    if (this.state.image) {
      const reference = storage().ref(newPostID + '.jpg');
      const pathToFile = this.state.image;
      await reference.putFile(pathToFile);
    }

    this.setState({ isSaving: false });
    this.props.navigation.navigate('UserChallengeDetail', {
      shouldRefresh: true,
    });
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title="Add Post"
          leftButtonText="Cancel"
          leftButtonColor={Styling.colors.red}
          onLeftPress={() => this.props.navigation.goBack()}
          rightButtonText="Finish"
          rightButtonColor={Styling.colors.primary}
          onRightPress={this.addPost}
        />
        <SafeAreaView style={{...Styling.containers.wrapper, flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ paddingBottom: 196 }} ref={scrollView => this.scrollView = scrollView} showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {this.state.errorMessage !== '' && <Text style={{...Styling.text.header, color: Styling.colors.red, textAlign: 'center', marginTop: 12 }}>{this.state.errorMessage}</Text>}
            <View style={{...Styling.containers.card, marginTop: 24 }}>
              <Text style={Styling.text.header}>Title</Text>
              <TextInput
                style={Styling.textfields.floating}
                placeholder="Add a title..."
                placeholderTextColor="lightgray"
                onChangeText={text => this.setState({ title: text })}
                value={this.state.title}
              />
            </View>
            <View style={{...Styling.containers.card, marginTop: 24 }}>
              <Text style={Styling.text.header}>Description</Text>
              <TextInput
                style={Styling.textfields.floating}
                placeholder="Add a description..."
                placeholderTextColor="lightgray"
                onChangeText={text => this.setState({ description: text })}
                value={this.state.description}
              />
            </View>
            <View style={{...Styling.containers.card, marginTop: 24 }}>
              <Text style={Styling.text.header}>Picture (optional)</Text>
              {this.state.image ?
                <TouchableOpacity
                  style={{ marginTop: 12 }}
                  onPress={() => this.ActionSheet.show()}
                >
                  <Image source={{ uri: this.state.image }} style={{ width: 100, height: 100, borderRadius: 10 }} />
                  <Text style={{...Styling.text.subheader, color: Styling.colors.primary, marginTop: 12 }}>Change Image</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={{ marginTop: 12 }}
                  onPress={() => this.ActionSheet.show()}
                >
                  <Text style={{...Styling.text.subheader, color: Styling.colors.primary }}>Add Image</Text>
                </TouchableOpacity>
              }
            </View>
            <Button
              type="cta"
              loading={this.state.isSaving}
              text="Post to feed"
              onPress={this.addPost}
              style={{ marginTop: 24 }}
            />
          </ScrollView>
        </SafeAreaView>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={'Image Options'}
          options={['Camera', 'Photo Library', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheet}
        />
      </View>
    )
  }
}
