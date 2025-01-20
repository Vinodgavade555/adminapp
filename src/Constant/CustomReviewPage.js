import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {colors} from '../Global_CSS/TheamColors';
import {useDispatch, useSelector} from 'react-redux';
import JobViewController from '../Redux/Action/JobViewController';

const ReviewPage = ({JobDetails}) => {
  const dispatch = useDispatch();
  const {GetReviewData, AddReview} = JobViewController();
  const {CandidateReview} = useSelector(state => state.job);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(5);

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
        user: '1',
        rating: userRating.toString(),
        review_title: 'HIRED',
        review_body: newComment,
        given_by: '1',
      };

      dispatch(AddReview(reviewData));

      setNewComment('');
      setUserRating(5);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View style={styles.averageRatingContainer}>
        <Text style={styles.averageRatingText}>Average Rating</Text>
      </View>

      <View style={styles.commentBoxContainer}>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    // padding: 20,
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

  commentBoxContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#e6e6e6',
    shadowOffset: {width: 0, height: 2},
  },
  commentInput: {
    height: 48,
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
});

export default ReviewPage;
