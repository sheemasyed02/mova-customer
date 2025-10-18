/**
 * Payment Methods Screen
 * 
 * Features:
 * - Payment method management (cards, UPI, wallets)
 * - Add new payment methods with validation
 * - Set default payment method
 * - Security information and compliance badges
 * - Beautiful UI matching project design
 */

import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SavedCard {
  id: string;
  brand: 'visa' | 'mastercard' | 'rupay' | 'amex';
  maskedNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

interface UPIId {
  id: string;
  upiId: string;
  isVerified: boolean;
  isDefault: boolean;
}

interface Wallet {
  id: string;
  name: 'paytm' | 'phonepe' | 'amazonpay' | 'gpay';
  displayName: string;
  isLinked: boolean;
  balance?: number;
  isDefault: boolean;
}

interface CardForm {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  saveSecurely: boolean;
}

interface FormErrors {
  cardNumber?: string;
  cardholderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  upiId?: string;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  
  // State management
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: '1',
      brand: 'visa',
      maskedNumber: '**** **** **** 1234',
      cardholderName: 'John Doe',
      expiryMonth: '12',
      expiryYear: '26',
      isDefault: true,
    },
    {
      id: '2',
      brand: 'mastercard',
      maskedNumber: '**** **** **** 5678',
      cardholderName: 'John Doe',
      expiryMonth: '08',
      expiryYear: '25',
      isDefault: false,
    },
  ]);

  const [upiIds, setUpiIds] = useState<UPIId[]>([
    {
      id: '1',
      upiId: 'john@paytm',
      isVerified: true,
      isDefault: false,
    },
    {
      id: '2',
      upiId: 'john@phonepe',
      isVerified: true,
      isDefault: true,
    },
  ]);

  const [wallets, setWallets] = useState<Wallet[]>([
    {
      id: '1',
      name: 'paytm',
      displayName: 'Paytm',
      isLinked: true,
      balance: 1250.50,
      isDefault: false,
    },
    {
      id: '2',
      name: 'phonepe',
      displayName: 'PhonePe',
      isLinked: true,
      balance: 850.00,
      isDefault: false,
    },
    {
      id: '3',
      name: 'amazonpay',
      displayName: 'Amazon Pay',
      isLinked: false,
      isDefault: false,
    },
    {
      id: '4',
      name: 'gpay',
      displayName: 'Google Pay',
      isLinked: false,
      isDefault: false,
    },
  ]);

  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [selectedMethodType, setSelectedMethodType] = useState<'card' | 'upi' | 'wallet'>('card');
  const [newUpiId, setNewUpiId] = useState('');
  const [cardForm, setCardForm] = useState<CardForm>({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveSecurely: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Payment method types
  const methodTypes = [
    { value: 'card', label: 'Credit/Debit Card', icon: 'card' },
    { value: 'upi', label: 'UPI ID', icon: 'phone-portrait' },
    { value: 'wallet', label: 'Wallet', icon: 'wallet' },
  ];

  // Card brand detection
  const getCardBrand = (cardNumber: string): 'visa' | 'mastercard' | 'rupay' | 'amex' => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'mastercard';
    if (number.startsWith('6')) return 'rupay';
    if (number.startsWith('3')) return 'amex';
    return 'visa';
  };

  // Card brand icons
  const getCardBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      case 'rupay': return '💳';
      case 'amex': return '💳';
      default: return '💳';
    }
  };

  // Wallet icons
  const getWalletIcon = (name: string) => {
    switch (name) {
      case 'paytm': return '📱';
      case 'phonepe': return '📱';
      case 'amazonpay': return '📱';
      case 'gpay': return '📱';
      default: return '📱';
    }
  };

  // Form validation
  const validateCardForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!cardForm.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardForm.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (!cardForm.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    if (!cardForm.expiryMonth.trim()) {
      newErrors.expiryMonth = 'Month is required';
    }

    if (!cardForm.expiryYear.trim()) {
      newErrors.expiryYear = 'Year is required';
    }

    if (!cardForm.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (cardForm.cvv.length < 3) {
      newErrors.cvv = 'Invalid CVV';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpiId = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newUpiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!newUpiId.includes('@')) {
      newErrors.upiId = 'Invalid UPI ID format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handlers
  const handleAddMethod = () => {
    setSelectedMethodType('card');
    setCardForm({
      cardNumber: '',
      cardholderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      saveSecurely: true,
    });
    setNewUpiId('');
    setErrors({});
    setShowAddMethodModal(true);
  };

  const handleDeleteCard = (id: string) => {
    const card = savedCards.find(c => c.id === id);
    if (!card) return;

    Alert.alert(
      'Delete Card',
      `Are you sure you want to delete card ending in ${card.maskedNumber.slice(-4)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSavedCards(prev => {
              const filtered = prev.filter(c => c.id !== id);
              // If deleted card was default, make first card default
              if (card.isDefault && filtered.length > 0) {
                filtered[0].isDefault = true;
              }
              return filtered;
            });
          }
        }
      ]
    );
  };

  const handleDeleteUpi = (id: string) => {
    const upi = upiIds.find(u => u.id === id);
    if (!upi) return;

    Alert.alert(
      'Delete UPI ID',
      `Are you sure you want to delete ${upi.upiId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUpiIds(prev => {
              const filtered = prev.filter(u => u.id !== id);
              // If deleted UPI was default, make first UPI default
              if (upi.isDefault && filtered.length > 0) {
                filtered[0].isDefault = true;
              }
              return filtered;
            });
          }
        }
      ]
    );
  };

  const handleSetDefaultCard = (id: string) => {
    setSavedCards(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === id
      }))
    );
  };

  const handleSetDefaultUpi = (id: string) => {
    setUpiIds(prev => 
      prev.map(upi => ({
        ...upi,
        isDefault: upi.id === id
      }))
    );
  };

  const handleSetDefaultWallet = (id: string) => {
    setWallets(prev => 
      prev.map(wallet => ({
        ...wallet,
        isDefault: wallet.id === id
      }))
    );
  };

  const handleSaveCard = async () => {
    if (!validateCardForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCard: SavedCard = {
        id: Date.now().toString(),
        brand: getCardBrand(cardForm.cardNumber),
        maskedNumber: `**** **** **** ${cardForm.cardNumber.slice(-4)}`,
        cardholderName: cardForm.cardholderName,
        expiryMonth: cardForm.expiryMonth,
        expiryYear: cardForm.expiryYear,
        isDefault: savedCards.length === 0,
      };

      setSavedCards(prev => [...prev, newCard]);
      setShowAddMethodModal(false);
      Alert.alert('Success', 'Card added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add card. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveUpi = async () => {
    if (!validateUpiId()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUpi: UPIId = {
        id: Date.now().toString(),
        upiId: newUpiId,
        isVerified: true,
        isDefault: upiIds.length === 0,
      };

      setUpiIds(prev => [...prev, newUpi]);
      setShowAddMethodModal(false);
      Alert.alert('Success', 'UPI ID added successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to add UPI ID. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkWallet = (walletId: string) => {
    setWallets(prev => 
      prev.map(wallet => 
        wallet.id === walletId 
          ? { ...wallet, isLinked: true, balance: Math.random() * 2000 }
          : wallet
      )
    );
    Alert.alert('Success', 'Wallet linked successfully!');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const updateCardField = (field: keyof CardForm, value: any) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
    }
    setCardForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const renderSavedCards = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Saved Cards</Text>
      {savedCards.map((card) => (
        <View key={card.id} style={styles.paymentCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardBrandContainer}>
              <Text style={styles.cardBrandIcon}>{getCardBrandIcon(card.brand)}</Text>
              <View style={styles.cardInfo}>
                <Text style={styles.cardNumber}>{card.maskedNumber}</Text>
                <Text style={styles.cardName}>{card.cardholderName}</Text>
                <Text style={styles.cardExpiry}>Expires {card.expiryMonth}/{card.expiryYear}</Text>
              </View>
            </View>
            
            <View style={styles.cardActions}>
              {card.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDeleteCard(card.id)}
              >
                <Ionicons name="trash" size={16} color={Colors.functional.error} />
              </TouchableOpacity>
            </View>
          </View>

          {!card.isDefault && (
            <TouchableOpacity 
              style={styles.setDefaultButton}
              onPress={() => handleSetDefaultCard(card.id)}
            >
              <Text style={styles.setDefaultText}>Set as Default</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderUpiIds = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>UPI IDs</Text>
      {upiIds.map((upi) => (
        <View key={upi.id} style={styles.paymentCard}>
          <View style={styles.upiHeader}>
            <View style={styles.upiIconContainer}>
              <Ionicons name="phone-portrait" size={20} color={Colors.primary.teal} />
            </View>
            <View style={styles.upiInfo}>
              <View style={styles.upiIdRow}>
                <Text style={styles.upiId}>{upi.upiId}</Text>
                {upi.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={14} color={Colors.functional.success} />
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                )}
              </View>
              {upi.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteUpi(upi.id)}
            >
              <Ionicons name="trash" size={16} color={Colors.functional.error} />
            </TouchableOpacity>
          </View>

          {!upi.isDefault && (
            <TouchableOpacity 
              style={styles.setDefaultButton}
              onPress={() => handleSetDefaultUpi(upi.id)}
            >
              <Text style={styles.setDefaultText}>Set as Default</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  const renderWallets = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Wallets</Text>
      {wallets.map((wallet) => (
        <View key={wallet.id} style={styles.paymentCard}>
          <View style={styles.walletHeader}>
            <View style={styles.walletIconContainer}>
              <Text style={styles.walletIcon}>{getWalletIcon(wallet.name)}</Text>
            </View>
            <View style={styles.walletInfo}>
              <Text style={styles.walletName}>{wallet.displayName}</Text>
              {wallet.isLinked && wallet.balance !== undefined && (
                <Text style={styles.walletBalance}>₹{wallet.balance.toFixed(2)}</Text>
              )}
              {wallet.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </View>
            
            {wallet.isLinked ? (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleSetDefaultWallet(wallet.id)}
              >
                <Ionicons name="star" size={16} color={wallet.isDefault ? Colors.primary.teal : Colors.text.secondary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.linkButton}
                onPress={() => handleLinkWallet(wallet.id)}
              >
                <Text style={styles.linkButtonText}>Link</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderSecurityInfo = () => (
    <View style={styles.securitySection}>
      <View style={styles.securityHeader}>
        <Ionicons name="shield-checkmark" size={24} color={Colors.functional.success} />
        <Text style={styles.securityTitle}>Your payments are secure</Text>
      </View>
      <Text style={styles.securityText}>• Your payment info is encrypted</Text>
      <Text style={styles.securityText}>• PCI-DSS compliant</Text>
      <Text style={styles.securityText}>• We never store CVV</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="card-outline" size={80} color={Colors.text.light} />
      </View>
      <Text style={styles.emptyTitle}>No saved payment methods</Text>
      <Text style={styles.emptySubtitle}>Add payment method for faster checkout</Text>
      <TouchableOpacity style={styles.emptyAddButton} onPress={handleAddMethod}>
        <Text style={styles.emptyAddButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAddMethodModal = () => (
    <Modal
      visible={showAddMethodModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowAddMethodModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        {/* Modal Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={() => setShowAddMethodModal(false)}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <Text style={styles.modalTitle}>Add Payment Method</Text>
          
          <TouchableOpacity 
            onPress={selectedMethodType === 'card' ? handleSaveCard : handleSaveUpi}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            disabled={isLoading}
          >
            <Text style={[styles.saveButtonText, isLoading && styles.saveButtonTextDisabled]}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.modalKeyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
            {/* Method Type Selection */}
            <View style={styles.methodTypeSection}>
              <Text style={styles.sectionTitle}>Payment Method Type</Text>
              <View style={styles.methodTypeSelector}>
                {methodTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.methodTypeOption,
                      selectedMethodType === type.value && styles.methodTypeOptionActive
                    ]}
                    onPress={() => setSelectedMethodType(type.value as any)}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={20} 
                      color={selectedMethodType === type.value ? Colors.text.white : Colors.text.secondary} 
                    />
                    <Text style={[
                      styles.methodTypeText,
                      selectedMethodType === type.value && styles.methodTypeTextActive
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Card Form */}
            {selectedMethodType === 'card' && (
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>
                  Card Number <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.cardNumber && styles.inputError]}
                  value={cardForm.cardNumber}
                  onChangeText={(text) => updateCardField('cardNumber', text)}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={Colors.text.light}
                  keyboardType="numeric"
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <Text style={styles.errorText}>{errors.cardNumber}</Text>
                )}

                <Text style={styles.inputLabel}>
                  Cardholder Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.cardholderName && styles.inputError]}
                  value={cardForm.cardholderName}
                  onChangeText={(text) => updateCardField('cardholderName', text)}
                  placeholder="John Doe"
                  placeholderTextColor={Colors.text.light}
                  autoCapitalize="words"
                />
                {errors.cardholderName && (
                  <Text style={styles.errorText}>{errors.cardholderName}</Text>
                )}

                <View style={styles.formRow}>
                  <View style={styles.halfWidth}>
                    <Text style={styles.inputLabel}>
                      Expiry Month <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.textInput, errors.expiryMonth && styles.inputError]}
                      value={cardForm.expiryMonth}
                      onChangeText={(text) => updateCardField('expiryMonth', text)}
                      placeholder="MM"
                      placeholderTextColor={Colors.text.light}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    {errors.expiryMonth && (
                      <Text style={styles.errorText}>{errors.expiryMonth}</Text>
                    )}
                  </View>

                  <View style={styles.halfWidth}>
                    <Text style={styles.inputLabel}>
                      Expiry Year <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.textInput, errors.expiryYear && styles.inputError]}
                      value={cardForm.expiryYear}
                      onChangeText={(text) => updateCardField('expiryYear', text)}
                      placeholder="YY"
                      placeholderTextColor={Colors.text.light}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    {errors.expiryYear && (
                      <Text style={styles.errorText}>{errors.expiryYear}</Text>
                    )}
                  </View>
                </View>

                <Text style={styles.inputLabel}>
                  CVV <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.cvv && styles.inputError, { maxWidth: 100 }]}
                  value={cardForm.cvv}
                  onChangeText={(text) => updateCardField('cvv', text)}
                  placeholder="123"
                  placeholderTextColor={Colors.text.light}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
                {errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                )}

                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => updateCardField('saveSecurely', !cardForm.saveSecurely)}
                >
                  <View style={[styles.checkbox, cardForm.saveSecurely && styles.checkboxActive]}>
                    {cardForm.saveSecurely && (
                      <Ionicons name="checkmark" size={16} color={Colors.text.white} />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>Save securely for future use</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* UPI Form */}
            {selectedMethodType === 'upi' && (
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>
                  UPI ID <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, errors.upiId && styles.inputError]}
                  value={newUpiId}
                  onChangeText={setNewUpiId}
                  placeholder="your-name@paytm"
                  placeholderTextColor={Colors.text.light}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.upiId && (
                  <Text style={styles.errorText}>{errors.upiId}</Text>
                )}
              </View>
            )}

            {/* Wallet Selection */}
            {selectedMethodType === 'wallet' && (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Select Wallet to Link</Text>
                {wallets.filter(w => !w.isLinked).map((wallet) => (
                  <TouchableOpacity
                    key={wallet.id}
                    style={styles.walletOption}
                    onPress={() => {
                      handleLinkWallet(wallet.id);
                      setShowAddMethodModal(false);
                    }}
                  >
                    <Text style={styles.walletOptionIcon}>{getWalletIcon(wallet.name)}</Text>
                    <Text style={styles.walletOptionText}>{wallet.displayName}</Text>
                    <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );

  const hasPaymentMethods = savedCards.length > 0 || upiIds.length > 0 || wallets.some(w => w.isLinked);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Payment Methods</Text>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMethod}
        >
          <Ionicons name="add" size={20} color={Colors.text.white} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {hasPaymentMethods ? (
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {savedCards.length > 0 && renderSavedCards()}
          {upiIds.length > 0 && renderUpiIds()}
          {renderWallets()}
          {renderSecurityInfo()}
        </ScrollView>
      ) : (
        renderEmptyState()
      )}

      {/* Add Payment Method Modal */}
      {renderAddMethodModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 12,
  },

  // Payment Cards
  paymentCard: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Card Styles
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardBrandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardBrandIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // UPI Styles
  upiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  upiIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  upiInfo: {
    flex: 1,
  },
  upiIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  upiId: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginRight: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.functional.success + '15',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.functional.success,
  },

  // Wallet Styles
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.teal + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  walletIcon: {
    fontSize: 20,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  walletBalance: {
    fontSize: 14,
    color: Colors.functional.success,
    fontWeight: '500',
  },
  linkButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.primary.teal,
  },
  linkButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.white,
  },

  // Common Styles
  defaultBadge: {
    backgroundColor: Colors.functional.success,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.text.white,
    textTransform: 'uppercase',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setDefaultButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary.teal,
    backgroundColor: Colors.primary.teal + '10',
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary.teal,
  },

  // Security Section
  securitySection: {
    backgroundColor: Colors.background.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  securityText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyAddButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary.teal,
  },
  emptyAddButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.white,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.lightGrey,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primary.teal,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.background.lightGrey,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.white,
  },
  saveButtonTextDisabled: {
    color: Colors.text.secondary,
  },
  modalKeyboardView: {
    flex: 1,
  },
  modalScrollView: {
    flex: 1,
  },

  // Method Type Selection
  methodTypeSection: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 12,
  },
  methodTypeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  methodTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: Colors.background.white,
    gap: 6,
  },
  methodTypeOptionActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  methodTypeText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  methodTypeTextActive: {
    color: Colors.text.white,
  },

  // Form Styles
  formSection: {
    backgroundColor: Colors.background.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  required: {
    color: Colors.functional.error,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.white,
  },
  inputError: {
    borderColor: Colors.functional.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.functional.error,
    marginTop: 4,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary.teal,
    borderColor: Colors.primary.teal,
  },
  checkboxLabel: {
    fontSize: 14,
    color: Colors.text.primary,
  },

  // Wallet Option
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  walletOptionIcon: {
    fontSize: 24,
  },
  walletOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
  },
});