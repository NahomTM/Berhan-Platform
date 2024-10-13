import 'dart:convert';
// import 'package:hive/hive.dart';
import 'package:desktop/http/endpoint.dart';
import 'package:desktop/screens/question.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:desktop/core/instance.dart';
// import 'package:tutorialapp/sightinternetquestions.dart';
//import 'package:flutter_tts/flutter_tts.dart';
// import 'package:tutorialapp/sidebarsight.dart';
import 'package:desktop/global/global.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:get_storage/get_storage.dart';
// import 'package:hive/hive.dart';

class Inputcode extends StatefulWidget {
  const Inputcode({super.key});

  @override
  State<Inputcode> createState() => _InputcodeState();
}

class _InputcodeState extends State<Inputcode> {
  FocusNode _inputcodefield = FocusNode();
  // final _mybox = Hive.box('dotBox');
  FlutterTts flutterTts = FlutterTts();
  late String spoken;

  // final _mybox = Hive.box('dotBox');
  late List<Map<String, dynamic>> userData;
  late TextEditingController codetext;
  bool isButtonActive = true;
  bool Entered = false;
  Color miccolored = Color.fromARGB(255, 40, 82, 236);
  Color miccolor = Color.fromARGB(255, 131, 130, 130);
  Color miccolorreserv = Color.fromARGB(255, 131, 130, 130);

  @override
  void initState() {
    super.initState();
    flutterTts.speak("This is the page to Enter your course code");
    codetext = TextEditingController();
    _inputcodefield.addListener(() {
      if (_inputcodefield.hasFocus) {
        flutterTts.stop();
        flutterTts.speak("code input textfield on focus");
      }
    });
    // Navigator.of(context)
    //     .push(MaterialPageRoute(builder: (context) => PromptBox()));
//ou are now on your way to the Intenet Exam, this is the page where you enter the coursecode that was assigned for this exam");
  }

  @override
  void dispose() {
    flutterTts.stop();
    _inputcodefield.dispose();
    super.dispose();
  }

  void codefieldchange(String all) {
    int lastindexu = all.length - 1;
    if (all.length == 0) {
      all = "Codefield is Empty";
      flutterTts.stop();
      flutterTts.speak(all);
    } else {
      flutterTts.stop();
      flutterTts.speak(all[lastindexu]);
    }
  }

  int? internettime;
  List<Internet> suns = [];
  @override
  Widget build(BuildContext context) {
    return Theme(
        data: ThemeData(
          iconTheme: IconThemeData(color: Color.fromARGB(255, 40, 82, 236)),
        ),
        child: Scaffold(
            appBar: AppBar(
              iconTheme: IconThemeData(
                color: Colors.black,
              ),
              actions: [
                ElevatedButton(
                  onPressed: () {
                    //  _mybox.delete(70);
                    Navigator.of(context).pop();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text('Logout'),
                ),
              ],
              backgroundColor: Colors.grey[200],
            ),
            //  drawer: NavBarSS(),
            body: Scaffold(
              body: Container(
                color: Colors.white,
                child: Stack(
                  children: [
                    Image.asset(
                      'assets/nitrowall.JPG',
                      fit: BoxFit.cover,
                      width: double.infinity,
                      height: double.infinity,
                    ),
                    Container(
                      color: Colors.grey.withOpacity(0.5),
                      width: double.infinity,
                      height: double.infinity,
                    ),
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
                            Container(
                              width: 400,
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                color: Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                    width: 2,
                                    color: Colors.black.withOpacity(0.5)),
                              ),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.1),
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(10)),
                                    ),
                                    child: TextField(
                                      focusNode: _inputcodefield,
                                      onChanged: codefieldchange,
                                      onSubmitted: ((value) {
                                        _sendCode();
                                      }),
                                      autofocus: true,
                                      controller: codetext,
                                      decoration: InputDecoration(
                                        labelText: 'Enter Code ',
                                        border: InputBorder.none,
                                        contentPadding:
                                            const EdgeInsets.symmetric(
                                          vertical: 15,
                                          horizontal: 20,
                                        ),
                                      ),
                                    ),
                                  ),
                                  SizedBox(height: 30),
                                  ElevatedButton(
                                    onPressed: isButtonActive
                                        ? () {
                                            print("LOGIN");
                                            _sendCode();
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
                                      padding: const EdgeInsets.symmetric(
                                          vertical: 15),
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
            )));
  }

  void _sendCode() async {
    if (codetext.text.isNotEmpty) {
      // _mybox.put(57, codetext.text);
      Response<Map> response = await Dio().post(
          'http://localhost:4000/student/getanexam',
          data: {
            "code": codetext.text,
          },
          options:
              new Options(contentType: "application/x-www-form-urlencoded"));

      if (response.statusCode == 200) {
        getstorage.write("code", response.data!['examCode']);

        List<dynamic> rawData = response.data!['questions'];
        print(rawData);
        suns = rawData.map<Internet>((dataItem) {
          return Internet.fromMap(dataItem as Map<String, dynamic>);
        }).toList();
        // return suns;
      } else {
        throw Exception(
            'Failed to load questions with status code: ${response.statusCode}');
      }
      print(suns[0].question);

      int? internettime = response.data!['duration']?.isEmpty == true
          ? null
          : int.tryParse(response.data!['duration']!);
      print(internettime);
      // _mybox.put(57,codetext.text);
      Navigator.of(context).push(MaterialPageRoute(
          builder: (context) => Question(
                questions: suns,
                seconds: internettime!,
              )));
    }
  }

  Future<void> _showErrorDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext fcontext) {
        return AlertDialog(
          title: const Text('Our Records show you took this test,already'),
          content: ListBody(
            children: const <Widget>[
              Icon(
                Icons.warning,
                color: Colors.red,
                size: 120,
              ),
            ],
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

class Internet {
  String? question;
  String? choicea;
  String? choiceb;
  String? choicec;
  String? choiced;
  String? answers;
  String? timeall;
  Internet(
      {required this.question,
      required this.choicea,
      required this.choiceb,
      required this.choicec,
      required this.choiced,
      required this.answers,
      required this.timeall});

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'question': question,
      'choicea': choicea,
      'choiceb': choiceb,
      'choicec': choicec,
      'choiced': choiced,
      'answers': answers,
      'timeall': timeall,
    };
  }

  factory Internet.fromMap(Map<String, dynamic> map) {
    return Internet(
      question: map['question'] != null ? map['question'] as String : null,
      choicea: map['choicea'] != null ? map['choicea'] as String : null,
      choiceb: map['choiceb'] != null ? map['choiceb'] as String : null,
      choicec: map['choicec'] != null ? map['choicec'] as String : null,
      choiced: map['choiced'] != null ? map['choiced'] as String : null,
      answers: map['answers'] != null ? map['answers'] as String : null,
      timeall: map['timeall'] != null ? map['timeall'] as String : null,
    );
  }

  String toJson() => json.encode(toMap());

  factory Internet.fromJson(String source) =>
      Internet.fromMap(json.decode(source) as Map<String, dynamic>);
}

// class PromptBox extends StatefulWidget {
//   @override
//   _PromptBoxState createState() => _PromptBoxState();
// }

// class _PromptBoxState extends State<PromptBox> {
//   final _mybox = Hive.box('dotBox');
//   List<Internet> suns = [];
//   final TextEditingController codetext = TextEditingController();
//   @override
//   void initState() {
//     print("Initialized");
//     _showErrorDialog();
//   }

//   @override
//   void dispose() {
//     codetext.dispose();
//     super.dispose();
//   }

//   void _handleSubmit() {
//     // Perform the submit button click action here
//     print('Submit button clicked!');
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Center(
//         child: Column(
//           mainAxisAlignment: MainAxisAlignment.center,
//           children: [
//             TextField(
//               // autofocus: true,
//               controller: codetext,
//               decoration: InputDecoration(
//                 hintText: 'Enter your text',
//               ),
//               onSubmitted: (_) => _sendCode(),
//             ),
//             SizedBox(height: 16),
//             ElevatedButton(
//               onPressed: _sendCode,
//               child: Text('Submit'),
//             ),
//           ],
//         ),
//       ),
//     );
//   }

//   void _sendCode() async {
//     if (codetext.text.isNotEmpty) {
//       Response<List> response = await Dio().post(
//           "https://berhan.addisphoenix.com/endpointquestions.php",
//           data: {
//             "courseid": codetext.text,
//             "email": _mybox.get(100),
//             // "email": _mybox.get(80),
//           },
//           options:
//               new Options(contentType: "application/x-www-form-urlencoded"));

//       suns = response.data!
//           .map((e) => Internet.fromMap(e as Map<String, dynamic>))
//           .toList();
//       print(suns[0].question);

//       int? internettime = suns[0].timeall?.isEmpty == true
//           ? null
//           : int.tryParse(suns[0].timeall!);
//       print(internettime);
//       // _mybox.put(57,codetext.text);
//       Navigator.of(context).push(MaterialPageRoute(
//           builder: (context) => Question(
//                 questions: suns,
//                 seconds: internettime!,
//               )));
//     }
//   }

//   Future<void> _showErrorDialog() async {
//     return showDialog<void>(
//       context: context,
//       barrierDismissible: false, // user must tap button!
//       builder: (BuildContext fcontext) {
//         return AlertDialog(
//           title: const Text('Our Records show you took this test,already'),
//           content: ListBody(
//             children: const <Widget>[
//               Icon(
//                 Icons.warning,
//                 color: Colors.red,
//                 size: 120,
//               ),
//             ],
//           ),
//           actions: <Widget>[
//             TextButton(
//               child: const Text('Ok'),
//               onPressed: () {
//                 Navigator.of(context).pop();
//               },
//             ),
//           ],
//         );
//       },
//     );
//   }
// }
