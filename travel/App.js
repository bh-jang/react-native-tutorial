import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import theme from "./color";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const onChangeText = (e) => {
    setText(e);
  };
  const loadTodos = async () => {
    try {
      const toDos = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(toDos ? JSON.parse(toDos) : null);
    } catch (e) {
      console.log(e);
    }
  };
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.log(e);
    }
  };
  const addTodo = async () => {
    if (text === "") {
      return;
    }

    const newTodos = {
      ...toDos,
      [Date.now()]: { text, working },
    };
    await saveToDos(newTodos);
    setToDos(newTodos);
    setText("");
  };

  const deleteTodo = (id) => {
    Alert.alert("삭제", "진짜 지울거야?", [
      { text: "Cancel" },
      {
        text: "Yes",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[id];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  useEffect(() => {
    loadTodos();
  }, []);

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
        {Object.keys(toDos).map((toDoKey) =>
          toDos[toDoKey].working === working ? (
            <View style={styles.toDo} key={toDoKey}>
              <Text style={styles.toDoText}>{toDos[toDoKey].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(toDoKey)}>
                <Text>
                  <Fontisto name="trash" size={20} color="#eee" />
                </Text>
              </TouchableOpacity>
            </View>
          ) : null
        )}
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
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
