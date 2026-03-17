import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ActionConfirmModal({
  visible = false,
  title = 'Thông báo',
  message = 'Bạn có chắc chắn muốn tiếp tục?',
  yesText = 'Yes',
  noText = 'No',
  onYes,
  onNo,
  type = 'default', // 'default' | 'delete'
  requiredText = 'detroy',
  loading = false,
  closeOnBackdrop = false,
}) {
  const [confirmValue, setConfirmValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) {
      setConfirmValue('');
      setSubmitting(false);
    }
  }, [visible]);

  const isDelete = type === 'delete';
  const canConfirm =
    !isDelete ||
    confirmValue.trim().toLowerCase() === requiredText.trim().toLowerCase();
  const busy = loading || submitting;

  const handleNo = () => {
    if (busy) return;
    onNo?.();
  };

  const handleYes = async () => {
    if (!canConfirm || busy) return;
    try {
      setSubmitting(true);
      await onYes?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleNo}
    >
      <View style={styles.overlay}>
        {closeOnBackdrop && (
          <Pressable style={StyleSheet.absoluteFill} onPress={handleNo} />
        )}

        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {isDelete && (
            <View style={styles.deleteBox}>
              <Text style={styles.hint}>
                Nhập <Text style={styles.required}>"{requiredText}"</Text> để xác nhận xóa
              </Text>
              <TextInput
                value={confirmValue}
                onChangeText={setConfirmValue}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={`Nhập ${requiredText}`}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, styles.noButton]}
              onPress={handleNo}
              disabled={busy}
            >
              <Text style={styles.noText}>{noText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                isDelete ? styles.deleteButton : styles.yesButton,
                (!canConfirm || busy) && styles.disabledButton,
              ]}
              onPress={handleYes}
              disabled={!canConfirm || busy}
            >
              <Text style={styles.yesText}>{busy ? 'Đang xử lý...' : yesText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 14,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 12,
  },
  deleteBox: {
    marginBottom: 12,
  },
  hint: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
  },
  required: {
    fontWeight: '700',
    color: '#dc2626',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0f172a',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  noButton: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#fff',
  },
  yesButton: {
    backgroundColor: '#13c8ec',
  },
  deleteButton: {
    backgroundColor: '#dc2626',
  },
  disabledButton: {
    opacity: 0.5,
  },
  noText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  yesText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});