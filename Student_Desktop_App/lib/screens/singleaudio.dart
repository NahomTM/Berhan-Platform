import 'package:flutter/material.dart';
import 'package:just_audio/just_audio.dart';
import 'package:flutter/services.dart';

class AudioPlayerPage extends StatefulWidget {
  final String title;
  final String address;

  const AudioPlayerPage({Key? key, required this.title, required this.address})
      : super(key: key);

  @override
  _AudioPlayerPageState createState() => _AudioPlayerPageState();
}

class _AudioPlayerPageState extends State<AudioPlayerPage> {
  late AudioPlayer audioPlayer;
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    audioPlayer = AudioPlayer();
    _initializeAndPlay(widget.address);

    // Add a listener for keyboard events
    RawKeyboard.instance.addListener(_handleKey);
  }

  @override
  void dispose() {
    RawKeyboard.instance.removeListener(_handleKey);
    audioPlayer.dispose();
    super.dispose();
  }

  Future<void> _initializeAndPlay(String url) async {
    try {
      await audioPlayer.setUrl(url);
      audioPlayer.play();
      audioPlayer.playerStateStream.listen((playerState) {
        final isPlaying = playerState.playing;
        final processingState = playerState.processingState;
        if (processingState == ProcessingState.completed) {
          setState(() {
            _isPlaying = false;
          });
        } else {
          setState(() {
            _isPlaying = isPlaying;
          });
        }
      });
    } catch (e) {
      print("An error occurred while playing audio: $e");
    }
  }

  void _handleKey(RawKeyEvent event) {
    if (event is RawKeyDownEvent) {
      switch (event.logicalKey.keyId) {
        case 0x20:
          if (_isPlaying) {
            audioPlayer.pause();
          } else {
            audioPlayer.play();
          }
          break;
        case 0x67:
          // case 0x27:
          final newTime = (audioPlayer.position.inSeconds + 10)
              .clamp(0, audioPlayer.duration?.inSeconds ?? 0);
          audioPlayer.seek(Duration(seconds: newTime));
          break;
        case 0x66:
          // case 0x25:
          final newTime = (audioPlayer.position.inSeconds - 10)
              .clamp(0, audioPlayer.duration?.inSeconds ?? 0);
          audioPlayer.seek(Duration(seconds: newTime));
          break;
        case 0x68:
          // case 0x26:
          audioPlayer.setVolume((audioPlayer.volume + 0.1).clamp(0.0, 1.0));
          break;
        case 0x6A:
          // case 0x28:
          audioPlayer.setVolume((audioPlayer.volume - 0.1).clamp(0.0, 1.0));
          break;
        case 0x1B:
          () {
            Navigator.of(context).pop();
            print("It is printing");
          };

          // case 0x1B: // Esc

          break;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF121212),
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8.0),
              child: Image.network(
                // 'https://placehold.it/400x400',
                'https://www.trustedreviews.com/wp-content/uploads/sites/54/2018/09/Hi-res-Audio.jpg',
                width: 300,
                height: 300,
                fit: BoxFit.cover,
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                icon: Icon(Icons.skip_previous),
                onPressed: () {
                  final newTime = (audioPlayer.position.inSeconds - 10)
                      .clamp(0, audioPlayer.duration?.inSeconds ?? 0);
                  audioPlayer.seek(Duration(seconds: newTime));
                },
                color: Colors.white,
                iconSize: 48,
              ),
              IconButton(
                icon: Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
                onPressed: () {
                  if (_isPlaying) {
                    audioPlayer.pause();
                  } else {
                    audioPlayer.play();
                  }
                },
                color: Colors.white,
                iconSize: 48,
              ),
              IconButton(
                icon: Icon(Icons.skip_next),
                onPressed: () {
                  final newTime = (audioPlayer.position.inSeconds + 10)
                      .clamp(0, audioPlayer.duration?.inSeconds ?? 0);
                  audioPlayer.seek(Duration(seconds: newTime));
                },
                color: Colors.white,
                iconSize: 48,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
