import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import {RootStackParamList} from '../navigation/AppNavigator';
import {NiRELogo} from './NiRELogo';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItemProps {
  label: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}

function MenuItem({label, icon, isActive, onPress}: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.menuItemActive]}
      onPress={onPress}>
      <View style={[styles.menuIcon, isActive && styles.menuIconActive]}>
        <Text style={[styles.menuIconText, isActive && styles.menuIconTextActive]}>
          {icon}
        </Text>
      </View>
      <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function DrawerContent(props: DrawerContentComponentProps) {
  const {logout, user} = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const currentRoute = props.state.routes[props.state.index]?.name;

  const menuItems = [
    {key: 'Dashboard', label: 'Recent Media', icon: 'H'},
    {key: 'Submit', label: 'Submit URL', icon: '+'},
    {key: 'ReadInApp', label: 'Read In App', icon: 'W'},
    {key: 'Requests', label: 'My Requests', icon: 'R'},
    {key: 'Analytics', label: 'My Analytics', icon: 'A'},
    {key: 'Feedback', label: 'Feedback', icon: 'F'},
  ];

  const handleNavigation = (routeName: string) => {
    props.navigation.navigate(routeName);
  };

  const handleLogout = () => {
    setSettingsModalVisible(false);
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
          },
        },
      ],
    );
  };

  const handleResetPassword = () => {
    setSettingsModalVisible(false);
    props.navigation.closeDrawer();
    navigation.navigate('ResetPassword');
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <NiRELogo size="small" style={styles.logoContainer} />
          <Text style={styles.appName}>Ni-RE</Text>
          {user?.email && (
            <Text style={styles.userEmail}>{user.email}</Text>
          )}
        </View>

        <View style={styles.menuSection}>
          {menuItems.map(item => (
            <MenuItem
              key={item.key}
              label={item.label}
              icon={item.icon}
              isActive={currentRoute === item.key}
              onPress={() => handleNavigation(item.key)}
            />
          ))}
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}>
          <View style={styles.settingsIcon}>
            <Text style={styles.settingsIconText}>S</Text>
          </View>
          <Text style={styles.settingsLabel}>Settings</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSettingsModalVisible(false)}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Settings</Text>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleResetPassword}>
                <View style={styles.modalOptionIcon}>
                  <Text style={styles.modalOptionIconText}>P</Text>
                </View>
                <Text style={styles.modalOptionText}>Reset Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalOption, styles.logoutOption]}
                onPress={handleLogout}>
                <View style={[styles.modalOptionIcon, styles.logoutIcon]}>
                  <Text style={styles.logoutIconText}>L</Text>
                </View>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setSettingsModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  scrollContent: {
    paddingTop: 0,
  },
  header: {
    padding: 20,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  logoContainer: {
    marginBottom: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#71717a',
  },
  menuSection: {
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderRightWidth: 3,
    borderRightColor: '#7c3aed',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
  },
  menuIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717a',
  },
  menuIconTextActive: {
    color: '#7c3aed',
  },
  menuLabel: {
    fontSize: 15,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  menuLabelActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    padding: 16,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIconText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717a',
  },
  settingsLabel: {
    fontSize: 15,
    color: '#a1a1aa',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
    backgroundColor: '#27272a',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#3f3f46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionIconText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  logoutOption: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)',
  },
  logoutIcon: {
    backgroundColor: '#7f1d1d',
  },
  logoutIconText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    color: '#fecaca',
    fontWeight: '500',
  },
  cancelButton: {
    padding: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#71717a',
    fontWeight: '500',
  },
});
