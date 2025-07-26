// src/components/community/AnonymousPost.jsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../../styles/globalStyles';
import { colors } from '../../styles/colors';

export const AnonymousPost = ({ onSubmit, onCancel }) => {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableTags = [
    'support', 'advice', 'pain', 'mood', 'work', 'relationships',
    'selfcare', 'periods', 'pms', 'tracking', 'mentalhealth',
    'exercise', 'nutrition', 'sleep', 'stress', 'hormones'
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 3) {
        return [...prev, tag];
      } else {
        Alert.alert('Tag Limit', 'You can select up to 3 tags only.');
        return prev;
      }
    });
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      Alert.alert('Empty Post', 'Please write something before posting.');
      return;
    }

    if (content.length < 10) {
      Alert.alert('Too Short', 'Please write at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        content: content.trim(),
        tags: selectedTags
      });
      
      // Reset form
      setContent('');
      setSelectedTags([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={colors.gray} />
          </TouchableOpacity>
          
          <Text style={globalStyles.h6}>Share Anonymously</Text>
          
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            style={[
              styles.postButton,
              { opacity: (!content.trim() || isSubmitting) ? 0.5 : 1 }
            ]}
          >
            <Text style={styles.postButtonText}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success} />
          <Text style={styles.privacyText}>
            Your post will be completely anonymous. No personal information is shared.
          </Text>
        </View>

        {/* Content Input */}
        <View style={styles.contentSection}>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Share your thoughts, experiences, or questions with the community..."
            placeholderTextColor={colors.gray}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          
          <Text style={styles.characterCount}>
            {content.length}/500
          </Text>
        </View>

        {/* Tags Section */}
        <View style={styles.tagsSection}>
          <Text style={[globalStyles.h6, { marginBottom: 12 }]}>
            Add Tags (Optional - Max 3)
          </Text>
          
          <View style={styles.tagContainer}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.selectedTag
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.selectedTagText
                ]}>
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelines}>
          <Text style={[globalStyles.h6, { marginBottom: 8 }]}>
            Community Guidelines
          </Text>
          
          <Text style={styles.guidelineText}>
            • Be respectful and supportive of others
          </Text>
          <Text style={styles.guidelineText}>
            • Share your authentic experiences
          </Text>
          <Text style={styles.guidelineText}>
            • Avoid sharing personal medical information
          </Text>
          <Text style={styles.guidelineText}>
            • Report inappropriate content
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    margin: 20,
    padding: 12,
    borderRadius: 8,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: colors.success,
    marginLeft: 8,
    fontWeight: '500',
  },
  contentSection: {
    margin: 20,
  },
  contentInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    color: colors.gray,
    marginTop: 8,
  },
  tagsSection: {
    margin: 20,
    marginTop: 0,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  selectedTag: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: colors.gray,
  },
  selectedTagText: {
    color: colors.primary,
    fontWeight: '500',
  },
  guidelines: {
    margin: 20,
    marginTop: 0,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  guidelineText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
};