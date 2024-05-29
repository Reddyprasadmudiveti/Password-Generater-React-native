import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {
  SafeAreaView,
  ScrollView,
  ScrollViewBase,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import React, {useState,useRef} from 'react';
import * as yup from 'yup';
import {Formik} from 'formik';
import Clipboard from '@react-native-clipboard/clipboard';


const passwordSchema = yup.object().shape({
  passwordLength: yup
    .number()
    .min(4, 'Minimum of 4 Characters')
    .max(16, 'should be maximum of 16 Characters')
    .required('This is Reuired'),
});
export default function Home() {
  const [password, setpassword] = useState('');
  const [isPassGenerated, setPassGenerated] = useState(false);
  const [lowecase, setLovercase] = useState(false);
  const [upperCase, setUppercase] = useState(false);
  const [numbers, SetNumbers] = useState(false);
  const [symbols, setsymbols] = useState(false);
  const generatedPasswordRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  

  const generatePasswordString = (passwordLength: number) => {
    let charList = '';

    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '1234567890';
    const spelChar = '!@#$%^&*()_+-=';

    if (upperCase) {
      charList += upperCase;
    }
    if (lowerCase) {
      charList += lowerCase;
    }
    if (numbers) {
      charList += numbers;
    }
    if (spelChar) {
      charList += spelChar;
    }

    const passwordResult = createPassword(charList, passwordLength);

    setpassword(passwordResult);
    setPassGenerated(true)

    setTimeout(() => {
      generatedPasswordRef.current?.measure((fx, fy, width, height, px, py) => {
        scrollViewRef.current?.scrollTo({ y: py, animated: true });
      });
    }, 100);
  };
  

  const createPassword = (characters: string, passwordLength: number) => {
    let result = '';
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(characterIndex);
    }
    return result;
  };

  const resetPassword = () => {
    setpassword('');
    setLovercase(false);
    setsymbols(false);
    SetNumbers(false);
    setUppercase(false);
    setPassGenerated(false);
  };

  const copyToClipboard = () => {
    Clipboard.setString(password);
    Alert.alert('Copied to Clipboard', 'The generated password has been copied to your clipboard.');
  };



  return (
    <ScrollView ref={scrollViewRef} keyboardShouldPersistTaps="handled">
      <SafeAreaView>
        <View style={styles.body}>
          <View style={styles.headingContainer}>
          <Text style={styles.heading}>PassWord Generator</Text>
          </View>

          <Formik
            initialValues={{passwordLength: ''}}
            validationSchema={passwordSchema}
            onSubmit={values => {
              console.log(values);
              generatePasswordString(Number(values.passwordLength));
            }}>
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
              /* and other goodies */
            }) => (
              <>
                <View>
                  <View style={styles.radioContainer}>
                    <View style={styles.lengthError}>

                    <Text style={styles.radioText}>Password Length</Text>
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={{color:"red"}}>{errors.passwordLength}</Text>
                    )}
                    </View>
                  <TextInput
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    placeholder="Ex : 8"
                    keyboardType="numeric"
                    />
                    </View>
                </View>
                <View style={styles.radioContainer}>
                  <Text style={styles.radioText}>Include Lower Case</Text>
                  <View>

                  <BouncyCheckbox
                    size={25}
                    fillColor="yellow"
                    iconStyle={{borderColor: 'red'}}
                    isChecked={lowecase}
                    innerIconStyle={{borderWidth: 2}}
                    textStyle={{fontFamily: 'JosefinSans-Regular'}}
                    onPress={()=>setLovercase(!lowecase)}
                    />
                    </View>
                </View>
                <View style={styles.radioContainer}>
                  <Text style={styles.radioText}>Include emojis</Text>
                  <View>
                  <BouncyCheckbox
                    size={25}
                    fillColor="pink"
                    iconStyle={{borderColor: 'red'}}
                    isChecked={symbols}
                    innerIconStyle={{borderWidth: 2}}
                    textStyle={{fontFamily: 'JosefinSans-Regular'}}
                    onPress={()=>setsymbols(!symbols)}
                    />
                    </View>
                </View>
                <View style={styles.radioContainer}>
                  <Text style={styles.radioText}>Include upperCase</Text>
                  <View>
                  <BouncyCheckbox
                    size={25}
                    fillColor="blue"
                    iconStyle={{borderColor: 'red'}}
                    isChecked={upperCase}
                    innerIconStyle={{borderWidth: 2}}
                    textStyle={{fontFamily: 'JosefinSans-Regular'}}
                    onPress={()=>setUppercase(!upperCase)}
                    />
                    </View>
                </View>
                <View style={styles.radioContainer}>
                  <Text style={styles.radioText}>Include lowerCase</Text>
                  <View>
                  <BouncyCheckbox
                    size={25}
                    fillColor="orange"
                    iconStyle={{borderColor: 'red'}}
                    isChecked={numbers}
                    innerIconStyle={{borderWidth: 2}}
                    textStyle={{fontFamily: 'JosefinSans-Regular'}}
                    onPress={()=>SetNumbers(!numbers)}
                    />
                    </View>
                </View>


                <View style={styles.extraOps}>
                  <TouchableOpacity 
                  disabled={!isValid}
                  onPress={()=>{handleSubmit()}}
                  >
                    <Text style={styles.Button}>Generate Password</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  onPress={()=>{handleReset(),resetPassword()}}>
                    <Text style={styles.ButtonReset} >Reset Password :</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        {isPassGenerated?(
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Generated Password</Text>
          <View style={styles.GenPass}>
            <Text style={styles.radioTextBlack}>Password : {password}</Text>
            <View>
            <TouchableOpacity>
            <Text style={styles.Button} onLongPress={()=>{copyToClipboard()}}>LongPress To Copy</Text>
            </TouchableOpacity>
            </View>
            </View>
          </View>
        ):null}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body:{
    marginHorizontal:20,
  },
  headingContainer:{
    flex:1,
    alignItems:"center",
    marginTop:20,
    marginHorizontal:10,
    flexDirection:"column"
  },
  lengthError:{
    flex:1,
    flexDirection:"column"
  },
  heading:{
    fontSize:20,
    fontWeight:"bold"
  },
  radioContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop:10,
    paddingHorizontal:10,
    gap:20,
    borderStyle:"solid",
    borderColor:"yellow",
    borderWidth:1,
    borderRadius:20,
    paddingVertical:20,
    backgroundColor:"#595939"
  },
  radioText:{
    fontSize:15,
    fontWeight:"bold"
  },
  radioTextBlack:{
    fontSize:15,
    fontWeight:"bold",
    color:"yellow"
  },
  extraOps:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-evenly",
    marginTop:20
  },
  Button:{
    backgroundColor:"blue",
    padding:20,
    maxWidth:200,
    borderRadius:20,
  },
  ButtonReset:{
    backgroundColor:"red",
    padding:20,
    borderRadius:20
  },
  GenPass:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
    backgroundColor:"gray",
    borderRadius:20,
    margin:20,
    maxWidth:400,
    width:300,
    height:200,
    gap:20
  }
});
