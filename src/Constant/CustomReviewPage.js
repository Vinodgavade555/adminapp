import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {colors} from '../Global_CSS/TheamColors';
import {useDispatch, useSelector} from 'react-redux';
import JobViewController from '../Redux/Action/JobViewController';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReviewPage = ({data}) => {
  const dispatch = useDispatch();
  const {GetReviewData, AddReview} = JobViewController();
  const {CandidateReview} = useSelector(state => state.job);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [id, setId] = useState('');
  const isFocus = useIsFocused();
  const [reviewTitle, setReviewTitle] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data');
        dispatch(GetReviewData(data?.id));

        setId(id);
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, [isFocus]);

  useEffect(() => {}, [CandidateReview]);

  const renderStars = rating => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons
          key={`full-${i}`}
          name="star"
          size={18}
          color="#FFD700"
          onPress={() => setUserRating(i + 1)}
        />,
      );
    }
    if (halfStar) {
      stars.push(
        <Ionicons
          key="half"
          name="star-half"
          size={18}
          color="#FFD700"
          onPress={() => setUserRating(fullStars + 0.5)}
        />,
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={18}
          color="#FFD700"
          onPress={() => setUserRating(fullStars + halfStar + 1)}
        />,
      );
    }

    return stars;
  };

  const handleAddComment = () => {
    if (newComment && userRating) {
      const reviewData = {
        user: data?.id,
        rating: userRating.toString(),
        review_title: 'HIRED',
        review_body: newComment,
        given_by: id,
      };

      dispatch(AddReview(reviewData));

      setNewComment('');
      setUserRating(5);
    }
  };

  const handleDeleteReview = reviewId => {
    dispatch(DeleteReview(reviewId)); // Dispatch delete action
    // dispatch(GetReviewData(data?.id)); // Refresh the reviews after deletion
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.averageRatingContainer}>
        <Text style={styles.averageRatingText}>Average Rating</Text>
      </View>

      <View style={styles.commentBoxContainer}>
        <Text style={styles.labelText}>Enter the Title:</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Title or Subject for your review"
          value={reviewTitle}
          onChangeText={setReviewTitle}
        />

        <TextInput
          style={styles.commentInput}
          placeholder="Add your comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <View style={styles.ratingContainer}>
          <View style={styles.starContainer}>{renderStars(userRating)} </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Text style={styles.buttonText}>Add Comment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Reviews:</Text>

        {CandidateReview?.results?.map(review => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <Text style={styles.reviewTitle}>{review.review_title}</Text>
              <View style={styles.reviewRating}>
                {renderStars(review.rating)}
              </View>
            </View>
            {review.review_body && review.review_body.trim() !== '' ? (
              <Text style={styles.reviewBody}>{review.review_body}</Text>
            ) : null}
            <View style={styles.reviewInfoRow}>
              <Text style={styles.reviewInfo}>
                Rated by {review.given_by_name} on{' '}
                {moment(review.review_date).format('MMM Do, YYYY')}
              </Text>
              {review.given_by === id && (
                <TouchableOpacity
                  onPress={() => handleDeleteReview(review.id)}
                  style={styles.deleteIconContainer}>
                  <Ionicons name="trash-outline" size={20} color="#FF0000" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  averageRatingContainer: {
    marginBottom: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  averageRatingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  averageRatingValue: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  labelText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },

  commentBoxContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#e6e6e6',
    shadowOffset: {width: 0, height: 2},
  },
  titleInput: {
    height: 48,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentInput: {
    height: 100,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    padding: 8,
    borderRadius: 12,
    marginBottom: 10,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    width: 100,
    height: 36,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewCard: {
    backgroundColor: '#fafafa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#e6e6e6',
    marginBottom: 16,
    shadowRadius: 8,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reviewBody: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  reviewInfo: {
    fontSize: 12,
    color: '#888',
  },
  reviewInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteIconContainer: {
    marginLeft: 10,
  },
});

export default ReviewPage;
