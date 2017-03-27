import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableOpacity, Keyboard, Image } from "react-native"
import { ToolbarTextButton, ToolbarButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, FieldGroup, TouchableField, KeyboardAwareScrollView } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import * as Models from "../models"
import Validate from "../lib/validate"
import Styles, { Color, Dims } from "../styles"

import ActionSheet from "react-native-actionsheet"
import ImagePicker from "react-native-image-crop-picker"

class Props extends PropMap {
  map(props) {
    props.newTopic = this.state.topics.newTopic;
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.updateNewTopic = this.bindEvent(TopicActions.updateNewTopic);
  }
}

@connectprops(Props)
export default class TopicAddScreen extends Component {

  static navigationOptions = {
    title: "New Topic",
    header: ({state}, defaultHeader) => ({
      ...defaultHeader,
      left: <ToolbarButton name="close" onPress={() => state.params.leftClick()} />,
      right: <ToolbarTextButton title="Next" active={true} disabled={!state.params || !state.params.valid} onPress={() => state.params.rightClick()} />,
      backTitle: " "
    })
  }

  constructor(props){
    super(props);
    this.state = {
      title: "",
      description: ""
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      leftClick: () => this._cancel(),
      rightClick: () => this._next(),
      valid: false
    });

    setTimeout(() => this.refs.form.refs.subject.refs.title.focus(), 800);
  }

  render() {
    
    let image = null;
    if (this.props.newTopic && this.props.newTopic.image.valid) {
      image = (
        <Image
          style={{width: 60, height: 60, marginTop: 5, marginLeft: 5, borderRadius: 4}}
          source={{uri:this.props.newTopic.image.url}}
        />
      )
    }
    else {
      image = (
        <Image
          style={{width: 40, height: 40, marginTop: 15, marginLeft: 15}}
          source={require("../assets/images/photo-add-512.png")}
        />
      )
      
    }

    return (
      <KeyboardAwareScrollView style={Styles.screenFields} keyboardShouldPersistTaps="always">

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form"
          onChange={this._handleFormChange.bind(this)}>
        
          <FieldGroup title="Subject" ref="subject">

            <InputField 
              ref="title"
              multiline={true}
              height={70}
              iconRight={<TouchableOpacity onPress={() => this._photoClick()}>{image}</TouchableOpacity>}
            />

          </FieldGroup>

          <FieldGroup title="Description">

            <InputField 
              ref="description"
              multiline={true}
              height={115}
              placeholder="Optional" 
            />

          </FieldGroup>

        </Form>

        <ActionSheet 
          ref={(c) => this.addPhoto = c}
          options={["Cancel", "From Library", "From Camera"]}
          cancelButtonIndex={0}
          onPress={this._handleAddphoto.bind(this)}
        />

        <ActionSheet 
          ref={(c) => this.updatePhoto = c}
          options={["Cancel", "From Library", "From Camera", "Remove Photo"]}
          cancelButtonIndex={0}
          destructiveButtonIndex={3}
          onPress={this._handleAddphoto.bind(this)}
        />

      </KeyboardAwareScrollView>
    )
  }

  _handleFormChange(data) {
    this.setState({
      title: data.title,
      description: data.description
    })
    this.props.navigation.setParams({valid: Validate.isNotEmpty(data.title)});
  }

  _photoClick() {
    this.props.newTopic.image.valid ? this.updatePhoto.show() : this.addPhoto.show()
  }

  _handleAddphoto(index) {
    console.log("index", index);
    if (index == 1) {
      this._choosePhoto(false)
    }
    else if (index == 2) {
      this._choosePhoto(true)
    }
    else if (index == 3) {
      this._removePhoto()
    }
  }

  _choosePhoto(fromCamera) {
    if (!fromCamera) {
      ImagePicker.openPicker({
        width: 400,
        height: 400,
        cropping: true,
        includeBase64: true
      }).then(image => {
        this._savePhoto(Models.Image.fromBase64(`data:${image.mime};base64,${image.data}`));
      }).catch(e => {
        // ignore
      })
    }
    else {
      ImagePicker.openCamera({
        width: 200,
        height: 200,
        cropping: true,
        includeBase64: true
      }).then(image => {
        this._savePhoto(Models.Image.fromBase64(`data:${image.mime};base64,${image.data}`));
      }).catch(e => {
        // ignore
      })
    }
  }

  async _removePhoto() {
    await this.props.updateNewTopic("image", new Models.Image());
  }

  async _savePhoto(image) {
    await this.props.updateNewTopic("image", image);
  }

  async _next() {
    await this.props.updateNewTopic("name", this.state.title);
    await this.props.updateNewTopic("description", this.state.description);

    Keyboard.dismiss()
    this.props.navigation.navigate("TopicAddType")
  }

  _cancel() {
    Keyboard.dismiss()
    this.props.navigation.goBack(null)
  }
}

let styles = StyleSheet.create({
})
