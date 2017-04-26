import { StyleSheet } from "react-native"
import { Color, Dims } from "./theme"

export default {
  navbar: {
    backgroundColor: Color.white,
    elevation: 0,
    paddingTop: 18,
    height: Dims.navbarHeight,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator
  },

  navbarBorderless: {
    backgroundColor: Color.white,
    elevation: 0,
    paddingTop: 18,
    height: Dims.navbarHeight,
    shadowColor: "transparent",
    borderBottomWidth: 0
  },

  navbarTinted: {
    backgroundColor: Color.white,
    elevation: 0,
    paddingTop: 18,
    height: Dims.navbarHeight
  },

  navbarModal: {
    backgroundColor: Color.white,
    elevation: 0,
    paddingTop: 16,
    height: Dims.navbarHeight
  }
}