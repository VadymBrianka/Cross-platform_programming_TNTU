import 'package:flutter/material.dart';

 

void main() {

  runApp(MyApp());

}

 

class MyApp extends StatelessWidget {

  @override

  Widget build(BuildContext context) {

    return MaterialApp(

      home: Scaffold(

        appBar: AppBar(title: Text('Форма введення даних')),

        body: InputForm(),

      ),

    );

  }

}

 

class InputForm extends StatefulWidget {

  @override

  _InputFormState createState() => _InputFormState();

}

 

class _InputFormState extends State<InputForm> {

  final TextEditingController _controller = TextEditingController();

  String _output = '';

 

  void _handleSubmit() {

    setState(() {

      _output = 'Ви ввели: ' + _controller.text;

    });

  }

 

  @override

  Widget build(BuildContext context) {

    return Padding(

      padding: const EdgeInsets.all(16.0),

      child: Column(

        children: [

          TextField(

            controller: _controller,

            decoration: InputDecoration(labelText: 'Введіть текст'),

          ),

          SizedBox(height: 10),

          ElevatedButton(

            onPressed: _handleSubmit,

            child: Text('Відправити'),

          ),

          SizedBox(height: 20),

          Text(_output, style: TextStyle(fontSize: 18)),

        ],

      ),

    );

  }

}