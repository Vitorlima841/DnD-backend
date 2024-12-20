// import {Cliente} from '../models/entity/cliente';
// import {QueryUtils} from "../utils/queryUtils";
// import {ClienteVO} from "../models/entity/clienteVO";
//
// export default class ClienteRepository {
//     buscarEmpresas = async () => {
//         return await Cliente.createQueryBuilder('cliente')
//             .where({registroExcluido: false})
//             .orderBy('cliente.cnpj')
//             .groupBy('cliente.cnpj, cliente.nomeEmpresa')
//             .select('cliente.nomeEmpresa as "nome", cliente.cnpj as "id"')
//             .getRawMany();
//     };
//
//     buscarNomeId = async () => {
//         return await Cliente.createQueryBuilder('cliente')
//             .where({registroExcluido: false})
//             .orderBy('LOWER(cliente.nomeEmpresa)')
//             .groupBy('cliente.id, cliente.nomeEmpresa')
//             .select('cliente.nomeEmpresa as "nome", cliente.id as "id"')
//             .getRawMany();
//     };
//
//     buscarPaginado = async (req) => {
//         const nome = req.body.nome;
//         const situacao = req.body.situacao;
//         const paginacao = req.query; //params (page, sort, sortField e size)
//
//         const pRegistro = 0;
//         const queryUtils = new QueryUtils();
//
//         const builder = queryUtils
//             .addSelect(`
//                 DISTINCT "empresa"."id_cliente" as "id",
//                 "empresa"."nm_empresa" as "nome",
//                 "empresa"."nr_cnpj" as "cnpj",
//                 "empresa"."st_registro_ativo" as "situacao",
//                 "empresa"."st_registro_ativo" as "ativo"
//                 `)
//             .addFrom('"tb_cliente" "empresa"')
//             .addWhere('"empresa"."st_registro_excluido" = :pRegistro', pRegistro);
//         if (nome) {
//             builder.addWhere(` UPPER("empresa"."nm_empresa") LIKE UPPER(:campo)`, `%${nome}%`)
//         }
//         if (situacao !== null && situacao !== undefined) {
//             builder.addWhere('"empresa"."st_registro_ativo" = :situacao', Number(situacao));
//         }
//         builder.addOrder(' ORDER BY UPPER("empresa"."nm_empresa")');
//         return await Cliente.findPaginate(builder.rawQuery(), queryUtils.getParameters(), paginacao.page, paginacao.size);
//     }
//
//     buscarTodas = async (usuarioId?) => {
//         const builder = Cliente.createQueryBuilder('cliente')
//             .where({
//                 registroExcluido: false,
//                 registroAtivo: true
//             })
//
//         if (usuarioId) {
//             builder.leftJoin('cliente.contratos', 'contrato');
//             builder.leftJoin('contrato.usuarios', 'usuario');
//             builder.andWhere('usuario.id = :usuarioId', { usuarioId });
//         }
//
//         return await builder.orderBy('cliente.nomeEmpresa')
//             .select('cliente.nomeEmpresa as "nome", cliente.id as "id", cliente.cnpj as "cnpj"')
//             .getRawMany();
//     };
//
//     buscarPorCnpj = async (cnpj: string, idParaIgnorar?: number) => {
//         const builder = Cliente.createQueryBuilder('cliente')
//             .where('cliente.cnpj = :cnpj', { cnpj });
//
//         if (idParaIgnorar) {
//             builder.andWhere('cliente.id != :idParaIgnorar', { idParaIgnorar });
//         }
//
//         return await builder.getOne();
//     }
//
//     buscarPorId = async (id: number) => {
//         const pRegistro = 0;
//
//         return await Cliente.createQueryBuilder('cliente')
//             .where('cliente.id = :id', {id})
//             .andWhere('cliente.registroExcluido = :pRegistro', {pRegistro})
//             .getOne()
//     }
//
//     buscarEmpresasPorIds = async (empresasIds: number[]) => {
//         const pRegistro = 0;
//
//         return await ClienteVO.createQueryBuilder('cliente')
//             .where('cliente.id in (:...empresasIds)', {empresasIds: empresasIds})
//             .andWhere('cliente.registroExcluido = :pRegistro', {pRegistro})
//             .getMany()
//     }
//
//     buscarEmpresasPorUsuarioAdministrativoId = async (usuarioId: number) => {
//         const pRegistro = 0;
//         const pAtivo = 1;
//
//         return await Cliente.createQueryBuilder('cliente')
//             .innerJoin('cliente.usuariosAdministrativos', 'usuario')
//             .andWhere('usuario.id = :usuarioId', { usuarioId })
//             .andWhere('cliente.registroExcluido = :pRegistro', { pRegistro })
//             .andWhere('cliente.registroAtivo = :pAtivo', {pAtivo})
//             .select('cliente.nomeEmpresa as "nome", cliente.id as "id", cliente.cnpj as "cnpj"')
//             .orderBy('cliente.nomeEmpresa')
//             .getRawMany();
//     }
//
//
//
//     buscarPorDominio = async (dominio: string) => {
//         const pRegistroExcluido = 0;
//         const pRegistroAtivo = 1;
//
//         return await ClienteVO.createQueryBuilder('cliente')
//             .where('cliente.dominio = :dominio', {dominio})
//             .andWhere('cliente.registroExcluido = :pRegistroExcluido', {pRegistroExcluido})
//             .andWhere('cliente.registroAtivo = :pRegistroAtivo', {pRegistroAtivo})
//             .getOne()
//     }
//
//     buscarPorIdParaEditar = async (id: number) => {
//         return await ClienteVO.createQueryBuilder('cliente')
//             .leftJoin('cliente.perfilPadrao', 'perfilPadrao')
//             .leftJoin('cliente.contratoPadrao', 'contratoPadrao')
//             .where('cliente.id = :id', {id})
//             .select(`cliente.id as "id",
//             cliente.nomeEmpresa as "nomeEmpresa",
//             cliente.cnpj as "cnpj",
//             cliente.registroAtivo as "situacao",
//             cliente.dominio as "dominio",
//             contratoPadrao.id as "contratoId",
//             perfilPadrao.id as "perfilId"`)
//             .getRawOne()
//     }
//
//     buscarEmpresaPorDominio = async (dominio) => {
//         return await Cliente.createQueryBuilder('cliente')
//             .where({registroExcluido: false})
//             .andWhere('cliente.dominio = :dominio', {dominio})
//             .getOne();
//     }
//
//     buscarEmpresaPorDominioAndIdNot = async (dominio: string, id: number) => {
//         return await Cliente.createQueryBuilder('cliente')
//             .where({registroExcluido: false})
//             .andWhere('cliente.dominio = :dominio', {dominio})
//             .andWhere('cliente.id != :id', {id})
//             .getOne()
//     }
// }
