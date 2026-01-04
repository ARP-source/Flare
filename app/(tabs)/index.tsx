import { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Image, ActivityIndicator } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

import type { SubjectType } from "@/lib/camera-utils";

type SubjectTypeOrNull = SubjectType | null;

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [detectedSubject, setDetectedSubject] = useState<SubjectTypeOrNull>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const colors = useColors();

  // Request camera permission on mount
  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  // Simulate subject detection (placeholder for demo)
  // In production, this would capture frames and send to AI for analysis
  useEffect(() => {
    const interval = setInterval(() => {
      const subjects: SubjectTypeOrNull[] = ["Car", "Portrait", "Architecture", "Generic", null];
      const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
      setDetectedSubject(randomSubject);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCapture = async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9,
          base64: false,
        });

        if (photo) {
          // Navigate to preview screen with photo URI
          router.push({
            pathname: "/preview" as any,
            params: { uri: photo.uri },
          });
        }
      } catch (error) {
        console.error("Error capturing photo:", error);
      }
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
    // TODO: Open settings modal
    console.log("Open settings");
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Text className="text-2xl font-bold text-foreground mb-4 text-center">
          Camera Access Required
        </Text>
        <Text className="text-base text-muted mb-8 text-center">
          AI Camera Pro needs access to your camera to take professional photos with intelligent
          subject detection.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 32,
            paddingVertical: 16,
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
      {/* Full-screen camera viewfinder */}
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing}>
        {/* Subject Detection Indicator */}
        {detectedSubject && (
          <View className="absolute top-16 left-4">
            <View
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 8,
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
                  backgroundColor: colors.primary,
                }}
              />
              <Text className="text-white text-sm font-medium">
                {detectedSubject} Mode: Optimized
              </Text>
            </View>
          </View>
        )}

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 pb-12">
          <View className="flex-row items-center justify-between px-8">
            {/* Gallery Button */}
            <TouchableOpacity
              onPress={handleGallery}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <IconSymbol name="house.fill" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity
              onPress={handleCapture}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 4,
                borderColor: "#FFFFFF",
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.primary,
                }}
              />
            </TouchableOpacity>

            {/* Settings Button */}
            <TouchableOpacity
              onPress={handleSettings}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <IconSymbol name="chevron.right" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}
