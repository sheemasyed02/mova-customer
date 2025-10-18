// Example of how to navigate to Edit Profile screen from any component

import { useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function ExampleNavigationToEditProfile() {
  const router = useRouter();

  const navigateToEditProfile = () => {
    router.push('/edit-profile' as any);
  };

  return (
    <TouchableOpacity onPress={navigateToEditProfile}>
      <Text>Edit Profile</Text>
    </TouchableOpacity>
  );
}

// You can add this navigation from:
// 1. Profile settings screen
// 2. User profile card 
// 3. Settings menu
// 4. Any other relevant screen

// Example usage in a settings screen:
/*
<TouchableOpacity 
  style={styles.settingsItem}
  onPress={() => router.push('/edit-profile')}
>
  <Ionicons name="person-outline" size={20} color={Colors.text.primary} />
  <Text style={styles.settingsText}>Edit Profile</Text>
  <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
</TouchableOpacity>
*/