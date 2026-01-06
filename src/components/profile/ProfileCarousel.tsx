import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useTheme } from '../../hooks/useTheme';
import { UnifiedProfile } from '../../types/user';
import { ProfileCard } from '../ui/ProfileCard';

interface ProfileCarouselProps {
  profiles: UnifiedProfile[];
}

export const ProfileCarousel: React.FC<ProfileCarouselProps> = ({ profiles }) => {
  const router = useRouter();
  const { colors } = useTheme();

  const handleAddProfile = () => {
    router.push('/settings');
  };

  return (
    <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.container}
        decelerationRate="fast"
        snapToInterval={316} // 300 width + 16 margin
    >
      {profiles.map(profile => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
      
      {/* "Add Profile" Placeholder Card */}
      <View style={[styles.addCardPlaceholder, { borderColor: colors.border }]}>
           <IconButton 
              icon="plus" 
              onPress={handleAddProfile} 
              iconColor={colors.text.muted} 
              size={30} 
           />
           <Text style={[styles.addText, { color: colors.text.muted }]}>Add</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 10
  },
  addCardPlaceholder: {
      width: 100,
      height: 260, // Match ProfileCard height
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderRadius: 16
  },
  addText: {
      fontSize: 12,
      marginTop: 8,
      fontWeight: 'bold',
      textTransform: 'uppercase'
  }
});
