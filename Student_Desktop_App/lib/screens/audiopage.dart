import 'package:desktop/screens/models/audio_book_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:dio/dio.dart';
import 'package:desktop/screens/singleaudio.dart';

class MyMP3Page extends StatefulWidget {
  @override
  State<MyMP3Page> createState() => _MyMP3PageState();
}

class _MyMP3PageState extends State<MyMP3Page> {
  FlutterTts flutterTts = FlutterTts();
  List<AudioBookModel> mp3Collection = [];

  @override
  void initState() {
    super.initState();
    initializeTTS();
    fetchBooks();
  }

  void initializeTTS() async {
    await flutterTts.awaitSpeakCompletion(true);
    flutterTts.speak("Welcome to the Book Store");
  }

  Future<void> fetchBooks() async {
    final dio = Dio();

    try {
      final response =
          await dio.get('http://localhost:4000/document/getDocuments');

      if (response.statusCode == 200) {
        print(response.data);

        if (response.data is List) {
          setState(() {
            mp3Collection = (response.data as List).map((item) {
              return AudioBookModel.fromMap(item as Map<String, dynamic>);
            }).toList();
          });

          print(mp3Collection.map((e) => e.toJson()).toList());
        } else {
          print('Data is not a list');
        }
      } else {
        print('Failed to load data');
      }
    } catch (e) {
      print('Error fetching books: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF121212),
      appBar: AppBar(
        title: Text('Book Store'),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: GridView.builder(
        padding: EdgeInsets.all(20),
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 20,
          mainAxisSpacing: 20,
          childAspectRatio: 1 / 1.2,
        ),
        itemCount: mp3Collection.length,
        itemBuilder: (context, index) {
          return Focus(
            onFocusChange: (hasFocus) {
              if (hasFocus) {
                flutterTts.speak(mp3Collection[index].title);
              }
            },
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => AudioPlayerPage(
                      title: mp3Collection[index].title,
                      address: mp3Collection[index].address,
                    ),
                  ),
                );
                print('Playing ${mp3Collection[index].title}');
              },
              style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all(Colors.transparent),
                shadowColor: MaterialStateProperty.all(
                    Colors.deepOrange.withOpacity(0.5)),
                elevation: MaterialStateProperty.all(8),
                shape: MaterialStateProperty.all(
                  RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
                padding: MaterialStateProperty.all(EdgeInsets.zero),
              ),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.grey[850]!, Colors.black],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        mp3Collection[index].title,
                        style: TextStyle(color: Colors.white, fontSize: 20),
                        textAlign: TextAlign.center,
                      ),
                      SizedBox(height: 10),
                      Icon(
                        Icons.play_arrow,
                        size: 40,
                        color: Colors.white,
                      )
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  @override
  void dispose() {
    flutterTts.stop();
    super.dispose();
  }
}
