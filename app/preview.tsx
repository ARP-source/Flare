import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { applyFilter, getFilterDescription } from "@/lib/filters";
import type { StyleType } from "@/lib/camera-utils";

const STYLES: StyleType[] = [
  "The Silver Screen",
  "Classic Chrome",
  "Portra 400",
  "Dark Mood",
  "Editorial Bright",
  "Eterna",
];



export default function PreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  const photoUri = params.uri as string;

  const [selectedStyle, setSelectedStyle] = useState<StyleType>("The Silver Screen");
  const [isSaving, setIsSaving] = useState(false);
  const [processedImageUri, setProcessedImageUri] = useState<string>(photoUri);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStyleSelect = async (style: StyleType) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedStyle(style);

    // Apply filter to image
    setIsProcessing(true);
    try {
      const filtered = await applyFilter(photoUri, style);
      setProcessedImageUri(filtered);
    } catch (error) {
      console.error("Error applying filter:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save photo to AsyncStorage
      const STORAGE_KEY = "@ai_camera_photos";
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const photos = stored ? JSON.parse(stored) : [];

      const newPhoto = {
        id: Date.now().toString(),
        uri: processedImageUri,
        style: selectedStyle,
        timestamp: Date.now(),
      };

      photos.push(newPhoto);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      console.log("Photo saved with style:", selectedStyle);

      // Navigate back to camera
      router.back();
    } catch (error) {
      console.error("Error saving photo:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetake = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  if (!photoUri) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text className="text-foreground text-lg">No photo to preview</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        style={{
          paddingTop: Platform.OS === "ios" ? 50 : 20,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={handleRetake} style={{ padding: 8 }}>
          <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text className="text-foreground text-lg font-semibold">Preview</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            backgroundColor: colors.primary,
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <Text className="text-background font-semibold">
            {isSaving ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Photo Preview */}
      <View className="flex-1 items-center justify-center p-4">
        <Image
          source={{ uri: processedImageUri }}
          style={{
            width: "100%",
            aspectRatio: 3 / 4,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
        {/* Style badge overlay */}
        <View
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.secondary,
          }}
        >
          <Text className="text-white text-xs font-medium">{selectedStyle}</Text>
        </View>
      </View>

      {/* Style Carousel */}
      <View
        style={{
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Text className="text-foreground text-sm font-semibold px-4 mb-3">
          Professional Styles
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            gap: 12,
          }}
        >
          {STYLES.map((style) => {
            const isSelected = style === selectedStyle;
            return (
              <TouchableOpacity
                key={style}
                onPress={() => handleStyleSelect(style)}
                style={{
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {/* Style Thumbnail */}
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    backgroundColor: colors.surface,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? colors.secondary : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text className="text-foreground text-2xl">
                    {style === "The Silver Screen" && "🎬"}
                    {style === "Classic Chrome" && "📷"}
                    {style === "Portra 400" && "🌅"}
                    {style === "Dark Mood" && "🌙"}
                    {style === "Editorial Bright" && "☀️"}
                    {style === "Eterna" && "🎞️"}
                  </Text>
                </View>
                {/* Style Name */}
                <View style={{ width: 80, alignItems: "center" }}>
                  <Text
                    className="text-xs font-medium text-center"
                    style={{
                      color: isSelected ? colors.secondary : colors.muted,
                    }}
                    numberOfLines={2}
                  >
                    {style}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <Text className="text-muted text-xs px-4 mt-2">
          {getFilterDescription(selectedStyle)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          paddingHorizontal: 16,
          paddingBottom: Platform.OS === "ios" ? 32 : 16,
          paddingTop: 12,
        }}
      >
        <TouchableOpacity
          onPress={handleRetake}
          style={{
            flex: 1,
            paddingVertical: 16,
            borderRadius: 12,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
          }}
        >
          <Text className="text-foreground font-semibold">Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={{
            flex: 1,
            paddingVertical: 16,
            borderRadius: 12,
            backgroundColor: colors.primary,
            alignItems: "center",
            opacity: isSaving ? 0.6 : 1,
          }}
        >
          <Text className="text-background font-semibold">
            {isSaving ? "Saving..." : "Save Photo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
