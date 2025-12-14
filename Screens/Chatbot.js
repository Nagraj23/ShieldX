import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, FlatList,
  StyleSheet, KeyboardAvoidingView,
  TouchableOpacity, Platform, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { AI_URL } from '../constants/api';

export default function SafetyTips() {
  const [messages, setMessages] = useState([
    { id: '0', type: 'bot', text: 'Welcome to ShieldX! Your personal safety assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

 const sendMessage = async () => {
   if (!input.trim() || isLoading) return;

   const userText = input.trim();
   setInput('');
   setMessages(prev => [...prev, {
     id: Date.now().toString(),
     type: 'user',
     text: userText
   }]);

   setIsLoading(true);

   try {
     const res = await fetch('https://shieldx-safe.onrender.com/chatbot/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: userText }),
     });

     const rawText = await res.text(); // 🔍 use text() to see raw response
     console.log('🧠 Full raw response from bot:', rawText);

     let data;
     try {
       data = JSON.parse(rawText); // 👈 safer than res.json() directly
     } catch (jsonErr) {
       console.warn('❌ Failed to parse JSON:', jsonErr);
       throw new Error('Bot response was not valid JSON.');
     }

     const botResponse = data?.response || 'ShieldX couldn’t think of anything clever 😅';

     setMessages(prev => [...prev, {
       id: Date.now().toString() + '_bot',
       type: 'bot',
       text: botResponse
     }]);
   } catch (err) {
     console.error('💥 Error sending message:', err.message);
     setMessages(prev => [...prev, {
       id: Date.now().toString() + '_bot',
       type: 'bot',
       text: '⚠️ Error reaching the assistant. Try again later.'
     }]);
   } finally {
     setIsLoading(false);
   }
 };

  const renderBubble = ({ item }) => (
    <View style={[styles.bubble, item.type === 'user' ? styles.userBubble : styles.botBubble]}>
      <Text style={item.type === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={tabBarHeight}
    >
      <View style={styles.introContainer}>
        <Text style={styles.introText}>Welcome to ShieldX – Your Safety Assistant ⚡</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderBubble}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {isLoading && (
        <ActivityIndicator size="small" color="#4F8EF7" style={{ marginBottom: 10 }} />
      )}

      <View style={[styles.inputContainer, { marginBottom: Platform.OS === 'android' ? tabBarHeight : 0 }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Describe your safety concern..."
          placeholderTextColor="#888"
          multiline
          maxLength={500}
        />
        <TouchableOpacity onPress={sendMessage} disabled={!input.trim() || isLoading}>
          <Ionicons
            name={input.trim() ? 'send' : 'mic'}
            size={24}
            color={input.trim() ? '#4F8EF7' : '#888'}
            style={{ padding: 6 }}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  introContainer: {
    backgroundColor: '#4F8EF7',
    borderRadius: 16,
    padding: 14,
    marginVertical: 18,
    marginTop: 25,
    alignItems: 'center'
  },
  introText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  messagesContainer: { padding: 10 },
  bubble: {
    marginVertical: 6,
    padding: 14,
    borderRadius: 20,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#4F8EF7' },
  botBubble: { alignSelf: 'flex-start', backgroundColor: '#e6eaf3' },
  userText: { color: '#fff', fontSize: 16 },
  botText: { color: '#222', fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginRight: 8,
    maxHeight: 100
  }
});
