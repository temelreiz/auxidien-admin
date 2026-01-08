// components/Header.tsx
// Hamburger butonlu Header component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const colors = {
  primary: '#F5A623',
  background: '#1A1A2E',
  surface: '#252542',
  text: '#FFFFFF',
  textSecondary: '#A0A0B0',
};

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showNotification?: boolean;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
}

export default function Header({
  title = 'Altın Borsası',
  showBack = false,
  showMenu = true,
  showNotification = true,
  rightComponent,
  onBackPress,
}: HeaderProps) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const goBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.content}>
        {/* Sol taraf - Hamburger veya Back */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity style={styles.iconButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ) : showMenu ? (
            <TouchableOpacity style={styles.iconButton} onPress={openDrawer}>
              <Ionicons name="menu" size={26} color={colors.text} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>

        {/* Orta - Title */}
        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>

        {/* Sağ taraf - Notification veya Custom */}
        <View style={styles.rightSection}>
          {rightComponent ? (
            rightComponent
          ) : showNotification ? (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => navigation.navigate('notifications' as never)}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              {/* Notification badge */}
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.iconButton} />
          )}
        </View>
      </View>
    </View>
  );
}

// Mini Header - Sadece hamburger ve profil
export function MiniHeader() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={[styles.miniContainer, { paddingTop: insets.top }]}>
      <TouchableOpacity style={styles.iconButton} onPress={openDrawer}>
        <Ionicons name="menu" size={26} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Ionicons name="diamond" size={24} color={colors.primary} />
        <Text style={styles.logoText}>ALTIN</Text>
      </View>

      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => navigation.navigate('profile' as never)}
      >
        <View style={styles.profileAvatar}>
          <Text style={styles.profileAvatarText}>K</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF5252',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  // Mini Header Styles
  miniContainer: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
