import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../../constants/Colors';


export async function SalvarTarefa(
  nome: string,
  descricao: string,
  user_id: string
) {
  if (!nome) {
    Alert.alert('Erro', 'Por favor, preencha o nome da tarefa.');
    return false;
  }

  const novaTarefa = {
    nome,
    descricao,
    data_inicio: new Date().toISOString().split('T')[0],
    status: 'pendente',
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
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

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

  async function carregarTarefas() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', user.id)
      .order('data_inicio', { ascending: true });

    if (error) {
      Alert.alert('Erro ao carregar tarefas', error.message);
    } else {
      setTarefas(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    carregarTarefas();
  }, [user]);

  async function handleSalvar() {
    if (!user) return;

    if (editando && idEditando !== null) {
      const { error } = await supabase
        .from('tarefas')
        .update({ nome, descricao })
        .eq('id', idEditando);

      if (error) {
        Alert.alert('Erro ao atualizar tarefa', error.message);
        return;
      }

      Alert.alert('Sucesso', 'Tarefa atualizada com sucesso!');
    } else {
      const sucesso = await SalvarTarefa(nome, descricao, user.id);
      if (!sucesso) return;
    }

    setFormVisible(false);
    setNome('');
    setDescricao('');
    setEditando(false);
    setIdEditando(null);
    carregarTarefas();
  }

  async function excluirTarefa(id: number) {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('tarefas').delete().eq('id', id);
          if (error) {
            Alert.alert('Erro ao excluir tarefa', error.message);
          } else {
            carregarTarefas();
          }
        },
      },
    ]);
  }

  function editarTarefa(tarefa: any) {
    setNome(tarefa.nome);
    setDescricao(tarefa.descricao);
    setIdEditando(tarefa.id);
    setEditando(true);
    setFormVisible(true);
  }

  async function marcarComoConcluida(id: number) {
    const dataConclusao = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('tarefas')
      .update({ status: 'concluido', data_conclusao: dataConclusao })
      .eq('id', id);

    if (error) {
      Alert.alert('Erro ao concluir tarefa', error.message);
    } else {
      carregarTarefas();
    }
  }

  function renderTarefa({ item }: { item: any }) {
    return (
      <View style={styles.tarefaItem}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              styles.tarefaNome,
              item.status === 'concluido' ? { textDecorationLine: 'line-through', color: '#999' } : {},
            ]}
          >
            {item.nome}
          </Text>

          {item.status === 'pendente' ? (
            <TouchableOpacity onPress={() => marcarComoConcluida(item.id)} style={styles.botaoConcluir}>
              <Text style={styles.textoBotaoConcluir}>Concluir</Text>
            </TouchableOpacity>
          ) : (
            <Ionicons name="checkmark-done-outline" size={24} color={colors.green} />
          )}
        </View>

        {item.descricao ? (
          <Text
            style={[
              styles.tarefaDescricao,
              item.status === 'concluido' ? { textDecorationLine: 'line-through', color: '#999' } : {},
            ]}
          >
            {item.descricao}
          </Text>
        ) : null}
        <Text style={styles.tarefaData}>
          Data de início: {item.data_inicio ? item.data_inicio : 'Não definida'}
        </Text>
        {item.data_conclusao && (
          <Text style={styles.tarefaData}>
            Data de conclusão: {item.data_conclusao}
          </Text>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => editarTarefa(item)}>
            <Ionicons name="create-outline" size={20} color={colors.blue} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => excluirTarefa(item.id)} style={{ marginLeft: 15 }}>
            <Ionicons name="trash-outline" size={20} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.dropdownButton}>
        <Text style={styles.dropdownBotaoTexto}>
          <Ionicons name="person-outline" size={24} color={colors.white} /> Perfil
        </Text>
      </TouchableOpacity>

      <Modal transparent visible={menuVisible} animationType="fade">
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

      <View style={styles.tarefasContainer}>
        <Text style={styles.tarefasTitulo}>Minhas Tarefas</Text>
        {loading ? (
          <Text>Carregando...</Text>
        ) : tarefas.length === 0 ? (
          <Text>Nenhuma tarefa encontrada.</Text>
        ) : (
          <FlatList data={tarefas} keyExtractor={(item) => item.id.toString()} renderItem={renderTarefa} />
        )}
      </View>

      <View style={styles.botaoAdd}>
        <TouchableOpacity
          onPress={() => {
            setEditando(false);
            setNome('');
            setDescricao('');
            setFormVisible(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={30} color={colors.white} />
        </TouchableOpacity>
      </View>

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

            <View style={styles.formActions}>
              <TouchableOpacity onPress={() => setFormVisible(false)}>
                <Text style={styles.cancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSalvar}>
                <Text style={styles.salvar}>{editando ? 'Atualizar' : 'Salvar'}</Text>
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
      backgroundColor: colors.gray

   },
  dropdownButton: {
    backgroundColor: colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  dropdownBotaoTexto: { color: colors.white, fontSize: 16 },
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
  menuItem: { paddingVertical: 10 },
  menuTexto: { fontSize: 16, color: colors.blue },
  tarefasContainer: { marginTop: 20, width: '100%', paddingHorizontal: 10 },
  tarefasTitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  tarefaItem: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  tarefaNome: { fontSize: 16, fontWeight: 'bold' },
  tarefaDescricao: { fontSize: 14, color: '#555', marginTop: 5 },
  tarefaData: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 10,
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
  label: { fontWeight: 'bold', marginTop: 10 },
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
  cancelar: { color: colors.blue, fontWeight: 'bold' },
  salvar: { color: colors.green, fontWeight: 'bold' },
  botaoConcluir: {
    backgroundColor: colors.green,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textoBotaoConcluir: {
    color: colors.white,
    fontWeight: 'bold',
  },
  
});
