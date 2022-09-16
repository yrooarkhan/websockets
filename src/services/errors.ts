const ERRO_ESTABELECIMENTO_DE_CONEXAO: string =
  'O cliente tentou estabelecer conexão com o servidor, porém falhou.';
  
const ERRO_ENVIO_MENSAGEM_PARA_DEMAIS_SALAS: string =
  'Falha ao replicar a mensagem para demais clientes.';

const ERRO_REMOCAO_USUARIO_SALA: string =
  'O cliente desconectou da sala, porém o servidor falhou ao tentar removê-lo da lista de usuários conectados.';

export {
  ERRO_ESTABELECIMENTO_DE_CONEXAO,
  ERRO_ENVIO_MENSAGEM_PARA_DEMAIS_SALAS,
  ERRO_REMOCAO_USUARIO_SALA,
};
