import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import theme from "./color";

export default function App() {
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const [text, setText] = useState("")
  const [toDos, setToDos] = useState({});
  const onChangeText = (e) => {
    setText(e);
  }
  const addTodo = () => {
    if (text === "") {
      return;
    }

    const newTodos = {
      ...toDos,
      [Date.now()]: { text, work: working }
    };

    setToDos(newTodos);
    setText("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={working ? styles.btnTextActive : styles.btnText}>
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={!working ? styles.btnTextActive : styles.btnText}>
            travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          onSubmitEditing={addTodo}
          returnKeyType="done"
          onChangeText={onChangeText}
          style={styles.input}
          value={text}
          placeholder={working ? "Add to do" : "Where do you want to go?"}
        />
      </View>
      <ScrollView>
      {
        Object.keys(toDos).map(toDoKey => (
          <View style={styles.toDo} key={toDoKey}>
            {
              <Text style={styles.toDoText}>{toDos[toDoKey].text}</Text>
            }
          </View>
        ))
      }
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btnText: {
    fontSize: 38,
    fontWeight: "400",
    color: theme.grey,
  },
  btnTextActive: {
    fontSize: 38,
    fontWeight: "400",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500'
  }
});
