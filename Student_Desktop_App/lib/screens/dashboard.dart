// import 'package:desktopapp/choosetoready.dart';
// import 'package:desktopapp/inputcode.dart';
// import 'package:desktopapp/read.dart';
// import 'package:desktopapp/globals.dart';
import 'package:desktop/screens/InputCode.dart';
import 'package:desktop/screens/audiopage.dart';
import 'package:flutter/material.dart';
import 'package:bitsdojo_window/bitsdojo_window.dart';
// import 'package:window_manager/window_manager.dart';

import 'package:dio/dio.dart';
import 'dart:ui';
import 'dart:async';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

import 'package:flutter_tts/flutter_tts.dart';
// void main() async {
//   WidgetsFlutterBinding.ensureInitialized();

//   runApp(MaterialApp(
//       debugShowCheckedModeBanner: false,
//       theme: ThemeData(
//         primarySwatch: Colors.blue,
//       ),
//       home: Nontitle()));
//   doWhenWindowReady(() {
//     appWindow.minSize = Size(1000, 600);
//     appWindow.title = "Unresizable Window";
//     appWindow.show();
//   });
// }

class Dashboard extends StatefulWidget {
  const Dashboard({super.key});

  @override
  State<Dashboard> createState() => _NontitleState();
}

class _NontitleState extends State<Dashboard> {
  FocusNode _AIstudy = FocusNode();
  FocusNode _Test = FocusNode();
  FlutterTts flutterTts = FlutterTts();
  late bool Signedin;

  bool isButtonActive = false;
  late TextEditingController emailtext;
  late TextEditingController password;
  PageController pageController = PageController();

  @override
  void initState() {
    // _getImg();
    flutterTts.stop();
    flutterTts.speak("This is your Dashboard Page");
    bool text1 = false;
    bool text2 = false;

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
    _AIstudy.addListener(() {
      if (_AIstudy.hasFocus) {
        flutterTts.stop();
        flutterTts.speak("Go to, AI Assisted Study");
      }
    });
    _Test.addListener(() {
      if (_Test.hasFocus) {
        flutterTts.stop();
        flutterTts.speak("Go to Exams");
      }
    });
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
    flutterTts.stop();
    _AIstudy.dispose();
    _Test.dispose();
    super.dispose();
  }

  int topIndex = 0;
  late Color min;
  var buttonColors =
      WindowButtonColors(normal: Color.fromARGB(255, 255, 255, 255));
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Row(mainAxisAlignment: MainAxisAlignment.start, children: [
      Expanded(
        child: PageView(
          controller: pageController,
          children: [
            Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/glass.JPEG'),
                  fit: BoxFit.cover,
                ),
              ),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(15.0),
                    child: Row(
                      children: [
                        // Text(
                        //   "${_mybox.get(100)}",
                        //   style: TextStyle(fontSize: 30, color: Colors.white),
                        // ),
                        Spacer(),
                        // Padding(
                        //     padding: const EdgeInsets.only(right: 20.0),
                        //     child: Container(
                        //       width: 80,
                        //       height: 80,
                        //       decoration: BoxDecoration(
                        //         shape: BoxShape.circle,
                        //         image: DecorationImage(
                        //           image: NetworkImage(
                        //               'https://berhan.addisphoenix.com/uploads/clientimg/${_mybox.get(2000)}'),
                        //           fit: BoxFit.cover,
                        //         ),
                        //       ),
                        //     )),
                      ],
                    ),
                  ),
                  const Center(
                    child: Text(
                      'Dashboard',
                      style: TextStyle(
                          fontSize: 35,
                          color: Color.fromARGB(255, 255, 254, 254)),
                    ),
                  ),
                  SizedBox(
                    height: 35,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton(
                        focusNode: _AIstudy,
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(
                              builder: (context) => (MyMP3Page())));
                        },
                        style: ElevatedButton.styleFrom(
                          elevation: 9,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(19),
                          ),
                          backgroundColor: Colors.white.withOpacity(0.6),
                          padding: const EdgeInsets.all(10.0),
                          // side: BorderSide(
                          //   color: const Color.fromARGB(255, 122, 118, 118),
                          //   width: 0.4,
                          // ),
                          fixedSize: Size(360,
                              430), // Adjust the width and height as desired
                        ),
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(19),
                            color: Colors.white.withOpacity(0.1),
                          ),
                          child: Column(
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(20.0),
                                child: FaIcon(
                                  FontAwesomeIcons.brain,
                                  size: 140,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 30,
                              ),
                              Text(
                                "AI-assisted study",
                                style: TextStyle(
                                    fontSize: 30,
                                    color: Colors.black,
                                    fontWeight: FontWeight.normal),
                              ),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 20,
                      ),
                      ElevatedButton(
                        focusNode: _Test,
                        onPressed: () {
                          Navigator.of(context).push(MaterialPageRoute(
                              builder: (context) => Inputcode()));
                        },
                        style: ElevatedButton.styleFrom(
                          elevation: 9,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(19),
                          ),
                          backgroundColor: Colors.white.withOpacity(0.6),
                          padding: const EdgeInsets.all(10.0),

                          fixedSize: Size(360,
                              430), // Adjust the width and height as desired
                        ),
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(19),
                            color: Colors.white.withOpacity(0.1),
                          ),
                          child: Column(
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(20.0),
                                child: FaIcon(
                                  FontAwesomeIcons.bookOpen,
                                  size: 140,
                                  color: Colors.black,
                                ),
                              ),
                              SizedBox(
                                height: 30,
                              ),
                              Text(
                                "Exams",
                                style: TextStyle(
                                    fontSize: 30,
                                    color: Colors.black,
                                    fontWeight: FontWeight.normal),
                              ),
                            ],
                          ),
                        ),
                      )
                    ],
                  )
                ],
              ),
            ),
            Container(
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
                  Padding(
                    padding: const EdgeInsets.only(
                        left: 70.0, right: 70.0, top: 30, bottom: 30),
                    child: Container(
                      height: double.infinity,
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
                      child: Padding(
                        padding: const EdgeInsets.all(15.0),
                        child: SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Image.asset("assets/snipped.PNG"),
                              SizedBox(
                                height: 35,
                              ),
                              Text(
                                "Education has undergone a significant transformation with the rise of computerized and online systems. Information technology has emerged as a crucial player in modern education, bringing about remarkable changes to the traditional methods of teaching and learning. With the advent of computers and the internet, educational institutions can now deliver education conveniently and efficiently, without the constraints of time or location.However, one major drawback of these systems is their limited accessibility for visually impaired individuals. Without the necessary accessibility features, visually impaired students may struggle to participate in online exams, which can put them at a disadvantage. That's why we, as a team, are working a project to develop a system that addresses this issue by providing appropriate accessibility features. Our system is designed to cater to the needs of visually impaired individuals, enabling them to participate in online exams with ease. We incorporate features such as text-to-speech functionality, screen readers, making it more accessible for visually impaired individuals.",
                                style: TextStyle(
                                  fontFamily: 'Arial',
                                  color: Colors.black,
                                  fontSize: 17,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              color: Colors.white,
              child: const Center(
                child: Text(
                  'Files',
                  style: TextStyle(fontSize: 35),
                ),
              ),
            ),
            Container(
              color: Colors.white,
              child: const Center(
                child: Text(
                  'Download',
                  style: TextStyle(fontSize: 35),
                ),
              ),
            ),
            Container(
              color: Colors.white,
              child: const Center(
                child: Text(
                  'Settings',
                  style: TextStyle(fontSize: 35),
                ),
              ),
            ),
            Container(
              color: Colors.white,
              child: const Center(
                child: Text(
                  'Only Title',
                  style: TextStyle(fontSize: 35),
                ),
              ),
            ),
            Container(
              color: Colors.white,
              child: const Center(
                child: Text(
                  'Only Icon',
                  style: TextStyle(fontSize: 35),
                ),
              ),
            ),
          ],
        ),
      )
    ]));
  }

  void _loginUser() async {
    if (password.text.isNotEmpty && emailtext.text.isNotEmpty) {
      Response<Map<String, dynamic>> response = await Dio().post(
          "https://berhan.addisphoenix.com/endpoint.php",
          data: {
            "email": emailtext.text,
            "password": password.text,
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

      // Navigator.of(context)
      //     .push(MaterialPageRoute(builder: (context) => Nontitle()));
      //logined in
      //Naviage erlvome
    }
  }

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

  // void _getImg() async {
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
  // }
}

class WindowButtons extends StatelessWidget {
  var buttonColors =
      WindowButtonColors(iconNormal: Color.fromARGB(255, 255, 255, 255));
  var buttonColorsclose = WindowButtonColors(
      iconNormal: Color.fromARGB(255, 255, 255, 255), mouseOver: Colors.red);
  WindowButtons({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CloseWindowButton(colors: buttonColorsclose),
        MaximizeWindowButton(colors: buttonColors),
        MinimizeWindowButton(colors: buttonColors),
      ],
    );
  }
}
