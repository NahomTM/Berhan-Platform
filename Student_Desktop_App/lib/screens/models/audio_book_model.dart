import 'dart:convert';

// ignore_for_file: public_member_api_docs, sort_constructors_first
class AudioBookModel {
  final String title;
  final String address;
  AudioBookModel({
    required this.title,
    required this.address,
  });

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'title': title,
      'address': address,
    };
  }

  factory AudioBookModel.fromMap(Map<String, dynamic> map) {
    return AudioBookModel(
      title: map['title'] as String,
      address: map['address'] as String,
    );
  }

  String toJson() => json.encode(toMap());

  factory AudioBookModel.fromJson(String source) =>
      AudioBookModel.fromMap(json.decode(source) as Map<String, dynamic>);
}
