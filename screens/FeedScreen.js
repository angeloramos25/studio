import React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DoubleClick from 'react-native-double-tap';

import Images from '../assets/Images.js';
import Styling from '../constants/Styling';
import TopBar from '../components/TopBar';
import PostCard from '../components/CustomActivityCard';
import { daysAgo } from '../utils';

export default class FeedScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      activities: [],
      commentInputs: {},
      inputLoading: [],
      refreshing: false,
    };
    this.loadPosts = this.loadPosts.bind(this);
    this.postComment = this.postComment.bind(this);
    this.handleLikePressed = this.handleLikePressed.bind(this);
  }

  async componentDidMount() {
    // auth().signOut();
    this.loadPosts();
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      if (this.props.route.params && this.props.route.params.shouldRefresh) {
        this.loadPosts();
        this.props.route.params.shouldRefresh = false;
      }
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  async handleLikePressed(postID) {
    const likeObj = {
      userID: auth().currentUser.uid,
      username: this.state.user.username,
      displayName: this.state.user.firstName + ' ' + this.state.user.lastName,
    }
    const activities = this.state.activities;
    const isAlreadyLiked = activities.find(a => a.id === postID).likes.some(l => l.userID === auth().currentUser.uid);
    const postIndex = activities.findIndex(a => a.id === postID);
    const activity = activities[postIndex];

    if (isAlreadyLiked) {
      await firestore().collection('Activities').doc(postID).update({
        likes: firestore.FieldValue.arrayRemove(likeObj),
      });

      const likeIndex = activities[postIndex].likes.findIndex(l => l.userID === auth().currentUser.uid)
      activities[postIndex].likes.splice(likeIndex, 1);
    } else {
      await firestore().collection('Activities').doc(postID).update({
        likes: firestore.FieldValue.arrayUnion(likeObj),
      });

      if (auth().currentUser.uid !== activity.userID) {
        await firestore().collection('Users').doc(activity.userID).update({
          notifications: firestore.FieldValue.arrayUnion({
            type: 'like',
            postTitle: activity.title,
            postID: activity.id,
            authorID: auth().currentUser.uid,
            authorUsername: this.state.user.username,
            displayName: this.state.user.firstName + ' ' + this.state.user.lastName,
            timestamp: (new Date()).getTime(),
          }),
        });
      }
      activities[activities.findIndex(a => a.id === postID)].likes.push(likeObj);
    }

    this.setState({
      activities
    });
  }

  async loadPosts() {
    this.setState({ refreshing: true });
    const userDoc = (await firestore().collection('Users').doc(auth().currentUser.uid).get())._data;
    const friendIDs = userDoc.friendIDs;
    const activities = (await firestore()
      .collection('Activities')
      .where('userID', 'in', friendIDs.concat([auth().currentUser.uid]))
      .where('shouldPostToFeed', '==', true)
      .orderBy('timestamp', 'desc')
      .limit(25)
      .get())
      ._docs
      .map(a => ({...a._data, id: a.id }));

    for (let i = 0; i < activities.length; i++) {
      if (activities[i].hasImage) {
        storage().ref(activities[i].id + '.jpg')
          .getDownloadURL()
          .then((url) => {
            const a = this.state.activities;
            a[i].imageUrl = url;
            this.setState({ activities: a });
          })
      }
      storage().ref(activities[i].userID + '.jpg')
        .getDownloadURL()
        .then((url) => {
          const a = this.state.activities;
          a[i].profilePicUrl = url;
          this.setState({ activities: a });
        })
    }

    this.setState({
      user: userDoc,
      activities,
      refreshing: false,
    });
  }

  async postComment(postID) {
    const commentInputs = this.state.commentInputs;
    this.setState({ inputLoading: this.state.inputLoading.concat([postID] )});
    const commentObj = {
      authorID: auth().currentUser.uid,
      authorUsername: this.state.user.username,
      text: commentInputs[postID]
    };

    await firestore().collection('Activities').doc(postID).update({
      comments: firestore.FieldValue.arrayUnion(commentObj),
    });

    const activities = this.state.activities;
    activities[activities.findIndex(a => a.id === postID)].comments.push(commentObj);
    const activity = activities[activities.findIndex(a => a.id === postID)];

    if (auth().currentUser.uid !== activity.userID) {
      await firestore().collection('Users').doc(activity.userID).update({
        notifications: firestore.FieldValue.arrayUnion({
          type: 'comment',
          postTitle: activity.title,
          postID: activity.id,
          authorID: auth().currentUser.uid,
          authorUsername: this.state.user.username,
          displayName: this.state.user.firstName + ' ' + this.state.user.lastName,
          commentText: commentInputs[postID],
          timestamp: (new Date()).getTime(),
        }),
      });
    }

    commentInputs[postID] = '';

    const inputLoading = this.state.inputLoading;
    inputLoading.splice(this.state.inputLoading.indexOf(postID), 1);

    this.setState({
      activities,
      commentInputs,
      inputLoading,
    });
  }

  render() {
    return(
      <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
        <TopBar
          title="Feed"
          rightButtonImage="add_friend"
          onRightPress={() => this.props.navigation.navigate('AddFriends')}
        />
        <SafeAreaView style={{...Styling.containers.wrapper, flex: 1 }}>
          <FlatList
            ref={ref => this.flatListRef = ref}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.loadPosts}
              />
            }
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            data={this.state.activities}
            keyExtractor={activity => activity.id}
            contentContainerStyle={{ paddingBottom: 196 }}
            renderItem={({item, index}) => {
              return (
              <View
                style={{ marginTop: 24 }}
              >
                <View style={{...Styling.containers.row, justifyContent: 'space-between' }}>
                  <TouchableOpacity style={Styling.containers.row} onPress={() => this.props.navigation.navigate('ProfilePopup', { uid: item.userID })}>
                    <Image style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }} source={{ uri: item.profilePicUrl }} />
                    <Text style={Styling.text.header}>{item.username}</Text>
                  </TouchableOpacity>
                  <Text style={Styling.text.body}>{daysAgo(item.timestamp)}</Text>
                </View>
                <DoubleClick doubleTap={() => this.handleLikePressed(item.id)}>
                  <PostCard {...item} />
                </DoubleClick>
                <View style={{...Styling.containers.row, marginTop: 12 }}>
                  <TouchableOpacity onPress={() => this.handleLikePressed(item.id)}>
                    <Image
                      style={{ width: 25, height: 25, marginRight: 8 }}
                      source={item.likes.filter(a => a.userID === auth().currentUser.uid).length > 0 ?
                        Images.heart_filled
                        :
                        Images.heart}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('LikesList', { likes: item.likes })}>
                    <Text style={Styling.text.header}>{item.likes.length + ' likes'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{...Styling.containers.card, ...Styling.containers.row, marginTop: 12, padding: 4 }}>
                  <TextInput
                    onFocus={() => this.flatListRef.scrollToIndex({ animated: true, index: index })}
                    value={this.state.commentInputs[item.id]}
                    onSubmitEditing={this.handleSearch}
                    style={{...Styling.textfields.floating, flex: 15 }}
                    placeholder="Add a comment..."
                    placeholderTextColor="lightgray"
                    onChangeText={comment => {
                      const commentInputs = this.state.commentInputs;
                      commentInputs[item.id] = comment;
                      this.setState({ commentInputs })
                    }}
                    value={this.state.commentInputs[item.id]}
                  />
                  {this.state.inputLoading.includes(item.id) ?
                    <ActivityIndicator size="small" color="black" animating={true}/>
                    :
                    <TouchableOpacity disabled={!this.state.commentInputs[item.id]} onPress={() => this.postComment(item.id)}>
                      <Text style={{...Styling.text.cta, flex: 2, marginTop: 4, marginRight: 4, color: this.state.commentInputs[item.id] ? Styling.colors.primary : 'lightgray' }}>Post</Text>
                    </TouchableOpacity>
                  }
                </View>
                <View style={{ marginTop: 8 }}>
                  {item.comments.map(comment =>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfilePopup', { uid: comment.authorID })} style={{ marginTop: 4 }} key={comment.authorID + comment.text}>
                      <Text style={{...Styling.text.subheader}}>{comment.authorUsername}
                        <Text style={Styling.text.body}>{' ' + comment.text}</Text>
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}}
          />
        </SafeAreaView>
      </View>
    );
  }
}
