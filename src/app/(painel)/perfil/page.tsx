import { 
  View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, FlatList 
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/src/app/lib/supabase';
import { useAuth } from '@/src/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/constants/colors';

export async function SalvarTarefa(
  nome: string,
  descricao: string,
  data_conclusao: string,
  user_id: string
) {
  if (!nome || !data_conclusao) {
    Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const novaTarefa = {
    nome,
    descricao,
    data_inicio: new Date().toISOString().split('T')[0],
    data_conclusao,
    user_id,
  };

  const { error } = await supabase.from('tarefas').insert([novaTarefa]);

  if (error) {
    Alert.alert('Erro ao salvar tarefa', error.message);
    return false;
  } else {
    Alert.alert('Sucesso', 'Tarefa salva com sucesso!');
    return true;
  }
}

export default function Perfil() {
  const { setUser, user } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');

  const [tarefas, setTarefas] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  async function EncerrarSessao() {
    setMenuVisible(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Erro ao encerrar sessão', error.message);
      return;
    }
    setUser(null);
    router.replace('/(auth)/login/page');
  }

  // Função para buscar tarefas do usuário logado
  async function carregarTarefas() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', user.id)
      .order('data_conclusao', { ascending: true });

    if (error) {
      Alert.alert('Erro ao carregar tarefas', error.message);
    } else {
      setTarefas(data || []);
    }
    setLoading(false);
  }

  // Busca tarefas ao carregar o componente e quando o usuário mudar
  useEffect(() => {
    carregarTarefas();
  }, [user]);

  async function handleSalvar() {
    if (!user) return;
    const sucesso = await SalvarTarefa(nome, descricao, dataConclusao, user.id);
    if (sucesso) {
      setFormVisible(false);
      setNome('');
      setDescricao('');
      setDataConclusao('');
      carregarTarefas(); // Atualiza lista após salvar
    }
  }

  // Render para cada item da lista de tarefas
  function renderTarefa({ item }: { item: any }) {
    return (
      <View style={styles.tarefaItem}>
        <Text style={styles.tarefaNome}>{item.nome}</Text>
        {item.descricao ? <Text style={styles.tarefaDescricao}>{item.descricao}</Text> : null}
        <Text style={styles.tarefaData}>Prazo: {item.data_conclusao}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Botão Perfil */}
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.dropdownButton}>
        <Text style={styles.dropdownBotaoTexto}>
          <Ionicons name="person-outline" size={24} color={colors.white} /> Perfil
        </Text>
      </TouchableOpacity>

      {/* Modal de Sessão */}
      <Modal transparent visible={menuVisible} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity onPress={EncerrarSessao} style={styles.menuItem}>
              <Text style={styles.menuTexto}>Encerrar Sessão</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Lista de tarefas do usuário */}
      <View style={styles.tarefasContainer}>
        <Text style={styles.tarefasTitulo}>Minhas Tarefas</Text>
        {loading ? (
          <Text>Carregando...</Text>
        ) : tarefas.length === 0 ? (
          <Text>Nenhuma tarefa encontrada.</Text>
        ) : (
          <FlatList
            data={tarefas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderTarefa}
            style={{ width: '100%' }}
          />
        )}
      </View>

      {/* Botão de Adicionar */}
      <View style={styles.botaoAdd}>
        <TouchableOpacity onPress={() => setFormVisible(true)}>
          <Ionicons name="add-circle-outline" size={30} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Modal do Formulário */}
      <Modal visible={formVisible} animationType="slide" transparent>
        <View style={styles.formContainer}>
          <View style={styles.formBox}>
            <Text style={styles.label}>Nome da Tarefa *</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a descrição"
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={styles.label}>Data de Conclusão *</Text>
            <TextInput
              style={styles.input}
              placeholder="AAAA-MM-DD"
              value={dataConclusao}
              onChangeText={setDataConclusao}
            />

            <View style={styles.formActions}>
              <TouchableOpacity onPress={() => setFormVisible(false)}>
                <Text style={styles.cancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSalvar}>
                <Text style={styles.salvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  dropdownButton: {
    backgroundColor: colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  dropdownBotaoTexto: {
    color: colors.white,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownMenu: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuTexto: {
    fontSize: 16,
    color: colors.blue,
  },
  botaoAdd: {
    position: 'absolute',
    bottom: 15,
    right: 20,
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  formBox: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    marginBottom: 10,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelar: {
    color: colors.blue,
    fontWeight: 'bold',
  },
  salvar: {
    color: colors.green,
    fontWeight: 'bold',
  },
  tarefasContainer: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 10,
  },
  tarefasTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tarefaItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  tarefaNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tarefaDescricao: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  tarefaData: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
});
