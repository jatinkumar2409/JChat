import { Text, View } from 'react-native'
import { StyleSheet } from 'react-native';
function SearchScreen() {
  console.log("I am in search screen");
  return (
    <View style={styles.view}>
    <Text style={{ color: "white", fontSize: 30 }}>
        Search SCREEN
      </Text>
    </View>
  )
}
const styles = StyleSheet.create({
  view : {
    flex : 1,
    justifyContent : 'center' ,
    alignItems : 'center'
  }
})


export default SearchScreen
