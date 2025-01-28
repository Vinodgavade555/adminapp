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
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JobViewController from '../Recruiter/RecruiterRedux/Action/JobViewController';
import ConfirmationModal from './CustomModal';

const ReviewPage = ({data}) => {
  const dispatch = useDispatch();
  const {GetReviewData, AddReview, DeleteReview} = JobViewController();
  const {CandidateReview} = useSelector(state => state.job);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(3);
  const [id, setId] = useState('');
  const isFocus = useIsFocused();
  const [reviewTitle, setReviewTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const id = await AsyncStorage.getItem('user_data');
        dispatch(GetReviewData(data?.user?.user_id));

        setId(id);
      } catch (error) {
        console.error('Error reading value from AsyncStorage', error);
      }
    };

    getUserData();
  }, [isFocus]);

  useEffect(() => {}, [CandidateReview]);

  const renderStars = rating => {
    const numericRating = parseFloat(rating) || 0;
    const stars = [];
    const fullStars = Math.floor(numericRating);
    const halfStar = numericRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={18} color="#FFD700" />,
      );
    }
    if (halfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={18} color="#FFD700" />,
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={18}
          color="#FFD700"
        />,
      );
    }

    return <View style={styles.starDisplay}>{stars}</View>;
  };

  const handleAddComment = () => {
    const numericRating = parseFloat(userRating);
    if (newComment && numericRating >= 0 && numericRating <= 5) {
      const reviewData = {
        user: data?.user?.user_id,
        rating: numericRating.toString(),
        review_title: reviewTitle,
        review_body: newComment,
        given_by: id,
      };
      dispatch(AddReview(reviewData));

      setNewComment('');
      setUserRating(2);
      setReviewTitle('');
    }
  };

  const handleRatingChange = text => {
    const sanitizedText = text.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(sanitizedText);
    if (sanitizedText === '' || (numericValue >= 0 && numericValue <= 5)) {
      setUserRating(sanitizedText);
    }
  };

  const handleDeleteReview = reviewId => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDeleteReview = () => {
    dispatch(DeleteReview(reviewToDelete));

    setShowDeleteModal(false); // Close modal after confirmation
  };
  const cancelDeleteReview = () => {
    setShowDeleteModal(false);
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

        <Text style={styles.labelText}>Enter your comment:</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Add your comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />

        <Text style={styles.labelText}>Enter your rating:</Text>
        <View style={styles.ratingRow}>
          <TextInput
            style={styles.ratingInput}
            placeholder="0-5 ratings"
            keyboardType="numeric"
            value={userRating}
            onChangeText={handleRatingChange}
          />
          {renderStars(userRating)}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleAddComment}>
          <Text style={styles.buttonText}>Add Comment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsContainer}>
        {CandidateReview?.results && CandidateReview?.results.length > 0 ? (
          <>
            <Text style={styles.reviewsTitle}>Reviews:</Text>

            {CandidateReview.results.map(review => {
              return (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewInfoRow}>
                    <Text style={styles.reviewInfo}>
                      {review.given_by_name}
                    </Text>
                    <Text style={styles.reviewInfo}>
                      {moment(review.review_date).format('D MMM, YYYY')}
                    </Text>
                  </View>

                  <View style={styles.reviewTextContainer}>
                    {/* Conditionally render review title */}

                    {review.review_title &&
                      review.review_title.trim() !== '' && (
                        <Text style={styles.reviewTitle}>
                          {review.review_title}
                        </Text>
                      )}

                    {review.review_body && review.review_body.trim() !== '' && (
                      <Text style={styles.reviewBody}>
                        {review.review_body}
                      </Text>
                    )}
                  </View>

                  <View style={styles.reviewActionsRow}>
                    <View style={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </View>

                    {review.given_by == id && (
                      <TouchableOpacity
                        onPress={() => handleDeleteReview(review.id)}
                        style={styles.deleteIconContainer}>
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#FF0000"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </>
        ) : null}
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        // onClose={() => setShowDeleteModal(false)}
        onClose={cancelDeleteReview}
        onConfirm={confirmDeleteReview}
        message="Are you sure you want to delete this review?"
        title="Delete Review"
      />
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingInput: {
    width: 100, // Shorter width
    height: 48,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginRight: 10,
    textAlign: 'center',
  },
  ratingText: {fontSize: 14, color: '#333', marginVertical: 8},

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
  starDisplay: {
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
  reviewInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#e6e6e6',
    marginBottom: 16,
    shadowRadius: 8,
  },
  reviewActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewTextContainer: {
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
    padding: 8,
    borderRadius: 8,
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
