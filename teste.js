const FlowService = require('./packages/shared/flow/service')
const { PBKDF2Hasher } =  require('./packages/server/palmares/authentication/hashers')
async function main() {
    /*const flowService = await FlowService.initialize()
    const result = await flowService.evaluate(`
{
    'result': {
        'taskID': 19299046; 
        'idUserFrom': 99075; 
        'userFromName': 'Gestão'; 
        'idUserTo': 99075; 
        'userToName': 'Gestão'; 
        'customerId': 0; 
        'customerDescription': ''; 
        'taskType': 83344; 
        'creationDate': '2022-03-18T14:18:56'; 
        'taskDate': '2022-03-18T18:00:00'; 
        'latitude': -23,5533909; 
        'longitude': -46,6542179; 
        'address': 'Rua Frei Caneca; 485; 96B'; 
        'orientation': "Gotta Catch 'Em All"; 
        'priority': 3; 
        'deliveredOnSmarthPhone': Falso; 
        'deliveredDate': '0001-01-01T00:00:00'; 
        'finished': Falso; 
        'report': ''; 
        'visualized': Falso; 
        'visualizedDate': ''; 
        'checkIn': Falso; 
        'checkInDate': ''; 
        'checkOut': Falso; 
        'checkOutDate': ''; 
        'checkinType': 1; 
        'keyWords': []; 
        'keyWordsDescriptions': []; 
        'inputedKm': 0,0; 
        'adoptedKm': 0,0; 
        'attachments': []; 
        'questionnaires': []; 
        'signatureUrl': ''; 
        'checkInDistance': 0; 
        'checkOutDistance': 0; 
        'sendSatisfactionSurvey': Falso; 
        'survey': 'https://app.auvo.com.br/pesquisasatisfacao/formulario/6d3bb169-7c53-497f-9560-46658ba733e6'; 
        'taskUrl': 'https://app.auvo.com.br/informacoes/tarefa/6d3bb169-7c53-497f-9560-46658ba733e6?chave=k7Pxr-hi19yOGnhIKEwjXg'; 
        'pendency': ''; 
        'equipmentsId': []; 
        'dateLastUpdate': '2022-03-18T14:18:56'; 
        'ticketId': 0; 
        'expense': '0,00'; 
        'duration': ''; 
        'durationDecimal': ''; 
        'taskStatus': 1
    }
}
`
    )
    console.log(await(await result._string_())._representation_())*/
    const hasher = new PBKDF2Hasher()
    console.log(hasher.encode('93aT@csd71'))
}

main()
//async function main() {
//    const q = await question('Digite a expressão: ')
//}
//main()