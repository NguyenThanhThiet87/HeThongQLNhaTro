import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { askChatBox} from '../../../api/ChatBox';

const COLORS = {
  primary: '#13c8ec',
  bgDark: '#101f22',
  bgLight: '#f6f8f8',
  slate800: '#1e293b',
  slate700: '#334155',
  slate500: '#64748b',
  slate200: '#e2e8f0',
  white: '#ffffff',
};

const ChatScreen = () => {
  // Giả định đang ở chế độ Dark Mode theo file HTML của bạn
  const isDarkMode = true; 
  const dynamicColors = {
    bg: isDarkMode ? COLORS.bgDark : COLORS.bgLight,
    text: isDarkMode ? '#f1f5f9' : '#0f172a',
    bubble: isDarkMode ? COLORS.slate800 : COLORS.slate200,
    border: isDarkMode ? '#1e293b' : '#e2e8f0',
    inputBg: isDarkMode ? '#0f172a' : '#f1f5f9',
  };

  const onHandleSend = async () => {
    const result = await askChatBox({
      MaNd: 1,
      Message: "Xin chào, tôi cần hỗ trợ về hóa đơn tháng này."
    });
    console.log("ChatBox API Response:", result);
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: dynamicColors.bg }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* --- TOP APP BAR --- */}
      <View style={[styles.header, { borderColor: dynamicColors.border }]}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={dynamicColors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/100?img=11' }} 
              style={[styles.avatar, { borderColor: COLORS.primary }]} 
            />
            <View style={[styles.statusDot, { borderColor: dynamicColors.bg }]} />
          </View>
          <View style={styles.headerTextGroup}>
            <Text style={[styles.headerName, { color: dynamicColors.text }]}>Hỗ trợ Xóm Trọ</Text>
            <Text style={styles.headerStatus}>Đang trực tuyến</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="call" size={22} color={isDarkMode ? COLORS.slate500 : COLORS.slate700} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="more-vert" size={22} color={isDarkMode ? COLORS.slate500 : COLORS.slate700} />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- CHAT CONTENT AREA --- */}
      <ScrollView contentContainerStyle={styles.chatArea} showsVerticalScrollIndicator={false}>
        {/* Time Divider */}
        <View style={styles.timeDivider}>
          <View style={[styles.timeBadge, { backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : COLORS.slate200 }]}>
            <Text style={styles.timeText}>HÔM NAY</Text>
          </View>
        </View>

        {/* Message: Support (Left) */}
        <View style={styles.leftMessageRow}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=12' }} style={styles.miniAvatar} />
          <View style={styles.messageContent}>
            <Text style={styles.senderName}>Chủ trọ</Text>
            <View style={[styles.bubble, styles.leftBubble, { backgroundColor: dynamicColors.bubble }]}>
              <Text style={[styles.messageText, { color: dynamicColors.text }]}>
                Chào bạn, mình là quản lý Xóm Trọ đây. Mình có thể giúp gì cho bạn về thông tin phòng hay hóa đơn không? 😊
              </Text>
            </View>
          </View>
        </View>

        {/* Message: User (Right) */}
        <View style={styles.rightMessageRow}>
          <View style={[styles.messageContent, { alignItems: 'flex-end' }]}>
            <Text style={styles.senderName}>Bạn</Text>
            <View style={[styles.bubble, styles.rightBubble, { backgroundColor: COLORS.primary }]}>
              <Text style={[styles.messageText, { color: COLORS.bgDark }]}>
                Dạ chào anh, em là sinh viên phòng 202 ạ. Cho em hỏi chi tiết tiền điện nước tháng này của phòng em với ạ, em thấy hơi cao so với tháng trước.
              </Text>
            </View>
          </View>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=13' }} style={styles.miniAvatar} />
        </View>

        {/* Message with Image: Support (Left) */}
        <View style={styles.leftMessageRow}>
          <Image source={{ uri: 'https://i.pravatar.cc/100?img=12' }} style={styles.miniAvatar} />
          <View style={styles.messageContent}>
            <Text style={styles.senderName}>Chủ trọ</Text>
            <View style={[styles.bubble, styles.leftBubble, { backgroundColor: dynamicColors.bubble }]}>
              <Text style={[styles.messageText, { color: dynamicColors.text }]}>
                Để anh kiểm tra lại số kí điện nhé. Đây là ảnh chụp đồng hồ và hóa đơn chi tiết của phòng em.
              </Text>
            </View>
            
            {/* Image Attachment */}
            <TouchableOpacity activeOpacity={0.9} style={[styles.imageAttachment, { borderColor: dynamicColors.border }]}>
              <ImageBackground 
                source={{ uri: 'https://picsum.photos/500/300' }} 
                style={styles.attachedImg}
                imageStyle={{ borderRadius: 12 }}
              >
                <View style={styles.imageOverlay}>
                  <Icon name="zoom-in" size={32} color="white" />
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* --- MESSAGE INPUT AREA --- */}
      <View style={[styles.footer, { borderColor: dynamicColors.border }]}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.footerIcon}>
            <Icon name="add-circle" size={24} color={COLORS.slate500} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerIcon}>
            <Icon name="image" size={24} color={COLORS.slate500} />
          </TouchableOpacity>
          
          <View style={[styles.textInputWrapper, { backgroundColor: dynamicColors.inputBg }]}>
            <TextInput 
              placeholder="Nhập tin nhắn..." 
              placeholderTextColor={COLORS.slate500}
              style={[styles.input, { color: dynamicColors.text }]}
            />
            <TouchableOpacity style={styles.emojiIcon}>
              <Icon name="mood" size={20} color={COLORS.slate500} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={()=> onHandleSend}>
            <Icon name="send" size={22} color={COLORS.bgDark} />
          </TouchableOpacity>
        </View>
        
        {/* Bottom Indicator Mockup */}
        <View style={styles.bottomIndicator} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22c55e',
    borderWidth: 2,
  },
  headerTextGroup: {
    marginLeft: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerStatus: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  chatArea: {
    padding: 16,
    paddingBottom: 30,
  },
  timeDivider: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.slate500,
    letterSpacing: 1,
  },
  leftMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
    maxWidth: '85%',
  },
  rightMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginBottom: 20,
    maxWidth: '85%',
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  messageContent: {
    marginHorizontal: 10,
  },
  senderName: {
    fontSize: 11,
    color: COLORS.slate500,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  leftBubble: {
    borderBottomLeftRadius: 2,
  },
  rightBubble: {
    borderBottomRightRadius: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  imageAttachment: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  attachedImg: {
    width: 240,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  footerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    fontSize: 14,
  },
  emojiIcon: {
    padding: 4,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  bottomIndicator: {
    width: 120,
    height: 4,
    backgroundColor: COLORS.slate800,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 15,
  },
});

export default ChatScreen;