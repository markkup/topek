import { StyleSheet } from "react-native"
import { Color } from "./theme"

export default {
  app: {
    flex: 1
  },

  screen: {
    flex: 1,
    backgroundColor: Color.background
  },

  screenFields: {
    flex: 1,
    backgroundColor: Color.backgroundFields
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Color.separator
  },

  navbar: {
    backgroundColor: Color.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator
  },

  navbarBorderless: {
    backgroundColor: Color.white,
    shadowColor: "transparent",
    borderBottomWidth: 0
  },

  navbarTinted: {
    backgroundColor: Color.tint,
    shadowColor: "transparent"
  },

  navbarLarge: {
    backgroundColor: Color.tint,
    shadowColor: "transparent",
    height: 88
  },

  navbarTitle: {
    color: Color.black
  },

  navbarModal: {
    backgroundColor: "#f7f7f7"
  },

  navbarTitleModal: {
    color: "#000"
  }

}