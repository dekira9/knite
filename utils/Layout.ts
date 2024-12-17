import { Platform, Dimensions, StyleSheet, PixelRatio } from "react-native";

const baseFontSize = 16;

export const screenWidth = Dimensions.get("window").width;
const dynamicFontSize = screenWidth * (baseFontSize / 375);

const styles = StyleSheet.create({
  text: {
    fontSize: dynamicFontSize,
  },
});

const fontScale = PixelRatio.getFontScale();
export const getFontSize = size => size / fontScale;


// Size const
const MOCK_WIDTH = 375;

export const rem = (remValue = 1) => (remValue * screenWidth) / MOCK_WIDTH; // root element
const MOCK_HEIGHT = 812;
export const screenHeight = Dimensions.get("window").height;
export const vrem = (remValue = 1) => (remValue * screenHeight) / MOCK_HEIGHT;
export const vh = (vhValue = 1) => (vhValue * screenHeight) / 100; // 1 vhValue is 1% of screen height

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
const isLarge = width > 500;
const ios = Platform.OS === "ios";
const iphoneX =
  ios && (height / width === 2436 / 1125 || height / width === 1792 / 828);

export default {
  window: {
    width,
    height,
  },
  large: isLarge,
  tinyFont: getFontSize(10),
  smallFont: getFontSize(12),
  mainFont: getFontSize(14),
  medFont: getFontSize(16),
  standartFont: getFontSize(17),
  largeFont: getFontSize(18),
  largerFont: getFontSize(20),
  largestFont: getFontSize(22),
  titleFont: getFontSize(28),
  medLineHeight: getFontSize(22),
  semigiganticFont: getFontSize(32),
  almostGiganticFont: getFontSize(42),
  giganticFont: getFontSize(56),

  padding: isLarge ? 20 : 10,
  // mainFont: isLarge ? 32 : 14,
  mFont: isLarge ? 24 : 16,

  rowHeight: isLarge ? 80 : 60,
  closeSize: getFontSize(24),
  ios,
  iphoneX,
  statusBarHeight: ios ? (iphoneX ? 35 : 16) : 0,
  navbarHeight: Platform.OS === "ios" ? (iphoneX ? 108 : 80) : 64,
};
