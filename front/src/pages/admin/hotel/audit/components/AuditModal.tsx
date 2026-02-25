import { useState } from 'react';
import { View, Text, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './AuditModal.scss';

type AuditModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
};

const AuditModal = (props: AuditModalProps) => {
  const { visible, onClose, onConfirm } = props;
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      Taro.showToast({ title: '请输入拒绝原因', icon: 'none' });
      return;
    }
    onConfirm(reason);
    setReason('');
    onClose();
  };

  if (!visible) return null;

  return (
    <View className="modal-overlay" onClick={onClose}>
      <View className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Text className="modal-title">拒绝审核</Text>
        <Input
          className="modal-input"
          placeholder="请输入拒绝原因"
          value={reason}
          onInput={(e) => setReason(e.detail.value)}
          autoFocus
        />
        <View className="modal-actions">
          <Button className="modal-btn modal-btn-cancel" onClick={onClose}>取消</Button>
          <Button className="modal-btn modal-btn-confirm" onClick={handleConfirm}>确认</Button>
        </View>
      </View>
    </View>
  );
};

export default AuditModal;

