import {StyleSheet} from 'react-native';
import {colors} from './TheamColors';

const GlobalStyle = StyleSheet.create({
  labelStyle: {
    color: colors.whiteText,
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    height: 48,
    width: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 11,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 18,
    justifyContent: 'space-between',
  
  },
  headerText: {
    fontSize: 20,
    color: '#000',
  },
});

export default GlobalStyle;
