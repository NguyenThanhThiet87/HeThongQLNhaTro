import React, { useState, useEffect, useRef, use } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { askChatBox } from "../api/ChatBox";
import { getCurrentUser } from "../utils/decodeToken"
import DotTyping from './DotTyping';

const PRIMARY_COLOR = '#ec5b13';

const ChatSupport = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const scrollViewRef = useRef(null);

  const [messageList, setMessageList] = useState([]);
  const [currentuser, setCurrentUser] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user != null) {
        setCurrentUser(user)
        setMessageList(prev => prev.length === 0
          ? [{ sender: "Bot", text: `Xin chào ${user.hoTen}, tôi là Bot hỗ trợ. Bạn cần giúp gì?` }]
          : prev
        );
      };

    };
    fetchUser();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => {
      // Try this first
      if (pulse.stop) {
        pulse.stop();
      }
      // If not available, fallback
      else if (pulse._animation && pulse._animation.stop) {
        pulse._animation.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messageList]);

  const toggleChat = () => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 20, duration: 200, useNativeDriver: true }),
      ]).start(() => setIsVisible(false));
    } else {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.back(1)), useNativeDriver: true }),
      ]).start();
    }
  };



  const handleSend = async () => {
    if (inputText.trim() === "") return;

    // Thêm tin nhắn của user vào danh sách
    setMessageList(prev => [
      ...prev,
      { sender: currentuser.hoTen, text: inputText }
    ]);

    setInputText('');

    setIsBotTyping(true);
    // Gọi API ChatBox
    const result = await askChatBox(currentuser.maNd, inputText);
    setIsBotTyping(false);

    if (result && result.success && result.data) {
      setMessageList(prev => [
        ...prev,
        { sender: "Bot", text: result.data.answer }
      ]);
    } else {
      // Nếu lỗi, thêm thông báo lỗi vào chat
      setMessageList(prev => [
        ...prev,
        { sender: "Bot", text: "Xin lỗi, hệ thống đang gặp sự cố." }
      ]);
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Khung Chat Popup */}
      {isVisible && (
        <Animated.View
          style={[styles.popupWrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.onlineStatus}>
                <Animated.View style={[styles.pulseCircle, { opacity: pulseAnim }]} />
                <Text style={styles.headerTitle}>HỖ TRỢ TRỰC TUYẾN</Text>
              </View>
              <TouchableOpacity onPress={toggleChat} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Icon name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Chat History Area */}
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatHistory}
              contentContainerStyle={styles.historyContent}
              showsVerticalScrollIndicator={false}
            >

              {messageList.map((item, idx) => {
                const isUser = item.sender !== "Bot";
                return (
                  <View key={idx} style={[styles.managerMsgContainer, { alignSelf: isUser ? "flex-end" : "flex-start" }]}  >
                    <View style={styles.avatarContainer}>
                      <Icon
                        name={isUser ? "person" : "android"} // Or use an Image for avatar
                        size={20}
                        color={isUser ? "#ec5b13" : "#94a3b8"}
                      />
                    </View>
                    <View style={styles.managerBubble}>
                      <Text style={styles.msgText}>{item?.text}</Text>
                    </View>
                  </View>
                );
              })}
              {isBotTyping && (
                <View style={[styles.managerMsgContainer, { alignSelf: "flex-start" }]}>
                  <View style={styles.avatarContainer}>
                    <Icon name="android" size={20} color="#94a3b8" />
                  </View>
                  <View style={styles.managerBubble}>
                    <DotTyping text="Bot đang soạn tin" />
                  </View>
                </View>
              )}

            </ScrollView>

            {/* Input Area */}
            <View style={styles.inputArea}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tin nhắn..."
                  placeholderTextColor="#94a3b8"
                  value={inputText}
                  onChangeText={setInputText}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSend}
                >
                  <Icon name="send" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Mũi tên trỏ xuống (Pointer) */}
          <View style={styles.pointer} />
        </Animated.View>
      )}

      {/* Nút FAB chính */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={toggleChat}
        style={styles.fab}
      >
        <Icon name="chat-bubble" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Vị trí trên Bottom Tab một chút
    right: 16,
    left: 16, // Cho phép khung chat căn lề nếu cần
    alignItems: 'flex-end',
    zIndex: 9999,
  },
  popupWrapper: {
    width: 320, // Rộng hơn một chút theo bản HTML mới
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '100%',
    maxHeight: 450, // Giới hạn chiều cao như bản web
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 15 },
      android: { elevation: 12 },
    }),
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulseCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // Chat History
  chatHistory: {
    backgroundColor: '#f8fafc', // Màu slate-50/50 nhẹ
    height: 200, // Chiều cao cố định hoặc linh hoạt
  },
  historyContent: {
    padding: 5,
  },
  managerMsgContainer: {
    maxWidth: '85%',
    marginBottom: 12,
    flexDirection: 'row',
  },
  managerBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 18,
    borderTopLeftRadius: 2, // Bo góc kiểu chat bubble
    borderWidth: 1,
    borderColor: '#f1f5f9',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
      android: { elevation: 1 },
    }),
  },
  avatarContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  msgText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
    color: '#1e293b',
  },
  timestamp: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 0,
    marginLeft: 4,
  },
  // Input Area
  inputArea: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 25,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Decoration
  pointer: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    marginRight: 28,
    marginTop: -8,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    zIndex: -1,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ChatSupport;