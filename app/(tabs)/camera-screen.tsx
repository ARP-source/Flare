import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import type { SubjectType } from "@/lib/camera-utils";

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedSubject, setDetectedSubject] = useState<SubjectType | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [isApplyingVoiceAdjustments, setIsApplyingVoiceAdjustments] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Simulate subject detection
  useEffect(() => {
    const interval = setInterval(() => {
      const subjects: (SubjectType | null)[] = ["Car", "Portrait", "Architecture", "Generic", null];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      setDetectedSubject(randomSubject);

      if (randomSubject) {
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(2000),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleCapture = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.9,
        base64: true,
      });

      if (photo) {
        router.push({
          pathname: "/preview",
          params: { uri: photo.uri },
        } as any);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  };

  const toggleCameraFacing = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const handleVoiceRecord = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      // TODO: Implement actual voice recording with expo-av
      // For now, simulate voice input
      setVoiceText("make the red stand out");
      setIsApplyingVoiceAdjustments(true);

      // Simulate processing
      setTimeout(() => {
        setIsApplyingVoiceAdjustments(false);
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }, 1500);
    } else {
      setIsRecordingVoice(true);
      // TODO: Start recording voice
    }
  };

  const handleGallery = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/gallery" as any);
  };

  const handleSettings = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Navigate to settings
    console.log("Open settings");
  };

  if (!permission?.granted) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-8">
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <Text className="text-6xl">📷</Text>
        </View>
        <Text className="text-foreground text-2xl font-bold mb-3 text-center">Camera Access Required</Text>
        <Text className="text-muted text-base text-center mb-8">
          Flare needs access to your camera to take professional photos with intelligent subject detection.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 12,
          }}
        >
          <Text className="text-background font-semibold text-base">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Camera Viewfinder */}
      <CameraView ref={cameraRef} facing={facing} className="flex-1">
        {/* Subject Detection Badge */}
        {detectedSubject && (
          <Animated.View
            style={[
              styles.subjectBadge,
              {
                opacity: fadeAnim,
                backgroundColor: colors.surface,
                borderColor: colors.primary,
              },
            ]}
          >
            <Text className="text-primary font-bold text-sm">{detectedSubject}</Text>
          </Animated.View>
        )}

        {/* Voice Recording Indicator */}
        {isRecordingVoice && (
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              backgroundColor: "#EF4444",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "white",
              }}
            />
            <Text className="text-white font-semibold text-sm">Recording...</Text>
          </View>
        )}

        {/* Voice Processing Indicator */}
        {isApplyingVoiceAdjustments && (
          <View
            style={{
              position: "absolute",
              top: 50,
              right: 20,
              backgroundColor: colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
            }}
          >
            <Text className="text-background font-semibold text-sm">Processing voice...</Text>
          </View>
        )}

        {/* Bottom Controls */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 40,
            paddingHorizontal: 20,
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            paddingTop: 20,
          }}
        >
          {/* Top Row: Gallery and Settings */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleGallery}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.primary,
              }}
            >
              <Text className="text-2xl">🖼️</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={toggleCameraFacing}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-2xl">🔄</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSettings}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.surface,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-2xl">⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Middle Row: Voice Recording */}
          <TouchableOpacity
            onPress={handleVoiceRecord}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: isRecordingVoice ? "#EF4444" : colors.secondary,
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: 20,
              borderWidth: 3,
              borderColor: colors.background,
            }}
          >
            <Text className="text-2xl">{isRecordingVoice ? "⏹️" : "🎤"}</Text>
          </TouchableOpacity>

          {/* Capture Button */}
          <Pressable
            onPress={handleCapture}
            style={({ pressed }) => [
              {
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                borderWidth: 4,
                borderColor: colors.background,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              },
            ]}
          >
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                borderWidth: 3,
                borderColor: colors.background,
              }}
            />
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  subjectBadge: {
    position: "absolute",
    top: 60,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
});
