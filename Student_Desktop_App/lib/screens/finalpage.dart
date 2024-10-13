// import 'package:desktopapp/inputcode.dart';
// import 'package:desktopapp/otherpage.dart';
import 'package:desktop/screens/InputCode.dart';
import 'package:desktop/screens/dashboard.dart';
import 'package:flutter/material.dart';
import 'dart:convert';
// import 'package:hive/hive.dart';
import 'package:dio/dio.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:get_storage/get_storage.dart';
import 'package:desktop/core/instance.dart';

class FINALPAGE extends StatefulWidget {
  List answersinternet;

  List answersusers;
  int total;
  FINALPAGE(
      {Key? mykey,
      required this.answersinternet,
      required this.answersusers,
      required this.total})
      : super(key: mykey);

  @override
  State<FINALPAGE> createState() => _FINALPAGEState();
}

class _FINALPAGEState extends State<FINALPAGE> {
  // final _mybox = Hive.box('dotBox');
  int numberofquestions = 0;

  int correct = 0;
  List newanswers = [];
  compute() {
    for (int j = 0; j < widget.answersinternet.length; j++) {
      try {
        newanswers.add(int.parse(widget.answersinternet[j]));
      } catch (e) {
        print("Error parsing ${widget.answersinternet[j]}: $e");
      }
    }
    for (int i = 0; i < widget.answersinternet.length; i++) {
      if (newanswers[i] == widget.answersusers[i]) {
        setState(() {
          correct += 1;
        });
      }
    }

    print("New Useranswer");
  }

  FlutterTts flutterTts = FlutterTts();

  @override
  void initState() {
    flutterTts.stop();
    flutterTts.speak("Your Examination is Complete");
    _sendCode();

// _sendCode();
  }

  @override
  void dispose() {
    flutterTts.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: backIsPressed,
        child: Theme(
            data: ThemeData(
              iconTheme: IconThemeData(
                color: Colors.black,
              ),
            ),
            child: Scaffold(
              appBar: AppBar(
                iconTheme: IconThemeData(
                  color: Colors.black,
                ),
                actions: [
                  ElevatedButton(
                    onPressed: () {
                      // Navigator.of(context).pop();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color.fromARGB(255, 21, 21, 21),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text('Logout'),
                  ),
                ],
                backgroundColor: Colors.grey[200],
              ),
              body: Scaffold(
                  body: GestureDetector(
                      child: Container(
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage("assets/thumbs-up.JPEG"),
                    fit: BoxFit.cover,
                  ),
                  color: Colors.grey[900],
                ),
                child: Stack(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(40.0),
                      child: Align(
                          alignment: Alignment.topRight,
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(30),
                            ),
                            child: IconButton(
                              icon: Icon(Icons.home),
                              onPressed: () {
                                // Navigator.push(
                                //     context,
                                //     MaterialPageRoute(
                                //       builder: (context) => Nontitle(),
                                //     ));
                                Navigator.pushAndRemoveUntil(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => Dashboard()),
                                  (Route<dynamic> route) => false,
                                );
                              },
                              splashRadius: 20,
                              tooltip: 'Home',
                              iconSize: 40,
                              color: Colors.black,
                            ),
                          )),
                    ),
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: Padding(
                        padding: const EdgeInsets.all(10.0),
                        child: Container(
                            height: 200,
                            width: double.infinity,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.all(
                                Radius.circular(40),
                              ),
                              color: Colors.white.withOpacity(0.8),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(bottom: 8.0),
                                    child: Icon(
                                      Icons.check_circle_outline,
                                      size: 40,
                                      color: Colors.green,
                                    ),
                                  ),
                                  Padding(
                                    padding:
                                        const EdgeInsets.only(bottom: 15.0),
                                    child: Text(
                                      "Check your result on the website",
                                      style: TextStyle(
                                          color: Colors.black, fontSize: 40),
                                    ),
                                  ),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      ElevatedButton(
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Colors.green,
                                          shape: RoundedRectangleBorder(
                                            borderRadius:
                                                BorderRadius.circular(90),
                                          ),
                                          minimumSize: Size(290, 40),
                                        ),
                                        onPressed: () {
                                          _sendCode();
                                        },
                                        child: Text(
                                          'Complete',
                                          style: TextStyle(fontSize: 20),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            )),
                      ),
                    ),
                  ],
                ),
              ))),
            )));
  }

  void _sendCode() async {
    var examcode = getstorage.read("code");
    Response<Map<String, dynamic>> response = await Dio().post(
        "http://localhost:4000/result/addResult",
        data: {
          "studentId": 1,
          "result": widget.total,
          "examId": examcode,
        },
        options: new Options(contentType: "application/x-www-form-urlencoded"));

    print("exam code :: " + getstorage.read("code"));

    if (response.statusCode == 200) {
      _showMyDialog();
      await Future.delayed(Duration(seconds: 10));
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => Inputcode()),
        (Route<dynamic> route) => false,
      );
      return;
    } else {
      _showErrorDialog();
    }
  }

  Future<bool> backIsPressed() async {
    return false;
  }

  Future<void> _showMyDialog() async {
    flutterTts.speak(
        "Your result is succesfully submitted to the web, you can check your result on the website");
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext fcontext) {
        return AlertDialog(
          title: const Text('Successfully Submitted to Web'),
          content: SingleChildScrollView(
            child: ListBody(
              children: const <Widget>[
                Icon(
                  Icons.check_box_rounded,
                  color: Colors.green,
                  size: 120,
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Ok'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  Future<void> _showErrorDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext fcontext) {
        return AlertDialog(
          title: const Text('Something went Wrong'),
          content: SingleChildScrollView(
            child: ListBody(
              children: const <Widget>[
                Icon(
                  Icons.warning,
                  color: Colors.red,
                  size: 120,
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Ok'),
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
