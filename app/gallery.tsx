import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import type { StyleType } from "@/lib/camera-utils";

interface SavedPhoto {
  id: string;
  uri: string;
  style: StyleType;
  timestamp: number;
}

const STORAGE_KEY = "@ai_camera_photos";
const { width } = Dimensions.get("window");
const COLUMN_COUNT = 3;
const SPACING = 2;
const ITEM_SIZE = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

export default function GalleryScreen() {
  const router = useRouter();
  const colors = useColors();
  const [photos, setPhotos] = useState<SavedPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedPhoto[];
        // Sort by timestamp, newest first
        const sorted = parsed.sort((a, b) => b.timestamp - a.timestamp);
        setPhotos(sorted);
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoPress = (photo: SavedPhoto) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Open full-screen photo viewer
    console.log("Open photo:", photo.id);
  };

  const handleClose = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  const renderPhoto = ({ item }: { item: SavedPhoto }) => (
    <TouchableOpacity
      onPress={() => handlePhotoPress(item)}
      style={{
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        margin: SPACING / 2,
      }}
    >
      <Image
        source={{ uri: item.uri }}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 4,
        }}
        resizeMode="cover"
      />
      {/* Style badge */}
      <View
        style={{
          position: "absolute",
          bottom: 4,
          left: 4,
          right: 4,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          paddingHorizontal: 4,
          paddingVertical: 2,
          borderRadius: 4,
        }}
      >
        <Text
          className="text-white text-xs"
          numberOfLines={1}
          style={{ fontSize: 9 }}
        >
          {item.style}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-8">
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
      <Text className="text-foreground text-xl font-bold mb-2 text-center">
        No Photos Yet
      </Text>
      <Text className="text-muted text-base text-center mb-8">
        Start capturing professional photos with AI-powered subject detection and color grading.
      </Text>
      <TouchableOpacity
        onPress={handleClose}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text className="text-background font-semibold">Take Your First Photo</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text className="text-foreground text-xl font-bold">Gallery</Text>
        <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
          <Text className="text-primary font-semibold">Done</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Grid */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={{
            padding: SPACING / 2,
            flexGrow: 1,
          }}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}
