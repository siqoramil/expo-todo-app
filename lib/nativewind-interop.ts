import { cssInterop } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";

cssInterop(LinearGradient, {
  className: "style",
});

cssInterop(Image, {
  className: "style",
});
