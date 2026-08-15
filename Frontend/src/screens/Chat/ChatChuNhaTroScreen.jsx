import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme/useTheme';


const ChatChuNhaTroScreen = () => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  return (
    
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header (TopAppBar) */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.avatar}
            />
            <View style={styles.onlineStatus} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.userName}>Quản lý Xóm Trọ</Text>
            <Text style={styles.userStatus}>Đang trực tuyến</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="phone" size={24} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Content Area */}
      <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.dateDivider}>
          <Text style={styles.dateLabel}>HÔM NAY</Text>
        </View>

        {/* Management Message */}
        <View style={styles.receiverWrapper}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.smallAvatar} />
          <View>
            <View style={[styles.bubble, styles.receiverBubble]}>
              <Text style={styles.receiverText}>Chào bạn, mình có thể giúp gì cho bạn hôm nay?</Text>
            </View>
            <Text style={styles.timeLabel}>09:15 AM</Text>
          </View>
        </View>

        {/* Tenant Message */}
        <View style={styles.senderWrapper}>
          <View style={[styles.bubble, styles.senderBubble]}>
            <Text style={styles.senderText}>
              Dạ chào anh, em muốn hỏi về hóa đơn tiền điện tháng này ạ. Em thấy chỉ số hơi cao so với tháng trước.
            </Text>
          </View>
          <Text style={styles.timeLabelRight}>09:17 AM</Text>
        </View>

        {/* Management Message 2 */}
        <View style={styles.receiverWrapper}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.smallAvatar} />
          <View>
            <View style={[styles.bubble, styles.receiverBubble]}>
              <Text style={styles.receiverText}>
                Để mình kiểm tra lại số công tơ nhé. À, bạn có thể chụp ảnh vòi nước bị hỏng hôm trước báo mình luôn không? Thợ sắp qua sửa rồi.
              </Text>
            </View>
            <Text style={styles.timeLabel}>09:20 AM</Text>
          </View>
        </View>

        {/* Tenant Message with Image */}
        <View style={styles.senderWrapper}>
          <View style={[styles.bubble, styles.senderBubble, { marginBottom: 8 }]}>
            <Text style={styles.senderText}>Dạ đây anh ơi, nó bị rò rỉ ở phần khớp nối ạ.</Text>
          </View>
          <View style={styles.imageMessageWrapper}>
            <Image
              source={{ uri: 'https://via.placeholder.com/200x300' }}
              style={styles.messageImage}
            />
          </View>
          <Text style={styles.timeLabelRight}>09:22 AM</Text>
        </View>

        {/* Typing Indicator */}
        <View style={styles.receiverWrapper}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.smallAvatar} />
          <View style={styles.typingBubble}>
            <View style={styles.dot} />
            <View style={[styles.dot, { opacity: 0.6 }]} />
            <View style={[styles.dot, { opacity: 0.3 }]} />
          </View>
        </View>
      </ScrollView>

      {/* Message Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.inputFooter}>
          <View style={styles.inputActions}>
            <TouchableOpacity>
              <MaterialCommunityIcons name="plus-circle" size={26} color="#13c8ec" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="image-outline" size={26} color="#94a3b8" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#64748b"
              style={styles.textInput}
            />
            <TouchableOpacity style={styles.emojiButton}>
              <MaterialCommunityIcons name="emoticon-outline" size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <MaterialCommunityIcons name="send" size={22} color="#101f22" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Dark mode background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.card,
    paddingTop: 50
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(19, 200, 236, 0.3)',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  headerText: {
    marginLeft: 12,
  },
  userName: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: '700',
  },
  userStatus: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    padding: 8,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  dateDivider: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    letterSpacing: 1,
  },
  receiverWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    maxWidth: '85%',
  },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#334155',
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  receiverBubble: {
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 0,
  },
  receiverText: {
    color: COLORS.textMain,
    fontSize: 14,
    lineHeight: 20,
  },
  senderWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    maxWidth: '85%',
  },
  senderBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 0,
  },
  senderText: {
    color: COLORS.buttonText,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  timeLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    marginLeft: 4,
  },
  timeLabelRight: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    marginRight: 4,
  },
  imageMessageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  messageImage: {
    width: 180,
    height: 240,
    backgroundColor: COLORS.card,
  },
  typingBubble: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94a3b8',
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
  },
  textInput: {
    flex: 1,
    color: COLORS.textMain,
    fontSize: 14,
    paddingVertical: 8,
  },
  emojiButton: {
    padding: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default ChatChuNhaTroScreen;