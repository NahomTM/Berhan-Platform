import 'dart:async';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:desktop/auth/login.dart';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:bitsdojo_window/bitsdojo_window.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:qr_flutter/qr_flutter.dart';

class FMainpage extends StatefulWidget {
  const FMainpage({super.key});

  @override
  State<FMainpage> createState() => _FMainpageState();
}

class _FMainpageState extends State<FMainpage> {
  FlutterTts flutterTts = FlutterTts();
  bool _show = true;
  Timer? _timer;
  late FocusNode _focusNode;
  @override
  void initState() {
    flutterTts.speak("Welcome,  press Space to continue");
    _focusNode = FocusNode();
    _timer = Timer.periodic(const Duration(milliseconds: 500), (_) {
      setState(() => _show = !_show);
    });

    super.initState();
  }

  @override
  void dispose() {
    _timer?.cancel();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    double screenHeight = MediaQuery.of(context).size.height;
    double screenWidth = MediaQuery.of(context).size.width;
    return RawKeyboardListener(
      autofocus: true,
      focusNode: _focusNode,
      onKey: (event) {
        if (event is RawKeyDownEvent) {
          if (event.isKeyPressed(LogicalKeyboardKey.space)) {
            Navigator.push(
                context, MaterialPageRoute(builder: (context) => Login()));
          }
        }
      },
      child: Scaffold(
        body: Container(
          decoration: BoxDecoration(),
          width: double.infinity,
          child: Stack(
            children: [
              CarouselSlider(
                options: CarouselOptions(
                  autoPlay: true,
                  autoPlayInterval: const Duration(seconds: 4),
                  viewportFraction: 1.0,
                ),
                items: [
                  "assets/planet2.JPEG",
                  "assets/planet4.JPEG",
                  "assets/planet5.JPEG",
                  "assets/planet3.JPEG",
                ].map((i) {
                  return Builder(
                    builder: (BuildContext context) {
                      return Container(
                        height: screenHeight,
                        width: screenWidth,
                        decoration: BoxDecoration(),
                        child: Image.asset(
                          '$i',
                          fit: BoxFit.cover,
                        ),
                      );
                    },
                  );
                }).toList(),
              ),
              Container(
                width: screenWidth,
                height: screenHeight,
                decoration: BoxDecoration(
                  color: Color.fromARGB(255, 85, 83, 83).withOpacity(0.5),
                ),
              ),
              Column(mainAxisAlignment: MainAxisAlignment.start, children: [
                // WindowTitleBarBox(
                //   child: MoveWindow(
                //     child: WindowButtons(),
                //   ),
                // ),
                Image.asset("assets/k.PNG",
                    width: 100, height: 150, fit: BoxFit.cover),
                Container(
                  height: 50,
                  child: Text("Press Space",
                      style: _show
                          ? const TextStyle(
                              fontSize: 35,
                              fontWeight: FontWeight.bold,
                              color: Color.fromARGB(255, 255, 255, 255))
                          : const TextStyle(color: Colors.transparent)),
                ),
                // Container(
                //   child: Text(
                //     "Press Enter",
                //     style: TextStyle(
                //         fontSize: 35,
                //         fontWeight: FontWeight.bold,
                //         color: Color.fromARGB(255, 255, 255, 255)),
                //   ),
                // ),
                SizedBox(
                  height: 80,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 280,
                      height: 370,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(20)),
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(6, 6),
                            blurRadius: 7,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          SizedBox(
                            height: 20,
                          ),
                          FaIcon(
                            FontAwesomeIcons.brain,
                            size: 35,
                          ),
                          SizedBox(height: 40),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Center(
                              child: Padding(
                                padding: const EdgeInsets.all(4.0),
                                child: Text(
                                  "AI engagement with an interactive and user-focused solution. Experience the power of intuitive conversations and personalized responses, providing you with a truly immersive and efficient user experience ",
                                  style: TextStyle(fontSize: 16),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      width: 20,
                    ),
                    Container(
                      width: 280,
                      height: 370,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(20)),
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(6, 6),
                            blurRadius: 7,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          SizedBox(
                            height: 20,
                          ),
                          FaIcon(
                            FontAwesomeIcons.internetExplorer,
                            size: 35,
                          ),
                          SizedBox(height: 40),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Center(
                              child: Padding(
                                padding: const EdgeInsets.all(4.0),
                                child: Text(
                                  "Vast online dynamic resources, pdfs, quizes and study supplements ",
                                  style: TextStyle(fontSize: 16),
                                ),
                              ),
                            ),
                          ),
                          Container(
                            decoration: BoxDecoration(
                              border: Border.all(
                                width: 1,
                                color: Colors.black,
                              ),
                              borderRadius:
                                  BorderRadius.all(Radius.circular(20)),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(3.0),
                              child: QrImageView(
                                data: 'Under Construction',
                                version: QrVersions.auto,
                                size: 165.0,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      width: 20,
                    ),
                    Container(
                      width: 280,
                      height: 370,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.all(Radius.circular(20)),
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.5),
                            offset: Offset(6, 6),
                            blurRadius: 7,
                          ),
                        ],
                      ),
                      child: Column(
                        children: [
                          SizedBox(
                            height: 20,
                          ),
                          FaIcon(
                            FontAwesomeIcons.users,
                            size: 35,
                          ),
                          SizedBox(
                            height: 40,
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Center(
                              child: Text(
                                "A community of developers and educational institutions for the sustainablity , growth ,and progressive enhancement of this initiative  ",
                                style: TextStyle(fontSize: 16),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                )
              ]),
            ],
          ),
        ),
      ),
    );
  }
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

class WindowTitleBarBox extends StatelessWidget {
  final Widget? child;
  WindowTitleBarBox({Key? key, this.child}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    // if (kIsWeb) {
    //   return Container();
    // }
    final titlebarHeight = appWindow.titleBarHeight;
    return SizedBox(height: titlebarHeight, child: this.child ?? Container());
  }
}
