import TesteService from "src/service/TesteService";

export default class TesteController {
    testeService = new TesteService();

    teste = (req, reply) => {
        console.log("aq")
        this.testeService.me(req, reply);
    }
}
