import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Platform, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { ADVANCED_FILTERS } from "@/lib/advanced-filters";

const FILTER_NAMES = Object.keys(ADVANCED_FILTERS);

export default function PreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useColors();
  const photoUri = params.uri as string;

  const [selectedFilter, setSelectedFilter] = useState<string>(FILTER_NAMES[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImageBase64, setProcessedImageBase64] = useState<string>("");
  const [originalImageBase64, setOriginalImageBase64] = useState<string>("");

  // Load and convert image to base64
  useEffect(() => {
    const loadImage = async () => {
      try {
        const base64 = await FileSystem.readAsStringAsync(photoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setOriginalImageBase64(base64);
        setProcessedImageBase64(base64);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };

    loadImage();
  }, [photoUri]);

  // Apply filter using server-side processing
  const handleFilterSelect = async (filterName: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setSelectedFilter(filterName);
    setIsProcessing(true);

    try {
      // Call server to apply filter
      const result = await trpc.filters.applyPreset.useMutation().mutateAsync({
        imageBase64: originalImageBase64,
        filterName: filterName,
      });

      if (result.success) {
        setProcessedImageBase64(result.imageBase64);
      }
    } catch (error) {
      console.error("Error applying filter:", error);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save processed image to file system
      const fileName = `flare_${Date.now()}.jpg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(filePath, processedImageBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save metadata to AsyncStorage
      const STORAGE_KEY = "@flare_photos";
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const photos = stored ? JSON.parse(stored) : [];

      const newPhoto = {
        id: Date.now().toString(),
        uri: filePath,
        filter: selectedFilter,
        timestamp: Date.now(),
      };

      photos.push(newPhoto);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));

      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      console.log("Photo saved with filter:", selectedFilter);

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

  return (
    <ScreenContainer className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* Preview Image */}
        <View className="flex-1 items-center justify-center mb-6">
          {processedImageBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${processedImageBase64}` }}
              style={{
                width: "100%",
                height: 400,
                borderRadius: 16,
                marginBottom: 16,
              }}
              resizeMode="cover"
            />
          ) : (
            <ActivityIndicator size="large" color={colors.primary} />
          )}

          {isProcessing && (
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: [{ translateX: -25 }, { translateY: -25 }],
              }}
            >
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
        </View>

        {/* Filter Selection */}
        <View className="px-4 mb-6">
          <Text className="text-foreground text-lg font-bold mb-4">Choose Filter</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            style={{ marginBottom: 16 }}
          >
            {FILTER_NAMES.map((filterName) => (
              <TouchableOpacity
                key={filterName}
                onPress={() => handleFilterSelect(filterName)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedFilter === filterName ? colors.primary : colors.surface,
                  borderWidth: 2,
                  borderColor: selectedFilter === filterName ? colors.primary : colors.border,
                }}
              >
                <Text
                  className={selectedFilter === filterName ? "text-background font-semibold" : "text-foreground font-semibold"}
                  numberOfLines={1}
                >
                  {filterName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-4 px-4 mb-8">
          <TouchableOpacity
            onPress={handleRetake}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.surface,
              borderWidth: 2,
              borderColor: colors.border,
              alignItems: "center",
            }}
          >
            <Text className="text-foreground font-semibold">Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={isSaving || isProcessing}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 12,
              backgroundColor: colors.primary,
              alignItems: "center",
              opacity: isSaving || isProcessing ? 0.6 : 1,
            }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.background} />
            ) : (
              <Text className="text-background font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
