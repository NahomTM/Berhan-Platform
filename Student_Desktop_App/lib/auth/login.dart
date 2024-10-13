import 'package:desktop/screens/dashboard.dart';
import 'package:flutter/material.dart';
// import 'package:hive/hive.dart';
import 'package:dio/dio.dart';
// import 'package:desktopapp/otherpage.dart';
import 'package:flutter_tts/flutter_tts.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  FlutterTts flutterTts = FlutterTts();
  late bool Signedin;
  // final _mybox = Hive.box('dotBox');
  bool isButtonActive = true;
  late TextEditingController emailtext;
  late TextEditingController password;
  FocusNode _usernamefield = FocusNode();
  FocusNode _passwordfield = FocusNode();
  FocusNode _submitbutton = FocusNode();
  @override
  void initState() {
    flutterTts.stop();
    bool text1 = false;
    bool text2 = false;
    flutterTts.speak("This is the login page");
    _usernamefield.addListener(() {
      if (_usernamefield.hasFocus) {
        flutterTts.stop();
        flutterTts.speak("username textfield on focus");
      }
    });
    _passwordfield.addListener(() {
      if (_passwordfield.hasFocus) {
        flutterTts.stop();
        flutterTts.speak("password textfield on focus");
      }
    });
    _submitbutton.addListener(() {
      if (_submitbutton.hasFocus) {
        flutterTts.stop();
        flutterTts.speak("Submitbutton on focus");
      }
    });
    super.initState();
    // if (_mybox.get(70) != null) {
    //   setState(() {
    //     Signedin = true;
    //   });
    // } else {
    //   setState(() {
    //     Signedin = false;
    //   });
    // }
    emailtext = TextEditingController();
    emailtext.addListener(() {
      final text1 = emailtext.text.isNotEmpty;
    });
    password = TextEditingController();
    password.addListener(() {
      final text2 = password.text.isNotEmpty;
    });
    if (text1 == true && text2 == true) {
      isButtonActive = true;
    }
  }

  @override
  void dispose() {
    _usernamefield.dispose();
    _passwordfield.dispose();
    _submitbutton.dispose();
    super.dispose();
  }

  void changeforusername(String all) {
    int lastindexu = all.length - 1;
    if (all.length == 0) {
      all = "Usernamefield is Empty";
      flutterTts.stop();
      flutterTts.speak(all);
    } else {
      flutterTts.stop();
      flutterTts.speak(all[lastindexu]);
    }
  }

  void changeforpassword(String passin) {
    int lastindexp = passin.length - 1;
    if (passin.length == 0) {
      passin = "Passwordfield is Empty";
      flutterTts.stop();
      flutterTts.speak(passin);
    } else {
      flutterTts.stop();
      flutterTts.speak(passin[lastindexp]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.white,
        child: Stack(
          children: [
            // Background image
            Image.asset(
              'assets/Planet.jpg',
              fit: BoxFit.cover,
              width: double.infinity,
              height: double.infinity,
            ),
            // Grey transparent layer
            Container(
              color: Colors.grey.withOpacity(0.5),
              width: double.infinity,
              height: double.infinity,
            ),
            // Centered login container
            Center(
              child: Container(
                width: 450,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.3),
                      blurRadius: 5,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Username TextField
                    Container(
                      width: 400,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.transparent,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                            width: 2, color: Colors.black.withOpacity(0.5)),
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Username TextField
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.1),
                              borderRadius:
                                  BorderRadius.all(Radius.circular(10)),
                            ),
                            child: TextField(
                              onChanged: changeforusername,
                              focusNode: _usernamefield,
                              controller: emailtext,
                              decoration: InputDecoration(
                                labelText: 'Username',
                                border: InputBorder.none,
                                contentPadding: const EdgeInsets.symmetric(
                                  vertical: 15,
                                  horizontal: 20,
                                ),
                              ),
                            ),
                          ),

                          SizedBox(height: 30),
                          // Submit Button
                          ElevatedButton(
                            focusNode: _submitbutton,
                            onPressed: isButtonActive
                                ? () {
                                    // print("LOGIN");
                                    // _loginUser();
                                    Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => Dashboard()));
                                  }
                                : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.black,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 15),
                              alignment: Alignment.center,
                              child: Text(
                                'Submit',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _loginUser() async {
    if (password.text.isNotEmpty && emailtext.text.isNotEmpty) {
      Response<Map<String, dynamic>> response = await Dio().post(
          "https://berhan.addisphoenix.com/endpoint.php",
          data: {
            "qrValue": emailtext.text,
          },
          options:
              new Options(contentType: "application/x-www-form-urlencoded"));

      var success = response.data;
      print(success);
      /*
    ['error'=> true/false, 'msg'=>  String]
    */

      if (success?["error"]) {
        _showMyDialog();
        return;
      }
      // _mybox.put(71, 1);
      // _mybox.put(100, emailtext.text);
      // _mybox.put(110, password.text);
      // await _getImg();
      flutterTts.stop();
      flutterTts.speak("Login Successful");
      // Navigator.push(
      //     context, MaterialPageRoute(builder: (context) => Nontitle()));
      //logined in
      //Naviage erlvome
    }
  }

  // Future<String> _getImg() async {
  //   print("Img called");
  //   Response<Map<String, dynamic>> response = await Dio().post(
  //       "https://berhan.addisphoenix.com/getImg.php",
  //       data: {
  //         "email": _mybox.get(100),
  //         "password": _mybox.get(110),
  //       },
  //       options: new Options(contentType: "application/x-www-form-urlencoded"));

  //   var Imag = response.data;

  //   String nameimg = Imag?["Img"];
  //   print(nameimg);
  //   _mybox.put(2000, nameimg);
  //   return nameimg;
  // }

  Future<void> _showMyDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext fcontext) {
        return AlertDialog(
          title: const Text('Either username or password is incorrect'),
          content: SingleChildScrollView(
            child: ListBody(
              children: const <Widget>[
                Icon(
                  Icons.error,
                  color: Colors.red,
                  size: 120,
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Try again'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}
