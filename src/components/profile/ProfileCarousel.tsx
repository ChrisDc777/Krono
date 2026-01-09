import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';
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
        snapToInterval={316} // 300 width + 16 gap
    >
      {profiles.map(profile => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
      
      {/* "Add Profile" Placeholder Card */}
      <Card 
        style={[styles.addCard, {  borderColor: colors.outline, backgroundColor: 'transparent' }]}
        mode="outlined"
        onPress={handleAddProfile}
      >
        <Card.Content style={styles.addCardContent}>
           <IconButton 
              icon="plus" 
              onPress={handleAddProfile} 
              iconColor={colors.onSurfaceVariant} 
              size={32} 
           />
           <Text variant="labelLarge" style={{ color: colors.onSurfaceVariant, textTransform: 'uppercase' }}>Add Profile</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, 
    paddingVertical: 10,
    gap: 16
  },
  addCard: {
      width: 300, // Match ProfileCard width
      height: 260, // Match ProfileCard height
      justifyContent: 'center',
      alignItems: 'center',
      borderStyle: 'dashed',
  },
  addCardContent: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
  }
});
